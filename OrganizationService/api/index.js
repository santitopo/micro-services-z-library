const Koa = require('koa');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const config = require('../config');
const OrganizationsRouter = require('./routes/OrganizationsRouter');
const { logImportant } = require('../utils');
const JWTService = require('../services/jwtService');
const fs = require('fs');
const jwt = require('koa-jwt');
const OrganizationService = require('../services/organizationService');
const publicKey = fs.readFileSync('secrets/public.key', 'utf8');

module.exports = class LibraryApi {
  constructor(repository) {
    //Init services
    this.organizationsService = new OrganizationService(repository);
    this.jwtService = new JWTService();

    //Init routers
    this.organizationsRouter = new OrganizationsRouter(
      this.jwtService,
      this.organizationsService
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
        path: [
          '/organizations',
          /\/organizations\/.*/,
          /\/organizations\?apiKey\=.*/
        ]
      })
    );

    //Use Routers
    this.app.use(this.organizationsRouter.router.routes());

    //Allow router methods
    this.app.use(this.organizationsRouter.router.allowedMethods());

    this.server = this.app.listen(config.apiPort, () =>
      logImportant(`App listening on port: ${config.apiPort}`)
    );
  }
};
