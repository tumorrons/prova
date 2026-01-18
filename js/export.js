/**
 * export.js - Gestione export/import dati
 *
 * Permette di:
 * - Esportare tutti i dati in JSON (backup completo)
 * - Esportare turni in Excel/CSV (formato tabellare)
 * - Importare dati da JSON (ripristino backup)
 * - Importare turni da Excel/CSV
 */

import { operatori, turni, ambulatori } from './state.js';
import { getNomeMese } from './calendar.js';
import { getNomeOperatore, getIdOperatore } from './profili.js';

/**
 * Esporta tutti i dati da localStorage in formato JSON
 * Include: turni, note, configurazioni, regole, bozze
 * @returns {string} JSON completo
 */
export function esportaDatiJSON() {
    const backup = {
        metadata: {
            versione: "1.0",
            dataExport: new Date().toISOString(),
            app: "Gestione Turni Ospedale v4.4"
        },
        dati: {}
    };

    // Copia tutto localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        backup.dati[key] = value;
    }

    return JSON.stringify(backup, null, 2);
}

/**
 * Importa dati da JSON backup
 * @param {string} jsonString - JSON da importare
 * @returns {{successo: boolean, messaggio: string, importati: number}}
 */
export function importaDatiJSON(jsonString) {
    try {
        const backup = JSON.parse(jsonString);

        // Valida struttura
        if (!backup.metadata || !backup.dati) {
            return {
                successo: false,
                messaggio: "Formato JSON non valido: struttura mancante",
                importati: 0
            };
        }

        // Conferma prima di sovrascrivere
        const conferma = confirm(
            `Importare backup del ${new Date(backup.metadata.dataExport).toLocaleString('it-IT')}?\n\n` +
            `⚠️ ATTENZIONE: Tutti i dati attuali saranno sostituiti!\n\n` +
            `Numero di chiavi da importare: ${Object.keys(backup.dati).length}`
        );

        if (!conferma) {
            return {
                successo: false,
                messaggio: "Importazione annullata dall'utente",
                importati: 0
            };
        }

        // Cancella localStorage attuale
        localStorage.clear();

        // Importa tutti i dati
        let importati = 0;
        Object.entries(backup.dati).forEach(([key, value]) => {
            localStorage.setItem(key, value);
            importati++;
        });

        return {
            successo: true,
            messaggio: `Backup importato con successo!\nData backup: ${new Date(backup.metadata.dataExport).toLocaleString('it-IT')}`,
            importati
        };

    } catch (error) {
        return {
            successo: false,
            messaggio: `Errore durante l'importazione: ${error.message}`,
            importati: 0
        };
    }
}

/**
 * Esporta turni in formato CSV (compatibile Excel)
 * @param {number} anno - Anno
 * @param {number} mese - Mese (0-11)
 * @returns {string} CSV
 */
export function esportaTurniCSV(anno, mese) {
    const nomeMese = getNomeMese(mese);
    const giorni = new Date(anno, mese + 1, 0).getDate();

    // Header CSV
    let csv = `Operatore`;
    for (let g = 1; g <= giorni; g++) {
        csv += `,${g}`;
    }
    csv += `,Ore Totali\n`;

    // Righe operatori
    operatori.forEach(op => {
        const opNome = getNomeOperatore(op);
        const opId = getIdOperatore(op);
        csv += `"${opNome}"`;

        let oreTotali = 0;

        for (let g = 1; g <= giorni; g++) {
            const key = `${anno}_${mese}_${opId}_${g}`;
            let turnoSalvato = localStorage.getItem(key) || "";

            // Estrai codice turno se nel formato "AMBULATORIO_TURNO"
            let codiceTurno = turnoSalvato;
            if (turnoSalvato.includes('_')) {
                const parts = turnoSalvato.split('_');
                codiceTurno = parts[parts.length - 1];
            }

            // Calcola ore
            if (turni[codiceTurno]) {
                const oreMatch = turni[codiceTurno].orario.match(/(\d+):00\s*–\s*(\d+):00/);
                if (oreMatch) {
                    const ore = parseInt(oreMatch[2]) - parseInt(oreMatch[1]);
                    oreTotali += ore;
                }
            }

            csv += `,${codiceTurno}`;
        }

        csv += `,${oreTotali}\n`;
    });

    return csv;
}

/**
 * Esporta turni anno intero in formato Excel (CSV) con note e legenda
 * @param {number} anno - Anno da esportare
 * @param {string} ambulatorioFiltro - Filtra per ambulatorio (opzionale)
 * @returns {string} CSV con separatore ;
 */
