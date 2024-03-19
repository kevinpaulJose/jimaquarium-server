const axios = require('axios');
const APP_URL = require('./constants')


const heartbeat = function heartBeat() {
    const endPoints = [{ uri: `${APP_URL}/getOrderDetails`, method: 'GET', body: {} },
    { uri: `${APP_URL}/api/cart/geter`, method: 'POST', body: { userId: "bkevi19@gmail.com" } },
    {
        uri: `${APP_URL}/api/orders/geter`, method: 'POST', body: {
            userId: "bkevi19@gmail.com"
        }
    },
    { uri: `${APP_URL}/api/address/geter`, method: 'POST', body: { userId: "bkevi19@gmail.com" } },
    ];
    // Replace 'https://your-api-endpoint.com' with the actual API endpoint
    const randomDecimal = Math.random();
    const scaledNumber = Math.floor(randomDecimal * endPoints.length);
    const options = {
        method: endPoints[scaledNumber].method,
        url: endPoints[scaledNumber].uri,
        data: endPoints[scaledNumber].body
    };
    console.log("Requesting for - ", options);
    axios.request(options).then(response => {}).catch(e =>{});
}

module.exports = heartbeat;