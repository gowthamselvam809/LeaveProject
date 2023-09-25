const route = require('express').Router();

const {allRequest, oneRequest,adminSeen, employeeSeen} = require('../services/notification.services')

route.get('/allRequest', allRequest);
route.get('/oneRequest', oneRequest);
route.post('/adminSeen', adminSeen);
route.post('/employeeSeen', employeeSeen);

module.exports = route;
