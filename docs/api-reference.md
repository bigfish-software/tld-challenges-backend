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
```

**Detail Endpoints**
```http
GET    /api/challenges/slug/{slug}              # Get challenge by slug with full details (auth required)
```

**Filtering & Search (Collection Only)**
```http
# Filter by difficulty
GET /api/challenges?filters[difficulty][$eq]=Hard

# Filter by featured status
GET /api/challenges?filters[is_featured][$eq]=true

# Filter by publication state
GET /api/challenges?filters[publishedAt][$notNull]=true
```

**Available Fields**: name, slug, thumbnail, description_short, description_long, difficulty, is_featured
**Relations**: submissions, custom_code, rules, tournament, creators, faqs

**Sample Responses**

*GET /api/challenges - Basic listing*
```json
{
  "data": [
    {
      "id": 5,
      "documentId": "q3wojw3tqwry29632wwc5sew",
      "name": "Furry, then silence - Stalker",
      "slug": "furry-then-silence-stalker",
      "createdAt": "2025-08-30T07:49:58.584Z",
      "updatedAt": "2025-08-30T07:50:05.847Z",
      "publishedAt": "2025-08-30T07:50:05.939Z",
      "description_long": null,
      "description_short": null,
      "difficulty": "Medium",
      "is_featured": false
    },
    {
      "id": 7,
      "documentId": "m0p912e67zzz1e1huxobh5l0",
      "name": "Furry, then silence - Interloper",
      "slug": "furry-then-silence-interloper",
      "createdAt": "2025-08-30T07:50:47.399Z",
      "updatedAt": "2025-08-30T07:50:57.434Z",
      "publishedAt": "2025-08-30T07:50:57.496Z",
      "description_long": null,
      "description_short": null,
      "difficulty": "Hard",
      "is_featured": false
    },
    {
      "id": 9,
      "documentId": "hdhu6v03qrphyn9f0ya47pig",
      "name": "Furry, then silence - NOGOA lite",
      "slug": "furry-then-silence-nogoa-lite",
      "createdAt": "2025-08-30T07:51:58.245Z",
      "updatedAt": "2025-08-30T07:52:01.633Z",
      "publishedAt": "2025-08-30T07:52:01.690Z",
      "description_long": null,
      "description_short": null,
      "difficulty": "Very Hard",
      "is_featured": false
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 3
    }
  }
}
```

*GET /api/challenges/slug/{slug} - Challenge detail with full relations*
```json
{
  "data": {
    "id": 4,
    "documentId": "q3wojw3tqwry29632wwc5sew",
    "name": "Furry, then silence - Stalker",
    "slug": "furry-then-silence-stalker",
    "createdAt": "2025-08-30T07:49:58.584Z",
    "updatedAt": "2025-08-30T07:50:05.847Z",
    "publishedAt": "2025-08-30T07:50:05.939Z",
    "description_long": null,
    "description_short": null,
    "difficulty": "Medium",
    "is_featured": false,
    "thumbnail": null,
    "submissions": [],
    "custom_code": null,
    "rules": [
      {
        "id": 1,
        "documentId": "v5f2jnbllenc0201x9kxdcf4",
        "description": [
          {
            "type": "paragraph",
            "children": [
              {
                "text": "Make it to 50 days survived on the stats page.",
                "type": "text"
              }
            ]
          }
        ],
        "createdAt": "2025-08-30T07:55:30.757Z",
        "updatedAt": "2025-08-30T08:06:08.309Z",
        "publishedAt": "2025-08-30T08:06:08.335Z",
        "name": "50 days survived"
      }
    ],
    "tournament": {
      "id": 1,
      "documentId": "da8eflxr52n3lcbvfcagse8c",
      "name": "Furry, then silence",
      "slug": "furry-then-silence",
      "start_date": "2025-09-13T22:00:00.000Z",
      "end_date": "2025-12-30T23:00:00.000Z",
      "state": "planned",
      "createdAt": "2025-08-30T07:40:16.170Z",
      "updatedAt": "2025-08-30T07:45:05.363Z",
      "publishedAt": "2025-08-30T07:45:05.416Z",
      "description_short": "Part 2 of the famous hunting tourney \"Fury, then silence\".",
      "description_long": null,
      "is_featured": true
    },
    "creators": [
      {
        "id": 4,
        "documentId": "s5dpeov1p516lnlwgw3soda9",
        "name": "ChefMaria",
        "twitch": "https://www.twitch.tv/chefmaria",
        "youtube": "https://www.youtube.com/@chefmaria7464",
        "slug": "chef-maria"
      }
    ],
    "faqs": [
      {
        "id": 1,
        "documentId": "s831tv1dxx8948f301r7r740",
        "question": "Does a submission require proof?",
        "answer": [
          {
            "type": "paragraph",
            "children": [
              {
                "text": "Yes, every submission requires a link to a publicly available recording of the run.",
                "type": "text"
              }
            ]
          }
        ],
        "name": "Submission proof"
      }
    ]
  },
  "meta": {}
}
```
```

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
GET /api/submissions?populate[challenge][populate]=custom_code,creators,tournaments
```

**Available Fields**: runner, runner_url, video_url, note, result
**Relations**: challenge

**Sample Responses**

*GET /api/submissions - Empty submissions listing*
```json
{
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 0,
      "total": 0
    }
  }
}
```

### Tournament API

**Collection Endpoints**
```http
GET    /api/tournaments                         # List tournaments (auth required)
GET    /api/tournaments?populate=*              # List with relations (auth required)
```

**Detail Endpoints**
```http
GET    /api/tournaments/slug/{slug}             # Get tournament by slug with full details (auth required)
```

**Filtering & Search (Collection Only)**
```http
# Filter by state
GET /api/tournaments?filters[state][$eq]=active

