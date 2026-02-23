<p align="center">
  <img src="./ren.jpg" alt="RICHI-MD-CORE" width="100%" style="border-radius: 15px; border: 2px solid #00ff00; box-shadow: 0px 0px 20px rgba(0, 255, 0, 0.5);"/>
</p>

<h1 align="center"><code> ⚠️ RICHI-MD : KERNEL_OVERRIDE ⚠️ </code></h1>

<p align="center">
  <b>The Fast, Modular & Cyber-Operator WhatsApp Framework.</b><br>
  <i>Le Bot WhatsApp rapide, modulaire et optimisé pour les développeurs.</i>
</p>

<p align="center">
  <a href="https://github.com/Dorcas-dodo/RICHI-MD/fork">
    <img src="https://img.shields.io/badge/FORK-REPO-black?style=for-the-badge&logo=github" alt="Fork Repo">
  </a>
  <a href="https://whatsapp.com/channel/0029VbAK3nYEquiZ3Ajpd90f">
    <img src="https://img.shields.io/badge/JOIN-NETWORK-green?style=for-the-badge&logo=whatsapp" alt="Support">
  </a>
</p>

<hr/>

## 🌟 Features / Fonctionnalités

- **⚡ Fast & Optimized:** Utilise `gifted-baileys` pour un démarrage éclair.
- **🔌 Neural Pairing:** Connexion directe par code d'appairage sans scan QR.
- **🛡️ Hardened Shield:** Protection Anti-Call et Anti-Link intégrée au noyau.
- **🧠 ViewOnce Bypass:** Capture automatique des médias éphémères.

---

## 🚀 Deployment / Déploiement

### 📦 Configuration Initiale (.env)
Avant de choisir une méthode ci-dessous, préparez vos variables d'environnement :

```env```
BOT_NAME=RICHI-MD
OWNER_NAME=RICHI_DEV
OWNER_NUMBER=242068079834
PREFIX=.
SESSION_NAME=session
DEFAULT_LANG=fr
AUTO_READ=false
ANTILINK=true

```## ☁️ I. Déploiement Cloud (Render / Koyeb)```
### 1.Fork ce repo sur ton compte GitHub.

2.Crée un compte sur Render ou Koyeb.

3.Lie ton repo GitHub et ajoute les variables du bloc .env ci-dessus dans la section Environment Variables du site.

4.Lance le "Deploy".

## 🖥️ II. Déploiement Panel (Pterodactyl / Sen-Host)
### Upload les fichiers du bot sur ton panel.

Dans l'onglet Startup, vérifie que la commande de lancement est bien npm start.

Configure le .env directement via le gestionnaire de fichiers du panel.
## 📱 III. Déploiement Termux (Android)

### 1. apt update && apt upgrade
2. pkg install git nodejs ffmpeg -y
3. git clone [https://github.com/Dorcas-dodo/RICHI-MD.git](https://github.com/Dorcas-dodo/RICHI-MD.git)
4. cd RICHI-MD
5. npm install
6. npm start

## 👨‍💻 For Developers / Pour les Devs

### L'ajout de commandes est ultra-fluide. Créez un fichier dans plugins/system/ping.js :
const { performance } = require('perf_hooks');
module.exports = {
  name: 'ping',
  category: 'system',
  description: 'Vérifie la latence du noyau',
  execute: async (sock, m, args) => {
    const start = performance.now();
    const { key } = await sock.sendMessage(m.key.remoteJid, { text: '📡 *Signal Check...*' });
    const latency = (performance.now() - start).toFixed(2);
    await sock.sendMessage(m.key.remoteJid, {
      text: `🚀 *PONG !*\n\n🔹 *Vitesse :* ${latency} ms\n🔹 *Noyau :* RICHI-MD v3`,
      edit: key 
    });
  }
};

## 📞 Support & Credits
Created by: RICHI_DEV

Support Channel: Join WhatsApp Channel

<details>
<summary><b>⚠️ Disclaimer (Cliquez pour lire)</b></summary>
## Ce bot a été créé à des fins éducatives en utilisant une API WhatsApp non officielle. Le développeur n'est pas responsable des mauvaises utilisations, des bannissements de compte ou des dommages causés. Utilisez-le à vos propres risques.
</details>

<p align="right">
<i>Maintained by RICHI_DEV | 2026 Kernel v3.0.4</i>
</p>
