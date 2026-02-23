// 📘 Plugin: RICHI-MD FACEBOOK DOWNLOADER
// Description: Extraction de flux vidéo haute vitesse

const axios = require('axios');
const config = require('../../config');
const API_KEY = 'gifted'; // Ta clé actuelle

module.exports = {
    name: 'facebook',
    aliases: ['fb', 'fbdl'],
    category: 'download',
    description: 'Télécharge une vidéo Facebook (HD/SD)',
    usage: 'fb <url>',

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid, pushName } = msgOptions;
        const url = args[0];

        if (!url) {
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚡ RICHI-MD DL ] ──*\n\nNégatif *${pushName}*, j'ai besoin d'une URL Facebook valide pour lancer l'extraction.` 
            });
        }

        // Réaction d'initialisation (Cyber style)
        await sock.sendMessage(remoteJid, { react: { text: '📡', key: message.key } });

        try {
            const { data } = await axios.get(`https://api.giftedtech.co.ke/api/download/facebook?apikey=${API_KEY}&url=${encodeURIComponent(url)}`);
            
            if (data.success) {
                const videoUrl = data.result.hd_video || data.result.sd_video;
                const title = data.result.title || 'Flux_Video_Anonyme';

                const caption = `*─── 『 RICHI-MD EXTRACTOR 』 ───*\n\n` +
                                `*📥 Cible:* ${title}\n` +
                                `*⚙️ Qualité:* ${data.result.hd_video ? 'Haute Définition (HD)' : 'Standard (SD)'}\n` +
                                `*👤 Demandeur:* ${pushName}\n\n` +
                                `*>> Cryptage du transfert terminé...*`;

                // Envoi de la vidéo
                await sock.sendMessage(remoteJid, { 
                    video: { url: videoUrl }, 
                    caption: caption 
                }, { quoted: message });
                
                // Réaction de succès
                await sock.sendMessage(remoteJid, { react: { text: '💾', key: message.key } });

            } else {
                throw new Error('API_REJECTED');
            }
        } catch (e) {
            console.error('Erreur FB Richi-MD:', e);
            sock.sendMessage(remoteJid, { 
                text: `*── [ ❌ CRITICAL ERROR ] ──*\n\nImpossible d'accéder au serveur source. Le lien est peut-être mort ou privé.` 
            });
        }
    }
};