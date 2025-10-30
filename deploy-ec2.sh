#!/bin/bash

# Actualizar el sistema
sudo yum update -y

# Instalar Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16

# Instalar git
sudo yum install git -y

# Instalar dependencias para Puppeteer
sudo yum install -y chromium chromium-headless chromedriver

# Crear directorio de la aplicación
mkdir -p ~/app

# Clonar el repositorio
cd ~/app
git clone https://github.com/Rickplayy/ecommerceNodejs.git .

# Instalar dependencias del backend
cd backend
npm install

# Crear archivo de variables de entorno
cat > .env << EOL
NODE_ENV=production
RDS_HOSTNAME=${RDS_HOSTNAME}
RDS_USERNAME=${RDS_USERNAME}
RDS_PASSWORD=${RDS_PASSWORD}
RDS_DB_NAME=${RDS_DB_NAME}
RDS_PORT=${RDS_PORT}
JWT_SECRET=${JWT_SECRET}
PORT=3001
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
EOL

# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación con PM2
pm2 start index.js --name backend
pm2 startup
pm2 save