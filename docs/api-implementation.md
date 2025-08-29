# API Implementation Plan

This document provides a detailed step-by-step implementation plan for custom API components needed to support the frontend's expected endpoints. The analysis is based on the actual codebase and frontend requirements.

## Current State Analysis

### Existing Implementation
- ✅ All 9 content types are implemented with proper schemas
- ✅ Default Strapi CRUD endpoints are available via ID
- ✅ Default filtering, population, and pagination work via query parameters
- ✅ Basic controllers and routes use Strapi factories (no customization)

### Frontend Requirements vs Current Gaps

| Frontend Endpoint | Current Status | Gap Analysis |
|------------------|----------------|--------------|
| `GET /api/challenges/[slug]` | ❌ No slug-based retrieval | Need custom controller method |
| `GET /api/challenges` | ✅ Available with basic pagination | Need optimized list endpoint |
| `GET /api/tournaments/[slug]` | ❌ No slug-based retrieval | Need custom controller method |
| `GET /api/tournaments` | ✅ Available with basic pagination | Need optimized list endpoint |
| `GET /api/custom-codes/[slug]` | ❌ No slug-based retrieval | Need custom controller method |
| `GET /api/custom-codes` | ✅ Available with basic pagination | Need optimized list endpoint |
| `GET /api/creators/[slug]` | ❌ No slug-based retrieval | Need custom controller method |
| `GET /api/faqs` | ✅ Available with basic pagination | Need optimized list endpoint |
| `POST /api/submissions` | ✅ Available (anonymous) | Need rate limiting enhancement |
| `POST /api/ideas` | ✅ Available (anonymous) | Need rate limiting enhancement |

## Implementation Strategy

### Phase 1: Custom Controllers for Slug-Based Retrieval
**Priority**: High
**Estimated Time**: 4-6 hours

The frontend expects slug-based retrieval instead of ID-based. This requires custom controller methods that:
1. Accept slug as a parameter
2. Filter by slug field
3. Fully populate related data
4. Return proper error responses for not found

### Phase 2: Optimized List Endpoints
**Priority**: Medium
**Estimated Time**: 2-3 hours

List endpoints need optimization for frontend consumption:
1. Default pagination parameters
2. Optimized field selection for list views
3. Consistent response format

### Phase 3: Enhanced Security for Anonymous Posts
**Priority**: High
**Estimated Time**: 3-4 hours

Anonymous submission endpoints need enhanced protection:
1. Rate limiting per IP
2. Input validation
3. Spam detection
4. Abuse prevention

## Detailed Implementation Steps

### Step 1: Challenge Slug Endpoint

#### 1.1 Create Custom Challenge Controller
**File**: `strapi/src/api/challenge/controllers/challenge.ts`

```typescript
/**
 * challenge controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::challenge.challenge', ({ strapi }) => ({
  // Keep default methods
  ...factories.createCoreController('api::challenge.challenge'),

  // Custom slug-based retrieval
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findMany('api::challenge.challenge', {
        filters: { slug: slug },
        populate: {
          submissions: {
            populate: ['challenge'],
            publicationState: 'live',
          },
          custom_code: {
            populate: ['creators', 'thumbnail'],
          },
          rules: true,
          tournament: {
            populate: ['thumbnail'],
          },
          creators: {
            populate: ['creator_socials'],
          },
          faqs: true,
          thumbnail: true,
        },
        publicationState: 'live',
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound('Challenge not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to fetch challenge', { details: err });
    }
  },

  // Optimized list endpoint
  async find(ctx) {
    // Default pagination and field optimization
    const defaultQuery = {
      pagination: {
        page: ctx.query.pagination?.page || 1,
        pageSize: ctx.query.pagination?.pageSize || 25,
      },
      populate: {
        thumbnail: true,
        custom_code: {
          fields: ['name', 'slug'],
        },
        tournament: {
          fields: ['name', 'slug'],
        },
        creators: {
          fields: ['name', 'slug'],
        },
      },
      publicationState: 'live',
      sort: ctx.query.sort || 'createdAt:desc',
    };

    // Merge with user query
    const query = { ...defaultQuery, ...ctx.query };
    
    const { results, pagination } = await strapi.entityService.findPage('api::challenge.challenge', query);
    
    const sanitizedResults = await this.sanitizeOutput(results, ctx);
    
    return this.transformResponse(sanitizedResults, { pagination });
  },
}));
```

#### 1.2 Create Custom Challenge Route
**File**: `strapi/src/api/challenge/routes/challenge.ts`

