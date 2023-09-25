const { valid } = require("joi");
const bcrypt = require('bcryptjs');



module.exports = {
    async getAllPoliceMan(req, res) {
        try {
            let userData = await this.police.find({ bklid: req.user.bklid }).toArray();
            if(userData[0].accesstype === "admin" ){
                let data = await this.police.find().toArray();
                res.json({data:data,bklid : req.user.bklid})
            }else{
                res.status(401).json({message : "your are not Admin. "})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "error fetching police mans" })
        }
    },
    async getPoliceMan(req, res) {
        try {
            console.log(req.user.bklid)
            let data = await this.police.find({ bklid: req.user.bklid }).toArray();
            res.json(data)
            // console.log(data)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "error fetching police mans" })
        }
    },

    async createPoliceMan(req, res) {
        try {
            // await this.police.insertOne({ ...req.body, createdDate: new Date(), editedDate: new Date() })

        const user = req.body; 
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
          console.log(req.body)
        let password = await bcrypt.hash(`${user.phoneNumber}`, await bcrypt.genSalt(2)); 
          await this.police.insertOne({
            name: user.name,
            password: password, 
            bklid: `${user.bklid}`,
            accesstype: user.accesstype,
            policetype: user.policetype,
            isActive: user.isActive=='true'?true:false,
            request: [],
            leave: leave,
            DOB: user.dob ? user.dob : "",
            email: user.email ? user.email : "",
            phoneNumber: `${user.phoneNumber}`?`${user.phoneNumber}`:"",
            alternateNumber: `${user.alternateNumber}`?`${user.alternateNumber}`:"",
            COY: user.COY?user.COY:"",
            address: user.email?user.email:"",
            createdDate: new Date(),
            editedDate: new Date(),
          });
            res.json({ message: "police created" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "error creating policeman" })
        }
    },

    async deletePoliceMan(req, res) { 
        try {
            console.log(req.body.bklid)
            await this.police.deleteOne({ bklid : `${req.body.bklid}` })
            res.json({ message: "police deleted" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "error deleting policeman" })
        }
    },
    async getPoliceManWithBklid(req,res){
        try {
            const bklid = req.params.bklid;
            console.log(req.params.bklid)
            let data = await this.police.find({ bklid: bklid }).toArray();
            console.log(data)
            res.json({data:data,bklid: req.user.bklid})
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "error fetching police mans" })
        }

    },
    async updateDetails(req,res){
        try{
            const data = req.body;
            console.log(data)
            console.log("policetype "+ data.policetype)
            const result = await this.police.updateOne({bklid : data.bklid},{$set : {
                name : data.name,
                email : data.email,
                address : data.address,
                COY : data.COY,
                DOB : data.DOB,
                policetype : data.policetype,
                phoneNumber : data.phoneNumber,
                isActive : data.isActive=='true'?true:false,
                accesstype : data.accesstype,
                alternateNumber : data.alternateNumber,
                'leave.casualLeave' : parseInt(data.casual),
                'leave.medicalLeave' :  parseInt(data.medical),    
                'leave.holidayPermission' : parseInt(data.permission),
                'leave.governmentHoliday' : parseInt(data.government),
                'leave.restrictedHoliday' : parseInt(data.restricted),
                'leave.earnedLeave' : parseInt(data.earned),
                'leave.paternityLeave' : parseInt(data.paternity),
                editedDate : new Date(),
            }})
            console.log("updated"+result )
            res.status(200).json({message:"updated successfully"});
        }catch(error){
            console.log(error)
            res.status(500).json({ message: "error updating data" })
        }
    },
    async passwordChange(req,res){
        try {
            const oldPassword = req.body.oldPassword;
            const newPassword = req.body.newPassword;
            console.log(oldPassword, newPassword);
            const user = await this.police.findOne({ bklid: req.user.bklid });
            const isValid = await bcrypt.compare(oldPassword, user.password);

            const samePwCheck = await bcrypt.compare(newPassword, user.password);
            if (samePwCheck) {
                // Passwords are the same, send a response and return
                return res.status(200).json({ same : true, message: "Try different Password, Old and New password are same." });
            }

            if (isValid) {
                const password = await bcrypt.hash(newPassword, await bcrypt.genSalt(2));
                await this.police.updateOne({ bklid: req.user.bklid }, { $set: { password: password } });
                return res.status(200).json({ message: "New password Updated successfully" });
            } else {
                return res.status(200).json({ message: "Something wrong new Password not Updated" });
            }
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Error updating password." });
            }    
    },
}
