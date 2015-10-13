var mongo = require('mongodb');
var amqp = require('amqp');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 var message = require('./consumer');


////////////////////////////////////////////////////
var Client = require('node-rest-client').Client;   
var client = new Client();						   	
///////////////////////////////////////////////////

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('Employeedb', server);

db.open(function (err, db) {
    if(!err) {
        console.log("Connected to 'Employeedb' database");
        db.collection('Employees', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'Employees' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving Employee Info: ' + id);
    db.collection('Employees', function (err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('Employees', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
			
             var data = JSON.stringify(items);
			
			
			
        var connection = amqp.createConnection({host: 'localhost'});
        connection.on('ready', function(){    
		var messageToSend = data.toString();
		var queueToSendTo = "testMessageQueue";
		connection.publish(queueToSendTo, messageToSend);
        console.log("Sent message: "+ messageToSend);
	}
);
        });
    });
};

exports.findAllTrans = function(req, res) {
    db.collection('Employees', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
			
             var data = JSON.stringify(items);
			
        var connection = amqp.createConnection({host: 'localhost'});
        connection.on('ready', function(){    
		var messageToSend = data.toString();
		var queueToSendTo = "testMessageQueue";
		connection.publish(queueToSendTo, messageToSend);
        console.log("Sent message: "+ messageToSend);
	}
);
        });
    });
};

exports.addEmployee = function(req, res) {
    
    var Employee = req.body;
    var EmployeeNew = message.queueValue;
    var Employeedoc = JSON.stringify(EmployeeNew);
    console.log('Adding Employees info: ' + JSON.stringify(Employee));
    db.collection('Employees', function(err, collection) {
        collection.insert( Employee, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
                
            }
        });
    });
}

exports.updateEmployee = function(req, res) {
    var id = req.params.id;
    var Employee = req.body;
    console.log('Updating Employees info: ' + id);
    console.log(JSON.stringify(Employee));
    db.collection('Employees', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, Employee, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(Employee);
            }
        });
    });
}

exports.deleteEmployee = function(req, res) {
    var id = req.params.id;
    console.log('Deleting Employees : ' + id);
    db.collection('Employees', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var Employees = [
    {
        name: "Partha Protim Bora",
        year: "2015",
        country: "India",
		Designation: "Software Engineer"
    },
    {
         name: "Nayan Jyoti Das",
        year: "2015",
        country: "India",
		Designation: "Software Engineer"
	},
	 {
         name: "Kangkan Jyoti Bora",
        year: "2015",
        country: "India",
		Designation: "Software Engineer"
    }];

    db.collection('Employees', function(err, collection) {
        collection.insert(Employees, {safe:true}, function(err, result) {});
    });

};