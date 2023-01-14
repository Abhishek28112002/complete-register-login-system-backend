const {Translate} = require('@google-cloud/translate').v2;
const AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-south-1'
})
const util = require('../utils/util');

const translate = new Translate("spheric-wonder-369408");

async function ChangeText(data) {
 
  const text = data.text;

  
  const target = 'hi';

  
  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
  return util.buildResponse(401, {
    status:"sucess",
    message: `${translation}`  })

}
 module.exports.ChangeText= ChangeText;
 