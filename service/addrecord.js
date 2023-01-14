const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});
const util = require("../utils/util");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const recordTable = "doju-backend-record";
const userTable = "login-backend";
 var request = require('request');
async function addrecord(userInfo) {
  const username = userInfo.name;
  const userId=userInfo.userId;
  var url='https://img.icons8.com/color/70/000000/administrator-male.png';
  if(userInfo.url!="")
  url=userInfo.url;
  const user = {
    userId:userId,
    username: userInfo.name,
    fathername: userInfo.fatherName,
    address: userInfo.address,
    city:userInfo.city,
    mobile: userInfo.mobile,
    imei: userInfo.imei,
    fir: userInfo.fir,
    section:userInfo.section,
    age:userInfo.age,
      courtname:userInfo.courtname,
      releasedfirdate:userInfo.releasedfirdate,
      stationname:userInfo.stationname,
    description: userInfo.description,
    chassNumber: userInfo.chassNumber,
    engilneNumber: userInfo.engilneNumber,
    image:url,
    date:Date.now()
  };
  const dynamoUser = await getUser(userId.toLowerCase().trim());
  if(!dynamoUser.admin)
 {  const response = {
    status: "fail",
    message: "You cann't add data",
  };
   return util.buildResponse(503, response);
 }
  const saveUserResponse = await saveUser(user);
  if (!saveUserResponse) {
    return util.buildResponse(503, {
      message: "Server Error. Please try again later.",
    });
  }
  const response = {
    status: "sucess",
    username: username,
  };
  await sendnotification(userId);
  return util.buildResponse(200, response);
}

  async function sendnotification(AdminUsername){
    const allexpotoken=await getrecord();
   allexpotoken.body.Items.forEach(async user=> {
     if(user.apptoken){
             const apptoken2=await user.apptoken;
             console.log(apptoken2)
            request.post(
    'https://exp.host/--/api/v2/push/send',
   { body: JSON.stringify({"to":JSON.parse(apptoken2),
              'title':"DOJU",
              'body': `${AdminUsername}` + " added New Record"}),
              headers:{
                  'Accept': 'application/json',
'Content-Type': 'application/json'
              }},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }
);
}
    })
    return util.buildResponse(200, {status:"sucess"});

}

async function getrecord() {
  const params = {
    TableName: userTable
  }
  const response = await dynamodb.scan({
    TableName: userTable,
  })
  .promise()
   return {
     body:response
   }
}

async function saveUser(user) {
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

module.exports.addrecord = addrecord;

