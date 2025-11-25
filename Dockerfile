FROM node:18-alpine

WORKDIR /app

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
