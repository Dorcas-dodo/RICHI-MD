# Utilisation d'une version plus récente et stable
FROM node:20-bullseye

# Installation des outils système (FFmpeg, ImageMagick, WebP)
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Dossier de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json .

# Installation des modules avec optimisation pour la production
RUN npm install --production

# Copie de tout le code source
COPY . .

# Port universel pour Koyeb
EXPOSE 8000

# Commande de démarrage
CMD ["node", "index.js"]
