const http = require('./httpService');
const config = require('../config');
const { ApiError } = require('../errors');

// async function getReservationBetween(book_id, initialDate, endDate) {
//   try {
//     const response = await http.get(
//       `${config.reservationApi}/reservations/${book_id}/availability`,
//       {
//         params: { initialDate, endDate }
//       }
//     );

//     return response.data;
//   } catch (e) {
//     throw new ApiError(e.response.status, e.response.statusText);
//   }
// }

module.exports = {
  // getReservationBetween
};
