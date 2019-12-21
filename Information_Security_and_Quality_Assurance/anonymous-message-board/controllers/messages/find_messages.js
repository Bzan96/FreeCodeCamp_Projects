const MongoClient = require('mongodb').MongoClient;

exports.find_messages = (req, res) => {
    MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        console.log(req.body);

        const board = client.db("anonymous_message_board").collection("boards");
        const thread = client.db("anonymous_message_board").collection("threads");
        const message = client.db("anonymous_message_board").collection("messages");

        board.findOne({ board: req.params.board })
        client.close();
    })
  }