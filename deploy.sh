#!/bin/bash

# Document Processing System Deployment Script
# This script helps deploy the application to different platforms

set -e

echo "🚀 Document Processing System Deployment Script"
echo "=============================================="

# Function to deploy with Docker
deploy_docker() {
    echo "🐳 Deploying with Docker..."
    
    # Build the Docker image
    echo "Building Docker image..."
    docker build -t document-processor .
    
    # Run the container
    echo "Starting container..."
    docker run -d \
        --name document-processor \
        -p 8000:8000 \
        -e API_ENDPOINT=http://document-understanding.rased.io/v1/document-verification \
        -e API_KEY=${API_KEY:-} \
        -v $(pwd)/uploads:/app/uploads \
        document-processor
    
    echo "✅ Docker deployment complete!"
    echo "🌐 Access your app at: http://localhost:8000"
}

# Function to deploy with Docker Compose
deploy_compose() {
    echo "🐳 Deploying with Docker Compose..."
    
    # Start services
    docker-compose up -d
    
    echo "✅ Docker Compose deployment complete!"
    echo "🌐 Access your app at: http://localhost:8000"
}

# Function to deploy to Heroku
deploy_heroku() {
    echo "☁️ Deploying to Heroku..."
    
    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
        echo "❌ Heroku CLI not found. Please install it first:"
        echo "   https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    # Check if git repository exists
    if [ ! -d ".git" ]; then
        echo "📁 Initializing git repository..."
        git init
        git add .
        git commit -m "Initial commit for Heroku deployment"
    fi
    
    # Create Heroku app if it doesn't exist
    if [ -z "$HEROKU_APP_NAME" ]; then
        echo "🏗️ Creating Heroku app..."
        heroku create
    else
        echo "🔗 Using existing Heroku app: $HEROKU_APP_NAME"
        heroku git:remote -a $HEROKU_APP_NAME
    fi
    
    # Set environment variables
    echo "⚙️ Setting environment variables..."
    heroku config:set API_ENDPOINT=http://document-understanding.rased.io/v1/document-verification
    if [ ! -z "$API_KEY" ]; then
        heroku config:set API_KEY=$API_KEY
    fi
    
    # Deploy
    echo "🚀 Deploying to Heroku..."
    git push heroku main
    
    echo "✅ Heroku deployment complete!"
    echo "🌐 Your app is live at: $(heroku info -s | grep web_url | cut -d= -f2)"
}

# Function to deploy to Railway
deploy_railway() {
    echo "🚂 Deploying to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        echo "❌ Railway CLI not found. Please install it first:"
        echo "   npm install -g @railway/cli"
        exit 1
    fi
    
    # Login to Railway
    echo "🔐 Logging in to Railway..."
    railway login
    
    # Initialize Railway project
    echo "🏗️ Initializing Railway project..."
    railway init
    
    # Deploy
    echo "🚀 Deploying to Railway..."
    railway up
    
    echo "✅ Railway deployment complete!"
}

# Function to show deployment options
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Deployment options:"
    echo "  docker      Deploy using Docker"
    echo "  compose     Deploy using Docker Compose"
    echo "  heroku      Deploy to Heroku"
    echo "  railway     Deploy to Railway"
    echo "  help        Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  API_KEY     Your API key for the Document Understanding API"
    echo "  HEROKU_APP_NAME  Name of your Heroku app (optional)"
    echo ""
    echo "Examples:"
    echo "  $0 docker"
    echo "  $0 heroku"
    echo "  API_KEY=your_key_here $0 heroku"
}

# Main script logic
case "${1:-help}" in
    docker)
        deploy_docker
        ;;
    compose)
        deploy_compose
        ;;
    heroku)
        deploy_heroku
        ;;
    railway)
        deploy_railway
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown option: $1"
        show_help
        exit 1
        ;;
esac
