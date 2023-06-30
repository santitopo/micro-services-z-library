const Router = require('koa-router');
const { NotImplementedError } = require('../../errors');
const { success, mapDomainErrorToHttpResponse } = require('../httpFunctions');
const { performance } = require('perf_hooks');
const { logDuration } = require('../../utils');

module.exports = class ReservationsRouter {
  constructor(reservationService, jwtService, authService) {
    this.router = new Router({
      prefix: '/reservations'
    });
    this.reservationService = reservationService;
    this.jwtService = jwtService;
    this.authService = authService;
    this.init();
  }

  init() {
    this.router
      .post('/', async (ctx, next) => {
        try {
          const decoded = this.jwtService.decode(ctx.request.headers);
          const result = await this.reservationService.addReservation(
            ctx.request.body,
            decoded.organizationId,
            decoded.memberId
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .get('/student', async (ctx, next) => {
        try {
          const decoded = this.jwtService.decode(ctx.request.headers);
          const result = await this.reservationService.getReservations(
            decoded.organizationId,
            decoded.memberId
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .put('/:uuid', async (ctx, next) => {
        try {
          const decoded = this.jwtService.decode(ctx.request.headers);
          const result = await this.reservationService.returnBook(
            ctx.params.uuid,
            decoded.organizationId
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .get('/', async (ctx, next) => {
        // Gets the reservations of an organization with reservation state 'Future Reservation', 'Active', 'Overdue'
        try {
          const decoded = this.jwtService.decodeAndFilterisAdmin(
            ctx.request.headers
          );
          const result = await this.reservationService.getAllReservationsByOrg(
            decoded.organizationId,
            ctx.query.organization_id
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .get('/availability', async (ctx, next) => {
        //
        try {
          const isbn = ctx.query.isbn;
          const month = ctx.query.month;
          const decoded = this.jwtService.decode(ctx.request.headers);
          const result = await this.reservationService.getAvailability(
            isbn,
            month,
            decoded.organizationId
          );
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      })
      .get('/external-api', async (ctx, next) => {
        const t0 = performance.now();
        const isbn = ctx.query.isbn;
        const dateFrom = ctx.query.dateFrom;
        const dateTo = ctx.query.dateTo;

        //Send the dates in format YYYY-MM-DD
        try {
          const organizationId =
            await this.authService.getOrganizationAndValidateApiKey(
              ctx.request.headers
            );

          const result =
            await this.reservationService.getReservationsExternalApi(
              organizationId,
              isbn,
              dateFrom,
              dateTo
            );
          const t1 = performance.now();
          logDuration('reservations', Math.floor(t1 - t0));
          success(result, ctx);
        } catch (e) {
          mapDomainErrorToHttpResponse(e, ctx);
        }
      });
  }
};