```typescript
/**
 * challenge router
 */

import { factories } from '@strapi/strapi';

export default {
  routes: [
    // Keep default routes
    ...factories.createCoreRouter('api::challenge.challenge').routes,
    
    // Custom slug route
    {
      method: 'GET',
      path: '/challenges/:slug',
      handler: 'challenge.findBySlug',
      config: {
        auth: false, // Public endpoint
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

### Step 2: Tournament Slug Endpoint

#### 2.1 Create Custom Tournament Controller
**File**: `strapi/src/api/tournament/controllers/tournament.ts`

```typescript
/**
 * tournament controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::tournament.tournament', ({ strapi }) => ({
  // Keep default methods
  ...factories.createCoreController('api::tournament.tournament'),

  // Custom slug-based retrieval
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findMany('api::tournament.tournament', {
        filters: { slug: slug },
        populate: {
          challenges: {
            populate: ['custom_code', 'creators', 'submissions', 'thumbnail'],
            publicationState: 'live',
          },
          creators: {
            populate: ['creator_socials'],
          },
          faqs: true,
          thumbnail: true,
        },
        publicationState: 'live',
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound('Tournament not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to fetch tournament', { details: err });
    }
  },

  // Optimized list endpoint
  async find(ctx) {
    const defaultQuery = {
      pagination: {
        page: ctx.query.pagination?.page || 1,
        pageSize: ctx.query.pagination?.pageSize || 25,
      },
      populate: {
        thumbnail: true,
        challenges: {
          fields: ['name', 'slug', 'difficulty'],
          populate: {
            thumbnail: true,
          },
        },
        creators: {
          fields: ['name', 'slug'],
        },
      },
      publicationState: 'live',
      sort: ctx.query.sort || 'start_date:desc',
    };

    const query = { ...defaultQuery, ...ctx.query };
    
    const { results, pagination } = await strapi.entityService.findPage('api::tournament.tournament', query);
    
    const sanitizedResults = await this.sanitizeOutput(results, ctx);
    
    return this.transformResponse(sanitizedResults, { pagination });
  },
}));
```

#### 2.2 Create Custom Tournament Route
**File**: `strapi/src/api/tournament/routes/tournament.ts`

```typescript
/**
 * tournament router
 */

import { factories } from '@strapi/strapi';

