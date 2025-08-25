# Implementation Notes - Content Type Architecture

This document records the key architectural decisions and corrections made during the actual Strapi content type implementation.

## Key Changes from Original Documentation

### 1. Field Type Corrections
- **Submission.note**: Changed from Rich text (Blocks) to Text for simpler input
- **FAQ.question**: Changed from Text to Long text for multi-line questions
- **Date fields**: All implemented as "Date and time" (datetime) instead of "Date" for more precise tracking

### 2. Relation Architecture Corrections

#### Challenge Relations
- **custom_code**: Changed from One to One → **Many to One** (Multiple challenges can use the same custom code)
- **tournament**: Changed from Many to Many → **Many to One** (Challenges belong to one tournament, but tournaments can have multiple challenges)
- **rules**: Changed from One to Many → **Many to Many** (Rules can be shared across multiple challenges)
- **faqs**: Added **Many to Many** relation (FAQs can be associated with multiple challenges)

#### CustomCode Relations
- **challenges**: Now **One to Many** (inverse of Challenge.custom_code Many to One)
- **faqs**: Added **Many to Many** relation (FAQs can be associated with custom codes)

#### Tournament Relations
- **challenges**: Now **One to Many** (inverse of Challenge.tournament Many to One)
- **faqs**: Added **Many to Many** relation (FAQs can be associated with tournaments)

#### FAQ Relations
- **challenges**: **Many to Many** (existing)
- **custom_codes**: Added **Many to Many** relation
- **tournaments**: Added **Many to Many** relation

### 3. Field Constraints
- **Creator.name**: Added `unique: true` constraint
- **CustomCode.name**: Added `unique: true` constraint
- **Creator.slug**: Added slug field with UID type
- **All content types**: Draft/Publish enabled across all types

### 4. Enumeration Updates
- **Challenge.difficulty**: Added "Nogoa" option to enum values

## Architectural Benefits

### 1. Improved Content Reusability
- **Custom Codes**: Can now be shared across multiple challenges (realistic use case)
- **Rules**: Can be applied to multiple challenges (DRY principle)
- **FAQs**: Can be associated with any relevant entity (comprehensive help system)

### 2. Better Tournament Structure
- **Clearer ownership**: Challenges belong to one tournament (eliminates complexity)
- **Simpler queries**: Easier to fetch all challenges for a tournament
- **Better organization**: Tournaments act as containers for related challenges

### 3. Enhanced Content Management
- **Unique constraints**: Prevent duplicate creator/custom code names
- **Slug support**: SEO-friendly URLs for all major entities
- **Draft/Publish**: Consistent moderation workflow across all content types

## Database Schema Impact

### Relation Tables Created
```sql
-- Many to Many relations create junction tables:
challenges_creators_links
challenges_faqs_links  
challenges_rules_links
creators_tournaments_links
creators_custom_codes_links
custom_codes_faqs_links
tournaments_faqs_links
```

### Foreign Key Relations
```sql
-- Many to One relations add foreign keys:
challenges.custom_code_id → custom_codes.id
challenges.tournament_id → tournaments.id
submissions.challenge_id → challenges.id
```

## API Query Implications

### Population Strategies
```javascript
// Challenge with all relations
await strapi.entityService.findOne('api::challenge.challenge', id, {
  populate: {
    custom_code: true,
    tournament: true,
    creators: true,
    rules: true,
    faqs: true,
    submissions: {
      filters: { publishedAt: { $notNull: true } } // Only published
    }
  }
});

// Tournament with challenges
await strapi.entityService.findOne('api::tournament.tournament', id, {
  populate: {
    challenges: {
      populate: ['creators', 'custom_code']
    },
    creators: true,
    faqs: true
  }
});
```

### Performance Considerations
- **Custom Code reuse**: Reduces database size through normalization
- **FAQ associations**: Single FAQ entry can serve multiple entities
- **Rule sharing**: Common rules don't need duplication

## Migration Path

If updating from the original documentation:

1. **Backup existing data**
2. **Update relations in Content-Type Builder**:
   - Change Challenge.custom_code from One to One → Many to One
   - Change Challenge.tournament from Many to Many → Many to One  
   - Change Challenge.rules from One to Many → Many to Many
   - Add FAQ relations to CustomCode and Tournament
3. **Add unique constraints** to Creator.name and CustomCode.name
4. **Add slug field** to Creator content type
5. **Enable Draft/Publish** on all content types if not already enabled

## Best Practices Established

### Content Type Design
- **Use Many to Many for shared concepts** (rules, FAQs, creators)
- **Use Many to One for ownership** (challenges belong to tournaments)
- **Add unique constraints for identifiers** (names, slugs)
- **Enable Draft/Publish for all content** (consistent moderation)

### Relation Naming
- **Plural for collections** (challenges, creators, faqs)
- **Singular for single relations** (challenge, tournament, custom_code)
- **Descriptive field names** (custom_code vs code, note vs notes)

### Field Types
- **Use Text for short content**, Long text for paragraphs, Rich text (Blocks) for formatted content
- **Use Date and time for all temporal data** (better precision)
- **Use enumeration with defaults** for status fields
