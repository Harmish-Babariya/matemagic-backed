
const { Facebook } = require('fb');

const facebookAppId = 'YOUR_FACEBOOK_APP_ID';
const facebookAppSecret = 'YOUR_FACEBOOK_APP_SECRET';
const fb = new Facebook({ appId: facebookAppId, appSecret: facebookAppSecret });

module.exports = fb;