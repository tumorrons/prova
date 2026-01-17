/**
 * profili-regole-ui.js - UI helpers per gestire regole custom nei profili
 */

import { mostraRuleBuilder } from './rule-builder.js';

/**
 * Renderizza lista regole custom di un tipo (preferenza o vincolo)
 */
export function renderListaRegole(regole, tipo, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!regole || regole.length === 0) {
        container.innerHTML = `
            <p style="color:#999;font-size:12px;font-style:italic">
                Nessuna regola personalizzata. Clicca su "➕ Aggiungi regola" per crearne una.
            </p>
        `;
        return;
    }

    container.innerHTML = regole.map((regola, index) => {
        const iconaGravita = regola.gravita === 'error' ? '🔴' :
                              regola.gravita === 'warning' ? '⚠️' : 'ℹ️';
        const coloreRegola = regola.gravita === 'error' ? '#ffebee' :
                             regola.gravita === 'warning' ? '#fff3e0' : '#e3f2fd';
        const opacita = regola.attiva ? '1' : '0.5';

        return `
            <div style="background:${coloreRegola};padding:10px;border-radius:4px;margin-bottom:8px;opacity:${opacita}">
                <div style="display:flex;justify-content:space-between;align-items:start">
                    <div style="flex:1">
                        <strong style="font-size:13px">${iconaGravita} ${regola.descrizione}</strong>
                        ${!regola.attiva ? ' <span style="color:#999;font-size:11px">(disattivata)</span>' : ''}
                        <p style="margin:4px 0 0 0;font-size:11px;color:#666">
                            ${regola.messaggio}
                        </p>
                        <p style="margin:4px 0 0 0;font-size:10px;color:#999">
                            Quando: ${regola.condizione.campo} ${getOperatoreLabel(regola.condizione.operatore)} ${regola.condizione.valore}
                        </p>
                    </div>
                    <div style="display:flex;gap:4px;margin-left:10px">
                        <button
                            class="config-btn"
                            style="font-size:11px;padding:4px 8px"
                            onclick="window.modificaRegolaCustom('${tipo}', ${index})"
                            title="Modifica regola"
                        >
                            ✏️
                        </button>
                        <button
                            class="config-btn config-delete"
                            style="font-size:11px;padding:4px 8px"
                            onclick="window.eliminaRegolaCustom('${tipo}', ${index})"
                            title="Elimina regola"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Ottiene label human-readable per operatore
 */
function getOperatoreLabel(op) {
    const map = {
        equals: "=",
        notEquals: "≠",
        gt: ">",
        lt: "<",
        gte: "≥",
        lte: "≤",
        contains: "contiene",
        notContains: "non contiene"
    };
    return map[op] || op;
}

/**
 * Store temporaneo per regole in editing (prima del salvataggio profilo)
 */
window.__regoleEditingTemp = {
    preferenze: [],
    vincoli: []
};

/**
 * Inizializza regole temporary da profilo esistente
 */
export function inizializzaRegoleTemp(profilo) {
    window.__regoleEditingTemp.preferenze = profilo.preferenze?.regole || [];
    window.__regoleEditingTemp.vincoli = profilo.vincoli?.regole || [];

    // Renderizza liste iniziali
    renderListaRegole(window.__regoleEditingTemp.preferenze, 'preferenze', 'prof-preferenze-regole-list');
    renderListaRegole(window.__regoleEditingTemp.vincoli, 'vincoli', 'prof-vincoli-regole-list');
}

/**
 * Aggiunge nuova regola custom
 */
window.aggiungiRegolaCustom = function(tipo) {
    mostraRuleBuilder(tipo, (regola) => {
        // Aggiungi a temp store
        window.__regoleEditingTemp[tipo === 'preferenza' ? 'preferenze' : 'vincoli'].push(regola);

        // Ri-renderizza lista
        const containerId = tipo === 'preferenza' ? 'prof-preferenze-regole-list' : 'prof-vincoli-regole-list';
        renderListaRegole(
            window.__regoleEditingTemp[tipo === 'preferenza' ? 'preferenze' : 'vincoli'],
            tipo === 'preferenza' ? 'preferenze' : 'vincoli',
            containerId
        );
    });
};

/**
 * Modifica regola custom esistente
 */
window.modificaRegolaCustom = function(tipo, index) {
    const tipoKey = tipo === 'preferenze' ? 'preferenze' : 'vincoli';
    const regola = window.__regoleEditingTemp[tipoKey][index];

    mostraRuleBuilder(tipo === 'preferenze' ? 'preferenza' : 'vincolo', (regolaModificata) => {
        // Aggiorna in temp store
        window.__regoleEditingTemp[tipoKey][index] = regolaModificata;

        // Ri-renderizza lista
        const containerId = tipo === 'preferenze' ? 'prof-preferenze-regole-list' : 'prof-vincoli-regole-list';
        renderListaRegole(window.__regoleEditingTemp[tipoKey], tipo, containerId);
    }, regola);
};

/**
 * Elimina regola custom
 */
window.eliminaRegolaCustom = function(tipo, index) {
    if (!confirm("Eliminare questa regola personalizzata?")) return;

    const tipoKey = tipo === 'preferenze' ? 'preferenze' : 'vincoli';

    // Rimuovi da temp store
    window.__regoleEditingTemp[tipoKey].splice(index, 1);

    // Ri-renderizza lista
    const containerId = tipo === 'preferenze' ? 'prof-preferenze-regole-list' : 'prof-vincoli-regole-list';
    renderListaRegole(window.__regoleEditingTemp[tipoKey], tipo, containerId);
};

/**
 * Ottiene regole custom da salvare
 */
export function getRegoleCustomDaSalvare() {
    return {
        preferenze: window.__regoleEditingTemp.preferenze || [],
        vincoli: window.__regoleEditingTemp.vincoli || []
    };
}
