const request = require('request-promise-native');

module.exports = googleSheets => async ({
  redashCsvUrl, spreadsheetId, sheetId, sheetName, append = false
}, queryIndex) => {
  try {
    if (!redashCsvUrl || !spreadsheetId || typeof sheetId !== 'number') {
      throw new Error(
        `Query index ${queryIndex || 0} missing required config.js value.`,
      );
    }

    if (append) {
      let allData = await request(redashCsvUrl)
      allData = allData.split(/\r/)
      let data = allData[1].replace(/\n/, '').split(',')
      await googleSheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:A`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
      resource:{
        values: [data]}
        })
    } else {

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
    }

  } catch (err) {
    // don't end the entire script, just log / return (for testing) and continue
    let queryId = 'unknown';
    if (typeof redashCsvUrl === 'string') {
      const queryIdMatch = redashCsvUrl.match(/queries\/(\d+)/);
      queryId = queryIdMatch ? queryIdMatch[1] : 'unknown';
    }

    console.log(`Query ${queryIndex || 0} (RedashQueryID: ${queryId}) Error - ${err.message}`);

    return err;
  }
};
