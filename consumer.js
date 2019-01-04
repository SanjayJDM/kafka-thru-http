var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(),
    consumer = new Consumer(client,
        [{ topic: 'Post', offset: 0}],
        {
            autoCommit: false
        }
    );
var Client = require('node-rest-client').Client;


var restClient = new Client();
 

// registering remote methods
/*client.registerMethod("postMethod", "http://remote.site/rest/json/method", "POST");
 
client.methods.postMethod(args, function (data, response) {
    // parsed response body as js object
    console.log(data);
    // raw response
    console.log(response);
});*/

///Calling a rest webhook url on the event of message
var arr = [];
consumer.on('message', function (message) {
    arr.push(message.value);
});


consumer.on('error', function (err) {
    console.log('Error:',err);
})

consumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange:',err);
})

//Get Endpoint

const url = require('url');

app.get('/getMsg',function(req,res){
    var urlParts = url.parse(req.url, true);
    var parameters = urlParts.query;
    var num = parameters.msgNumber;
    res.json(arr[num])
});

app.get('/',function(req,res){
    res.json({greeting:'Kafka Consumer'})
});

app.listen(5002,function(){
    console.log('Kafka consumer running at 5002')
})