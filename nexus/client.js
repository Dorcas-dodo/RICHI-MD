// 🌐 RICHI-MD - CLIENT DE CONNEXION OPTIMISÉ (V2.5 HYBRIDE)
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require('gifted-baileys');
const pino = require('pino');
const chalk = require('chalk');
const fs = require('fs-extra'); 
const path = require('path');
const config = require('../config');

// Gestionnaires
const { messageHandler } = require('./handler');
const { monitorMessage, monitorGroupUpdate } = require('./monitor'); 
const { getSettings } = require('../lib/database');
const { styleText } = require('../lib/functions');

// Ajout du paramètre dynamicNumber pour recevoir le numéro du site web
async function connectToWhatsApp(dynamicNumber = null) {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        // Si pas de numéro dynamique et pas de config, on affiche le QR
        printQRInTerminal: !dynamicNumber && !config.phoneNumber, 
        browser: ["Ubuntu", "Chrome", "20.0.04"], 
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        keepAliveIntervalMs: 30000,
        defaultQueryTimeoutMs: 60000,
        retryRequestDelayMs: 250,
        getMessage: async (key) => { return undefined }
    });

    // 🔗 LOGIQUE PAIRING CODE AMÉLIORÉE
    if (!sock.authState.creds.registered) {
        let phoneNumber = dynamicNumber || config.phoneNumber?.replace(/[^0-9]/g, '');
        
        if (phoneNumber) {
            console.log(chalk.yellow(`⏳ Richi-MD génère un code pour : ${phoneNumber}`));
            await new Promise(resolve => setTimeout(resolve, 3000));
            try {
                let code = await sock.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(chalk.white.bgGreen.bold(`\n ✅ CODE DE JUMELAGE : ${code} \n`));
                
                // IMPORTANT : On expose le code pour que index.js puisse l'afficher
                sock.pairingCode = code; 
            } catch (e) {
                console.log(chalk.red("❌ Erreur pairing :", e.message));
            }
        }
    }

    // 🔄 GESTION DE LA CONNEXION
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        // Exposer le QR code si nécessaire
        if (qr) sock.qrCode = qr;

        if (connection === 'close') {
            const statusCode = lastDisconnect.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            
            if (statusCode === DisconnectReason.loggedOut) {
                fs.removeSync(config.sessionName);
                process.exit(1);
            }
            if (shouldReconnect) setTimeout(() => connectToWhatsApp(dynamicNumber), 3000);
            
        } else if (connection === 'open') {
            console.log(chalk.green('✅ RICHI-MD EST CONNECTÉ !'));

            // AUTO FOLLOW & LOG DE BORD (Ton code original)
            try {
                if (config.newsletterJid) await sock.newsletterFollow(config.newsletterJid);
            } catch (e) {} 

            const settings = getSettings();
            const botName = settings.botName || config.botName;
            const prefix = settings.prefix || config.prefix;
            
            const caption = `🌟 *RICHI-MD DÉMARRÉ*\n\n` +
                            `👤 *PROPRIO* : ${config.ownerName}\n` +
                            `🤖 *BOT* : ${botName}\n` +
                            `⌨️ *PREFIX* : ${prefix}\n\n` +
                            `> ${styleText(`Système prêt. Tapez ${prefix}menu`)}`;

            await sock.sendMessage(sock.user.id.split(':')[0] + '@s.whatsapp.net', { 
                image: { url: config.logoUrl },
                caption: caption
            });
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // 📩 GESTION DES MESSAGES (Ton code original)
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg || !msg.message) return;
        if (msg.key.remoteJid === 'status@broadcast' && !msg.key.fromMe) {
            if (getSettings().autostatusview) await sock.readMessages([msg.key]);
            return;
        }
        await monitorMessage(sock, m);
        await messageHandler(sock, m);
    });

    return sock;
}

module.exports = { connectToWhatsApp };
