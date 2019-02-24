const express = require('express');
const app = express();
const bodyParser = require('body-parser')

// --> 7)  Mount the Logger middleware here
app.use((req, res, next) => {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
});

// --> 11)  Mount the body-parser middleware here
app.use(bodyParser.urlencoded({ extended: false }) );

/** 1) Meet the node console. */
console.log("Hello World");

/** 2) A first working Express Server */
// app.get("/", function(req, res) {
//     res.send("Hello Express");
// });

/** 3) Serve an HTML file */
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

/** 4) Serve static assets  */
app.use(express.static(__dirname + "/public") );

/** 5) serve JSON on a specific route */
// app.get("/json", (req, res) => {
//     res.json({"message": "Hello json"});
// });

/** 6) Use the .env file to configure the app */
app.get("/json", (req, res) => {
    if(process.env.MESSAGE_STYLE === "uppercase") {
        res.json({"message": "HELLO JSON"});
    } else {
        res.json({"message": "Hello json"});
    }
});
 
/** 7) Root-level Middleware - A logger */
//  place it before all the routes !
// -> It's on top of the file! <-

/** 8) Chaining middleware. A Time server */
app.get("/now", (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => {
    res.json({"time": req.time});
});

/** 9)  Get input from client - Route parameters */
app.get("/:word/echo", (req, res, next) => {
    res.json({echo: req.params.word});
    next();
})

/** 10) Get input from client - Query parameters */
// /name?first=<firstname>&last=<lastname>
app.route("/name")
.get((req, res, next) => {
    res.json({name: req.query.first + " " + req.query.last});
    next();
})
.post((req, res, next) => {
    res.json({name: req.body.first + " " + req.body.last});
    next();
});
  
/** 11) Get ready for POST Requests - the `body-parser` */
// place it before all the routes !
// -> Up top again! <-

/** 12) Get data form POST  */


// This would be part of the basic setup of an Express app
// but to allow FCC to run tests, the server is already active
/** app.listen(process.env.PORT || 3000 ); */

//---------- DO NOT EDIT BELOW THIS LINE --------------------

 module.exports = app;