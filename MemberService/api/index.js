const Koa = require('koa');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const config = require('../config');
const AuthRouter = require('./routes/AuthRouter');
const { logImportant } = require('../utils');
const AuthService = require('../services/authService');
const JWTService = require('../services/jwtService');
const fs = require('fs');
const jwt = require('koa-jwt');
const MailingService = require('../services/mailingService');
const AdminRouter = require('./routes/AdminRouter');
const AdminService = require('../services/adminService');
const publicKey = fs.readFileSync('secrets/public.key', 'utf8');

module.exports = class LibraryApi {
  constructor(repository) {
    //Init services
    this.mailingService = new MailingService();
    this.adminService = new AdminService(repository, this.mailingService);
    this.jwtService = new JWTService();
    this.authService = new AuthService(
      repository,
      this.jwtService,
      this.mailingService
    );

    //Init routers
    this.authRouter = new AuthRouter(this.authService);
    this.adminRouter = new AdminRouter(this.adminService);

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
        path: [
          '/auth/registration',
          '/auth/login',
          '/auth/login/organizations',
          '/admin/health',
          /\/auth\/member\/.*/
        ]
      })
    );

    //Use Routers
    this.app.use(this.authRouter.router.routes());
    this.app.use(this.adminRouter.router.routes());

    //Allow router methods
    this.app.use(this.authRouter.router.allowedMethods());
    this.app.use(this.adminRouter.router.allowedMethods());

    this.server = this.app.listen(config.apiPort, () =>
      logImportant(`App listening on port: ${config.apiPort}`)
    );
  }
};
