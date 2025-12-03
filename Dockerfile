FROM node:18-alpine

WORKDIR /app

# Install system dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files early for caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies for sequelize-cli)
RUN npm install

# Copy application files
COPY . .

# Prune devDependencies AFTER copying code
RUN npm prune --production

# Make entrypoint script executable
RUN chmod +x docker-entrypoint-prod.sh

EXPOSE 3000
