// 🚀 Richi-MD - POINT D'ENTRÉE PERSONNALISÉ
const { connectToWhatsApp } = require('./nexus/client');
const { loadPlugins } = require('./nexus/handler');
const config = require('./config');
const chalk = require('chalk'); // Utilise chalk car il est dans ton package.json

async function start() {
    try {
        console.clear();
        
        // Message d'accueil stylé au démarrage
        console.log(chalk.green.bold(`
        ==================================================
        ║             🌐 RICHI-MD : KERNEL v3            ║
        ║        MODULAR & CYBER-OPERATOR SYSTEM         ║
        ==================================================
        ║  👤 Auteur  : Celeste                         ║
        ║  🛠️ Version : 1.1.0                           ║
        ║  📡 Statut  : Initialisation du Noyau...      ║
        ==================================================
        `));
        
        // 1. Charger les talents (plugins)
        console.log(chalk.cyan("⚙️ Chargement des modules en cours..."));
        loadPlugins();
        console.log(chalk.green("✅ Plugins chargés avec succès !"));

        // 2. Lancer la connexion WhatsApp
        console.log(chalk.yellow("📡 Tentative de liaison avec WhatsApp..."));
        const sock = await connectToWhatsApp();

        // 3. Message de succès une fois connecté
        console.log(chalk.blue.bold(`
        ==================================================
        ║        ✅ RICHI-MD EST MAINTENANT EN LIGNE     ║
        ║      Prêt à exécuter les commandes sur WA      ║
        ==================================================
        `));

    } catch (e) {
        console.error(chalk.red.bold("❌ Erreur critique au démarrage :"), e);
    }
}

start();
