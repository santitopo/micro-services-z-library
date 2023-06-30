const { Client } = require('pg');
const { Sequelize, Op } = require('sequelize');
const config = require('../config');
const { InternalError } = require('../errors');
const { killGracefully, logWarn } = require('../utils');
const Reservation = require('./models/Reservation');
const ReservationState = require('./models/ReservationState');
const moment = require('moment');
const bookApi = require('../services/bookApi');
const memberApi = require('../services/memberApi');

class Repository {
  constructor() {
    this.init();
  }

  async init() {
    // Create db if it doesn't exist already
    const dbName = config.dbName;
    this.connection = new Client({
      user: config.dbUser,
      host: config.dbHost,
      password: config.dbPassword,
      port: config.dbPort
    });
    try {
      await this.connection.connect();
      this.connection.query('SELECT datname FROM pg_database;', (err, res) => {
        if (err) {
          throw new Error('Fatal error querying for database');
        }
        if (res.rows.filter((d) => d.datname === dbName).length < 1) {
          this.connection.query(`CREATE DATABASE ${dbName};`, async (error) => {
            if (error) {
              throw new Error(`Error creating ${dbName} database`);
            }
            logWarn(`Creating ${dbName} database...`);
            this.createTables();
          });
        } else {
          logWarn('Creating tables in database...');
          this.createTables();
        }
      });
    } catch {
      killGracefully('Connecting to database failed');
    }
  }

  async createTables() {
    await this.connectDB();
    // connect to db

    this.sequelize = new Sequelize(
      config.dbName,
      config.dbUser,
      config.dbPassword,
      {
        host: config.dbHost,
        dialect: 'postgres',
        logging: false
      }
    );

    // init Models and add them with FK and PK restrictions to the db object
    this.Reservation = Reservation(this.sequelize);
    this.ReservationState = ReservationState(this.sequelize);

    await this.Reservation.sync({ force: false });
    await this.ReservationState.sync({ force: false });

    logWarn('Tables Created');
  }

  async connectDB() {
    await this.connection.end();
    this.connection = new Client({
      user: config.dbUser,
      host: config.dbHost,
      password: config.dbPassword,
      database: config.dbName,
      port: config.dbPort
    });
    await this.connection.connect();
  }

  async connectionCheck() {
    try {
      await this.connection.query('SELECT $1::text as status', ['ACK']);
      return 'Ok';
    } catch (e) {
      return 'Down';
    }
  }

  //RESERVATIONS
  async getReservations(book_id, dateFrom, dateTo) {
    const allReservations = await this.Reservation.findAll({
      where: {
        book_id
      }
    });

    const ret = [];
    const filteredReservations = allReservations
      .map((reservation) => reservation.dataValues)
      .filter((reservation) => {
        reservation.date.setHours(0, 0, 0, 0);

        const reservationFinishes = new Date(reservation.date.getTime());
        reservationFinishes.setDate(
          reservationFinishes.getDate() + parseInt(config.reservationLength)
        );

        if (dateFrom <= reservation.date && reservation.date <= dateTo) {
          return true;
        }

        if (reservation.date <= dateFrom && dateFrom <= reservationFinishes) {
          return true;
        }

        if (dateFrom <= reservationFinishes && reservationFinishes <= dateTo) {
          return true;
        }
        return false;
      });
    for (let i = 0; i < filteredReservations.length; i++) {
      const reservation = filteredReservations[i];
      const reservationFinishes = new Date(reservation.date.getTime());
      reservationFinishes.setDate(
        reservationFinishes.getDate() + parseInt(config.reservationLength)
      );
      const member = await memberApi.getMemberById(reservation.member_id);
      ret.push({
        member: member.email,
        date: moment(reservation.date).format('YYYY-MM-DD')
      });
    }
    return ret;
  }

