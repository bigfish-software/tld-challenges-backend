# TLD Challenges Backend

Strapi CMS/API backend for [tld-challenges.com](https://tld-challenges.com) - a web platform for The Long Dark community to manage challenges, tournaments, custom game settings, and run submissions.

## Architecture Overview

This repository contains the **Strapi CMS/API backend** that serves as the central API layer for the TLD Challenges platform.

### Core Architecture Pattern
```
Frontend (React) → Strapi API (this repo) → PostgreSQL Database (tld-challenges-database repo)
```

**Critical Constraint**: The frontend has no direct database communication. All data access occurs exclusively through this Strapi backend API.

## Technology Stack

- **Framework**: Strapi v5+ (TypeScript)
- **Database**: PostgreSQL 17 (via tld-challenges-database repo)
- **Container**: Docker deployment
- **Security**: Rate limiting, input validation, IP-based abuse prevention
- **Moderation**: Draft/Publish workflow for anonymous submissions

## Key Features

### Anonymous Submission System
- **No User Management**: Submissions work like contact forms - no authentication required
- **Security First**: Built-in rate limiting and DDOS protection
- **Moderation Workflow**: All submissions start as drafts requiring admin approval
- **IP Tracking**: Prevents spam and enforces submission limits

### External Media Integration
- **No File Storage**: Only metadata and URLs to YouTube/Twitch content
- **URL Validation**: Automated validation and metadata extraction
- **Performance Optimized**: No media processing or storage overhead

### Content Types (Planned)
- **Challenge**: Main challenge definitions with rules and metadata
- **Category**: Challenge categorization and organization
- **Submission**: Anonymous run submissions with validation and moderation
- **Tournament**: Tournament structures and participant management
- **User**: Extended profiles for community features (admin-only)
- **Setting**: Custom game configuration codes

## Setup and Development

### Prerequisites
- Node.js (v20 or v22 - Active LTS versions only)
- npm, yarn, or pnpm
- Docker and Docker Compose
- Access to tld-challenges-database repository

### Local Development Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/bigfish-software/tld-challenges-backend.git
   cd tld-challenges-backend
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
   npm run develop
   ```

5. **Access Admin Panel**
   - Admin Panel: `http://localhost:1337/admin`
   - API Endpoints: `http://localhost:1337/api/`

### Project Structure

```
src/
├── api/                    # Business logic per API
│   ├── challenge/         # Challenge-related endpoints
│   ├── category/          # Challenge categories
│   ├── tournament/        # Tournament management
│   ├── submission/        # Run submissions
│   └── leaderboard/       # Ranking and scores
├── components/            # Reusable content components
├── extensions/            # Plugin extensions
├── middlewares/           # Custom middleware
├── plugins/               # Local plugins
└── policies/              # Access control policies
```

## Security Implementation

### Rate Limiting
- Built-in Strapi rate limiting middleware
- IP + endpoint + user tracking
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
- **Lifecycle Hooks**: Automated status transitions

## API Development Guidelines

### Content-Type First Approach
1. Define data structure through Strapi Content-Type Builder
2. Configure relationships and validations
3. Set up permissions for public/admin access
4. Customize endpoints in controllers if needed

### Custom Endpoint Development
- **Controllers**: `src/api/[entity]/controllers/`
- **Services**: `src/api/[entity]/services/`
- **Routes**: `src/api/[entity]/routes/`
- **Lifecycle Hooks**: Validation and processing in content-type lifecycle functions

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

### API Customization Priority
1. **Leaderboard Logic**: Complex ranking calculations
2. **Submission Validation**: Business rules for run verification
3. **Tournament Management**: Bracket and scoring systems
4. **Content Filtering**: Category-based organization
5. **Media Validation**: URL validation and metadata extraction

## Contributing

### Development Priorities
1. **Content-Type First**: Define data structure through Strapi admin before coding
2. **API Extension**: Customize generated endpoints for complex business logic
3. **Validation Layer**: Implement robust data validation in lifecycle hooks
4. **Security Implementation**: Configure rate limiting, input sanitization, and abuse prevention
5. **Moderation Workflow**: Set up draft/publish system for submission approval process
6. **Performance**: Optimize queries for leaderboard and submission listing
7. **Anonymous Access**: Configure proper permissions for public submission endpoints

### Code Quality Standards
- TypeScript strict mode enabled
- Follow Strapi v5+ conventions
- Comprehensive input validation
- Security-first approach
- Performance optimization for public endpoints

## Related Repositories

- **Database**: [tld-challenges-database](https://github.com/bigfish-software/tld-challenges-database) - PostgreSQL setup and configuration
- **Frontend**: Coming soon - React + Tailwind CSS client

## License

MIT License - see LICENSE file for details

## Support

For development questions and issues:
- Check [Strapi Documentation](https://docs.strapi.io/)
- Review project's copilot instructions in `.github/copilot-instructions.md`
- Open issues in this repository for backend-specific problems