const { connectToWhatsApp } = require('./nexus/client');
const { loadPlugins } = require('./nexus/handler');
const config = require('./config');
const chalk = require('chalk');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// 1. Petit Serveur HTML pour le lien de session et le statut
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>RICHI-MD KERNEL</title>
            <style>
                body { background: #0f172a; color: white; font-family: sans-serif; text-align: center; padding-top: 100px; }
                .status { color: #00ff00; font-weight: bold; border: 2px solid #00ff00; padding: 20px; display: inline-block; border-radius: 10px; }
                h1 { font-family: 'Courier New', monospace; }
            </style>
        </head>
        <body>
            <h1>⚠️ RICHI-MD : KERNEL_OVERRIDE ⚠️</h1>
            <div class="status">SYSTEME EN LIGNE ET ACTIF</div>
            <p>Connecté avec succès à WhatsApp via le port ${PORT}</p>
        </body>
        </html>
    `);
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
        
        // 2. Lancement du Serveur Web (Crucial pour Koyeb/Render)
        app.listen(PORT, () => {
            console.log(chalk.cyan(`📡 Serveur Web actif sur le port ${PORT}`));
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
