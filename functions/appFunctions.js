const Order = require("../models/Order");
const axios = require("axios");


const orderJob = async function checkOrder() {
    try {
        // Find orders by userId
        const userOrders = await Order.find({ paymentStatus: "Processing Payment" });
        userOrders.map((order) => {
            const options = {
                method: "GET",
                url: `https://sandbox.cashfree.com/pg/orders/${order.orderId}/payments`,
                headers: {
                    accept: "application/json",
                    "x-client-id": "TEST10149202095f693cd23ea188989f20294101",
                    "x-client-secret":
                        "cfsk_ma_test_5fdf014335adfec5ea6f0daed5fe727a_d9e59d0c",
                    "x-api-version": "2022-01-01",
                },
            };
            axios
                .request(options)
                .then(async (response) => {
                    if (response.status === 200) {
                        if (response?.data?.length > 0) {
                            if (response?.data[0]?.payment_status === "SUCCESS") {
                                const existingOrder = await Order.findOne({ orderId: order.orderId });
                                if (existingOrder) {
                                    existingOrder.paymentStatus = "Paid";
                                    await existingOrder.save();
                                }

                            } else if(response?.data[0]?.payment_status === "FAILED") {
                                const existingOrder = await Order.findOne({ orderId: order.orderId });
                                if (existingOrder) {
                                    existingOrder.paymentStatus = "Failed";
                                    await existingOrder.save();
                                }
                            }
                        }
                    } else {
                        console.log("err");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        console.log("Cron ran");
    } catch (error) {
        console.log(error);
    }
}

module.exports = orderJob;