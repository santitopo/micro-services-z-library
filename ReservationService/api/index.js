const Koa = require('koa');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const config = require('../config');
const ReservationsRouter = require('./routes/ReservationsRouter');
const { logImportant } = require('../utils');
const JWTService = require('../services/jwtService');
const AuthService = require('../services/authService');
const SchedulerService = require('../services/schedulerService');
const MailingService = require('../services/mailingService');
const fs = require('fs');
const jwt = require('koa-jwt');
const ReservationService = require('../services/reservationService');
const publicKey = fs.readFileSync('secrets/public.key', 'utf8');

module.exports = class LibraryApi {
  constructor(repository) {
    //Init services
    this.mailingService = new MailingService();
    this.reservationService = new ReservationService(
      repository,
      this.booksService,
      this.mailingService
    );
    this.jwtService = new JWTService();
    this.authService = new AuthService();
    this.schedulerService = new SchedulerService(this.reservationService);

    //Init routers
    this.reservationsRouter = new ReservationsRouter(
      this.reservationService,
      this.jwtService,
      this.authService
    );
    this.app = new Koa();
    this.init();
  }
  init() {
    this.app.use(bodyParser());
    this.app.use(
      logger({
        transporter: (str, args) => {
          fs.appendFile('./cloudwatch/logs.txt', `${str} \n`, function (err) {
            if (err) throw err;
          });
        }
      })
    );
    this.app.use(cors());
    this.app.use(
      jwt({ secret: publicKey, algorithms: ['RS256'] }).unless({
        path: [/\/reservations\/external-api.*/]
      })
    );

    //Use Routers
    this.app.use(this.reservationsRouter.router.routes());

    //Allow router methods
    this.app.use(this.reservationsRouter.router.allowedMethods());

    this.server = this.app.listen(config.apiPort, () =>
      logImportant(`App listening on port: ${config.apiPort}`)
    );
  }
};
