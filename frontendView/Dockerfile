# Usa una imagen base de Node.js
FROM node:22-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package.json .

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto del servidor de desarrollo de Vue
EXPOSE 5173

# CORRECCIÓN AQUÍ: Usamos npx para ejecutar directamente el servidor de Vite
CMD ["npx", "vite", "--host", "0.0.0.0"]