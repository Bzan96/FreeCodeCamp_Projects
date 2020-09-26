// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const dotenv = require('dotenv').config()

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/timestamp/:date_string?", (req, res) => {
  const date_string = req.url.split("/api/timestamp/")[1];
  
  console.log(new Date("2015-12-25").getTime() );

  if(new Date(date_string) > 0) {
      res.json({
          "unix": new Date(date_string).getTime(),
          "utc": new Date(date_string).toUTCString()
      });
  } else if(new Date(parseInt(date_string) ).getTime() > 0) {
      res.json({
          "unix": parseInt(date_string),
          "utc": new Date(parseInt(date_string) ).toUTCString()
      });
  } else if(date_string === "") {
      res.json({
          "unix": new Date().getTime(),
          "utc": new Date().toUTCString()
      });
} else if(!(new Date(date_string) > 0) ) {
      res.json({
          "unix": null,
          "utc": "Invalid Date"
      });
  }
});

// Just because we did it in practice projects, adding it here.
app.get("/now", (req, res, next) => {
req.time = new Date().toString();
next();
}, (req, res) => {
res.json({"time": req.time});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});