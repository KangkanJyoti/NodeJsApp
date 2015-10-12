var mongo = require('mongodb');
var amqp = require('amqplib');
var _ = require('underscore-node');


var TaskBroker = function () {
  this.queueName = 'task_queue';
  this.rabbit = {};
  this.mongo = {};
};

TaskBroker.prototype.connectRabbit = function() {
  return amqp.connect('amqp://localhost')

    .then(function (connection) {
      this.rabbit.connection = connection;
      return connection.createChannel()
    }.bind(this))

    .then(function(channel) {
      this.rabbit.channel = channel;
      return channel.assertQueue(this.queueName, {durable: true});
    }.bind(this))
};

TaskBroker.prototype.connectMongo = function(){
  return function() {
    this.mongo.db = mongo('mongodb://127.0.0.1:27017/winedb', ['winedb']);
    return this.mongo.db;
  }.bind(this);
};

TaskBroker.prototype.connect = function () {
  return this.connectRabbit()
    .then(this.connectMongo());
};

TaskBroker.prototype.disconnect = function() {
  this.mongo.db.close();
  this.rabbit.channel.close();
  this.rabbit.connection.close();
};

TaskBroker.prototype.get_url_array = function(_data) {
  return _.chain(_data).pluck('probes').flatten().pluck('url').uniq().value();
};

TaskBroker.prototype.getTask = function() {
  return function () {
    return this.mongo.db.wines.find({ 'status': 'ONGOING' }, { 'probes.url':1, '_id':0})
      .then(function(results) {
        var url_array = [];
        if (results != null && results.length > 0) {
          url_array = this.get_url_array(results);
        }
        return this.mongo.db.wines.find({ 'probes.url' : { $nin: url_array } });
      }.bind(this))

      .then(function(results) {
        if (results.length > 0) return results[0];
        return null;
      });
  }.bind(this);
};

TaskBroker.prototype.produceTask = function() {
  return function(_message) {
    if(_message != null) {
      _message.status = 'ONGOING';
      this.rabbit.channel.sendToQueue(this.queueName, new Buffer(JSON.stringify(_message)), { deliveryMode: true });
      return this.mongo.db.wines.update({_id: _message._id}, { $set: { 'status': _message.status }}).then(function() {
        return _message;
      });
    }
    return null;
  }.bind(this);
};

var taskBroker = new TaskBroker();



taskBroker.connect()
  .then(function() {
    setInterval(
      function () {
        taskBroker.getTask()()
          .then(taskBroker.produceTask())
          .then(function(result) {
            if(result == null) {
              console.log('No job to produce');
            } else {
              console.log('Produce', result);
            }
            //console.log('Disconnected');
            //taskBroker.disconnect();
          }
          , function(error) {
            console.log('ERROR', error.stack);
          }
        );
      }
      , 10000
    );
  });