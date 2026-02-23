// 📜 Plugin: RICHI-MD KERNEL TERMINAL (ULTIMATE DARK-NET EDITION)
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { getSettings } = require('../../lib/database');
const { styleText, formatUptime } = require('../../lib/functions');

module.exports = {
    name: 'menu',
    aliases: ['help', 'richi', 'terminal'],
    category: 'misc',
    description: 'Interface d\'accès au noyau Richi-MD',

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        
        // 1. Récupération des réglages
        const settings = getSettings();
        const prefix = settings.prefix || config.prefix;
        const botName = (settings.botName || "RICHI-MD").toUpperCase();
        const username = message.pushName || "USER_UNKNOWN";

        // 2. Gestion de l'image locale ren.jpg
        const localImgPath = path.join(__dirname, '../../ren.jpg');
        const menuImage = fs.existsSync(localImgPath) ? fs.readFileSync(localImgPath) : { url: "https://i.postimg.cc/mDhT0csk/5d815d55908eafd04d29d88e5146a0f9.jpg" };

        await sock.sendMessage(remoteJid, { react: { text: "🔌", key: message.key } });

        // 3. Header ASCII & Logs (Nettoyé des bugs d'encodage)
        let caption = `        RICHI-MD KERNEL V3\n`;
        caption += `====================================\n\n`;
        
        caption += `[☠️] DECRYPTING_SYSTEM... [OK]\n`;
        caption += `[🔓] BYPASSING_FIREWALL... [OK]\n\n`;

        caption += `╔══════════『 **DATABASE** 』═════════╗\n`;
        caption += `  ⚡ **ID** : ${botName}_NET_V4\n`;
        caption += `  👤 **OPERATOR** : ${username}\n`;
        caption += `  ⏳ **UPTIME** : ${formatUptime(process.uptime())}\n`;
        caption += `  🗝️ **ACCESS** : [ ${prefix} ]\n`;
        caption += `  🌐 **NETWORK** : RICHI_PRIVATE_VPN\n`;
        caption += `╚════════════════════════════════╝\n\n`;

        // 4. Boucle des Talents (Scan récursif)
        const pluginsDir = path.join(__dirname, '../../plugins');
        const categories = fs.readdirSync(pluginsDir);
        let totalCmds = 0;

        categories.forEach(category => {
            const catPath = path.join(pluginsDir, category);
            if (fs.lstatSync(catPath).isDirectory()) {
                const files = fs.readdirSync(catPath).filter(file => file.endsWith('.js'));
                
                if (files.length > 0) {
                    caption += `📂 **DIR://**${category.toUpperCase()}\n`;
                    
                    files.forEach(file => {
                        try {
                            const pluginModule = require(path.join(catPath, file));
                            const commands = Array.isArray(pluginModule) ? pluginModule : [pluginModule];

                            commands.forEach(plugin => {
                                if (plugin.name) {
                                    caption += `  ﹂ \`${prefix}${plugin.name}\`\n`;
                                    totalCmds++;
                                }
                            });
                        } catch (e) {}
                    });
                    caption += `\n`;
                }
            }
        });

        caption += `====================================\n`;
        caption += `[!] STATUS: OPERATIONAL\n`;
        caption += `[!] TOTAL_MODULES: ${totalCmds}\n`;
        caption += `[!] CREATED_BY: RICHI_DEV`;

        // 5. Envoi Final avec AdReply Ghost
        await sock.sendMessage(remoteJid, {
            image: menuImage,
            caption: styleText(caption),
            contextInfo: {
                externalAdReply: {
                    title: `⚠️ SYSTEM_INTRUSION_DETECTED`,
                    body: `RICHI-MD : PRIVATE_CYBER_CONSOLE`,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnail: menuImage,
                    sourceUrl: "https://github.com/Richi", 
                    showAdAttribution: true
                }
            }
        }, { quoted: message });
    }
};