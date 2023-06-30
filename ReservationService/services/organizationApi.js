const http = require('./httpOrganizationService');
const { ApiError } = require('../errors');
const config = require('../config');

async function getOrganizationByApiKey(apiKey) {
  try {
    const response = await http.get(`${config.organizationApi}/organizations`, {
      params: { apiKey }
    });

    return response.data === '' ? null : response.data;
  } catch (e) {
    throw new ApiError(e.response.status, e.response.statusText);
  }
}

module.exports = {
  getOrganizationByApiKey
};
