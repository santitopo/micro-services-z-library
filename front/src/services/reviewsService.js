import { getJwt } from './authService';
import http from './httpService';

const apiEndpoint = '/reviews';

export function getReviews(isbn) {
  const jwt = `Bearer ${getJwt()}`;
  return http.get(`${apiEndpoint}/${isbn}`, {
    headers: { Authorization: jwt }
  });
}

export function addReview(reviewData) {
  const jwt = `Bearer ${getJwt()}`;
  return http.post(apiEndpoint, reviewData, {
    headers: { Authorization: jwt }
  });
}

export function deleteReview(isbn) {
  const jwt = `Bearer ${getJwt()}`;
  return http.delete(`${apiEndpoint}/${isbn}`, {
    headers: { Authorization: jwt }
  });
}
