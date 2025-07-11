import notificationReminderCron from "./notification.cron";

const  registerCrons = ()  => {
    notificationReminderCron();
}

export default registerCrons;
