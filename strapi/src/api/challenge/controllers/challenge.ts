import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::challenge.challenge', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    if (!slug) {
      return ctx.badRequest('Slug parameter is required');
    }
    
    try {
      const entities = await strapi.entityService.findMany('api::challenge.challenge', {
        filters: { 
          slug: slug,
        },
        status: 'published',
        populate: ['thumbnail', 'submissions', 'creators', 'faqs', 'custom_code', 'rules', 'tournaments'],
      });
      
      if (entities && entities.length > 0) {
        if (entities.length > 1) {
          console.warn('Multiple published challenges found with slug:', slug, 'IDs:', entities.map(e => e.id));
        }
        
        const entity = entities[0];
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } else {
        return ctx.notFound('Challenge not found');
      }
    } catch (err) {
      console.error('Challenge findBySlug error:', err);
      return ctx.badRequest('Failed to fetch challenge', { details: err.message });
    }
  },
}));
