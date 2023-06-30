import { getJwt } from './authService';
import http from './httpService';

const apiEndpoint = '/reservations';

export function getReserves() {
  const jwt = `Bearer ${getJwt()}`;
  return http.get(`${apiEndpoint}/student`, {
    headers: { Authorization: jwt }
  });
}

export function reserveBook(reserveInfo) {
  const jwt = `Bearer ${getJwt()}`;
  return http.post(apiEndpoint, reserveInfo, {
    headers: { Authorization: jwt }
  });
}

export function getAllReserves(organizationId) {
  const jwt = `Bearer ${getJwt()}`;
  return http.get(`${apiEndpoint}?organization_id=${organizationId}`, {
    headers: { Authorization: jwt }
  });
}

export function getAvailability(isbn, month) {
  const jwt = `Bearer ${getJwt()}`;
  return http.get(`${apiEndpoint}/availability?month=${month}&isbn=${isbn}`, {
    headers: { Authorization: jwt }
  });
}

export function finishReserve(reserveId) {
  const jwt = `Bearer ${getJwt()}`;
  return http.put(
    `${apiEndpoint}/${reserveId}`,
    {},
    {
      headers: { Authorization: jwt }
    }
  );
}
