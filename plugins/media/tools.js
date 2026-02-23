// 🖼️ Plugin: RICHI-MD MEDIA DECODER
// Description: Conversion de protocoles média (Sticker -> Image)

const { downloadContentFromMessage } = require('gifted-baileys');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = [
    {
        name: 'toimg',
        aliases: ['img', 'extract'],
        category: 'media',
        description: 'Extrait une image à partir d\'un sticker',
        usage: 'toimg (en répondant à un sticker)',
        
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            // Vérification si c'est bien un sticker
            if (!quoted || !quoted.stickerMessage) {
                return sock.sendMessage(remoteJid, { 
                    text: `*── [ ⚠️ ALERTE ] ──*\n\nNégatif. Veuillez cibler un *Sticker* pour lancer l'extraction d'image.` 
                });
            }

            // Réaction de décodage
            await sock.sendMessage(remoteJid, { react: { text: '💾', key: message.key } });

            try {
                // Téléchargement du flux WebP
                const stream = await downloadContentFromMessage(quoted.stickerMessage, 'sticker');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

                // Définition des dossiers temporaires
                const tempDir = path.join(__dirname, '../../temp');
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

                const fileName = `Richi_${Date.now()}`;
                const inputPath = path.join(tempDir, `${fileName}.webp`);
                const outputPath = path.join(tempDir, `${fileName}.png`);

                fs.writeFileSync(inputPath, buffer);

                // Conversion via FFMPEG (Décodage cybernétique)
                exec(`ffmpeg -i "${inputPath}" "${outputPath}"`, async (err) => {
                    // Nettoyage du fichier source immédiatement
                    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

                    if (err) {
                        console.error(err);
                        return sock.sendMessage(remoteJid, { text: `*❌ ERREUR :* Échec du décodage du flux binaire.` });
                    }

                    // Envoi de l'image extraite
                    await sock.sendMessage(remoteJid, { 
                        image: { url: outputPath },
                        caption: `*─── 『 RICHI-MD DECODER 』 ───*\n\n*✅ Extraction terminée.*\n*Flux converti en PNG.*`
                    }, { quoted: message });

                    // Nettoyage final
                    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                });

            } catch (e) {
                console.error('Media Tool Error:', e);
                sock.sendMessage(remoteJid, { text: `*❌ ERREUR CRITIQUE :* Noyau de conversion instable.` });
            }
        }
    }
];