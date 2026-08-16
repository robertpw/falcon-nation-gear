/**
 * Falcon Nation Gear order intake.
 *
 * This is a STANDALONE script — not created from inside Jen's spreadsheet —
 * so it lives in whoever's Google account deploys it (e.g. Preston's), and
 * just needs edit access to Jen's sheet, which she grants by sharing the
 * sheet the normal Google Sheets way. Jen never has to open Apps Script.
 *
 * Setup:
 * 1. Jen creates a Google Sheet and shares it (Editor access) with the
 *    Google account that will run this script.
 * 2. Paste the sheet's ID (from its URL, the long string between /d/ and
 *    /edit) into SHEET_ID below.
 * 3. Run setup() once from the Apps Script editor to create the tabs.
 * 4. Deploy As Web App (Execute as: Me, Who has access: Anyone), then
 *    paste the deployment URL into CONFIG.scriptUrl in index.html.
 */

var SHEET_ID = 'PASTE_JENS_SHEET_ID_HERE';
var ORDERS_SHEET = 'Orders';
var ITEMS_SHEET = 'Line Items';

function getSpreadsheet() {
  return SpreadsheetApp.openById(SHEET_ID);
}

function setup() {
  var ss = getSpreadsheet();

  var orders = ss.getSheetByName(ORDERS_SHEET) || ss.insertSheet(ORDERS_SHEET);
  orders.clear();
  orders.appendRow(['Timestamp', 'Order ID', 'Name', 'Player Name', 'Email', 'Phone', 'Total', 'Paid', 'Notes']);
  var checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  orders.getRange(2, 8, 998, 1).setDataValidation(checkboxRule);
  orders.setFrozenRows(1);
  orders.autoResizeColumns(1, 9);

  var items = ss.getSheetByName(ITEMS_SHEET) || ss.insertSheet(ITEMS_SHEET);
  items.clear();
  items.appendRow(['Timestamp', 'Order ID', 'Name', 'Product', 'Color', 'Size', 'Qty', 'Unit Price', 'Line Total']);
  items.setFrozenRows(1);
  items.autoResizeColumns(1, 9);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = getSpreadsheet();
  var ordersSheet = ss.getSheetByName(ORDERS_SHEET);
  var itemsSheet = ss.getSheetByName(ITEMS_SHEET);
  var timestamp = new Date();
  var fullName = data.firstName + ' ' + data.lastName;

  ordersSheet.appendRow([
    timestamp,
    data.orderId,
    fullName,
    data.playerName,
    data.email,
    data.phone,
    data.total,
    false,
    ''
  ]);

  (data.items || []).forEach(function (item) {
    itemsSheet.appendRow([
      timestamp,
      data.orderId,
      fullName,
      item.product,
      item.color,
      item.size,
      item.qty,
      item.unitPrice,
      item.lineTotal
    ]);
  });

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', orderId: data.orderId }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput('Falcon Nation Gear order intake is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}
