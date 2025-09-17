export default {
  async overview(ctx) {
    try {
      const [challengeResponse, customCodeResponse, tournamentResponse, submissionResponse] = await Promise.all([
        strapi.entityService.findPage('api::challenge.challenge', {
          page: 1,
          pageSize: 1,
          filters: {
            publishedAt: {
              $notNull: true,
            },
          },
        }),
        strapi.entityService.findPage('api::custom-code.custom-code', {
          page: 1,
          pageSize: 1,
          filters: {
            publishedAt: {
              $notNull: true,
            },
          },
        }),
        strapi.entityService.findPage('api::tournament.tournament', {
          page: 1,
          pageSize: 1,
          filters: {
            publishedAt: {
              $notNull: true,
            },
          },
        }),
        strapi.entityService.findPage('api::submission.submission', {
          page: 1,
          pageSize: 1,
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
      const submissionCount = submissionResponse.pagination?.total || 0;

      const stats = {
        challenges: challengeCount,
        customCodes: customCodeCount,
        tournaments: tournamentCount,
        submissions: submissionCount,
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