# Filter by featured status
GET /api/tournaments?filters[is_featured][$eq]=true

# Filter by date range
GET /api/tournaments?filters[start_date][$gte]=2024-01-01&filters[end_date][$lte]=2024-12-31
```

**Available Fields**: name, slug, thumbnail, description_short, description_long, start_date, end_date, state, is_featured
**Relations**: challenges, creators, faqs

**Sample Responses**

*GET /api/tournaments - Tournament listing*
```json
{
  "data": [
    {
      "id": 3,
      "documentId": "da8eflxr52n3lcbvfcagse8c",
      "name": "Furry, then silence",
      "slug": "furry-then-silence",
      "start_date": "2025-09-13T22:00:00.000Z",
      "end_date": "2025-12-30T23:00:00.000Z",
      "state": "planned",
      "createdAt": "2025-08-30T07:40:16.170Z",
      "updatedAt": "2025-08-30T07:45:05.363Z",
      "publishedAt": "2025-08-30T07:45:05.416Z",
      "description_short": "Part 2 of the famous hunting tourney \"Fury, then silence\". Get points for every kill, get rewarded for high accuracy and compete with players around the world.",
      "description_long": null,
      "is_featured": true
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

### CustomCode API

**Collection Endpoints**
```http
GET    /api/custom-codes                        # List custom codes (auth required)
GET    /api/custom-codes?populate=*             # List with relations (auth required)
```

**Detail Endpoints**
```http
GET    /api/custom-codes/slug/{slug}            # Get custom code by slug with full details (auth required)
```

**Filtering & Search (Collection Only)**
```http
# Filter by featured status
GET /api/custom-codes?filters[is_featured][$eq]=true

# Search by name
GET /api/custom-codes?filters[name][$contains]=weather
```

**Available Fields**: name, slug, thumbnail, description_short, description_long, code, is_featured
**Relations**: challenges, creators, faqs

**Sample Responses**

*GET /api/custom-codes - Custom codes listing*
```json
{
  "data": [
    {
      "id": 8,
      "documentId": "a8y1lmo141rjzlo1wvaqbkkt",
      "name": "N.O.G.O.A. lite",
      "slug": "n-o-g-o-a-lite",
      "code": "8sHM-/z8P-Dz+3-waim-XRYC",
      "createdAt": "2025-08-30T07:58:21.976Z",
      "updatedAt": "2025-08-30T07:58:24.148Z",
      "publishedAt": "2025-08-30T07:58:24.199Z",
      "description_short": "No one gets out alive, with birch bark tea enabled.",
      "description_long": null,
      "is_featured": false
    },
    {
      "id": 10,
      "documentId": "bbr7a94tbd3ycxi6rkwkfp9d",
      "name": "N.O.G.O.A",
      "slug": "n-o-g-o-a",
      "code": "8sHM-/z8P-Dz+3-waim-XRYC",
      "createdAt": "2025-08-28T18:20:02.211Z",
      "updatedAt": "2025-08-30T08:54:07.572Z",
      "publishedAt": "2025-08-30T08:54:07.620Z",
      "description_short": "No one gets out alive",
      "description_long": null,
      "is_featured": false
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 2
    }
  }
}
```

### Rule API

**Collection Endpoints**
```http
GET    /api/rules                               # List rules (auth required)
GET    /api/rules?populate=*                    # List with challenge relations (auth required)
GET    /api/rules/{id}                          # Get single rule (auth required)
```

**Available Fields**: name, description
**Relations**: challenges

**Sample Responses**

*GET /api/rules - Rules listing*
```json
{
  "data": [
    {
      "id": 16,
      "documentId": "w20rwxgjqd8f1k4xs8vx13lq",
      "description": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "Flaregun for kills is not permitted.",
              "type": "text"
            }
          ]
        }
      ],
      "createdAt": "2025-08-30T08:48:32.235Z",
      "updatedAt": "2025-08-30T08:48:41.064Z",
      "publishedAt": "2025-08-30T08:48:41.103Z",
      "name": "Flaregun"
    },
    {
      "id": 4,
      "documentId": "v5f2jnbllenc0201x9kxdcf4",
      "description": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "Make it to 50 days survived on the stats page.",
              "type": "text"
            }
          ]
        }
      ],
      "createdAt": "2025-08-30T07:55:30.757Z",
      "updatedAt": "2025-08-30T08:06:08.309Z",
      "publishedAt": "2025-08-30T08:06:08.335Z",
      "name": "50 days survived"
    },
    {
      "id": 6,
      "documentId": "zrrdjd8tatihagglxjgsaz92",
      "description": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "Using a stone for bunnies is not allowed.",
              "type": "text"
            }
          ]
        }
      ],
      "createdAt": "2025-08-30T08:09:51.300Z",
      "updatedAt": "2025-08-30T08:09:53.304Z",
      "publishedAt": "2025-08-30T08:09:53.325Z",
      "name": "no stone for bunnies"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 7
    }
  }
}
```

### Creator API

**Collection Endpoints**
```http
GET    /api/creators                            # List creators (auth required)
GET    /api/creators?populate=*                 # List with all content relations (auth required)
```

**Detail Endpoints**
```http
GET    /api/creators/slug/{slug}                # Get creator by slug with full details (auth required)
```

**Filtering & Search (Collection Only)**
```http
# Filter by slug
GET /api/creators?filters[slug][$eq]=creator-username

# List creators with content counts
GET /api/creators?populate[challenges][fields][0]=id&populate[tournaments][fields][0]=id&populate[custom_codes][fields][0]=id
```

**Available Fields**: name, slug, description_short, description_long, twitch, youtube
**Relations**: challenges, tournaments, custom_codes, creator_socials

**Sample Responses**

*GET /api/creators - Creators listing*
```json
{
  "data": [
    {
      "id": 3,
      "documentId": "uae3ap4zc9tfsk4k03wgkc0v",
      "name": "PerfectTrip",
      "twitch": "https://www.twitch.tv/perfecttrip",
      "youtube": "https://www.youtube.com/@PerfectTrip0",
      "createdAt": "2025-08-28T18:27:15.974Z",
      "updatedAt": "2025-08-30T07:30:38.456Z",
      "publishedAt": "2025-08-30T07:30:38.494Z",
      "slug": "perfect-trip",
      "description_short": null,
      "description_long": null
    },
    {
      "id": 5,
      "documentId": "s5dpeov1p516lnlwgw3soda9",
      "name": "ChefMaria",
      "twitch": "https://www.twitch.tv/chefmaria",
      "youtube": "https://www.youtube.com/@chefmaria7464",
      "createdAt": "2025-08-30T07:44:23.415Z",
      "updatedAt": "2025-08-30T07:44:25.627Z",
      "publishedAt": "2025-08-30T07:44:25.656Z",
      "slug": "chef-maria",
      "description_short": null,
      "description_long": null
    },
    {
      "id": 7,
      "documentId": "mpmb5prvlo58x9e380p6tam2",
      "name": "BigFish",
      "twitch": "https://www.twitch.tv/b1gf1s4",
      "youtube": "https://www.youtube.com/@b1gf1s47",
      "createdAt": "2025-08-30T07:48:26.904Z",
      "updatedAt": "2025-08-30T07:48:29.099Z",
      "publishedAt": "2025-08-30T07:48:29.137Z",
      "slug": "big-fish",
      "description_short": null,
      "description_long": null
    },
    {
      "id": 9,
      "documentId": "cfl5nwkbf456088pn0v7u05l",
      "name": "test creator",
      "twitch": null,
      "youtube": null,
      "createdAt": "2025-08-30T18:51:05.269Z",
      "updatedAt": "2025-08-30T18:51:07.059Z",
      "publishedAt": "2025-08-30T18:51:07.119Z",
      "slug": null,
      "description_short": null,
      "description_long": null
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 4
    }
  }
}
```

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

**Available Fields**: name, question, answer
**Relations**: challenges, custom_codes, tournaments

**Sample Responses**

*GET /api/faqs - FAQs listing*
```json
{
  "data": [
    {
      "id": 11,
      "documentId": "lwsju3ocykzv3xbkazdxlw0y",
      "question": "Can i use the campfire cheese to deter animals?",
      "answer": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "No.",
              "type": "text"
            }
          ]
        },
        {
          "type": "paragraph",
          "children": [
            {
              "text": "Currently every animal in the game can be deterred or at least avoided, when being close enough to a lit campfire. For this challenge, this is not allowed.",
              "type": "text"
            }
          ]
        }
      ],
      "createdAt": "2025-08-30T08:27:26.805Z",
      "updatedAt": "2025-08-30T08:27:55.592Z",
      "publishedAt": "2025-08-30T08:27:55.667Z",
      "name": "Fire Cheese"
    },
    {
      "id": 14,
      "documentId": "gevyuziqfdd8uk19ek107jfj",
      "question": "Is the DLC allowed?",
      "answer": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "Yes, while we recognize, that the DLC makes certain aspects of the game easier, we think it adds core components diversifying strategies and tactics. WE highly recommend investing in the additional content. In our mind at this point in time it is part of the core game.",
              "type": "text"
            }
          ]
        }
      ],
      "createdAt": "2025-08-30T08:25:40.223Z",
      "updatedAt": "2025-08-30T08:29:10.571Z",
      "publishedAt": "2025-08-30T08:29:10.624Z",
      "name": "DLC"
    },
    {
      "id": 12,
      "documentId": "s831tv1dxx8948f301r7r740",
      "question": "Does a submission require proof?",
      "answer": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "Yes, every submission requires a link to a publicly available recording of the run.",
              "type": "text"
            }
          ]
        },
        {
          "type": "paragraph",
          "children": [
            {
              "text": "Keep in mind that twitch only holds vods of your streams for a certain period of time. We highly recommend exporting your stream(s) to youtube, and either provide a link to the final video of the run, or the playlist of the full challenge.",
              "type": "text"
            }
          ]
        }
      ],
      "createdAt": "2025-08-30T08:15:40.231Z",
      "updatedAt": "2025-08-30T08:28:08.259Z",
      "publishedAt": "2025-08-30T08:28:08.298Z",
      "name": "Submission proof"
    },
    {
      "id": 13,
      "documentId": "bk0dey41eshpcm3jtdg4kbr4",
      "question": "Am i allowed to use mods?",
      "answer": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "No, all submissions have to be on the vanilla version of the game.",
              "type": "text"
            }
          ]
        }
      ],
      "createdAt": "2025-08-30T08:22:13.185Z",
      "updatedAt": "2025-08-30T08:28:29.053Z",
      "publishedAt": "2025-08-30T08:28:29.125Z",
      "name": "Mods"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 4
    }
  }
}
```

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

**Sample Responses**

*GET /api/ideas - Access forbidden (requires specific permissions)*
```json
{
  "data": null,
  "error": {
    "status": 403,
    "name": "ForbiddenError",
    "message": "Forbidden",
    "details": {}
  }
}
```

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
    "challenges": 3,
    "customCodes": 2,
    "tournaments": 1
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

**Important Note**: This API uses Strapi v5+ which has a **flat response structure**. Unlike Strapi v4, fields are not nested under an `attributes` object. Each entity includes both `id` (numeric) and `documentId` (string) for identification.

### Single Entity Response
```json
{
  "data": {
    "id": 5,
    "documentId": "q3wojw3tqwry29632wwc5sew",
    "name": "Furry, then silence - Stalker",
    "slug": "furry-then-silence-stalker",
    "difficulty": "Medium",
    "createdAt": "2025-08-30T07:49:58.584Z",
    "updatedAt": "2025-08-30T07:50:05.847Z",
    "publishedAt": "2025-08-30T07:50:05.939Z",
    "description_long": null,
    "description_short": null,
    "is_featured": false
  },
  "meta": {}
}
```

### Collection Response
```json
{
  "data": [
    {
      "id": 5,
      "documentId": "q3wojw3tqwry29632wwc5sew",
      "name": "Furry, then silence - Stalker",
      "slug": "furry-then-silence-stalker",
      "difficulty": "Medium",
      "createdAt": "2025-08-30T07:49:58.584Z",
      "updatedAt": "2025-08-30T07:50:05.847Z",
      "publishedAt": "2025-08-30T07:50:05.939Z",
      "description_long": null,
      "description_short": null,
      "is_featured": false
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 3
    }
  }
}
```

### Error Response
```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError", 
    "message": "Not Found",
    "details": {}
  }
}
```

## Common Query Patterns

### Homepage Data
```http
# Recent challenges with minimal data
GET /api/challenges?sort=createdAt:desc&pagination[limit]=6&fields[0]=name&fields[1]=slug&fields[2]=difficulty

# Active tournaments
GET /api/tournaments?filters[state][$eq]=active&fields[0]=name&fields[1]=slug&fields[2]=start_date
```

### Detail Pages
```http
# Challenge detail page
GET /api/challenges/slug/{slug}

# Tournament detail page
GET /api/tournaments/slug/{slug}

# Custom code detail page
GET /api/custom-codes/slug/{slug}

# Creator profile page
GET /api/creators/slug/{slug}
```

### Submission Leaderboard
```http
GET /api/submissions?filters[challenge][id][$eq]={challengeId}&filters[publishedAt][$notNull]=true&sort=createdAt:asc&populate[challenge][fields][0]=name
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
  name: string;            // optional
  description: blocks;      // required, rich text content
}
```

### FAQ Fields
```typescript
{
  name: string;            // optional
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

## Detailed Endpoint Examples

### Challenge by Slug

**Endpoint:** `GET /api/challenges/slug/{slug}`  
**Authentication:** Required (Bearer token)

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:1337/api/challenges/slug/furry-then-silence-stalker
```

**Response:**
```json
{
  "data": {
    "id": 4,
    "documentId": "q3wojw3tqwry29632wwc5sew",
    "name": "Furry, then silence - Stalker",
    "slug": "furry-then-silence-stalker",
    "createdAt": "2025-08-30T07:49:58.584Z",
    "updatedAt": "2025-08-30T07:50:05.847Z",
    "publishedAt": null,
    "description_long": null,
    "description_short": null,
    "difficulty": "Medium",
    "is_featured": false
  },
  "meta": {}
}
```

### Tournament by Slug

**Endpoint:** `GET /api/tournaments/slug/{slug}`  
**Authentication:** Required (Bearer token)

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:1337/api/tournaments/slug/furry-then-silence
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "documentId": "da8eflxr52n3lcbvfcagse8c",
    "name": "Furry, then silence",
    "slug": "furry-then-silence",
    "start_date": "2025-09-13T22:00:00.000Z",
    "end_date": "2025-12-30T23:00:00.000Z",
    "state": "planned",
    "createdAt": "2025-08-30T07:40:16.170Z",
    "updatedAt": "2025-08-30T07:45:05.363Z",
    "publishedAt": null,
    "description_short": "Part 2 of the famous hunting tourney \"Fury, then silence\". Get points for every kill, get rewarded for high accuracy and compete with players around the world.",
    "description_long": null,
    "is_featured": true
  },
  "meta": {}
}
```

### Custom Code by Slug

**Endpoint:** `GET /api/custom-codes/slug/{slug}`  
**Authentication:** Required (Bearer token)

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:1337/api/custom-codes/slug/n-o-g-o-a
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "documentId": "bbr7a94tbd3ycxi6rkwkfp9d",
    "name": "N.O.G.O.A",
    "slug": "n-o-g-o-a",
    "code": "8sHM-/z8P-Dz+3-waim-XRYC",
    "createdAt": "2025-08-28T18:20:02.211Z",
    "updatedAt": "2025-08-30T08:54:07.572Z",
    "publishedAt": null,
    "description_short": "No one gets out alive",
    "description_long": null,
    "is_featured": false
  },
  "meta": {}
}
```

### Creator by Slug

**Endpoint:** `GET /api/creators/slug/{slug}`  
**Authentication:** Required (Bearer token)

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:1337/api/creators/slug/perfect-trip
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "documentId": "uae3ap4zc9tfsk4k03wgkc0v",
    "name": "PerfectTrip",
    "twitch": "https://www.twitch.tv/perfecttrip",
    "youtube": "https://www.youtube.com/@PerfectTrip0",
    "createdAt": "2025-08-28T18:27:15.974Z",
    "updatedAt": "2025-08-30T07:30:38.456Z",
    "publishedAt": null,
    "slug": "perfect-trip",
    "description_short": null,
    "description_long": null
  },
  "meta": {}
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
GET /api/challenges?filters[slug][$eq]=challenge-slug&populate[submissions][filters][state][$eq]=approved&populate[submissions][sort][0]=submitted_date:asc&populate[custom_code][populate][creators]=*&populate[tournaments][populate][creators]=*&populate[creators]=*&populate[rules]=*&populate[faqs]=*

# Creator with all content types
GET /api/creators?filters[slug][$eq]=creator-slug&populate[challenges][populate][tournaments,custom_code]&populate[tournaments][populate][challenges]&populate[custom_codes][populate][challenges]
```

### Frontend Development Recommendations
1. Create wrapper functions for common query patterns
2. Implement client-side caching for frequently accessed data
3. Use TypeScript interfaces based on the field specifications above
4. Consider implementing custom hooks for React applications
5. Plan for pagination on all listing endpoints
