/**
 * render/mese.js - Rendering vista mensile
 */

import { annoCorrente, meseCorrente, operatori, turni, ambulatori } from '../state.js';
import { giorniNelMese, primoGiornoMese, getNomeMese, getNomiGiorniSettimana } from '../calendar.js';
import { caricaTurno, caricaNota } from '../storage.js';
import { calcolaOreOperatore, calcolaMinutiOperatore, getOrarioDettaglioTurno, calcolaOreTurno } from '../turni.js';
import { assegnaTurno, aggiornaTitolo, inizializzaCancellazioni } from '../ui.js';
import { renderBoxNoteMese, renderEditorNotaInline } from './note-editor.js';

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

        let row = `<tr data-operatore="${op}">
            <td class="operator" style="${compatto ? 'font-size:10px;padding:2px' : ''}">
                ${op}
                ${!compatto ? `<br><small style="${styleOre}">⏱ ${oreOperatore}${iconaWarning}</small>` : ''}
            </td>`;

        for (let g = 1; g <= giorni; g++) {
            let turnoSalvato = caricaTurno(op, g, anno, mese);
            let nota = caricaNota(op, g, anno, mese);
            let cellStyle = "cursor:pointer;";

            if (turnoSalvato && turni[turnoSalvato]) {
                cellStyle += `background:${turni[turnoSalvato].colore};color:white;font-weight:bold`;
            }

            if (nota && nota.testo) {
                cellStyle += ";box-shadow:inset 0 0 0 2px #ff9800";
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
                if (nota && nota.testo) {
                    tooltipText += `\n📝 ${nota.testo} (CTRL + doppio click per eliminare)`;
                }
            } else if (nota && nota.testo) {
                tooltipText = nota.testo + ' (CTRL + doppio click per eliminare)';
            }

            if (compatto) {
                cellStyle += ';padding:2px;font-size:10px';
            }

            row += `<td style="${cellStyle}" data-operatore="${op}" data-giorno="${g}" data-anno="${anno}" data-mese="${mese}" title="${tooltipText}" onclick="window.assegnaTurno(event, '${op}', ${g}, ${anno}, ${mese})">${contenuto}</td>`;
        }

        row += "</tr>";
        table.innerHTML += row;
    });

    container.appendChild(table);

    if (!compatto) {
        aggiornaTitolo();
        inizializzaCancellazioni();
        renderBoxNoteMese(document.getElementById("mese"), anno, mese);
        renderEditorNotaInline(container);
    }
}
