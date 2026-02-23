// 🔐 Plugin: RICHI-MD SUDO MANAGEMENT
// Description: Attribution et révocation des privilèges d'opérateur système

const { updateSetting, getSettings } = require('../../lib/database');
const { normalizeJid } = require('../../lib/authHelper');

module.exports = [
    {
        name: 'setsudo',
        aliases: ['addsudo', 'privilege'],
        category: 'owner',
        description: 'Élève un sujet au rang d\'opérateur SUDO',
        usage: 'setsudo (@tag ou réponse)',
        ownerOnly: true,

        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.participant || message.message?.extendedTextMessage?.contextInfo?.participant;
            const target = mentioned || quoted;

            if (!target) {
                return sock.sendMessage(remoteJid, { 
                    text: `*── [ ⚠️ TARGET_MISSING ] ──*\n\nIdentification échouée. Veuillez taguer un utilisateur ou répondre à son message.` 
                }, { quoted: message });
            }

            const targetId = normalizeJid(target);
            const settings = getSettings();
            let sudos = settings.sudo || [];

            if (sudos.includes(targetId)) {
                return sock.sendMessage(remoteJid, { text: `*⚠️ L'opérateur @${targetId.split('@')[0]} possède déjà les accès SUDO.*`, mentions: [target] });
            }

            sudos.push(targetId);
            updateSetting('sudo', sudos);
            
            await sock.sendMessage(remoteJid, { react: { text: "🛡️", key: message.key } });
            await sock.sendMessage(remoteJid, { 
                text: `*─── 『 RICHI-MD SUDO 』 ───*\n\n*🛡️ MODULE :* PRIVILEGE_ELEVATION\n*👤 SUBJECT :* @${targetId.split('@')[0]}\n*📊 STATUS :* GRANTED\n\n*Note :* L'opérateur peut désormais exécuter des commandes de haut niveau.`, 
                mentions: [target] 
            }, { quoted: message });
        }
    },
    {
        name: 'delsudo',
        aliases: ['rmsudo', 'revoke'],
        category: 'owner',
        description: 'Révoque les privilèges d\'un opérateur SUDO',
        usage: 'delsudo (@tag ou réponse)',
        ownerOnly: true,

        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.participant;
            const target = mentioned || quoted;

            if (!target) return sock.sendMessage(remoteJid, { text: `*── [ ⚠️ TARGET_MISSING ] ──*` });

            const targetId = normalizeJid(target);
            const settings = getSettings();
            let sudos = settings.sudo || [];

            if (!sudos.includes(targetId)) {
                return sock.sendMessage(remoteJid, { text: `*⚠️ Le sujet @${targetId.split('@')[0]} ne figure pas dans la base SUDO.*`, mentions: [target] });
            }

            sudos = sudos.filter(id => id !== targetId);
            updateSetting('sudo', sudos);
            
            await sock.sendMessage(remoteJid, { react: { text: "⛓️‍💥", key: message.key } });
            await sock.sendMessage(remoteJid, { 
                text: `*─── 『 RICHI-MD SUDO 』 ───*\n\n*🛠️ MODULE :* PRIVILEGE_REVOCATION\n*👤 SUBJECT :* @${targetId.split('@')[0]}\n*📊 STATUS :* TERMINATED\n\n*Note :* Les accès de l'opérateur ont été supprimés des registres.`, 
                mentions: [target] 
            }, { quoted: message });
        }
    },
    {
        name: 'listsudo',
        aliases: ['sudos', 'operators'],
        category: 'owner',
        description: 'Affiche la liste des opérateurs autorisés',
        usage: 'listsudo',
        ownerOnly: true,

        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const settings = getSettings();
            const sudos = settings.sudo || [];

            if (sudos.length === 0) {
                return sock.sendMessage(remoteJid, { text: `*── [ 🛑 NO_SUDO_DETECTED ] ──*` });
            }

            let list = `*─── 『 RICHI-MD OPERATORS 』 ───*\n\n`;
            sudos.forEach((s, i) => {
                list += `*${i + 1}.* @${s.split('@')[0]}\n`;
            });
            list += `\n*© TOTAL_OPERATORS : ${sudos.length}*`;

            await sock.sendMessage(remoteJid, { 
                text: list, 
                mentions: sudos.map(s => s.includes('@') ? s : s + '@s.whatsapp.net') 
            }, { quoted: message });
        }
    }
];