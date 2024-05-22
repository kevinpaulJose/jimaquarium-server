// routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // Adjust the path to your Order model
const axios = require("axios");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const { google } = require("googleapis");
const fs = require("fs");
const SCOPES = ["https://mail.google.com/"];

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
    console.log(req.body)

    // Validate input
    if (!orderId) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Find and update the order
    const existingOrder = await Order.findOne({ orderId });
    const existimePayment = existingOrder?.paymentStatus;
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
    const outOfStockProducts = [];
    await existingOrder.save();
    try {
      if (paymentStatus) {
        console.log(paymentStatus, existimePayment);
        if (paymentStatus === "Paid" && existimePayment !== "Paid") {
          const productIds = existingOrder.products.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
          }));
          for (let productId in productIds) {

            const existingProduct = await Product.findOne({
              productId: productIds[productId].productId,
            });
            console.log(productId);
            if (existingProduct) {
              // Update existing product
              let updatedStock =
                parseInt(existingProduct.stock) -
                parseInt(productIds[productId].quantity);
              if (updatedStock < 0) {
                existingOrder.paymentStatus = existimePayment;
                await existingOrder.save();
                return res
                  .status(200)
                  .json({ message: "Products are out of Stock" });
                // outOfStockProducts.push(productId);
              } else {
                existingProduct.stock = updatedStock;
                console.log("Updated stock - " + updatedStock);
                existingProduct.updated = Date.now();
                await existingProduct.save();
              }
            }
          }
          // await Promise.all(
          //   productIds.map(async (productId) => {

          //   })
          // );
        }
        return res.status(200).json({ message: "Order updated successfully" });
      } else {
        return res.status(200).json({ message: "Order updated successfully" });
      }
      //   if (outOfStockProducts.length > 0) {
      //     return res.status(400).json({
      //         message: "The following products are out of stock:",
      //         products: outOfStockProducts
      //     });
      // } else {

      // }
    } catch (e) {
      console.log(e);
      // return res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.log(error);
    // return res.status(500).json({ error: error.message });
  }
});

router.post("/get", async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: "Invalid input" });
    }

    let userOrders = [];
    // Find orders by userId
    if (userId === "bkevin1999@gmail.com") {
      userOrders = await Order.find().sort({ orderId: -1 });
    } else {
      userOrders = await Order.find({ userId }).sort({ orderId: -1 });
    }

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
  // console.log(req.body); const now = new Date();
  const now = new Date();
 now.setMinutes(now.getMinutes() + 8);
//  now.setMinutes(now.getMinutes() + 1);
//  const offset = now.getTimezoneOffset();
//  const sign = offset < 0 ? "+" : "-";
//  const absOffset = Math.abs(offset);
//  const hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
//  const minutes = String(absOffset % 60).padStart(2, "0");
//  const finalTime = `${now.toISOString().slice(0, 19)}${sign}${hours}:${minutes}`;
// console.log(finalTime);
  const options = {
    method: "POST",
    url: `https://sandbox.cashfree.com/pg/links`,
    // url: `https://api.cashfree.com/pg/links`,
    headers: {
      accept: "application/json",
      "x-client-id": "TEST10149202095f693cd23ea188989f20294101",
      // "x-client-id": "648837e3016086c32ac96fc7fc738846",
      "x-client-secret":
        "cfsk_ma_test_5fdf014335adfec5ea6f0daed5fe727a_d9e59d0c",
      // "x-client-secret":
      //   "cfsk_ma_prod_d7af3bd06840368dec08fa8442aa4e0a_48123b3d",
      "x-api-version": "2023-08-01",
      "content-type": "application/json",
    },
    data: {
      customer_details: {
        // customer_id: req.body.order_id,
        customer_email: req.body.email,
        customer_phone: req.body.phone,
      },
      link_notify: {
        "send_sms": true,
        "send_email": true
      },
      link_id: req.body.order_id,
      link_amount: req.body.amount,
      link_currency: "INR",
      link_purpose: `Payment for order ${req.body.order_id}`,
      link_expiry_time: now.toISOString()
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
          data: { amount: response?.data?.link_amount, 
            status: response?.data?.link_status, 
            payment_link: response?.data?.link_url },
        });
      } else {
        res.send({ message: "failed", code: 400, err: "Something webt wrong" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "failed", code: 400, err: err });
    });
});

