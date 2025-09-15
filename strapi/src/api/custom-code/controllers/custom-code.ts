import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::custom-code.custom-code', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    if (!slug) {
      return ctx.badRequest('Slug parameter is required');
    }
    
    try {
      const entities = await strapi.entityService.findMany('api::custom-code.custom-code', {
        filters: { 
          slug: slug,
        },
        status: 'published',
        populate: ['thumbnail', 'challenges', 'creators', 'faqs'],
      });
      
      if (entities && entities.length > 0) {
        if (entities.length > 1) {
          console.warn('Multiple published custom codes found with slug:', slug, 'IDs:', entities.map(e => e.id));
        }
        
        const entity = entities[0];
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } else {
        return ctx.notFound('Custom code not found');
      }
    } catch (err) {
      console.error('Custom code findBySlug error:', err);
      return ctx.badRequest('Failed to fetch custom code', { details: err.message });
    }
  },
}));
