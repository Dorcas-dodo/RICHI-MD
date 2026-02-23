// 🚀 RICHI-MD - HANDLER (OPTIMISÉ v5.1 - STABILISÉ)
const path = require('path');
const fs = require('fs');
const config = require('../config');
const chalk = require('chalk');
const { isAdmin, isOwner: checkIsOwner, isSudo, normalizeJid } = require('../lib/authHelper');
const { buildMessageOptions } = require('../lib/utils');
const { getSettings } = require('../lib/database');
const { getRequest, deleteRequest } = require('../lib/store'); 
const { t } = require('../lib/language'); 

const plugins = {};
const aliases = {};

function loadPlugins() {
    console.log(chalk.cyan('📥 [Richi-MD] Initialisation des modules...'));
    const pluginDir = path.join(__dirname, '../plugins');
    if (!fs.existsSync(pluginDir)) fs.mkdirSync(pluginDir, { recursive: true });

    const categories = fs.readdirSync(pluginDir);
    categories.forEach(category => {
        const catPath = path.join(pluginDir, category);
        if (fs.lstatSync(catPath).isDirectory()) {
            fs.readdirSync(catPath).forEach(file => {
                if (file.endsWith('.js')) {
                    try {
                        const pluginModule = require(path.join(catPath, file));
                        const commands = Array.isArray(pluginModule) ? pluginModule : [pluginModule];
                        commands.forEach(plugin => {
                            if (plugin && plugin.name) {
                                plugins[plugin.name] = plugin;
                                if (plugin.aliases) {
                                    plugin.aliases.forEach(alias => aliases[alias] = plugin.name);
                                }
                            }
                        });
                    } catch (err) {
                        console.error(chalk.red(`❌ Échec Richi-MD (${file}):`), err);
                    }
                }
            });
        }
    });
    console.log(chalk.green(`✅ Richi-MD Engine : ${Object.keys(plugins).length} talents opérationnels.\n`));
}

async function messageHandler(sock, m) {
    try {
        // CORRECTION : Baileys envoie souvent un tableau "messages". On extrait le premier.
        const message = m.messages ? m.messages[0] : m;
        if (!message || !message.message || message.key.remoteJid === 'status@broadcast') return;

        const chatId = message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        
        // Extraction propre du texte
        const body = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || 
                     message.message?.imageMessage?.caption || 
                     message.message?.videoMessage?.caption || "";

        // Définition de l'expéditeur (JID propre)
        const sender = isGroup ? message.key.participant : message.key.remoteJid;
        const senderNum = normalizeJid(sender);

        const settings = getSettings();
        const prefix = settings.prefix || config.prefix || ".";

        // --- 1. GESTION DES RÉPONSES INTERACTIVES ---
        const pendingRequest = getRequest(senderNum, chatId);
        if (pendingRequest) {
            if (body.startsWith(prefix)) {
                deleteRequest(senderNum, chatId);
            } else {
                const plugin = plugins[pendingRequest.command];
                if (plugin && plugin.handleResponse) {
                    return await plugin.handleResponse(sock, message, body, pendingRequest);
                }
            }
        }

        // --- 2. GESTION DES COMMANDES ---
        if (!body.startsWith(prefix)) return;

        const args = body.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const pluginName = plugins[commandName] ? commandName : aliases[commandName];
        
        if (pluginName) {
            const plugin = plugins[pluginName];
            const isOwner = checkIsOwner(sock, message);

            // Vérifications Sécurité
            if (settings.mode === 'private' && !isOwner && !isSudo(sender)) return;
            if (plugin.ownerOnly && !isOwner) return;
            if (plugin.groupOnly && !isGroup) return sock.sendMessage(chatId, { text: `🚫 Groupe requis.` });

            if (plugin.adminOnly && isGroup) {
                const userIsAdmin = await isAdmin(sock, chatId, sender);
                if (!userIsAdmin && !isOwner) return sock.sendMessage(chatId, { text: `🚫 Admin requis.` });
            }

            // Options de message (UI, Context, etc.)
            const options = {
                ...buildMessageOptions(plugin, settings),
                remoteJid: chatId, // PASSAGE CRITIQUE : on s'assure que remoteJid est le chatId
                sender,
                isGroup,
                args
            };

            // 🚀 EXÉCUTION
            console.log(chalk.yellow(`⚡ [Richi-MD] : ${pluginName.toUpperCase()} par ${senderNum}`));
            await plugin.execute(sock, message, args, options);
        }

    } catch (e) {
        console.error(chalk.red("⚠️ Erreur Handler Richi-MD :"), e);
    }
}

module.exports = { loadPlugins, messageHandler };