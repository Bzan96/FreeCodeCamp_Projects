const MongoClient = require('mongodb').MongoClient;

exports.add_thread = (req, res) => {
    MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if(err) {
          console.log("Error while connecting to database: " + err);
        }

        const board = client.db("anonymous_message_board").collection("boards");
        const thread = client.db("anonymous_message_board").collection("threads");

        board.findOne({ board: req.body.board }, (err, result) => {
          if(err) {
            console.log("Error when finding board: " + err);
          }

          let currentDate = new Date().toISOString().substring(0, 10);
          let currentTime = new Date().toTimeString().substring(0, 8);

          if(result < 1) {
            board.insertOne({ board: req.body.board });
            thread.insertOne({
              board: req.body.board,
              thread: req.body.text,
              created_on: `${currentDate}, ${currentTime}`,
              bumped_on: `${currentDate}, ${currentTime}`,
              reported: false,
              delete_password: req.body.delete_password,
              replies: []
            });

            res.redirect(`/b/${req.body.board}/`);        
            client.close();
          } else {
            thread.insertOne({
              board: req.body.board,
              thread: req.body.text,
              created_on: `${currentDate}, ${currentTime}`,
              bumped_on: `${currentDate}, ${currentTime}`,
              reported: false,
              delete_password: req.body.delete_password,
              replies: []
            });

            res.redirect(`/b/${req.body.board}/`);        
            client.close();
          }
        })

    })
  }