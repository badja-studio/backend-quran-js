#!/bin/sh

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations in production
echo "📦 Running migrations..."
npm run db:migrate || {
    echo "⚠️ Migration failed, but continuing..."
}

# Start the application 
echo "🚀 Starting application..."
exec npm start
