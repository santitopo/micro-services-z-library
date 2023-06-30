const Router = require("koa-router");
const { success, mapDomainErrorToHttpResponse } = require("../httpFunctions");
const reservationApi = require('../services/reservationApi')

const router = Router({
    prefix: '/reservations'
});

router.post('/', async (ctx, next) => {
    try {
        const result = await reservationApi.createBook(ctx.request.body, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.get('/availability', async (ctx, next) => {
    try {
        const result = await reservationApi.getBookAvailability(ctx.request.url, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.put('/:uuid', async (ctx, next) => {
    try {
        const result = await reservationApi.updateBook(ctx.params.uuid, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.get('/student', async (ctx, next) => {
    try {
        const result = await reservationApi.getStudentReservations(ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.get('/', async (ctx, next) => {
    try {
        const result = await reservationApi.getOrganizationReservations(ctx.request.url, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.get('/external-api', async (ctx, next) => {
    try {
        const result = await reservationApi.getOrganizationReservationsExternal(ctx.request.url, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

module.exports = router