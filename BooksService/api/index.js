const Koa = require('koa');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const config = require('../config');
const BooksRouter = require('./routes/BooksRouter');
const BookService = require('../services/booksService');
const { logImportant } = require('../utils');
const AuthService = require('../services/authService');
const JWTService = require('../services/jwtService');
const fs = require('fs');
const jwt = require('koa-jwt');
const publicKey = fs.readFileSync('secrets/public.key', 'utf8');

module.exports = class LibraryApi {
  constructor(repository) {
    //Init services
    this.booksService = new BookService(repository);
    this.jwtService = new JWTService();
    this.authService = new AuthService();

    //Init routers
    this.booksRouter = new BooksRouter(
      this.booksService,
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
        path: [
          /\/books\/top-books.*/,
          /\/books\/organization\/.*/,
          /\/books\/.*/
        ]
      })
    );

    //Use Routers
    this.app.use(this.booksRouter.router.routes());

    //Allow router methods
    this.app.use(this.booksRouter.router.allowedMethods());

    this.server = this.app.listen(config.apiPort, () =>
      logImportant(`App listening on port: ${config.apiPort}`)
    );
  }
};
