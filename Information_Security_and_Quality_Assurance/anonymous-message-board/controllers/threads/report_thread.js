const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

exports.report_thread = (req, res) => {
    MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if(err) {
            console.log("Error while connecting to database: " + err);
        }

        const thread = client.db("anonymous_message_board").collection("threads");
        
        thread.findOneAndUpdate(
            { _id: ObjectId(req.body.report_id) },
            { $set: { reported: true }}
        )
        
        res.send("success");
        client.close();
    })
  }