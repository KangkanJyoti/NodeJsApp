var express = require('express'),
    wine = require('./routes/wines');
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



app.get('/wines', wine.findAll);
app.get('/Transliteration',trans.findAll);
app.get('/wines/Transliteration', wine.findAllTrans);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

app.listen(3000);
console.log('Listening on port 3000...');
app.use('/timesync',timrsyncServer.requestHandler);