/**
 * submission controller
 */

import { factories } from '@strapi/strapi'

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export default factories.createCoreController('api::submission.submission', ({ strapi }) => ({
  // Enhanced create method with validation
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Input validation
    if (!data.runner || !data.challenge || !data.video_url || !data.result) {
      return ctx.badRequest('Runner name, challenge, video URL, and result are required');
    }
    
    // Validate URLs if provided
    if (data.runner_url && !isValidUrl(data.runner_url)) {
      return ctx.badRequest('Invalid runner URL format');
    }
    
    if (!isValidUrl(data.video_url)) {
      return ctx.badRequest('Invalid video URL format');
    }
    
    // Check if challenge exists and is published
    const challenge = await strapi.entityService.findOne('api::challenge.challenge', data.challenge);
    
    if (!challenge) {
      return ctx.badRequest('Challenge not found');
    }
    
    // Set submission as draft (requires admin approval)
    const submissionData = {
      ...data,
      publishedAt: null, // Start as draft
    };
    
    try {
      const entity = await strapi.entityService.create('api::submission.submission', {
        data: submissionData,
      });
      
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.badRequest('Failed to create submission', { details: err });
    }
  },
}));
