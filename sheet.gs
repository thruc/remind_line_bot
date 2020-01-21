var moment = Moment.load();
var spreadsheet = SpreadsheetApp.openById("");
var sheet = spreadsheet.getSheetByName("webhook");
var sheet2 = spreadsheet.getSheetByName("webhook2");
//返信待ち状態の値を挿入
function setWait(row,num){
  sheet.getRange(row, 7).setValue(num);
}
//品物の名前を挿入
function setLabel(row,label){
  sheet.getRange(row, 3).setValue(label);
}
//賞味期限と賞味期限の一日前と三日前の日付けを挿入
function setRowDate(row,expirainDate){
  var m = Moment.moment(expirainDate);
  sheet.getRange(row, 4).setValue(m.format('YYYY/MM/DD'));
  m.date(m.date()-1);
  sheet.getRange(row, 5).setValue(m.format('YYYY/MM/DD'));
  m.date(m.date()-2);
  sheet.getRange(row, 6).setValue(m.format('YYYY/MM/DD'));
}

function appendToSheet(userID,lineImageUrl,label,expirainDate,wait) {
  var m = Moment.moment(expirainDate);
  var date1=m.format('YYYY/MM/DD');
  var date2=m.date(m.date()+1).format('YYYY/MM/DD');
  var date3=m.date(m.date()+2).format('YYYY/MM/DD');
  sheet.appendRow([userID,lineImageUrl,label,date1,date2,date3,wait]);
}


function getFromRowCol(sheetName, row, col) {
 var dat = sheet.getDataRange().getValues();
 return dat[row][col];
}
function getUserIdCell(row) {
 return sheet.getRange(row, 1);
}
function getLineImageUrl(row) {
 return sheet.getRange(row, 2);
}
function getLabelCell(row) {
 return sheet.getRange(row, 3);
}

function getDateCell(row) {
 return sheet.getRange(row, 4);
}
//指定されたユーザーのすべての行を取得
function getAll(userid){
  var all="";
  var count=0;
  var dat = sheet2.getDataRange().getValues();
  for(var i=0;i<dat.length; i++){
    if(userid===dat[i][0]){
    count++;
      all=all+count+"："+dat[i][2]+"："+getYMD(dat[i][3])+"\n";
    }
  }
   return all;
}
function getAllDataNum(userid){
  var count=0;
  var dat = sheet.getDataRange().getValues();
  for(var i=0;i<dat.length; i++){
    if(userid===dat[i][0]){
    count++;
    }
  }
   return count;
}
//列を削除
function del(row){
  sheet.deleteRows(row);
}
//指定されたユーザーの指定された列の削除
function deleteRow(userid,num){
  var count=0;
  var dat = sheet.getDataRange().getValues();
  for(var i=0;i<dat.length; i++){
    if(userid===dat[i][0]){
      count++;
      if(count===num){
        sheet.deleteRows(i+1);
      }
    }
  }
  
   return count;
}
//指定されたユーザーの指定された列の画像IDを取得
function lookRow(userid,num){
  var count=0;
  var dat = sheet.getDataRange().getValues();
  for(var i=0;i<dat.length; i++){
    if(userid===dat[i][0]){
      count++;
      if(count===num){
        var imageId=dat[i][1];
      }
    }
  }
  
   return imageId;
}
//返信待ち状態の確認
function searchWait(userId){
  var dat = sheet.getDataRange().getValues();
  for(var i=0;i<dat.length; i++){
    if(userId===dat[i][0]){
      if(parseInt(dat[i][6])!==0){
        return [dat[i][6],i+1];
      }
  　} 
 }
 return [0,0];
}

//リマインドする必要がある行を今日の日付によって検索
function searchDateRowCol(dateYMD) {
 //受け取ったシートのデータを二次元配列に取得
 var dat = sheet.getDataRange().getValues();
 var row=[];
 var col=[];
 var count=0;
 for(var c=3;c<6;c++){
   for (var i = 0; i < dat.length; i++) {
     var expirationDate=getYMD(dat[i][c])
     if (expirationDate === dateYMD) {
       row[count]=i+1;
       col[count]=c+1;
       count++;
     }
   }
 }
 return [row,col];
}
