import http from './httpService';
import jwtDecode from 'jwt-decode';

const apiEndpoint = '/auth';

export function registerAdmin(userInfo) {
  return http.post(`${apiEndpoint}/registration`, userInfo);
}
export function registerThroughInvite(userInfo, jwt) {
  return http.post(`${apiEndpoint}/invite-registration`, userInfo, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });
}

export function acceptInvite(jwt) {
  return http.post(
    `${apiEndpoint}/invite-registration`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }
  );
}

export function inviteUser(userInfo) {
  const jwt = `Bearer ${getJwt()}`;
  return http.post(`${apiEndpoint}/invitation`, [userInfo], {
    headers: { Authorization: jwt }
  });
}

export function login(loginInfo) {
  return http.post(`${apiEndpoint}/login/organizations`, loginInfo);
}

export function changePreferences(organizationId, mail_preference) {
  const jwt = `Bearer ${getJwt()}`;
  return http.put(
    `${apiEndpoint}/preferences?organizationId=${organizationId}&mail_notifications=${mail_preference}`,
    null,
    {
      headers: { Authorization: jwt }
    }
  );
}

export async function loginWithOrganization(userInfo, organizationId) {
  const { data } = await http.post(`${apiEndpoint}/login`, {
    ...userInfo,
    organization_id: organizationId
  });
  localStorage.setItem('token', data.token);
  localStorage.setItem('name', data.userData.name);
  localStorage.setItem('lastname', data.userData.lastname);
  localStorage.setItem('email', data.userData.email);

  localStorage.setItem('mail_notifications', data.userData.mail_notifications || false);
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  localStorage.removeItem('email');
  localStorage.removeItem('lastname');
}

export function getJwt() {
  return localStorage.getItem('token');
}

export function getAccountInfo() {
  try {
    const jwt = localStorage.getItem('token');
    const jwtData = jwtDecode(jwt);
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const lastname = localStorage.getItem('lastname');
    const mail_notifications = localStorage.getItem('mail_notifications');
    return { ...jwtData, email, name, lastname, mail_notifications };
  } catch (ex) {
    return null;
  }
}
