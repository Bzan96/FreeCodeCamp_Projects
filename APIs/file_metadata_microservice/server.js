'use strict';

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// require and use "multer"...

const app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.route('/api/fileanalyser')
  .post(upload.single('upfile'), (req, res, next) => {
    console.log(req.file)
    res.json({
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size
    })
  })

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});