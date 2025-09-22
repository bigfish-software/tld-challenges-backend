import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::tournament.tournament', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    if (!slug) {
      return ctx.badRequest('Slug parameter is required');
    }
    
    try {
      const entities = await strapi.entityService.findMany('api::tournament.tournament', {
        filters: { 
          slug: slug,
        },
        status: 'published',
        populate: {
          thumbnail: true,
          creators: true,
          faqs: true,
          challenges: {
            sort: ['createdAt:asc'],
            populate: ['thumbnail', 'rules']
          }
        },
      });
      
      if (entities && entities.length > 0) {
        if (entities.length > 1) {
          console.warn('Multiple published tournaments found with slug:', slug, 'IDs:', entities.map(e => e.id));
        }
        
        const entity = entities[0];
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } else {
        return ctx.notFound('Tournament not found');
      }
    } catch (err) {
      console.error('Tournament findBySlug error:', err);
      return ctx.badRequest('Failed to fetch tournament', { details: err.message });
    }
  },
}));
