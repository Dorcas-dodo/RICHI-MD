// 🚀 Richi-MD - POINT D'ENTRÉE PERSONNALISÉ

const { connectToWhatsApp } = require('./nexus/client');
const { loadPlugins } = require('./nexus/handler');
const config = require('./config');

async function start() {
    try {
        console.clear(); // Nettoie le terminal pour un look pro
        console.log(`
        =====================================
           🌟 RICHI-MD EST EN LIGNE 🌟
           Auteur : Celeste
        =====================================
        `);
        
        // 1. Charger les talents (plugins)
        loadPlugins();

        // 2. Lancer la connexion WhatsApp
        await connectToWhatsApp();

    } catch (e) {
        console.error("❌ Erreur au démarrage de Richi-MD :", e);
    }
}

start();