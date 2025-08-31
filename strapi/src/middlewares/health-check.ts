/**
 * Health check middleware for Docker container health monitoring
 */

export default (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.url === '/_health') {
      try {
        // Check database connection
        await strapi.db.connection.raw('SELECT 1');
        
        ctx.status = 200;
        ctx.body = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          services: {
            database: 'connected',
            strapi: 'running'
          }
        };
      } catch (error) {
        ctx.status = 503;
        ctx.body = {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error.message,
          services: {
            database: 'disconnected',
            strapi: 'running'
          }
        };
      }
    } else {
      await next();
    }
  };
};
