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
                /* message.updateOne(
                    { _id: ObjectId(req.body.reply_id) },
                    { message: "[deleted]" }
                ); */

                thread.findOneAndUpdate(
                    { _id: ObjectId(req.body.thread_id), "replies.$._id": ObjectId(req.body.reply_id) },
                    { $set: { "replies.$.message": "[deleteasd]" }},
                    (err, result) => {
                    if(err) {
                        console.log("meh" + err);
                    }

                    console.log(result);
                    /* result.replies.forEach(reply => {
                        if(reply._id == req.body.reply_id) {
                            reply.message = "[deleted]";
                        }
                    }) */
                })

                res.send("success");
                client.close();
            } else {
                res.send("incorrect password");
                client.close();
            }
        });
    })
  }