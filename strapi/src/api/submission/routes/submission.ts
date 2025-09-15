export default {
  routes: [
    {
      method: 'GET',
      path: '/submissions',
      handler: 'submission.find',
      config: {
        auth: {
          scope: ['api::submission.submission.find']
        },
      },
    },
    {
      method: 'GET',
      path: '/submissions/:id',
      handler: 'submission.findOne',
      config: {
        auth: {
          scope: ['api::submission.submission.findOne']
        },
      },
    },
    {
      method: 'POST',
      path: '/submissions',
      handler: 'submission.create',
      config: {
        auth: {
          scope: ['api::submission.submission.create']
        },
        middlewares: ['global::rate-limit'],
      },
    },
    {
      method: 'PUT',
      path: '/submissions/:id',
      handler: 'submission.update',
      config: {
        auth: {
          scope: ['api::submission.submission.update']
        },
      },
    },
    {
      method: 'DELETE',
      path: '/submissions/:id',
      handler: 'submission.delete',
      config: {
        auth: {
          scope: ['api::submission.submission.delete']
        },
      },
    },
  ],
};
