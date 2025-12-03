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
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy deps files
COPY package*.json ./

# INSTALL ALL dependencies (dev + prod)
RUN npm install

# Copy source code
COPY . .

# REMOVE devDependencies LATER
RUN npm prune --production

RUN chmod +x docker-entrypoint-prod.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint-prod.sh"]
