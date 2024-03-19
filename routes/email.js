var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')

// const transporter = nodemailer.createTransport({
//   port: 465,
//   host: "smtp.gmail.com",
//   auth: {
//     user: "jimaquarium@gmail.com",
//     pass: "ranjithfish"
//   },
//   secure: false
// });
const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.zoho.in",
  auth: {
    user: "payments@shoppersite.online",
    pass: "75a20d4f71@B"
  },
  secure: true
});

router.post('/send-mail', (req, res) => {
  const {to, subject, text} = req.body;
  const mailData = {
    from: "payments@shoppersite.online",
    to: to,
    subject: subject,
    text: text,
    html: '<b>Hey There!</b>'
  };
  transporter.sendMail(mailData, (error, info) => {
    if(error) {
      res.status(400).send({message: "Error sending Email"})
      return console.log(error)
    }
    res.status(200).send({message: "Mail sent", message_id: info.messageId})
  })
})

module.exports = router;
