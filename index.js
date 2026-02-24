const { connectToWhatsApp } = require('./nexus/client');
const { loadPlugins } = require('./nexus/handler');
const config = require('./config');
const chalk = require('chalk');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pairing', (req, res) => {
    res.send(`
        <body style="background:#0f172a; color:white; font-family:sans-serif; text-align:center; padding-top:50px;">
            <h1>📱 CONNEXION PAR CODE</h1>
            <p>Entrez votre numéro avec l'indicatif (ex: 225...)</p>
            <form action="/get-code" method="GET">
                <input type="text" name="number" placeholder="242XXXXXXXX" style="padding:10px; border-radius:5px; border:none; width:200px;">
                <button type="submit" style="padding:10px 20px; background:#00ff00; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">OBTENIR LE CODE</button>
            </form>
            <br><a href="/" style="color:#f59e0b;">Retour au menu</a>
        </body>
    `);
});

// --- ROUTE API CORRIGÉE ---
app.get('/get-code', async (req, res) => {
    const num = req.query.number?.replace(/[^0-9]/g, '');
    if (!num) return res.send("Veuillez entrer un numéro valide.");
    
    try {
        // 1. On lance une nouvelle instance de connexion pour ce numéro
        const sock = await connectToWhatsApp(num);
        
        // 2. On attend que Baileys génère le code (max 15 secondes)
        let count = 0;
        while (!sock.pairingCode && count < 15) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            count++;
        }

        if (!sock.pairingCode) {
            return res.send("Erreur : Le serveur WhatsApp est trop lent. Réessayez.");
        }

        // 3. On affiche le VRAI code reçu du bot
        res.send(`
            <body style="background:#0f172a; color:white; font-family:sans-serif; text-align:center; padding-top:50px;">
                <h1>VOTRE CODE POUR : ${num}</h1>
                <div style="font-size:3rem; color:#00ff00; font-weight:bold; letter-spacing:5px; margin:20px; border: 2px dashed #00ff00; display:inline-block; padding:10px;">
                    ${sock.pairingCode}
                </div>
                <p>Copiez ce code et collez-le dans la notification WhatsApp de votre téléphone.</p>
                <a href="/" style="color:#00ff00; text-decoration:none; border:1px solid #00ff00; padding:5px 10px;">Terminer</a>
            </body>
        `);
    } catch (err) {
        res.send("Erreur système : " + err.message);
    }
});

async function start() {
    try {
        console.clear();
        console.log(chalk.green.bold(`🚀 INITIALISATION RICHI-MD KERNEL...`));
        
        app.listen(PORT, () => {
            console.log(chalk.cyan(`📡 Interface Web active sur le port ${PORT}`));
        });

        loadPlugins();
        // Lancement du bot admin par défaut (si configuré)
        await connectToWhatsApp();

    } catch (e) {
        console.error(chalk.red.bold("❌ Erreur :"), e);
    }
}

start();
