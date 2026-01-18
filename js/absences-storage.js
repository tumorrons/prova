/**
 * absences-storage.js - Persistenza assenze in localStorage
 *
 * Filosofia:
 * - Tutte le assenze in un unico array
 * - Indicizzazione per operatore e periodo per performance
 * - Validazione automatica al caricamento
 */

import { validaAssenza } from './absences-schema.js';

const STORAGE_KEY = 'absences';

/**
 * Carica tutte le assenze da localStorage
 *
 * @returns {Assenza[]}
 */
export function caricaAssenze() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    try {
        const assenze = JSON.parse(stored);

        // Valida ogni assenza e filtra quelle non valide
        return assenze.filter(assenza => {
            const { valida, errori } = validaAssenza(assenza);
            if (!valida) {
                console.warn('[ABSENCES] Assenza non valida ignorata:', errori, assenza);
            }
            return valida;
        });
    } catch (e) {
        console.error('[ABSENCES] Errore caricamento assenze:', e);
        return [];
    }
}

/**
 * Salva tutte le assenze in localStorage
 *
 * @param {Assenza[]} assenze
 */
export function salvaAssenze(assenze) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assenze));
    console.log(`[ABSENCES] Salvate ${assenze.length} assenze`);
}

/**
 * Aggiunge una nuova assenza
 *
 * @param {Assenza} assenza
 * @returns {Assenza} - L'assenza aggiunta (con ID)
 */
export function aggiungiAssenza(assenza) {
    // Valida prima di aggiungere
    const { valida, errori } = validaAssenza(assenza);
    if (!valida) {
        throw new Error(`Assenza non valida: ${errori.join(', ')}`);
    }

    const assenze = caricaAssenze();
    assenze.push(assenza);
    salvaAssenze(assenze);

    console.log('[ABSENCES] Aggiunta assenza:', assenza.id);
    return assenza;
}

/**
 * Rimuove un'assenza per ID
 *
 * @param {string} id
 * @returns {boolean} - True se rimossa, false se non trovata
 */
export function rimuoviAssenza(id) {
    const assenze = caricaAssenze();
    const before = assenze.length;
    const filtered = assenze.filter(a => a.id !== id);

    if (filtered.length === before) {
        console.warn('[ABSENCES] Assenza non trovata:', id);
        return false;
    }

    salvaAssenze(filtered);
    console.log('[ABSENCES] Rimossa assenza:', id);
    return true;
}

/**
 * Aggiorna un'assenza esistente
 *
 * @param {string} id
 * @param {Partial<Assenza>} updates
 * @returns {Assenza|null} - Assenza aggiornata o null se non trovata
 */
export function aggiornaAssenza(id, updates) {
    const assenze = caricaAssenze();
    const index = assenze.findIndex(a => a.id === id);

    if (index === -1) {
        console.warn('[ABSENCES] Assenza non trovata per aggiornamento:', id);
        return null;
    }

    // Applica updates
    const assenzaAggiornata = { ...assenze[index], ...updates };

    // Valida
    const { valida, errori } = validaAssenza(assenzaAggiornata);
    if (!valida) {
        throw new Error(`Assenza aggiornata non valida: ${errori.join(', ')}`);
    }

    assenze[index] = assenzaAggiornata;
    salvaAssenze(assenze);

    console.log('[ABSENCES] Aggiornata assenza:', id);
    return assenzaAggiornata;
}

/**
 * Ottiene tutte le assenze per un operatore
 *
 * @param {string} operatoreId
 * @returns {Assenza[]}
 */
export function assenzePerOperatore(operatoreId) {
    const assenze = caricaAssenze();
    return assenze.filter(a => a.operatore === operatoreId);
}

/**
 * Ottiene tutte le assenze in un periodo (anno/mese)
 *
 * @param {number} anno
 * @param {number} mese - 0-11 (formato JavaScript)
 * @returns {Assenza[]}
 */
export function assenzePerPeriodo(anno, mese) {
    const assenze = caricaAssenze();

    // Costruisci range del mese
    const meseStr = String(mese + 1).padStart(2, '0');
    const inizioMese = `${anno}-${meseStr}-01`;

    // Ultimo giorno del mese
    const ultimoGiorno = new Date(anno, mese + 1, 0).getDate();
    const fineMese = `${anno}-${meseStr}-${String(ultimoGiorno).padStart(2, '0')}`;

    // Filtra assenze che si sovrappongono al mese
    return assenze.filter(a => {
        // Assenza inizia prima della fine del mese E finisce dopo l'inizio del mese
        return a.dataInizio <= fineMese && a.dataFine >= inizioMese;
    });
}

/**
 * Ottiene tutte le assenze per un operatore in una data specifica
 *
 * @param {string} operatoreId
 * @param {string} data - Formato YYYY-MM-DD
 * @returns {Assenza[]}
 */
export function assenzePerOperatoreEData(operatoreId, data) {
    const assenze = caricaAssenze();
    return assenze.filter(a => {
        return a.operatore === operatoreId &&
               data >= a.dataInizio &&
               data <= a.dataFine;
    });
}

/**
 * Verifica se ci sono conflitti con assenze esistenti
 *
 * @param {string} operatoreId
 * @param {string} dataInizio
 * @param {string} dataFine
 * @param {string} excludeId - ID assenza da escludere (per aggiornamenti)
 * @returns {Assenza[]} - Assenze in conflitto
 */
export function verificaConflitti(operatoreId, dataInizio, dataFine, excludeId = null) {
    const assenze = caricaAssenze();

    return assenze.filter(a => {
        // Escludi l'assenza specificata (per update)
        if (excludeId && a.id === excludeId) return false;

        // Solo stesso operatore
        if (a.operatore !== operatoreId) return false;

        // Verifica sovrapposizione
        return !(a.dataFine < dataInizio || a.dataInizio > dataFine);
    });
}

/**
 * Elimina tutte le assenze (ATTENZIONE: non reversibile)
 * Usare solo per reset completo o test
 */
export function eliminaTutteLeAssenze() {
    localStorage.removeItem(STORAGE_KEY);
    console.warn('[ABSENCES] Tutte le assenze sono state eliminate');
}
