// 🧠 Lib: RICHI-MD INTERACTIVE STORE
// Description: Mémoire vive pour la gestion des sessions interactives et files d'attente

const commandStore = new Map();

/**
 * Enregistre une session interactive dans le cache volatil.
 * @param {string} userId - JID de l'utilisateur
 * @param {string} chatId - JID du groupe/chat
 * @param {Object} data - Données du protocole (ex: { type: 'yt_download', results: [...] })
 */
function saveRequest(userId, chatId, data) {
    const key = `${userId}-${chatId}`;
    commandStore.set(key, { 
        ...data, 
        timestamp: Date.now() 
    });
}

/**
 * Extrait la session active pour un sujet donné.
 */
function getRequest(userId, chatId) {
    const key = `${userId}-${chatId}`;
    return commandStore.get(key);
}

/**
 * Purge une session terminée.
 */
function deleteRequest(userId, chatId) {
    const key = `${userId}-${chatId}`;
    commandStore.delete(key);
}

/**
 * 🛡️ GARBAGE COLLECTOR
 * Nettoyage cyclique des sessions expirées (TTL: 5 Minutes)
 */
setInterval(() => {
    const now = Date.now();
    let purged = 0;
    commandStore.forEach((value, key) => {
        if (now - value.timestamp > 5 * 60 * 1000) {
            commandStore.delete(key);
            purged++;
        }
    });
    if (purged > 0) {
        // Log discret en console pour le monitoring du noyau
        // console.log(`[ 🧹 STORE ] Purge de ${purged} session(s) expirée(s).`);
    }
}, 60 * 1000); // Scan toutes les minutes

module.exports = { saveRequest, getRequest, deleteRequest };