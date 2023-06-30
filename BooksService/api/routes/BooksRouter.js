const Router = require('koa-router');
const { NotImplementedError } = require('../../errors');
const { success, mapDomainErrorToHttpResponse } = require('../httpFunctions');
const { performance } = require('perf_hooks');
const { logDuration } = require('../../utils');

module.exports = class BooksRouter {
  constructor(booksService, jwtService, authService) {
    this.router = new Router({
      prefix: '/books'
    });
    this.booksService = booksService;
    this.jwtService = jwtService;
    this.authService = authService;
    this.init();
  }

  init() {
    this.router
      .post('/', async (ctx, next) => {
        //Access body with ctx.request.body
        try {
          //Retrieve organization id from Authtoken
          const decoded = this.jwtService.decodeAndFilterisAdmin(
            ctx.request.headers
          );
          const result = await this.booksService.addBook(
            ctx.request.body,
            decoded.organizationId
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .put('/:isbn', async (ctx, next) => {
        try {
          const decoded = this.jwtService.decodeAndFilterisAdmin(
            ctx.request.headers
          );
          const result = await this.booksService.updateBook(
            ctx.params.isbn,
            ctx.request.body,
            decoded.organizationId
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .delete('/:isbn', async (ctx, next) => {
        try {
          const decoded = this.jwtService.decodeAndFilterisAdmin(
            ctx.request.headers
          );
          const result = await this.booksService.deleteBook(
            ctx.params.isbn,
            decoded.organizationId
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .get('/', async (ctx, next) => {
        const name = ctx.query.name;
        const page = ctx.query.page;
        const limit = ctx.query.limit;
        const decoded = this.jwtService.decode(ctx.request.headers);
        try {
          const result = await this.booksService.getBooks(
            name,
            page,
            limit,
            decoded.organizationId
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .get('/top-books', async (ctx, next) => {
        const t0 = performance.now();
        const amount = ctx.query.amount;
        try {
          const organizationId =
            await this.authService.getOrganizationAndValidateApiKey(
              ctx.request.headers
            );
          const result = await this.booksService.getTopBooks(
            organizationId,
            amount
          );
          const t1 = performance.now();
          logDuration('top books', Math.floor(t1 - t0));
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      //PRIVATE ROUTES
      .get('/:bookId', async (ctx, next) => {
        try {
          const result = await this.booksService.getBookById(ctx.params.bookId);
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .get('/organization/:organizationId', async (ctx, next) => {
        try {
          let result;
          const isbn = ctx.query.isbn;
          if (isbn) {
            result = await this.booksService.getBookByIsbnAndOrgId(
              ctx.params.organizationId,
              isbn
            );
          } else {
            result = await this.booksService.getAllBooks(
              ctx.params.organizationId
            );
          }
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .post(
        '/organization/:organizationId/increase-times-read',
        async (ctx, next) => {
          try {
            const isbn = ctx.query.isbn;
            const result = await this.booksService.increaseTimesRead(
              ctx.params.organizationId,
              isbn
            );
            success(result, ctx);
          } catch (e) {
            mapDomainErrorToHttpResponse(e, ctx);
          }
        }
      );
  }
};
