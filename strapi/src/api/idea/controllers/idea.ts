/**
 * idea controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::idea.idea', ({ strapi }) => ({
  // Enhanced create method with validation and social links handling
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
    
    // Extract social links from the data
    const socialLinks = data.social_links || [];
    
    // Remove social_links from idea data since it's not a direct field
    const { social_links, ...ideaData } = data;
    
    try {
      // First, create the idea as draft (requires admin approval)
      const ideaEntity = await strapi.entityService.create('api::idea.idea', {
        data: {
          ...ideaData,
          publishedAt: null, // Start as draft
        },
      });
      
      // Create creator social entries if provided
      const createdSocials = [];
      if (socialLinks && socialLinks.length > 0) {
        for (const url of socialLinks) {
          if (url && typeof url === 'string' && url.trim()) {
            try {
              const socialEntity = await strapi.entityService.create('api::creator-social.creator-social', {
                data: {
                  url: url.trim(),
                  idea: ideaEntity.id,
                  publishedAt: new Date(), // Auto-publish social links
                },
              });
              createdSocials.push(socialEntity);
            } catch (socialErr) {
              console.warn(`Failed to create social link: ${url}`, socialErr);
              // Continue with other social links even if one fails
            }
          }
        }
      }
      
      // Fetch the idea with populated social links for response
      const populatedEntity = await strapi.entityService.findOne('api::idea.idea', ideaEntity.id, {
        populate: {
          creator_socials: true,
        },
      });
      
      const sanitizedEntity = await this.sanitizeOutput(populatedEntity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to create idea', { details: err });
    }
  },
}));
