var express = require('express');
var router = express.Router();
const axios = require('axios');
const readExcelToJSON = require('../functions/bulkUpload');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).send({ status: "working" })

});

router.get('/bulk', function (req, res, next) {
  readExcelToJSON("functions/bulk_product.xlsx", "functions/images")
    .then((data) => {
      // console.log(data[0]);



      data.map(async product => {
        const options = {
          method: "POST",
          url: "http://localhost:1212/api/products/add",
          data: product
        };
        await axios.request(options).then(response => { console.log(response.data); }).catch(e => { console.log(e); });
      })

      res.status(200).send({ status: "working" })
    })
    .catch((error) => {
      res.status(200).send({ status: "not - working", error: error })
      console.error(error);
    });
})

router.get('/pulse', function (req, res, next) {
  res.status(200).send({ status: "working" })
});

router.get('/getOrderDetails', function (req, res, next) {
  res.status(200).send({ order: "Order Placed" })
});

router.get('/runPulse', function (req, res, next) {
  let intervalId = null; // This will hold the reference to the interval
  let count = 0;
  // Function to start the interval
  function startInterval() {
    function repeatFunction() {
      console.log("Running " + count + " time..")
      // Replace 'https://your-api-endpoint.com' with the actual API endpoint
      axios.get('https://server-1vb8.onrender.com/pulse')
        .then(response => {
          console.log('API Response:', response?.data);
          // Handle the successful API response here
        })
        .catch(error => {
          console.error('Error calling API:', error);
          // Handle the error here
        });
    }
    if (intervalId === null) {
      intervalId = setInterval(() => {
        repeatFunction();
        count = count + 1;
      }, 20000); // Set to run every minute
    }
  }

  // Function to check if the interval is running
  function isIntervalRunning() {
    return intervalId !== null;
  }

  // Function to stop the interval
  // function stopInterval() {
  //   if (intervalId !== null) {
  //     clearInterval(intervalId);
  //     intervalId = null;
  //   }
  // }

  // Example usage
  if (!isIntervalRunning())
    startInterval(); // Start the interval
  console.log(isIntervalRunning()); // Check if it's running, should return true// Stop the interval
  console.log(isIntervalRunning()); // Check again, should return false


  if (isIntervalRunning()) {
    res.status(200).send({ status: "Pulse running " + count + " times" })
  } else {
    res.status(200).send({ status: "Pulse not running" })
  }

});

module.exports = router;
