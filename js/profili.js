/**
 * profili.js - Schema e utilità profili operatori
 *
 * Definisce la struttura del profilo operatore e fornisce funzioni di validazione.
 */

/**
 * Schema completo profilo operatore
 */
export const SCHEMA_PROFILO_DEFAULT = {
    id: "",
    nome: "",
    sedePrincipale: null,
    sediSecondarie: [],
    contratto: {
        tipo: "full-time",
        oreSettimanali: 40
    },
    preferenze: {
        sedePreferita: null,
        evitaSede: null,
        evitaTurni: [],
        giorniPreferiti: [],
        giorniDaEvitare: []
    },
    vincoli: {
        maxOreSettimanali: null,
        maxGiorniConsecutivi: null,
        minRiposoOre: 11
    }
};

/**
 * Tipi contratto ammessi
 */
export const TIPI_CONTRATTO = {
    FULL_TIME: "full-time",
    PART_TIME: "part-time"
};

/**
 * Giorni della settimana (per preferenze)
 */
export const GIORNI_SETTIMANA = [
    { value: "lun", label: "Lunedì" },
    { value: "mar", label: "Martedì" },
    { value: "mer", label: "Mercoledì" },
    { value: "gio", label: "Giovedì" },
    { value: "ven", label: "Venerdì" },
    { value: "sab", label: "Sabato" },
    { value: "dom", label: "Domenica" }
];

/**
 * Crea un nuovo profilo vuoto con valori di default
 */
export function nuovoProfilo(nome = "") {
    return {
        ...JSON.parse(JSON.stringify(SCHEMA_PROFILO_DEFAULT)),
        id: `OP_${Date.now()}`,
        nome
    };
}

/**
 * Migra una stringa (vecchio formato) a oggetto profilo
 */
export function migraStringaAProfilo(nomeOperatore) {
    return {
        id: `OP_${nomeOperatore.replace(/\s+/g, '_')}`,
        nome: nomeOperatore,
        sedePrincipale: null,
        sediSecondarie: [],
        contratto: {
            tipo: "full-time",
            oreSettimanali: 40
        },
        preferenze: {
            sedePreferita: null,
            evitaSede: null,
            evitaTurni: [],
            giorniPreferiti: [],
            giorniDaEvitare: []
        },
        vincoli: {
            maxOreSettimanali: null,
            maxGiorniConsecutivi: null,
            minRiposoOre: 11
        }
    };
}

/**
 * Verifica se un valore è un profilo completo o solo una stringa
 */
export function isProfilo(operatore) {
    return typeof operatore === 'object' && operatore !== null && 'id' in operatore;
}

/**
 * Ottiene il nome visualizzabile da un operatore (stringa o profilo)
 */
export function getNomeOperatore(operatore) {
    if (typeof operatore === 'string') {
        return operatore;
    }
    return operatore?.nome || operatore?.id || "Sconosciuto";
}

/**
 * Ottiene l'ID da un operatore (stringa o profilo)
 */
export function getIdOperatore(operatore) {
    if (typeof operatore === 'string') {
        return operatore;
    }
    return operatore?.id || operatore?.nome || "unknown";
}

/**
 * Valida un profilo operatore
 */
export function validaProfilo(profilo) {
    const errori = [];

    // Validazione identità
    if (!profilo.id || profilo.id.trim() === "") {
        errori.push("ID operatore mancante");
    }

    if (!profilo.nome || profilo.nome.trim() === "") {
        errori.push("Nome operatore mancante");
    }

    // Validazione contratto
    if (profilo.contratto) {
        if (!Object.values(TIPI_CONTRATTO).includes(profilo.contratto.tipo)) {
            errori.push("Tipo contratto non valido");
        }

        if (profilo.contratto.oreSettimanali &&
            (profilo.contratto.oreSettimanali < 1 || profilo.contratto.oreSettimanali > 60)) {
            errori.push("Ore settimanali devono essere tra 1 e 60");
        }
    }

    // Validazione vincoli
    if (profilo.vincoli) {
        if (profilo.vincoli.maxOreSettimanali && profilo.vincoli.maxOreSettimanali < 1) {
            errori.push("Max ore settimanali deve essere positivo");
        }

        if (profilo.vincoli.maxGiorniConsecutivi &&
            (profilo.vincoli.maxGiorniConsecutivi < 1 || profilo.vincoli.maxGiorniConsecutivi > 31)) {
            errori.push("Max giorni consecutivi deve essere tra 1 e 31");
        }

        if (profilo.vincoli.minRiposoOre &&
            (profilo.vincoli.minRiposoOre < 0 || profilo.vincoli.minRiposoOre > 24)) {
            errori.push("Min riposo ore deve essere tra 0 e 24");
        }
    }

    return errori;
}

/**
 * Normalizza un profilo assicurando che abbia tutti i campi
 */
export function normalizzaProfilo(profilo) {
    return {
        id: profilo.id || `OP_${Date.now()}`,
        nome: profilo.nome || "",
        sedePrincipale: profilo.sedePrincipale || null,
        sediSecondarie: profilo.sediSecondarie || [],
        contratto: {
            tipo: profilo.contratto?.tipo || "full-time",
            oreSettimanali: profilo.contratto?.oreSettimanali || 40
        },
        preferenze: {
            sedePreferita: profilo.preferenze?.sedePreferita || null,
            evitaSede: profilo.preferenze?.evitaSede || null,
            evitaTurni: profilo.preferenze?.evitaTurni || [],
            giorniPreferiti: profilo.preferenze?.giorniPreferiti || [],
            giorniDaEvitare: profilo.preferenze?.giorniDaEvitare || []
        },
        vincoli: {
            maxOreSettimanali: profilo.vincoli?.maxOreSettimanali || null,
            maxGiorniConsecutivi: profilo.vincoli?.maxGiorniConsecutivi || null,
            minRiposoOre: profilo.vincoli?.minRiposoOre || 11
        }
    };
}
