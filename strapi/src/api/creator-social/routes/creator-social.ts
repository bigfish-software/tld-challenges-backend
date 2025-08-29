/**
 * creator-social router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/creator-socials',
      handler: 'creator-social.find',
      config: {
        auth: {
          scope: ['api::creator-social.creator-social.find']
        },
      },
    },
    {
      method: 'GET',
      path: '/creator-socials/:id',
      handler: 'creator-social.findOne',
      config: {
        auth: {
          scope: ['api::creator-social.creator-social.findOne']
        },
      },
    },
    {
      method: 'POST',
      path: '/creator-socials',
      handler: 'creator-social.create',
      config: {
        auth: {
          scope: ['api::creator-social.creator-social.create']
        },
      },
    },
    {
      method: 'PUT',
      path: '/creator-socials/:id',
      handler: 'creator-social.update',
      config: {
        auth: {
          scope: ['api::creator-social.creator-social.update']
        },
      },
    },
    {
      method: 'DELETE',
      path: '/creator-socials/:id',
      handler: 'creator-social.delete',
      config: {
        auth: {
          scope: ['api::creator-social.creator-social.delete']
        },
      },
    },
  ],
};
