const Router = require("koa-router");
const { success, mapDomainErrorToHttpResponse } = require("../httpFunctions");
const memberApi = require('../services/memberApi')

const router = Router({
    prefix: '/auth'
});

router.post('/registration', async (ctx, next) => {
    try {
        const result = await memberApi.registerMember(ctx.request.body);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.post('/login', async (ctx, next) => {
    try {
        const result = await memberApi.loginMember(ctx.request.body);       
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.post('/login/organizations', async (ctx, next) => {
    try {
        const result = await memberApi.loginMemberOrganization(ctx.request.body);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.post('/invite-registration', async (ctx, next) => {
    try {
        const result = await memberApi.registerThroughInvitation(ctx.request.body, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.post('/invitation', async (ctx, next) => {
    try {
        const result = await memberApi.invitation(ctx.request.body, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.put('/preferences', async (ctx, next) => {
    try {
        const result = await memberApi.mailNotificationsPreference(ctx.request.url, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.post('/invite-registration', async (ctx, next) => {
    try {
        const result = await memberApi.alreadyRegisteredInvitation(ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

module.exports = router