const { Client } = require('pg');
const { Sequelize } = require('sequelize');
const config = require('../config');
const { InternalError } = require('../errors');
const { killGracefully, logWarn } = require('../utils');
const Organization = require('./models/Organization');

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
    this.Organization = Organization(this.sequelize);

    await this.Organization.sync({ force: false });

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

  async getOrganizationByName(name) {
    try {
      const organization = await this.Organization.findOne({ where: { name } });
      return organization;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getOrganizationByApiKey(api_key) {
    try {
      const organization = await this.Organization.findOne({
        where: { api_key }
      });
      return organization;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getOrganizationById(id) {
    try {
      const organization = await this.Organization.findOne({ where: { id } });
      return organization;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async addNewOrganization(name, api_key) {
    try {
      const organization = await this.Organization.create({
        name,
        api_key
      });
      return organization.id;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async updateOrganizationKey(organizationId, api_key) {
    try {
      const organization = await this.Organization.update(
        {
          api_key
        },
        {
          where: {
            id: organizationId
          }
        }
      );
      return organization.id;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async organizationExists(id) {
    try {
      const organization = await this.Organization.findOne({
        where: {
          id
        }
      });
      return organization ? true : false;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getOrganizationByName(name) {
    try {
      const organization = await this.Organization.findOne({
        where: {
          name
        }
      });
      return organization;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }
}
module.exports = Repository;
