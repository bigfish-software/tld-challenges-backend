# Initial Strapi Setup Guide

This guide provides step-by-step instructions for setting up the TLD Challenges backend using Strapi v5+ with TypeScript, PostgreSQL database integration, and security configurations optimized for anonymous submissions.

## Prerequisites Verification

Before starting, ensure you have the following installed:

### Required Software
- **Node.js**: v20 or v22 (Active LTS versions only)
- **Package Manager**: npm (v10+), yarn, or pnpm
- **Docker**: Latest stable version
- **Docker Compose**: v2.0+
- **Git**: Latest version

### Verify Prerequisites
```bash
# Check Node.js version
node --version
# Should show v20.x.x or v22.x.x

# Check npm version
npm --version
# Should show v10.x.x or higher

# Check Docker
docker --version
docker-compose --version

# Check Git
git --version
```

## Step 1: Database Setup

### 1.1 Clone and Setup Database Repository
```bash
# Navigate to your development directory
cd c:\develop\BigFishSoftware\lab

# Clone the database repository
git clone https://github.com/bigfish-software/tld-challenges-database.git
cd tld-challenges-database

# Copy environment template
cp db\.env.sample db\.env
```

### 1.2 Configure Database Environment
Edit `db\.env` with your preferred credentials:
```env
POSTGRES_DB=tld_challenges
POSTGRES_USER=strapi
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_PORT=5432
```

### 1.3 Create Docker Network and Start Database
```bash
# Create shared Docker network
docker network create tld-challenges

# Start PostgreSQL container
docker-compose up -d

# Verify database is running
docker ps
# You should see 'tld-challenges-db' container running
```

## Step 2: Create Strapi Project

### 2.1 Navigate to Backend Directory
```bash
# Return to lab directory
cd c:\develop\BigFishSoftware\lab\tld-challenges-backend

# Create Strapi subdirectory for the actual Strapi project
mkdir strapi
cd strapi
```

### 2.2 Initialize Strapi Project
```bash
# Create Strapi project with TypeScript and PostgreSQL in the current directory
npx create-strapi@latest . --quickstart --typescript --skip-cloud

# When prompted, choose:
# - Skip Strapi Cloud registration (we'll deploy manually)
# - Use TypeScript: Yes
# - Install dependencies: Yes
```

### 2.3 Configure Database Connection
**Replace** the generated `config/database.ts` with PostgreSQL-only configuration:

```typescript
export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'tld_challenges'),
      user: env('DATABASE_USERNAME', 'cms'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false) && {
        key: env('DATABASE_SSL_KEY', undefined),
        cert: env('DATABASE_SSL_CERT', undefined),
        ca: env('DATABASE_SSL_CA', undefined),
        capath: env('DATABASE_SSL_CAPATH', undefined),
        cipher: env('DATABASE_SSL_CIPHER', undefined),
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
      schema: env('DATABASE_SCHEMA', 'public'),
    },
    pool: { 
      min: env.int('DATABASE_POOL_MIN', 2), 
      max: env.int('DATABASE_POOL_MAX', 10) 
    },
    acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    debug: false,
  },
});
```

> **Note**: Strapi generates a multi-database template by default. We replace it with PostgreSQL-only configuration to eliminate unnecessary complexity and align with our project requirements.

## Step 3: Environment Configuration

### 3.1 Create Environment File
Copy the example file and configure your environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual values
```

Your `.env` file should contain:
```env
# Server Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=development

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=tld_challenges
DATABASE_USERNAME=cms
DATABASE_PASSWORD=your_secure_password_here
DATABASE_SSL=false

# Strapi Security Keys (generate new ones for production)
APP_KEYS=your-app-key-1,your-app-key-2,your-app-key-3,your-app-key-4
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Frontend API Token (Long-lived JWT for single frontend consumer)
FRONTEND_API_TOKEN=your-long-lived-api-token-here
```

### 3.2 Generate Security Keys
```bash
# Install key generation utility
npm install -g @strapi/generate-new

# Generate new keys
npx @strapi/generate-new

