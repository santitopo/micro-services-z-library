const dotenv = require('dotenv');
// config() will read your .env file, parse the contents, assign it to process.env.
const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
module.exports = {
  apiPort: process.env.API_PORT,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  tokenLife: process.env.TOKEN_LIFE,
  reservationLength: process.env.RESERVATION_DAYS_LENGTH,
  mailUser: process.env.MAIL_USER,
  mailPassword: process.env.MAIL_PASSWORD,
  webDomain: process.env.WEB_DOMAIN,
  reviewCancellationDays: process.env.REVIEW_CANCELLATION_DAYS,
  memberApi: process.env.MEMBER_API
};
