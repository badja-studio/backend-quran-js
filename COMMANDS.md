# Backend Quran JS - Commands Guide

## Quick Start

### Development
```bash
# Start development (includes PostgreSQL)
just dev-up

# Or detached mode
just dev-up-d
```

### Database Seeding
```bash
# After development is running, seed the database
just db-seed

# Or reset database (undo seeds, migrate, seed again)
just db-reset

# Or fresh database (drop everything and start fresh)
just db-fresh
```

## Available Commands

Run `just --list` to see all available commands.

### 🐳 Docker Commands
- `just dev-up` - Start development environment
- `just dev-up-d` - Start development in detached mode
- `just dev-down` - Stop development environment
- `just dev-restart` - Restart development
- `just dev-build` - Rebuild and start development
- `just dev-logs` - View development logs
- `just prod-up` - Start production environment
- `just prod-down` - Stop production environment
- `just prod-logs` - View production logs

### 🗄️ Database Commands
- `just db-seed` - Run database seeders
- `just db-seed-undo` - Undo last seeder
- `just db-seed-undo-all` - Undo all seeders
- `just db-reset` - Reset database (undo seeds and seed again)
- `just db-fresh` - Fresh database (drop all, create, seed)

### 💻 Local Development (without Docker)
- `just install` - Install dependencies
- `just dev` - Run development server locally
- `just start` - Run production server locally
- `just seed` - Run seeders locally

### 🛠️ Utility Commands
- `just shell` - Access backend container shell
- `just db-shell` - Access PostgreSQL shell
- `just clean` - Clean up Docker resources
- `just health` - Check API health
- `just docs` - Open API documentation

### 🚀 Production Commands
- `just prod-seed` - Run seeders in production (with confirmation)
- `just prod-shell` - Access production container shell

## Typical Workflow

1. **First Time Setup:**
   ```bash
   just dev-up-d       # Start containers
   just db-seed        # Seed initial data
   ```

2. **Daily Development:**
   ```bash
   just dev-up         # Start and view logs
   # Make changes, hot reload is active
   ```

3. **Database Changes:**
   ```bash
   just db-reset       # Reset and reseed
   # or
   just db-fresh       # Complete fresh start
   ```

4. **Check Health:**
   ```bash
   just health         # Check API status
   just docs           # View API documentation
   ```

5. **Cleanup:**
   ```bash
   just dev-down       # Stop containers
   just clean          # Clean everything
   ```

## Manual Commands (without just)

If you don't have `just` installed:

### Development
```bash
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.dev.yml exec app npm run db:seed
```

### Production
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
docker-compose -f docker-compose.prod.yml exec app npm run db:seed
```

## Notes

- Seeding is now **manual** - not automatic on container start
- Use `just db-seed` to seed data when needed
- Seeders check for existing data to prevent duplicates
- Docker files are clean - no auto-seeding or auto-migration
- Safe for both development and production environments
