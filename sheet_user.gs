var moment = Moment.load();
var spreadsheet_u = SpreadsheetApp.openById("");
var sheet_u = spreadsheet_u.getSheetByName("wait");

function setWait_u(row,num){
  sheet_u.getRange(row, 2).setValue(num);
}

function getWaitAndRow_u(userId){
  var dat = sheet_u.getDataRange().getValues();
  for(var i=0;i<dat.length; i++){
    if(userId===dat[i][0]){
       return [dat[i][1],i+1];
  　} 
 }
 sheet_u.appendRow([userId,0]);
 dat = sheet_u.getDataRange().getValues();
 for(var i=0;i<dat.length; i++){
    if(userId===dat[i][0]){
       return [dat[i][1],i+1];
  　} 
 }
 return [0,10];
}
function userdel(userId){
  for(var i=0;i<dat.length; i++){
    if(userId===dat[i][0]){
       sheet_u.deleteRows(i+1);
  　} 
 }

}
