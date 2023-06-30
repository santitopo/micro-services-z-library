const cron = require('node-cron');
const everyDay = '0 1 * * *'; // runs every day at 01:00

module.exports = class SchedulerService {
  constructor(reservationService) {
    this.reservationService = reservationService;

    cron.schedule(everyDay, async () => {
      console.log(new Date(), 'Reservation Reminder Scheduler: Running Daily');
      await this.reservationService.notifyReservationsAboutToOverdue();
    });

    cron.schedule(everyDay, async () => {
      console.log(new Date(), 'Scheduler: Running Daily');
      await this.reservationService.updateStatusReservations();
    });
  }
};
