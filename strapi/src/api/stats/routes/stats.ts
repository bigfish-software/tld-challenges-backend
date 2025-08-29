/**
 * stats router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/stats/overview',
      handler: 'stats.overview',
      config: {
        auth: {
          scope: ['api::challenge.challenge.find'] // Use existing scope from challenge
        },
        policies: [],
        middlewares: [],
      },
    },
  ],
};
