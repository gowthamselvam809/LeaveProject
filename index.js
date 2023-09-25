const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs')


const { connect } = require('./shared/mongo');
const { logging, jwtTokenValidation } = require('./shared/middleware');
const authUsers = require('./routes/auth.routes');
const polices = require('./routes/policeman.routes');
const document = require('./routes/documents.routes');
const notification = require('./routes/notification.routes');


const app = express();
dotenv.config();



(async () => {
    try {
        // connection to db
        await connect();

        app.use(cors());
        app.use(express.static(path.join(__dirname,'public')))
        app.use(express.json());
        app.use(bodyParser.urlencoded({extended:true}));
        app.engine('html',require('ejs').renderFile);

        const filesDirectory = path.join(__dirname, 'uploads');

        //logging middleware
        app.use(logging);
        
        //Front End Page Calls
        app.get('/log', (req,res)=>{
            res.render('login.html');
        })
        app.get('/yesterday',(req,res)=>{
          res.render('yesterday.html');
        })
        app.get('/today',(req,res)=>{
          res.render('today.html');
        })
        app.get('/tomorrow',(req,res)=>{
          res.render('tomorrow.html');
        })
        app.get('/later',(req,res)=>{
          res.render('later.html');
        })
        app.get('/dash',(req,res)=>{
            res.render('dashboard.html')
        })
        app.get('/user',(req,res)=>{
            res.render('data.html')
        })
        app.get('/employee',(req,res)=>{
            res.render('employee.html')
        })
        app.get('/leavehistory',(req,res)=>{
            res.render('leavehistory.html')
        })
        app.get('/userRequest',(req,res)=>{
            res.render('singlerequest.html')
        })
        app.get('/profile/:bklid', (req,res)=>{
          res.render('profile.html')
        })
        app.get('/profile/', (req,res)=>{
          res.render('profile.html')
        })
        app.get('/pwchange', (req,res)=>{
          res.render('changepassword.html')
        })
        app.get('/addUser', (req,res)=>{
          res.render('addUser.html')
        })

        app.get('/documents/:fileName', (req, res) => {
            const fileName = req.params.fileName;
            const filePath = path.join(__dirname, 'uploads', fileName); 
            if (fs.existsSync(filePath)) {
              res.sendFile(filePath);
            } else {
              res.status(404).send('File not found');
            }
          });

          app.get('/favicon.ico', (req, res) => {
            try {
              const filePath = path.join(filesDirectory, 'favicon.ico');
              res.sendFile(filePath);
            } catch (error) {
              console.error('Error serving favicon:', error);
              res.status(500).send('Internal Server Error');
            }
          });

        app.use('/auth', authUsers)

        app.use(jwtTokenValidation)
        
        app.use('/document',document)

        app.use('/notification', notification);

        app.use('/police',polices)

        
        

        app.listen(process.env.port, () => console.log('listing to port-' + process.env.port))
    } catch (error) {
        console.log(error)
        process.exit();
    }
})()