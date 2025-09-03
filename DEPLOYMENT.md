# 🚀 Deployment Guide

This guide will help you deploy your Document Processing System to various platforms.

## 📋 Prerequisites

- Python 3.11+
- Git (for Heroku/Railway deployment)
- Docker (for containerized deployment)
- API key for Document Understanding API (optional)

## 🐳 Option 1: Docker Deployment (Recommended for Production)

### Quick Start
```bash
# Make sure you're in the project directory
cd doc-understanding-poc

# Deploy with Docker
./deploy.sh docker
```

### Manual Docker Deployment
```bash
# Build the image
docker build -t document-processor .

# Run the container
docker run -d \
    --name document-processor \
    -p 8000:8000 \
    -e API_ENDPOINT=http://document-understanding.rased.io/v1/document-verification \
    -e API_KEY=your_api_key_here \
    -v $(pwd)/uploads:/app/uploads \
    document-processor
```

### Docker Compose (Alternative)
```bash
# Start with Docker Compose
./deploy.sh compose

# Or manually
docker-compose up -d
```

## ☁️ Option 2: Heroku Deployment

### Prerequisites
1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Create a Heroku account
3. Login: `heroku login`

### Quick Deploy
```bash
# Deploy to Heroku
./deploy.sh heroku

# Or with custom app name
HEROKU_APP_NAME=my-doc-processor ./deploy.sh heroku
```

### Manual Heroku Deployment
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set API_ENDPOINT=http://document-understanding.rased.io/v1/document-verification
heroku config:set API_KEY=your_api_key_here

# Deploy
git push heroku main
```

## 🚂 Option 3: Railway Deployment

### Prerequisites
1. Install Railway CLI: `npm install -g @railway/cli`
2. Create a Railway account
3. Login: `railway login`

### Deploy
```bash
# Deploy to Railway
./deploy.sh railway
```

## 🌐 Option 4: VPS/Cloud Server Deployment

### Using Gunicorn
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export FLASK_ENV=production
export API_ENDPOINT=http://document-understanding.rased.io/v1/document-verification
export API_KEY=your_api_key_here

# Run with Gunicorn
gunicorn --bind 0.0.0.0:8000 --workers 4 --timeout 120 app:app
```

### Using Systemd Service
Create `/etc/systemd/system/document-processor.service`:
```ini
[Unit]
Description=Document Processing System
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/your/app
Environment="PATH=/path/to/your/venv/bin"
Environment="FLASK_ENV=production"
Environment="API_ENDPOINT=http://document-understanding.rased.io/v1/document-verification"
Environment="API_KEY=your_api_key_here"
ExecStart=/path/to/your/venv/bin/gunicorn --bind 0.0.0.0:8000 --workers 4 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable document-processor
sudo systemctl start document-processor
```

## 🔧 Environment Configuration

### Required Variables
```bash
# API Configuration
API_ENDPOINT=http://document-understanding.rased.io/v1/document-verification
API_KEY=your_api_key_here

# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
```

### Optional Variables
```bash
# File Upload Configuration
MAX_FILE_SIZE=16777216  # 16MB in bytes
UPLOAD_FOLDER=uploads
```

## 📱 Reverse Proxy Setup (Nginx)

For production deployments, set up Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # File upload support
        client_max_body_size 16M;
    }
}
```

## 🔒 SSL/HTTPS Setup

### Using Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring & Health Checks

### Health Endpoint
Your app includes a health check endpoint:
```bash
curl http://your-domain.com/health
```

### Logs
```bash
# Docker logs
docker logs document-processor

# Heroku logs
heroku logs --tail

# System logs
sudo journalctl -u document-processor -f
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using port 8000
   lsof -i :8000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Permission denied**
   ```bash
   # Fix upload directory permissions
   sudo chown -R www-data:www-data uploads/
   sudo chmod 755 uploads/
   ```

3. **API connection failed**
   - Check your API endpoint URL
   - Verify API key is correct
   - Check network connectivity

4. **File upload fails**
   - Ensure upload directory exists and is writable
   - Check file size limits
   - Verify file type is supported (PDF/PNG)

### Debug Mode
```bash
# Enable debug mode for troubleshooting
export FLASK_DEBUG=True
python main.py
```

## 🔄 Updating Your Deployment

### Docker
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Heroku
```bash
# Commit changes
git add .
git commit -m "Update application"

# Deploy
git push heroku main
```

### Railway
```bash
# Deploy updates
railway up
```

## 📈 Scaling

### Docker Compose Scaling
```bash
# Scale to multiple instances
docker-compose up -d --scale document-processor=3
```

### Load Balancer
For high-traffic applications, consider using a load balancer like:
- Nginx (software)
- HAProxy
- Cloud load balancers (AWS ALB, GCP LB, Azure LB)

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Debug mode disabled
- [ ] SSL certificate installed
- [ ] Reverse proxy configured
- [ ] File upload limits set
- [ ] Monitoring/logging configured
- [ ] Backup strategy in place
- [ ] Health checks working
- [ ] Error handling tested

## 🆘 Getting Help

If you encounter issues:

1. Check the logs: `docker logs document-processor`
2. Verify environment variables
3. Test the health endpoint
4. Check file permissions
5. Review the troubleshooting section above

## 🌟 Deployment Examples

### Quick Docker Test
```bash
# Test locally with Docker
./deploy.sh docker

# Check if it's running
curl http://localhost:8000/health
```

### Production Heroku
```bash
# Deploy to production
API_KEY=your_production_key ./deploy.sh heroku

# Check status
heroku ps
heroku logs --tail
```

---

**Happy Deploying! 🚀**

Your Document Processing System is now ready for production use!
