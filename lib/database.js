// 💾 Lib: RICHI-MD DATABASE KERNEL
// Description: Registre centralisé des configurations système et secteurs

const fs = require('fs-extra');
const config = require('../config');

/**
 * Initialisation des registres (JSON Cold Storage)
 */
function initDb() {
    // 1. Registre Global (Paramètres du Noyau)
    if (!fs.existsSync(config.database.settings)) {
        fs.outputJsonSync(config.database.settings, { 
            botName: "Richi-MD",
            mode: 'public', 
            lang: 'fr',
            prefix: '.',
            autostatusview: true,
            autostatusreact: false,
            autotyping: false,
            autorecord: false,
            sudo: [], 
            menuImages: [
                "https://i.postimg.cc/mDhT0csk/5d815d55908eafd04d29d88e5146a0f9.jpg",
                "https://i.postimg.cc/fR2z57GC/5ee7de12fe61c6d1b6ee80dbcb489c1c.jpg",
                "https://i.postimg.cc/FsGNsgHF/40ddc28ad52c8b2fb1e9e290dbefacf9.jpg"
            ]
        }, { spaces: 2 });
    }

    // 2. Registre des Secteurs (Configurations Groupes)
    if (!fs.existsSync(config.database.groups)) {
        fs.outputJsonSync(config.database.groups, {}, { spaces: 2 });
    }
}

// --- LOGIQUE DE SECTEUR (GROUPES) ---

/**
 * Récupère les protocoles de défense d'un secteur spécifique
 */
function getGroupSettings(groupId) {
    initDb();
    const groups = fs.readJsonSync(config.database.groups);
    
    // Retourne les paramètres existants ou le template de sécurité par défaut
    return groups[groupId] || {
        antilink: false,
        antilinkAction: 'delete', // Options: 'delete' | 'kick'
        antispam: false,
        antitransfert: false,
        antimedia: false,
        antitag: false,
        antipromote: false,
        antidemote: false,
        antibadword: false,
        badwords: [],
        autoreact: false,
        welcome: false,
        welcomeMessage: "─── 『 RICHI-MD WELCOME 』 ───\n\nSujet : @user\nSecteur : @group\n\nIdentification terminée. Bienvenue dans la matrice."
    };
}

/**
 * Injecte une nouvelle configuration dans les registres d'un secteur
 */
function updateGroupSetting(groupId, key, value) {
    initDb();
    const groups = fs.readJsonSync(config.database.groups);
    
    if (!groups[groupId]) groups[groupId] = getGroupSettings(groupId);
    groups[groupId][key] = value;
    
    fs.writeJsonSync(config.database.groups, groups, { spaces: 2 });
    return groups[groupId];
}

// --- LOGIQUE GLOBALE (SYSTÈME) ---

function getSettings() { 
    initDb(); 
    return fs.readJsonSync(config.database.settings); 
}

function updateSetting(key, value) { 
    initDb();
    const data = getSettings(); 
    data[key] = value; 
    fs.writeJsonSync(config.database.settings, data, { spaces: 2 }); 
    return data; 
}

module.exports = { 
    getSettings, 
    updateSetting, 
    getGroupSettings, 
    updateGroupSetting 
};