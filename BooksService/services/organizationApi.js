const http = require('./httpService');
const config = require('../config');
const { ApiError } = require('../errors');

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

async function getOrganizationById(id) {
  try {
    const response = await http.get(
      `${config.organizationApi}/organizations/${id}`
    );
    return response.data === '' ? null : response.data;
  } catch (e) {
    throw new ApiError(e.response.status, e.response.statusText);
  }
}

module.exports = {
  getOrganizationByApiKey,
  getOrganizationById
};
