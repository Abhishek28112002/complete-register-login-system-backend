const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "200030003@iitdh.ac.in", pass: "qeigjxgpabotvajh" },
});

const util = require("../utils/util");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const recordTable = "otp-users";
async function sendotp(userInfo) {
  const email = userInfo.email;
  
    const otp = Math.floor(Math.random() * 100000);
    const mailOptions = {
      from: "200030003@iitdh.ac.in", 
      to: email,
      subject: "OTP Verification for Doju App ", 
      html:"<b>Your OTP is " + otp +  "</b>" 
    };

    const userOtp = {
      username: userInfo.username,
      email: "200030003@iitdh.ac.in",
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };
    const saveUserResponse = await saveOtp(userOtp);
    console.log("saver",saveUserResponse);
   const response = await new Promise((rsv, rjt) => {
transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return rjt(error)
        } 
        rsv('Email sent'); 
    });
});

  return util.buildResponse(200, {
    status: "sucess",
    message:"OTP sent to your mail",
  });

}
async function saveOtp(user) {
  const params = {
    TableName: recordTable,
    Item: user,
  };
  return await dynamodb
    .put(params)
    .promise()
    .then(
      (response) => {
        return true;
      },
      (error) => {
        console.error("There is an error saving user: ", error);
      }
    );
}
module.exports.sendotp = sendotp;
