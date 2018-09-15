require('dotenv').load();
const { google } = require('googleapis');
const googleAuth = require('./lib/google-auth');
const queries = require('./config');
const queryToSheet = require('./lib/query-to-sheet');

(async () => {
  try {
    const googleSheets = google.sheets({
      version: 'v4',
      auth: await googleAuth(),
    });

    await Promise.all(queries.map(queryToSheet(googleSheets)));
  } catch (err) {
    console.log(err);
    throw err;
  }
})();
