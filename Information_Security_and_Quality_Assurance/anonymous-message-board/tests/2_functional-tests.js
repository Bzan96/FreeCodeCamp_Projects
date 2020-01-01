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
const ObjectId = require('mongodb').ObjectId;

chai.use(chaiHttp);
let id;
let messageId;
let messageThreadId;

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Threads are successfully posted to boards', (done) => {
        chai.request(server)
          .post('/api/threads/general')
          .send({
            text: "test thread",
            delete_password: "test"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          })
      })
    });
    
    suite('GET', function() {
      test('I can get all the threads from a specified board', (done) => {
        chai.request(server)
          .get('/api/threads/general')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body[2].thread, "test thread");
            assert.equal(res.body[2].delete_password, "test");
            assert.equal(res.body[2].board, "general");
            assert.property(res.body[2], "created_on");
            assert.property(res.body[2], "bumped_on");
            assert.property(res.body[2], "replies");
            assert.property(res.body[2], "reported");
            assert.isArray(res.body[2].replies);
            assert.equal(res.body[2].replies.length, 0);
            id = res.body[2]._id;
            messageThreadId = res.body[1]._id; // For message testing below.
            done();
          })
      })
    });
    
   suite('PUT', function() {
      test('I can successfully report the thread', (done) => {
        chai.request(server)
          .put('/api/threads/general')
          .send({ report_id: ObjectId(id) })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          })
      })
    });

    suite('DELETE', function() {
      test('If I pass in the wrong delete_password the thread is not deleted', (done) => {
        chai.request(server)
          .delete('/api/threads/general')
          .send({ thread_id: ObjectId(id), delete_password: "wrong" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
          })
      })
    });

    suite('DELETE', function() {
      test('I can delete the thread by passing in the id and delete_password', (done) => {
        chai.request(server)
          .delete('/api/threads/general')
          .send({ thread_id: ObjectId(id), delete_password: "test" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          })
      })
    });

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('I can post a message to an existing thread', (done) => {
        chai.request(server)
          .post('/api/replies/general/')
          .send({
            thread_id: messageThreadId,
            text: "test message",
            delete_password: "delete"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          })
      })
    });
    
    suite('GET', function() {
      test('I can get a list of messages by passing in thread id', (done) => {
        chai.request(server)
          .get('/api/replies/general')
          .query({ thread_id: messageThreadId })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body.replies);
            assert.equal(res.body.replies[2].message, "test message");
            assert.equal(res.body.replies[2].delete_password, "delete");
            assert.property(res.body, "created_on");
            assert.property(res.body, "reported");
            assert.property(res.body, "thread");
            messageId = res.body.replies[2]._id;
            done();
          })
      });
    });
    
    suite('PUT', function() {
      test('I can report a message', (done) => {
        chai.request(server)
          .put('/api/replies/general')
          .send({
            thread_id: messageThreadId,
            reply_id: messageId
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          })
      });
    });

    suite('DELETE', function() {
      test('I cannot delete a message if I pass in the wrong password', (done) => {
        chai.request(server)
          .delete('/api/replies/general')
          .send({
            reply_id: messageId,
            delete_password: "hello"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
          })
      })
    });
    
    suite('DELETE', function() {
      test('I can delete a message and have the message text change to [deleted]', (done) => {
        chai.request(server)
          .delete('/api/replies/general')
          .send({
            thread_id: messageThreadId,
            reply_id: messageId,
            delete_password: "delete"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          })
      })
    });
    
  });

});
