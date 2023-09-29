const route = require('express').Router();

const { fetchEvents,pushEvent,deleteEvent } = require('../services/events.services');

route.get('/',fetchEvents);
route.post('/pushEvent',pushEvent)
route.delete('/deleteEvent', deleteEvent)


module.exports = route;
