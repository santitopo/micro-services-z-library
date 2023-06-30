const { ApiError } = require('../errors');
const http = require('./httpReviewService');

async function existsReviewByBookAndMemberId(bookId, memberId) {
  try {
    const response = await http.get(
      `/reviews?book_id=${bookId}&member_id=${memberId}`
    );
    return response.data === '' ? null : response.data;
  } catch (e) {
    //Review doesn't exist
    return null;
  }
}

module.exports = {
  existsReviewByBookAndMemberId
};
