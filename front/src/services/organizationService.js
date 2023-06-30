import { getJwt } from './authService';
import http from './httpService';

const apiEndpoint = '/organizations';

export function getOrganizationInfo(organizationId) {
  const jwt = `Bearer ${getJwt()}`;
  return http.get(`${apiEndpoint}/${organizationId}`, {
    headers: { Authorization: jwt }
  });
}

export function refreshApiKey(organizationId) {
  const jwt = `Bearer ${getJwt()}`;
  return http.get(`${apiEndpoint}/${organizationId}/refresh-key`, {
    headers: { Authorization: jwt }
  });
}

export function addOrganization(organizationInfo) {
  const jwt = `Bearer ${getJwt()}`;
  return http.post(apiEndpoint, organizationInfo, {
    headers: { Authorization: jwt }
  });
}
