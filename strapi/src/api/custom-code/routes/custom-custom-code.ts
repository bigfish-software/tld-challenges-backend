/**
 * Custom custom-code routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/custom-codes/:slug',
      handler: 'custom-code.findBySlug',
      config: {
        auth: false, // Public endpoint
        policies: [],
        middlewares: [],
      },
    },
  ],
};
