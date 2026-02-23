// 🌐 RICHI-MD - CLIENT DE CONNEXION OPTIMISÉ (V2)
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require('gifted-baileys');
const pino = require('pino');
const chalk = require('chalk');
const fs = require('fs-extra'); // Utilisation de fs-extra pour plus de robustesse
const path = require('path');
const config = require('../config');

// Gestionnaires
const { messageHandler } = require('./handler');
const { monitorMessage, monitorGroupUpdate } = require('./monitor'); 
const { getSettings } = require('../lib/database');
const { styleText } = require('../lib/functions');

async function connectToWhatsApp() {
    // Initialisation de l'état d'authentification
    const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
    const { version } = await fetchLatestBaileysVersion();
    
    console.log(chalk.cyan(`
    =====================================
        🚀 LANCEMENT DE RICHI-MD...
        Propriétaire : ${config.ownerName}
    =====================================
    `));

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !config.phoneNumber, 
        // ✅ CORRECTIF IPHONE : On utilise une identité reconnue (Ubuntu/Chrome)
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

    // 🔗 GESTION DU PAIRING CODE
    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            let phoneNumber = config.phoneNumber?.replace(/[^0-9]/g, '');
            
            if (!phoneNumber) {
                console.log(chalk.red("❌ Aucun numéro défini pour le pairing code !"));
                return;
            }

            console.log(chalk.yellow(`⏳ Richi-MD demande un code pour : ${phoneNumber}`));

            try {
                let code = await sock.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(chalk.white.bgGreen.bold(`\n ✅ TON CODE DE JUMELAGE : ${code} \n`));
            } catch (e) {
                console.log(chalk.red("❌ Erreur pairing :", e.message));
            }
        }, 4000);
    }

    // 🔄 GESTION DE LA CONNEXION
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const statusCode = lastDisconnect.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            
            console.log(chalk.yellow(`🔄 Connexion interrompue (Code: ${statusCode}). Reconnexion...`));
            
            if (statusCode === DisconnectReason.loggedOut) {
                console.log(chalk.red(`⛔ Session expirée dans '${config.sessionName}'. Nettoyage...`));
                fs.removeSync(config.sessionName); // Supprime le dossier de session corrompu
                process.exit(1);
            }

            if (shouldReconnect) {
                setTimeout(connectToWhatsApp, 3000);
            }
        } else if (connection === 'open') {
            console.log(chalk.green('✅ RICHI-MD EST CONNECTÉ !'));

            // 1. AUTO FOLLOW
            try {
                if (config.newsletterJid) await sock.newsletterFollow(config.newsletterJid);
            } catch (e) {} 

            // 2. LOG DE BORD
            const settings = getSettings();
            const botName = settings.botName || config.botName;
            const prefix = settings.prefix || config.prefix;
            
            let pluginCount = 0;
            const pluginDir = path.join(__dirname, '../plugins');
            if (fs.existsSync(pluginDir)) {
                const files = fs.readdirSync(pluginDir, { withFileTypes: true });
                for (const file of files) {
                    if (file.isDirectory()) {
                        pluginCount += fs.readdirSync(path.join(pluginDir, file.name)).filter(f => f.endsWith('.js')).length;
                    } else if (file.name.endsWith('.js')) {
                        pluginCount++;
                    }
                }
            }

            const caption = `🌟 *RICHI-MD DÉMARRÉ*\n\n` +
                            `👤 *PROPRIO* : ${config.ownerName}\n` +
                            `🤖 *BOT* : ${botName}\n` +
                            `⌨️ *PREFIX* : ${prefix}\n` +
                            `📦 *MODULES* : ${pluginCount}\n\n` +
                            `> ${styleText(`Système prêt. Tapez ${prefix}menu`)}`;

            const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            await sock.sendMessage(botJid, { 
                image: { url: config.logoUrl },
                caption: caption
            });
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // 📩 GESTION DES MESSAGES
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg || !msg.message) return;

        // --- GESTION AUTO DES STATUTS ---
        if (msg.key.remoteJid === 'status@broadcast' && !msg.key.fromMe) {
            const settings = getSettings();
            if (settings.autostatusview) {
                await sock.readMessages([msg.key]);
                console.log(chalk.gray(`[STORY] Vu chez : ${msg.key.participant.split('@')[0]}`));
            }
            return;
        }

        const settings = getSettings();
        const chatId = msg.key.remoteJid;

        // Effets de présence
        if (settings.autotyping && !msg.key.fromMe) await sock.sendPresenceUpdate('composing', chatId);

        await monitorMessage(sock, m);
        await messageHandler(sock, m);
    });

    sock.ev.on('group-participants.update', async (update) => {
        await monitorGroupUpdate(sock, update);
    });

    return sock;
}

module.exports = { connectToWhatsApp };