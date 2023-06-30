class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ResourceNotFoundError extends DomainError {
  constructor(resource, query) {
    super(`Resource ${resource} was not found.`);
    this.data = { resource, query };
  }
}

class BadRequestError extends DomainError {
  constructor(operation, resource) {
    super(`Bad data was provided to ${operation} ${resource}.`);
    this.data = { operation, resource };
  }
}

class AlreadyExistsError extends DomainError {
  constructor(resource, identifier) {
    super(`Resource ${resource} identified by ${identifier} already exists.`);
    this.data = { resource, identifier };
  }
}

class NotAvailableBookError extends DomainError {
  constructor(resource, identifier, date) {
    super(`Resource ${resource} identified by ${identifier} is not available for reservation on ${date}`);
    this.data = { resource, identifier };
  }
}

class NotExistError extends DomainError {
  constructor(resource, identifier) {
    super(`Resource ${resource} identified by ${identifier} not exists.`);
    this.data = { resource, identifier };
  }
}

class UnauthorizedError extends DomainError {
  constructor(token, apiKey) {
    super(`Authentication Error`);
    this.data = { token, apiKey };
  }
}

class ForbiddenError extends DomainError {
  constructor(token, apiKey) {
    super(`You lack the permissions.`);
    this.data = { token, apiKey };
  }
}

class NotImplementedError extends DomainError {
  constructor(endpointName) {
    super(`Endpoint ${endpointName} not yet implemented`);
    this.data = { endpointName };
  }
}

class InternalError extends DomainError {
  constructor(error) {
    if (typeof error === 'string' || error instanceof String) {
      super(error);
    } else {
      super(error.message);
    }
    this.data = { error };
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  AlreadyExistsError,
  NotAvailableBookError,
  NotExistError,
  ResourceNotFoundError,
  ForbiddenError,
  NotImplementedError,
  InternalError,
};
