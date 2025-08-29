/**
 * tournament router
 */

export default {
  routes: [
    // Custom route for slug-based retrieval (must come first to avoid conflicts)
    {
      method: 'GET',
      path: '/tournaments/slug/:slug',
      handler: 'tournament.findBySlug',
      config: {
        auth: {
          scope: ['api::tournament.tournament.find']
        },
        policies: [],
        middlewares: [],
      },
    },
    // Default CRUD routes
    {
      method: 'GET',
      path: '/tournaments',
      handler: 'tournament.find',
      config: {
        auth: {
          scope: ['api::tournament.tournament.find']
        },
      },
    },
    {
      method: 'GET',
      path: '/tournaments/:id',
      handler: 'tournament.findOne',
      config: {
        auth: {
          scope: ['api::tournament.tournament.findOne']
        },
      },
    },
    {
      method: 'POST',
      path: '/tournaments',
      handler: 'tournament.create',
      config: {
        auth: {
          scope: ['api::tournament.tournament.create']
        },
      },
    },
    {
      method: 'PUT',
      path: '/tournaments/:id',
      handler: 'tournament.update',
      config: {
        auth: {
          scope: ['api::tournament.tournament.update']
        },
      },
    },
    {
      method: 'DELETE',
      path: '/tournaments/:id',
      handler: 'tournament.delete',
      config: {
        auth: {
          scope: ['api::tournament.tournament.delete']
        },
      },
    },
  ],
};
