'use strict';

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const validateURL = require("url-validate");
const shortid = require("shortid");
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');
const bodyParser = require("body-parser");

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(bodyParser.urlencoded({ extended: true }) );
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  });

  
// your first API endpoint... 
app.route("/api/hello")
  .get((req, res) => {
    res.json({greeting: 'hello API'});
  });

app.route("/api/shorturl/new")
  .post((req, res, next) => {
  console.log("attempted");
    client.connect((err) => {
      if(err) {
        console.log("Cannot connect to the server\n", err);
      } else {
        let db = client.db("url_shortener").collection("original_url");
        let url = req.body.url;

        if(validateURL(url)) {
          db.findOne({ "url": url }, (err, doc) => {
            if(err) { console.log("cannot search because I am a dumb computer") }
            if(doc != null) {
              res.json({ 
                original_url: url,
                short_url: 1
              })
              client.close();
            } else {
              let accessid = Math.floor(Math.random() * 999);
              let short = shortid.generate();
              db.insertOne({ "url": url, "short_id": short, "access_id": accessid });
              res.json({
                original_url: url,
                short_url: short,
                access_id: accessid
              })
              client.close();
            }
          })
        } else {
          console.log("That is not a valid url");
          res.json({
            "error": "Invalid URL"
          })
        }


      }
    })
})

app.route("/api/shorturl/:id")
  .get((req, res, next) => {
    client.connect((err) =>  {
    if(err) {
      console.log("Cannot connect to the server", err);
    } else {
      let db = client.db("url_shortener").collection("original_url");
      let access = parseInt(req.params.id);

      db.findOne({ "access_id": access }, (err, doc) => {
        if(doc != null) {
          res.redirect(doc.url);
        } else {
          res.json({ error: "That shortlink does not exist." });
        }
      })
    }
  })
})

app.use((req, res, next) => {
  res.status(404);
  res.type("txt").send("Not found");
})

app.use((err, req, res, next) => {
  if(err) {
    res.status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});