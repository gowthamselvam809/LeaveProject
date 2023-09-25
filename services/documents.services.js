

module.exports ={
    async getAllDocuments(req,res){
        try {
            const documents = await this.police.find().toArray();
            res.json(documents);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching documents" });
        }
    },

    async getDocuments(req,res){
        try {
            const documents = await this.police.find({ buckleId : req.user.bklid });
            res.json(documents);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching documents" });
        }
    },
    
    async pushRequest(req, res) {
        try {
            let requestId = ('IR'+ Math.floor(Math.random()*100)+Math.random().toString(36).substr(2, 4)).toUpperCase();
            const requestData = {
                requestId: requestId,
                originalName:  req.file ? req.file.originalname : null,
                fileName: req.file ? req.file.filename : null,
                filePath: req.file ? req.file.path : null,
                date: new Date(),
                fromDate : req.body.fromDate,
                toDate:req.body.toDate,
                leaveType:req.body.leaveType,
                reason: req.body.reason,
                bklid : req.user.bklid,
                status : 'pending',
                info : "",
                updateStatus : '',
                remarks : '',
            };
            console.log(requestData)
            const name = await this.police.findOne({bklid : req.user.bklid});

            const result = await this.police.findOneAndUpdate(
            { bklid : req.user.bklid }, 
            { $push: { request: requestData } },
            { new: true } // Return the updated document
            );

            if (!result) {
              return res.status(404).json({ error: "Document not found" });
            }else{
              await this.notification.insertOne({
                name : name.name, 
                bklid : req.user.bklid, 
                requestId : requestId, 
                for : "admin", 
                adminSeen : false,
                employeeSeen : false,
                fromDate : req.body.fromDate,
                toDate : req.body.toDate,
                mDate : req.body.toDate,
                status : 'pending',
                date : new Date(),
                adminDate : new Date(),
              });
            }
            res.status(200).json({ message: "Request data pushed successfully" });
          } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error pushing request data" });
          }
    },
    async approveRequest(req,res){
        try {
            const fromDate = req.body.fromDate;
            const toDate = req.body.toDate;
            const requestId = req.body.requestId;
            const bklid = req.body.bklid;
            const dayCount = req.body.dayCount;
            const leaveType = req.body.leaveType;
            console.log(bklid,requestId,fromDate)
            let request = await this.police.find({ bklid: req.body.bklid }).toArray();

            
            if(request && request.length > 0){
              let curLeave;
              switch (leaveType){
                case 'casualLeave' :
                  curLeave = request[0].leave.casualLeave - dayCount;
                  await this.police.updateOne({bklid : bklid},{$set : {'leave.casualLeave' : curLeave}})
                  break;
                case 'medicalLeave' :
                  curLeave = request[0].leave.medicalLeave - dayCount;
                  await this.police.updateOne({bklid : bklid},{$set : {'leave.medicalLeave' : curLeave}})
                  break;
                case 'holidayPermission' :
                  curLeave = request[0].leave.holidayPermission - dayCount;
                  await this.police.updateOne({bklid : bklid},{$set : {'leave.holidayPermission' : curLeave}})
                  break;
                case 'governmentHoliday' :
                  curLeave = request[0].leave.governmentHoliday - dayCount;
                  await this.police.updateOne({bklid : bklid},{$set : {'leave.governmentHoliday' : curLeave}})
                  break;
                case 'restrictedHoliday' :
                  curLeave = request[0].leave.restrictedHoliday - dayCount;
                  await this.police.updateOne({bklid : bklid},{$set : {'leave.restrictedHoliday' : curLeave}})
                  break;
                case 'earnedLeave' :
                  curLeave = request[0].leave.earnedLeave - dayCount;
                  await this.police.updateOne({bklid : bklid},{$set : {'leave.earnedLeave' : curLeave}})
                  break;
                case 'paternityLeave' :
                  curLeave = request[0].leave.paternityLeave - dayCount;
                  await this.police.updateOne({bklid : bklid},{$set : {'leave.paternityLeave' : curLeave}})
                  break;
              }

              const updatedRequests = request[0].request.map(requestItem => {
                if (requestItem.requestId === requestId){
                  requestItem.status = "Approved";
                  requestItem.fromDate = fromDate; 
                  requestItem.toDate = toDate;
                  requestItem.info = `Your Leave Request has been Approved for ${dayCount} Days`;
                  requestItem.updateStatus = new Date();
                }
                return requestItem;
              });
              await this.police.updateOne(
                { bklid: bklid},
                { $set: { request: updatedRequests} }
              );
              console.log('File paths updated successfully.');
              await this.notification.updateOne({
                bklid : bklid, 
                requestId : requestId 
              },
                {
                  $set :{
                  for : "normal",
                  mDate : new Date(),
                  status : 'Approved',
                }
              });

              res.status(200).json({message : "path approved and succesfully"})
            } else {
              console.log('Document not found');
            }
          } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Error modifying request data' });
          }
    },
    async denyRequest(req,res){
      try{
        const requestId = req.body.requestId;
        const bklid = req.body.bklid;
        const response = await this.police.findOne({bklid:bklid});
        if(response){
          const updatedRequests = response.request.map(requestItem => {
            if (requestItem.requestId === requestId) {
              requestItem.status = "Denied";
              requestItem.info = "Sorry your Leave Request has been Denied";
              requestItem.updateStatus = new Date();
            }
            return requestItem;
          });
          await this.police.updateOne(
            { bklid: bklid},
            { $set: { request: updatedRequests } }
          );
          console.log('File paths updated successfully.');
          await this.notification.updateOne({bklid : bklid, requestId : requestId },
            {
              $set :{
                for : "normal",
                mDate : new Date(),
                status : 'Denied',
              }
            })
          // res.json({approve:true});
          res.status(200).json({message : "request Denied successfully"})
        } else {
          console.log('Document not found');
          // res.json({approve : false});
        }
      }catch(err){
        console.log(err)
      }
    },
}