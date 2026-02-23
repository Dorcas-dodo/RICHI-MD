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

- **⚡ Fast & Optimized:** Utilise `gifted-baileys` avec un bypass du flux d'historique pour un démarrage éclair.
- **🔌 Neural Pairing:** Aucun scan QR requis. Le noyau génère un code de jumelage sécurisé directement.
- **🛡️ Hardened Shield:** Protections intégrées contre le spam, les liens malveillants et les appels (Anti-Call).
- **🧠 ViewOnce Bypass:** Interception automatique des médias à vue unique.
- **🌍 Multi-Language:** Support dynamique des langues (`fr`, `en`...).

---

## 🚀 Deployment / Déploiement

### 📦 1. Cloud & Panels (Render, Koyeb, Pterodactyl)

1. **FORK** ce dépôt sur votre profil GitHub.
2. Créez un fichier `.env` ou configurez les **Variables d'Environnement** :

```env
BOT_NAME=RICHI-MD
OWNER_NAME=VotreNom
OWNER_NUMBER=242xxxxxxxxx
PREFIX=.
SESSION_NAME=session
DEFAULT_LANG=fr
# Options
AUTO_READ=false
ANTILINK=true

Install & Start:

Exécutez : npm install && npm start

Auto-Pairing : Le code s'affichera dans la console si aucune session n'est détectée.

📱 2. Termux (Android)
Bash
apt update && apt upgrade
pkg install git nodejs ffmpeg -y
git clone [https://github.com/Dorcas-dodo/RICHI-MD.git](https://github.com/Dorcas-dodo/RICHI-MD.git)
cd RICHI-MD
npm install
npm start
👨‍💻 For Developers / Pour les Devs
L'ajout de commandes est ultra-fluide. Créez un fichier dans plugins/system/ping.js :

JavaScript
const { performance } = require('perf_hooks');

module.exports = {
  name: 'ping',
  category: 'system',
  description: 'Vérifie la latence du noyau',
  execute: async (sock, m, args) => {
    const start = performance.now();
    const { key } = await sock.sendMessage(m.key.remoteJid, { text: '📡 *Signal Check...*' });
    const end = performance.now();
    const latency = (end - start).toFixed(2);

    await sock.sendMessage(m.key.remoteJid, {
      text: `🚀 *PONG !*\n\n🔹 *Vitesse :* ${latency} ms\n🔹 *Noyau :* RICHI-MD v3\n🔹 *Status :* Stable`,
      edit: key 
    });
  }
};
📞 Support & Credits
Created by: RICHI_DEV

Original Architecture: SEN STUDIO

Support Channel: Join WhatsApp Channel

⚠️ Disclaimer
Ce bot a été créé à des fins éducatives. Le développeur n'est pas responsable des mauvaises utilisations, des bannissements de compte ou des dommages causés. Utilisez-le à vos propres risques.

<p align="right">
<i>Maintained by RICHI_DEV | 2026 Kernel v3.0.4</i>
</p>


-----
