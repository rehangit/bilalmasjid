function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getData() {
  var id = DocumentApp.getActiveDocument().getId();
  var url = "https://docs.google.com/document/d/" + id + "/export?format=html";
  var param = { method: "get" };
  var html = UrlFetchApp.fetch(url);
  return html.getContentText();
}

function test() {
  Logger.log(getData());
}
