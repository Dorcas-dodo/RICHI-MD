// 🌐 Lib: RICHI-MD I18N ENGINE
// Description: Gestionnaire de flux linguistiques dynamiques

const fs = require('fs-extra');
const path = require('path');
const config = require('../config.js');
const { getSettings } = require('./database');

// Mémoire tampon pour éviter les lectures disques répétitives
const LANG_CACHE = {};

/**
 * Charge un protocole linguistique depuis le stockage
 */
function loadLocale(langCode) {
    if (LANG_CACHE[langCode]) return LANG_CACHE[langCode];
    
    const localePath = path.join(__dirname, `../locales/${langCode}.json`);
    if (!fs.existsSync(localePath)) {
        // Fallback interne si le fichier n'existe pas
        return langCode === 'en' ? null : loadLocale('en');
    }
    
    try {
        const data = fs.readJsonSync(localePath);
        LANG_CACHE[langCode] = data;
        return data;
    } catch (e) {
        console.error(`[ ⚠️ LANG_ERROR ] Impossible de parser ${langCode}.json`);
        return null;
    }
}

/**
 * t (Translate) : Encode une clé de texte en message utilisateur
 * @param {string} key - Chemin de la clé (ex: 'system.start')
 * @param {Object} params - Variables à injecter {{param}}
 */
function t(key, params = {}) {
    // 1. Détection du code langue (DB -> Config -> Fallback)
    let currentLang = 'fr'; 
    try {
        const settings = getSettings();
        currentLang = settings?.lang || config.defaultLang || 'fr';
    } catch(e) {
        currentLang = config.defaultLang || 'fr';
    }

    // 2. Récupération du dictionnaire
    let locale = loadLocale(currentLang);
    if (!locale) return `[Missing Locale: ${currentLang}]`;

    // 3. Extraction récursive de la valeur
    const keys = key.split('.');
    let value = locale;
    for (const k of keys) {
        value = value?.[k];
    }

    // Fallback sur l'anglais si la clé est manquante dans la langue actuelle
    if (!value && currentLang !== 'en') {
        let engLocale = loadLocale('en');
        value = engLocale;
        for (const k of keys) { value = value?.[k]; }
    }

    if (!value) return `_${key}_`; // Retourne la clé si introuvable partout

    // 4. Injection des paramètres dynamiques
    return value.replace(/{{(\w+)}}/g, (_, k) => {
        return params[k] !== undefined ? params[k] : `{{${k}}}`;
    });
}

module.exports = { t };