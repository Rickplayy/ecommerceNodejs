#!/bin/bash

# Reemplaza esto con el nombre de tu bucket
BUCKET_NAME="ecommerce-rockpa-frontend"

# Instalar dependencias y construir
npm install
npm run build

# Sincronizar con S3
aws s3 sync build/ s3://$BUCKET_NAME --delete

echo "Deployment complete!"
echo "Tu sitio estará disponible en: http://$BUCKET_NAME.s3-website.us-east-2.amazonaws.com"