# TLD Challenges Backend

Strapi CMS/API backend for [tld-challenges.com](https://tld-challenges.com) - a web platform for The Long Dark community to manage challenges, tournaments, custom game settings, and run submissions.

## Architecture Overview

```
Frontend (React) → Strapi API (this repo) → PostgreSQL Database (tld-challenges-database repo)
```

- **Framework**: Strapi v5+ (TypeScript)
- **Database**: PostgreSQL 17
- **Deployment**: Docker containers

## Prerequisites

- Node.js (v20 or v22)
- Docker and Docker Compose
- Access to tld-challenges-database repository

## Local Development Setup

### Option 1: Direct Development (Recommended)

1. **Clone and Install**
   ```bash
   git clone https://github.com/bigfish-software/tld-challenges-backend.git
   cd tld-challenges-backend
   ```

2. **Generate Security Keys**
   ```bash
   node generate-secrets.js
   ```

3. **Setup Environment**
   ```bash
   cd strapi
   cp .env.example .env
   # Edit .env with your database credentials and the generated keys
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Start Development Server**
   ```bash
   npm run develop
   ```

6. **Access Application**
   - Admin Panel: `http://localhost:1337/admin`
   - API Endpoints: `http://localhost:1337/api/`

### Option 2: Container Development

1. **Setup Environment**
   ```bash
   cd strapi
   cp .env.development.local.example .env.development.local
   # Edit .env.development.local with your database credentials
   ```

2. **Create Docker Network**
   ```bash
   docker network create tld-challenges
   ```

3. **Build and Start**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

## Environment Variables

```bash
# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=tld_challenges
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false

# Strapi Configuration
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
```

## Production Deployment

**Railway**: Pushes to the `main` branch automatically trigger production deployment on Railway.

Environment variables are configured through Railway dashboard. Use `generate-secrets.js` to create secure keys for production.

## Documentation

- **[API Reference](docs/api-reference.md)** - Complete endpoint documentation
- **[Data Model](docs/orm.md)** - Database schema and relationships
- **[Docker Setup](docs/docker-setup.md)** - Containerization guide

## Related Repositories

- **Database**: [tld-challenges-database](https://github.com/bigfish-software/tld-challenges-database) - PostgreSQL setup and configuration
- **Frontend**: [tld-challenges-frontend](https://github.com/bigfish-software/tld-challenges-frontend) - React + Tailwind CSS client

## License

MIT License - see LICENSE file for details
