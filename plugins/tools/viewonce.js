// 👁️ Plugin: RICHI-MD DATA LEAK (ViewOnce Bypass - Private Mode)
// Description: Intercepte et envoie les médias V1/V2 directement en privé

const { downloadContentFromMessage } = require('gifted-baileys');
const config = require('../../config');

module.exports = {
    name: 'viewonce',
    aliases: ['vv', 'reveal', 'antiviewonce'],
    category: 'tools',
    description: 'Extrait et envoie les médias à vue unique en privé',
    usage: 'vv (en réponse à un média)',

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;

        try {
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            
            if (!quoted) {
                return sock.sendMessage(remoteJid, { 
                    text: `*── [ ⚠️ NO_DATA ] ──*\n\nVeuillez cibler un message à vue unique.` 
                });
            }

            // Détection du contenu (V1 ou V2)
            const v2 = quoted.viewOnceMessageV2?.message;
            const v1 = quoted.viewOnceMessage?.message;
            const container = v2 || v1;

            let mediaMsg = null;
            let type = null;

            if (container) {
                type = Object.keys(container)[0].replace('Message', '');
                mediaMsg = container[Object.keys(container)[0]];
            } else if (quoted.imageMessage?.viewOnce || quoted.videoMessage?.viewOnce || quoted.audioMessage?.viewOnce) {
                type = Object.keys(quoted)[0].replace('Message', '');
                mediaMsg = quoted[Object.keys(quoted)[0]];
            }

            if (!mediaMsg) {
                return sock.sendMessage(remoteJid, { 
                    text: `*── [ ⚠️ ERROR ] ──*\n\nFlux à vue unique non détecté.` 
                });
            }

            // Réaction discrète
            await sock.sendMessage(remoteJid, { react: { text: '🕵️', key: message.key } });

            // Extraction
            const stream = await downloadContentFromMessage(mediaMsg, type);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            // --- CONFIGURATION DE LA DESTINATION PRIVÉE ---
            // On récupère ton propre numéro (le propriétaire du bot)
            const myJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            
            const caption = `*─── 『 RICHI-MD PRIVATE REVEAL 』 ───*\n\n*📂 TYPE :* ${type.toUpperCase()}\n*📡 ORIGINE :* ${remoteJid.endsWith('@g.us') ? 'GROUPE' : 'PRIVÉ'}\n${mediaMsg.caption ? `*📝 CAPTION :* ${mediaMsg.caption}` : ''}\n\n*© GHOST_INTERCEPT_SUCCESS*`;

            const finalMsg = {};
            if (type === 'audio') {
                finalMsg.audio = buffer;
                finalMsg.mimetype = 'audio/mpeg';
                finalMsg.ptt = false;
            } else {
                finalMsg[type] = buffer;
                finalMsg.caption = caption;
            }

            // 1. ENVOI EN PRIVÉ (Chez toi)
            await sock.sendMessage(myJid, finalMsg);

            // 2. Notification dans la conversation actuelle (pour savoir que c'est fait)
            await sock.sendMessage(remoteJid, { 
                text: `*✅ Média intercepté !* Vérifie tes messages privés pour voir le contenu.` 
            }, { quoted: message });

        } catch (error) {
            console.error('ViewOnce Error:', error);
            sock.sendMessage(remoteJid, { text: `*❌ ERREUR :* Échec de l'interception furtive.` });
        }
    }
};