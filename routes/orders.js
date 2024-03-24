// routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // Adjust the path to your Order model
const axios = require("axios");
const Product = require("../models/Product");

// POST route to create an order
router.post("/add", async (req, res) => {
  try {
    const {
      userId,
      orderId,
      products,
      paymentStatus,
      total,
      status,
      shipping,
      box,
      address,
      paymentLink,
      tracking,
    } = req.body;

    // Validate input
    if (!userId || !orderId || !products || !Array.isArray(products)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Check if order with the given ID already exists
    const existingOrder = await Order.findOne({ orderId });

    if (existingOrder) {
      return res
        .status(409)
        .json({ message: "Order with the same ID already exists" });
    }

    // Create a new order
    const newOrder = new Order({
      userId,
      orderId,
      products,
      paymentStatus,
      total,
      status,
      shipping,
      box,
      address,
      paymentLink,
      tracking,
    });

    await newOrder.save();

    return res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/update", async (req, res) => {
  try {
    const { orderId, paymentStatus, status, tracking } = req.body;

    // Validate input
    if (!orderId) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Find and update the order
    const existingOrder = await Order.findOne({ orderId });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (paymentStatus) {
      existingOrder.paymentStatus = paymentStatus;
    }
    if (status) {
      existingOrder.status = status;
    }
    if (tracking) {
      existingOrder.tracking = tracking;
    }

    await existingOrder.save();
    if (paymentStatus) {
      if (paymentStatus === "Paid") {
        const productIds = existingOrder.products.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
        }));
        productIds.map(async (productId) => {
          const existingProduct = await Product.findOne({
            productId: productId.id,
          });

          if (existingProduct) {
            // Update existing product
            let updatedStock =
              parseInt(existingProduct.stock) - parseInt(productId.quantity);
            if(updatedStock < 0) {
              return res.status(400).json({ message: "Products out of Stock" });
            } else {
              existingProduct.stock = updatedStock;
              await existingProduct.save();
            }

           
          }
        });
      }
    }

    return res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/get", async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Find orders by userId
    const userOrders = await Order.find({ userId }).sort({ orderId: -1 });

    return res.status(200).json({ orders: userOrders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/geter", async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const randomDecimal = Math.random();
    const scaledNumber = Math.floor(randomDecimal * 3000);
    // Find address by userId
    setTimeout(() => {
      return res.status(200).json({ orders: [] });
    }, scaledNumber);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.route("/exec").post(function (req, res) {
  const options = {
    method: "POST",
    url: `https://sandbox.cashfree.com/pg/orders`,
    headers: {
      accept: "application/json",
      "x-client-id": "TEST10149202095f693cd23ea188989f20294101",
      "x-client-secret":
        "cfsk_ma_test_5fdf014335adfec5ea6f0daed5fe727a_d9e59d0c",
      "x-api-version": "2022-01-01",
      "content-type": "application/json",
    },
    data: {
      customer_details: {
        customer_id: req.body.order_id,
        customer_email: req.body.email,
        customer_phone: req.body.phone,
      },
      order_meta: {
        // return_url: `https://jimaquarium.com`,
        return_url: `http://localhost:3000`,
      },
      order_id: req.body.order_id,
      order_amount: req.body.amount,
      order_currency: "INR",
    },
  };
  axios
    .request(options)
    .then((response) => {
      console.log(response.status);
      if (response.status === 200) {
        res.send({
          message: "order added successfully",
          code: 200,
          data: response.data,
        });
      } else {
        res.send({ message: "failed", code: 400, err: "Something webt wrong" });
      }
    })
    .catch((err) => {
      res.send({ message: "failed", code: 400, err: err });
    });
});

router.route("/status").post(function (req, res) {
  const options = {
    method: "GET",
    url: `https://sandbox.cashfree.com/pg/orders/${req.body.order_id}/payments`,
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
    .then((response) => {
      if (response.status === 200) {
        res.send({
          data: response.data,
          code: 200,
        });
      } else {
        res.send({
          data: "Something went wrong",
          code: 400,
        });
      }
    })
    .catch((err) => {
      res.send({
        data: "Something went wrong",
        code: 400,
        err: err,
      });
    });
});

module.exports = router;
