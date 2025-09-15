/**
 * idea controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::idea.idea', ({ strapi }) => ({
  // Enhanced create method with validation
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Input validation
    if (!data.type || !data.description) {
      return ctx.badRequest('Type and description are required');
    }
    
    // Validate type enum
    const validTypes = ['CustomCode', 'Challenge', 'Tournament'];
    if (!data.type || !validTypes.includes(data.type)) {
      return ctx.badRequest('Invalid idea type');
    }
    
    // Extract and validate data (no longer handling social links)
    const ideaData = data;
    
    try {
      // Create the idea as draft (requires admin approval)
      const ideaEntity = await strapi.entityService.create('api::idea.idea', {
        data: {
          ...ideaData,
          publishedAt: null, // Start as draft
        },
      });
      
      const sanitizedEntity = await this.sanitizeOutput(ideaEntity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to create idea', { details: err });
    }
  },
}));
