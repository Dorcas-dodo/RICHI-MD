// 🎨 Plugin: RICHI-MD GRAPHIC ENGINE
// Description: Génération de logos via protocoles Ephoto360

const mumaker = require('mumaker');

const EFFECTS = {
    'metallic': "https://en.ephoto360.com/impressive-decorative-3d-metal-text-effect-798.html",
    'ice': "https://en.ephoto360.com/ice-text-effect-online-101.html",
    'snow': "https://en.ephoto360.com/create-a-snow-3d-text-effect-free-online-621.html",
    'impressive': "https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html",
    'matrix': "https://en.ephoto360.com/matrix-text-effect-154.html",
    'light': "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html",
    'neon': "https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html",
    'devil': "https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html",
    'purple': "https://en.ephoto360.com/purple-text-effect-online-100.html",
    'thunder': "https://en.ephoto360.com/thunder-text-effect-online-97.html",
    'leaves': "https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html",
    '1917': "https://en.ephoto360.com/1917-style-text-effect-523.html",
    'arena': "https://en.ephoto360.com/create-cover-arena-of-valor-by-mastering-360.html",
    'hacker': "https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html",
    'sand': "https://en.ephoto360.com/write-names-and-messages-on-the-sand-online-582.html",
    'glitch': "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html",
    'fire': "https://en.ephoto360.com/flame-lettering-effect-372.html",
    'dragonball': "https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html",
    'foggyglass': "https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html",
    'naruto': "https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html",
    'pixelglitch': "https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html",
    'neonglitch': "https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html",
    'blackpink': "https://en.ephoto360.com/create-a-blackpink-neon-logo-text-effect-online-710.html",
    'starwars': "https://en.ephoto360.com/create-star-wars-logo-online-982.html",
    'graffiti': "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html",
    'futuristic': "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html",
    
    // Spéciaux (2 textes)
    'pornhub': "https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html",
    'marvel': "https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html",
    'captainamerica': "https://en.ephoto360.com/create-a-cinematic-captain-america-text-effect-online-715.html"
};

const commands = Object.keys(EFFECTS).map(effect => ({
    name: effect,
    aliases: [],
    category: 'textmaker',
    description: `Génère un logo de style ${effect}`,
    usage: `${effect} <texte>`,

    execute: async (sock, message, args, msgOptions) => {
        const { remoteJid } = msgOptions;
        const text = args.join(' ');
        
        // 1. Détection du type de commande (1 ou 2 textes)
        const isDouble = ['pornhub', 'marvel', 'captainamerica'].includes(effect);

        if (isDouble) {
            const [text1, text2] = text.split('|').map(t => t.trim());
            if (!text1 || !text2) {
                return sock.sendMessage(remoteJid, { 
                    text: `*── [ ⚠️ INPUT ERROR ] ──*\n\nCe style requiert deux textes séparés par une barre.\n*Usage :* .${effect} Texte 1 | Texte 2` 
                });
            }

            await sock.sendMessage(remoteJid, { react: { text: '🎨', key: message.key } });

            try {
                const result = await mumaker.ephoto(EFFECTS[effect], [text1, text2]);
                return sock.sendMessage(remoteJid, { 
                    image: { url: result.image }, 
                    caption: `*─── 『 RICHI-MD ART 』 ───*\n\n*🎨 STYLE :* ${effect.toUpperCase()}\n*📝 TEXTES :* ${text1} & ${text2}\n\n*© GENERATED_BY_RICHI_ENGINE*`
                }, { quoted: message });
            } catch (e) {
                return sock.sendMessage(remoteJid, { text: `*❌ ERREUR :* Échec de la liaison avec le serveur graphique.` });
            }
        }

        // 2. Gestion Standard (1 texte)
        if (!text) {
            return sock.sendMessage(remoteJid, { 
                text: `*── [ ⚠️ INPUT ERROR ] ──*\n\nVeuillez entrer le texte pour le logo.\n*Usage :* .${effect} Richi-MD` 
            });
        }

        await sock.sendMessage(remoteJid, { react: { text: '🎨', key: message.key } });

        try {
            const result = await mumaker.ephoto(EFFECTS[effect], text);
            await sock.sendMessage(remoteJid, { 
                image: { url: result.image }, 
                caption: `*─── 『 RICHI-MD ART 』 ───*\n\n*🎨 STYLE :* ${effect.toUpperCase()}\n*📝 TEXTE :* ${text}\n\n*© GENERATED_BY_RICHI_ENGINE*`
            }, { quoted: message });
        } catch (e) {
            sock.sendMessage(remoteJid, { text: `*❌ ERREUR :* Échec de la synthèse graphique.` });
        }
    }
}));

module.exports = commands;