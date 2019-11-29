/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

module.exports = function (app) {
    
    app.route('/api/books')
      .get(function (req, res){
        MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
          console.log(process.env.MONGO_URI)
          if(err) {
            console.log("ERROR: " + err);
          }
          console.log(client)
          const collection = client.db("personal_library").collection("books");

          //response will be array of book objects
          //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
          collection.find().toArray((err, data) => {
            if(err) {
              console.log("Error when searching database: " + err);
            }
            
            res.json(data);
          })
          
        });
      })

      .post(function (req, res){
        if(req.body.title.length > 0) {
          MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
            if(err) {
              console.log("ERROR: " + err);
            }
            
            const collection = client.db("personal_library").collection("books");
            
            collection.countDocuments({ title:req.body.title }, (err, data) => {
              if(err) {
                console.log(err);
              } else if(data > 0) {
                res.send("A book with that title is already in the library.")
              } else {
                //response will contain new book object including atleast _id and title
                collection.insertOne({ title: req.body.title, comments: [] }, (err, data) => {
                  if(err) {
                    console.log("Error on insertion: " + err);
                  } else {
                    res.json(data.ops[0]);
                  }  
                })
              }
            })

          })
        } else {
          res.send("You need to enter a title for the book.")
        }
      })

      .delete(function(req, res){
        //if successful response will be 'complete delete successful'
        MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
          if(err) {
            console.log("ERROR: " + err);
          }
          
          const collection = client.db("personal_library").collection("books");

          collection.deleteMany({}, (err, data) => {
            if(err) {
              res.send("Failed to delete books.");
            } else {
              res.send("complete delete successful");
            }
          })
        });
      });



    app.route('/api/books/:id')
      .get(function (req, res){
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
          if(err) {
            console.log("ERROR: " + err);
          }
          
          const collection = client.db("personal_library").collection("books");

          collection.countDocuments({ _id: ObjectId(req.params.id) }, (err, data) => {
            if(data < 1) {
              res.send("no book exists");
            } else {
              collection.findOne({ _id: ObjectId(req.params.id) }, (err, data) => {
                if(err) {
                  console.log("error when retrieving book: " + err);
                } else {
                  res.json(data);
                }
              }) 
            }
          })
        });
      })

      .post(function(req, res){
        //const bookid = req.params.id;
        //const comment = req.body.comment;
        //json res format same as .get
          MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
            if(err) {
              console.log("ERROR: " + err);
            }
            
            const collection = client.db("personal_library").collection("books");
          
            collection.findOneAndUpdate(
              { _id: ObjectId(req.params.id) },
              { $push: { comments: req.body.comment } },
              { returnOriginal: false },
              (err, data) => {
              if(err) {
                console.log("failed to update comment field");
              }
              res.json(data.value);
            })

          });
      })

      .delete(function(req, res){
        //const bookid = req.params.id;
        //if successful response will be 'delete successful'
        MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
          if(err) {
            console.log("ERROR: " + err);
          }
          
          const collection = client.db("personal_library").collection("books");

          console.log(req.params.id)
            collection.deleteOne({ _id: ObjectId(req.params.id) }, (err, data) => {
              if(err) {
                console.log("Error on deletion: " + err);
              } else {
                res.send("delete successful");
              }  
            })

          });
      });
};
