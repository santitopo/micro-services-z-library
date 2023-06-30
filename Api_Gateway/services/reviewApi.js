const http = require('./httpReviewService');

async function registerReview (body, headers) {
    const response = await http.post('/reviews/', body, {headers: {'authorization': headers.authorization}});
    return response.data === '' ? null : response.data;
}

async function deleteBooksReview (bookIsbn, headers) {
    const response = await http.delete(`/reviews/${bookIsbn}`, {headers: {'authorization': headers.authorization}});
    return response.data === '' ? null : response.data;
}

async function getBooksReview (bookIsbn, headers) {
    const response = await http.get(`/reviews/${bookIsbn}`, {headers: {'authorization': headers.authorization}});
    return response.data === '' ? null : response.data;
}

module.exports = {
    registerReview,
    deleteBooksReview,
    getBooksReview
}