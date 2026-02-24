const { connectToWhatsApp } = require('./nexus/client');
const { loadPlugins } = require('./nexus/handler');
const config = require('./config');
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const QRCode = require('qrcode'); // N'oublie pas : npm install qrcode

const app = express();
const PORT = process.env.PORT || 8000;

// 1. Accueil : Ton Portail de déploiement
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Route pour le QR Code visuel
app.get('/qr', async (req, res) => {
    res.send(`
        <body style="background:#0f172a; color:white; font-family:sans-serif; text-align:center; padding-top:50px;">
            <h1>📷 SCANNEZ LE QR CODE</h1>
            <div style="background:white; padding:20px; display:inline-block; border-radius:10px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=RICHI-MD-WAITING" alt="QR">
            </div>
            <p>Ouvrez WhatsApp > Appareils connectés > Connecter un appareil</p>
            <a href="/" style="color:#00ff00;">Retour au menu</a>
        </body>
    `);
});

// 3. Route pour le formulaire de Pairing Code
app.get('/pairing', (req, res) => {
    res.send(`
        <body style="background:#0f172a; color:white; font-family:sans-serif; text-align:center; padding-top:50px;">
            <h1>📱 CONNEXION PAR CODE</h1>
            <p>Entrez votre numéro avec l'indicatif (ex: 225...)</p>
            <form action="/get-code" method="GET">
                <input type="text" name="number" placeholder="225XXXXXXXX" style="padding:10px; border-radius:5px; border:none; width:200px;">
                <button type="submit" style="padding:10px 20px; background:#00ff00; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">OBTENIR LE CODE</button>
            </form>
            <br><a href="/" style="color:#f59e0b;">Retour au menu</a>
        </body>
    `);
});

// 4. Route API qui génère le code via Baileys
app.get('/get-code', async (req, res) => {
    const num = req.query.number;
    if (!num) return res.send("Veuillez entrer un numéro valide.");
    
    // Ici, tu appelles la logique de ton client.js pour générer le code
    // Pour l'exemple, on affiche un texte d'attente
    res.send(`
        <body style="background:#0f172a; color:white; font-family:sans-serif; text-align:center; padding-top:50px;">
            <h1>VOTRE CODE POUR : ${num}</h1>
            <div style="font-size:3rem; color:#00ff00; letter-spacing:10px; margin:20px;">ABC1-DE2F</div>
            <p>Copiez ce code et collez-le dans la notification WhatsApp de votre téléphone.</p>
            <a href="/" style="color:#00ff00;">Terminer</a>
        </body>
    `);
});

async function start() {
    try {
        console.clear();
        console.log(chalk.green.bold(`🚀 INITIALISATION RICHI-MD KERNEL...`));
        
        app.listen(PORT, () => {
            console.log(chalk.cyan(`📡 Interface Web active sur le port ${PORT}`));
        });

        loadPlugins();
        await connectToWhatsApp();

    } catch (e) {
        console.error(chalk.red.bold("❌ Erreur :"), e);
    }
}

start();
