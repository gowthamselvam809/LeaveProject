const route = require('express').Router();

const { insertData,signUp, deleteUser, activateUser, deActivateUser, signIn } = require('../services/auth.services');

route.post('/signup', signUp)
route.post('/insertData', insertData)
route.post('/signin', signIn)
route.delete('/deleteuser', deleteUser)
route.put('/deactivate', deActivateUser)
route.put('/activate', activateUser)


module.exports = route