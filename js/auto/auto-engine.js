/**
 * auto-engine.js
 * Engine principale per la generazione automatica turni
 *
 * Filosofia:
 * - Iterativo: analizza giorno per giorno
 * - Greedy intelligente: sceglie sempre il migliore disponibile
 * - Non distruttivo: rispetta turni esistenti se richiesto
 */

import { nuovaBozza, nuovoTurnoGenerato } from './auto-schema.js';
import { calcolaScoreOperatore, filtraOperatoriValidi } from './auto-scoring.js';
import { getState } from '../state.js';
import { caricaTurno } from '../storage.js';
import { valutaCopertura } from '../coverage.js';

/**
 * Genera una bozza completa di turni per un mese
 *
 * @param {number} mese - Mese (0-11)
 * @param {number} anno - Anno
 * @param {Object} parametri - Parametri generazione
 * @param {boolean} parametri.soloGiorniVuoti - Genera solo dove non ci sono turni
 * @param {boolean} parametri.rigeneraTutto - Sovrascrivi tutto (richiede conferma UI)
 * @param {string|null} parametri.ambulatorioFiltro - Genera solo per questo ambulatorio
 * @param {boolean} parametri.usaCopertura - Rispetta regole copertura
 * @param {boolean} parametri.usaVincoli - Rispetta vincoli operatore
 * @param {boolean} parametri.usaPreferenze - Rispetta preferenze operatore
 * @returns {Object} - GeneratedDraft completo
 */
export function generaBozza(mese, anno, parametri = {}) {
    console.log(`[AUTO-ENGINE] Inizio generazione bozza: ${anno}-${mese + 1}`, parametri);

    const bozza = nuovaBozza(mese, anno, parametri);
    const { operatori, turni, ambulatori } = getState();

    // Calcola quanti giorni ha il mese
    const giorniMese = new Date(anno, mese + 1, 0).getDate();

    // Itera su ogni giorno del mese
    for (let giorno = 1; giorno <= giorniMese; giorno++) {
        console.log(`[AUTO-ENGINE] Analisi giorno ${giorno}/${giorniMese}`);

        // 1. Identifica quali turni servono questo giorno (da regole copertura)
        const turniNecessari = identificaTurniNecessari(giorno, mese, anno, parametri, ambulatori, turni);

        // 2. Per ogni turno necessario, trova il miglior operatore
        for (const slot of turniNecessari) {
            const { ambulatorio, codiceTurno, motivazione } = slot;

            console.log(`[AUTO-ENGINE]   Slot: ${ambulatorio} ${codiceTurno} (${motivazione})`);

            // 2a. Controlla se già assegnato (se soloGiorniVuoti = true)
            if (parametri.soloGiorniVuoti && !parametri.rigeneraTutto) {
                const giaAssegnato = operatori.some(op =>
                    caricaTurno(op, giorno, anno, mese) === `${ambulatorio}_${codiceTurno}`
                );

                if (giaAssegnato) {
                    console.log(`[AUTO-ENGINE]   ⏭️  Già assegnato, skip`);
                    continue;
                }
            }

            // 2b. Trova miglior operatore per questo slot
            const risultato = trovaMiglioreOperatore(
                operatori,
                giorno,
                mese,
                anno,
                codiceTurno,
                ambulatorio,
                parametri
            );

            if (risultato) {
                const { profilo, totale, breakdown, motivazioni, confidenza } = risultato;

                // 2c. Aggiungi turno alla bozza
                const turnoGenerato = nuovoTurnoGenerato(
                    giorno,
                    codiceTurno,
                    ambulatorio,
                    profilo.id,
                    confidenza,
                    motivazioni,
                    breakdown
                );

                bozza.turni.push(turnoGenerato);
                bozza.metadata.statistiche.turniGenerati++;

                console.log(`[AUTO-ENGINE]   ✅ Assegnato a ${profilo.anagrafica.nome} (score: ${totale}, confidenza: ${(confidenza * 100).toFixed(0)}%)`);
            } else {
                // Nessun operatore disponibile
                bozza.metadata.statistiche.slotVuoti++;
                console.log(`[AUTO-ENGINE]   ❌ Nessun operatore disponibile`);
            }
        }
    }

    console.log(`[AUTO-ENGINE] Generazione completata:`, bozza.metadata.statistiche);
    return bozza;
}

/**
 * Identifica quali turni servono per un dato giorno
 * Basato su regole di copertura
 *
 * @param {number} giorno
 * @param {number} mese
 * @param {number} anno
 * @param {Object} parametri
 * @param {Object} ambulatori
 * @param {Object} turni
 * @returns {Array} - Array di { ambulatorio, codiceTurno, motivazione }
 */
