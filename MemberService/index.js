//Create the data access instance
//Create the API instance and pass data access over
require('newrelic');
const MemberApi = require('./api');
const Repository = require('./repository');
const { terminate } = require('./utils');

const repository = new Repository();
const api = new MemberApi(repository);

const exitHandler = terminate(api.server, {
  coredump: false,
  timeout: 500
});

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
