const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
var nodemailer = require("nodemailer");

const app = express();
const router = express.Router();
app.use(cors());

router.get("/", (req, res) => {
  res.json({
    hello: "hi!",
  });
});

router.post("/mail", async (req, res) => {
  const frommail = "gutterguard.company@gmail.com";
  const password = "mshmhdklisaylrol";
  const tomail = "sales@gutterguard.company";
  var transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: frommail,
      pass: password,
    },
  });

  var mailOptions = {
    from: frommail,
    to: tomail,
    subject: "Gutterguard customer query",
    text: `Hello ${req.body.to_name},

    You got a consultation request from ${req.body.first_name} ${req.body.last_name}:
    
    Full Name: ${req.body.first_name} ${req.body.last_name}
    
    Phone: ${req.body.phone}
    
    Email: ${req.body.email}
    
    Adrdess: ${req.body.address}
    
    Thanks,
    
    ${req.body.first_name} ${req.body.last_name}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log({ error });
      res.json({
        msg: "fail",
      });
    } else {
      res.json({
        msg: "success",
      });
    }
  });
});
app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
