#!/bin/sh

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Start the application (will auto-create tables via sequelize.sync())
echo "🚀 Starting application..."
exec npm start
