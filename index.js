const { connectToWhatsApp } = require('./nexus/client');
const { loadPlugins } = require('./nexus/handler');
const config = require('./config');
const chalk = require('chalk');
const express = require('express'); // Nécessaire pour le Health Check sur Koyeb/Render

const app = express();
const PORT = process.env.PORT || 8000; // Utilise 8000 pour Koyeb ou le port dynamique de Render

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
        await connectToWhatsApp();

        // 3. Serveur HTTP pour éviter le mode "Crashed" sur Koyeb/Render
        app.get('/', (req, res) => res.send('RICHI-MD est en ligne !'));
        app.listen(PORT, () => {
            console.log(chalk.blue.bold(`
        ==================================================
        ║        ✅ RICHI-MD EST MAINTENANT EN LIGNE     ║
        ║      Service actif sur le port : ${PORT}          ║
        ==================================================
            `));
        });

    } catch (e) {
        console.error(chalk.red.bold("❌ Erreur critique au démarrage :"), e);
    }
}

start();
