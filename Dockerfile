# Build stage
FROM node:18 AS build

WORKDIR /usr/src/app

# Copiar archivos necesarios para la instalación de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Generar el build de producción
RUN npm run build -- --output-path=dist/ps-factory --configuration production

# Production stage
FROM nginx:alpine

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar el contenido generado al contenedor Nginx
COPY --from=build /usr/src/app/dist/ps-factory /usr/share/nginx/html
