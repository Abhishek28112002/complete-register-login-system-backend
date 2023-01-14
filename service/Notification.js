const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});
 var request = require('request');
const util = require("../utils/util");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "login-backend";
async function Notification(){
    const allexpotoken=await getrecord();
    const dateObj=new Date();
    var datenow=dateObj.setDate(dateObj.getDate()-1);
  datenow=new Date(datenow).getDate();
console.log(allexpotoken.body.Items);
   await allexpotoken.body.Items.forEach(async user=> {
       console.log(user.loggedIn,datenow==user.loggedIn,user.apptoken);
        if(user.loggedIn && datenow==user.loggedIn && user.apptoken)
        {
        await allexpotoken.body.Items.forEach(async adminuser=> {
            if(adminuser.admin){
                const apptoken2=adminuser.apptoken;
           await  request.post(
    'https://exp.host/--/api/v2/push/send',
    { body: JSON.stringify({"to":JSON.parse(apptoken2),
              'title':"DOJU",
              'body': `${user.username}` + " haven't logedIn since last 24 hours"}),
              headers:{
                  'Accept': 'application/json',
'Content-Type': 'application/json'
              }},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
        
        if(error)console.log(error);
        else if(response)
        console.log(response)
    }
)
}
});
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
module.exports.Notification= Notification;