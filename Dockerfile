# Image de base stable
FROM node:lts-buster

# Installation des outils système nécessaires au bot (Stickers, Vidéos, Audios)
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

# Dossier de travail
WORKDIR /app

# Gestion des dépendances
COPY package.json .
RUN npm install

# Copie du code source
COPY . .

# Note: Render et Koyeb ignorent souvent EXPOSE pour utiliser leur propre routage, 
# mais on laisse 8000 par convention pour Koyeb.
EXPOSE 8000

# Lancement du bot
# Le script index.js doit utiliser process.env.PORT pour être compatible
CMD ["node", "index.js"]
