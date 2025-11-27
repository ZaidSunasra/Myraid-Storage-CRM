import notificationReminderCron from "./notification.cron.js";

const  registerCrons = ()  => {
    notificationReminderCron();
}

export default registerCrons;
