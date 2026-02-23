// ⌨️ Plugin: RICHI-MD PREFIX OVERRIDE
// Description: Reconfiguration de la clé d'accès aux commandes du noyau

const { updateSetting } = require('../../lib/database');

module.exports = {
    name: 'setprefix',
    aliases: ['prefix', 'setpref'],
    category: 'owner',
    description: 'Modifie le symbole de déclenchement des protocoles',
    usage: 'setprefix <symbole>',
    
    ownerOnly: true,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        const newPrefix = args[0];

        // 1. Validation de la clé d'entrée
        if (!newPrefix) {
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚠️ INPUT_REQUIRED ] ──*\n\nAucun symbole détecté. Veuillez fournir la nouvelle clé d'accès (ex: !, ., /).` 
            }, { quoted: message });
        }

        // 2. Réaction de reconfiguration binaire
        await sock.sendMessage(remoteJid, { react: { text: "🔑", key: message.key } });

        // 3. Injection dans les registres du noyau
        updateSetting('prefix', newPrefix);

        // 4. Rapport de déploiement de la nouvelle clé
        const report = `*─── 『 RICHI-MD CORE 』 ───*\n\n`
            + `*🛠️ MODULE :* ACCESS_KEY_RECONFIG\n`
            + `*⌨️ NEW_PREFIX :* [ ${newPrefix} ]\n`
            + `*📊 STATUS :* ENCRYPTION_UPDATED\n\n`
            + `*Note :* Toutes les commandes devront désormais être précédées du symbole "${newPrefix}" pour être interprétées par le noyau.\n\n`
            + `*© ACCESS_PROTOCOL_REWRITTEN*`;

        await sock.sendMessage(remoteJid, { text: report }, { quoted: message });
    }
};