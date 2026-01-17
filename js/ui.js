/**
 * UI.js - Eventi e interazioni utente
 *
 * Gestisce:
 * - Click, doppio click, context menu
 * - Selezione turni
 * - Barra turni
 * - Aggiornamento titoli
 * - Navigazione viste
 * - Keyboard shortcuts
 */

import {
    annoCorrente, meseCorrente, turnoSelezionato, modalitaInserimento,
    setTurnoSelezionato, setModalitaInserimento, deselezionaTutto,
    meseSuccessivo as stateMessuccessivo, mesePrecedente as stateMessPrecedente,
    annoSuccessivo as stateAnnoSuccessivo, annoPrecedente as stateAnnoPrecedente,
    setAnnoCorrente, setMeseCorrente, turni, ANNO_MIN, ANNO_MAX
} from './state.js';
import { salvaTurno, caricaTurno, caricaNota, salvaNota } from './storage.js';
import { getNomeMese, getNomiGiorniSettimanaPieni } from './calendar.js';
import { renderMese } from './render/mese.js';
import { renderAnno } from './render/anno.js';
import { renderAmbulatorio } from './render/ambulatorio.js';
import { renderStampa } from './render/stampa.js';
import { renderConfig } from './render/config.js';
import { mostraEditorNotaInline } from './render/note-editor.js';
import { renderCoveragePanel } from './render/coverage-panel.js';

// ============= NAVIGAZIONE VISTE =============
export function showView(id) {
    document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");

    if (id === "mese") {
        renderMese();
    }
    if (id === "anno") renderAnno();
    if (id === "ambulatorio") renderAmbulatorio(annoCorrente, meseCorrente);
    if (id === "stampa") renderStampa(annoCorrente, meseCorrente);
    if (id === "config") renderConfig();
}

// ============= NAVIGAZIONE TEMPORALE =============
export function meseSuccessivo() {
    stateMessuccessivo();
    aggiornaTitolo();
    renderMese(annoCorrente, meseCorrente);
    if (!document.getElementById("ambulatorio").classList.contains("hidden")) {
        renderAmbulatorio(annoCorrente, meseCorrente);
    }
}

export function mesePrecedente() {
    stateMessPrecedente();
    aggiornaTitolo();
    renderMese(annoCorrente, meseCorrente);
    if (!document.getElementById("ambulatorio").classList.contains("hidden")) {
        renderAmbulatorio(annoCorrente, meseCorrente);
    }
}

export function annoSuccessivo() {
    stateAnnoSuccessivo();
    aggiornaTitolo();
    renderAnno(annoCorrente);
}

export function annoPrecedente() {
    stateAnnoPrecedente();
    aggiornaTitolo();
    renderAnno(annoCorrente);
}

// ============= AGGIORNAMENTO TITOLI =============
export function aggiornaTitolo() {
    const meseEl = document.getElementById("mese-titolo");
    if (meseEl) {
        meseEl.textContent = `${getNomeMese(meseCorrente)} ${annoCorrente}`;
    }

    const primoGiorno = new Date(annoCorrente, meseCorrente, 1);
    const giornoNome = getNomiGiorniSettimanaPieni();
    const meseInfoEl = document.getElementById("mese-info");
    if (meseInfoEl) {
        meseInfoEl.textContent = `(${giornoNome[primoGiorno.getDay()]} 1°)`;
    }

    const annoEl = document.getElementById("anno-titolo");
    if (annoEl) {
        annoEl.textContent = annoCorrente;
    }

    const btnMesePrev = document.getElementById("btn-mese-prev");
    const btnMeseNext = document.getElementById("btn-mese-next");
    const btnAnnoPrev = document.getElementById("btn-anno-prev");
    const btnAnnoNext = document.getElementById("btn-anno-next");

    if (btnMesePrev) btnMesePrev.disabled = (annoCorrente === ANNO_MIN && meseCorrente === 0);
    if (btnMeseNext) btnMeseNext.disabled = (annoCorrente === ANNO_MAX && meseCorrente === 11);
    if (btnAnnoPrev) btnAnnoPrev.disabled = (annoCorrente === ANNO_MIN);
    if (btnAnnoNext) btnAnnoNext.disabled = (annoCorrente === ANNO_MAX);
}

