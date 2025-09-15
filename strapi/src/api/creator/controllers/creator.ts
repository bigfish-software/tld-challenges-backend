import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::creator.creator', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    if (!slug) {
      return ctx.badRequest('Slug parameter is required');
    }
    
    try {
      const entities = await strapi.entityService.findMany('api::creator.creator', {
        filters: { 
          slug: slug,
        },
        status: 'published',
      });
      
      if (entities && entities.length > 0) {
        if (entities.length > 1) {
          console.warn('Multiple published creators found with slug:', slug, 'IDs:', entities.map(e => e.id));
        }
        
        const entity = entities[0];
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } else {
        return ctx.notFound('Creator not found');
      }
    } catch (err) {
      console.error('Creator findBySlug error:', err);
      return ctx.badRequest('Failed to fetch creator', { details: err.message });
    }
  },
}));
