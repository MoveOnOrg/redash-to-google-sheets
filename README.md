# Redash to Google Sheets

This Node.js script fetches Redash query results and inserts them into a specified Google Sheet via API.

[Google Sheets Node.js API Reference](https://developers.google.com/sheets/api/quickstart/nodejs)

### Getting started

1. [Create a new Google API Project](https://console.developers.google.com/projectcreate).

2. Enable [Sheets API](https://console.developers.google.com/apis/api/sheets.googleapis.com/overview) in your new project.

3. Create Service Account Key:

      * Under `Credentials` click `Create credentials`.
      * Select `Service account key`.
      * Create `New service account` if needed (for Role, the limited Project > Viewer works).
      * `Key type` should be JSON.
      * Click `Create` and download the `credentials.json` file.

  * If you already have a Service Account Key created, but do not have the Private Key, you will need to create another by selecting the existing Service Account, select `Edit`, and then `+ Create Key` to generate another `credentials.json` file.

4. Copy `.env.example` to `.env` then copy/paste `client_email` => `GOOGLE_CLIENT_EMAIL` and `private_key` => `GOOGLE_PRIVATE_KEY` (do not modify this at all).

5. Add the value of `GOOGLE_CLIENT_EMAIL` with Edit permissions to any Google Sheet(s) that will be used with this script.

6. Run `npm i` from within the project directory root.

7. Copy `config.example.js` to `config.js` and enter appropriate `redashCsvUrl`, `spreadsheetId`, and `sheetId` values. It's an array of config objects so you can run multiple query to spreadsheet syncs.  `redashCsvUrl` should probably be an http:// URL, unless you want to edit this program so it can use the VPN certificate.

      * [See Redash docs for getting "Results in CSV format" query URL with API Key](https://redash.io/help/user-guide/querying/download-query-results)

      * [See Spreadsheet ID and Sheet ID in the Google docs](https://developers.google.com/sheets/api/guides/concepts).

8. Run `npm test`.

      * If your Redash instance is hosted behind a VPN you will need to be logged in or the tests will timeout.

      * Otherwise, if tests fail your `.env` and `config.js` values likely need to be fixed.

9. To run script locally or in traditional server deployment, run `npm start`.


### Amazon Lambda
From the command line, install Claudia, then run:
`claudia create --region $region --handler lambda.handler --role $role`
#### Make sure to:

1. Set your Lambda Node.js version to v12.x

4. Configure Lambda to have access to VPN resources if Redash is hosted behind VPN.
