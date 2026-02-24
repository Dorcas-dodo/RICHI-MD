# Utilisation d'une version de Node.js avec des dépôts système actifs
FROM node:20-bullseye

# Installation des outils système (FFmpeg pour les vidéos, ImageMagick pour les stickers)
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie uniquement du package.json pour optimiser le cache Docker
COPY package.json .

# Installation de TOUTES les dépendances (évite l'erreur 'Cannot find module chalk')
RUN npm install

# Copie du reste de ton code source (incluant index.html et index.js)
COPY . .

# Port universel compatible Koyeb
EXPOSE 8000

# Commande de lancement de RICHI-MD
CMD ["node", "index.js"]
