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
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install dependencies (include sequelize-cli for migrations)
RUN npm ci --only=production && npm install --no-save sequelize-cli

# Copy application files
COPY . .

# Make entrypoint script executable
RUN chmod +x docker-entrypoint-prod.sh

# Expose port
EXPOSE 3000

# Use production entrypoint script
ENTRYPOINT ["./docker-entrypoint-prod.sh"]
