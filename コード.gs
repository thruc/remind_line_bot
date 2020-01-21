var moment = Moment.load();
// プロパティ取得
var PROPERTIES = PropertiesService.getScriptProperties();//ファイル > プロジェクトのプロパティから設定した環境変数的なもの
//Google Driveの画像を保存するフォルダの設定
var GOOGLE_DRIVE_FOLDER_ID = PROPERTIES.getProperty('')//

function doPost(e) {
   var replyText,message,messageType;//リプライトークンとメッセージ
   var webhookData = JSON.parse(e.postData.contents);
   if(webhookData.events[0].type==='postback'){
      messageType="text"
      message=webhookData.events[0].postback.params.date;
      message=message.match(/\d+/g).join("/");
   }else{
     var messageId = webhookData.events[0].message.id;
     var lineImageUrl = "https://api.line.me/v2/bot/message/" + messageId + "/content/";//ユーザーから送られてきた画像のURL
     messageType = webhookData.events[0].message.type;//ユーザーが送ってきたメッセージのタイプ
   }
   var replyToken = webhookData.events[0].replyToken;//リプライトークン
   var userId = webhookData.events[0].source.userId;//ユーザーID
   var [wait,waitRow]=searchWait(userId);//返信待ちの状態と行を取得　wait=(1:日付確認待ち,2:日付入力待ち、３：品名入力待ち、4最終確認待ち、０：登録完了）
   var [wait_u,waitRow_u]=getWaitAndRow_u(userId);
   if(messageType==="text"){//messageがテキストの場合
       if(webhookData.events[0].type!=='postback'){
         message = webhookData.events[0].message.text;
         message =message.replace(/\r?\n/g, '');//改行削除
         message =message.replace(/\s+/g, "");//スペース削除
         message =zen2han(message)//半角に変換
       }
       
       if(message==='キャンセル'){
         if(wait_u==5){
           replyText ="削除ををキャンセルしました";
         }else if(wait_u==6){
           replyText ="確認ををキャンセルしました";
         }else{
           replyText ="登録をキャンセルしました";
           del(waitRow);//行を削除
         }
         setWait_u(waitRow_u,0)
         return sendLineMessageFromReplyToken(replyToken,replyText);
       }
       if(wait===1.0){
         if(message==='はい') {
           replyText = "次に登録する食品名を入力して下さい";
           setWait_u(waitRow_u,3)
           setWait(waitRow,3)//返信待ち状態３に変更
           return sendLineMessageFromReplyToken(replyToken,replyText) ;
         }else if(message==='いいえ'){
           replyText = "新しく日付を入力して下さい";
           setWait_u(waitRow_u,2)
           setWait(waitRow,2);//返信待ち状態２に変更
           return sendDatetimepicker(replyToken,replyText); 
         }else{
           replyText ="「はい」か「いいえ」を押して下さい\n「キャンセル」と入力すると登録を中断します";
           return sendLineQuickReplyMessageFromReplyToken2(replyToken, replyText);
         }
       }else if(wait===2.0){
         var expirationDate=getExpirationDate(message);//テキストから賞味期限の年/月/日の形で取り出し
         if (expirationDate < Moment.moment().format('YYYY/MM/DD')) {//賞味期限が過ぎていた場合
           replyText ="賞味期限が過ぎています";
           setWait_u(waitRow_u,0)
           del(waitRow);//賞味期限の行を削除
           return sendLineMessageFromReplyToken(replyToken,replyText) ;
         }else if(expirationDate){
           setRowDate(waitRow,expirationDate);
           setWait_u(waitRow_u,1)
           setWait(waitRow,1);//返信待ち状態1に変更
           var templateMessage="賞味期限は"+expirationDate+"でよろしいでしょうか";
           return sendLineQuickReplyMessageFromReplyToken2(replyToken, templateMessage);
         }
          replyText ="入力に誤りがあります\n正しい日付を入力して下さい\n「キャンセル」と入力すると登録を中断します";
          return sendDatetimepicker(replyToken,replyText); 
       }else if(wait===3.0){
         var date=new Date(getDateCell(waitRow).getValues());
         var expirationDate=Moment.moment(date).format('YYYY/MM/DD');
         templateMessage ="食品名:「"+message+"」\n賞味期限:"+expirationDate+"\n登録しますか？";
         setLabel(waitRow,message);
         setWait_u(waitRow_u,4)
         setWait(waitRow,4);//返信待ち状態4に変更
         return sendLineQuickReplyMessageFromReplyToken2(replyToken, templateMessage);
       }else if(wait===4.0){
         if(message==='はい') {
           var date=new Date(getDateCell(waitRow).getValues());
           var expirationDate=Moment.moment(date).format('YYYY/MM/DD');
           var label=getLabelCell(waitRow).getValues();
           replyText ="食品名:「"+label+"」\n賞味期限:"+expirationDate+"\n登録しました";
           setWait_u(waitRow_u,0)
           setWait(waitRow,0);//返信待ち状態0に変更
           return sendLineMessageFromReplyToken(replyToken,replyText) ;
         }else if(message==='いいえ'){
           replyText = "登録する食品名を入力して下さい";
           setWait(waitRow,3)//返信待ち状態３に変更
           setWait_u(waitRow_u,3)
           return sendLineMessageFromReplyToken(replyToken,replyText);
         }
         replyText ="「はい」か「いいえ」を入力して下さい\n「キャンセル」と入力すると登録を中断します";
         return sendLineMessageFromReplyToken(replyToken, replyText);
         
       }else if(wait_u===5) {
         if(parseInt(message.match(/[0-9０-９]/))){
           var allDataNum=getAllDataNum(userId);
           var num=parseInt(message.replace(/[^0-9]/g, ''));
           if(num<=allDataNum){
             deleteRow(userId,num);
             replyText = num+"番を削除しました";
             setWait_u(waitRow_u,0)
           }else{
             replyText ="現在食品は"+allDataNum+"個しか登録されていません。\n削除したい番号を入力して下さい\n「キャンセル」と入力すると削除を中断します";
           }
         }else{
           replyText = "削除したい番号を入力して下さい\n「キャンセル」と入力すると削除を中断します";
         }
          return sendLineMessageFromReplyToken(replyToken,replyText);
       }else if(wait_u===6) {
         if(parseInt(message.match(/[0-9０-９]/))){
           var allDataNum=getAllDataNum(userId);
           var num=parseInt(message.replace(/[^0-9]/g, ''));
           if(num<=allDataNum){
             var imageId=lookRow(userId,num);
             setWait_u(waitRow_u,0)
             var Text =num+"番を表示します";
             return sendLineImageAndMessageFromUserId(userId, Text,imageId);
           }else{
             replyText ="現在食品は"+allDataNum+"個しか登録されていません。\n確認したい番号を入力して下さい\n「キャンセル」と入力すると確認を中断します";
           }
         }else{
           replyText = "確認したい番号を入力して下さい\n「キャンセル」と入力すると確認を中断します";
         }
          return sendLineMessageFromReplyToken(replyToken,replyText); 
       }else if(message==='使い方'){
        // replyText ="登録したい食品の賞味期限の画像を送信することで画像から賞味期限を読み取ってくれます。その後食品名を送ると登録が完了します。\n登録された食品の賞味期限が切れる３日前、前日、当日に「あと〇日で「商品名」の賞味期限が切れます」というメッセージが送られてきます。\n登録されている情報を確認したい場合は「リスト」と送ると今まで登録した食品の一覧を表示します。「確認」と送信することで画像を確認できます。\nまた、食品を消費し登録されている情報から削除したい場合は「削除」と送信すること食品リストから削除できます";
         return sendLineHowToUseMessageFromReplyToken(replyToken);
       }else if(message==='登録') {
         replyText = "賞味期限が見えるように画像を送信してください";
         return sendLineQuickReplyMessageFromReplyToken1(replyToken, replyText);
       }else if(message==='リスト'){
         replyText = getAll(userId)+"以上です";
         return sendLineMessageFromReplyToken(replyToken,replyText);
       }else if(message==='削除'){
         replyText = getAll(userId)+'何番を削除しますか？';
         setWait_u(waitRow_u,5)
         return sendLineMessageFromReplyToken(replyToken,replyText);
       }else if(message==='確認'){
         replyText = getAll(userId)+'何番を確認しますか？';
         setWait_u(waitRow_u,6)
         return sendLineMessageFromReplyToken(replyToken,replyText);
       }else if(message.match(/[0-9０-９]を表示/)){
         var num=parseInt(message.match(/[0-9０-９]/));
         var imageId=lookRow(userId,num);
         var Text =num+"を表示します";
         return sendLineImageAndMessageFromUserId(userId, Text,imageId);
       }else{
             replyText ="賞味期限が見えるように画像を送信してください";
             return sendLineQuickReplyMessageFromReplyToken1(replyToken, replyText);
       }
   }else if(messageType==="image"){//messageが画像の場合
       if(wait==1){
         replyText ="「はい」か「いいえ」を入力して下さい\n「キャンセル」と入力すると登録を中断します";
         return sendLineQuickReplyMessageFromReplyToken2(replyToken, replyText);
       }else if(wait==2){
         replyText ="正しい日付を入力して下さい\n「キャンセル」と入力すると登録を中断します";
         return sendLineMessageFromReplyToken(replyToken, replyText);
       }else if(wait==3){
         replyText ="登録する食品名の名前を入力して下さい\n「キャンセル」と入力すると登録を中断します";
         return sendLineMessageFromReplyToken(replyToken, replyText);
       }else if(wait==4){
         replyText ="「はい」か「いいえ」を入力して下さい\n「キャンセル」と入力すると登録を中断します";
         return sendLineQuickReplyMessageFromReplyToken2(replyToken, replyText);
       }
       sendMsg(userId)
       var image=getImage(lineImageUrl);//ラインの画像取得
       
       var imageId=saveImageAndGetId(image);//画像をGoogleドライブに保存し画像を取得し画像IDを取得
       var [label,text]=vision(image);//VisionAPIにより画像からテキストとラベルを取得
       var expirationDate=getExpirationDate(text);//テキストから賞味期限の年/月/日の形で取り出し
       if(undefined===expirationDate||false===expirationDate){
         replyText ="賞味期限が読み取れませんでした\n日付を入力して下さい";
         setWait_u(waitRow_u,2)
         appendToSheet(userId,imageId,label,"1900/01/04","2");//新しい行にユーザーId、画像Id,品物の名前、賞味期限、返信待ち状態を挿入
         return sendDatetimepicker(replyToken,replyText); 
       }else if (expirationDate < Moment.moment().format('YYYY/MM/DD')) {//賞味期限が過ぎていた場合
         replyText ="賞味期限が過ぎています";
         return sendLineMessageFromReplyToken(replyToken, replyText);
       }
       setWait_u(waitRow_u,1)
       appendToSheet(userId,imageId,label,expirationDate,"1");//新しい行にユーザーId、画像Id,品物の名前、賞味期限、返信待ち状態を挿入
       var templateMessage="賞味期限は"+expirationDate+"でよろしいでしょうか\n「キャンセル」と入力すると\n登録を中断します";
       
       //return sendDatetimepicker(replyToken);
       return　sendLineQuickReplyMessageFromReplyToken2(replyToken, templateMessage);
       //return sendLineTemplateMessageFromReplyToken(replyToken,templateMessage) ;
     }else{
           if(wait==1){
             replyText ="「はい」か「いいえ」を入力して下さい\n「キャンセル」と入力すると登録を中断します";
             return sendLineQuickReplyMessageFromReplyToken2(replyToken, replyText);
           }else if(wait==2){
             replyText ="正しい日付を入力して下さい\n「キャンセル」と入力すると\n登録を中断します";
             return sendLineMessageFromReplyToken(replyToken, replyText);
           }else if(wait==3){
             replyText ="登録する食品名の名前を入力して下さい\n「キャンセル」と入力すると登録を中断します";
             return sendLineMessageFromReplyToken(replyToken, replyText);
           }else if(wait==4){
             replyText ="「はい」何か「いいえ」を入力して下さい\n「キャンセル」と入力すると登録を中断します";
             return sendLineQuickReplyMessageFromReplyToken2(replyToken, replyText);
           }else if(wait_u==5){
             replyText ="何番を削除するか入力して下さい\n「キャンセル」と入力すると削除を中断します";
             return sendLineMessageFromReplyToken(replyToken, replyText);
           }else if(wait_u==6){
             replyText ="何番を確認するか入力して下さい\n「キャンセル」と入力すると確認を中断します";
             return sendLineMessageFromReplyToken(replyToken, replyText);
           }else{
             replyText ="賞味期限が見えるように画像を送信してください";
             return sendLineQuickReplyMessageFromReplyToken1(replyToken, replyText);
           }
     }
    return;
}  


