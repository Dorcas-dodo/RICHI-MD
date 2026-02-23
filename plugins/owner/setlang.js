// 🌐 Plugin: RICHI-MD LINGUISTIC KERNEL
// Description: Reconfiguration de la matrice de communication

const { updateSetting } = require('../../lib/database');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'setlang',
    aliases: ['lang', 'language'],
    category: 'owner',
    description: 'Reconfigure la langue du système',
    usage: 'setlang <fr/en>',
    
    ownerOnly: true,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        const newLang = args[0]?.toLowerCase();
        
        // 1. Scan des modules linguistiques disponibles
        const localesDir = path.join(__dirname, '../../locales');
        if (!fs.existsSync(localesDir)) fs.mkdirSync(localesDir); // Sécurité

        const availableLangs = fs.readdirSync(localesDir)
            .filter(f => f.endsWith('.json'))
            .map(f => f.replace('.json', ''));

        // 2. Échec de validation
        if (!availableLangs.includes(newLang)) {
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚠️ PROTOCOL ERROR ] ──*\n\nModule linguistique introuvable.\n\n*Unités disponibles :*\n[ ${availableLangs.join(' | ')} ]\n\n*Usage :* .setlang <code_langue>` 
            }, { quoted: message });
        }

        // 3. Réaction de traitement de données
        await sock.sendMessage(remoteJid, { react: { text: "🌐", key: message.key } });

        // 4. Mise à jour de la DB
        updateSetting('lang', newLang);

        // 5. Rapport de reconfiguration
        const report = `*─── 『 RICHI-MD CORE 』 ───*\n\n`
            + `*🛠️ MODULE :* LINGUISTIC_RECONFIG\n`
            + `*🌍 NOUVELLE LANGUE :* ${newLang.toUpperCase()}\n`
            + `*📊 STATUS :* REBOOT_COMPLETE\n\n`
            + `*Note :* Le noyau Richi-MD communique désormais via le protocole ${newLang.toUpperCase()}.\n\n`
            + `*© LINGUISTIC_SYNTAX_UPDATED*`;

        await sock.sendMessage(remoteJid, { text: report }, { quoted: message });
    }
};