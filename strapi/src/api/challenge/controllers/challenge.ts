/**
 * challenge controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::challenge.challenge', ({ strapi }) => ({
  // Custom slug-based retrieval
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findMany('api::challenge.challenge', {
        filters: { 
          slug: slug,
          publishedAt: { $notNull: true },
        },
        populate: ['thumbnail', 'submissions', 'custom_code', 'rules', 'tournament', 'creators', 'faqs'],
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound('Challenge not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to fetch challenge', { details: err });
    }
  },
}));
