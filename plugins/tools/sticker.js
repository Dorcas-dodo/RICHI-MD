// 🛠️ Plugin: RICHI-MD STICKER ENGINE
// Description: Encodage de flux média en protocole WebP (Sticker)

const { downloadContentFromMessage } = require('gifted-baileys');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
    name: 'sticker',
    aliases: ['s', 'stick', 'k'],
    category: 'tools',
    description: 'Convertit une image ou une vidéo en sticker cybernétique',
    usage: 'sticker (en réponse à un média)',

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;

        try {
            // 1. Identification du flux
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || message.message;
            const mime = (quoted.imageMessage || quoted.videoMessage || quoted.stickerMessage)?.mimetype || '';
            
            if (!mime) {
                return sock.sendMessage(remoteJid, { 
                    text: `*── [ ⚠️ NO_DATA ] ──*\n\nAucun flux média détecté. Veuillez cibler une image ou une vidéo.` 
                });
            }

            await sock.sendMessage(remoteJid, { react: { text: '🌀', key: message.key } });

            // 2. Téléchargement du binaire
            const type = Object.keys(quoted)[0].replace('Message', '');
            const stream = await downloadContentFromMessage(quoted[Object.keys(quoted)[0]], type);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            // 3. Préparation des vecteurs de sortie
            const tempDir = path.join(__dirname, '../../temp');
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

            const fileName = `Richi_${Date.now()}`;
            const inputPath = path.join(tempDir, `${fileName}.${mime.split('/')[1].split(';')[0]}`);
            const outputPath = path.join(tempDir, `${fileName}.webp`);

            fs.writeFileSync(inputPath, buffer);

            // 4. Commande FFMPEG (Optimisée pour WhatsApp)
            // -vf : Redimensionne en 512x512, 15fps max pour le poids, padding transparent
            const ffmpegCmd = `ffmpeg -i "${inputPath}" -vcodec libwebp -vf "scale='min(512,iw)':min'(512,ih)':force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0" -loop 0 -ss 00:00:00 -t 00:00:07 -preset default -an -vsync 0 "${outputPath}"`;

            exec(ffmpegCmd, async (error) => {
                if (error) {
                    console.error("FFMPEG Error:", error);
                    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                    return sock.sendMessage(remoteJid, { text: `*❌ ERREUR :* Échec de l'encodage du flux.` });
                }

                // 5. Injection du sticker dans le chat
                const stickerBuffer = fs.readFileSync(outputPath);
                await sock.sendMessage(remoteJid, { sticker: stickerBuffer }, { quoted: message });
                
                // 6. Nettoyage des traces (Cyber-clean)
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            });

        } catch (error) {
            console.error('Sticker Error:', error);
            sock.sendMessage(remoteJid, { text: `*❌ ERREUR CRITIQUE :* Noyau d'encodage instable.` });
        }
    }
};