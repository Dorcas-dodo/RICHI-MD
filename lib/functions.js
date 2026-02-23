// 🛠️ Lib: RICHI-MD UTILITIES
// Description: Moteur de stylisation textuelle et utilitaires système

/**
 * Convertit le texte standard en typographie "Small Caps" Cyber.
 * @param {string} text 
 */
function styleText(text) {
    if (!text) return text;
    const normalChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fancyChars = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789';
    
    return text.split('').map(char => {
        const index = normalChars.indexOf(char);
        return index !== -1 ? fancyChars[index] : char;
    }).join('');
}

/**
 * Formate le temps d'activité du noyau (Uptime).
 * @param {number} seconds 
 */
function formatUptime(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    
    return parts.join(' : ');
}

/**
 * Génère un identifiant aléatoire pour les fichiers temporaires.
 * @param {string} ext - Extension du fichier (ex: 'mp4')
 */
function getRandom(ext = '') {
    return `${Math.floor(Math.random() * 1000000)}${ext ? '.' + ext : ''}`;
}

/**
 * Convertit des octets en format lisible (KB, MB, GB).
 */
function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = { 
    styleText, 
    formatUptime, 
    getRandom, 
    formatSize 
};