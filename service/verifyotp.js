const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "200030003@iitdh.ac.in", pass: "qeigjxgpabotvajh" },
});
const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});
const util = require("../utils/util");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const otptable = "otp-users";
async function verifyotp(userInfo) {
const username = userInfo.username;
const otp = userInfo.otp;
  try {
    const userOtp = await getotp(username);
    if (!userOtp)
      return util.buildResponse(503, {
        status: "ERROR",
        message: "OTP is not valid",
      });
    if (userOtp.expiresAt < Date.now())
      return util.buildResponse(503, {
        status: "ERROR",
        message: "OTP has expired",
      });
    return util.buildResponse(503, {
      status: "sucess",
      message: "OTP verified",
    });
  } catch (err) {
    return util.buildResponse(503, {
      status: "ERROR",
      message: err.message,
    });
  }
}

async function getotp(username) {
  const params = {
    TableName: otptable,
    Key: {
      username: username,
    },
  };

  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        return response.Item;
      },
      (error) => {
        console.error("There is an error getting user: ", error);
      }
    );
}
module.exports.verifyotp = verifyotp;
