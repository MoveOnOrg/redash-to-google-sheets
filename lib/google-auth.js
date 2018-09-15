const { JWT } = require('googleapis').google.auth;

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

module.exports = async () => {
  const jwtClient = new JWT(clientEmail, null, privateKey, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);

  await jwtClient.authorize();

  return jwtClient;
};
