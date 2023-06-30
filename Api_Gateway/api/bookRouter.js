const Router = require("koa-router");
const { success, mapDomainErrorToHttpResponse } = require("../httpFunctions");
const bookApi = require('../services/bookApi')

const router = Router({
    prefix: '/books'
});

router.post('/', async (ctx, next) => {
    try {
        const result = await bookApi.createBook(ctx.request.body, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.put('/:id/', async (ctx, next) => {
    try {
        const result = await bookApi.updateBook(ctx.params.id, ctx.request.body, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.get('/', async (ctx, next) => {
    try {
        const result = await bookApi.paginatedBook(ctx.request.url, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.delete('/:id', async (ctx, next) => {
    try {
        const result = await bookApi.deleteBook(ctx.params.id, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})

router.get('/top-books', async (ctx, next) => {
    try {
        const result = await bookApi.topBooks(ctx.request.url, ctx.request.headers);
        success(result, ctx);
    }catch(e){
        mapDomainErrorToHttpResponse(e, ctx);
    }
})


module.exports = router