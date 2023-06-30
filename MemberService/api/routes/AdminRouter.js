const Router = require('koa-router');
const { success, mapDomainErrorToHttpResponse } = require('../httpFunctions');

module.exports = class AdminRouter {
  constructor(adminService) {
    this.router = new Router({
      prefix: '/admin'
    });
    this.adminService = adminService;
    this.init();
  }

  init() {
    this.router.get('/health', async (ctx, next) => {
      try {
        const result = await this.adminService.healthCheck();
        success(result, ctx);
      } catch (e) {
        mapDomainErrorToHttpResponse(e, ctx);
      }
    });

    this.routes = this.router.routes;
    this.allowedMethods = this.router.allowedMethods;
  }
};
