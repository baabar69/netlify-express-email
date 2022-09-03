const express = require("express");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const cors = require("cors");
var nodemailer = require("nodemailer");

const app = express();
const router = express.Router();
app.use(cors());

var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: "*/*" }));

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

  // console.log({ req: req.body });

  var mailOptions = {
    from: frommail,
    to: tomail,
    subject: "Gutterguard customer query",
    text: `Hello Gutterguard team,

    You got a consultation request from ${req.body.first_name} ${req.body.last_name}:
    
    Full Name: ${req.body.first_name} ${req.body.last_name}
    
    Phone: ${req.body.phone}
    
    Email: ${req.body.email}
    
    Adrdess: ${req.body.address}
    
    Postal Code: ${req.body.postal_code}
    
    Thanks,`,
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
