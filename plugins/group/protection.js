// 🛡️ Plugin: RICHI-MD SHIELD (Protections)
// Description: Un arsenal complet de protocoles de défense pour le secteur

const { updateGroupSetting, getGroupSettings } = require('../../lib/database');

const PROTECTIONS = [
    { cmd: 'antispam', name: 'ANTISPAM', desc: 'Détecte les flux de messages excessifs' },
    { cmd: 'antimedia', name: 'ANTIMEDIA', desc: 'Vérrouille l\'envoi de médias' },
    { cmd: 'antitag', name: 'ANTITAG', desc: 'Surveille les mentions excessives' },
    { cmd: 'antipromote', name: 'ANTI-PROMOTE', desc: 'Bloque les promotions non-autorisées' },
    { cmd: 'antidemote', name: 'ANTI-DEMOTE', desc: 'Bloque les rétrogradations' },
    { cmd: 'antitransfert', name: 'ANTI-TRANSFERT', desc: 'Intercepte les flux transférés' },
    { cmd: 'antibadword', name: 'ANTI-BADWORD', desc: 'Filtre les termes interdits' }
];

const commands = PROTECTIONS.map(prot => ({
    name: prot.cmd,
    aliases: [],
    category: 'group',
    description: prot.desc,
    usage: `${prot.cmd} <on/off>`,
    
    groupOnly: true,
    adminOnly: true,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        const setting = args[0]?.toLowerCase();
        const currentConfig = getGroupSettings(remoteJid);

        // État actuel si pas d'argument
        if (!setting) {
            const status = currentConfig[prot.cmd] ? 'ACTIF 🛡️' : 'INACTIF 🔓';
            return sock.sendMessage(remoteJid, { 
                text: `*─── 『 RICHI-MD PROTECTION 』 ───*\n\n*🛠️ Module :* ${prot.name}\n*📊 Statut :* ${status}\n*📝 Description :* ${prot.desc}\n\n*Usage :* .${prot.cmd} on | off` 
            }, { quoted: message });
        }

        // Activation / Désactivation
        if (setting === 'on' || setting === 'off') {
            const isEnabled = setting === 'on';
            updateGroupSetting(remoteJid, prot.cmd, isEnabled);
            
            await sock.sendMessage(remoteJid, { react: { text: isEnabled ? "🔐" : "🔓", key: message.key } });
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚡ CONFIGURÉ ] ──*\n\nProtocole *${prot.name}* est désormais *${setting.toUpperCase()}*.` 
            });
        }

        sock.sendMessage(remoteJid, { text: `*⚠️ Usage correct :* .${prot.cmd} on/off` });
    }
}));

// --- GESTIONNAIRE DE MOTS INTERDITS (BADWORDS) ---
const setBadword = {
    name: 'setbadword',
    aliases: ['addbadword', 'delbadword', 'badword'],
    category: 'group',
    description: 'Gère la base de données des mots interdits',
    usage: 'setbadword <add/del/list> <mot>',
    
    groupOnly: true,
    adminOnly: true,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        const action = args[0]?.toLowerCase();
        const word = args.slice(1).join(' ');
        
        let config = getGroupSettings(remoteJid);
        let badwords = config.badwords || [];

        // Ajouter un mot
        if (action === 'add' && word) {
            if (badwords.includes(word)) return sock.sendMessage(remoteJid, { text: `*⚠️ Ce terme est déjà répertorié.*` });
            badwords.push(word);
            updateGroupSetting(remoteJid, 'badwords', badwords);
            return sock.sendMessage(remoteJid, { text: `*── [ ✅ AJOUTÉ ] ──*\n\nLe terme "${word}" a été injecté dans la liste noire.` });
        }

        // Supprimer un mot
        if (action === 'del' && word) {
            if (!badwords.includes(word)) return sock.sendMessage(remoteJid, { text: `*⚠️ Terme introuvable.*` });
            badwords = badwords.filter(w => w !== word);
            updateGroupSetting(remoteJid, 'badwords', badwords);
            return sock.sendMessage(remoteJid, { text: `*── [ 🗑️ SUPPRIMÉ ] ──*\n\nLe terme "${word}" a été retiré de la base de données.` });
        }

        // Lister les mots
        if (action === 'list') {
            const list = badwords.length > 0 ? badwords.join(', ') : 'Aucun';
            return sock.sendMessage(remoteJid, { 
                text: `*─── 『 RICHI-MD BLACKLIST 』 ───*\n\n*📝 Termes détectés :*\n${list}` 
            }, { quoted: message });
        }

        sock.sendMessage(remoteJid, { text: `*⚠️ Usage :* .setbadword <add/del/list> <mot>` });
    }
};

module.exports = [...commands, setBadword];