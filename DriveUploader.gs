var FOLDER_NAME = 'ImageSetPlace_Uploads';

function getOrCreateFolder() {
  var folders = DriveApp.getRootFolder().getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.getRootFolder().createFolder(FOLDER_NAME);
}

function uploadFileToDrive(fileData) {
  var folder = getOrCreateFolder();
  var decoded = Utilities.base64Decode(fileData.base64);
  var blob = Utilities.newBlob(decoded, fileData.mimeType, fileData.name);
  var file = folder.createFile(blob);

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  var fileId = file.getId();
  var url = 'https://lh3.googleusercontent.com/d/' + fileId;

  return { url: url, name: fileData.name };
}
