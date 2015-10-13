var express = require('express'),
    Employee = require('./routes/Employee');
var timrsyncServer=require('timesync/server');
 var amqp = require('amqp');
var trans=require('./callApi');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});


/////////////////////////////////////////////////////////////////////
// Here Comes the Rabbit 

//var connection = amqp.createConnection({host: 'localhost'});
//
//connection.on('ready', function(){ 
//		var messageToSend = app.get('/wines', wine.findAll);
//    
//		var queueToSendTo = JSON.stringify(messageToSend);
//    connection.publish(queueToSendTo, messageToSend);
//    console.log("Sent message: "+ messageToSend);
//	}
//);

///////////////////////////////////////////////////////////////////



app.get('/Employees', Employee.findAll);
app.get('/Transliteration',trans.findAll);
app.get('/Employees/Transliteration', Employee.findAllTrans);
app.get('/Employees/:id', Employee.findById);
app.post('/Employees', Employee.addEmployee);
app.put('/Employees/:id', Employee.updateEmployee);
app.delete('/Employees/:id', Employee.deleteEmployee);

app.listen(3000);
console.log('Listening on port 3000...');
app.use('/timesync',timrsyncServer.requestHandler);