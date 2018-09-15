require('dotenv').load();
const assert = require('assert');
const request = require('request-promise-native');
const { google } = require('googleapis');
const queries = require('./config');
const googleAuth = require('./lib/google-auth');
const queryToSheet = require('./lib/query-to-sheet');

describe('run script', () => {
  let auth = null;

  it('retrieves authenticated Google JWT Client', async () => {
    auth = await googleAuth();
    assert.ok(auth.credentials.access_token);
  }).timeout(5000);


  it('has valid config objects and Redash queries', async () => (
    Promise.all(queries.map(async ({
      redashCsvUrl, spreadsheetId, sheetId,
    }, queryIndex) => {
      try {
        const queryResults = await request(redashCsvUrl);

        assert.ok(typeof queryResults === 'string');

        const sheet = await google.sheets({
          version: 'v4',
          auth,
        }).spreadsheets.get({ spreadsheetId });

        assert.equal(sheet.statusText, 'OK');

        assert.ok(sheet.data.sheets.find(({ properties }) => (
          properties.sheetId === sheetId
        )));
      } catch (err) {
        throw new Error(`query index ${queryIndex} - ${err.message}`);
      }
    }))
  )).timeout(10000);

  it('returns no errors from syncing', async () => {
    const errors = await Promise.all(queries.map(
      queryToSheet(google.sheets({
        version: 'v4',
        auth,
      })),
    ));

    assert.ok(!errors.find(err => err));
  }).timeout(10000);
});
