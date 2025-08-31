/**
 * creator controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::creator.creator', ({ strapi }) => ({
  // Custom slug-based retrieval
  async findBySlug(ctx) {
    console.log('=== CREATOR SLUG ENDPOINT HIT ===');
    console.log('Params:', ctx.params);
    
    const { slug } = ctx.params;
    console.log('Extracted slug:', slug);
    
    if (!slug) {
      return ctx.badRequest('Slug parameter is required');
    }
    
    try {
      console.log('Attempting to find creator with slug:', slug);
      
      const entities = await strapi.entityService.findMany('api::creator.creator', {
        filters: { 
          slug: slug,
        },
      });

      console.log('Raw entities found:', entities?.length);
      
      if (entities && entities.length > 0) {
        const entity = entities[0];
        console.log('Entity found:', entity);
        
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } else {
        console.log('No entities found for slug:', slug);
        return ctx.notFound('Creator not found');
      }
    } catch (err) {
      console.error('Creator findBySlug error:', err);
      return ctx.badRequest('Failed to fetch creator', { details: err.message });
    }
  },
}));
