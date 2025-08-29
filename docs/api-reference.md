# TLD Challenges Backend API Reference

This document provides comprehensive documentation for all available API endpoints in the TLD Challenges Strapi backend.

## Base Configuration

**Base URL**: `http://localhost:1337/api` (development) | `https://your-domain.com/api` (production)
**Authentication**: Bearer token required for all endpoints
**Content-Type**: `application/json`
**API Version**: Strapi v5+

## Authentication

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

**Note**: All endpoints require authentication. There are no public endpoints in the current implementation.

## Content-Type Endpoints

### Challenge API

**Collection Endpoints**
```http
GET    /api/challenges                          # List all challenges (auth required)
GET    /api/challenges?populate=*               # List with all relations (auth required)
GET    /api/challenges/{id}                     # Get single challenge by ID (auth required)
GET    /api/challenges/{id}?populate=*          # Get single with relations (auth required)
GET    /api/challenges/slug/{slug}              # Get challenge by slug (auth required)
```

**Advanced Filtering (Standard Endpoints)**
```http
# Filter by difficulty (using standard endpoint)
GET /api/challenges?filters[difficulty][$eq]=Hard

# Filter by slug (using standard endpoint)  
GET /api/challenges?filters[slug][$eq]=bear-hunt-expert

# Filter by featured status (using standard endpoint)
GET /api/challenges?filters[is_featured][$eq]=true

# Filter by publication state (using standard endpoint)
GET /api/challenges?filters[publishedAt][$notNull]=true

# Complex population (using standard endpoint)
GET /api/challenges?populate[submissions]=*&populate[custom_code][populate]=creators&populate[tournament]=*&populate[creators]=*&populate[rules]=*&populate[faqs]=*&populate[thumbnail]=*
```

**Custom Slug Endpoints (Fixed Population)**
```http
# Get challenge by slug (returns with predefined relations)
GET /api/challenges/slug/bear-hunt-expert

# Note: Custom slug endpoints have fixed population and do not accept query parameters
# They automatically populate: thumbnail, submissions, custom_code, rules, tournament, creators, faqs
```

**Available Fields**: name, slug, thumbnail, description_short, description_long, difficulty, is_featured
**Relations**: submissions, custom_code, rules, tournament, creators, faqs

### Submission API

**Collection Endpoints**
```http
GET    /api/submissions                         # List submissions (auth required)
GET    /api/submissions?populate=*              # List with relations (auth required)
GET    /api/submissions/{id}                    # Get single submission (auth required)
POST   /api/submissions                         # Create submission (auth required)
```

**Submission Creation**
```http
POST /api/submissions
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "data": {
    "runner": "PlayerName",
    "runner_url": "https://twitch.tv/playername",
    "video_url": "https://youtube.com/watch?v=xyz",
    "note": "Great run with optimal routing",
    "result": "2 days, 14 hours",
    "challenge": 1,
    "publishedAt": null
  }
}
```

**Filtering & Population**
```http
# Filter by challenge
GET /api/submissions?filters[challenge][id][$eq]=1

# Populate challenge details
GET /api/submissions?populate[challenge][populate]=custom_code,creators,tournament
```

**Available Fields**: runner, runner_url, video_url, note, result
**Relations**: challenge

### Tournament API

**Collection Endpoints**
```http
GET    /api/tournaments                         # List tournaments (auth required)
GET    /api/tournaments?populate=*              # List with relations (auth required)
GET    /api/tournaments/{id}                    # Get single tournament (auth required)
GET    /api/tournaments/slug/{slug}             # Get tournament by slug (auth required)
```

**Advanced Queries (Standard Endpoints)**
```http
# Filter by state (using standard endpoint)
GET /api/tournaments?filters[state][$eq]=active

# Filter by featured status (using standard endpoint)
GET /api/tournaments?filters[is_featured][$eq]=true

# Filter by date range (using standard endpoint)
GET /api/tournaments?filters[start_date][$gte]=2024-01-01&filters[end_date][$lte]=2024-12-31

# Populate all related content (using standard endpoint)
GET /api/tournaments?populate[challenges][populate]=submissions,custom_code&populate[creators]=*&populate[faqs]=*&populate[thumbnail]=*
```

**Custom Slug Endpoints (Fixed Population)**
```http
# Get tournament by slug (returns with predefined relations)
GET /api/tournaments/slug/tournament-name

# Note: Custom slug endpoints have fixed population and do not accept query parameters
# They automatically populate: thumbnail, challenges, creators, faqs
```

