

module.exports = {
    async fetchEvents(req,res){
        try{
            const event = await this.events.find().toArray();
            res.status(200).json(event);
        }catch(error){
            console.log(error);
            res.status(501).json({ message: `Cannot fetch Events Details.` });
        }
    },
    async pushEvent(req,res){
        try{
            data = {
                title : req.body.title,
                start : req.body.start,
                borderColor : req.body.borderColor,
                backgroundColor : req.body.backgroundColor,
                allDay : true
            }

            await this.events.insertOne(data)   
            res.status(200).send({message : 'event pushed successfully'});
        }catch(error){
            console.log(error);
            res.status(501).json({ message: `Cannot Push Events.` });
        }
    },
    async deleteEvent(req,res){
        try{
            await this.events.deleteOne({title : req.body.title,start : req.body.start})
            res.status(200).send({message : 'event Deleted successfully'});
        }catch(error){
            console.log(error);
            res.status(501).json({ message: `Cannot Deleted Events.` });
        }
    }
}