//リマインド機能
function remind(e) {
 var today=Moment.moment().format('YYYY/MM/DD');//今日の日付を取得
 var [row,col]=searchDateRowCol(today);//今日の日付から賞味期限の日付の行と列を検索
 var remindText;
 for(var i=0;i<row.length;i++){
   var label = getLabelCell(row[i]).getValue();
   var userid=getUserIdCell(row[i]).getValue();
   var lineImageUrl=getLineImageUrl(row[i]).getValue();
   switch (col[i]){//取得した列で賞味期限の何日前の日付か判断
    case 4:
      remindText = '今日で「' + label + '」の賞味期限が切れます';
      
      del(row[i]);//賞味期限の行を削除
      break;
    case 5:
      remindText ='明日で「' + label + '」の賞味期限が切れます';
      break;
    case 6:
      remindText = 'あと三日で「' + label + '」の賞味期限が切れます';
      break;
   }
   sendLineImageAndMessageFromUserId(userid, remindText,lineImageUrl);
   sleep(1);//一秒処理を停止
 }
 return;
}
//スリープ
function sleep(lateTime){//lateTimeの単位は秒
  var m = Moment.moment();
  var dt1 = m.seconds();
  var dt2 = m.seconds();
  Logger.log(dt2);
  while (dt2 < dt1 + lateTime){
    m = Moment.moment();
    dt2 = m.seconds();
  }
  return;
}
function error(){
}

//画像保存
function saveImageAndGetId(image){
 var fileName = 'product.jpg';
 // 画像を取得してGoogleドライブに保存
 var fileBlob =image.getBlob().setName(fileName);
 var folder = DriveApp.getFolderById("1ZHUWVPiO3y80noIILIBTyjtbDeacQMDP");
 var file = folder.createFile(fileBlob);  
 // 保存した画像に共有権を設定する (リンクを知っている全員が閲覧可)
 file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);  
 // 画像のファイルIDを取得する
 var fileId = file.getId();
 return fileId;
}
function zen2han(str) {
str = str.replace(/[０-９]/g, function (s) {
return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
})
return str;
}

/*ポストバックデータ受け取り
function post_back(e) {
  var data = e.postback.data;
  var replay_text = "";
  if (data == "postback selected") {
    replay_text = data;
  } else if (data == "datetimepicker selected") {
    replay_text = data + "\n" + e.postback.params['datetime'];
  }

  var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "text",
      "text": replay_text + "\n" + JSON.stringify(e.postback)
    }]
  };
  fetch_data(postData);
}*/