**Available Fields**: name, slug, thumbnail, description_short, description_long, start_date, end_date, state, is_featured
**Relations**: challenges, creators, faqs

### CustomCode API

**Collection Endpoints**
```http
GET    /api/custom-codes                        # List custom codes (auth required)
GET    /api/custom-codes?populate=*             # List with relations (auth required)
GET    /api/custom-codes/{id}                   # Get single custom code (auth required)
GET    /api/custom-codes/slug/{slug}            # Get custom code by slug (auth required)
```

**Practical Queries (Standard Endpoints)**
```http
# Filter by featured status (using standard endpoint)
GET /api/custom-codes?filters[is_featured][$eq]=true

# Populate associated challenges and creators (using standard endpoint)
GET /api/custom-codes?populate[challenges][populate]=tournament,submissions&populate[creators]=*&populate[faqs]=*&populate[thumbnail]=*

# Search by name (using standard endpoint)
GET /api/custom-codes?filters[name][$contains]=weather
```

**Custom Slug Endpoints (Fixed Population)**
```http
# Get custom code by slug (returns with predefined relations)
GET /api/custom-codes/slug/extreme-weather-settings

# Note: Custom slug endpoints have fixed population and do not accept query parameters
# They automatically populate: thumbnail, challenges, creators, faqs
```

**Available Fields**: name, slug, thumbnail, description_short, description_long, code, is_featured
**Relations**: challenges, creators, faqs

### Rule API

**Collection Endpoints**
```http
GET    /api/rules                               # List rules (auth required)
GET    /api/rules?populate=*                    # List with challenge relations (auth required)
GET    /api/rules/{id}                          # Get single rule (auth required)
```

**Available Fields**: description
**Relations**: challenges

### Creator API

**Collection Endpoints**
```http
GET    /api/creators                            # List creators (auth required)
GET    /api/creators?populate=*                 # List with all content relations (auth required)
GET    /api/creators/{id}                       # Get single creator (auth required)
GET    /api/creators/slug/{slug}                # Get creator by slug (auth required)
```

**Creator Profile Queries (Standard Endpoints)**
```http
# Filter by slug (using standard endpoint)
GET /api/creators?filters[slug][$eq]=creator-username

# Get creator with all their content (using standard endpoint)
GET /api/creators?filters[slug][$eq]=creator-username&populate[challenges][populate]=custom_code,tournament&populate[tournaments][populate]=challenges&populate[custom_codes][populate]=challenges

# List creators with content counts (using standard endpoint)
GET /api/creators?populate[challenges][fields][0]=id&populate[tournaments][fields][0]=id&populate[custom_codes][fields][0]=id
```

**Custom Slug Endpoints (Fixed Population)**
```http
# Get creator by slug (returns with predefined relations)
GET /api/creators/slug/creator-username

# Note: Custom slug endpoints have fixed population and do not accept query parameters
# They automatically populate: challenges, tournaments, custom_codes
```

**Available Fields**: name, slug, description_short, description_long, twitch, youtube
**Relations**: challenges, tournaments, custom_codes, creator_socials

### FAQ API

**Collection Endpoints**
```http
GET    /api/faqs                                # List FAQs (auth required)
GET    /api/faqs?populate=*                     # List with content relations (auth required)
GET    /api/faqs/{id}                           # Get single FAQ (auth required)
```

**Content-Specific FAQs**
```http
# FAQs for specific challenge
GET /api/faqs?filters[challenges][id][$eq]=1

# FAQs for custom code
GET /api/faqs?filters[custom_codes][id][$eq]=1

# FAQs for tournament
GET /api/faqs?filters[tournaments][id][$eq]=1
```

**Available Fields**: question, answer
**Relations**: challenges, custom_codes, tournaments

### Idea API

**Collection Endpoints**
```http
GET    /api/ideas                               # List ideas (auth required)
GET    /api/ideas?populate=*                    # List with creator social relations (auth required)
GET    /api/ideas/{id}                          # Get single idea (auth required)
POST   /api/ideas                               # Create idea (auth required)
```

**Idea Creation with Social Links**
```http
POST /api/ideas
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "data": {
    "type": "Challenge",
    "description": "New challenge idea description",
    "creator": "Player Name",
    "social_links": [
      "https://twitch.tv/playername",
      "https://youtube.com/channel/xyz"
    ],
    "publishedAt": null
  }
}
```

