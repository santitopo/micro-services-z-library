const dotenv = require('dotenv');
// config() will read your .env file, parse the contents, assign it to process.env.
const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
module.exports = {
  apiPort: process.env.API_PORT,
  urlMemberService: process.env.URL_MEMBER_SERVICE,
  urlOrganizationService: process.env.URL_ORGANIZATION_SERVICE,
  urlBookService: process.env.URL_BOOK_SERVICE,
  urlReservationService: process.env.URL_RESERVATION_SERVICE,
  urlReviewService: process.env.URL_REVIEW_SERVICE
};
