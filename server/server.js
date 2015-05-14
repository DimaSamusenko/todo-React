var express = require('express'),
    mongoose = require("mongoose"),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    path = require('path');

var app = express(),
    router = express.Router();

mongoose.connect('mongodb://localhost/todo-react');

router.route('/items')
  .get(function (request, response, next) {
    response.send(200);
  })
  .post(function (request, response, next) {
    response.send(200);
  });

router.route('/items/:id')
  .get(function (request, response, next) {
    response.send(200);
  })
  .put(function (request, response, next) {
    response.send(200);
  })
  .delete(function (request, response) {
    response.send(200)
  });

app.use('/api', router);
app.use(express.static('../public'));

var server = app.listen(3000, function() {
  console.log('Express is listening to http://localhost:3000');
});