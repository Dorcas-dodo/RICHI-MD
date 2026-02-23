// 🤖 Plugin: RICHI-MD Intelligence
// Description: IA conversationnelle optimisée

const axios = require('axios');
const config = require('../../config');

module.exports = {
    name: 'gpt',
    aliases: ['ai', 'bot', 'richi'],
    category: 'ai',
    description: 'Interroger le système Richi-MD IA',
    usage: 'gpt <votre_question>',

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid, sender, pushName } = msgOptions;
        const text = args.join(' ');

        // Vérification de l'argument
        if (!text) {
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚠️ SYSTEM ERROR ] ──*\n\nSalut *${pushName}*, veuillez entrer une question valide.\n\n*Exemple:* ${config.prefix}gpt Comment hacker un code ? (Humour)` 
            }, { quoted: message });
        }

        // Réaction de chargement (Mode Cyber)
        await sock.sendMessage(remoteJid, { react: { text: "👁️", key: message.key } });

        try {
            // Appel à l'API Hercai v3
            const response = await axios.get(`https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(text)}`);
            const reply = response.data.reply;

            // Formatage sombre et stylisé
            const darkReply = `*─── 『 RICHI-MD SYSTEM 』 ───*\n\n` +
                              `*👤 Utilisateur:* ${pushName}\n` +
                              `*🧠 IA Status:* Online\n\n` +
                              `${reply}\n\n` +
                              `*──────────────────────*`;

            await sock.sendMessage(remoteJid, { text: darkReply }, { quoted: message });

        } catch (error) {
            console.error('Erreur GPT Richi-MD:', error);
            await sock.sendMessage(remoteJid, { 
                text: `*❌ Erreur de connexion au noyau central (IA).*` 
            }, { quoted: message });
        }
    }
};