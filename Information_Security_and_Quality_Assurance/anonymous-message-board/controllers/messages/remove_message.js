const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

exports.remove_message = (req, res) => {
    MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if(err) {
            console.log("Error while connecting to database: " + err);
        }
        
        const message = client.db("anonymous_message_board").collection("messages");
        const thread = client.db("anonymous_message_board").collection("threads");

        message.findOne({ _id: ObjectId(req.body.reply_id) }, (err, result) => {
            if(err) {
                console.log("Error while retrieving message: " + err);
            }

            if(result.delete_password === req.body.delete_password) {
                message.deleteOne({ _id: ObjectId(req.body.reply_id) });

                // TODO: When deleting a message, remove it from the replies array in the thread as well
                // thread.findOneAndUpdate()
                res.send("success");
                client.close();
            } else {
                res.send("incorrect password");
                client.close();
            }
        });
    })
  }