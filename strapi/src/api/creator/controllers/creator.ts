/**
 * creator controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::creator.creator', ({ strapi }) => ({
  // Custom slug-based retrieval
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findMany('api::creator.creator', {
        filters: { slug: slug },
        populate: ['challenges', 'tournaments', 'custom_codes'],
        publicationState: 'live',
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound('Creator not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to fetch creator', { details: err });
    }
  },
}));
