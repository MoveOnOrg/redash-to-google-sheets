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

    // Function to process batches of queries
    const processBatch = async (batch) => {
      await Promise.all(batch.map(queryToSheet(googleSheets)));
    };

    // Split queries into batches of 50
    // API says 60 a minute but still beem to be getting throttled
    const batchSize = 50;
    for (let i = 0; i < queries.length; i += batchSize) {
      const batch = queries.slice(i, i + batchSize);
      await processBatch(batch);
      if (i + batchSize < queries.length) {
        // Wait for 70 seconds before processing the next batch
        await new Promise(resolve => setTimeout(resolve, 70000));
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
})();
