const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

exports.report_message = (req, res) => {
    MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if(err) {
            console.log("Error while connecting to database: " + err);
        }

        const message = client.db("anonymous_message_board").collection("messages");
        const thread = client.db("anonymous_message_board").collection("threads");

        message.findOneAndUpdate(
            { _id: ObjectId(req.body.reply_id) },
            { $set: { reported: true }}
        )
        // TODO: Double check that the thread isn't updated to reported as well.
        thread.findOneAndUpdate(
            { _id: ObjectId(req.body.thread_id), "replies._id": ObjectId(req.body.reply_id) },
            { $set: { "replies.$.reported": true }},
            (err, result) => {
            if(err) {
                console.log("Error while updating thread message " + err);
            }

            // console.log(result);

            res.send("success");
            client.close();
        })
    })
  }