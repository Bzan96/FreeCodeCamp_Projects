'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const helmet = require("helmet");

const app = express();

const convertHandler = require("./controllers/convertHandler.js");
const ConvertHandler = new convertHandler();

app.use(helmet());

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

function isUnitOfMeasurementValid(unit) {
  let splitByRegex = unit.toLowerCase().split(/\d/);
  if(splitByRegex[splitByRegex.length-1].match(/(gal)|(lbs)|(mi)|(kg)|(l)|(km)/)) {
    return true;
  } else {
    return false;
  }
}

function isNumberValid(number) {
  let splitByRegex = number.toLowerCase().split(/[a-z]/);
  if(splitByRegex[0].match(/\d/) || splitByRegex[0] === "") {
    if(splitByRegex[0].split("").filter(instance => instance === "/").length > 1) {
      return false;
    }
    return true;
  } else {
    return false;
  }
}

app.route("/api/convert")
  .get((req, res) => {
    console.log(req.query.input)
    if(!isUnitOfMeasurementValid(req.query.input) && !isNumberValid(req.query.input) ) {
        res.send("invalid number and unit");
    } else if(isUnitOfMeasurementValid(req.query.input) && !isNumberValid(req.query.input) ) {
        res.send("invalid number");
    } else if(!isUnitOfMeasurementValid(req.query.input) && isNumberValid(req.query.input) ) {
        res.send("invalid unit");
    } else {
      const initNum = ConvertHandler.getNum(req.query.input);
      const initUnit = ConvertHandler.getUnit(req.query.input);
      const convertedEntry = ConvertHandler.convert(initNum, initUnit);
      const returnNum = ConvertHandler.getReturnUnit(convertedEntry);
      const returnUnit = ConvertHandler.spellOutUnit(convertedEntry);
      const returnString = ConvertHandler.getString(initNum, initUnit, returnNum, returnUnit);
      console.log(convertedEntry);
      res.send({
        initNum: initNum,
        initUnit: initUnit,
        returnNum: returnNum,
        returnUnit: returnUnit,
        string: returnString
      });
    }
})

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for testing