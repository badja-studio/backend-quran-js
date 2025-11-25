#!/bin/sh

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Start the application
echo "🚀 Starting application..."
npm run dev
