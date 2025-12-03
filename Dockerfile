FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN chmod +x docker-entrypoint-prod.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint-prod.sh"]
