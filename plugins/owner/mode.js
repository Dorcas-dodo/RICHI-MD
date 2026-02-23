// 👑 Plugin: RICHI-MD CORE ACCESS
// Description: Bascule le système entre l'accès restreint et l'accès global

const { updateSetting } = require('../../lib/database');

module.exports = {
    name: 'mode',
    aliases: ['access', 'botmode'],
    category: 'owner',
    description: 'Bascule le bot entre le mode PUBLIC et PRIVÉ',
    usage: 'mode <public/private>',
    
    ownerOnly: true,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        const newMode = args[0]?.toLowerCase();

        // 1. Validation de l'input
        if (!['public', 'private'].includes(newMode)) {
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚠️ SECURITY ALERT ] ──*\n\nArgument invalide. Définissez le périmètre d'accès.\n*Usage :* .mode public | private` 
            }, { quoted: message });
        }

        // 2. Mise à jour du noyau
        updateSetting('mode', newMode);

        // 3. Réaction Cyber
        await sock.sendMessage(remoteJid, { react: { text: newMode === 'public' ? "🌐" : "🔐", key: message.key } });

        // 4. Rapport de déploiement
        const isPublic = newMode === 'public';
        const report = `*─── 『 RICHI-MD SYSTEM 』 ───*\n\n`
            + `*🛡️ PROTOCOLE :* ACCESS_CONTROL\n`
            + `*📊 STATUT :* ${newMode.toUpperCase()}\n\n`
            + `*Note :* ${isPublic 
                ? "Le noyau est désormais accessible à tous les sujets." 
                : "Accès restreint activé. Seul l'administrateur système peut interagir."}\n\n`
            + `*© KERNEL_MODIFICATION_COMPLETE*`;

        await sock.sendMessage(remoteJid, { text: report }, { quoted: message });
    }
};