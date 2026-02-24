const { connectToWhatsApp } = require('./nexus/client');
const { loadPlugins } = require('./nexus/handler');
const config = require('./config');
const chalk = require('chalk');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// 1. Servir le fichier HTML (Placer index.html à la racine du projet)
app.get('/', (req, res) => {
    // Cette ligne envoie ton fichier HTML au navigateur
    res.sendFile(path.join(__dirname, 'index.html'));
});

async function start() {
    try {
        console.clear();
        
        // Message d'accueil stylé dans le terminal
        console.log(chalk.green.bold(`
        ==================================================
        ║             🌐 RICHI-MD : KERNEL v3            ║
        ║        MODULAR & CYBER-OPERATOR SYSTEM         ║
        ==================================================
        ║  👤 Auteur  : Celeste                         ║
        ║  📡 Statut  : Initialisation du Noyau...      ║
        ==================================================
        `));
        
        // 2. Lancement du Serveur Web
        app.listen(PORT, () => {
            console.log(chalk.cyan(`📡 Interface Web active sur http://localhost:${PORT}`));
        });

        // 3. Charger les plugins
        loadPlugins();
        console.log(chalk.green("✅ Plugins chargés !"));

        // 4. Lancer WhatsApp
        console.log(chalk.yellow("📡 Connexion à WhatsApp en cours..."));
        await connectToWhatsApp();

        console.log(chalk.blue.bold(`
        ==================================================
        ║        ✅ RICHI-MD EST MAINTENANT EN LIGNE     ║
        ==================================================
        `));

    } catch (e) {
        console.error(chalk.red.bold("❌ Erreur au démarrage :"), e);
    }
}

start();
