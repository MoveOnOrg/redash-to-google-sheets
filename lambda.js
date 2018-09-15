const { google } = require('googleapis');
const googleAuth = require('./lib/google-auth');
const queryToSheet = require('./lib/query-to-sheet');

exports.handler = async (event, context) => {
  console.log('context: ', context);
  console.log('remaining time =', context.getRemainingTimeInMillis());

  if (process.env.LAMBDA_DEBUG_LOG) {
    console.log('LAMBDA EVENT', event);
  }

  if (event.env) {
    Object.entries(event.env).forEach((a) => {
      process.env[a] = event.env[a];
      console.log('processing events env');
    });
  }

  if (!event.command) {
    console.log('no event command, running script');

    if (!event.config) throw new Error('event.config is required');

    try {
      const googleSheets = google.sheets({
        version: 'v4',
        auth: await googleAuth(),
      });

      await queryToSheet(googleSheets)(event.config);

      console.log('done index');
      console.log('remaining time =', context.getRemainingTimeInMillis());
    } catch (err) {
      console.log('error loading index: ', err);
      throw err;
    }
  } else {
    console.log(event.command);
  }
};
