/**
 * faq router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/faqs',
      handler: 'faq.find',
      config: {
        auth: {
          scope: ['api::faq.faq.find']
        },
      },
    },
    {
      method: 'GET',
      path: '/faqs/:id',
      handler: 'faq.findOne',
      config: {
        auth: {
          scope: ['api::faq.faq.findOne']
        },
      },
    },
    {
      method: 'POST',
      path: '/faqs',
      handler: 'faq.create',
      config: {
        auth: {
          scope: ['api::faq.faq.create']
        },
      },
    },
    {
      method: 'PUT',
      path: '/faqs/:id',
      handler: 'faq.update',
      config: {
        auth: {
          scope: ['api::faq.faq.update']
        },
      },
    },
    {
      method: 'DELETE',
      path: '/faqs/:id',
      handler: 'faq.delete',
      config: {
        auth: {
          scope: ['api::faq.faq.delete']
        },
      },
    },
  ],
};