export function esportaTurniAnnoCompleto(anno, ambulatorioFiltro = "") {
    let excel = '';

    // Per ogni mese dell'anno
    for (let mese = 0; mese < 12; mese++) {
        const nomeMese = getNomeMese(mese);
        const giorni = new Date(anno, mese + 1, 0).getDate();

        // Titolo mese
        excel += `\r\n${nomeMese.toUpperCase()} ${anno}\r\n`;
        excel += `Operatore`;
        for (let g = 1; g <= giorni; g++) {
            excel += `;${g}`;
        }
        excel += `;Ore Totali\r\n`;

        // Righe operatori
        operatori.forEach(op => {
            const opNome = getNomeOperatore(op);
            const opId = getIdOperatore(op);

            // Verifica se operatore ha turni questo mese (se filtrato per ambulatorio)
            if (ambulatorioFiltro) {
                let haTurni = false;
                for (let g = 1; g <= giorni; g++) {
                    const turnoKey = `${anno}_${mese}_${opId}_${g}`;
                    const turnoSalvato = localStorage.getItem(turnoKey);
                    if (turnoSalvato) {
                        let codiceTurno = turnoSalvato;
                        let ambulatorioTurno = null;

                        if (turnoSalvato.includes('_')) {
                            const parts = turnoSalvato.split('_');
                            ambulatorioTurno = parts[0];
                            codiceTurno = parts[parts.length - 1];
                        }

                        if (turni[codiceTurno]) {
                            const ambTurno = ambulatorioTurno || turni[codiceTurno].ambulatorio;
                            if (ambTurno === ambulatorioFiltro) {
                                haTurni = true;
                                break;
                            }
                        }
                    }
                }
                if (!haTurni) return; // Salta operatore
            }

            excel += `"${opNome}"`;

            let oreTotali = 0;

            for (let g = 1; g <= giorni; g++) {
                const turnoKey = `${anno}_${mese}_${opId}_${g}`;
                const noteKey = `${anno}_${mese}_${opId}_${g}_note`;

                let turnoSalvato = localStorage.getItem(turnoKey) || "";
                let nota = localStorage.getItem(noteKey);

                // Estrai codice turno se nel formato "AMBULATORIO_TURNO"
                let codiceTurno = turnoSalvato;
                let ambulatorioTurno = null;

                if (turnoSalvato.includes('_')) {
                    const parts = turnoSalvato.split('_');
                    ambulatorioTurno = parts[0];
                    codiceTurno = parts[parts.length - 1];
                }

                // Contenuto cella
                let contenuto = "";
                if (turnoSalvato && turni[codiceTurno]) {
                    const turno = turni[codiceTurno];
                    const ambTurno = ambulatorioTurno || turno.ambulatorio;

                    // Se c'è un filtro ambulatorio, mostra solo turni di quell'ambulatorio
                    if (!ambulatorioFiltro || ambTurno === ambulatorioFiltro) {
                        contenuto = codiceTurno;

                        // Calcola ore
                        const oreMatch = turno.orario.match(/(\d+):00\s*–\s*(\d+):00/);
                        if (oreMatch) {
                            const ore = parseInt(oreMatch[2]) - parseInt(oreMatch[1]);
                            oreTotali += ore;
                        }

                        // Aggiungi indicatore nota
                        if (nota) {
                            contenuto += "*";
                        }
                    }
                } else if (nota) {
                    // Solo nota senza turno
                    contenuto = "N";
                }

                excel += `;${contenuto}`;
            }

            excel += `;${oreTotali}\r\n`;
        });

        excel += `\r\n`;
    }

    // Legenda turni
    excel += `\r\n--- LEGENDA TURNI ---\r\n`;
    excel += `Codice;Nome;Ambulatorio;Orario;Ore\r\n`;

    Object.entries(turni).forEach(([code, turno]) => {
        // Se c'è un filtro, mostra solo i turni dell'ambulatorio selezionato
        if (ambulatorioFiltro && turno.ambulatorio !== ambulatorioFiltro) {
            return;
        }

        const oreMatch = turno.orario.match(/(\d+):00\s*–\s*(\d+):00/);
        const ore = oreMatch ? parseInt(oreMatch[2]) - parseInt(oreMatch[1]) : 0;

        excel += `${code};${turno.nome};${ambulatori[turno.ambulatorio]?.nome || turno.ambulatorio};${turno.orario};${ore}h\r\n`;
    });

    excel += `\r\n`;
    excel += `Note:\r\n`;
    excel += `* = Presenza di nota (vedere celle specifiche)\r\n`;
    excel += `N = Giorno con solo nota (senza turno)\r\n`;

    return excel;
}

/**
 * Download file con contenuto
 * @param {string} contenuto - Contenuto del file
 * @param {string} nomeFile - Nome del file
 * @param {string} mimeType - Tipo MIME
 */
export function downloadFile(contenuto, nomeFile, mimeType) {
    const blob = new Blob([contenuto], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Genera nome file per export
 * @param {string} tipo - Tipo export (json, csv, excel)
 * @param {number} anno - Anno (opzionale)
 * @param {number} mese - Mese (opzionale)
 * @param {string} ambulatorio - Ambulatorio (opzionale)
 * @returns {string} Nome file
 */
export function generaNomeFile(tipo, anno = null, mese = null, ambulatorio = "") {
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    if (tipo === 'json') {
        return `turni-backup-${timestamp}.json`;
    }

    let nome = `turni`;

    if (anno && mese !== null) {
        const nomeMese = getNomeMese(mese).toLowerCase();
        nome += `-${nomeMese}-${anno}`;
    } else if (anno) {
        nome += `-anno-${anno}`;
    }

    if (ambulatorio) {
        nome += `-${ambulatorio}`;
    }

    nome += `-${timestamp}`;

    if (tipo === 'csv') {
        nome += '.csv';
    } else if (tipo === 'excel') {
        nome += '.csv';
    }

    return nome;
}
