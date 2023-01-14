const AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-south-1'
})
const util = require('../utils/util');
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'login-backend'

async function resetpassword(userInfo) {
  const username = userInfo.username;
  const password = userInfo.password;
  if (!username ||  !password) {
    return util.buildResponse(401, {
      status:"fail",
      message: 'All fields are required'
    })
  }

  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (dynamoUser && dynamoUser.username) {
        const encryptedPW = bcrypt.hashSync(password.trim(), 10);
        dynamoUser.password=encryptedPW;

  const saveUserResponse = await saveUser(dynamoUser);
  if (!saveUserResponse) {
    return util.buildResponse(503, {status:"fail", message: 'Server Error. Please try again later.'});
  }
  const response = {
    status:'sucess',
    user: userInfo,
    message:"password changed"

  }

  return util.buildResponse(200, response);
    
  }
  else
  {
      return util.buildResponse(401, {
        status:"fail",
      message: 'username does not exists in our database. please choose a different username'
    })
  }


}

async function getUser(username) {
  const params = {
    TableName: userTable,
    Key: {
      username: username
    }
  }

  return await dynamodb.get(params).promise().then(response => {
    return response.Item;
  }, error => {
    console.error('There is an error getting user: ', error);
  })
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

module.exports.resetpassword= resetpassword;