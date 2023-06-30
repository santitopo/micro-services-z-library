const config = require('./config/')
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const { logImportant } = require('./utils');
const { success } = require("./httpFunctions");

const memberRouter = require('./api/memberRouter')
const organizationRouter = require('./api/organizationRouter')
const bookRouter = require('./api/bookRouter')
const reservationRouter = require('./api/reservationRouter')
const reviewRouter = require('./api/reviewRouter')

const app = new Koa();
const router = new Router();
app.use(logger());

router.get('/', (ctx, next) => {
 success('API Gateway of zLibrary!', ctx);
});

app.use(bodyParser());
app.use(cors());

app.use(router.routes());
app.use(memberRouter.routes());
app.use(organizationRouter.routes());
app.use(bookRouter.routes());
app.use(reservationRouter.routes());
app.use(reviewRouter.routes());

app.use(router.allowedMethods());
app.use(memberRouter.allowedMethods());
app.use(organizationRouter.allowedMethods());
app.use(bookRouter.allowedMethods());
app.use(reservationRouter.allowedMethods());
app.use(reviewRouter.allowedMethods());

app.listen(config.apiPort, () =>
    logImportant(`App listening on port: ${config.apiPort}`)
);
