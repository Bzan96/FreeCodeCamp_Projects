const MongoClient = require('mongodb').MongoClient;

exports.add_message = (req, res) => {
    MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if(err) {
            console.log("Error while connecting to database: " + err);
        }

        console.log(req.params);
        console.log(req.body)
        const thread = client.db("anonymous_message_board").collection("threads");
        const message = client.db("anonymous_message_board").collection("messages");

        thread.findOne({ thread: req.body.thread_id }, (err, outerResult) => {
            if(err) {
                console.log("Error while seaching for thread");
            }

            if(outerResult < 1) {
                res.send("Sorry, no such thread exists.")
                client.close();
            } else {
                let currentDate = new Date().toISOString().substring(0, 10);
                let currentTime = new Date().toTimeString().substring(0, 8);
                let newReply = {
                    thread: req.body.thread_id,
                    message: req.body.text,
                    delete_password: req.body.delete_password,
                    created_on: `${currentDate}, ${currentTime}`,
                    reported: false
               }

                message.insertOne(newReply)
                thread.findOneAndUpdate(
                    { thread: req.body.thread_id },
                    { $push: { replies: newReply }}
                )

                res.redirect(`/b/${req.params.board}/`)
                client.close();
            }
        })

    })
  }
