const { ApiError } = require('../errors/');
const http = require('./httpBookService');

async function getBookById(memberId) {
  try {
    const response = await http.get(`/books/${memberId}`);

    return response.data === '' ? null : response.data;
  } catch (e) {
    throw new ApiError(e.response.status, e.response.statusText);
  }
}

async function getBookByIsbnAndOrgId(isbn, organizationId) {
  try {
    const response = await http.get(
      `/books/organization/${organizationId}?isbn=${isbn}`
    );

    return response.data === '' ? null : response.data;
  } catch (e) {
    throw new ApiError(e.response.status, e.response.statusText);
  }
}

async function getBooksByOrganizationId(orgId) {
  try {
    const response = await http.get(`/books/organization/${orgId}`);

    return response.data === '' ? null : response.data;
  } catch (e) {
    throw new ApiError(e.response.status, e.response.statusText);
  }
}

async function increaseTimesRead(isbn, organizationId) {
  try {
    const response = await http.post(
      `/books/${organizationId}/increase-times-read?isbn=${isbn}`
    );

    return response.data === '' ? null : response.data;
  } catch (e) {
    throw new ApiError(e.response.status, e.response.statusText);
  }
}

module.exports = {
  getBookById,
  getBooksByOrganizationId,
  getBookByIsbnAndOrgId,
  increaseTimesRead
};
