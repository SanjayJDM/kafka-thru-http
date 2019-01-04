# kafka-thru-http
Welcome to the KAFKA THROUGH HTTP Wiki!

### Issues

* Different versions of Messaging systems, Cross consuming Topics seems to be a pain. especially when you do not adapt to the versions class in the consuming library be it TIBCO/SNS/ or even KAFKA
* With KAFKA: A Consumer should always be in the listening front and cannot be notified as KAFKA is more of a PULL than a PUSH. 
* Messaging systems contained in different platforms (Cloud - AWS/Azure/TPC/.. or On-Premises) and allowing them to cross-talk


### Solution*
![KAFKA NODE ](https://github.com/SanjayJDM/kafka-thru-http/blob/master/HTTP-MESSAGE.png)

**Identity Connect:** The calls for Http Rest Wrapper for Producer and Consumer should be authorised by identity. This will be done by passing a service token along with the request.

***
##  MORE ON THE PoC

### KAFKA
I guess most of us are aware of the advantages that KAFKA brings - it's a distributed messaging service/ system -  providing highly scalable, highly available and resilient messaging architecture through a pub-sub model.

More on Kafka - [https://kafka.apache.org/intro](https://kafka.apache.org/intro)

Download Kafka here - https://kafka.apache.org/downloads
***
**MAKING THE PoC RUN!!**

### Installing and Running 

Kafka uses ZooKeeper so we may have to first start a ZooKeeper server. 

on Why Zookeeper? : https://www.quora.com/What-is-the-actual-role-of-ZooKeeper-in-Kafka/answer/Gwen-Shapira
 
 Run the following command to start ZooKeeper: 

> `$ bin/zookeeper-server-start.sh config/zookeeper.properties`

 Run the following command to start Kafka: 

> `$ bin/kafka-server-start.sh config/server.properties`
***
### Playing with the Topics a bit

Create a sample topic

> `$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic Posts`

Check the available topics

> `$bin/kafka-topics.sh --list --zookeeper localhost:2181`

Use kafka-console-producer to send a message

> `$ bin/kafka-console-producer.sh --broker-list localhost:9092 --topic Posts`
***
### Running the code

To run the code and since its node based, installing Node is a must

Download Node here - https://nodejs.org/en/download/

PS: I have used > [kafka-node](https://www.npmjs.com/package/kafka-node) as a Node.js client with Zookeeper integration for Apache Kafka 0.8.1 and later.

Download the code: _producer.js_ , _consumer.js_ and _package.json_ locally 

Run them with the following commands :

> `node producer.js`

go to Postman or Curl and check if the message can be sent to Topics. Remember to fetch the message number/id from the response. This will be used to fetch the exact message through the http consumer

> `curl -X POST \
>   http://localhost:5001/sendMsg \
>   -H 'cache-control: no-cache' \
>   -H 'content-type: application/json' \
>   -d '{
> 	"topic":"Posts",
> 	"message":"hello from a http producer"
> }'`

![KAFKA NODE ](https://github.dev.global.tesco.org/yx74/KAFKA-NODE-REST/blob/master/HTTPProducer-Postman.png)
***

now run the http consumer:

> `node consumer.js`

To Check the consumer - go to Postman or Curl and retrieve the messages that was sent from the Http Producer

> `curl -X GET \`
>   `'http://localhost:5002/getMsg?msgNumber=0' \`
>   `-H 'cache-control: no-cache' \`
>   `-H 'content-type: application/json' `

![KAFKA NODE ](https://github.dev.global.tesco.org/yx74/KAFKA-NODE-REST/blob/master/HTTPConsumer-Postman.png)
***

### Implementing Callbacks / Webhook.

Download the code : _callback_consumer.js_ , _config.yml_ , _restserver.js_ and  _restserver_3001.js_

> _callback_consumer.js_ : A consumer used for callback.

Looking up for topics: 

> `consumer = new Consumer(client,`
>         `[{ topic: 'Post', offset: 0},{ topic: 'Posts', offset: 0}],`
>         `{`
>             `autoCommit: false`
>         `}`
>     `);`
__________________________________________________________________________________________________________________
> _config.yml_ : Acts as the register to add URL's

> `default:`
>   `callback:`
>     `post: 'http://localhost:**3000**/webhook/update?myParam='`
>     `posts: 'http://localhost:**3001**/webhook/update?myParam='`
__________________________________________________________________________________________________________________
  
Starting the local webservers -  3001 and 3000

> `node restserver.js`
and
> `node restserver_3001.js`

The rest server will return messages that was invoked by the Callback Consumer.
***
