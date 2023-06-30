const http = require('./httpService');
const { ApiError } = require('../errors');

async function getOrganizationByName(name) {
  try {
    const response = await http.get('/organizations', { params: { name } });

    return response.data === '' ? null : response.data;
  } catch (e) {
    throw new ApiError(e.response.status, e.response.statusText);
  }
}

async function addOrganization(name) {
  try {
    const response = await http.post('/organizations', { name });

    return response.data === '' ? null : response.data;
  } catch (e) {
    throw new ApiError(e.response.status, e.response.statusText);
  }
}

async function getOrganizationById(id) {
  try {
    const response = await http.get(`/organizations/${id}`);
    return response.data === '' ? null : response.data;
  } catch (e) {
    throw new ApiError(e.response.status, e.response.statusText);
  }
}

module.exports = {
  getOrganizationByName,
  addOrganization,
  getOrganizationById
};
