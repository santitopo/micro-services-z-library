const { Client } = require('pg');
const { Sequelize, Op } = require('sequelize');
const config = require('../config');
const { InternalError, NotExistError } = require('../errors');
const { killGracefully, logWarn } = require('../utils');
const Book = require('./models/Book');

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
    this.Book = Book(this.sequelize);
    await this.Book.sync({ force: false });

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

  async addBook(isbn, title, authors, year, quantity, organization_id) {
    try {
      const book = await this.Book.create({
        isbn,
        title,
        authors,
        year,
        quantity,
        times_read: 0,
        organization_id,
        is_deleted: false
      });
      return book;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async addDeletedBook(isbn, title, authors, year, quantity, organization_id) {
    try {
      const updatedBook = await this.Book.update(
        {
          title,
          authors,
          year,
          quantity,
          is_deleted: false
        },
        {
          where: {
            isbn,
            organization_id
          }
        }
      );
      return updatedBook;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getBook(isbn, organization_id) {
    try {
      const result = await this.Book.findOne({
        where: {
          isbn,
          organization_id
        }
      });
      return result;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getBookById(bookId) {
    try {
      return await this.Book.findOne({ where: { id: bookId } });
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getAllBooks(organizationId) {
    try {
      return await this.Book.findAll({
        where: { organization_id: organizationId, is_deleted: false }
      });
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async searchNameAuthor(organizationId, name) {
    try {
      const result = await this.Book.findAll({
        where: {
          organization_id: organizationId,
          is_deleted: false,
          [Op.or]: [
            { title: { [Op.substring]: name } },
            { authors: { [Op.substring]: name } }
          ]
        },
        order: [['title', 'ASC']]
      });
      return result.map((b) => b.dataValues);
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getBooksOrderedByReservations(organization_id, amount) {
    try {
      const books = await this.Book.findAll({
        where: { organization_id, is_deleted: false },
        limit: amount,
        order: [['times_read', 'DESC']]
      });
      return books.map((e) => e.dataValues);
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async updateBook(isbn, title, authors, year, quantity, organization_id) {
    try {
      const dataBook = { title, authors, year, quantity };

      await this.Book.update(dataBook, { where: { isbn, organization_id } });

      return isbn;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async increaseTimesRead(isbn, organization_id) {
    try {
      const book = await this.getBook(isbn, organization_id);
      const timesRead = book.times_read + 1;
      const data = { times_read: timesRead };

      if (book) {
        await this.Book.update(data, { where: { isbn, organization_id } });
      }
      return timesRead;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async deleteBook(isbn, organization_id) {
    try {
      const book = await this.getBook(isbn, organization_id);
      if (book) {
        const data = {
          is_deleted: true
        };
        await this.Book.update(data, {
          where: { isbn, organization_id }
        });
      }
      return isbn;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getBooksByOrganizationId(organizationId) {
    try {
      const where = {};
      where.organization_id = organizationId;
      return await this.Book.findAll({
        raw: true,
        where
      });
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }
}
module.exports = Repository;
