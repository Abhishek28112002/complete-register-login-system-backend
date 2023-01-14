const registerService = require('./service/register');
const loginService = require('./service/login');
const addrecordService = require('./service/addrecord');
const getrecordService = require('./service/getrecord');
const resetpasswordervice = require('./service/resetpassword');
const verifyService=require('./service/verifyotp');
const sendotpservice= require('./service/sendotp')
const translatorService=require('./service/Translator');
const util = require('./utils/util');
const healthPath = '/record';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verifyotp';
const sendotp='/sendotp';
const LoggedInPath='/loggedin';
const notificationpath='/notification';
const Notification= require('./service/Notification');
const resetpasswordpath='/resetpassword'
const TranslatorPath='/translate'
exports.handler = async (event) => {
    console.log('Request Event: ', event);
    let response;
    switch(true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = await getrecordService.getrecord();
            break;
        case event.httpMethod === 'POST' && event.path === healthPath:
            const recordBody = JSON.parse(event.body);
            response = await addrecordService.addrecord(recordBody);
            break;
        case event.httpMethod === 'POST' && event.path === TranslatorPath:
            const locationBody = JSON.parse(event.body);
            response = await translatorService.ChangeText(locationBody);
            break;
        case event.httpMethod === 'POST' && event.path === LoggedInPath:
        const LoggedBody = JSON.parse(event.body);
        response = await  loginService.LoggedInStatus(LoggedBody);
        break;
         case event.httpMethod === 'POST' && event.path === resetpasswordpath:
            const user = JSON.parse(event.body);
            response = await resetpasswordervice.resetpassword(user);
            break;
        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody);
            break;
        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
            break;
        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = verifyService.verifyotp(verifyBody);
            break;
        case event.httpMethod === 'POST' && event.path === sendotp:
            const otpBody = JSON.parse(event.body);
            response = sendotpservice.sendotp(otpBody);
            break;
         case event.httpMethod === 'POST' && event.path === notificationpath:
            // const otpBody = JSON.parse(event.body);
            response = Notification.Notification();
            break;
        default:
            response = util.buildResponse(404, '404 Not Found');
    }
   
    return response;
};