function identificaTurniNecessari(giorno, mese, anno, parametri, ambulatori, turni) {
    const slots = [];

    // Se parametri.usaCopertura è false, ritorna array vuoto
    // (in futuro potremmo avere altre logiche per determinare i turni necessari)
    if (!parametri.usaCopertura) {
        return slots;
    }

    // Usa le regole di copertura esistenti
    const data = new Date(anno, mese, giorno);
    const giornoSettimana = data.getDay(); // 0=dom, 1=lun, etc.

    // Evalua copertura per questo giorno
    const risultatiCopertura = valutaCopertura(anno, mese, giorno);

    // Per ogni ambulatorio, cerca turni mancanti
    Object.keys(ambulatori).forEach(ambCodice => {
        // Filtra risultati per questo ambulatorio
        const mancanze = risultatiCopertura.filter(r =>
            r.ambulatorio === ambCodice &&
            r.tipo === 'turnoMancante' &&
            r.giorno === giorno
        );

        mancanze.forEach(mancanza => {
            // Filtro per ambulatorio se specificato
            if (parametri.ambulatorioFiltro && parametri.ambulatorioFiltro !== ambCodice) {
                return;
            }

            slots.push({
                ambulatorio: ambCodice,
                codiceTurno: mancanza.turno,
                motivazione: mancanza.messaggio || `Richiesto da regola copertura`
            });
        });
    });

    return slots;
}

/**
 * Trova il miglior operatore per uno slot specifico
 *
 * @param {Object[]} operatori - Array profili operatori
 * @param {number} giorno
 * @param {number} mese
 * @param {number} anno
 * @param {string} codiceTurno
 * @param {string} ambulatorio
 * @param {Object} parametri
 * @returns {Object|null} - { profilo, totale, breakdown, motivazioni, confidenza } o null
 */
function trovaMiglioreOperatore(operatori, giorno, mese, anno, codiceTurno, ambulatorio, parametri) {
    // 1. Filtra operatori validi (non inattivi, non assenti, etc.)
    const operatoriValidi = filtraOperatoriValidi(operatori, giorno, codiceTurno, ambulatorio, {});

    if (operatoriValidi.length === 0) {
        return null;
    }

    // 2. Calcola score per ogni operatore
    const scored = operatoriValidi.map(profilo => {
        // Costruisci context (qui semplificato, in futuro potrebbe includere calcoli complessi)
        const context = costruisciContext(profilo, giorno, mese, anno, codiceTurno, ambulatorio);

        // Calcola score
        const result = calcolaScoreOperatore(profilo, giorno, codiceTurno, ambulatorio, context);

        return {
            profilo,
            ...result
        };
    });

    // 3. Ordina per score decrescente
    scored.sort((a, b) => b.totale - a.totale);

    // 4. Prendi il migliore
    const migliore = scored[0];

    // Se tutti hanno score negativo molto basso, potremmo decidere di non assegnare nessuno
    // (questo dipende dalla politica: meglio un turno con warning o lasciarlo vuoto?)
    // Per ora: assegna sempre il migliore disponibile
    return migliore;
}

/**
 * Costruisce il context completo per un operatore in un giorno specifico
 * Include calcoli di ore settimanali, giorni consecutivi, riposo, etc.
 *
 * @param {Object} profilo
 * @param {number} giorno
 * @param {number} mese
 * @param {number} anno
 * @param {string} codiceTurno
 * @param {string} ambulatorio
 * @returns {Object} - Context completo per valutazione regole
 */
function costruisciContext(profilo, giorno, mese, anno, codiceTurno, ambulatorio) {
    const { turni } = getState();
    const data = new Date(anno, mese, giorno);

    // Context base
    const context = {
        giorno,
        mese,
        anno,
        giornoSettimana: data.getDay(),
        turno: {
            codice: codiceTurno,
            ambulatorio: ambulatorio,
            ...(turni[codiceTurno] || {})
        }
    };

    // TODO: Calcolare campi avanzati (richiede scan dei turni assegnati)
    // - oreSettimana: somma ore nei 7 giorni precedenti
    // - giorniConsecutivi: conta giorni di fila con turni
    // - riposoOre: ore dall'ultimo turno
    // - turniNelMese: conta turni questo mese
    // - turniSettimana: conta turni questa settimana

    // Per ora: valori placeholder (verranno implementati in iterazione successiva)
    context.oreSettimana = 0;
    context.giorniConsecutivi = 0;
    context.riposoOre = 24;
    context.turniNelMese = 0;
    context.turniSettimana = 0;

    return context;
}
