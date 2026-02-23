// 📤 Lib: RICHI-MD MEDIA UPLOADER
// Description: Protocole d'exfiltration de fichiers vers serveurs Cloud (Telegra.ph/Catbox)

const axios = require('axios');
const FormData = require('form-data');
const { downloadContentFromMessage } = require('gifted-baileys');
const { fileTypeFromBuffer } = require('file-type');
const chalk = require('chalk');

/**
 * Service Alpha: Telegra.ph (Optimisé pour images < 5MB)
 */
async function telegraph(buffer) {
    try {
        const ft = await fileTypeFromBuffer(buffer);
        const form = new FormData();
        form.append('file', buffer, `richi.${ft.ext}`);
        
        const { data } = await axios.post('https://telegra.ph/upload', form, {
            headers: form.getHeaders()
        });
        
        return 'https://telegra.ph' + data[0].src;
    } catch (e) {
        throw new Error('TELEGRAPH_FAILURE');
    }
}

/**
 * Service Beta: Catbox.moe (Stockage robuste pour vidéos et gros fichiers)
 */
async function catbox(buffer) {
    try {
        const ft = await fileTypeFromBuffer(buffer);
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', buffer, `richi.${ft.ext}`);
        
        const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders()
        });
        
        if (typeof data === 'string' && data.startsWith('http')) return data.trim();
        throw new Error('CATBOX_INVALID_RESPONSE');
    } catch (e) {
        throw new Error('CATBOX_FAILURE');
    }
}

/**
 * Moteur principal : Détection de flux et routage vers serveur distant
 * @param {Object} mediaMessage - Objet message de Baileys
 */
async function uploadMedia(mediaMessage) {
    try {
        const type = Object.keys(mediaMessage)[0];
        const stream = await downloadContentFromMessage(
            mediaMessage[type], 
            type.replace('Message', '').toLowerCase()
        );
        
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        console.log(chalk.cyan(`[ 📡 UPLOAD ] Flux détecté : ${type} | Taille : ${buffer.length} octets`));

        // ROUTAGE INTELLIGENT
        // Images légères -> Telegra.ph | Vidéos/Gros fichiers -> Catbox
        if (type === 'imageMessage' && buffer.length < 5242880) {
            try {
                return await telegraph(buffer);
            } catch (e) {
                console.warn(chalk.yellow(`[ ⚠️ UPLOAD ] Alpha fail, bascule sur protocole Beta...`));
            }
        }

        return await catbox(buffer);

    } catch (error) {
        console.error(chalk.red(`[ ❌ UPLOAD_ERROR ] Échec de l'exfiltration :`), error.message);
        return null;
    }
}

module.exports = { uploadMedia };