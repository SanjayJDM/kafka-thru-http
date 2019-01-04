var yaml_config = require('node-yaml-config');
var config = yaml_config.load('config.yml');

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
        [{ topic: 'Post', offset: 0},{ topic: 'Posts', offset: 0}],
        {
            autoCommit: false
        }
    );
var Client = require('node-rest-client').Client;


var restClient = new Client();

///Calling a rest webhook url on the event of message
var arr = [];
consumer.on('message', function (message) {
    arr.push(message);
    //Gets invoked when a message arrives
    invokeCallBack();
});



function invokeCallBack(){
    // Check for appropriate Topic and invoke the call back
    if (arr[arr.length-1].topic == 'post'){
        // call back urls  - configured (registry)
        restClient.get(config.callback.post+arr[arr.length-1].value, function (data, response) {}); 
    }

    /*More such Topics
     if (arr[arr.length-1].topic == '<TopicName>'){
        // call back urls  - configured (registry)
        restClient.get(config.callback.<TopicName>+arr[arr.length-1].value, function (data, response) {}); 
    } */
}

consumer.on('error', function (err) {
    console.log('Error:',err);
})

consumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange:',err);
})



/******* Get Endpoint -- uncomment if needed
const url = require('url');

app.get('/getMsg',function(req,res){
    var urlParts = url.parse(req.url, true);
    var parameters = urlParts.query;
    var num = parameters.msgNumber;
    res.json(arr[num])
});

app.get('/',function(req,res){
    res.json({greeting:'Call Back Consumer'})
});
********************/

app.listen(5003,function(){
    console.log('Call back consumer running at 5003')
})