router.route("/status").post(function (req, res) {
  const options = {
    method: "GET",
    url: `https://sandbox.cashfree.com/pg/links/${req.body.order_id}`,
    // url: `https://api.cashfree.com/pg/links/${req.body.order_id}`,
    headers: {
      accept: "application/json",
      "x-client-id": "TEST10149202095f693cd23ea188989f20294101",
      // "x-client-id": "648837e3016086c32ac96fc7fc738846",
      "x-client-secret":
        "cfsk_ma_test_5fdf014335adfec5ea6f0daed5fe727a_d9e59d0c",
      // "x-client-secret": "cfsk_ma_prod_d7af3bd06840368dec08fa8442aa4e0a_48123b3d",
      "x-api-version": "2023-08-01",
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

router.route("/setToken").post(async function (req, res) {
  try {
    const clientId =
      "357833561847-4io9ge4sg1g0sgcoh1tmh0v95b5uv65n.apps.googleusercontent.com";
    const clientSecret = "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";
    const redirectUri = "https://jimaquarium.com/token"; // Update for your redirect URI
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );
    const tokenPath = "token.json";
    const { tokens } = await oauth2Client.getToken(req.body.code);
    await fs.promises.writeFile(tokenPath, JSON.stringify(tokens));
    console.log("Token stored to", tokenPath);
    res.send({
      message: "Token set successfully",
      code: 200,
    });
  } catch (e) {
    console.log(e);
    res.send({
      message: "Token send failed",
      code: 200,
      error: e,
    });
  }
});
router.route("/generateToken").get(async function (req, res) {
  const clientId =
    "357833561847-4io9ge4sg1g0sgcoh1tmh0v95b5uv65n.apps.googleusercontent.com";
  const clientSecret = "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";
  const redirectUri = "https://jimaquarium.com/token"; // Update for your redirect URI

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log(authUrl);
    res.send({
      message: "URL Generated",
      code: 200,
      url: authUrl,
    });
  } catch (e) {
    res.send({
      message: "Token generation failed",
      code: 200,
      error: e,
    });
  }
});

router.route("/status_email").post(async function (req, res) {
  // Replace with your credentials
  const clientId =
    "357833561847-4io9ge4sg1g0sgcoh1tmh0v95b5uv65n.apps.googleusercontent.com";
  const clientSecret = "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";
  const redirectUri = "https://jimaquarium.com"; // Update for your redirect URI

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  // Check if token file exists
  const tokenPath = "token.json";
  try {
    const content = await fs.promises.readFile(tokenPath);
    oauth2Client.setCredentials(JSON.parse(content));
  } catch (err) {
    // const authUrl = oauth2Client.generateAuthUrl({
    //   access_type: 'offline',
    //   scope: SCOPES,
    // });
    // console.log('Authorize this app by visiting this url:', authUrl);
    res.send({
      message: "No Creds set",
      code: 200,
      error: err,
    });

    //  const code = await new Promise((resolve) => {
    //    const readline = require('readline').createInterface({
    //      input: process.stdin,
    //      output: process.stdout,
    //    });
    //    readline.question('Enter the code from that page here: ', (code) => {
    //      resolve(code);
    //      readline.close();
    //    });
    //  });
    //  const { tokens } = await oauth2Client.getToken(code);
    //  // Store the tokens to disk
    //  await fs.promises.writeFile(tokenPath, JSON.stringify(tokens));
    //  console.log('Token stored to', tokenPath);
  }
  try {
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const listLabels = await gmail.users.labels.list({
      userId: "me",
    });
    console.log("Labels:", listLabels.data.labels);

    const listMessages = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"], // Update for desired label
      // q: `subject: *"${keyword}*`,
    });

    let messageIds = listMessages.data.messages
      ? listMessages.data.messages
      : [];

    if (messageIds.length) {
      messageIds = messageIds.slice(0, 5);
      console.log("Messages:");
      let hasValue = false;
      for (const id of messageIds) {
        const message = await gmail.users.messages.get({
          userId: "me",
          id: id.id,
        });
        const subject = message.data.payload.headers.find((h) => h.name === "Subject").value;
        console.log(
          ` - ${subject
          } - ${req.body.amount}`
        );
        hasValue = hasValue ? true : subject?.includes(req.body.amount);
        console.log("Hasvalue", hasValue);
      }
      if (hasValue) {
        res.send({
          message: "Payment Successful",
          code: 200,
        });
      } else {
        res.send({
          message: "Pending",
          code: 200,
        });
      }
    } else {
      res.send({
        message: "Pending",
        code: 200,
      });
    }
  } catch (e) {
    res.send({
      message: "No Creds set",
      code: 200,
      error: e,
    });
  }
});

router.get('/getUniqueID', async (req, res) => {
  try {
    const recentEntries = await Payment.find()
      .sort({ _id: -1 })
      .limit(24);


    while (true) {
      let unique = true;
      let newCode = Math.floor(Math.random() * 25).toString();
      recentEntries.map(entry => {
        console.log(entry.code, "is matched with", newCode);
        if (entry.code === newCode) {
          unique = false
        }
      });
      if (unique) {
        await Payment({ code: newCode }).save();
        res.json({ code: newCode });
        break;
      }
    }

    // while (recentEntries.findIndex(entry => (entry.code === newCode)) >=0 ) {
    //   newCode = Math.floor(Math.random() * 10);
    // }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate unique ID' });
  }
});


module.exports = router;