**Note**: The `social_links` array automatically creates `Creator-Social` entries. Ideas start as drafts requiring admin approval.

**Filtering & Population**
```http
# Filter by type
GET /api/ideas?filters[type][$eq]=CustomCode

# Populate creator
GET /api/ideas?populate[creator]=*
```

**Available Fields**: type, description, creator
**Relations**: creator

### Creator-Social API

**Collection Endpoints**
```http
GET    /api/creator-socials                     # List creator socials (auth required)
GET    /api/creator-socials?populate=*          # List with creator relations (auth required)
GET    /api/creator-socials/{id}                # Get single creator social (auth required)
```

**Available Fields**: url
**Relations**: creator

### Stats API

**Overview Statistics Endpoint**
```http
GET    /api/stats/overview                      # Get content statistics (auth required)
```

**Response Format**
```json
{
  "data": {
    "challenges": 1,
    "customCodes": 3,
    "tournaments": 0
  },
  "meta": {}
}
```

**Features**:
- Returns count of published content only
- Useful for dashboard statistics
- Requires authentication
- Excludes draft content from counts

## Query Parameters

### Pagination
```http
GET /api/challenges?pagination[page]=1&pagination[pageSize]=25
GET /api/challenges?pagination[start]=0&pagination[limit]=25
```

### Sorting
```http
GET /api/challenges?sort=created_date:desc
GET /api/submissions?sort[0]=submitted_date:desc&sort[1]=runner:asc
```

### Field Selection
```http
GET /api/challenges?fields[0]=name&fields[1]=slug&fields[2]=difficulty
```

### Publication State
```http
GET /api/challenges?publicationState=live        # Published only (default)
GET /api/challenges?publicationState=preview     # Published + drafts (admin)
```

## Response Formats

### Single Entity Response
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "Bear Hunt Expert",
      "difficulty": "Interloper",
      "slug": "bear-hunt-expert",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "publishedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "meta": {}
}
```

### Collection Response
```json
{
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 4,
      "total": 87
    }
  }
}
```

### Error Response
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Missing required field: runner",
    "details": {}
  }
}
```

## Common Query Patterns

### Homepage Data
```http
# Recent challenges with minimal data
GET /api/challenges?sort=created_date:desc&pagination[limit]=6&fields[0]=name&fields[1]=slug&fields[2]=difficulty

# Active tournaments
GET /api/tournaments?filters[state][$eq]=active&populate[challenges][fields][0]=name
```

### Challenge Detail Page
```http
# Using custom slug endpoint (fixed population)
GET /api/challenges/slug/{slug}

# OR using standard endpoint with custom population
GET /api/challenges?filters[slug][$eq]={slug}&populate[submissions]=*&populate[custom_code][populate]=creators&populate[tournament]=*&populate[creators]=*&populate[rules]=*&populate[faqs]=*
```

### Submission Leaderboard
```http
GET /api/submissions?filters[challenge][id][$eq]={challengeId}&filters[publishedAt][$notNull]=true&sort=createdAt:asc&populate[challenge][fields][0]=name
```

### Creator Profile
```http
GET /api/creators/slug/{slug}?populate[challenges][populate][custom_code][fields][0]=name&populate[tournaments][fields][0]=name&populate[custom_codes][populate][challenges][fields][0]=name
```

### Tournament Detail with Challenges
```http
# Using custom slug endpoint (fixed population)
GET /api/tournaments/slug/{slug}

# OR using standard endpoint with custom population
GET /api/tournaments?filters[slug][$eq]={slug}&populate[challenges][populate]=custom_code,creators,submissions&populate[creators]=*&populate[faqs]=*
```

### Custom Code Detail with Usage
```http
# Using custom slug endpoint (fixed population) 
GET /api/custom-codes/slug/{slug}

# OR using standard endpoint with custom population
GET /api/custom-codes?filters[slug][$eq]={slug}&populate[challenges][populate]=tournament,creators,submissions&populate[creators]=*&populate[faqs]=*
```

## Rate Limiting

All endpoints are subject to rate limiting:
- **Authenticated requests**: Standard Strapi rate limits per token
- **Rate limiting middleware**: Applied to submission and idea creation endpoints

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Content-Type Field Specifications

