const moment = require('moment');
const uniqid = require('uniqid');
const config = require('../config');
const {
  BadRequestError,
  NotExistError,
  UnauthorizedError
} = require('../errors');

module.exports = class OrganizationService {
  constructor(repository) {
    this.repository = repository;
  }

  async getOrganizationInfo(requestedId) {
    if (!requestedId) {
      throw new BadRequestError('get', 'Organization');
    }

    const organization = await this.repository.getOrganizationById(requestedId);
    if (!organization) {
      throw new NotExistError('Organization', requestedId);
    }

    return organization;
  }

  async refreshApiKey(requestedId, tokenOrganizationId) {
    if (!requestedId || !tokenOrganizationId) {
      throw new BadRequestError('refresh', 'apiKey');
    }
    if (requestedId != tokenOrganizationId) {
      throw new UnauthorizedError();
    }
    const organization = await this.repository.getOrganizationById(requestedId);
    if (!organization) {
      throw new NotExistError('Organization', requestedId);
    }
    const newKey = uniqid();
    await this.repository.updateOrganizationKey(requestedId, newKey);
    return newKey;
  }

  async updateBook(isbn, body, organizationId) {
    if (!isbn || !body.title || !body.authors || !body.year || !body.quantity) {
      throw new BadRequestError('update', 'book');
    }
    const bookId = this.repository.updateBook(
      isbn,
      body.title,
      body.authors,
      body.year,
      body.quantity,
      organizationId
    );
    return bookId;
  }

  async getOrganizationByName(name) {
    if (!name) {
      throw new BadRequestError('get', 'organization');
    }

    return await this.repository.getOrganizationByName(name);
  }

  async addNewOrganization(name) {
    if (!name) {
      throw new BadRequestError('add', 'organization');
    }

    return await this.repository.addNewOrganization(name, uniqid());
  }

  async getOrganizationAndValidateApiKey(apiKey) {
    if (!apiKey) {
      throw new UnauthorizedError();
    }
    const organization = await this.repository.getOrganizationByApiKey(apiKey);
    if (!organization) {
      throw new UnauthorizedError();
    }
    return organization.id;
  }
};
