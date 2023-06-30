const { ApiError } = require('../errors');
const http = require('./httpMemberService');

async function getMemberById(memberId) {
  try {
    const response = await http.get(`/auth/member/${memberId}`);

    return response.data === '' ? null : response.data;
  } catch (e) {
    throw new ApiError(e.response.status, e.response.statusText);
  }
}

async function getMemberMailPreferences(member_id, organization_id) {
  try {
    const response = await http.get(
      `/auth/member/${member_id}/organization-preferences/${organization_id}`
    );

    return response.data === '' ? null : response.data;
  } catch (e) {
    throw new ApiError(e.response.status, e.response.statusText);
  }
}

module.exports = {
  getMemberById,
  getMemberMailPreferences
};