export default {
  routes: [
    // Keep default routes
    ...factories.createCoreRouter('api::tournament.tournament').routes,
    
    // Custom slug route
    {
      method: 'GET',
      path: '/tournaments/:slug',
      handler: 'tournament.findBySlug',
      config: {
        auth: false, // Public endpoint
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

### Step 3: CustomCode Slug Endpoint

#### 3.1 Create Custom CustomCode Controller
**File**: `strapi/src/api/custom-code/controllers/custom-code.ts`

```typescript
/**
 * custom-code controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::custom-code.custom-code', ({ strapi }) => ({
  // Keep default methods
  ...factories.createCoreController('api::custom-code.custom-code'),

  // Custom slug-based retrieval
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findMany('api::custom-code.custom-code', {
        filters: { slug: slug },
        populate: {
          challenges: {
            populate: ['tournament', 'creators', 'submissions', 'thumbnail'],
            publicationState: 'live',
          },
          creators: {
            populate: ['creator_socials'],
          },
          faqs: true,
          thumbnail: true,
        },
        publicationState: 'live',
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound('Custom code not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to fetch custom code', { details: err });
    }
  },

  // Optimized list endpoint
  async find(ctx) {
    const defaultQuery = {
      pagination: {
        page: ctx.query.pagination?.page || 1,
        pageSize: ctx.query.pagination?.pageSize || 25,
      },
      populate: {
        thumbnail: true,
        challenges: {
          fields: ['name', 'slug', 'difficulty'],
          populate: {
            thumbnail: true,
          },
        },
        creators: {
          fields: ['name', 'slug'],
        },
      },
      publicationState: 'live',
      sort: ctx.query.sort || 'createdAt:desc',
    };

    const query = { ...defaultQuery, ...ctx.query };
    
    const { results, pagination } = await strapi.entityService.findPage('api::custom-code.custom-code', query);
    
    const sanitizedResults = await this.sanitizeOutput(results, ctx);
    
    return this.transformResponse(sanitizedResults, { pagination });
  },
}));
```

#### 3.2 Create Custom CustomCode Route
**File**: `strapi/src/api/custom-code/routes/custom-code.ts`

```typescript
/**
 * custom-code router
 */

import { factories } from '@strapi/strapi';

export default {
  routes: [
    // Keep default routes
    ...factories.createCoreRouter('api::custom-code.custom-code').routes,
    
    // Custom slug route
    {
      method: 'GET',
      path: '/custom-codes/:slug',
      handler: 'custom-code.findBySlug',
      config: {
        auth: false, // Public endpoint
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

### Step 4: Creator Slug Endpoint

#### 4.1 Create Custom Creator Controller
**File**: `strapi/src/api/creator/controllers/creator.ts`

```typescript
/**
 * creator controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::creator.creator', ({ strapi }) => ({
  // Keep default methods
  ...factories.createCoreController('api::creator.creator'),

  // Custom slug-based retrieval
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findMany('api::creator.creator', {
        filters: { slug: slug },
        populate: {
          challenges: {
            populate: ['custom_code', 'tournament', 'thumbnail'],
            publicationState: 'live',
          },
          tournaments: {
            populate: ['thumbnail'],
            publicationState: 'live',
          },
          custom_codes: {
            populate: ['challenges', 'thumbnail'],
            publicationState: 'live',
          },
          creator_socials: true,
        },
        publicationState: 'live',
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound('Creator not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to fetch creator', { details: err });
    }
  },
}));
```

#### 4.2 Create Custom Creator Route
**File**: `strapi/src/api/creator/routes/creator.ts`

```typescript
/**
 * creator router
 */

import { factories } from '@strapi/strapi';

export default {
  routes: [
    // Keep default routes
    ...factories.createCoreRouter('api::creator.creator').routes,
    
    // Custom slug route
    {
      method: 'GET',
      path: '/creators/:slug',
      handler: 'creator.findBySlug',
      config: {
        auth: false, // Public endpoint
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

### Step 5: Optimized FAQ List Endpoint

#### 5.1 Create Custom FAQ Controller
**File**: `strapi/src/api/faq/controllers/faq.ts`

```typescript
/**
 * faq controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::faq.faq', ({ strapi }) => ({
  // Optimized list endpoint
  async find(ctx) {
    const defaultQuery = {
      pagination: {
        page: ctx.query.pagination?.page || 1,
        pageSize: ctx.query.pagination?.pageSize || 50, // FAQs can have higher limit
      },
      populate: {
        challenges: {
          fields: ['name', 'slug'],
        },
        custom_codes: {
          fields: ['name', 'slug'],
        },
        tournaments: {
          fields: ['name', 'slug'],
        },
      },
      publicationState: 'live',
      sort: ctx.query.sort || 'createdAt:desc',
    };

    const query = { ...defaultQuery, ...ctx.query };
    
    const { results, pagination } = await strapi.entityService.findPage('api::faq.faq', query);
    
    const sanitizedResults = await this.sanitizeOutput(results, ctx);
    
    return this.transformResponse(sanitizedResults, { pagination });
  },
}));
```

### Step 6: Enhanced Security for Anonymous Endpoints

#### 6.1 Create Rate Limiting Middleware
**File**: `strapi/src/middlewares/rate-limit.ts`

```typescript
/**
 * Rate limiting middleware for anonymous submissions
 */

import rateLimit from 'koa2-ratelimit';

const rateLimitStore = new Map();

export default () => {
  return async (ctx, next) => {
    // Apply rate limiting only to POST endpoints
    if (ctx.request.method === 'POST') {
      const endpoint = ctx.request.path;
      const ip = ctx.request.ip;
      
      let limiter;
      
      if (endpoint.includes('/submissions')) {
        // 5 submissions per hour per IP
        limiter = rateLimit({
          interval: { hour: 1 },
          max: 5,
          prefixKey: `submission:${ip}`,
          store: rateLimitStore,
          message: {
            error: 'Rate limit exceeded',
            message: 'Too many submissions. Please try again later.',
            retryAfter: 3600, // 1 hour
          },
        });
      } else if (endpoint.includes('/ideas')) {
        // 10 ideas per hour per IP
        limiter = rateLimit({
          interval: { hour: 1 },
          max: 10,
          prefixKey: `idea:${ip}`,
          store: rateLimitStore,
          message: {
            error: 'Rate limit exceeded',
            message: 'Too many ideas submitted. Please try again later.',
            retryAfter: 3600, // 1 hour
          },
        });
      }
      
      if (limiter) {
        await limiter(ctx, next);
      } else {
        await next();
      }
    } else {
      await next();
    }
  };
};
```

#### 6.2 Enhanced Submission Controller
**File**: `strapi/src/api/submission/controllers/submission.ts`

```typescript
/**
 * submission controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::submission.submission', ({ strapi }) => ({
  // Enhanced create method with validation
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Input validation
    if (!data.runner || !data.challenge) {
      return ctx.badRequest('Runner name and challenge are required');
    }
    
    // Validate URLs if provided
    if (data.runner_url && !isValidUrl(data.runner_url)) {
      return ctx.badRequest('Invalid runner URL format');
    }
    
    if (data.video_url && !isValidUrl(data.video_url)) {
      return ctx.badRequest('Invalid video URL format');
    }
    
    // Check if challenge exists and is published
    const challenge = await strapi.entityService.findOne('api::challenge.challenge', data.challenge, {
      publicationState: 'live',
    });
    
    if (!challenge) {
      return ctx.badRequest('Challenge not found or not published');
    }
    
    // Set submission as draft (requires admin approval)
    const submissionData = {
      ...data,
      publishedAt: null, // Start as draft
    };
    
    try {
      const entity = await strapi.entityService.create('api::submission.submission', {
        data: submissionData,
      });
      
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to create submission', { details: err });
    }
  },
}));

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
```

#### 6.3 Enhanced Idea Controller
**File**: `strapi/src/api/idea/controllers/idea.ts`

```typescript
/**
 * idea controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::idea.idea', ({ strapi }) => ({
  // Enhanced create method with validation
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Input validation
    if (!data.type || !data.description) {
      return ctx.badRequest('Type and description are required');
    }
    
    // Validate type enum
    const validTypes = ['CustomCode', 'Challenge', 'Tournament'];
    if (!validTypes.includes(data.type)) {
      return ctx.badRequest('Invalid idea type');
    }
    
    // Set idea as draft (requires admin approval)
    const ideaData = {
      ...data,
      publishedAt: null, // Start as draft
    };
    
    try {
      const entity = await strapi.entityService.create('api::idea.idea', {
        data: ideaData,
      });
      
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to create idea', { details: err });
    }
  },
}));
```

### Step 7: Configure Middleware
**File**: `strapi/config/middlewares.ts`

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
  // Add custom rate limiting middleware
  {
    name: 'global::rate-limit',
    config: {},
  },
];
```

## Testing Strategy

### 1. Manual Testing Checklist

**Slug Endpoints:**
- [ ] `GET /api/challenges/test-challenge` returns fully populated challenge
- [ ] `GET /api/tournaments/test-tournament` returns fully populated tournament  
- [ ] `GET /api/custom-codes/test-code` returns fully populated custom code
- [ ] `GET /api/creators/test-creator` returns fully populated creator
- [ ] All endpoints return 404 for non-existent slugs

**List Endpoints:**
- [ ] All list endpoints respect pagination parameters
- [ ] Default pagination works without parameters
- [ ] Sorting works as expected
- [ ] Only published content is returned

**Anonymous Submissions:**
- [ ] Rate limiting works for submissions (5 per hour)
- [ ] Rate limiting works for ideas (10 per hour)
- [ ] Input validation rejects invalid data
- [ ] Submissions are created as drafts

### 2. Integration Testing

**Frontend Integration:**
- [ ] All expected endpoints return data in expected format
- [ ] Pagination works with frontend components
- [ ] Error responses are handled gracefully
- [ ] Performance is acceptable for populated responses

### 3. Security Testing

**Rate Limiting:**
- [ ] Multiple submissions from same IP are blocked after limit
- [ ] Rate limiting resets after time window
- [ ] Error messages are informative but not revealing

**Input Validation:**
- [ ] SQL injection attempts are blocked
- [ ] XSS attempts are sanitized
- [ ] Malformed URLs are rejected

## Performance Considerations

### 1. Database Query Optimization
- Use selective population to avoid n+1 queries
- Implement database indexes on slug fields
- Consider caching for frequently accessed content

### 2. Response Time Targets
- List endpoints: < 200ms
- Single entity endpoints: < 300ms (due to full population)
- Anonymous submissions: < 500ms

### 3. Monitoring
- Log response times for all custom endpoints
- Monitor rate limiting effectiveness
- Track error rates and types

## Deployment Checklist

### Before Deployment:
- [ ] All custom controllers are implemented
- [ ] All custom routes are configured
- [ ] Rate limiting middleware is registered
- [ ] Input validation is comprehensive
- [ ] Error handling is consistent
- [ ] Tests are passing

### After Deployment:
- [ ] Monitor API response times
- [ ] Verify rate limiting is working
- [ ] Check error logs for issues
- [ ] Test frontend integration
- [ ] Verify all expected endpoints are accessible

## Future Enhancements

### 1. Caching Layer
- Implement Redis caching for slug-based lookups
- Cache popular content with TTL
- Invalidate cache on content updates

### 2. Enhanced Analytics
- Track endpoint usage patterns
- Monitor popular content
- Analyze submission trends

### 3. Advanced Security
- Implement CAPTCHA for anonymous submissions
- Add IP-based geographical restrictions if needed
- Enhanced spam detection algorithms

This implementation plan provides a comprehensive roadmap to support all frontend requirements while maintaining security, performance, and maintainability standards.
