/**
 * Custom creator routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/creators/:slug',
      handler: 'creator.findBySlug',
      config: {
        auth: false, // Public endpoint
        policies: [],
        middlewares: [],
      },
    },
  ],
};
