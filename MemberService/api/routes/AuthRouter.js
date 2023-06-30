const Router = require('koa-router');
const { success, mapDomainErrorToHttpResponse } = require('../httpFunctions');

module.exports = class AuthRouter {
  constructor(authService) {
    this.router = new Router({
      prefix: '/auth'
    });
    this.authService = authService;
    this.init();
  }

  init() {
    this.router

      .post('/registration', async (ctx, next) => {
        try {
          const result = await this.authService.addAdminAndNewOrganization(
            ctx.request.body
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .post('/invite-registration', async (ctx, next) => {
        try {
          const decoded =
            this.authService.decodeAndFilterPendingRegistrationToken(
              ctx.request.headers
            );
          const result = await this.authService.addPendingRegistrationMember(
            ctx.request.body,
            decoded.memberId,
            decoded.organizationId
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .post('/invitation', async (ctx, next) => {
        try {
          const decoded = this.authService.decodeAndFilterisAdmin(
            ctx.request.headers
          );
          const results = await this.authService.invite(
            ctx.request.body,
            decoded.organizationId
          );
          success(results, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .post('/login/organizations', async (ctx, next) => {
        try {
          const result = await this.authService.getMemberOrganizations(
            ctx.request.body
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .post('/login', async (ctx, next) => {
        try {
          const jwt = await this.authService.login(ctx.request.body);
          success(jwt, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .put('/preferences', async (ctx, next) => {
        try {
          const mail_notifications = ctx.query.mail_notifications;
          const requested_organization_id = ctx.query.organizationId;

          const decoded = this.authService.decode(ctx.request.headers);

          const result = await this.authService.editMemberPreferences(
            decoded.memberId,
            decoded.organizationId,
            requested_organization_id,
            mail_notifications
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      //PRIVATE ROUTES
      .get('/member/:id', async (ctx, next) => {
        try {
          const result = await this.authService.getMemberById(ctx.params.id);
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .get(
        '/member/:memberId/organization-preferences/:organizationId',
        async (ctx, next) => {
          try {
            const result =
              await this.authService.getMemberOrganizationPreferences(
                ctx.params.memberId,
                ctx.params.organizationId
              );
            success(result, ctx);
          } catch (e) {
            mapDomainErrorToHttpResponse(e, ctx);
          }
        }
      );

    this.routes = this.router.routes;
    this.allowedMethods = this.router.allowedMethods;
  }
};
