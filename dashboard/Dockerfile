# Use Node.js 18 LTS como base
FROM node:20-alpine

# Instalar dependências do sistema necessárias
RUN apk add --no-cache git

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json primeiro (para cache de layers)
COPY package.json ./

# Instalar dependências
RUN npm install

# Copiar o resto do código
COPY . .

# Configurar variáveis de ambiente para hot reload
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV FAST_REFRESH=true

# Expor porta 3000 (padrão do React)
EXPOSE 3000

# Comando para desenvolvimento com hot reload
CMD ["npm", "start"]
