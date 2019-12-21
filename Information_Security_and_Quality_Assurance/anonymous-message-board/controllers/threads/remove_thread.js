const MongoClient = require('mongodb').MongoClient;

exports.remove_thread = (req, res) => {
    MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        console.log(req.params);
        res.send("removing thread");
        const thread = client.db("anonymous_message_board").collection("threads");
        client.close();
    })
  }