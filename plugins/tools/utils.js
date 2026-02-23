// 📡 Plugin: RICHI-MD UTILITY OPS
// Description: Surveillance web, Upload de données et Gestion de profil

const { uploadMedia } = require('../../lib/mediaUpload');

module.exports = [
    {
        name: 'ssweb',
        aliases: ['screen', 'capture'],
        category: 'tools',
        description: 'Capture d\'écran d\'une interface web distante',
        usage: 'ssweb <url>',
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const url = args[0];
            if (!url) return sock.sendMessage(remoteJid, { text: `*── [ ⚠️ URL_MISSING ] ──*\n\nVeuillez fournir l'adresse du site à scanner.` });
            
            await sock.sendMessage(remoteJid, { react: { text: '📸', key: message.key } });

            // Utilisation d'une API de rendu web
            const imgUrl = `https://api.giftedtech.co.ke/api/tools/ssweb?apikey=gifted&url=${encodeURIComponent(url)}`;
            
            await sock.sendMessage(remoteJid, { 
                image: { url: imgUrl },
                caption: `*─── 『 RICHI-MD SCAN 』 ───*\n\n*🌐 TARGET :* ${url}\n*📊 STATUS :* CAPTURE_COMPLETE`
            }, { quoted: message });
        }
    },
    {
        name: 'tourl',
        aliases: ['upload', 'host'],
        category: 'tools',
        description: 'Téléverse un média vers un serveur de stockage cloud',
        usage: 'tourl (répondre à une image/vidéo)',
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || message.message;
            
            const type = Object.keys(quoted).find(key => key === 'imageMessage' || key === 'videoMessage');
            if (!type) return sock.sendMessage(remoteJid, { text: `*── [ ⚠️ NO_MEDIA ] ──*\n\nCiblez un fichier binaire (Image/Vidéo) pour générer un lien.` });

            await sock.sendMessage(remoteJid, { react: { text: '☁️', key: message.key } });

            try {
                const mediaMsg = {};
                mediaMsg[type] = quoted[type];
                
                const url = await uploadMedia(mediaMsg);
                
                await sock.sendMessage(remoteJid, { 
                    text: `*─── 『 RICHI-MD HOSTING 』 ───*\n\n*🔗 CLOUD_URL :*\n${url}\n\n*© DATA_UPLOAD_SUCCESS*` 
                }, { quoted: message });
            } catch (e) {
                sock.sendMessage(remoteJid, { text: `*❌ ERREUR :* Échec du transfert vers le serveur distant.` });
            }
        }
    },
    {
        name: 'getpp',
        aliases: ['profile'],
        category: 'tools',
        description: 'Extrait la photo de profil d\'un sujet',
        usage: 'getpp (@user ou group)',
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            const quoted = message.message?.extendedTextMessage?.contextInfo?.participant;
            
            let target = quoted || mentioned || message.key.remoteJid;
            if (args[0] === 'group') target = remoteJid;

            try {
                const pp = await sock.profilePictureUrl(target, 'image');
                await sock.sendMessage(remoteJid, { 
                    image: { url: pp },
                    caption: `*─── 『 RICHI-MD IDENTIFIER 』 ───*\n\n*👤 TARGET :* @${target.split('@')[0]}\n*📦 DATA :* PROFILE_PICTURE`,
                    mentions: [target]
                }, { quoted: message });
            } catch (e) {
                sock.sendMessage(remoteJid, { text: `*❌ ERREUR :* Impossible d'accéder à l'image. Le sujet a peut-être restreint ses accès.` });
            }
        }
    },
    {
        name: 'delete',
        aliases: ['del', 'purge'],
        category: 'tools',
        description: 'Supprime une entrée de message (Si autorisé)',
        usage: 'delete (en réponse)',
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const context = message.message?.extendedTextMessage?.contextInfo;
            if (!context?.stanzaId) return;
            
            const key = {
                remoteJid: remoteJid,
                fromMe: context.participant === sock.user.id || true,
                id: context.stanzaId,
                participant: context.participant
            };
            
            await sock.sendMessage(remoteJid, { delete: key });
        }
    }
];