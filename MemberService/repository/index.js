const { Client } = require('pg');
const { Sequelize } = require('sequelize');
const config = require('../config');
const { InternalError, NotExistError } = require('../errors');
const { killGracefully, logWarn } = require('../utils');
const Member = require('./models/Member');
const MemberOrganization = require('./models/MemberOrganization');
const organizationApi = require('../services/organizationApi');

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
    this.Member = Member(this.sequelize);
    this.MemberOrganization = MemberOrganization(this.sequelize);

    await this.Member.sync({ force: false });
    await this.MemberOrganization.sync({ force: false });

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

  //MEMBERS
  async getMemberByEmail(email) {
    try {
      const member = await this.Member.findOne({ where: { email } });
      return member;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getMemberById(id) {
    try {
      const member = await this.Member.findOne({ where: { id } });
      return member;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async addMember(name, lastname, email, password) {
    try {
      const member = await this.Member.create({
        name,
        lastname,
        email,
        password
      });
      return member.id;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async updateMember(name, lastname, email, password, id) {
    try {
      const member = await this.Member.update(
        {
          name,
          lastname,
          email,
          password
        },
        { where: { id } }
      );
      return member.id;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async preRegisterNewMember(email, organization_id, isAdmin) {
    try {
      const member = await this.Member.create({
        email
      });
      await this.MemberOrganization.create({
        organization_id,
        member_id: member.id,
        is_admin: isAdmin ? isAdmin : false,
        pending_invite: true,
        mail_notifications: false
      });
      return member.id;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async preRegisterExistentMember(member_id, organization_id, isAdmin) {
    try {
      await this.MemberOrganization.create({
        organization_id,
        member_id,
        is_admin: isAdmin ? isAdmin : false,
        pending_invite: true,
        mail_notifications: false
      });
      return member_id;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getOrganizationsByMember(member_id) {
    try {
      const memberOrganizations = await this.MemberOrganization.findAll({
        where: { member_id }
      });
      const ret = [];
      for (let i = 0; i < memberOrganizations.length; i++) {
        let org = await organizationApi.getOrganizationById(
          memberOrganizations[i].dataValues.organization_id
        );
        ret.push({
          name: org.name,
          id: org.id,
          pending_invite: memberOrganizations[i].dataValues.pending_invite
        });
      }
      return ret;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  //MEMBER ORGANIZATIONS
  async getMemberOrganization(organization_id, member_id) {
    try {
      const organization = await this.MemberOrganization.findOne({
        where: { organization_id, member_id }
      });
      return organization;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async addMemberOrganization(
    organization_id,
    member_id,
    is_admin,
    pending_invite
  ) {
    try {
      const organization = await this.MemberOrganization.create({
        organization_id,
        member_id,
        is_admin,
        pending_invite,
        mail_notifications: false
      });
      return organization.member_id;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async acceptInviteOnMemberOrganization(member_id, organization_id) {
    try {
      await this.MemberOrganization.update(
        {
          pending_invite: false
        },
        {
          where: {
            member_id,
            organization_id
          }
        }
      );
      return member_id;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async updateMemberOrganizationPreferences(
    organization_id,
    member_id,
    mail_notifications
  ) {
    try {
      await this.MemberOrganization.update(
        {
          mail_notifications: mail_notifications ? true : false
        },
        {
          where: {
            member_id,
            organization_id
          }
        }
      );
      return organization_id;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }

  async getMemberOrganizationPreferences(member_id, organization_id) {
    try {
      const organization = await this.MemberOrganization.findOne({
        where: { organization_id, member_id }
      });
      return organization.mail_notifications;
    } catch (e) {
      throw new InternalError('Database Error');
    }
  }
}
module.exports = Repository;
