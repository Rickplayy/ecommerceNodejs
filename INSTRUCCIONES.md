# Instrucciones de Configuración y Despliegue

Este documento describe los pasos para configurar y ejecutar el proyecto de e-commerce en un entorno de desarrollo o servidor.

## Requisitos Previos

- **Node.js**: Asegúrate de tener Node.js y npm instalados.
- **Base de Datos**: El proyecto utiliza una base de datos. Deberás tener tus credenciales listas para configurar la conexión.
- **Variables de Entorno**: Crea un archivo `.env` dentro de la carpeta `backend` y configura las variables necesarias, como la URI de conexión a la base de datos y las credenciales para el servicio de email.

## 1. Instalación de Dependencias

Antes de ejecutar el proyecto, debes instalar todas las dependencias tanto para el backend como para el frontend.

Ejecuta los siguientes comandos en la **raíz del proyecto**:

```bash
# Instalar dependencias del backend
npm install --prefix backend

# Instalar dependencias del frontend
npm install --prefix frontend
```

## 2. Cargar Datos Iniciales en la Base de Datos (Opcional)

Si es la primera vez que configuras el proyecto y deseas cargar un conjunto de datos iniciales (como productos de ejemplo), puedes usar el script de seeding.

Ejecuta el siguiente comando desde la **raíz del proyecto**:

```bash
# Este comando ejecuta el script 'seed.js' del backend
node backend/seed.js
```

## 3. Ejecución del Proyecto

Para iniciar tanto el servidor del backend como el de frontend de forma simultánea, hemos configurado un único comando que puedes ejecutar desde la **raíz del proyecto**.

```bash
# Este comando utiliza 'concurrently' para lanzar ambos servicios
npm run start:dev
```

Una vez ejecutado, el frontend estará disponible generalmente en `http://localhost:3000` y el backend en `http://localhost:5000` (o los puertos que hayas configurado).
