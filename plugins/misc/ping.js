// ⚡ Plugin: RICHI-MD PING (Latency Protocol)
// Description: Analyse de la vitesse de réponse du noyau

module.exports = {
    name: 'ping',
    aliases: ['p', 'speed', 'latency'],
    category: 'misc',
    description: 'Mesure le temps de réponse entre le serveur et l\'hôte',

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        
        // 1. Initialisation du signal (Réaction sombre)
        await sock.sendMessage(remoteJid, { react: { text: "⚡", key: message.key } });

        const start = Date.now();

        // 2. Simulation de l'analyse (Petit délai pour le réalisme du scan)
        const pingMsg = await sock.sendMessage(remoteJid, { 
            text: `*── [ 📡 SCANNING SECTOR... ] ──*` 
        });

        const end = Date.now();
        const latency = end - start;

        // 3. Rapport final de style Console
        let status = latency < 200 ? 'EXCELLENT' : (latency < 500 ? 'STABLE' : 'UNSTABLE');
        
        let report = `╭━━━ 『 **KERNEL_RESPONSE** 』 ━━━\n`
            + `┃\n`
            + `┃  📡 **Protocol:** _ICMP_Echo_Request_\n`
            + `┃  📟 **Host:** _Richi-MD_Server_\n`
            + `┃  📊 **Status:** _${status}_\n`
            + `┃  ⚡ **Latency:** \`${latency} ms\`\n`
            + `┃\n`
            + `╰━━━━━━━━━━━━━━━━━━━━━━┈✦`;

        // Modification du message précédent pour l'effet "mise à jour console"
        await sock.sendMessage(remoteJid, { 
            text: report, 
            edit: pingMsg.key 
        });
    }
};