const request = require('request-promise-native');

module.exports = googleSheets => async ({
  redashCsvUrl, spreadsheetId, sheetId,
}, queryIndex) => {
  try {
    if (!redashCsvUrl || !spreadsheetId || typeof sheetId !== 'number') {
      throw new Error(
        `Query index ${queryIndex || 0} missing required config.js value.`,
      );
    }

    // clear values and paste csv in one API call
    await googleSheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          { // clear values from specified sheet
            updateCells: {
              range: { sheetId },
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
              data: await request(redashCsvUrl),
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
