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
# IMPORTANT: Please replace the placeholder values below with your actual AWS credentials.
# You can also use environment variables to populate these values.
cat > .env << EOL
NODE_ENV=production

# RDS Database
RDS_HOSTNAME=${RDS_HOSTNAME:-ecommerce-db.cvgmyimqg3eh.us-east-2.rds.amazonaws.com}
RDS_USERNAME=${RDS_USERNAME:-admin}
RDS_PASSWORD=${RDS_PASSWORD:-rockpa123}
RDS_DB_NAME=${RDS_DB_NAME:-ecommerce-db}
RDS_PORT=${RDS_PORT:-3306}

# S3 Bucket
S3_BUCKET_NAME=${S3_BUCKET_NAME:-ecommerce-rockpa-frontend }
AWS_REGION=${AWS_REGION:-us-east-2}
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-AKIARUUMNZKDCJFDGQK7}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-0pbT9KqDkIJd49QQ6dmE/PLYRhq7pp8uCkRxXJQk}

# JWT Secret
JWT_SECRET=${JWT_SECRET:-your_jwt_secret}

# Server Port
PORT=3001

# Puppeteer
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
EOL

# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación con PM2
pm2 start index.js --name backend
pm2 startup
pm2 save