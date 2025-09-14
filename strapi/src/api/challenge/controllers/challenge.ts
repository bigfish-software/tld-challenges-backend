/**
 * challenge controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::challenge.challenge', ({ strapi }) => ({
  // Custom slug-based retrieval
  async findBySlug(ctx) {
    console.log('=== CHALLENGE SLUG ENDPOINT HIT ===');
    console.log('Params:', ctx.params);
    console.log('Query:', ctx.query);
    
    const { slug } = ctx.params;
    console.log('Extracted slug:', slug);
    
    if (!slug) {
      return ctx.badRequest('Slug parameter is required');
    }
    
    try {
      console.log('Attempting to find challenge with slug:', slug);
      
      const entities = await strapi.entityService.findMany('api::challenge.challenge', {
        filters: { 
          slug: slug,
        },
        status: 'published', // Filter for published content only
        populate: ['thumbnail', 'submissions', 'creators', 'faqs', 'custom_code', 'rules', 'tournaments'],
      });

      console.log('Raw entities found:', entities?.length);
      
      if (entities && entities.length > 0) {
        // Check for duplicates
        if (entities.length > 1) {
          console.warn('Multiple published challenges found with slug:', slug, 'IDs:', entities.map(e => e.id));
        }
        
        const entity = entities[0];
        console.log('Entity found:', entity);
        
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } else {
        console.log('No published entities found for slug:', slug);
        return ctx.notFound('Challenge not found');
      }
    } catch (err) {
      console.error('Challenge findBySlug error:', err);
      return ctx.badRequest('Failed to fetch challenge', { details: err.message });
    }
  },
}));
