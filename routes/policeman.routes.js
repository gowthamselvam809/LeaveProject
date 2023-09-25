const route = require('express').Router();

const { getAllPoliceMan, getPoliceMan, createPoliceMan, deletePoliceMan, getPoliceManWithBklid, updateDetails ,passwordChange } = require('../services/policeman.services');

route.get('/getAllpolice', getAllPoliceMan);
route.get('/getPolice', getPoliceMan);
route.get('/getPolice/:bklid', getPoliceManWithBklid);
route.post('/createpolice', createPoliceMan);
route.delete('/deletepolice', deletePoliceMan);
route.post('/updateDetails', updateDetails);
route.post('/passwordChange', passwordChange);

module.exports = route