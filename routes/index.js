var express = require('express');
var router = express.Router();
var got = require('got');
var asyncMiddleware = require('../middleware/asyncMiddleware');
let setIntervalValue = undefined;
/* GET home page. */
router.get('/', asyncMiddleware(async (req, res) => {
  setIntervalValue = setInterval(async() => await healthCheck(), 3000)
  // try catch if error
  // res.send({title: 'Running health check', error:true});

  //else res.send({title: 'Running health check', error:false});
  res.send({title: 'Running health check', error:false});
}));

router.get('/stop', asyncMiddleware(async (req, res) => {
  clearInterval(setIntervalValue);
  res.send({title: 'Stopped running'});
}));

async function healthCheck() {
  let lastTimestamp = undefined;
  let gotResponse = undefined;
  try {
    gotResponse = await got('users', {prefixUrl: 'http://localhost:3000/'});
    lastTimestamp = new Date(gotResponse.timings.end);
  } catch (error) {
    console.log(error.response.body)
  }
  console.log(lastTimestamp);
  return gotResponse ? gotResponse.body : undefined;
}

module.exports = router;
