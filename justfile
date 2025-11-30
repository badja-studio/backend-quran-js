# Justfile for Backend Quran JS
# Run `just --list` to see all available commands

# Default recipe - show help
default:
    @just --list

# ========================================
# Docker Commands
# ========================================

# Start development environment (with PostgreSQL)
dev-up:
    docker-compose -f docker-compose.dev.yml up

# Start development environment in detached mode
dev-up-d:
    docker-compose -f docker-compose.dev.yml up -d

# Setup development environment with auto-seeding
dev-setup:
    @echo "🚀 Setting up development environment..."
    docker-compose -f docker-compose.dev.yml up -d
    @echo "⏳ Waiting for services to be ready..."
    sleep 10
    @echo "🔄 Running migrations..."
    docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
    @echo "🌱 Running all seeders..."
    just dev-seed-all
    @echo "✅ Development environment ready with data!"

# Stop development environment
dev-down:
    docker-compose -f docker-compose.dev.yml down

# Restart development environment
dev-restart:
    docker-compose -f docker-compose.dev.yml restart

# Rebuild and start development environment
dev-build:
    docker-compose -f docker-compose.dev.yml up --build -d
    @echo "⏳ Waiting for services to be ready..."
    sleep 10
    @echo "🌱 Running seeders..."
    docker-compose -f docker-compose.dev.yml exec app npm run db:seed || echo "⚠️  Seeders already ran or failed"
    @echo "✅ Development environment ready!"
    docker-compose -f docker-compose.dev.yml logs -f

# Start production environment (external database)
prod-up:
    docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Stop production environment
prod-down:
    docker-compose -f docker-compose.prod.yml down

# View logs for development
dev-logs:
    docker-compose -f docker-compose.dev.yml logs -f

# View logs for production
prod-logs:
    docker-compose -f docker-compose.prod.yml logs -f

# ========================================
# Database Commands
# ========================================

# Run database seeders (development)
db-seed:
    docker-compose -f docker-compose.dev.yml exec app npm run db:seed

# Undo last seeder (development)
db-seed-undo:
    docker-compose -f docker-compose.dev.yml exec app npm run db:seed:undo

# Undo all seeders (development)
db-seed-undo-all:
    docker-compose -f docker-compose.dev.yml exec app npm run db:seed:undo:all

# Reset database (undo all seeds and seed again)
db-reset:
    @echo "🔄 Resetting database..."
    docker-compose -f docker-compose.dev.yml exec app npm run db:seed:undo:all || true
    docker-compose -f docker-compose.dev.yml exec app npm run db:seed
    @echo "✅ Database reset complete!"

# Fresh database (drop all and seed)
db-fresh:
    @echo "🗑️  Dropping database..."
    docker-compose -f docker-compose.dev.yml down -v
    @echo "🚀 Starting fresh database..."
    docker-compose -f docker-compose.dev.yml up -d
    @echo "⏳ Waiting for database to be ready..."
    sleep 15
    @echo "🌱 Running seeders..."
    docker-compose -f docker-compose.dev.yml exec app npm run db:seed
    @echo "✅ Fresh database ready!"

# Inject test data (15 assessee with different statuses)
db-test:
    @echo "📊 Injecting test data..."
    docker-compose -f docker-compose.dev.yml exec app npx sequelize-cli db:seed
    @echo "✅ Test data injected!"
    @echo "   - 5 assessee BELUM ASESMEN (TST001-TST005)"
    @echo "   - 5 assessee SIAP ASESMEN (TST006-TST010)"
    @echo "   - 5 assessee DENGAN HASIL (TST011-TST015)"

# Run only master data seeders
db-seed-master:
    @echo "🏛️  Seeding master wilayah data..."
    docker-compose -f docker-compose.dev.yml exec app node seeders/seed-master-wilayah.js
    @echo "✅ Master data seeded!"

# Run only new data seeders  
db-seed-new:
    @echo "📝 Seeding additional data..."
    docker-compose -f docker-compose.dev.yml exec app node seeders/seed-new-data.js
    @echo "✅ Additional data seeded!"


# ========================================
# Local Development (without Docker)
# ========================================

# Install dependencies
install:
    npm install

# Run development server locally
dev:
    npm run dev

# Run production server locally
start:
    npm start

# Run seeders locally
seed:
    npm run db:seed

# Run all seeders (both Sequelize and manual seeders)
dev-seed-all:
    @echo "📊 Running Sequelize seeders..."
    docker compose -f docker-compose.dev.yml exec app npm run db:seed || echo "⚠️  Sequelize seeders already ran or failed"
    @echo "🏛️  Running master wilayah seeder..."
    docker compose -f docker-compose.dev.yml exec app node seeders/seed-master-wilayah.js || echo "⚠️  Master data already seeded"
    @echo "📝 Running additional data seeders..."
    docker compose -f docker-compose.dev.yml exec app node seeders/seed-new-data.js || echo "⚠️  Additional data already seeded"
    @echo "✅ All seeders completed!"

# ========================================
# Docker Utility Commands
# ========================================

# Access backend container shell (development)
shell:
    docker-compose -f docker-compose.dev.yml exec app sh

# Access PostgreSQL container shell (development)
db-shell:
    docker-compose -f docker-compose.dev.yml exec postgres psql -U quran_user -d quran_db

# Clean up Docker resources
clean:
    @echo "🧹 Cleaning up Docker resources..."
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
    @echo "✅ Cleanup complete!"

# ========================================
# Testing & Utilities
# ========================================

# Check API health
health:
    @echo "🏥 Checking API health..."
    @curl -s http://localhost:3000/api/health | jq . || echo "API is not running or jq is not installed"

# View API documentation
docs:
    @echo "📚 Opening API documentation..."
    @echo "Visit: http://localhost:3000/api-docs"
    @command -v xdg-open >/dev/null 2>&1 && xdg-open http://localhost:3000/api-docs || open http://localhost:3000/api-docs || echo "Please open http://localhost:3000/api-docs in your browser"

# ========================================
# Production Database Commands
# ========================================

# Run seeders in production (use with caution!)
prod-seed:
    @echo "⚠️  Warning: Running seeders in production!"
    @read -p "Are you sure? [y/N] " -n 1 -r; \
    echo; \
    if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
        docker-compose -f docker-compose.prod.yml exec app npm run db:seed; \
    fi

# Access production container shell
prod-shell:
    docker-compose -f docker-compose.prod.yml exec app sh
