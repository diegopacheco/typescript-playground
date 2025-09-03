#!/bin/bash

echo "🚀 Starting Express TypeScript Convex MySQL Application"

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found. Please run this script from the project root."
    exit 1
fi

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "📋 Copying .env.example to .env"
        cp .env.example .env
        echo "⚠️  Please update .env with your Convex configuration before continuing."
        echo "   Required variables:"
        echo "   - CONVEX_DEPLOYMENT"
        echo "   - CONVEX_DEPLOY_KEY" 
        echo "   - NEXT_PUBLIC_CONVEX_URL"
        read -p "Press Enter to continue once you've updated .env..."
    else
        echo "❌ No .env file found and no .env.example to copy from."
        exit 1
    fi
fi

echo "🏗️  Building and starting all services..."
echo ""

docker-compose up --build -d
sleep 3

echo ""
echo "✅ Application started successfully!"
echo "=================================================="
echo "🌐 Frontend:      http://localhost:3000"
echo "🔧 Backend API:   http://localhost:3001"
echo "🏥 Health Check:  http://localhost:3001/health"
echo "🗄️  MySQL:        localhost:3306"
echo ""
echo "📊 Service Status:"
docker-compose ps
echo ""
echo "📝 To view logs: docker-compose logs -f [service_name]"
echo "🛑 To stop: ./stop-all.sh or docker-compose down"