// 🆔 Plugin: RICHI-MD IDENTITY OVERRIDE
// Description: Reprogrammation du nom de l'unité centrale

const { updateSetting } = require('../../lib/database');

module.exports = {
    name: 'setname',
    aliases: ['setbotname', 'botname', 'rename'],
    category: 'owner',
    description: 'Modifie l\'identifiant nominal du bot dans la base de données',
    usage: 'setname <nouveau_nom>',
    
    ownerOnly: true,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        const newName = args.join(' ');

        // 1. Vérification de l'entrée binaire
        if (!newName) {
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚠️ IDENTITY_ERROR ] ──*\n\nAucun identifiant détecté. Veuillez entrer le nouveau nom du sujet.` 
            }, { quoted: message });
        }

        // 2. Réaction de modification du registre
        await sock.sendMessage(remoteJid, { react: { text: "📛", key: message.key } });

        // 3. Mise à jour du noyau (Base de données)
        updateSetting('botName', newName);

        // 4. Rapport de déploiement d'identité
        const report = `*─── 『 RICHI-MD CORE 』 ───*\n\n`
            + `*🛠️ MODULE :* IDENTITY_RECONFIG\n`
            + `*🆔 NEW_ID :* ${newName.toUpperCase()}\n`
            + `*📊 STATUS :* REGISTRY_UPDATED\n\n`
            + `*Note :* L'unité sera désormais reconnue sous le nom de ${newName} dans tous les en-têtes de protocole.\n\n`
            + `*© KERNEL_IDENTITY_REWRITTEN*`;

        await sock.sendMessage(remoteJid, { text: report }, { quoted: message });
    }
};