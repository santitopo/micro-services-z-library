module.exports = class AdminService {
  constructor(repository, mailingService) {
    this.repository = repository;
    this.mailingService = mailingService;
  }

  async healthCheck() {
    const response = {
      uptime: `${Math.floor(process.uptime())}s`,
      system_status: 'Ok',
      db_healthCheck: await this.repository.connectionCheck(),
      mail_transport: await this.mailingService.checkConnection(),
      date: new Date()
    };
    return response;
  }
};
