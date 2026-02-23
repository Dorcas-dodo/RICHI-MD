// 📡 Plugin: RICHI-MD SIGNAL LINK
// Description: Synchronisation du flux de données vers le canal de diffusion

const { updateSetting } = require('../../lib/database');

module.exports = {
    name: 'setnewsletter',
    aliases: ['setnews', 'channel'],
    category: 'owner',
    description: 'Configure l\'identifiant JID du canal de diffusion (Newsletter)',
    usage: 'setnewsletter <jid>',
    
    ownerOnly: true,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        const newJid = args[0];

        // 1. Validation du flux entrant
        if (!newJid || !newJid.includes('@newsletter')) {
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚠️ SIGNAL_ERROR ] ──*\n\nIdentifiant JID invalide. Le flux doit se terminer par *@newsletter*.\n\n*Exemple :* 120363290000000000@newsletter` 
            }, { quoted: message });
        }

        // 2. Réaction de liaison satellite
        await sock.sendMessage(remoteJid, { react: { text: "📡", key: message.key } });

        // 3. Injection dans les paramètres du noyau
        updateSetting('newsletterJid', newJid);

        // 4. Rapport de synchronisation
        const report = `*─── 『 RICHI-MD CORE 』 ───*\n\n`
            + `*🛠️ MODULE :* SIGNAL_SYNC\n`
            + `*📡 CHANNEL_ID :* ${newJid}\n`
            + `*📊 STATUS :* LINK_ESTABLISHED\n\n`
            + `*Note :* Toutes les transmissions du système incluront désormais un lien vers ce canal de données.\n\n`
            + `*© SIGNAL_BROADCAST_RECONFIGURED*`;

        await sock.sendMessage(remoteJid, { text: report }, { quoted: message });
    }
};