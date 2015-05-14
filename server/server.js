var express = require('express'),
    mongoose = require("mongoose"),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    path = require('path');

var app = express(),
    router = express.Router();

mongoose.connect('mongodb://localhost/todo-react');

var Schema = mongoose.Schema;

var TaskModel = new Schema({
  title: { type: String, required: true },
  created: { type: Date, default: Date.now },
  is_done: {type: Boolean, default: false}
});
var Task = mongoose.model('Task', TaskModel);

router.route('/items')
  .get(function (request, response, next) {
    Task.find(function (err, tasks) {
      response.send(tasks);
    });
  })
  .post(function (request, response, next) {
    var task = new Task({title: request.body.title});
    task.save(function (err) {
      Task.find(function (err, tasks) {
        response.send(tasks);
      });
    });
  });

router.route('/items/:id')
  .delete(function (request, response) {
    Task.findById(request.params.id, function (err, task) {
      task.remove(function (err) {
        Task.find(function (err, tasks) {
          response.send(tasks);
        });
      });
    });
  });

app.use(cors());
app.use(bodyParser());
app.use('/api', router);
app.use(express.static('../public'));
app.listen(3000);