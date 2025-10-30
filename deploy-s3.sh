#!/bin/bash

# Instalar dependencias
cd frontend
npm install

# Construir la aplicación
npm run build

# Sincronizar con S3
aws s3 sync build/ s3://YOUR-BUCKET-NAME --delete

# Invalidar la caché de CloudFront (si lo usas)
# aws cloudfront create-invalidation --distribution-id YOUR-DISTRIBUTION-ID --paths "/*"