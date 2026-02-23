// 🤖 Plugin: RICHI-MD GHOST OPERATIONS
// Description: Gestion des protocoles d'automatisation et de présence

const { updateSetting, getSettings } = require('../../lib/database');

const AUTOMATIONS = [
    { cmd: 'autostatusview', name: 'AUTO-STATUS-VIEW', desc: 'Capture et vue automatique des statuts' },
    { cmd: 'autostatusreact', name: 'AUTO-STATUS-REACT', desc: 'Réaction bio-rythmique aux statuts' },
    { cmd: 'autotyping', name: 'AUTO-TYPING', desc: 'Simule l\'injection de données (Typing)' },
    { cmd: 'autorecord', name: 'AUTO-RECORD', desc: 'Simule l\'encodage audio (Recording)' }
];

const commands = AUTOMATIONS.map(auto => ({
    name: auto.cmd,
    aliases: [],
    category: 'owner',
    description: auto.desc,
    usage: `${auto.cmd} <on/off>`,
    
    ownerOnly: true,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        const setting = args[0]?.toLowerCase();
        const currentConfig = getSettings();

        // 1. Logique de conflit (Évite les signatures de présence doubles)
        if (setting === 'on') {
            if (auto.cmd === 'autotyping') updateSetting('autorecord', false);
            if (auto.cmd === 'autorecord') updateSetting('autotyping', false);
        }

        // 2. État du module
        if (!setting) {
            const status = currentConfig[auto.cmd] ? 'RUNNING ⚙️' : 'HALTED 🛑';
            return sock.sendMessage(remoteJid, { 
                text: `*─── 『 RICHI-MD AUTOMATION 』 ───*\n\n*🛠️ Protocol:* ${auto.name}\n*📊 Status:* ${status}\n*📝 Task:* ${auto.desc}\n\n*Usage:* .${auto.cmd} on | off` 
            }, { quoted: message });
        }

        // 3. Exécution des switchs
        if (setting === 'on' || setting === 'off') {
            const isEnabled = setting === 'on';
            updateSetting(auto.cmd, isEnabled);
            
            await sock.sendMessage(remoteJid, { react: { text: isEnabled ? "🛰️" : "💤", key: message.key } });
            
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚡ KERNEL UPDATE ] ──*\n\nLe protocole *${auto.name}* a été mis à jour.\n*Nouveau statut:* ${setting.toUpperCase()}` 
            });
        }

        sock.sendMessage(remoteJid, { text: `*⚠️ Paramètre incorrect.* Use: .${auto.cmd} on/off` });
    }
}));

module.exports = commands;