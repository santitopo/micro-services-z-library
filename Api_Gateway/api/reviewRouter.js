const Router = require("koa-router");
const { success, mapDomainErrorToHttpResponse } = require("../httpFunctions");
const reviewApi = require('../services/reviewApi')

const router = Router({
    prefix: '/reviews'
});

router.post('/', async (ctx, next) => {
    try {
        const result = await reviewApi.registerReview(ctx.request.body, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.delete('/:isbn', async (ctx, next) => {
    try {
        const result = await reviewApi.deleteBooksReview(ctx.params.isbn, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.get('/:isbn', async (ctx, next) => {
    try {
        const result = await reviewApi.getBooksReview(ctx.params.isbn, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

module.exports = router