function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('Image Placer')
    .addItem('Open Sidebar', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Image Placer');
  SpreadsheetApp.getUi().showSidebar(html);
}

function getSelectedRange() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getActiveRange();
  if (!range) return '';
  return range.getA1Notation();
}

function parseCellRange(rangeStr) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cells = [];
  var parts = rangeStr.split(',');
  for (var p = 0; p < parts.length; p++) {
    var range = sheet.getRange(parts[p].trim());
    var numRows = range.getNumRows();
    var numCols = range.getNumColumns();
    var startRow = range.getRow();
    var startCol = range.getColumn();
    for (var i = 0; i < numRows; i++) {
      for (var j = 0; j < numCols; j++) {
        cells.push(sheet.getRange(startRow + i, startCol + j).getA1Notation());
      }
    }
  }
  if (cells.length > 100) cells = cells.slice(0, 100);
  return cells;
}

function searchDriveImages(query) {
  var results = [];
  var searchQuery = "mimeType contains 'image/'";
  if (query && query.trim() !== '') {
    searchQuery += " and title contains '" + query.replace(/'/g, "\\'") + "'";
  }
  searchQuery += " and trashed = false";

  var files = DriveApp.searchFiles(searchQuery);
  var count = 0;
  while (files.hasNext() && count < 50) {
    var file = files.next();
    var fileId = file.getId();
    results.push({
      id: fileId,
      name: file.getName(),
      thumb: 'https://lh3.googleusercontent.com/d/' + fileId + '=s100',
      url: 'https://lh3.googleusercontent.com/d/' + fileId
    });
    count++;
  }
  return results;
}

function insertImages(mappings) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var success = 0;
  var errors = [];

  for (var i = 0; i < mappings.length; i++) {
    var m = mappings[i];
    try {
      // Ensure Drive files are publicly viewable so IMAGE() can load them
      var driveMatch = m.url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/) ||
                       m.url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (driveMatch) {
        try {
          var file = DriveApp.getFileById(driveMatch[1]);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (shareErr) {
          // File might not be owned by user, continue anyway
        }
      }
      var cell = sheet.getRange(m.a1);
      cell.setFormula('=IMAGE("' + m.url + '")');
      success++;
    } catch (e) {
      errors.push({ a1: m.a1, message: e.message });
    }
  }

  return { success: success, errors: errors };
}
