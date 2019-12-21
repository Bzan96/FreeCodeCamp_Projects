const MongoClient = require('mongodb').MongoClient;

exports.report_message = (req, res) => {
    MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        console.log(req.params);
        res.send("reporting message");
        const collection = client.db("anonymous_message_board").collection("messages");
        client.close();
    })
  }