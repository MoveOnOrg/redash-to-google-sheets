const { JWT } = require('googleapis').google.auth;

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

// Need to delegate to a user in the domain, so use 'redash.to.sheets.service@moveon.org' created for this purpose.
module.exports = async () => {
  const jwtClient = new JWT(clientEmail, null, privateKey, [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive',
  ],
clientEmail);

  await jwtClient.authorize();

  return jwtClient;
};
