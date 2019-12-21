const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

exports.find_messages = (req, res) => {
    MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if(err) {
            console.log("Error while connecting to database: " + err);
        }

        const board = client.db("anonymous_message_board").collection("boards");
        const thread = client.db("anonymous_message_board").collection("threads");

        board.findOne({ board: req.params.board }, (err, boardResult) => {
            if(err) {
                console.log("Failed on finding board: " + err);
            }

            if(boardResult < 1) {
                res.send("Sorry, that board does not exist.");
                client.close();
            } else {
                thread.findOne({ _id: ObjectId(req.query.thread_id) }, (err, threadResult) => {
                    if(err) {
                        console.log("Failed on finding thread: " + err);
                    }

                    if(threadResult < 1) {
                        res.send("Sorry, that thread does not exist.");
                        client.close();
                    } else {
                        res.send(threadResult);
                        client.close();
                    }
                })
            }
        })
    })
  }