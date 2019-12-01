/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const ObjectId = require('mongodb').ObjectID;

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let updateId;
    let deleteId;
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          deleteId = res.body._id;
          done();
        })
      });

      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Required Title',
          issue_text: 'Required text',
          created_by: 'Required fields filled in'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Required Title');
          assert.equal(res.body.issue_text, 'Required text');
          assert.equal(res.body.created_by, 'Required fields filled in');       
          updateId = res.body._id;
          done();
        })
      });
       
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "no updated field sent");
          done();
        })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ _id: deleteId })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ issue_title: "Title"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, 'Title');
          assert.equal(res.body[0].issue_text, 'text');
          assert.equal(res.body[0].created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
          assert.equal(res.body[0].open, true);
          assert.equal(res.body[0].status_text, 'In QA');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          issue_title: "Destroy Carthage",
          open: true,
          created_by: "Cato the Elder" })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, 'Destroy Carthage');
          assert.equal(res.body[0].issue_text, 'Carthage must be destroyed!');
          assert.equal(res.body[0].created_on, '2019-11-03');
          assert.equal(res.body[0].updated_on, '2019-11-03');
          assert.equal(res.body[0].created_by, 'Cato the Elder');
          assert.equal(res.body[0].assigned_to, 'Scipio Aemelianus');
          assert.equal(res.body[0].open, true);
          assert.equal(res.body[0].status_text, 'Urgent');
          assert.equal(res.body[0]._id, '5dbef63bb930893f28e53465');
          done();
        });
      });
      
    });

    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'could not update undefined');
          done();
        })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: deleteId,
          issue_text: "updated text"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');
          done();
        })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: updateId,
          issue_title: "Multiple updates test",
          issue_text: "Multiple updates",
          status_text: "Update issue"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');
          done();
        })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, "no id provided")
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: deleteId })
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, `deleted ${deleteId}`)
          done();
        });
      });
      
    });

});
