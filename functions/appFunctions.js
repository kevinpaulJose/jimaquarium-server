const Order = require("../models/Order");
const axios = require("axios");

const orderJob = async function checkOrder() {
  console.log("Running order cron");
  try {
    // Find orders by userId
    const userOrders = await Order.find({
      paymentStatus: "Payment Processing",
    });
    console.log(userOrders);
    userOrders.map((order) => {
      const options = {
        method: "GET",
        url: `https://api.cashfree.com/pg/links/${order.orderId}`,
        headers: {
          accept: "application/json",
          // "x-client-id": "TEST10149202095f693cd23ea188989f20294101",
          "x-client-id": "648837e3016086c32ac96fc7fc738846",
          // "x-client-secret":
          //   "cfsk_ma_test_5fdf014335adfec5ea6f0daed5fe727a_d9e59d0c",
          "x-client-secret":
            "cfsk_ma_prod_d7af3bd06840368dec08fa8442aa4e0a_48123b3d",
          "x-api-version": "2023-08-01",
        },
      };
      axios
        .request(options)
        .then(async (response) => {
          if (response.status === 200) {
            let paymentStatus = response?.data?.link_status;
            if (paymentStatus === "PAID") {
              const existingOrder = await Order.findOne({
                orderId: order.orderId,
              });
              if (existingOrder) {
                existingOrder.paymentStatus = "Paid";
                console.log("Saving Paid order");
                await existingOrder.save();
              }
            } else if (
              paymentStatus === "EXPIRED" ||
              paymentStatus === "TERMINATED" ||
              paymentStatus === "TERMINATION_REQUESTED"
            ) {
              const existingOrder = await Order.findOne({
                orderId: order.orderId,
              });
              if (existingOrder) {
                existingOrder.paymentStatus = "Failed";
                console.log("Saving un-Paid order");
                await existingOrder.save();
              }
            }
            // res.send({
            //   data: response.data,
            //   code: 200,
            // });
          } else {
            console.log("err", response);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
    console.log("Cron ran");
  } catch (error) {
    console.log(error);
  }
};

module.exports = orderJob;
