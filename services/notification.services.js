
module.exports ={
    async allRequest(req, res) {
        try {
            const request = await this.notification.find().toArray();
            res.status(200).json(request);
          } catch (error) {
            console.log(error);
            res.status(501).json({ message: `Cannot fetch notification Details. ${error}` });
          }
    },

    async oneRequest(req,res){
      try{
        const request = await this.notification.find({bklid : req.user.bklid}).toArray();
        console.log(request)
            res.status(200).json(request);
      }catch(error){
        console.log(error);
        res.status(501).json({ message: `Cannot fetch notification Details. ${error}` });
      }
    },
    async adminSeen(req,res){
      try{
        await this.notification.updateOne({requestId : req.body.requestId}, {$set : {adminSeen : true}}) 
        // console.log(req.body.requestId, req.body.bklid)
        // const data = await this.notification.findOne({requestId : "IR17A5R6"});
        // console.log(data)
        res.status(200).json({message : "successfully updated adminSeen"})
      }catch(error){
        console.log(error);
        res.status(501).json({ message: `Cannot fetch notification Details. ${error}` });
      }
    },
    async employeeSeen(req,res){
      try{
        await this.notification.updateOne({requestId : req.body.requestId}, {$set : {employeeSeen : true}}) 
        res.status(200).json({message : "successfully updated adminSeen"})
      }catch(error){
        console.log(error);
        res.status(501).json({ message: `Cannot fetch notification Details. ${error}` });
      }
    },
}