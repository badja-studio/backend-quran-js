#!/bin/sh

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Start the application in background to let it create tables via sequelize.sync()
echo "🚀 Starting application to initialize database..."
npm run dev &
APP_PID=$!

# Wait for tables to be created
echo "⏳ Waiting for database tables to be created..."
sleep 15

# Run seeders
echo "🌱 Running database seeders..."
npm run db:seed || echo "⚠️  Seeding failed or already seeded"

# Keep the application running in foreground
wait $APP_PID
