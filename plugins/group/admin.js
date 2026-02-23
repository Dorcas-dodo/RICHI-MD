// 🏢 Plugin: RICHI-MD GROUP MANAGER
// Description: Contrôle des protocoles et nettoyage de secteur

const config = require('../../config');

module.exports = [
    {
        name: 'kick',
        aliases: ['remove'],
        category: 'group',
        description: 'Éjecte un membre du secteur',
        groupOnly: true, adminOnly: true,
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const target = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.participant;
            if (!target) return sock.sendMessage(remoteJid, { text: `*── [ ⚠️ ] ──*\nCible non identifiée.` });
            await sock.groupParticipantsUpdate(remoteJid, [target], 'remove');
            await sock.sendMessage(remoteJid, { react: { text: "☣️", key: message.key } });
        }
    },
    {
        name: 'purge',
        aliases: ['wipeout', 'kickall'],
        category: 'group',
        description: 'Protocole d\'éjection massive (OWNER ONLY)',
        groupOnly: true, ownerOnly: true,
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid, isBotAdmin, pushName } = msgOptions;
            if (!isBotAdmin) return sock.sendMessage(remoteJid, { text: `*── [ ❌ ] ──*\nLe système doit être admin.` });

            await sock.sendMessage(remoteJid, { text: `*── [ ⚠️ PURGE ] ──*\n\nInitialisation par *${pushName}*...\nNettoyage du secteur en cours.` });
            
            const groupMetadata = await sock.groupMetadata(remoteJid);
            const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            const targets = groupMetadata.participants
                .map(p => p.id)
                .filter(id => id !== botNumber && !config.ownerNumber.includes(id.split('@')[0]));

            for (let jid of targets) {
                await sock.groupParticipantsUpdate(remoteJid, [jid], 'remove');
                await new Promise(resolve => setTimeout(resolve, 800)); // Anti-Ban
            }
            await sock.sendMessage(remoteJid, { text: `*── [ ✅ ] ──*\nSecteur purifié.` });
        }
    },
    {
        name: 'add',
        aliases: ['invite'],
        category: 'group',
        description: 'Injecte un nouveau membre',
        groupOnly: true, adminOnly: true,
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const num = args[0]?.replace(/[^0-9]/g, '');
            if (!num) return sock.sendMessage(remoteJid, { text: `*── [ ⚠️ ] ──*\nMatricule manquant.` });
            const target = num + '@s.whatsapp.net';
            await sock.groupParticipantsUpdate(remoteJid, [target], 'add');
            await sock.sendMessage(remoteJid, { react: { text: "📥", key: message.key } });
        }
    },
    {
        name: 'promote',
        aliases: ['admin'],
        category: 'group',
        description: 'Accorde les privilèges admin',
        groupOnly: true, adminOnly: true,
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const target = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.participant;
            if (!target) return sock.sendMessage(remoteJid, { text: `*── [ ⚠️ ] ──*\nCible non identifiée.` });
            await sock.groupParticipantsUpdate(remoteJid, [target], 'promote');
            await sock.sendMessage(remoteJid, { react: { text: "🛡️", key: message.key } });
        }
    },
    {
        name: 'demote',
        aliases: ['unadmin'],
        category: 'group',
        description: 'Rétrograde un superviseur',
        groupOnly: true, adminOnly: true,
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const target = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.participant;
            if (!target) return sock.sendMessage(remoteJid, { text: `*── [ ⚠️ ] ──*\nCible non identifiée.` });
            await sock.groupParticipantsUpdate(remoteJid, [target], 'demote');
            await sock.sendMessage(remoteJid, { react: { text: "📉", key: message.key } });
        }
    },
    {
        name: 'gname',
        aliases: ['setname'],
        category: 'group',
        description: 'Change le nom du secteur',
        groupOnly: true, adminOnly: true,
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const name = args.join(' ');
            if (name) await sock.groupUpdateSubject(remoteJid, name);
            await sock.sendMessage(remoteJid, { react: { text: "📝", key: message.key } });
        }
    },
    {
        name: 'gdesc',
        aliases: ['setdesc'],
        category: 'group',
        description: 'Change la description',
        groupOnly: true, adminOnly: true,
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const desc = args.join(' ');
            if (desc) await sock.groupUpdateDescription(remoteJid, desc);
            await sock.sendMessage(remoteJid, { react: { text: "📜", key: message.key } });
        }
    },
    {
        name: 'glink',
        aliases: ['invitelink'],
        category: 'group',
        description: 'Récupère le point d\'accès',
        groupOnly: true,
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const code = await sock.groupInviteCode(remoteJid);
            await sock.sendMessage(remoteJid, { text: `*── [ RICHI-MD LINK ] ──*\n\nhttps://chat.whatsapp.com/${code}` }, { quoted: message });
        }
    },
    {
        name: 'revoke',
        aliases: ['resetlink'],
        category: 'group',
        description: 'Réinitialise le lien',
        groupOnly: true, adminOnly: true,
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            await sock.groupRevokeInvite(remoteJid);
            await sock.sendMessage(remoteJid, { react: { text: "🔐", key: message.key } });
        }
    }
];