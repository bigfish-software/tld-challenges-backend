/**
 * Custom tournament routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/tournaments/:slug',
      handler: 'tournament.findBySlug',
      config: {
        auth: false, // Public endpoint
        policies: [],
        middlewares: [],
      },
    },
  ],
};
