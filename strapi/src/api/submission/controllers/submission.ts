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
  async create(ctx) {
    const { data } = ctx.request.body;
    
    if (!data.runner || !data.challenge || !data.video_url || !data.result) {
      return ctx.badRequest('Runner name, challenge, video URL, and result are required');
    }
    
    if (data.runner_url && !isValidUrl(data.runner_url)) {
      return ctx.badRequest('Invalid runner URL format');
    }
    
    if (!isValidUrl(data.video_url)) {
      return ctx.badRequest('Invalid video URL format');
    }
    
    const challenge = await strapi.entityService.findOne('api::challenge.challenge', data.challenge);
    
    if (!challenge) {
      return ctx.badRequest('Challenge not found');
    }
    
    const challengeIdForRelation = challenge.documentId;
    
    const submissionData = {
      ...data,
      challenge: challengeIdForRelation,
      publishedAt: null,
    };
    
    try {
      const entity = await strapi.entityService.create('api::submission.submission', {
        data: submissionData,
      });
      
      ctx.send({
        data: entity,
        meta: {},
      });
    } catch (err) {
      console.error('Submission creation error:', err);
      return ctx.badRequest('Failed to create submission', { details: err.message });
    }
  },
}));
