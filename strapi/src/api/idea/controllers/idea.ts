import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::idea.idea', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    
    if (!data.type || !data.description) {
      return ctx.badRequest('Type and description are required');
    }
    
    const validTypes = ['CustomCode', 'Challenge', 'Tournament'];
    if (!data.type || !validTypes.includes(data.type)) {
      return ctx.badRequest('Invalid idea type');
    }
    
    const ideaData = data;
    
    try {
      const ideaEntity = await strapi.entityService.create('api::idea.idea', {
        data: {
          ...ideaData,
          publishedAt: null,
        },
      });
      
      const sanitizedEntity = await this.sanitizeOutput(ideaEntity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to create idea', { details: err });
    }
  },
}));