// ============= ASSEGNAZIONE TURNI =============
export function assegnaTurno(event, operatore, giorno, anno, mese) {
    const cell = event.target;

    // MODALITÀ NOTE → Editor inline
    if (modalitaInserimento === "nota") {
        mostraEditorNotaInline(operatore, giorno, anno, mese);
        return;
    }

    // STATO NEUTRO → Nessuna azione
    if (modalitaInserimento === null || !turnoSelezionato) {
        return;
    }

    // MODALITÀ TURNO
    const nota = caricaNota(operatore, giorno, anno, mese);

    cell.innerHTML = turnoSelezionato + (nota && nota.testo ? `<span class="note-badge">N</span>` : "");
    cell.style.background = turni[turnoSelezionato].colore;
    cell.style.color = "white";
    cell.style.fontWeight = "bold";

    salvaTurno(operatore, giorno, turnoSelezionato, anno, mese);

    // Aggiorna pannello copertura se siamo nella vista mese
    const meseContainer = document.getElementById("mese");
    if (meseContainer && !meseContainer.classList.contains("hidden")) {
        renderCoveragePanel(meseContainer, anno, mese);
    }
}

// ============= CANCELLAZIONE TURNI =============
export function inizializzaCancellazioni(root = document) {
    root.querySelectorAll("td[data-operatore]").forEach(cell => {
        const clearCell = () => {
            const operatore = cell.dataset.operatore;
            const giorno = cell.dataset.giorno;
            const anno = parseInt(cell.dataset.anno);
            const mese = parseInt(cell.dataset.mese);

            const nota = caricaNota(operatore, giorno, anno, mese);

            cell.innerHTML = giorno + (nota && nota.testo ? `<span class="note-badge">N</span>` : "");
            cell.style.background = "";
            cell.style.color = "";
            cell.style.fontWeight = "";
            cell.title = nota && nota.testo ? nota.testo + ' (CTRL + doppio click per eliminare)' : "";

            salvaTurno(operatore, giorno, "", anno, mese);

            // Aggiorna pannello copertura se siamo nella vista mese
            const meseContainer = document.getElementById("mese");
            if (meseContainer && !meseContainer.classList.contains("hidden")) {
                renderCoveragePanel(meseContainer, anno, mese);
            }
        };

        // CLICK DESTRO
        cell.oncontextmenu = e => {
            e.preventDefault();
            clearCell();
        };

        // DOPPIO CLICK
        cell.ondblclick = e => {
            e.preventDefault();

            const operatore = cell.dataset.operatore;
            const giorno = cell.dataset.giorno;
            const anno = parseInt(cell.dataset.anno);
            const mese = parseInt(cell.dataset.mese);

            // CTRL + DOPPIO CLICK = CANCELLA SOLO NOTA
            if (e.ctrlKey) {
                salvaNota(operatore, giorno, null, anno, mese);

                const turno = caricaTurno(operatore, giorno, anno, mese);
                cell.innerHTML = turno ? turno : giorno;
                cell.style.boxShadow = "";
                cell.title = "";
                return;
            }

            // DOPPIO CLICK NORMALE = CANCELLA TURNO
            clearCell();
        };
    });
}

// ============= BARRA TURNI =============
export function renderTurniBar() {
    const bar = document.getElementById("turniBar");
    bar.innerHTML = "";
    for (let t in turni) {
        let btn = document.createElement("button");
        btn.textContent = t + " - " + turni[t].nome;
        btn.className = "turno-btn";
        btn.style.background = turni[t].colore;
        btn.onclick = () => selezionaTurno(t, btn);
        bar.appendChild(btn);
    }

    let noteBtn = document.createElement("button");
    noteBtn.textContent = "📝 NOTE";
    noteBtn.className = "turno-btn";
    noteBtn.style.background = "#607d8b";
    noteBtn.style.color = "white";
    noteBtn.onclick = () => selezionaNota(noteBtn);
    bar.appendChild(noteBtn);
}

function selezionaTurno(t, btn) {
    // TOGGLE: Se clicco sul turno GIÀ attivo → lo spengo
    if (turnoSelezionato === t && modalitaInserimento === "turno") {
        deselezionaTutto();
        return;
    }

    // Altrimenti selezione normale
    deselezionaTutto();
    btn.classList.add("turno-attivo");
    setTurnoSelezionato(t);
    setModalitaInserimento("turno");

    document.body.style.cursor = "crosshair";
}

function selezionaNota(btn) {
    // TOGGLE: Se NOTE è già attivo → spegni tutto
    if (modalitaInserimento === "nota") {
        deselezionaTutto();
        return;
    }

    // Altrimenti attiva NOTE
    deselezionaTutto();
    btn.classList.add("turno-attivo");
    setModalitaInserimento("nota");

    document.body.style.cursor = "text";
}

// ============= SHORTCUT TASTIERA =============
export function initKeyboardShortcuts() {
    document.addEventListener("keydown", function (e) {
        // ESC → chiudi editor inline
        if (e.key === "Escape") {
            const box = document.getElementById("noteInline");
            if (box && box.style.display !== "none") {
                window.chiudiEditorInline();
            }
        }

        // DELETE → elimina nota (solo se editor aperto)
        if (e.key === "Delete") {
            const box = document.getElementById("noteInline");
            if (box && box.style.display !== "none") {
                window.eliminaNotaInline();
            }
        }
    });
}
