const Router = require("koa-router");
const { success, mapDomainErrorToHttpResponse } = require("../httpFunctions");
const organizationApi = require('../services/organizationApi')

const router = Router({
    prefix: '/organizations'
});

router.get('/:id', async (ctx, next) => {
    try {
        const result = await organizationApi.getOrganizationInfo(ctx.params.id);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.get('/:id/refresh-key', async (ctx, next) => {
    try {
        const result = await organizationApi.refreshApiKey(ctx.params.id, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.get('/', async (ctx, next) => {
    try {
        const result = await organizationApi.getOrgIdWithApiKey(ctx.request.url);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

module.exports = router