const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

exports.remove_thread = (req, res) => {
    MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if(err) {
            console.log("Error while connecting to database: " + err);
        }
        
        const thread = client.db("anonymous_message_board").collection("threads");

        console.log(req.body);

        thread.findOne({ _id: ObjectId(req.body.thread_id) }, (err, result) => {
            if(err) {
                console.log("Error while retrieving message: " + err);
            }

            if(result.delete_password === req.body.delete_password) {
                thread.deleteOne({ _id: ObjectId(req.body.thread_id) });

                res.send("success");
                client.close();
            } else {
                res.send("incorrect password");
                client.close();
            }
        });
    })
  }