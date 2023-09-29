// const { users } = require('../shared/mongo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports = {
    async insertData(req, res) {
        try {
          const users = req.body; 
          const leave = {
            casualLeave: 10,
            holidayPermission: 8,
            governmentHoliday: 4,
            restrictedHoliday: 2,
            earnedLeave: 30,
            medicalLeave: 20,
            paternityLeave: 15,
            lastResetYear: new Date().getFullYear(),
          };
        //   console.log(req.body)

        const usersToInsert = await Promise.all(users.map(async (user) => {
            let password = await bcrypt.hash(`${user.phoneNumber}`, await bcrypt.genSalt(2));
            return {
              name: user.name,
              password: password, 
              bklid: `${user.bklid}`,
              accesstype: "normal",
              policetype: user.policetype,
              isActive: true,
              request: [],
              leave: leave,
              DOB: user.dob ? user.dob : "",
              email: user.email ? user.email : "",
              phoneNumber: `${user.phoneNumber}`?`${user.phoneNumber}`:"",
              alternateNumber: `${user.alternateNumber}`?`${user.alternateNumber}`:"",
              COY: user.COY?user.COY:"",
              address: "",
              createdDate: new Date(),
              editedDate: new Date(),
            };
          }));
      
          await this.police.insertMany(usersToInsert);
      
          res.json({ message: "Users created successfully" });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error creating users" });
        }
      },
      

    async signUp(req, res) {
        try {
            const name = req.body.name;
            const bklid = req.body.bklid;
            let password = req.body.password;
            password = await bcrypt.hash(password, await bcrypt.genSalt(2));

            const lastResetYear = new Date().getFullYear();

            const leave = {
                casualLeave: 10,
                holidayPermission: 8,
                governmentHoliday: 4,
                restrictedHoliday: 2,
                earnedLeave: 30,
                medicalLeave: 20,
                paternityLeave: 15,
                lastResetYear : lastResetYear,
            };

            await this.police.insertOne(
                {
                    name : name, 
                    password : password,
                    bklid : bklid,
                    accesstype : "admin",
                    policetype : req.body.policetype?req.body.policetype:"",
                    isActive: true,
                    request : [],
                    leave : leave,
                    DOB : req.body.dob ? req.body.dob : '',
                    email : req.body.email ? req.body.email : '',
                    phoneNumber : req.body.phoneNumber?req.body.phoneNumber:'',
                    address : req.body.address?req.body.address:"",
                    alternateNumber : req.body.alternateNumber?req.body.alternateNumber:'',
                    COY : req.body.COY?req.body.COY:"",
                    
                    createdDate: new Date(),
                    editedDate: new Date(),
                })
            res.json({ message: "user created success" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "error creating the user" });
        }
    },

    async signIn(req, res) {
        try {
            console.log(req.body)
            let { bklid, password } = req.body;
            let isUser = await this.police.findOne({ bklid: bklid });
            
            //user validation
            if (!isUser) {
                return res.status(401).json({ message: "user not found", link: "http://localhost:3001/auth/signup", isUser : false })
            }

            //pass validtion
            console.log(isUser.password)
            let isValid = await bcrypt.compare(password, isUser.password);
            if (!isValid) {
                return res.status(401).json({ message: "password or bklid is incorrect", valid : false, isUser : true })
            }

            if (!isUser.isActive) {
                return res.status(401).json({ message: "user is not active" , isActive : false, isUser: true, valid : true})
            } else {
                let token = await jwt.sign({ bklid: isUser.bklid }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRY })
                return res.json({ message: "Login Success", token , accesstype : isUser.accesstype })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "error while signin" });
        }
    },

    //delete user
    async deleteUser(req, res) {
        try {
            await this.police.deleteOne({ bklid: req.body.bklid })
            res.json({ message: "user deleted" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "error deleting the user" });
        }
    },  

    //deactivate user
    async deActivateUser(req, res) {
        try {
            await this.users.findOneAndUpdate({ bklid: req.body.bklid }, { $set: { isActive: false, editedDate: new Date() } })
            res.json({ message: "user disabled" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "error deactivating the user" });
        }
    },

    // activate user
    async activateUser(req, res) {
        try {
            await this.users.findOneAndUpdate({ bklid: req.body.bklid }, { $set: { isActive: true, editedDate: new Date() } })
            res.json({ message: "user enabled" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "error activating the user" });
        }
    },
    

}