#!/bin/bash

# Navegar al directorio frontend (si no estás ya dentro)
cd frontend

# Instalar las dependencias del frontend
npm install

# Realizar la construcción de la aplicación React
npm run build

# Opcional: Asegúrate de que el build esté en la carpeta correcta, si tienes alguna configuración personalizada
echo "Frontend build completed successfully!"