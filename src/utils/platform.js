const rc = require('ringcentral');
const fs = require('fs');

const dbUtil = require('../utils/db')
const REDIRECT_HOST = process.env.REDIRECT_HOST;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const RINGCENTRAL_ENV = process.env.RINGCENTRAL_ENV;
const TOKEN_TEMP_FILE = '.bot-auth';


rcsdk = new rc({
    server: RINGCENTRAL_ENV,
    appKey: CLIENT_ID,
    appSecret: CLIENT_SECRET
});

platform = rcsdk.platform();
// if (fs.existsSync(TOKEN_TEMP_FILE)) {
//     console.log('setting keys');
//     var data = JSON.parse(fs.readFileSync(TOKEN_TEMP_FILE));
//     console.log("Reusing access key from cache: " + data.access_token)
//     platform.auth().setData(data);
// }

// const setToken = async () => {

//     const token = await dbUtil.getToken
//     console.log('+++token+++',token);
//     return token;
// }

( async () => {
    try {

        const token = await dbUtil.getToken()
        console.log('tokens');
        // console.log('+++token+++', token.rows[0]);
        if (token !== undefined) {
            console.log("Reusing access key from cache: " + token.rows[0].access_token)
            platform.auth().setData(token.rows[0]);
        }
        
    } catch (error) {
        console.log(error);
    }


})();

module.exports = platform;