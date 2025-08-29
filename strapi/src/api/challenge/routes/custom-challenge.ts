/**
 * Custom challenge routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/challenges/:slug',
      handler: 'challenge.findBySlug',
      config: {
        auth: false, // Public endpoint
        policies: [],
        middlewares: [],
      },
    },
  ],
};
