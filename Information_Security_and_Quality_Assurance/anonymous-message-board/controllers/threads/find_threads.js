const MongoClient = require('mongodb').MongoClient;

exports.find_threads = (req, res) => {
    MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if(err) {
          console.log("Error while connecting to database: " + err);
        }

        const board = client.db("anonymous_message_board").collection("boards");
        const thread = client.db("anonymous_message_board").collection("threads");

        board.findOne({ board: req.params.board }, (err, outerResult) => {
          if(err) {
            console.log("Error when finding board: " + err);
          }
          
          if(outerResult < 1) {
            res.send("Sorry, that board does not exist.");
          } else {
            thread.find({ board: req.params.board }).toArray((err, innerResult) => {
              if(err) {
                console.log("Error when finding threads " + err);
              }

              res.send(innerResult);
              client.close();
            })
          }
        })
    })
  }
