const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const shortid = require('shortid');
shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@");

const cors = require('cors')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.route("/api/exercise/new-user")
  .post((req, res, next) => {
    console.log(req.body)
    
    client.connect(err => {
      const collection = client.db("exercise_tracker").collection("users");
      if(err) {
        console.log("ERROR: " + err);
      }
      let newUser = req.body.username
        
      const result = collection.countDocuments({_id: newUser}).then(result => {
        if(err) {
          console.log("ERROR: " + err);  
        }

        if(result === 1) {
            res.send("Username already exists");
            client.close();
        } else if(result === 0) {
            collection.insertOne({ _id : newUser })
            client.close();   
        } else {
          console.log("What happened now?");
        }
      })     
    });
})

app.route("/api/exercise/add")
  .post((req, res, next) => {
    console.log(req.body)
    client.connect(err => {
      const idCollection = client.db("exercise_tracker").collection("users");
      if(err) {
        console.log("ERROR: " + err);
      }
      
      const result = idCollection.countDocuments({_id: req.body.userId}).then(result => {
        if(result === 0) {
          res.send("No such user exists.");
          client.close();
        } else if(result === 1) {
          const collection = client.db("exercise_tracker").collection("exercise_data");
          collection.insertOne({
            "userId": req.body.userId,
            "description": req.body.description,
            "duration": req.body.duration,
            "date": new Date(req.body.date).valueOf()
          })
          res.redirect("/");
          client.close();
        } else {
          console.log("What?");
        }
    })
  })
})

app.route("/api/exercise/log")
  .get((req, res, next) => {
    client.connect(err => {
      const collection = client.db("exercise_tracker").collection("exercise_data");
      if(err) {
        console.log("ERROR: " + err);
      }
      
      const result = collection.find({userId: req.query.userid,
                                      date: {
                                        $gte: req.query.startdate ? new Date(req.query.startdate).valueOf() : 0,
                                        $lte: req.query.enddate ? new Date(req.query.enddate).valueOf() : (new Date().valueOf() + 1)
                                      }
                                     })
                                .limit(parseInt(req.query.limit))
                                .toArray((err, result) => {
        if(err) {
          console.log(err)
        }
        let test = result.map(entry => {
          entry.date = new Date(entry.date).toISOString().substring(0, 10);
          return entry;
        })
        
        if(result.length > 0) {
            res.json(test);
          client.close();
        } else {
          res.send("Sorry, that person is a lazy sod.")
          client.close();
        }
      })
    })
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})