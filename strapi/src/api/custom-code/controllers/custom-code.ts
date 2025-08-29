/**
 * custom-code controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::custom-code.custom-code', ({ strapi }) => ({
  // Custom slug-based retrieval
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findMany('api::custom-code.custom-code', {
        filters: { slug: slug },
        populate: ['thumbnail', 'challenges', 'creators', 'faqs'],
        publicationState: 'live',
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound('Custom code not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to fetch custom code', { details: err });
    }
  },
}));
