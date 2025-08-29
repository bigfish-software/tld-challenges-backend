/**
 * idea router
 */

export default {
  routes: [
    // Default CRUD routes
    {
      method: 'GET',
      path: '/ideas',
      handler: 'idea.find',
      config: {
        auth: {
          scope: ['api::idea.idea.find']
        },
      },
    },
    {
      method: 'GET',
      path: '/ideas/:id',
      handler: 'idea.findOne',
      config: {
        auth: {
          scope: ['api::idea.idea.findOne']
        },
      },
    },
    {
      method: 'POST',
      path: '/ideas',
      handler: 'idea.create',
      config: {
        auth: {
          scope: ['api::idea.idea.create']
        },
        middlewares: ['global::rate-limit'],
      },
    },
    {
      method: 'PUT',
      path: '/ideas/:id',
      handler: 'idea.update',
      config: {
        auth: {
          scope: ['api::idea.idea.update']
        },
      },
    },
    {
      method: 'DELETE',
      path: '/ideas/:id',
      handler: 'idea.delete',
      config: {
        auth: {
          scope: ['api::idea.idea.delete']
        },
      },
    },
  ],
};
