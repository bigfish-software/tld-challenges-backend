/**
 * custom-code router
 */

export default {
  routes: [
    // Custom route for slug-based retrieval (must come first to avoid conflicts)
    {
      method: 'GET',
      path: '/custom-codes/slug/:slug',
      handler: 'custom-code.findBySlug',
      config: {
        auth: {
          scope: ['api::custom-code.custom-code.find']
        },
        policies: [],
        middlewares: [],
      },
    },
    // Default CRUD routes
    {
      method: 'GET',
      path: '/custom-codes',
      handler: 'custom-code.find',
      config: {
        auth: {
          scope: ['api::custom-code.custom-code.find']
        },
      },
    },
    {
      method: 'GET',
      path: '/custom-codes/:id',
      handler: 'custom-code.findOne',
      config: {
        auth: {
          scope: ['api::custom-code.custom-code.findOne']
        },
      },
    },
    {
      method: 'POST',
      path: '/custom-codes',
      handler: 'custom-code.create',
      config: {
        auth: {
          scope: ['api::custom-code.custom-code.create']
        },
      },
    },
    {
      method: 'PUT',
      path: '/custom-codes/:id',
      handler: 'custom-code.update',
      config: {
        auth: {
          scope: ['api::custom-code.custom-code.update']
        },
      },
    },
    {
      method: 'DELETE',
      path: '/custom-codes/:id',
      handler: 'custom-code.delete',
      config: {
        auth: {
          scope: ['api::custom-code.custom-code.delete']
        },
      },
    },
  ],
};
