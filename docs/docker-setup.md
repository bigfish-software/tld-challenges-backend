# Docker Setup Guide

This guide explains how to containerize and run the TLD Challenges backend using Docker.

## Architecture Overview

The TLD Challenges platform uses a containerized architecture:

```
Frontend (React) → Backend Container (Strapi) → Database Container (PostgreSQL)
```

## Prerequisites

- Docker Engine 20.0+
- Docker Compose 2.0+
- At least 2GB available RAM
- 5GB available disk space

## Quick Start

### 1. Environment Setup

Copy the Docker environment template:

```bash
cp .env.docker .env
```

Edit `.env` and update the following **critical** values:

```bash
# Database password (required)
DATABASE_PASSWORD=your_very_secure_password

# Strapi security keys (generate new ones!)
APP_KEYS="key1,key2,key3,key4"
API_TOKEN_SALT=your_unique_salt
ADMIN_JWT_SECRET=your_admin_secret
TRANSFER_TOKEN_SALT=your_transfer_salt
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
FRONTEND_API_TOKEN=your_frontend_token
```

**Security Note**: Never use the default keys in production!

### 2. Generate Secure Keys

Use Node.js to generate cryptographically secure keys:

```bash
# Generate a random base64 key
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Generate multiple keys for APP_KEYS (comma-separated)
node -e "console.log([1,2,3,4].map(() => require('crypto').randomBytes(16).toString('base64')).join(','))"
```

### 3. Network Setup

Create the shared Docker network (required for multi-container communication):

```bash
docker network create tld-challenges
```

### 4. Start Services

#### Option A: Backend Only (assumes database is running separately)

```bash
# Build and start the backend container
docker-compose up -d

# View logs
docker-compose logs -f tld-challenges-backend
```

#### Option B: Full Stack (backend + database)

```bash
# Start both backend and database
docker-compose -f docker-compose.full.yml up -d

# View logs for all services
docker-compose -f docker-compose.full.yml logs -f
```

### 5. Verify Services

Check that services are running:

```bash
# Check container status
docker ps

# Test backend health endpoint
curl http://localhost:1337/_health

# Test API endpoint
curl http://localhost:1337/api/challenges
```

## Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `DATABASE_HOST` | Database hostname | `tld-challenges-db` |
| `DATABASE_PORT` | Database port | `5432` |
| `DATABASE_NAME` | Database name | `tld_challenges` |
| `DATABASE_USERNAME` | Database user | `cms` |
| `DATABASE_PASSWORD` | Database password | *required* |
| `APP_KEYS` | Strapi app keys | *required* |
| `FRONTEND_API_TOKEN` | Frontend API token | *required* |

### Volume Mounts

| Volume | Purpose | Location |
|--------|---------|----------|
| `strapi_uploads` | User uploaded files | `/app/public/uploads` |
| `strapi_data` | Strapi metadata | `/app/.strapi` |

## Development Workflow

### Local Development with Docker

1. Start database container:
   ```bash
   docker-compose -f docker-compose.full.yml up -d tld-challenges-db
   ```

2. Run Strapi in development mode locally:
   ```bash
   cd strapi
   npm run develop
   ```

3. Or run everything in containers:
   ```bash
   docker-compose -f docker-compose.full.yml up -d
   ```

### Building Custom Images

```bash
# Build backend image
docker build -t tld-challenges-backend:latest .

# Build with custom tag
docker build -t tld-challenges-backend:v1.0.0 .
```

### Database Integration

The backend connects to the database using the `tld-challenges` Docker network. Ensure:

1. Database container is named `tld-challenges-db`
2. Both containers are on the `tld-challenges` network
3. Database accepts connections from the backend container

## Production Deployment

### Docker Compose Deployment

1. Clone repository on production server
2. Configure production environment variables in `.env`
3. Start services:
   ```bash
   docker-compose -f docker-compose.full.yml up -d
   ```

### Container Registry Deployment

1. Build and tag image:
   ```bash
   docker build -t your-registry/tld-challenges-backend:latest .
   docker push your-registry/tld-challenges-backend:latest
   ```

2. Deploy using your orchestration platform (Docker Swarm, Kubernetes, etc.)

### Hosting Platform Deployment

This setup is compatible with:

- **DigitalOcean App Platform**: Direct Docker deploy
- **Railway**: Git-based Docker deployment
- **Render**: Docker container deployment
- **AWS ECS/Fargate**: Container orchestration
- **Google Cloud Run**: Serverless containers

## Monitoring and Maintenance

### Health Checks

The backend includes a health check endpoint at `/_health`:

```bash
# Check health status
curl http://localhost:1337/_health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 3600.123,
  "services": {
    "database": "connected",
    "strapi": "running"
  }
}
```

### Log Management

```bash
# View backend logs
docker-compose logs -f tld-challenges-backend

# View all logs
docker-compose -f docker-compose.full.yml logs -f

# View logs with timestamps
docker-compose logs -f -t tld-challenges-backend
```

### Performance Monitoring

Monitor container resources:

```bash
# Resource usage
docker stats

# Container processes
docker exec tld-challenges-backend ps aux

# Database connections
docker exec tld-challenges-db psql -U cms -d tld_challenges -c "SELECT * FROM pg_stat_activity;"
```

## Troubleshooting

### Common Issues

1. **Container fails to start**
   ```bash
   # Check logs for errors
   docker-compose logs tld-challenges-backend
   
   # Verify environment variables
   docker-compose config
   ```

2. **Database connection issues**
   ```bash
   # Verify network connectivity
   docker exec tld-challenges-backend ping tld-challenges-db
   
   # Check database is accepting connections
   docker exec tld-challenges-db pg_isready -U cms
   ```

3. **Port conflicts**
   ```bash
   # Check what's using port 1337
   netstat -tulpn | grep 1337
   
   # Use different port in docker-compose.yml
   ports:
     - "8080:1337"  # Map to port 8080 instead
   ```

### Reset and Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes (data loss!)
docker-compose down -v

# Remove images
docker rmi tld-challenges-backend:latest

# Clean up Docker system
docker system prune -f
```

## Security Considerations

### Production Security

1. **Never use default secrets** - Generate unique keys for each deployment
2. **Use environment-specific configurations** - Separate `.env` files for dev/staging/prod
3. **Limit network exposure** - Only expose necessary ports
4. **Regular updates** - Keep base images and dependencies updated
5. **Backup strategies** - Implement automated backups for volumes

### Network Security

- Backend container only exposes port 1337
- Database is not directly accessible from outside the Docker network
- All inter-service communication uses internal Docker networking

## Related Documentation

- [Database Setup Guide](https://github.com/bigfish-software/tld-challenges-database)
- [Strapi Configuration](./strapi/README.md)
- [API Documentation](./docs/api-reference.md)
- [Deployment Guide](./docs/deployment.md)
