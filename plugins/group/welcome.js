// 🚪 Plugin: RICHI-MD GREETING SYSTEM
// Description: Gestion des protocoles d'entrée dans le secteur

const { updateGroupSetting, getGroupSettings } = require('../../lib/database');

module.exports = [
    {
        name: 'welcome',
        aliases: ['bienvenue'],
        category: 'group',
        description: 'Active ou désactive l\'accueil des nouveaux sujets',
        usage: 'welcome <on/off>',
        
        groupOnly: true,
        adminOnly: true,

        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const setting = args[0]?.toLowerCase();
            const currentConfig = getGroupSettings(remoteJid);

            // Statut si aucun argument
            if (!setting) {
                const status = currentConfig.welcome ? 'OPÉRATIONNEL' : 'MIS EN VEILLE';
                return sock.sendMessage(remoteJid, { 
                    text: `*─── 『 RICHI-MD WELCOME 』 ───*\n\n*📊 Statut :* ${status}\n\n*Usage :* .welcome on | off` 
                }, { quoted: message });
            }

            if (setting === 'on' || setting === 'off') {
                const isEnabled = setting === 'on';
                updateGroupSetting(remoteJid, 'welcome', isEnabled);
                
                await sock.sendMessage(remoteJid, { react: { text: isEnabled ? "✅" : "❌", key: message.key } });
                return sock.sendMessage(remoteJid, { 
                    text: `*── [ ⚡ CONFIGURÉ ] ──*\n\nProtocole d'accueil désormais *${setting.toUpperCase()}*.` 
                });
            }
        }
    },
    {
        name: 'setwelcome',
        aliases: ['setw'],
        category: 'group',
        description: 'Configure le message d\'accueil personnalisé',
        usage: 'setwelcome <message>',
        
        groupOnly: true,
        adminOnly: true,

        execute: async (sock, message, args, msgOptions) => {
            const { remoteJid } = msgOptions;
            const text = args.join(' ');

            if (!text) {
                return sock.sendMessage(remoteJid, { 
                    text: `*── [ ⚠️ ERREUR ] ──*\n\nVeuillez entrer le texte du protocole.\n\n*Variables disponibles :*\n- @user (Mention)\n- @group (Nom du groupe)\n- @desc (Description)` 
                }, { quoted: message });
            }

            updateGroupSetting(remoteJid, 'welcomeMessage', text);
            
            await sock.sendMessage(remoteJid, { react: { text: "📝", key: message.key } });
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ✅ MIS À JOUR ] ──*\n\nNouveau protocole d'accueil enregistré avec succès.` 
            });
        }
    }
];