### Challenge Fields
```typescript
{
  name: string;              // required
  slug: string;             // uid, auto-generated from name
  thumbnail: media;         // images/files
  description_short: text;   // brief description
  description_long: blocks;  // rich text content
  difficulty: enum;         // "Easy" | "Medium" | "Hard" | "Very Hard"
  is_featured: boolean;     // default: false
}
```

### Submission Fields
```typescript
{
  runner: string;           // required
  runner_url: string;       // optional
  video_url: string;        // optional
  note: text;              // optional
  result: text;            // optional
}
```

### Tournament Fields
```typescript
{
  name: string;             // required
  slug: string;            // uid, auto-generated from name
  thumbnail: media;        // images/files
  description_short: text;  // brief description
  description_long: blocks; // rich text content
  start_date: datetime;    // required
  end_date: datetime;      // required
  state: enum;            // "planned" | "active" | "completed" | "cancelled"
  is_featured: boolean;   // default: false
}
```

### CustomCode Fields
```typescript
{
  name: string;             // required, unique
  slug: string;            // uid, auto-generated from name
  thumbnail: media;        // images/files
  description_short: text;  // brief description
  description_long: blocks; // rich text content
  code: string;            // required
  is_featured: boolean;    // default: false
}
```

### Creator Fields
```typescript
{
  name: string;             // required, unique
  slug: string;            // uid, auto-generated from name
  description_short: text;  // brief description
  description_long: blocks; // rich text content
  twitch: string;          // optional
  youtube: string;         // optional
}
```

### Rule Fields
```typescript
{
  description: blocks;      // required, rich text content
}
```

### FAQ Fields
```typescript
{
  question: text;           // required
  answer: blocks;          // required, rich text content
}
```

### Idea Fields
```typescript
{
  type: enum;              // "CustomCode" | "Challenge" | "Tournament"
  description: blocks;     // rich text content
  creator: string;         // creator name
}
```

### Creator-Social Fields
```typescript
{
  url: text;               // social media URL
}
```

## Implementation Notes

### Custom Controllers Implemented
This API includes several custom controllers beyond the auto-generated Strapi endpoints:

1. **Slug-based lookups**: 
   - `GET /api/challenges/slug/{slug}` - Challenge retrieval by slug
   - `GET /api/tournaments/slug/{slug}` - Tournament retrieval by slug  
   - `GET /api/custom-codes/slug/{slug}` - Custom code retrieval by slug
   - `GET /api/creators/slug/{slug}` - Creator retrieval by slug

2. **Enhanced idea submission**: 
   - `POST /api/ideas` - Supports automatic social links creation via `social_links` array

3. **Enhanced submission validation**: 
   - `POST /api/submissions` - Input validation and URL verification

4. **Statistics endpoint**: 
   - `GET /api/stats/overview` - Dashboard statistics for published content

### Additional Custom Endpoints Needed
For full production use, consider implementing:

1. **Search functionality**: `GET /api/search?q=term&type=challenges`
2. **Leaderboards**: `GET /api/leaderboards/{challengeSlug}`
3. **Advanced filtering**: `GET /api/challenges/by-difficulty/{difficulty}`

### Performance Considerations
- Deep population queries can be slow with complex relations
- Consider implementing custom endpoints for frequently accessed data combinations
- Use field selection to minimize response payload size
- Implement caching for static content like challenge listings

### Security Notes
- All endpoints require proper JWT authentication
- All endpoints require authentication - no public endpoints available
- Sensitive fields are not exposed in responses
- Draft content is only accessible to authenticated users
- Slug-based endpoints require authentication for content access

### Relation Complexity
The current Many-to-Many relationship structure requires verbose population syntax. Consider these patterns for complex queries:

```http
# Full challenge detail (complex but complete)
GET /api/challenges?filters[slug][$eq]=challenge-slug&populate[submissions][filters][state][$eq]=approved&populate[submissions][sort][0]=submitted_date:asc&populate[custom_code][populate][creators]=*&populate[tournament][populate][creators]=*&populate[creators]=*&populate[rules]=*&populate[faqs]=*

# Creator with all content types
GET /api/creators?filters[slug][$eq]=creator-slug&populate[challenges][populate][tournament,custom_code]&populate[tournaments][populate][challenges]&populate[custom_codes][populate][challenges]
```

### Frontend Development Recommendations
1. Create wrapper functions for common query patterns
2. Implement client-side caching for frequently accessed data
3. Use TypeScript interfaces based on the field specifications above
4. Consider implementing custom hooks for React applications
5. Plan for pagination on all listing endpoints
