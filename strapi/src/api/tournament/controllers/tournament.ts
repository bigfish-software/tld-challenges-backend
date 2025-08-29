/**
 * tournament controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::tournament.tournament', ({ strapi }) => ({
  // Custom slug-based retrieval
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findMany('api::tournament.tournament', {
        filters: { slug: slug },
        populate: ['thumbnail', 'challenges', 'creators', 'faqs'],
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
}));
