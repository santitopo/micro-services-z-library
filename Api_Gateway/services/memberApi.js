const http = require('./httpMemberService');

async function registerMember(body) {
  const response = await http.post('/auth/registration', body);
  return response.data === '' ? null : response.data;
}

async function loginMember(body) {
  const response = await http.post('/auth/login', body);
  return response.data === '' ? null : response.data;
}

async function loginMemberOrganization(body) {
  const response = await http.post('/auth/login/organizations', body);
  return response.data === '' ? null : response.data;
}

async function invitation(body, headers) {
  const response = await http.post('/auth/invitation', body, {headers: {'authorization': headers.authorization}});
  return response.data === '' ? null : response.data;
}

async function registerThroughInvitation(body, headers) {
  const response = await http.post('/auth/invite-registration', body, {headers: {'authorization': headers.authorization}});
  return response.data === '' ? null : response.data;
}

async function mailNotificationsPreference (url, headers) {
  const response = await http.put(`${url}`, {}, {headers: {'authorization': headers.authorization}});
  return response.data === '' ? null : response.data;
}

async function alreadyRegisteredInvitation (headers) {
  const response = await http.post('/auth/invite-registration', {headers: {'authorization': headers.authorization}});
  return response.data === '' ? null : response.data;
}

module.exports = {
  registerMember,
  loginMember,
  loginMemberOrganization,
  invitation,
  registerThroughInvitation,
  mailNotificationsPreference,
  alreadyRegisteredInvitation
}