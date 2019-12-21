const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

exports.report_message = (req, res) => {
    MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if(err) {
            console.log("Error while connecting to database: " + err);
        }

        const message = client.db("anonymous_message_board").collection("messages");

        message.findOneAndUpdate(
            { _id: ObjectId(req.body.reply_id) },
            { $set: { reported: true }}
        )

        res.send("success");
        client.close();
    })
  }