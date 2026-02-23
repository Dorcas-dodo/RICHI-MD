// 🛡️ Plugin: RICHI-MD ANTILINK
// Description: Protocole de défense contre les liens non-autorisés

const { updateGroupSetting, getGroupSettings } = require('../../lib/database');

module.exports = {
    name: 'antilink',
    aliases: ['link', 'antilien'],
    category: 'group',
    description: 'Configure le pare-feu contre les liens WhatsApp',
    usage: 'antilink <on/off/kick/delete>',
    
    groupOnly: true,
    adminOnly: true,
    botAdminNeeded: true,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        const setting = args[0]?.toLowerCase();
        
        // Récupération de la configuration actuelle via ta DB
        const currentConfig = getGroupSettings(remoteJid);

        // Affichage du statut si aucun argument
        if (!setting) {
            const statusMsg = `*─── 『 RICHI-MD FIREWALL 』 ───*\n\n` +
                              `*🛡️ État :* ${currentConfig.antilink ? 'ACTIF' : 'INACTIF'}\n` +
                              `*⚡ Action :* ${currentConfig.antilinkAction.toUpperCase()}\n\n` +
                              `*Usage :* .antilink on | off | kick | delete`;
            
            return sock.sendMessage(remoteJid, { text: statusMsg }, { quoted: message });
        }

        // Activation / Désactivation
        if (setting === 'on' || setting === 'off') {
            const isEnabled = setting === 'on';
            updateGroupSetting(remoteJid, 'antilink', isEnabled);
            
            await sock.sendMessage(remoteJid, { react: { text: isEnabled ? "🛡️" : "🔓", key: message.key } });
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚡ CONFIGURÉ ] ──*\n\nLe protocole Antilink est désormais *${setting.toUpperCase()}*.` 
            });
        }

        // Définition de l'action (Supprimer ou Éjecter)
        if (['kick', 'delete'].includes(setting)) {
            updateGroupSetting(remoteJid, 'antilinkAction', setting);
            
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚡ ACTION MISE À JOUR ] ──*\n\nEn cas de détection, le système va : *${setting.toUpperCase()}*.` 
            });
        }

        // Erreur de syntaxe
        sock.sendMessage(remoteJid, { 
            text: `*── [ ⚠️ ERREUR ] ──*\n\nCommande invalide.\n*Usage :* .antilink <on/off/kick/delete>` 
        }, { quoted: message });
    }
};