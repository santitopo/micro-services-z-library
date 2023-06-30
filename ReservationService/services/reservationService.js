const config = require('../config');
const moment = require('moment');
const uniqid = require('uniqid');
const {
  BadRequestError,
  NotAvailableBookError,
  UnauthorizedError
} = require('../errors');
const bookApi = require('./bookApi');
const reviewApi = require('./reviewApi');
const memberApi = require('./memberApi');

module.exports = class ReservationService {
  constructor(repository, bookService, mailingService) {
    this.repository = repository;
    this.bookService = bookService;
    this.mailingService = mailingService;
  }

  async addReservation(body, organizationId, memberId) {
    if (!body.dateFrom || !body.isbn || !organizationId) {
      throw new BadRequestError('add', 'reservation');
    }
    const createdAt = new Date();
    const updatedAt = new Date();

    const reserveMonth = parseInt(body.dateFrom.toString().slice(5, 7));
    const reserveDay = parseInt(body.dateFrom.toString().slice(8, 10));
    const getAvailability = await this.getAvailability(
      body.isbn,
      reserveMonth,
      organizationId
    );
    const availableDate = getAvailability.availableDate.filter(
      (d) => d == reserveDay
    );
    const book = await bookApi.getBookByIsbnAndOrgId(body.isbn, organizationId);

    if (availableDate.length > 0) {
      bookApi.increaseTimesRead(body.isbn, organizationId);

      const times = config.reservationLength;

      const dateObj = moment(body.dateFrom).toDate();
      const grouping_uuid = uniqid();
      await this.repository.addStatusReservation(
        grouping_uuid,
        createdAt,
        updatedAt
      );

      for (let i = 0; i < times; i++) {
        let dateIterator = new Date(dateObj.getTime());
        dateIterator.setUTCHours(12);
        const increaseDate = dateIterator.setDate(dateIterator.getDate() + i);

        await this.repository.addReservation(
          book.id,
          memberId,
          increaseDate,
          createdAt,
          updatedAt,
          grouping_uuid
        );
      }
      return times;
    } else {
      throw new NotAvailableBookError('add', 'reservation', body.dateFrom);
    }
  }

  async getReservations(organizationId, memberId) {
    const result = [];
    const booksInfo = [];
    const memberReservationDays =
      await this.repository.getReservationDaysByMemberIdInOrganization(
        memberId,
        organizationId
      );
    const memberReservationUuids =
      await this.repository.getReservationUuidsByMemberIdInOrganization(
        memberId,
        organizationId
      );

    for (let i = 0; i < memberReservationUuids.length; i++) {
      const uuid = memberReservationUuids[i].grouping_uuid;
      const reservationDays = memberReservationDays.filter(
        (reservationDay) => reservationDay.grouping_uuid === uuid
      );
      const bookId = reservationDays[0].book_id;
      if (!booksInfo[bookId]) {
        booksInfo[bookId] = await bookApi.getBookById(bookId);
      }
      const reservationState = await this.repository.getReservationState(uuid);

      let canReview =
        reservationState && reservationState === 'Finished' ? true : false;
      //validates review doesn't exist
      if (canReview) {
        const prevReview = await reviewApi.existsReviewByBookAndMemberId(
          bookId,
          memberId
        );
        if (prevReview) {
          canReview = false;
        }
      }
      const reservation = {
        grouping_uuid: uuid,
        book: {
          title: booksInfo[bookId].title,
          isbn: booksInfo[bookId].isbn,
          authors: booksInfo[bookId].authors
        },
        state: reservationState,
        canReview,
        dateFrom: reservationDays[0].date,
        dateTo: reservationDays[reservationDays.length - 1].date
      };
      //they are ordered by date, so take index 0, and last index as from-to
      result.push(reservation);
    }
    result.sort((r1, r2) => (r1.dateFrom > r2.dateFrom ? 1 : -1));
    return result;
  }

  async getAllReservationsByOrg(decodedOrganizationId, organizationId) {
    if (!organizationId) {
      throw new BadRequestError('get', 'reservations');
    }
    if (decodedOrganizationId != organizationId) {
      throw new UnauthorizedError();
    }

    const organizationBooks = await bookApi.getBooksByOrganizationId(
      organizationId
    );
    const organizationBooksIds = organizationBooks.map((book) => book.id);
    const reservations =
      await this.repository.getAllNonFinishedReservationsOfBooks(
        organizationBooksIds
      );

    if (reservations.length === 0) {
      return [];
    }

    const reservationsByDates = [];
    const filteredReservations = reservations;

    for (let i = 0; i < filteredReservations.length; i++) {
      const reservation = filteredReservations[i];
      const reservationState = await this.repository.getReservationState(
        reservation.grouping_uuid
      );
      const member = await memberApi.getMemberById(reservation.member_id);
      const bookData = await bookApi.getBookById(reservation.book_id);
      reservationsByDates.push({
        grouping_uuid: reservation.grouping_uuid,
        book: {
          title: bookData.title,
          isbn: bookData.isbn,
          authors: bookData.authors
        },
        member: member.email,
        state: reservationState,
        dateFrom: moment(reservation.date).format('YYYY-MM-DD'),
        dateTo: moment(
          reservation.date.setDate(
            reservation.date.getDate() + (config.reservationLength - 1)
          )
        ).format('YYYY-MM-DD')
      });
    }

    let uuids = [];
    let reservesByOrganization = [];
    reservesByOrganization.push(reservationsByDates[0]);
    uuids.push(reservationsByDates[0].grouping_uuid);

    for (const reservationsByDate of reservationsByDates) {
      const notExist = uuids.indexOf(reservationsByDate.grouping_uuid);
      if (notExist === -1) {
        reservesByOrganization.push(reservationsByDate);
        uuids.push(reservationsByDate.grouping_uuid);
      }
    }

    return reservesByOrganization;
  }

  async returnBook(uuid, organizationId) {
    const reservationState = await this.repository.getReservationState(uuid);
    const bookId = await this.repository.getBookIdByUuid(uuid);
    const bookData = await bookApi.getBookById(bookId);
    if (!reservationState) {
      throw new BadRequestError('put', 'reservation state');
    }
    if (bookData.organization_id != organizationId) {
      throw new UnauthorizedError();
    }
    return await this.repository.changeReservationState(uuid, 'Finished');
  }

  async getReservationsExternalApi(organizationId, isbn, dateFrom, dateTo) {
    if (!organizationId || !isbn || !dateFrom || !dateTo) {
      throw new BadRequestError('get', 'book reservations');
    }

    const dateObjFrom = moment(dateFrom);
    const dateObjTo = moment(dateTo);

    if (dateObjFrom > dateObjTo) {
      throw new BadRequestError('get', 'book reservations');
    }

    const searchedBook = await bookApi.getBookByIsbnAndOrgId(
      isbn,
      organizationId
    );

    if (!searchedBook) {
      throw new NotExistError('book', isbn);
    }

    const reservations = await this.repository.getReservations(
      searchedBook.id,
      dateObjFrom,
      dateObjTo
    );
    return reservations;
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  async getAvailability(isbn, month, organizationId) {
    if (!isbn || !month || month < 1 || month > 12) {
      throw new BadRequestError('get', 'book availability');
    }
    //First addition
    const book = await bookApi.getBookByIsbnAndOrgId(isbn, organizationId);
    if (!book || book.is_deleted) {
      throw new NotExistError('book', isbn);
    }
    const currentYear = new Date().getFullYear();
    //Second change
    const datesUnAvailable = await this.repository.getDatesUnAvailable(
      book.id,
      month,
      currentYear,
      book.quantity
    );

    const availableDates = [
      ...Array(this.daysInMonth(month, currentYear) + 1).keys()
    ];

    datesUnAvailable.forEach((date) => {
      for (let i = 0; i > -1 * config.reservationLength; i--) {
        let dateIterator = new Date(date.getTime());
        dateIterator.setDate(dateIterator.getDate() + i);
        let dateIteratorDay = dateIterator.getDate();
        let dateIteratorMonth = dateIterator.getMonth();
        if (dateIteratorMonth + 1 != month) {
          continue;
        }
        availableDates[dateIteratorDay] = -1;
      }
    });

    return {
      year: currentYear,
      month,
      availableDate: availableDates.filter((e) => e > 0)
    };
  }

  // Scheduled methods

  isLessThanOneDayFromNow(date1) {
    const now = new Date(new Date().toDateString());
    const compareTo = new Date(new Date(date1).toDateString());
    const diffInMs = compareTo - now;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours <= 24;
  }

  bindReminderBodyText(title, dateTo, name, dateFrom, grouping_uuid) {
    return `Estimado ${name},
    Este es un recordatorio de que su reserva vence mañana.
    Detalles de la reserva:
    Libro: ${title}
    Fecha de Comienzo: ${dateFrom}
    Fecha de Vencimiento de la Reserva: ${dateTo}
    Id Reserva: ${grouping_uuid}
    
    Saludos,
    ZLibrary
    `;
  }

  async notifyReservationsAboutToOverdue() {
    try {
      const activeReservationUuids =
        await this.repository.getAllActiveReservationUuids();
      const activeReservations =
        await this.repository.getAllActiveReservationDays(
          activeReservationUuids
        );

      const mustNotifyReservationArray = [];

      for (
        let i = 0;
        i < activeReservations.length;
        i = i + parseInt(config.reservationLength)
      ) {
        const reservation = activeReservations[i];
        const dateFrom = new Date(reservation.date.getTime());
        const dateTo = moment(
          reservation.date.setDate(
            reservation.date.getDate() + (config.reservationLength - 1)
          )
        );
        if (dateTo > Date.now() && this.isLessThanOneDayFromNow(dateTo)) {
          const bookData = await bookApi.getBookById(reservation.book_id);
          const member = await memberApi.getMemberById(reservation.member_id);
          const mailPreferences = await memberApi.getMemberMailPreferences(
            reservation.member_id,
            bookData.organization_id
          );

          if (mailPreferences) {
            mustNotifyReservationArray.push({
              grouping_uuid: reservation.grouping_uuid,
              title: bookData.title,
              email: member.email,
              name: member.name,
              dateFrom: moment(dateFrom).format('YYYY-MM-DD'),
              dateTo: dateTo.format('YYYY-MM-DD')
            });
          }
        }
      }

      mustNotifyReservationArray.forEach((reservation) => {
        console.log(`Sending reminder email to ${reservation.email}`);
        this.mailingService.sendMail(
          reservation.email,
          this.bindReminderBodyText(
            reservation.title,
            reservation.dateTo,
            reservation.name,
            reservation.dateFrom,
            reservation.grouping_uuid
          ),
          `Recordatorio de Vencimiento de Reserva`
        );
      });

      console.log('Daily reservation reminder ran successfully');
    } catch (e) {
      console.log('Daily reservation reminder ran with errors', e);
    }
  }

  async updateStatusReservations() {
    try {
      const currentDate = new Date();

      const futureAndActivereservationUuids =
        await this.repository.getAllFutureAndActiveUuids();
      const futureAndActiveReservations =
        await this.repository.getAllFutureAndActiveReservationDays(
          futureAndActivereservationUuids
        );
      for (
        let i = 0;
        i < futureAndActiveReservations.length;
        i = i + parseInt(config.reservationLength)
      ) {
        const reservation = futureAndActiveReservations[i];
        const dateFrom = new Date(reservation.date.getTime());
        const dateTo = new Date(
          reservation.date.setDate(
            reservation.date.getDate() + (config.reservationLength - 1)
          )
        );
        if (dateFrom <= currentDate && currentDate <= dateTo) {
          const newState = 'Active';
          await this.repository.changeReservationState(
            reservation.grouping_uuid,
            newState
          );
        }
        if (dateFrom < currentDate && dateTo < currentDate) {
          const newState = 'Overdue';
          await this.repository.changeReservationState(
            reservation.grouping_uuid,
            newState
          );
        }
      }

      console.log('Daily status update ran successfully');
    } catch (e) {
      console.log('Daily status update ran with errors', e);
    }
  }
};
