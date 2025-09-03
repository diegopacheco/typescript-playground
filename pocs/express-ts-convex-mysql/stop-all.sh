#!/bin/bash

echo "🛑 Stopping Express TypeScript Convex MySQL Application"

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running."
    exit 1
fi

if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found. Please run this script from the project root."
    exit 1
fi

echo "📊 Current service status:"
docker-compose ps
echo ""

echo "🔄 Stopping all services..."
docker-compose down

echo ""
echo "🧹 Cleaning up stopped containers..."
docker-compose rm -f

# Optional: Remove volumes (uncomment if you want to reset database data)
# echo "🗑️  Removing volumes..."
# docker-compose down -v

echo ""
echo "✅ All services stopped successfully!"
echo "=================================================="
echo ""
echo "💡 Useful commands:"
echo "   📊 Check remaining containers: docker ps -a"
echo "   🗑️  Remove all stopped containers: docker container prune"
echo "   🧹 Remove unused images: docker image prune"
echo "   🗄️  Remove volumes (⚠️  deletes database data): docker-compose down -v"