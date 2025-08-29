/**
 * challenge router
 */

export default {
  routes: [
    // Custom route for slug-based retrieval (must come first to avoid conflicts)
    {
      method: 'GET',
      path: '/challenges/slug/:slug',
      handler: 'challenge.findBySlug',
      config: {
        auth: {
          scope: ['api::challenge.challenge.find']
        },
        policies: [],
        middlewares: [],
      },
    },
    // Default CRUD routes
    {
      method: 'GET',
      path: '/challenges',
      handler: 'challenge.find',
      config: {
        auth: {
          scope: ['api::challenge.challenge.find']
        },
      },
    },
    {
      method: 'GET',
      path: '/challenges/:id',
      handler: 'challenge.findOne',
      config: {
        auth: {
          scope: ['api::challenge.challenge.findOne']
        },
      },
    },
    {
      method: 'POST',
      path: '/challenges',
      handler: 'challenge.create',
      config: {
        auth: {
          scope: ['api::challenge.challenge.create']
        },
      },
    },
    {
      method: 'PUT',
      path: '/challenges/:id',
      handler: 'challenge.update',
      config: {
        auth: {
          scope: ['api::challenge.challenge.update']
        },
      },
    },
    {
      method: 'DELETE',
      path: '/challenges/:id',
      handler: 'challenge.delete',
      config: {
        auth: {
          scope: ['api::challenge.challenge.delete']
        },
      },
    },
  ],
};
