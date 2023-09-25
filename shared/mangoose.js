const mongoose = require('mongoose');
const cron = require('node-cron');

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.MONGO_NAME,
});

const Schema = mongoose.Schema;

const policemanSchema = new Schema({
  bklid: String,
  leave: {
    lastResetYear: Number,
    casualLeave: Number,
    holidayPermission: Number,
    governmentHoliday: Number,
    restrictedHoliday: Number,
    paternityLeave: Number,
    medicalLeave: Number,
    earnedLeave: Number,
  },
});

// Define a schema for the notification collection
const notificationSchema = new Schema({
  // Define your notification schema fields here
});

// Create models from the schemas
const PoliceModel = mongoose.model('policeman', policemanSchema);
const NotificationModel = mongoose.model('notification', notificationSchema);

module.exports = {
  db: mongoose.connection,
  police: PoliceModel,
  notification: NotificationModel,

  async connect() {
    try {
      await mongoose.connection.once('open', () => {
        console.log('Database connection success');

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const updateLeaveBalance = async () => {
          const users = await PoliceModel.find().exec();

          for (let user of users) {
            if (user.leave) {
              if (currentYear != user.leave.lastResetYear) {
                user.leave.casualLeave = 10;
                user.leave.holidayPermission = 8;
                user.leave.governmentHoliday = 4;
                user.leave.restrictedHoliday = 2;
                user.leave.paternityLeave = 15;
                user.leave.medicalLeave = 20;
                user.leave.lastResetYear = currentYear;
                console.log('Days updated');
              }

              if (currentMonth % 6 === 1) {
                user.leave.earnedLeave = 30;
              }
              await PoliceModel.updateOne(
                { bklid: user.bklid },
                { $set: { leave: user.leave } }
              );
            }
          }
        };

        cron.schedule('0 0 * * *', updateLeaveBalance);

        console.log('Paths initialized');
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
};
