const Router = require('koa-router');
const { mapDomainErrorToHttpResponse, success } = require('../httpFunctions');

module.exports = class OrganizationsRouter {
  constructor(jwtService, organizationService) {
    this.router = new Router({
      prefix: '/organizations'
    });
    this.jwtService = jwtService;
    this.organizationService = organizationService;
    this.init();
  }

  init() {
    this.router
      .post('/', async (ctx, next) => {
        //Fetch the query strings using ctx.query
        try {
          const result = await this.organizationService.addNewOrganization(
            ctx.request.body.name
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .get('/:id', async (ctx, next) => {
        //Fetch the query strings using ctx.query
        try {
          const result = await this.organizationService.getOrganizationInfo(
            ctx.params.id
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .get('/:id/refresh-key', async (ctx, next) => {
        try {
          const decoded = this.jwtService.decodeAndFilterisAdmin(
            ctx.request.headers
          );
          const result = await this.organizationService.refreshApiKey(
            ctx.params.id,
            decoded.organizationId
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      // Private methods
      .get('/', async (ctx, next) => {
        try {
          var result;

          if (ctx.query.name) {
            result = await this.organizationService.getOrganizationByName(
              ctx.query.name
            );
          } else if (ctx.query.apiKey) {
            result =
              await this.organizationService.getOrganizationAndValidateApiKey(
                ctx.query.apiKey
              );
          }

          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      });
  }
};
