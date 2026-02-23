// 🏷️ Plugin: RICHI-MD TAGGING SYSTEM
// Description: Protocoles de notification de masse

module.exports = [
    {
        name: 'tagall',
        aliases: ['everyone', 'all'],
        category: 'group',
        description: 'Mentionne tous les membres du secteur visiblement',
        groupOnly: true, adminOnly: true,
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const metadata = await sock.groupMetadata(remoteJid);
            const participants = metadata.participants.map(p => p.id);
            const inputMsg = args.join(' ') || 'Alerte générale';
            
            let list = `*─── 『 RICHI-MD TAGALL 』 ───*\n\n*📢 Message:* ${inputMsg}\n\n`;
            for (let p of participants) {
                list += `👤 @${p.split('@')[0]}\n`;
            }
            list += `\n*──────────────────────*`;
            
            await sock.sendMessage(remoteJid, { 
                text: list, 
                mentions: participants 
            }, { quoted: message });
        }
    },
    {
        name: 'hidetag',
        aliases: ['ht', 'ghosttag'],
        category: 'group',
        description: 'Notification fantôme (Tag invisible)',
        groupOnly: true, adminOnly: true,
        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const metadata = await sock.groupMetadata(remoteJid);
            const participants = metadata.participants.map(p => p.id);
            
            // On récupère soit le message répondu, soit le texte après la commande
            const text = args.join(' ') || 'Notification système';

            await sock.sendMessage(remoteJid, { react: { text: "👻", key: message.key } });

            // Envoi du message avec mentions invisibles
            await sock.sendMessage(remoteJid, { 
                text: text, 
                mentions: participants 
            });
        }
    }
];