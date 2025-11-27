#!/bin/sh

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run migrations
echo "📦 Running migrations..."
npm run db:migrate

# Start the application
echo "🚀 Starting application..."
npm run dev
