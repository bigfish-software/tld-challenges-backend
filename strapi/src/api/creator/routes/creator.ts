export default {
  routes: [
    {
      method: 'GET',
      path: '/creators/slug/:slug',
      handler: 'creator.findBySlug',
      config: {
        auth: {
          scope: ['api::creator.creator.find']
        },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/creators',
      handler: 'creator.find',
      config: {
        auth: {
          scope: ['api::creator.creator.find']
        },
      },
    },
    {
      method: 'GET',
      path: '/creators/:id',
      handler: 'creator.findOne',
      config: {
        auth: {
          scope: ['api::creator.creator.findOne']
        },
      },
    },
    {
      method: 'POST',
      path: '/creators',
      handler: 'creator.create',
      config: {
        auth: {
          scope: ['api::creator.creator.create']
        },
      },
    },
    {
      method: 'PUT',
      path: '/creators/:id',
      handler: 'creator.update',
      config: {
        auth: {
          scope: ['api::creator.creator.update']
        },
      },
    },
    {
      method: 'DELETE',
      path: '/creators/:id',
      handler: 'creator.delete',
      config: {
        auth: {
          scope: ['api::creator.creator.delete']
        },
      },
    },
  ],
};