# Copy the generated keys to your .env file
```

> **Important**: Replace the placeholder values in your `.env` file with the generated keys.

### 3.3 Environment Template Reference
The `.env.example` file is provided as a reference with the following structure:
```env
# Server Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=development

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=tld_challenges
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_database_password
DATABASE_SSL=false

# Strapi Security Keys
APP_KEYS="toBeModified1,toBeModified2,toBeModified3,toBeModified4"
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
TRANSFER_TOKEN_SALT=tobemodified
JWT_SECRET=tobemodified
ENCRYPTION_KEY=tobemodified

# Frontend API Token (Long-lived JWT for single frontend consumer)
FRONTEND_API_TOKEN=your-long-lived-api-token-here
```

## Step 4: Security and Rate Limiting Configuration

### 4.1 Configure Middleware for Security
Create `config/middlewares.ts`:
```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // Add rate limiting middleware
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'cdn.jsdelivr.net',
            'strapi.io',
            'youtube.com',
            'ytimg.com',
            'twitch.tv',
            'static-cdn.jtvnw.net',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'youtube.com',
            'twitch.tv',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
```

### 4.2 Configure CORS for Frontend Integration
Update `config/middlewares.ts` to include CORS configuration:
```typescript
// Add after 'strapi::cors'
{
  name: 'strapi::cors',
  config: {
    origin: ['http://localhost:3000', 'https://tld-challenges.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    keepHeaderOnError: true,
  },
},
```

## Step 5: Install Required Dependencies

### 5.1 Install PostgreSQL Driver
```bash
npm install pg
npm install --save-dev @types/pg
```

### 5.2 Install Additional Security Packages
```bash
# Rate limiting and security utilities
npm install koa2-ratelimit
npm install @strapi/utils

# URL validation for external media links
npm install validator
npm install --save-dev @types/validator
```

## Step 6: Content-Type Structure Setup

### 6.1 Plan Content-Type Architecture
Before starting the Strapi server, plan your content-types based on the project requirements:

1. **Challenge** (Collection Type)
   - Fields: 
     - name (Text)
     - description (Rich text (Blocks))
     - difficulty (Enumeration: "Beginner", "Intermediate", "Advanced", "Expert")
     - slug (UID, targetField: title)
     - created_date (Date)
     - updated_date (Date)
   - Relations: 
     - category (Relation: Many to One with Category)
     - submissions (Relation: One to Many with Submission)
     - custom_code (Relation: One to One with CustomCode)
     - rules (Relation: One to Many with Rule)
     - tournaments (Relation: Many to Many with Tournament)
     - creators (Relation: Many to Many with Creator)

2. **Category** (Collection Type)
   - Fields:
     - name (Text)
     - description (Rich text (Blocks))
     - slug (UID, targetField: name)
     - icon (Text)
   - Relations:
     - challenges (Relation: One to Many with Challenge)

3. **Submission** (Collection Type)
   - Fields:
     - runner (Text)
     - runner_url (Text)
     - video_url (Text)
     - notes (Text)
     - status (Enumeration: "pending", "approved", "rejected", default: "pending")
     - result (Text)
     - submitted_date (Date)
   - Relations:
     - challenge (Relation: Many to One with Challenge)
   - Special: Draft/Publish enabled for moderation

4. **Tournament** (Collection Type)
   - Fields:
     - name (Text)
     - description (Rich text (Blocks))
     - slug (UID, targetField: name)
     - start_date (Date)
     - end_date (Date)
     - status (Enumeration: "planned", "active", "completed", "cancelled", default: "planned")
   - Relations:
     - challenges (Relation: Many to Many with Challenge)
     - creators (Relation: Many to Many with Creator)

5. **CustomCode** (Collection Type)
   - Fields:
     - name (Text)
     - code (Text)
     - description (Rich text (Blocks))
     - slug (UID, targetField: name)
   - Relations:
     - challenge (Relation: One to One with Challenge)
     - creators (Relation: Many to Many with Creator)

6. **Rule** (Collection Type)
   - Fields:
     - description (Rich text (Blocks))
   - Relations:
     - challenge (Relation: Many to One with Challenge)

7. **Creator** (Collection Type)
   - Fields:
     - name (Text)
     - twitch (Text)
     - youtube (Text)
   - Relations:
     - challenges (Relation: Many to Many with Challenge)

8. **FAQ** (Collection Type)
   - Fields:
     - question (Text)
     - answer (Rich text (Blocks))
   - Relations:
     - challenges (Relation: Many to Many with Challenge)

## Step 7: First Startup and Admin Setup

### 7.1 Start Development Server
```bash
# Build admin panel and start server
npm run build
npm run develop
```

### 7.2 Access Admin Panel
1. Open browser to `http://localhost:1337/admin`
2. Create your first admin user:
   - Email: your-email@example.com
   - Password: Use a strong password
   - First name: Your name
   - Last name: Your surname

### 7.3 Verify Database Connection
Check that Strapi successfully connected to PostgreSQL:
- Admin panel loads without errors
- Database tables are created automatically
- No connection errors in terminal

## Step 8: Configure Permissions for Anonymous Submissions

### 8.1 Set Public Permissions
1. Go to Settings → Users & Permissions → Roles
2. Select "Public" role
3. Configure permissions for each content-type:

**For Submissions:**
- Create: ✅ (allow anonymous submissions)
- Find: ❌ (submissions are private)
- FindOne: ❌ (submissions are private)
- Update: ❌ (only admins can update)
- Delete: ❌ (only admins can delete)

**For Challenges:**
- Create: ❌
- Find: ❌ (private - requires JWT authentication)
- FindOne: ❌ (private - requires JWT authentication)
- Update: ❌
- Delete: ❌

**For Categories:**
- Create: ❌
- Find: ❌ (private - requires JWT authentication)
- FindOne: ❌ (private - requires JWT authentication)
- Update: ❌
- Delete: ❌

### 8.2 Configure Authenticated User Permissions
1. Select "Authenticated" role
2. Set permissions for frontend JWT access:

**For Submissions:**
- Create: ❌ (public endpoint handles this)
- Find: ✅ (frontend can query approved submissions)
- FindOne: ✅ (frontend can view individual submissions)
- Update: ❌
- Delete: ❌

**For Challenges:**
- Create: ❌
- Find: ✅ (frontend can query challenges)
- FindOne: ✅ (frontend can view individual challenges)
- Update: ❌
- Delete: ❌

**For Categories:**
- Create: ❌
- Find: ✅ (frontend can query categories)
- FindOne: ✅ (frontend can view individual categories)
- Update: ❌
- Delete: ❌

### 8.3 Configure Long-lived JWT Token for Frontend
1. Go to Settings → API Tokens
2. Create a new API Token for frontend:
   - Name: "Frontend Access Token"
   - Description: "Long-lived JWT token for frontend API access"
   - Token duration: Unlimited
   - Token type: Custom
3. Set permissions for the API token to match Authenticated role
4. Copy the generated token and add it to your `.env` file:
   ```env
   FRONTEND_API_TOKEN=strapi_abcd1234your_generated_token_here
   ```
5. **Important**: This token will be used by your frontend application in production

## Step 9: Configure Draft & Publish for Moderation

### 9.1 Enable Draft & Publish for Submissions
1. Go to Content-Type Builder
2. Select or create the Submission content-type
3. Click "Advanced Settings"
4. Enable "Draft & Publish"
5. Save and restart server if prompted

### 9.2 Test Moderation Workflow
1. Create a test submission through the API
2. Verify it appears as "Draft" in admin panel
3. Test the publish/unpublish functionality
4. Ensure public API only returns published submissions

## Step 10: Development Workflow Setup

### 10.1 Create npm Scripts
Update `package.json` scripts section:
```json
{
  "scripts": {
    "build": "strapi build",
    "develop": "strapi develop",
    "start": "strapi start",
    "strapi": "strapi",
    "export": "strapi export",
    "import": "strapi import",
    "transfer": "strapi transfer",
    "deploy": "strapi deploy",
    "generate:types": "strapi ts:generate-types"
  }
}
```

### 10.2 Setup TypeScript Configuration
Ensure `tsconfig.json` includes proper configurations:
```json
{
  "extends": "@strapi/typescript-utils/tsconfigs/server",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "src/**/*",
    "config/**/*",
    "database/**/*",
    "types/**/*"
  ]
}
```

## Step 11: Testing the Setup

### 11.1 Test Database Connection
```bash
# Check if Strapi can connect to database
npm run develop

# Look for successful connection messages in terminal
# Should see: "Database connection has been established successfully"
```

### 11.2 Test Admin Panel
1. Navigate to `http://localhost:1337/admin`
2. Login with your admin credentials
3. Verify all sections are accessible:
   - Content Manager
   - Content-Type Builder
   - Settings
   - Marketplace

### 11.3 Test API Endpoints
```bash
# Test anonymous submission endpoint (should work)
curl -X POST http://localhost:1337/api/submissions \
  -H "Content-Type: application/json" \
  -d '{"data": {"runner_name": "Test Runner", "time": "00:15:30"}}'

# Test public API access to challenges (should be denied)
curl http://localhost:1337/api/challenges
# Should return 403 Forbidden (expected without JWT token)

# Test authenticated API access using your generated token
curl http://localhost:1337/api/challenges \
  -H "Authorization: Bearer strapi_abcd1234your_generated_token_here"
# Should return challenges data when using valid JWT token

# Test admin API (requires authentication)
curl http://localhost:1337/admin/users/me
# Should return 401 Unauthorized (expected without auth token)
```

## Step 12: Security Hardening

### 12.1 Configure Rate Limiting
Create custom middleware for unified rate limiting:
```bash
# Create middleware directory structure (from strapi directory)
mkdir -p src/middlewares

# Rate limiting will apply uniformly to both anonymous submissions 
# and authenticated API calls since there's only one frontend consumer
```

### 12.2 Input Validation Setup
Plan validation rules for:
- URL validation for YouTube/Twitch links
- Time format validation for submissions
- Text content sanitization
- Custom validation in middleware and business logic (not lifecycle hooks)
- External URL validation and metadata extraction

### 12.3 IP Tracking Configuration
Prepare for IP-based submission tracking:
- Configure request IP capture
- Set up submission rate limits per IP
- Plan abuse detection mechanisms

## Next Steps

After completing this initial setup:

1. **Content-Type Development**: Create your content-types using the Content-Type Builder
2. **Custom Middleware**: Implement unified rate limiting and security middleware
3. **API Customization**: Develop custom controllers and services for business logic
4. **Frontend Integration**: Configure frontend to use the long-lived JWT token from environment
5. **Custom Validation**: Implement submission validation in custom middleware
6. **Performance Optimization**: Configure caching and query optimization
7. **Production Deployment**: Set up production environment configurations

## Troubleshooting

### Common Issues

**Database Connection Issues:**
- Verify PostgreSQL container is running: `docker ps`
- Check database credentials in `.env` file
- Ensure Docker network exists: `docker network ls`

**Admin Panel Won't Load:**
- Check if port 1337 is available: `netstat -an | findstr :1337`
- Verify all environment variables are set correctly
- Check terminal for error messages during startup

**Permission Errors:**
- On Windows, ensure you have proper file permissions
- Run terminal as administrator if needed
- Check firewall settings for port 1337

**Build Failures:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify TypeScript configuration

### Getting Help

- **Strapi Documentation**: https://docs.strapi.io/
- **Community Discord**: https://discord.strapi.io/
- **GitHub Issues**: For repository-specific problems
- **Stack Overflow**: Tag questions with 'strapi'

## Security Notes

🔒 **Important Security Reminders:**
- Never commit `.env` files to version control
- Generate new security keys for production environments
- Regularly update dependencies for security patches
- Monitor submission patterns for abuse
- Implement proper backup strategies for your database

This setup provides a solid foundation for the TLD Challenges backend with security, performance, and maintainability in mind.
