/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      // const project = req.params.project;
      
      MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if(err) {
            console.log("ERROR: " + err);
            client.close();
          }
          
          const collection = client.db("issue_tracker").collection("issues");
          
          const query = [];
          
          typeof req.query.issue_title !== "undefined" ? query.push({ issue_title: req.query.issue_title }) : null;
          typeof req.query.issue_text !== "undefined" ? query.push({ issue_text: req.query.issue_text }) : null;
          typeof req.query.created_by !== "undefined" ? query.push({ created_by: req.query.created_by }) : null;
          typeof req.query.assigned_to !== "undefined" ? query.push({ assigned_to: req.query.assigned_to }) : null;
          typeof req.query.status_text !== "undefined" ? query.push({ status_text: req.query.status_text }) : null; 
          typeof req.query.created_on !== "undefined" ? query.push({ created_on: req.query.created_on }) : null;
          typeof req.query.updated_on !== "undefined" ? query.push({ updated_on: req.query.updated_on }) : null;
          req.query.open !== false ? query.push({ open: true }) : query.push({ open: false });
          
          let searchQuery = {};

          if(query.length > 1) {
            searchQuery = { $and: query };
          }
          
          collection.find(
            (query.length > 1 ? searchQuery : {})
          )
            .toArray((err, result) => {
              if(err) {
                console.log("intercepted error in get: " + err);
              }

              if(result && result.length > 0) {
                res.send(result);
              } else {
                res.send("No issues were found.");
              }
              client.close();
            })
        })
    })
    
    .post(function (req, res){
      // const project = req.params.project;
    
      MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if(err) {
            console.log("ERROR: " + err);
          }

          const collection = client.db("issue_tracker").collection("issues");

          // Does the issue already exist?
          collection.countDocuments({ issue_title: req.body.issue_title }).then(result => {
            if(result !== 0) {
              res.send("An issue with that title already exists.");
              client.close();
            } else if(typeof req.body.issue_title === "undefined" || typeof req.body.issue_text === "undefined" || typeof req.body.created_by === "undefined") {
              res.send("no updated field sent");
              client.close();
            } else {
              collection.insertOne({
                "issue_title": req.body.issue_title,
                "issue_text": req.body.issue_text,
                "created_by": req.body.created_by,
                "assigned_to": req.body.assigned_to,
                "status_text": req.body.status_text,
                "created_on": new Date().toISOString().substring(0, 10),
                "updated_on": new Date().toISOString().substring(0, 10),
                "open": true
              }, (err, data) => {
                if(err) {
                  console.log("Error on insertion: " + err);
                } else {
                  res.send(data.ops[0]);
                }

                client.close();
              });
            }
          })
        });
      
    })
    
    .put(function (req, res){
      // const project = req.params.project;

      MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if(err) {
            console.log("ERROR: " + err);
          }
          
          const collection = client.db("issue_tracker").collection("issues");

          let thisId = ObjectId(req.body._id);
          
          // Does the issue already exist?
          collection.countDocuments({ _id: thisId }).then(result => {
            if(result === 0) {
              res.send("could not update " + req.body._id);
              client.close();
            } else {
              
              // TODO: Clean up this part
              let data = [];
              
              req.body.issue_title !== "" ? data.push(["issue_title", req.body.issue_title]) : null;
              req.body.issue_text !== "" ? data.push(["issue_text", req.body.issue_text]) : null;
              req.body.created_by !== "" ? data.push(["created_by", req.body.created_by]) : null;
              req.body.assigned_to !== "" ? data.push(["assigned_to", req.body.assigned_to]) : null;
              req.body.status_text !== "" ? data.push(["status_text", req.body.status_text]) : null;
              !req.body.open ? data.push(["open", false]) : null;
              data.push(["updated_on", new Date().toISOString().substring(0, 10)])
              
              if(data.length < 1 && req.body.open) {
                res.send("no updated field sent");
                client.close();
              } else if(data.length < 2 && !req.body.open) {
                res.send("no updated field sent");
                client.close();
              }

              let updatedObject = req.body;

              updatedObject.updated_on = new Date().toISOString().substring(0, 10);
              delete updatedObject._id; // Remove the id from the update data.

              Object.keys(updatedObject).forEach(item => {   
                if(updatedObject[item] === "") {
                  delete updatedObject[item];
                }
              });

              // For some reason the interaction with Chai/Mocha doesn't like Object.fromEntries() function,
              // which is new to ECMAScript.
              
              // let updatedObject = Object.fromEntries(data);
              
              collection.updateOne(
                { _id: thisId },
                { $set: updatedObject }
              );
              res.send("successfully updated");
              client.close();
            }
          })
        });
    })
    
    .delete(function (req, res){
      // const project = req.params.project;
    
      MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if(err) {
            console.log("ERROR: " + err);
          }

          if(typeof req.body._id === "undefined") {
            res.send("no id provided");
            client.close();
          }

          const collection = client.db("issue_tracker").collection("issues");
          
          // Does the issue even exist?
          collection.countDocuments({ _id: ObjectId(req.body._id) }).then(result => {
            if(result === 0) {
              res.send("could not delete " + ObjectId(req.body._id) );
              client.close();
            } else {
              collection.deleteOne({
                _id: ObjectId(req.body._id)
              });
              res.send("deleted " + ObjectId(req.body._id) )
              client.close();
            }
          });
      });
  });
};