  async addReservation(
    bookId,
    memberId,
    dateFrom,
    createdAt,
    updatedAt,
    grouping_uuid
  ) {
    try {
      const data = {
        book_id: bookId,
        member_id: memberId,
        date: dateFrom,
        grouping_uuid,
        createdAt,
        updatedAt
      };

      const reservation = await this.Reservation.create(data);
      return reservation;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async addStatusReservation(grouping_uuid, createdAt, updatedAt) {
    try {
      const dataState = {
        state: 'Future Reservation',
        reservation_grouping_uuid: grouping_uuid,
        createdAt,
        updatedAt
      };
      await this.ReservationState.create(dataState);
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getReservationUuidsByMemberIdInOrganization(
    member_id,
    organization_id
  ) {
    try {
      const organizationBooks = await bookApi.getBooksByOrganizationId(
        organization_id
      );
      const organizationBooksIds = organizationBooks.map((e) => parseInt(e.id));
      return await this.Reservation.findAll({
        raw: true,
        where: {
          member_id,
          book_id: { [Op.in]: [...organizationBooksIds] }
        },
        attributes: ['grouping_uuid'],
        group: ['grouping_uuid']
      });
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getReservationDaysByMemberIdInOrganization(member_id, organization_id) {
    try {
      const organizationBooks = await bookApi.getBooksByOrganizationId(
        organization_id
      );
      const organizationBooksIds = organizationBooks.map((e) => parseInt(e.id));
      return await this.Reservation.findAll({
        raw: true,
        where: {
          member_id,
          book_id: { [Op.in]: [...organizationBooksIds] }
        },
        attributes: ['book_id', 'member_id', 'grouping_uuid', 'date'],
        order: [['date', 'ASC']]
      });
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getReservationState(uuid) {
    try {
      const where = {};
      where.reservation_grouping_uuid = uuid;
      const reservationState = await this.ReservationState.findOne({
        raw: true,
        where
      });
      return reservationState ? reservationState.state : null;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async changeReservationState(uuid, newState) {
    try {
      const data = { state: newState };
      const reservationState = await this.ReservationState.update(data, {
        where: { reservation_grouping_uuid: uuid }
      });
      return reservationState.state;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getMemberReservationsOfBook(member_id, book_id) {
    try {
      const reservationUUIDs = await this.Reservation.findAll({
        raw: true,
        where: { member_id, book_id },
        attributes: ['grouping_uuid'],
        group: ['grouping_uuid']
      });
      return reservationUUIDs;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getAllNonFinishedReservationUuids() {
    try {
      const result = await this.ReservationState.findAll({
        where: {
          state: {
            [Op.notIn]: ['Finished']
          }
        },
        raw: true,
        attributes: ['reservation_grouping_uuid']
      });
      return result.map((rs) => rs.reservation_grouping_uuid);
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getAllActiveReservationUuids() {
    try {
      const result = await this.ReservationState.findAll({
        where: {
          state: 'Active'
        },
        raw: true,
        attributes: ['reservation_grouping_uuid']
      });
      return result.map((rs) => rs.reservation_grouping_uuid);
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getAllFutureAndActiveUuids() {
    try {
      const result = await this.ReservationState.findAll({
        where: {
          state: {
            [Op.in]: ['Active', 'Future Reservation']
          }
        },
        raw: true,
        attributes: ['reservation_grouping_uuid']
      });
      return result.map((rs) => rs.reservation_grouping_uuid);
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getAllActiveReservationDays(activeReservationUuids) {
    try {
      const reservationDays = await this.Reservation.findAll({
        where: {
          grouping_uuid: {
            [Op.in]: activeReservationUuids
          }
        },
        order: [['createdAt', 'ASC']]
      });
      return reservationDays;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getAllFutureAndActiveReservationDays(futureAndactiveReservationUuids) {
    try {
      const reservationDays = await this.Reservation.findAll({
        where: {
          grouping_uuid: {
            [Op.in]: futureAndactiveReservationUuids
          }
        },
        order: [['createdAt', 'ASC']]
      });
      return reservationDays;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getAllNonFinishedReservationsOfBooks(organizationBookIds) {
    try {
      const nonFinishedReservationUuids =
        await this.getAllNonFinishedReservationUuids();
      const reservationDays = await this.Reservation.findAll({
        where: {
          grouping_uuid: {
            [Op.in]: nonFinishedReservationUuids
          },
          book_id: {
            [Op.in]: organizationBookIds
          }
        }
      });
      return reservationDays;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getBookIdByUuid(bookUuid) {
    try {
      const book = await this.Reservation.findOne({
        where: { grouping_uuid: bookUuid },
        raw: true
      });
      return book.book_id;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getReservationsBetween(book_id, start, end) {
    return await this.Reservation.findAll({
      where: {
        book_id,
        date: {
          [Op.between]: [start, end]
        }
      },
      attributes: [
        'date',
        [Sequelize.fn('COUNT', Sequelize.col('date')), 'n_reservations']
      ],
      group: ['book_id', 'date']
    });
  }

  async getDatesUnAvailable(book_id, month, currentYear, maxQuantity) {
    const initialDate = new Date(parseInt(currentYear), parseInt(month) - 1, 1);
    const endDate = new Date(
      parseInt(currentYear),
      parseInt(month),
      config.reservationLength - 1,
      23,
      59
    );

    const reservationsByDayOfMonth = await this.getReservationsBetween(
      book_id,
      initialDate,
      endDate
    );

    return reservationsByDayOfMonth
      .filter((e) => e.dataValues.n_reservations >= maxQuantity)
      .map((e) => e.dataValues.date);
  }
}
module.exports = Repository;
