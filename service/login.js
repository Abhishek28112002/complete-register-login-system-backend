const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});
const util = require("../utils/util");
const bcrypt = require("bcryptjs");
const auth = require("../utils/auth");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "login-backend";
async function LoggedInStatus (user){
   const username = user.username;

  const dynamoUser = await getUser(username.toLowerCase().trim());
   dynamoUser.loggedIn=new Date().getDate();
   const saveUserResponse = await saveUser(dynamoUser);
  const response = {
    status: "sucess",
  };
  return util.buildResponse(200, response);
}

async function login(user) {
  const username = user.username;
  const password = user.password;
  if (!user || !username || !password) {
    return util.buildResponse(401, {
      status:"fail",
      message: "username and password are required",
    });
  }

  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, {status:"fail",message: "user does not exist" });
  }

  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return util.buildResponse(403, {status:"fail", message: "password is incorrect" });
  }
  
dynamoUser.apptoken=user.apptoken;
 dynamoUser.loggedIn=new Date().getDate();
   const saveUserResponse = await saveUser(dynamoUser);
  const userInfo = {
    username: dynamoUser.username,
    name: dynamoUser.name,
    email:dynamoUser.email,
  
  };
  const token = auth.generateToken(userInfo);
  const response = {
    status: "sucess",
    user: userInfo,
    token: token,
  };
  return util.buildResponse(200, response);
}

async function getUser(username) {
  const params = {
    TableName: userTable,
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
async function saveUser(user) {
  const params = {
    TableName: userTable,
    Item: user
  }
  return await dynamodb.put(params).promise().then(() => {
    return true;
  }, error => {
    console.error('There is an error saving user: ', error)
  });
}

module.exports.login = login;
module.exports.LoggedInStatus=LoggedInStatus;