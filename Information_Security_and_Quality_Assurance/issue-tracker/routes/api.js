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
const Mongo_URI = process.env.MONGO_URI;
const client = new MongoClient(Mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const project = req.params.project;
      
      client.connect(err => {
        const collection = client.db("issue_tracker").collection("issues");
        if(err) {
          console.log("ERROR: " + err);
          client.close();
        }
        
        const query = [];
        
        req.query.issue_title !== "" ? query.push({ issue_title: req.query.issue_title }) : null;
        req.query.issue_text !== "" ? query.push({ issue_text: req.query.issue_text }) : null;
        req.query.created_by !== "" ? query.push({ created_by: req.query.created_by }) : null;
        req.query.assigned_to !== "" ? query.push({ assigned_to: req.query.assigned_to }) : null;
        req.query.status_text !== "" ? query.push({ status_text: req.query.status_text }) : null; 
        req.query.created_on !== "" ? query.push({ created_on: req.query.created_on }) : null;
        req.query.updated_on !== "" ? query.push({ updated_on: req.query.updated_on }) : null;
        req.query.open ? query.push({ open: true }) : query.push({ open: false });
        
        let searchQuery = {};
        
        if(query.length > 1) {
          searchQuery = { $and: query };
        } else if(!req.query.open) {
          searchQuery = { open: false }
        }
        
        collection.find(
          searchQuery
        )
          .toArray((err, result) => {
            if(err) {
              console.log("intercepted error in get: " + err);
              client.close();
            }
          
            if(result.length > 0) {
              res.send(result);
            } else {
              res.send("No issues were found.");
            }
            client.close();
          })
      })
    })
    
    .post(function (req, res){
      const project = req.params.project;
    
      client.connect(err => {
        const collection = client.db("issue_tracker").collection("issues");
        if(err) {
          console.log("ERROR: " + err);
          client.close();
        }
        
        // Does the issue already exist?
        collection.countDocuments({ issue_title: req.body.issue_title }).then(result => {
          if(result !== 0) {
            res.send("An issue with that title already exists.");
            client.close();
          } else {
            let latestIssue = collection.insertOne({
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
            });
            
            client.close();
          }
        })
      });
      
    })
    
    .put(function (req, res){
      const project = req.params.project;

      client.connect(err => {
        const collection = client.db("issue_tracker").collection("issues");
        if(err) {
          console.log("ERROR: " + err);
          client.close();
        }
        
        // Does the issue already exist?
        collection.countDocuments({ _id: ObjectId(req.body._id) }).then(result => {
          if(result === 0) {
            res.send("could not update " + req.body._id);
            client.close();
          } else {
            let data = [];
            
            req.body.issue_title !== "" ? data.push(["issue_title", req.body.issue_title]) : null;
            req.body.issue_text !== "" ? data.push(["issue_text", req.body.issue_text]) : null;
            req.body.created_by !== "" ? data.push(["created_by", req.body.created_by]) : null;
            req.body.assigned_to !== "" ? data.push(["assigned_to", req.body.assigned_to]) : null;
            req.body.status_text !== "" ? data.push(["status_text", req.body.status_text]) : null;
            !req.body.open ? data.push(["open", false]) : null;
            data.push(["updated_on", new Date().toISOString().substring(0, 10)])
    
            let updatedObject = Object.fromEntries(data);
            
            if(data.length < 2) {
              res.send("no updated field sent");
              client.close();
            } else {
              collection.updateOne(
                { "_id": ObjectId(req.body._id) },
                { $set: updatedObject }
              );
              res.send("successfully updated");
              client.close();
            }
          }
        })
      });
    })
    
    .delete(function (req, res){
      const project = req.params.project;
    
      client.connect(err => {
        const collection = client.db("issue_tracker").collection("issues");
        if(err) {
          console.log("ERROR: " + err);
        }
      // Does the issue even exist?
        collection.countDocuments({ _id: ObjectId(req.body._id) }).then(result => {
          if(result === 0) {
            res.send("could not delete " + req.body._id);
            client.close();
          } else {
            collection.deleteOne({
              _id: ObjectId(req.body._id)
            });
            res.send("deleted " + req.body._id)
            client.close();
          }
        });
    });
  });
};
