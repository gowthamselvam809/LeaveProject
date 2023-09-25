const route = require('express').Router();
const multer = require('multer');

const {getAllDocuments,getDocuments,pushRequest,approveRequest,denyRequest} = require('../services/documents.services');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Save uploaded files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
});

const upload = multer({ storage });


// route.post('/uploads', uploads);
route.post('/pushRequest', upload.single('file') ,pushRequest);
route.get('/getAllDocuments', getAllDocuments);
route.get('/getDocuments', getDocuments);
route.post('/approveRequest', approveRequest);
route.post('/denyRequest', denyRequest)


module.exports = route;
