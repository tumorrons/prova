/**
 * Storage.js - UNICA fonte di verità per persistenza dati
 *
 * Tutti gli accessi a localStorage passano da qui.
 * Se domani si vuole cambiare backend → si modifica SOLO questo file.
 */

import { setOperatori, setAmbulatori, setTurni } from './state.js';

// ============= OPERATORI =============
export function caricaOperatori() {
    const ops = localStorage.getItem("operatori");
    if (ops) {
        return JSON.parse(ops);
    } else {
        const defaults = ["Rossi", "Bianchi", "Verdi"];
        salvaOperatori(defaults);
        return defaults;
    }
}

export function salvaOperatori(operatori) {
    localStorage.setItem("operatori", JSON.stringify(operatori));
    setOperatori(operatori);
}

export function aggiungiOperatore(nome) {
    const operatori = caricaOperatori();
    operatori.push(nome);
    salvaOperatori(operatori);
}

export function rimuoviOperatore(index) {
    const operatori = caricaOperatori();
    operatori.splice(index, 1);
    salvaOperatori(operatori);
}

// ============= AMBULATORI =============
export function caricaAmbulatori() {
    const ambs = localStorage.getItem("ambulatori");
    if (ambs) {
        return JSON.parse(ambs);
    } else {
        const defaults = {
            BUD: { nome: "Budrio" },
            BAR: { nome: "Baricella" }
        };
        salvaAmbulatori(defaults);
        return defaults;
    }
}

export function salvaAmbulatori(ambulatori) {
    localStorage.setItem("ambulatori", JSON.stringify(ambulatori));
    setAmbulatori(ambulatori);
}

export function aggiungiAmbulatorio(codice, nome) {
    const ambulatori = caricaAmbulatori();
    ambulatori[codice] = { nome };
    salvaAmbulatori(ambulatori);
}

export function rimuoviAmbulatorio(codice) {
    const ambulatori = caricaAmbulatori();
    delete ambulatori[codice];
    salvaAmbulatori(ambulatori);
}

// ============= TURNI =============
export function caricaTurni() {
    const tnr = localStorage.getItem("turni");
    if (tnr) {
        return JSON.parse(tnr);
    } else {
        const defaults = {
            BM: { nome: "Mattino", colore: "#4caf50", ambulatorio: "BUD", orario: "07:00 – 14:00", labelStampa: "BM" },
            BP: { nome: "Pomeriggio", colore: "#ff9800", ambulatorio: "BUD", orario: "14:00 – 21:00", labelStampa: "BP" },
            BA: { nome: "Mattino", colore: "#9c27b0", ambulatorio: "BAR", orario: "07:00 – 14:00", labelStampa: "BA" }
        };
        salvaTurni(defaults);
        return defaults;
    }
}

export function salvaTurni(turni) {
    localStorage.setItem("turni", JSON.stringify(turni));
    setTurni(turni);
}

export function aggiungiTurno(codice, turno) {
    const turni = caricaTurni();
    turni[codice] = turno;
    salvaTurni(turni);
}

export function rimuoviTurno(codice) {
    const turni = caricaTurni();
    delete turni[codice];
    salvaTurni(turni);
}

export function aggiornaTurno(codice, turno) {
    const turni = caricaTurni();
    turni[codice] = turno;
    salvaTurni(turni);
}

// ============= TURNI ASSEGNATI (PER GIORNO) =============
export function caricaTurno(operatore, giorno, anno, mese) {
    const key = `${anno}_${mese}_${operatore}_${giorno}`;
    return localStorage.getItem(key) || "";
}

export function salvaTurno(operatore, giorno, valore, anno, mese) {
    const key = `${anno}_${mese}_${operatore}_${giorno}`;
    if (valore) {
        localStorage.setItem(key, valore);
    } else {
        localStorage.removeItem(key);
    }
}

// ============= NOTE =============
export function caricaNota(operatore, giorno, anno, mese) {
    const key = `${anno}_${mese}_${operatore}_${giorno}_note`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        // Retro-compatibilità: se non è JSON, ritorna come oggetto
        return { testo: raw, operatore, ambulatorio: null };
    }
}

export function salvaNota(operatore, giorno, notaObj, anno, mese) {
    const key = `${anno}_${mese}_${operatore}_${giorno}_note`;
    if (notaObj && notaObj.testo) {
        localStorage.setItem(key, JSON.stringify(notaObj));
    } else {
        localStorage.removeItem(key);
    }
}

// ============= UTILITÀ =============
export function pulisciTuttiTurni() {
    const keysToRemove = [];
    for (let key in localStorage) {
        // Riconosce le chiavi formato: ANNO_MESE_OPERATORE_GIORNO
        if (key.match(/^\d+_\d+_.+_\d+$/)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return keysToRemove.length;
}

// ============= INIZIALIZZAZIONE =============
export function initStorage() {
    const operatori = caricaOperatori();
    const ambulatori = caricaAmbulatori();
    const turni = caricaTurni();

    setOperatori(operatori);
    setAmbulatori(ambulatori);
    setTurni(turni);

    return { operatori, ambulatori, turni };
}
