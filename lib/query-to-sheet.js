/*jshint esversion: 8*/
const request = require('request-promise-native');

module.exports = googleSheets => async ({
  redashCsvUrl, spreadsheetId, sheetId, redashApiKey
}, queryIndex) => {
  try {
    if (!redashCsvUrl || !spreadsheetId || typeof sheetId !== 'number') {
      throw new Error(
        `Query index ${queryIndex || 0} missing required config.js value.`,
      );
    }
    redashRefreshUrl=redashCsvUrl.replace("results.csv","refresh");
    redashRefreshUrl=redashRefreshUrl.substring(0,redashRefreshUrl.indexOf("?"));
    await request.post({
      url: redashRefreshUrl,
      headers: { 
      'Authorization': 'Key '+redashApiKey
     },
     method: 'POST'
    });

    data = await request(redashCsvUrl);
    row1 = data.split('\n',1)[0];
    // Will always count at least 1 col, even if there are none
    numCols = (row1.match(/,/g) || []).length+1;

    // clear values and paste csv in one API call
    await googleSheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          { // clear only the columns to be overwritten
            updateCells: {
              range: { 'sheetId':sheetId, 'startColumnIndex':0,'endColumnIndex':numCols},
              fields: 'userEnteredValue',
            },
          },
          { // paste CSV contents using first cell as anchor
            pasteData: {
              coordinate: {
                sheetId,
                rowIndex: 0,
                columnIndex: 0,
              },
              type: 'PASTE_VALUES',
              delimiter: ',',
              data: data,
            },
          },
        ],
      },
    });

    return null;
  } catch (err) {
    // don't end the entire script, just log / return (for testing) and continue
    console.log(`Query ${queryIndex || 0} Error - ${err.message}`);
    return err;
  }
};
