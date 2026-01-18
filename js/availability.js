/**
 * availability.js - Logica centrale disponibilità operatori
 *
 * PRINCIPIO FONDAMENTALE:
 * Questa è l'UNICA funzione che decide se un operatore può lavorare in una data.
 * Tutto il sistema (generazione auto, validazione, UI) deve passare da qui.
 *
 * Filosofia:
 * - Le assenze HARD bloccano completamente
 * - Le assenze SOFT danno solo una penalità
 * - Nessuna assenza = disponibile al 100%
 */

import { assenzePerOperatoreEData } from './absences-storage.js';
import { dataToString } from './absences-schema.js';

/**
 * Risultato valutazione disponibilità
 *
 * @typedef {Object} RisultatoDisponibilita
 * @property {boolean} disponibile - Se l'operatore può essere assegnato
 * @property {string} motivo - Motivo se non disponibile
 * @property {number} penalita - Penalità da applicare allo score (0 se nessuna)
 * @property {Assenza[]} assenze - Assenze che influenzano questa data
 * @property {boolean} soft - True se la limitazione è soft (può essere forzata)
 */

/**
 * Verifica se un operatore è disponibile per una data specifica
 *
 * QUESTA È LA FUNZIONE CENTRALE DEL SISTEMA
 *
 * @param {string|Object} operatore - ID operatore o oggetto profilo
 * @param {number} anno
 * @param {number} mese - 0-11 (formato JavaScript)
 * @param {number} giorno
 * @returns {RisultatoDisponibilita}
 */
export function operatoreDisponibile(operatore, anno, mese, giorno) {
    // Normalizza ID operatore
    const operatoreId = typeof operatore === 'string' ? operatore : operatore.id;

    // Converti data in formato YYYY-MM-DD
    const dataStr = dataToString(anno, mese, giorno);

    // Carica assenze per questo operatore in questa data
    const assenze = assenzePerOperatoreEData(operatoreId, dataStr);

    // Nessuna assenza = disponibile al 100%
    if (assenze.length === 0) {
        return {
            disponibile: true,
            motivo: '',
            penalita: 0,
            assenze: [],
            soft: false
        };
    }

    // Ordina assenze per priorità (più alta prima)
    assenze.sort((a, b) => b.priorita - a.priorita);

    // Prendi l'assenza con priorità più alta
    const assenzaPrincipale = assenze[0];

    // Se l'assenza BLOCCA e NON è SOFT → NON disponibile
    if (assenzaPrincipale.bloccaTurni && !assenzaPrincipale.soft) {
        return {
            disponibile: false,
            motivo: `${assenzaPrincipale.icona} ${assenzaPrincipale.tipo} (${assenzaPrincipale.dataInizio} - ${assenzaPrincipale.dataFine})`,
            penalita: 0,  // Nessuna penalità perché è bloccato
            assenze: assenze,
            soft: false
        };
    }

    // Se è SOFT → disponibile ma con penalità
    if (assenzaPrincipale.soft) {
        const penalita = calcolaPenalitaSoft(assenzaPrincipale);
        return {
            disponibile: true,
            motivo: `${assenzaPrincipale.icona} ${assenzaPrincipale.tipo} (preferenza)`,
            penalita: penalita,
            assenze: assenze,
            soft: true
        };
    }

    // Fallback: se non blocca, è disponibile
    return {
        disponibile: true,
        motivo: '',
        penalita: 0,
        assenze: assenze,
        soft: false
    };
}

/**
 * Calcola la penalità per un'assenza soft
 *
 * @param {Assenza} assenza
 * @returns {number} - Penalità da sottrarre allo score
 */
function calcolaPenalitaSoft(assenza) {
    // Mappa tipo → penalità
    const penalitaBase = {
        'GIORNO_LIBERO': 5,
        'PERMESSO_PERSONALE': 3,
        'default': 2
    };

    return penalitaBase[assenza.tipo] || penalitaBase.default;
}

/**
 * Verifica disponibilità per un range di date
 *
 * @param {string|Object} operatore
 * @param {number} anno
 * @param {number} mese
 * @param {number[]} giorni - Array di giorni da verificare
 * @returns {Map<number, RisultatoDisponibilita>} - Mappa giorno → risultato
 */
export function verificaDisponibilitaRange(operatore, anno, mese, giorni) {
    const risultati = new Map();

    giorni.forEach(giorno => {
        const risultato = operatoreDisponibile(operatore, anno, mese, giorno);
        risultati.set(giorno, risultato);
    });

    return risultati;
}

/**
 * Filtra operatori disponibili da una lista
 *
 * @param {Array} operatori - Lista operatori
 * @param {number} anno
 * @param {number} mese
 * @param {number} giorno
 * @returns {Array<{operatore: Object, disponibilita: RisultatoDisponibilita}>}
 */
export function filtraOperatoriDisponibili(operatori, anno, mese, giorno) {
    return operatori
        .map(op => ({
            operatore: op,
            disponibilita: operatoreDisponibile(op, anno, mese, giorno)
        }))
        .filter(({ disponibilita }) => disponibilita.disponibile);
}

/**
 * Ottiene statistiche assenze per un operatore in un mese
 *
 * @param {string|Object} operatore
 * @param {number} anno
 * @param {number} mese
 * @returns {Object} - Statistiche
 */
export function statisticheAssenzeMese(operatore, anno, mese) {
    const operatoreId = typeof operatore === 'string' ? operatore : operatore.id;

    // Numero giorni nel mese
    const giorniMese = new Date(anno, mese + 1, 0).getDate();

    let giorniBloccati = 0;
    let giorniSoft = 0;
    let assenzeMap = new Map();

    for (let giorno = 1; giorno <= giorniMese; giorno++) {
        const { disponibile, assenze, soft } = operatoreDisponibile(operatore, anno, mese, giorno);

        if (!disponibile) {
            giorniBloccati++;
            assenze.forEach(a => {
                if (!assenzeMap.has(a.id)) {
                    assenzeMap.set(a.id, a);
                }
            });
        } else if (soft) {
            giorniSoft++;
        }
    }

    return {
        giorniMese,
        giorniDisponibili: giorniMese - giorniBloccati,
        giorniBloccati,
        giorniSoft,
        numeroAssenze: assenzeMap.size,
        assenze: Array.from(assenzeMap.values())
    };
}

/**
 * Verifica se può essere assegnato un turno considerando le assenze
 * (wrapper user-friendly per operatoreDisponibile)
 *
 * @param {string|Object} operatore
 * @param {number} anno
 * @param {number} mese
 * @param {number} giorno
 * @returns {{puoAssegnare: boolean, messaggio: string}}
 */
export function puoAssegnareTurno(operatore, anno, mese, giorno) {
    const { disponibile, motivo, soft } = operatoreDisponibile(operatore, anno, mese, giorno);

    if (disponibile) {
        if (soft) {
            return {
                puoAssegnare: true,
                messaggio: `⚠️ Attenzione: ${motivo}`
            };
        }
        return {
            puoAssegnare: true,
            messaggio: ''
        };
    }

    return {
        puoAssegnare: false,
        messaggio: `❌ Non disponibile: ${motivo}`
    };
}
