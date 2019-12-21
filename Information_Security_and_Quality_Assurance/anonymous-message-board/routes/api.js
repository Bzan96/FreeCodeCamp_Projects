/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;

const ThreadsController = require('../controllers/threads/index');
const MessagesController = require('../controllers/messages/index');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(ThreadsController.find_threads)

    .post(ThreadsController.add_thread)

    .put(ThreadsController.report_thread)

    .delete(ThreadsController.remove_thread)

  app.route('/api/replies/:board')
    .get(MessagesController.find_messages)

    .post(MessagesController.add_message)

    .put(MessagesController.report_message)

    .delete(MessagesController.remove_message)
};
