#!/bin/bash

# Variables (reemplaza estos valores)
BUCKET_NAME="tu-nombre-de-bucket"
DISTRIBUTION_ID="tu-id-de-cloudfront"  # opcional

# Construir la aplicación
cd frontend
npm install
npm run build

# Sincronizar con S3
aws s3 sync build/ s3://$BUCKET_NAME --delete

# Invalidar CloudFront (opcional)
# aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"