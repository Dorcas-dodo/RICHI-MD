// 📣 Plugin: RICHI-MD G-STATUS
// Description: Diffusion de contenu en mode Statut de Groupe

const { downloadContentFromMessage } = require('gifted-baileys');

module.exports = {
    name: 'gstatus',
    aliases: ['bg', 'broadcast', 'annonce'],
    category: 'group',
    description: 'Diffuse un média ou un texte en format statut au groupe',
    usage: 'gstatus (répondez à un média ou texte)',
    
    groupOnly: true,
    adminOnly: true,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid, pushName } = msgOptions;
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const targetMessage = quoted || message.message;
        
        // Vérification de la présence de contenu
        if (!quoted && !args.length) {
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚠️ ALERTE ] ──*\n\nSalut *${pushName}*, veuillez répondre à un média (Image/Vidéo/Audio) ou entrer un texte pour diffuser l'annonce.` 
            });
        }

        // Réaction de traitement
        await sock.sendMessage(remoteJid, { react: { text: '📡', key: message.key } });

        try {
            let statusContent = {};

            // 1. Détection IMAGE
            if (targetMessage.imageMessage) {
                const stream = await downloadContentFromMessage(targetMessage.imageMessage, 'image');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

                statusContent = { 
                    image: buffer, 
                    caption: targetMessage.imageMessage.caption || args.join(' ') 
                };
            } 
            // 2. Détection VIDÉO
            else if (targetMessage.videoMessage) {
                const stream = await downloadContentFromMessage(targetMessage.videoMessage, 'video');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

                statusContent = { 
                    video: buffer, 
                    caption: targetMessage.videoMessage.caption || args.join(' ') 
                };
            }
            // 3. Détection AUDIO
            else if (targetMessage.audioMessage) {
                const stream = await downloadContentFromMessage(targetMessage.audioMessage, 'audio');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

                statusContent = { 
                    audio: buffer, 
                    mimetype: 'audio/mp4',
                    ptt: true 
                };
            }
            // 4. Détection TEXTE pur
            else {
                const text = quoted ? (quoted.conversation || quoted.extendedTextMessage?.text) : args.join(' ');
                statusContent = { 
                    text: text,
                    backgroundColor: '#000000', // Noir profond style Richi
                    font: 4 // Police stylisée
                };
            }

            // Transmission du flux au groupe sous format statut
            await sock.sendMessage(remoteJid, { 
                groupStatusMessage: statusContent 
            });

            // Confirmation de succès
            await sock.sendMessage(remoteJid, { react: { text: '🌌', key: message.key } });

        } catch (e) {
            console.error('Erreur GStatus Richi-MD:', e);
            await sock.sendMessage(remoteJid, { 
                text: `*── [ ❌ CRITICAL ERROR ] ──*\n\nÉchec de la diffusion. Le noyau n'a pas pu traiter le média.` 
            });
        }
    }
};