const { MongoClient } = require('mongodb');
const cron = require('node-cron');

module.exports = {
    db: null,
    police:null,
    notification:null,
    users:null,


    async connect() {
        try {
            // db connection
            let client = new MongoClient(process.env.MONGO_URL);
            await client.connect();
            console.log('data base connection success');

            //db initilization 
            this.db = await client.db(process.env.MONGO_NAME)
            console.log('connected to ' + process.env.MONGO_NAME);

            //paths initilization
            this.police = await this.db.collection('policeman');
            this.notification = await this.db.collection('notification');
            this.users = await this.db.collection('users');

            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;

            const updateLeaveBalance = async () => {
                const users = await this.police.find().toArray();
                
                for(let user of users){
                    if(user.leave){
                        if(currentYear != user.leave.lastResetYear){
                            user.leave.casualLeave = 10;
                            user.leave.holidayPermission = 8;
                            user.leave.governmentHoliday = 4;
                            user.leave.restrictedHoliday = 2;
                            user.leave.paternityLeave = 15;
                            user.leave.medicalLeave = 20;
                            user.leave.lastResetYear = currentYear;
                            console.log("days updated")

                        }

                        if (currentMonth % 6 === 1 ) {
                            user.leave.earnedLeave = 30;
                        }
                        await this.police.updateOne({ bklid: user.bklid}, { $set: { leave: user.leave } });
                    }
                }
            }

            cron.schedule('0 0 * * *', updateLeaveBalance);

            console.log('paths initialized')
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }
}