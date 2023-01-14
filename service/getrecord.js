const AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-south-1'
})
const util = require('../utils/util');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'doju-backend-record'

async function getrecord() {
  const params = {
    TableName: userTable
  }
  const response = await dynamodb.scan({
    TableName: userTable,
  })
  .promise()
   return {
     body:JSON.stringify(response)
   }
}

module.exports.getrecord=getrecord;

