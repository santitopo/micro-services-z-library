const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  InternalError,
  NotImplementedError,
  AlreadyExistsError,
  ResourceNotFoundError,
  NotExistError,
  NotAvailableBookError,
  ApiError
} = require('../errors');

const success = (result, ctx) => {
  ctx.response.body = result;
  ctx.response.status = 200;
};

const mapDomainErrorToHttpResponse = (error, ctx) => {
  const response = { body: error.message };
  if (error instanceof ApiError) {
    response.status = error.data.status;
  } else if (error instanceof BadRequestError) {
    response.status = 400;
  } else if (error instanceof UnauthorizedError) {
    response.status = 401;
  } else if (error instanceof ForbiddenError) {
    response.status = 403;
  } else if (
    error instanceof ResourceNotFoundError ||
    error instanceof NotExistError
  ) {
    response.status = 404;
  } else if (error instanceof AlreadyExistsError) {
    response.status = 409;
  } else if (error instanceof InternalError) {
    response.status = 500;
  } else if (error instanceof NotImplementedError) {
    response.status = 501;
  } else if (error instanceof NotAvailableBookError) {
    response.status = 404;
  }
  //... here would go the rest of the mapping
  else {
    //default case
    response.body = 'Unknown error';
    response.status = 500;
  }
  ctx.response.body = response.body;
  ctx.response.status = response.status;
};

module.exports = { success, mapDomainErrorToHttpResponse };
