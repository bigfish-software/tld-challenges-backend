export default {
  routes: [
    {
      method: 'GET',
      path: '/rules',
      handler: 'rule.find',
      config: {
        auth: {
          scope: ['api::rule.rule.find']
        },
      },
    },
    {
      method: 'GET',
      path: '/rules/:id',
      handler: 'rule.findOne',
      config: {
        auth: {
          scope: ['api::rule.rule.findOne']
        },
      },
    },
    {
      method: 'POST',
      path: '/rules',
      handler: 'rule.create',
      config: {
        auth: {
          scope: ['api::rule.rule.create']
        },
      },
    },
    {
      method: 'PUT',
      path: '/rules/:id',
      handler: 'rule.update',
      config: {
        auth: {
          scope: ['api::rule.rule.update']
        },
      },
    },
    {
      method: 'DELETE',
      path: '/rules/:id',
      handler: 'rule.delete',
      config: {
        auth: {
          scope: ['api::rule.rule.delete']
        },
      },
    },
  ],
};
