const http = require('./httpBookService');

async function createBook (body, headers) {
    const response = await http.post('/books/', body,{ headers: {'authorization': headers.authorization } });
    return response.data === '' ? null : response.data;
}

async function updateBook (bookId, body, headers) {
    const response = await http.put(`/books/${bookId}/`, body,{ headers: {'authorization': headers.authorization } });
    return response.data === '' ? null : response.data;
}

async function paginatedBook (url, headers) {
    const response = await http.get(`${url}`, {headers: {'authorization': headers.authorization}});
    return response.data === '' ? null : response.data;
}

async function deleteBook (bookId, headers) {
    const response = await http.delete(`/books/${bookId}`, {headers: {'authorization': headers.authorization}});
    return response.data === '' ? null : response.data;
}

async function topBooks (url, headers) {
    const response = await http.get(`${url}`, {headers: {'authorization': headers.authorization}});
    return response.data === '' ? null : response.data;
}

module.exports = {
    createBook,
    updateBook,
    paginatedBook,
    deleteBook,
    topBooks
}