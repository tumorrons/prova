/**
 * absences-schema.js - Schema e tipi per assenze/permessi/ferie
 *
 * Filosofia:
 * - Un'assenza NON è un turno
 * - Le assenze hanno priorità sui turni
 * - Le assenze possono essere soft (suggerimento) o hard (blocco)
 */

/**
 * Tipi di assenza standard
 * Ogni tipo ha proprietà predefinite ma può essere sovrascritto
 */
export const TipoAssenza = {
    FERIE: {
        id: 'FERIE',
        nome: 'Ferie',
        bloccaTurni: true,
        soft: false,
        priorita: 90,
        colore: '#4caf50',
        icona: '🏖️',
        descrizione: 'Ferie annuali'
    },
    LEGGE_104: {
        id: 'LEGGE_104',
        nome: 'Legge 104',
        bloccaTurni: true,
        soft: false,
        priorita: 100,
        colore: '#e91e63',
        icona: '👨‍👩‍👧',
        descrizione: 'Permesso Legge 104'
    },
    VISITA_MEDICA: {
        id: 'VISITA_MEDICA',
        nome: 'Visita Medica',
        bloccaTurni: true,
        soft: false,
        priorita: 80,
        colore: '#f44336',
        icona: '⚕️',
        descrizione: 'Visita medica o terapia'
    },
    PERMESSO_PERSONALE: {
        id: 'PERMESSO_PERSONALE',
        nome: 'Permesso Personale',
        bloccaTurni: true,
        soft: false,
        priorita: 60,
        colore: '#ff9800',
        icona: '📝',
        descrizione: 'Permesso personale'
    },
    GIORNO_LIBERO: {
        id: 'GIORNO_LIBERO',
        nome: 'Giorno Libero',
        bloccaTurni: true,
        soft: true,  // Può essere sovrascritto
        priorita: 50,
        colore: '#9e9e9e',
        icona: '🏠',
        descrizione: 'Giorno di riposo preferito'
    }
};

/**
 * Durate possibili per un'assenza
 */
export const DurataAssenza = {
    GIORNATA: 'giornata',      // Tutta la giornata
    MEZZA: 'mezza',            // Mezza giornata (mattina o pomeriggio)
    ORE: 'ore'                 // Numero specifico di ore
};

/**
 * Schema per una singola assenza
 *
 * @typedef {Object} Assenza
 * @property {string} id - UUID univoco
 * @property {string} tipo - Chiave da TipoAssenza
 * @property {string} operatore - ID operatore
 * @property {string} dataInizio - Formato YYYY-MM-DD
 * @property {string} dataFine - Formato YYYY-MM-DD (uguale a dataInizio per single-day)
 * @property {string} durata - Valore da DurataAssenza
 * @property {number|null} ore - Numero ore se durata === 'ore'
 * @property {boolean} bloccaTurni - Se true, impedisce assegnazione turni
 * @property {boolean} soft - Se true, è una preferenza non vincolante
 * @property {number} priorita - Più alto = più importante (0-100)
 * @property {string} colore - Colore esadecimale per visualizzazione
 * @property {string} icona - Emoji o carattere Unicode
 * @property {string} note - Note opzionali dell'utente
 */

/**
 * Crea una nuova assenza con valori di default
 *
 * @param {Object} params - Parametri assenza
 * @param {string} params.tipo - Tipo assenza (chiave TipoAssenza)
 * @param {string} params.operatore - ID operatore
 * @param {string} params.dataInizio - Data inizio YYYY-MM-DD
 * @param {string} params.dataFine - Data fine YYYY-MM-DD (opzionale, default = dataInizio)
 * @param {string} params.durata - Durata (opzionale, default = 'giornata')
 * @param {number} params.ore - Ore (opzionale)
 * @param {string} params.note - Note (opzionale)
 * @returns {Assenza}
 */
export function creaAssenza({
    tipo,
    operatore,
    dataInizio,
    dataFine = null,
    durata = DurataAssenza.GIORNATA,
    ore = null,
    note = ''
}) {
    // Validazione tipo
    if (!TipoAssenza[tipo]) {
        throw new Error(`Tipo assenza non valido: ${tipo}`);
    }

    // Prendi le proprietà di default dal tipo
    const tipoDefault = TipoAssenza[tipo];

    // Genera ID univoco
    const id = `assenza_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
        id,
        tipo,
        operatore,
        dataInizio,
        dataFine: dataFine || dataInizio,
        durata,
        ore,
        bloccaTurni: tipoDefault.bloccaTurni,
        soft: tipoDefault.soft,
        priorita: tipoDefault.priorita,
        colore: tipoDefault.colore,
        icona: tipoDefault.icona,
        note
    };
}

/**
 * Valida un oggetto assenza
 *
 * @param {Assenza} assenza - Assenza da validare
 * @returns {{valida: boolean, errori: string[]}}
 */
export function validaAssenza(assenza) {
    const errori = [];

    if (!assenza.id) errori.push('ID mancante');
    if (!assenza.tipo || !TipoAssenza[assenza.tipo]) errori.push('Tipo assenza non valido');
    if (!assenza.operatore) errori.push('Operatore mancante');
    if (!assenza.dataInizio) errori.push('Data inizio mancante');
    if (!assenza.dataFine) errori.push('Data fine mancante');

    // Valida formato date
    const regexData = /^\d{4}-\d{2}-\d{2}$/;
    if (assenza.dataInizio && !regexData.test(assenza.dataInizio)) {
        errori.push('Formato data inizio non valido (richiesto YYYY-MM-DD)');
    }
    if (assenza.dataFine && !regexData.test(assenza.dataFine)) {
        errori.push('Formato data fine non valido (richiesto YYYY-MM-DD)');
    }

    // Valida durata
    if (!Object.values(DurataAssenza).includes(assenza.durata)) {
        errori.push('Durata non valida');
    }

    // Se durata è 'ore', deve avere il campo ore
    if (assenza.durata === DurataAssenza.ORE && !assenza.ore) {
        errori.push('Campo ore mancante per durata tipo "ore"');
    }

    // Data fine >= data inizio
    if (assenza.dataInizio && assenza.dataFine) {
        if (assenza.dataFine < assenza.dataInizio) {
            errori.push('Data fine precedente a data inizio');
        }
    }

    return {
        valida: errori.length === 0,
        errori
    };
}

/**
 * Verifica se un'assenza copre una data specifica
 *
 * @param {Assenza} assenza
 * @param {string} data - Data in formato YYYY-MM-DD
 * @returns {boolean}
 */
export function assenzaCovriData(assenza, data) {
    return data >= assenza.dataInizio && data <= assenza.dataFine;
}

/**
 * Converte data JS (anno, mese 0-11, giorno) in formato YYYY-MM-DD
 *
 * @param {number} anno
 * @param {number} mese - 0-11 (formato JavaScript)
 * @param {number} giorno
 * @returns {string}
 */
export function dataToString(anno, mese, giorno) {
    const meseStr = String(mese + 1).padStart(2, '0');
    const giornoStr = String(giorno).padStart(2, '0');
    return `${anno}-${meseStr}-${giornoStr}`;
}

/**
 * Converte stringa YYYY-MM-DD in oggetto {anno, mese, giorno}
 *
 * @param {string} dataStr - Formato YYYY-MM-DD
 * @returns {{anno: number, mese: number, giorno: number}}
 */
export function stringToData(dataStr) {
    const [anno, mese, giorno] = dataStr.split('-').map(Number);
    return {
        anno,
        mese: mese - 1,  // Converti a formato JS (0-11)
        giorno
    };
}
