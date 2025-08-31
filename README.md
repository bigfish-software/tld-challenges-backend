# TLD Challenges Backend

Strapi CMS/API backend for [tld-challenges.com](https://tld-challenges.com) - a web platform for The Long Dark community to manage challenges, tournaments, custom game settings, and run submissions.

## Architecture Overview

This repository contains the **Strapi CMS/API backend** that serves as the central API layer for the TLD Challenges platform.

### Core Architecture Pattern
```
Frontend (React) → Strapi API (this repo) → PostgreSQL Database (tld-challenges-database repo)
```

## Technology Stack

- **Framework**: Strapi v5+ (TypeScript)
- **Database**: PostgreSQL 17 (via tld-challenges-database repo)
- **Container**: Docker deployment
- **Security**: Rate limiting, input validation, IP-based abuse prevention
- **Moderation**: Draft/Publish workflow for anonymous submissions

## Key Features

### Authentication System
- **No User Management**: Submissions and ideas are created using a single frontend JWT token
- **Long-lived JWT Frontend Token**: Frontend uses a single environment-configured JWT token
- **All Endpoints Protected**: All API endpoints require authentication
- **Security First**: Built-in rate limiting and authentication protection
- **Moderation Workflow**: All submissions and ideas start as drafts requiring admin approval

### External Media Integration
- **No File Storage**: Only metadata and URLs to YouTube/Twitch content
- **URL Validation**: Automated validation and metadata extraction for submissions and ideas
- **Performance Optimized**: No media processing or storage overhead

### Content Types (Implemented)
- **Challenge**: Main challenge definitions with thumbnails, dual descriptions, difficulty levels, and featured status
- **Submission**: User run submissions with external media links and workflow management
- **Tournament**: Tournament structures with comprehensive metadata and participant management
- **CustomCode**: Reusable custom game configuration codes with thumbnails and featured status
- **Rule**: Modular rule definitions with many-to-many challenge relationships
- **Creator**: Challenge creator profiles with social media links and additional social connections
- **FAQ**: Frequently asked questions with multi-entity associations (challenges, custom codes, tournaments)
- **Idea**: Community suggestions and content ideas linked to creators with automatic social link creation
- **Creator-Social**: Additional social media links for creators beyond Twitch/YouTube
- **Stats**: Dashboard statistics endpoint for content counts

## Setup and Development

### Prerequisites
- Node.js (v20 or v22 - Active LTS versions only)
- npm, yarn, or pnpm
- Docker and Docker Compose
- Access to tld-challenges-database repository

### Quick Start with Docker

For the fastest setup, use Docker containers:

```bash
# 1. Clone repository
git clone https://github.com/bigfish-software/tld-challenges-backend.git
cd tld-challenges-backend

# 2. Setup environment
cp .env.docker .env
# Edit .env and set secure passwords and keys

# 3. Create Docker network
docker network create tld-challenges

# 4. Start services (includes database)
docker-compose -f docker-compose.full.yml up -d

# 5. Check health
curl http://localhost:1337/_health
```

**See [Docker Setup Guide](docs/docker-setup.md) for detailed containerization instructions.**

### Local Development Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/bigfish-software/tld-challenges-backend.git
   cd tld-challenges-backend/strapi
   npm install
   ```

2. **Database Setup**
   ```bash
   # Ensure the tld-challenges database is running
   # See: https://github.com/bigfish-software/tld-challenges-database
   
   # Verify the 'tld-challenges' Docker network exists
   docker network ls
   
   # If missing, create it:
   docker network create tld-challenges
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and app keys
   ```

4. **Start Development Server**
   ```bash
   # From the strapi directory
   npm run develop
   ```

5. **Access Admin Panel**
   - Admin Panel: `http://localhost:1337/admin`
   - API Endpoints: `http://localhost:1337/api/`

### Project Structure

```
/
├── docs/                   # Setup guides and documentation
├── strapi/                 # Strapi CMS application
│   ├── src/
│   │   ├── api/            # Business logic per API
│   │   │   ├── challenge/  # Challenge-related endpoints with slug support
│   │   │   ├── creator/    # Creator profiles and attribution with slug support
│   │   │   ├── custom-code/ # Custom game configuration codes with slug support
│   │   │   ├── faq/        # Frequently asked questions
│   │   │   ├── idea/       # Community suggestions with social link automation
│   │   │   ├── rule/       # Modular challenge rules  
│   │   │   ├── stats/      # Statistics and dashboard endpoints
│   │   │   ├── submission/ # Anonymous run submissions with validation
│   │   │   └── tournament/ # Tournament management with slug support
│   │   ├── components/     # Reusable content components
│   │   ├── extensions/     # Plugin extensions
│   │   ├── middlewares/    # Custom middleware
│   │   ├── plugins/        # Local plugins
│   │   └── policies/       # Access control policies
│   ├── config/             # Strapi configuration
│   ├── database/           # Database files
│   └── types/              # TypeScript type definitions
├── .github/                # GitHub workflows and templates
├── README.md               # Project documentation
└── LICENSE                 # License file
```

## Security Implementation

### Rate Limiting
- Built-in Strapi rate limiting middleware
- Unified limits for all endpoints (anonymous submissions and authenticated queries)
- IP + endpoint tracking for single frontend consumer
- Configurable limits per endpoint type
- DDOS protection for submission endpoints

### Input Validation
- Strapi's built-in validation system
- Custom validators for business rules
- Content-type schema validation
- External URL validation for media links

### Moderation Workflow
- **Draft Status**: All submissions start as drafts
- **Admin Review**: Manual approval process through admin panel
- **Status Tracking**: Enum field (pending/approved/rejected)

## API Development Guidelines

### Content-Type First Approach
1. Define data structure through Strapi Content-Type Builder
2. Configure relationships and validations
3. Set up permissions for public/admin access
4. Customize endpoints in controllers if needed

### Custom Endpoint Development
- **Controllers**: `strapi/src/api/[entity]/controllers/`
- **Services**: `strapi/src/api/[entity]/services/`
- **Routes**: `strapi/src/api/[entity]/routes/`

### Anonymous Submission Security
```javascript
// Example rate limiting configuration
{
  interval: { min: 5 },
  max: 5,
  prefixKey: `${submissionType}:${ctx.request.ip}`,
  handler() {
    throw new RateLimitError();
  }
}
```

## Integration Points

### Database Connection
- Connects to PostgreSQL via configuration (no direct queries)
- Uses `tld-challenges-db` container via shared Docker network
- Schema management handled entirely by Strapi

### External Media Handling
- Store only URLs and metadata for YouTube/Twitch content
- No local file storage or processing
- Automated URL validation and metadata extraction

### Frontend Communication
- RESTful API endpoints with JSON responses
- Public endpoints for submissions (no auth required)
- Long-lived JWT token for authenticated content queries (single frontend consumer)
- Admin endpoints for content management

## Deployment Strategy

### Container Deployment
- Docker deployment compatible with DigitalOcean, Railway, or Render
- Environment-based configurations
- Connects to managed PostgreSQL instances in production

### Environment Variables
```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=tld_challenges
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi

# Strapi
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt

# Frontend Integration
FRONTEND_API_TOKEN=your-long-lived-jwt-token
```

### Production Considerations
- Rate limiting enabled by default
- Security middleware configured
- Content moderation workflow active
- Performance optimized for anonymous access

## Development Workflow

### Content-Type Development
1. **Design First**: Create content-types through admin panel
2. **Validate**: Test data structure and relationships
3. **Secure**: Configure permissions and validation rules
4. **Extend**: Add custom business logic if needed

## Contributing

### Code Quality Standards
- TypeScript strict mode enabled
- Follow Strapi v5+ conventions
- Comprehensive input validation
- Security-first approach

## Documentation

### Setup and Configuration
- **[Initial Setup Guide](docs/initial-setup.md)** - Complete step-by-step setup instructions
- **[Docker Setup Guide](docs/docker-setup.md)** - Containerization and deployment guide
- **[Implementation Notes](docs/implementation-notes.md)** - Key architectural decisions and changes
- **[Object Relation Model](docs/orm.md)** - Comprehensive data model visualization and specifications
- **[API Reference](docs/api-reference.md)** - Complete documentation of all available endpoints

### Development Resources
- **[Strapi Documentation](https://docs.strapi.io/)** - Official Strapi v5+ documentation
- **[Copilot Instructions](.github/copilot-instructions.md)** - AI development guidance and project context

## Related Repositories

- **Database**: [tld-challenges-database](https://github.com/bigfish-software/tld-challenges-database) - PostgreSQL setup and configuration
- **Frontend**: Coming soon - React + Tailwind CSS client

## License

MIT License - see LICENSE file for details
