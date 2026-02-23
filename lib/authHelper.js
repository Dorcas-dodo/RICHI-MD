// 🔐 Lib: RICHI-MD KERNEL AUTH
// Description: Pare-feu et gestionnaire de privilèges multi-niveaux

const NodeCache = require('node-cache');
const chalk = require('chalk');
const config = require('../config');
const { getSettings } = require('./database');

// Cache tactique pour les métadonnées de secteur (Groupes)
const groupMetadataCache = new NodeCache({
    stdTTL: 600, // 10 minutes
    checkperiod: 180,
    useClones: false
});

/**
 * Nettoie et normalise l'identifiant pour comparaison binaire
 */
function normalizeJid(jid) {
    if (!jid) return "";
    // Supprime le suffixe d'appareil (:1, :2) et garde le JID propre avant @
    return jid.split(':')[0].toLowerCase();
}

/**
 * Récupération des protocoles de secteur (Metadata) avec protection anti-spam
 */
async function getGroupMetadataSafe(sock, chatId) {
    if (!chatId.endsWith('@g.us')) return null;
    
    const cached = groupMetadataCache.get(chatId);
    if (cached) return cached;

    try {
        const metadata = await sock.groupMetadata(chatId);
        if (metadata) {
            groupMetadataCache.set(chatId, metadata);
        }
        return metadata;
    } catch (error) {
        const errCode = error?.output?.statusCode || 0;
        if (errCode === 428 || errCode === 429) {
            console.warn(chalk.red.bold(`[ ⚠️ FIREWALL ] Rate Limit détecté sur le secteur : ${chatId}`));
        }
        return null;
    }
}

/**
 * Vérifie si le sujet possède les accès Admin du secteur
 */
async function isAdmin(sock, chatId, user) {
    if (!chatId.endsWith('@g.us')) return false;
    try {
        const metadata = await getGroupMetadataSafe(sock, chatId);
        if (!metadata || !metadata.participants) return false;
        
        const participant = metadata.participants.find(p => normalizeJid(p.id) === normalizeJid(user));
        return !!(participant && (participant.admin === 'admin' || participant.admin === 'superadmin'));
    } catch (error) {
        return false;
    }
}

/**
 * Vérifie si le sujet possède les accès ROOT (Owner)
 */
function isOwner(sock, msg) {
    try {
        if (msg.key.fromMe) return true;
        
        const senderId = msg.key.participant || msg.key.remoteJid;
        if (!senderId) return false;

        const senderJid = normalizeJid(senderId);
        
        // Vérification via la liste de confiance du config
        return config.ownerNumber.some(owner => {
            const cleanOwner = owner.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            return normalizeJid(cleanOwner) === senderJid;
        });
    } catch (e) {
        return false;
    }
}

/**
 * Vérifie si le sujet est un opérateur SUDO (Noyau)
 */
function isSudo(userJid) {
    try {
        const settings = getSettings();
        const sudos = settings.sudo || [];
        const cleanJid = normalizeJid(userJid);
        
        return sudos.some(s => normalizeJid(s).includes(cleanJid.split('@')[0]));
    } catch (e) {
        return false;
    }
}

module.exports = { 
    isAdmin,
    isOwner,
    isSudo,
    getGroupMetadataSafe,
    normalizeJid
};