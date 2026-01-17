/**
 * render/mese.js - Rendering vista mensile
 */

import { annoCorrente, meseCorrente, operatori, turni, ambulatori } from '../state.js';
import { giorniNelMese, primoGiornoMese, getNomeMese, getNomiGiorniSettimana } from '../calendar.js';
import { caricaTurno, caricaNota } from '../storage.js';
import { calcolaOreOperatore, calcolaMinutiOperatore, getOrarioDettaglioTurno, calcolaOreTurno } from '../turni.js';
import { assegnaTurno, aggiornaTitolo, inizializzaCancellazioni } from '../ui.js';
import { renderBoxNoteMese, renderEditorNotaInline } from './note-editor.js';
import { renderCoveragePanel } from './coverage-panel.js';
import { getNomeOperatore, getIdOperatore } from '../profili.js';
import { valutaAssegnazione, generaTooltipRegole, filtraWarning } from '../regole.js';

export function renderMese(anno = annoCorrente, mese = meseCorrente, compatto = false) {
    const container = document.getElementById("mese");

    if (!compatto) {
        container.innerHTML = `<h3>📅 Vista Mese</h3>`;

        let navMese = document.createElement("div");
        navMese.className = "nav-controls";
        navMese.innerHTML = `
            <button id="btn-mese-prev" onclick="window.mesePrecedente()">⬅️ Precedente</button>
            <span class="nav-title" id="mese-titolo">${getNomeMese(mese)} ${anno}</span>
            <button id="btn-mese-next" onclick="window.meseSuccessivo()">Successivo ➡️</button>
            <small class="nav-info" id="mese-info"></small>
        `;
        container.appendChild(navMese);

        let infoText = document.createElement("p");
        infoText.className = "info-text";
        infoText.textContent = "Clicca su una cella per assegnare un turno • Doppio click o click destro per cancellare";
        container.appendChild(infoText);
    }

    const giorni = giorniNelMese(anno, mese);

    let table = document.createElement("table");
    table.style.marginTop = compatto ? "5px" : "15px";
    table.style.fontSize = compatto ? "10px" : "12px";

    let weekDays = getNomiGiorniSettimana();
    let primoGiorno = primoGiornoMese(anno, mese);

    let thead = "<tr><th>Operatore</th>";
    for (let g = 1; g <= giorni; g++) {
        let dayOfWeek = (primoGiorno + g - 1) % 7;
        let dayLabel = weekDays[dayOfWeek];
        thead += `<th><span style="font-size:0.85em;color:#666">${dayLabel}</span><br>${g}</th>`;
    }
    thead += "</tr>";
    table.innerHTML = thead;

    operatori.forEach(op => {
        const oreOperatore = calcolaOreOperatore(op, anno, mese);
        const minutiOperatore = calcolaMinutiOperatore(op, anno, mese);

        let styleOre = "color:#666;font-weight:normal";
        let iconaWarning = "";
        if (minutiOperatore > 10800) { // >180h
            styleOre = "color:#d32f2f;font-weight:bold";
            iconaWarning = " ⚠️";
        }

        const opId = getIdOperatore(op);
        const opNome = getNomeOperatore(op);

        let row = `<tr data-operatore="${opId}">
            <td class="operator" style="${compatto ? 'font-size:10px;padding:2px' : ''}">
                ${opNome}
                ${!compatto ? `<br><small style="${styleOre}">⏱ ${oreOperatore}${iconaWarning}</small>` : ''}
            </td>`;

        for (let g = 1; g <= giorni; g++) {
            let turnoSalvato = caricaTurno(op, g, anno, mese);
            let nota = caricaNota(op, g, anno, mese);
            let cellStyle = "cursor:pointer;";

            if (turnoSalvato && turni[turnoSalvato]) {
                cellStyle += `background:${turni[turnoSalvato].colore};color:white;font-weight:bold`;
            }

            // Valuta regole per turni già assegnati (solo se operatore è un profilo completo)
            let warningRegole = [];
            if (turnoSalvato && typeof op === 'object' && op !== null) {
                const context = {};
                const risultati = valutaAssegnazione(op, turnoSalvato, g, anno, mese, context);
                warningRegole = filtraWarning(risultati);
            }

            // Bordo per note (giallo) o warning regole (rosso/arancione)
            if (nota && nota.testo && warningRegole.length === 0) {
                cellStyle += ";box-shadow:inset 0 0 0 2px #ff9800";
            } else if (warningRegole.length > 0) {
                const haErrori = warningRegole.some(w => w.gravita === 'error');
                if (haErrori) {
                    cellStyle += ";box-shadow:inset 0 0 0 3px #d32f2f"; // Rosso per errori
                } else {
                    cellStyle += ";box-shadow:inset 0 0 0 2px #ff9800"; // Arancione per warning
                }
                // Se c'è anche una nota, bordo doppio
                if (nota && nota.testo) {
                    cellStyle += ",inset 0 0 0 5px #fbc02d";
                }
            }

            let contenuto = turnoSalvato || g;
            if (nota && nota.testo) {
                contenuto += `<span class="note-badge">N</span>`;
            }

            let tooltipText = "";
            if (turnoSalvato && turni[turnoSalvato]) {
                const orarioDettaglio = getOrarioDettaglioTurno(turnoSalvato, ambulatori);
                const oreCalcolate = calcolaOreTurno(turnoSalvato);
                tooltipText = `${turni[turnoSalvato].nome} • ${orarioDettaglio} • ${oreCalcolate}h`;

                // Aggiungi warning regole al tooltip
                if (warningRegole.length > 0) {
                    const tooltipRegole = generaTooltipRegole(warningRegole);
                    tooltipText += `\n\n${tooltipRegole}`;
                }

                if (nota && nota.testo) {
                    tooltipText += `\n\n📝 ${nota.testo} (CTRL + doppio click per eliminare)`;
                }
            } else if (nota && nota.testo) {
                tooltipText = nota.testo + ' (CTRL + doppio click per eliminare)';
            }

            if (compatto) {
                cellStyle += ';padding:2px;font-size:10px';
            }

            row += `<td style="${cellStyle}" data-operatore="${opId}" data-giorno="${g}" data-anno="${anno}" data-mese="${mese}" title="${tooltipText}" onclick="window.assegnaTurno(event, '${opId}', ${g}, ${anno}, ${mese})">${contenuto}</td>`;
        }

        row += "</tr>";
        table.innerHTML += row;
    });

    container.appendChild(table);

    if (!compatto) {
        aggiornaTitolo();
        inizializzaCancellazioni();
        renderCoveragePanel(container, anno, mese);
        renderBoxNoteMese(document.getElementById("mese"), anno, mese);
        renderEditorNotaInline(container);
    }
}
