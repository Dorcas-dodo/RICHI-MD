// 🎨 Lib: RICHI-MD UI & CONTEXT ENGINE
// Description: Gestion des bannières publicitaires, métadonnées Newsletter et AdReply

const config = require('../config');

/**
 * Génère le badge de transfert via la Newsletter officielle
 */
function getNewsletterContext(settings = {}) {
    return {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: settings.newsletterJid || config.newsletterJid || '120363161513685998@newsletter',
            newsletterName: settings.botName || config.botName || 'RICHI-MD CORE',
            serverMessageId: -1
        }
    };
}

/**
 * Génère la bannière visuelle interactive (ExternalAdReply)
 */
function getAdReplyContext(settings = {}) {
    return {
        externalAdReply: {
            title: settings.botName || config.botName || 'RICHI-MD',
            body: "ꜱʏꜱᴛᴇᴍ ᴏᴘᴇʀᴀᴛɪᴏɴᴀʟ : ʙʏ ꜱᴛᴇᴘʜᴛᴇᴄʜ",
            thumbnailUrl: config.logoUrl || 'https://i.postimg.cc/8cKZBMZw/lv-0-20251105211949.jpg',
            sourceUrl: config.channelUrl || 'https://whatsapp.com/channel/0029Vb6DrnUHAdNQtz2GC307',
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
        }
    };
}

/**
 * Construit l'objet contextInfo final selon les exigences du plugin
 * @param {Object} command - Les propriétés du plugin exécuté
 * @param {Object} settings - Les paramètres actuels du noyau
 */
function buildMessageOptions(command, settings = {}) {
    let contextInfo = {};

    // Injection du badge Newsletter (si activé pour cette commande)
    if (command.newsletterShow) {
        Object.assign(contextInfo, getNewsletterContext(settings));
    }

    // Injection de la bannière visuelle (si activé pour cette commande)
    if (command.contextInfo) {
        // On fusionne avec ce qui existe déjà (pour ne pas écraser la newsletter)
        const adReply = getAdReplyContext(settings);
        contextInfo.externalAdReply = adReply.externalAdReply;
    }

    return Object.keys(contextInfo).length > 0 ? { contextInfo } : {};
}

module.exports = {
    getNewsletterContext,
    getAdReplyContext,
    buildMessageOptions
};