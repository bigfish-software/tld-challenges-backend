/**
 * stats controller
 */

export default {
  // Overview stats endpoint
  async overview(ctx) {
    try {
      // Get counts for all main content types using the same approach as the default list endpoints
      // Only count published content
      const [challengeResponse, customCodeResponse, tournamentResponse] = await Promise.all([
        strapi.entityService.findPage('api::challenge.challenge', {
          page: 1,
          pageSize: 1, // We only need the count, not the data
          filters: {
            publishedAt: {
              $notNull: true,
            },
          },
        }),
        strapi.entityService.findPage('api::custom-code.custom-code', {
          page: 1,
          pageSize: 1, // We only need the count, not the data
          filters: {
            publishedAt: {
              $notNull: true,
            },
          },
        }),
        strapi.entityService.findPage('api::tournament.tournament', {
          page: 1,
          pageSize: 1, // We only need the count, not the data
          filters: {
            publishedAt: {
              $notNull: true,
            },
          },
        }),
      ]);

      const challengeCount = challengeResponse.pagination?.total || 0;
      const customCodeCount = customCodeResponse.pagination?.total || 0;
      const tournamentCount = tournamentResponse.pagination?.total || 0;

      const stats = {
        challenges: challengeCount,
        customCodes: customCodeCount,
        tournaments: tournamentCount,
      };

      return ctx.send({
        data: stats,
        meta: {},
      });
    } catch (err) {
      console.error('Stats error:', err);
      return ctx.badRequest('Failed to fetch stats', { details: err.message });
    }
  },
};
