// 🎭 Plugin: RICHI-MD AUTOREACT
// Description: Analyse des flux et réactions émotionnelles automatiques

const { updateGroupSetting, getGroupSettings } = require('../../lib/database');

module.exports = {
    name: 'autoreact',
    aliases: ['ar', 'react'],
    category: 'group',
    description: 'Active ou désactive les réactions automatiques du noyau',
    usage: 'autoreact <on/off>',
    
    groupOnly: true,
    adminOnly: true,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        const setting = args[0]?.toLowerCase();
        
        // Extraction de la configuration via le noyau (DB)
        const currentConfig = getGroupSettings(remoteJid);

        // État du module si aucun argument
        if (!setting) {
            const status = currentConfig.autoreact ? 'OPÉRATIONNEL' : 'DÉSACTIVÉ';
            return sock.sendMessage(remoteJid, { 
                text: `*─── 『 RICHI-MD CORE 』 ───*\n\n*🎭 Module:* Auto-Réaction\n*📊 Statut:* ${status}\n\n*Usage:* .autoreact on/off` 
            }, { quoted: message });
        }

        // Activation du protocole
        if (setting === 'on') {
            updateGroupSetting(remoteJid, 'autoreact', true);
            await sock.sendMessage(remoteJid, { react: { text: "🎭", key: message.key } });
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ✅ ACTIVÉ ] ──*\n\nLe système Richi-MD va désormais réagir aux flux de données entrants.` 
            });
        }

        // Désactivation du protocole
        if (setting === 'off') {
            updateGroupSetting(remoteJid, 'autoreact', false);
            await sock.sendMessage(remoteJid, { react: { text: "🔇", key: message.key } });
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ❌ DÉSACTIVÉ ] ──*\n\nLe module de réaction automatique a été mis en veille.` 
            });
        }

        // Erreur de commande
        sock.sendMessage(remoteJid, { 
            text: `*⚠️ Commande invalide.*\nUtilisez *on* pour activer ou *off* pour couper le module.` 
        });
    }
};