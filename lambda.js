/*jshint esversion: 8*/
require('dotenv').load();
const { google } = require('googleapis');
const googleAuth = require('./lib/google-auth');
const queryToSheet = require('./lib/query-to-sheet');

exports.handler = async (event, context) => {
  console.log('context: ', context);
  console.log('remaining time =', context.getRemainingTimeInMillis());

  if (process.env.LAMBDA_DEBUG_LOG) {
    console.log('LAMBDA EVENT', event);
  }
    if (!event.config){
      event.config=require('./config');
      console.log("Loading config from file");
    }
    if (!event.config) {
      throw new Error('config is required in either event or file');
    }
    try {
      const googleSheets = google.sheets({
        version: 'v4',
        auth: await googleAuth(),
      });
      for (const c of event.config) {
        await queryToSheet(googleSheets)(c);
        console.log('remaining time =', context.getRemainingTimeInMillis());
    }
    } catch (err) {
      console.log('error loading index: ', err);
      throw err;
    }

};
