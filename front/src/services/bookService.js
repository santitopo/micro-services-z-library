import { getJwt } from './authService';
import http from './httpService';

const apiEndpoint = '/books';

export function getBooks(name = '', page, limit) {
  const jwt = `Bearer ${getJwt()}`;
  return http.get(`${apiEndpoint}/?name=${name}&page=${page + 1}&limit=${limit}`, {
    headers: { Authorization: jwt }
  });
}

export function addBook(book) {
  const jwt = `Bearer ${getJwt()}`;
  return http.post(apiEndpoint, book, { headers: { Authorization: jwt } });
}

export function updateBook(bookId, updatedBook) {
  const jwt = `Bearer ${getJwt()}`;
  return http.put(
    `${apiEndpoint}/${bookId}/`,
    { ...updatedBook },
    { headers: { Authorization: jwt } }
  );
}

export function deleteBook(bookId) {
  const jwt = `Bearer ${getJwt()}`;
  return http.delete(`${apiEndpoint}/${bookId}`, { headers: { Authorization: jwt } });
}
