const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;


// all routes prefixed with /api
app.use('/webhook', router);

// using router.get() to prefix our path
// url: http://localhost:3000/api/
router.get('/', (request, response) => {
  response.json({message: 'Hello, welcome to the server 3000'});
});

const url = require('url');

router.get('/update', (request, response) => {
  var urlParts = url.parse(request.url, true);
  var parameters = urlParts.query;
  var myParam = parameters.myParam;
  // e.g. myVenues = 12;
  
  var myResponse = `(${myParam})`;
  console.log('Recieved', myResponse);
  response.json({message: myResponse});
});

// set the server to listen on port 3000
app.listen(port, () => console.log(`Listening on port ${port}`));