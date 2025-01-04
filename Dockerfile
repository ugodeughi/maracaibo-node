# Usa un'immagine di base ufficiale di Node.js
FROM node:16

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di progetto
COPY package*.json ./
COPY . .

# Installa le dipendenze
RUN npm install

# Esponi la porta su cui l'app ascolta
EXPOSE 3000

# Comando di avvio
CMD ["npm", "start"]