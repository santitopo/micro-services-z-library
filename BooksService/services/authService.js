const {
  BadRequestError,
  AlreadyExistsError,
  ResourceNotFoundError,
  UnauthorizedError,
  NotExistError
} = require('../errors');
const organizationApi = require('./organizationApi');

module.exports = class AuthService {
  constructor() {}

  async getOrganizationAndValidateApiKey(headers) {
    const apiKey = headers.authorization;
    if (!apiKey) {
      throw new UnauthorizedError();
    }
    const organizationId = await organizationApi.getOrganizationByApiKey(
      apiKey
    );

    if (!organizationId) {
      throw new UnauthorizedError();
    }
    return organizationId;
  }
};
