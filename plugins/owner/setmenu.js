// 🖼️ Plugin: RICHI-MD VISUAL OVERRIDE
// Description: Mise à jour des banques d'images du noyau (Menu)

const { updateSetting } = require('../../lib/database');

module.exports = {
    name: 'setmenuimage',
    aliases: ['setmenu', 'menuimg'],
    category: 'owner',
    description: 'Injecte de nouvelles URLs pour les visuels du menu',
    usage: 'setmenu <url1> <url2> ...',
    
    ownerOnly: true,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;

        // 1. Vérification de la présence d'arguments
        if (args.length === 0) {
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚠️ DATA_ERROR ] ──*\n\nAucun flux détecté. Veuillez fournir une ou plusieurs URLs d'images.` 
            }, { quoted: message });
        }

        // 2. Filtrage des liens (Validation du protocole HTTP/HTTPS)
        const urls = args.filter(arg => arg.startsWith('http'));
        
        if (urls.length === 0) {
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚠️ PROTOCOL_ERROR ] ──*\n\nLes liens fournis sont invalides ou corrompus.` 
            }, { quoted: message });
        }

        // 3. Réaction de mise à jour système
        await sock.sendMessage(remoteJid, { react: { text: "🖼️", key: message.key } });

        // 4. Injection dans la Base de Données
        updateSetting('menuImages', urls);

        // 5. Rapport de déploiement visuel
        const report = `*─── 『 RICHI-MD CORE 』 ───*\n\n`
            + `*🛠️ MODULE :* VISUAL_RECONFIG\n`
            + `*📂 IMAGES CHARGÉES :* ${urls.length}\n`
            + `*📊 STATUS :* UPLOAD_SUCCESS\n\n`
            + `*Note :* La banque d'images du menu a été synchronisée. Les nouveaux visuels seront alternés de manière aléatoire.\n\n`
            + `*© GRAPHIC_KERNEL_UPDATED*`;

        await sock.sendMessage(remoteJid, { text: report }, { quoted: message });
    }
};