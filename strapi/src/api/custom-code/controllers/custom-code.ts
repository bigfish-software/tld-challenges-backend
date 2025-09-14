/**
 * custom-code controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::custom-code.custom-code', ({ strapi }) => ({
  // Custom slug-based retrieval
  async findBySlug(ctx) {
    console.log('=== CUSTOM CODE SLUG ENDPOINT HIT ===');
    console.log('Params:', ctx.params);
    
    const { slug } = ctx.params;
    console.log('Extracted slug:', slug);
    
    if (!slug) {
      return ctx.badRequest('Slug parameter is required');
    }
    
    try {
      console.log('Attempting to find custom code with slug:', slug);
      
      const entities = await strapi.entityService.findMany('api::custom-code.custom-code', {
        filters: { 
          slug: slug,
        },
        status: 'published', // Filter for published content only
        populate: ['thumbnail', 'challenges', 'creators', 'faqs'],
      });

      console.log('Raw entities found:', entities?.length);
      
      if (entities && entities.length > 0) {
        // Check for duplicates
        if (entities.length > 1) {
          console.warn('Multiple published custom codes found with slug:', slug, 'IDs:', entities.map(e => e.id));
        }
        
        const entity = entities[0];
        console.log('Entity found:', entity);
        
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } else {
        console.log('No published entities found for slug:', slug);
        return ctx.notFound('Custom code not found');
      }
    } catch (err) {
      console.error('Custom code findBySlug error:', err);
      return ctx.badRequest('Failed to fetch custom code', { details: err.message });
    }
  },
}));
