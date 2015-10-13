//var http = require("http");
//    url = "http://maps.googleapis.com/maps/api/directions/json?origin=Central Park&destination=Empire State Building&sensor=false&mode=walking";
//
//// get is a simple wrapper for request()
//// which sets the http method to GET
//var request = http.get(url, function (response) {
//    // data is streamed in chunks from the server
//    // so we have to handle the "data" event    
//    var buffer = "", 
//        data,
//        route;
//
//    response.on("data", function (chunk) {
//        buffer += chunk;
//    }); 
//
//    response.on("end", function (err) {
//        // finished transferring data
//        // dump the raw data
//        console.log(buffer);
//        console.log("\n");
//        data = JSON.parse(buffer);
//        route = data.routes[0];
//
//        // extract the distance and time
//        console.log("Walking Distance: " + route.legs[0].distance.text);
//        console.log("Time: " + route.legs[0].duration.text);
//    }); 
//}); 



//var options = {
//  host: "http://api.reverieinc.com/localization/localizeJSON",
//  port: 80,
//  path: '/resource?id=foo&bar=baz',
//  method: 'POST'
//};
//
//http.request(options, function(res) {
//  console.log('STATUS: ' + res.statusCode);
//  console.log('HEADERS: ' + JSON.stringify(res.headers));
//  res.setEncoding('utf8');
//  res.on('data', function (chunk) {
//    console.log('BODY: ' + chunk);
//  });
//}).end();


var Client = require('node-rest-client').Client;
 
var client = new Client();
 
// set content-type header and data as json in args parameter 

exports.findAll = function(req, res) {
	
	
    var args = {
  data: {"inArray": [
   "Hello"
 ],
 "REV-APP-ID": "hdfcsec.rev.itis.web",
 "REV-API-KEY": "1080755b20d90fb614a91e4cbd56c66c6842",
 "domain": 1,
 "inputLanguage": "english",
 "targetLanguage": "hindi",
 "webSdk": 0,
 "tokenize" : 0
},
  headers:{"Content-Type": "application/json"} 
};
 
client.post("http://api.reverieinc.com/localization/localizeJSON", args, function(data,response) {
    // parsed response body as js object 
    console.log(data);
	res.send(data);
    // raw response 
    //console.log(response);
});
	
};

 
// registering remote methods 
//client.registerMethod("postMethod", "http://remote.site/rest/json/method", "POST");
 
//client.methods.postMethod(args, function(data,response){
//    // parsed response body as js object 
//    console.log(data);
//    // raw response 
//    console.log(response);
//});