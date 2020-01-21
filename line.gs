// プロパティ取得
var PROPERTIES = PropertiesService.getScriptProperties();//ファイル > プロジェクトのプロパティから設定した環境変数的なもの
//Google Driveの画像を保存するフォルダの設定
var originalBase = 'https://drive.google.com/uc?export=view&id=';
var previewBase  = 'https://drive.google.com/thumbnail?sz=w240-h240&id=';
var GOOGLE_DRIVE_FOLDER_ID = PROPERTIES.getProperty('')//
//LINEのアクセストークン
var channel_access_token = "";
//ヘッダー
var headers = {
   "Content-Type": "application/json; charset=UTF-8",
   "Authorization": "Bearer " + channel_access_token
};

//テキスト返信
function sendLineMessageFromReplyToken(token, replyText) {
 var url = "https://api.line.me/v2/bot/message/reply";
 var postData = {
   "replyToken": token,
   "messages": [{
     "type": "text",
     "text": replyText
   }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}
//クイックリプライ1
function sendLineQuickReplyMessageFromReplyToken1(token, replyText) {
 var url = "https://api.line.me/v2/bot/message/reply";
 var postData = {
   "replyToken": token,
   "messages": [{
    "type": "text", // ①
    "text": replyText,
    "quickReply": { // ②
      "items": [
        
        {
          "type": "action", // ④
          "action": {  
             "type":"camera",
             "label":"Camera"
          }
        },
        {
          "type": "action",
          "action": {  
             "type":"cameraRoll",
             "label":"Camera roll"
          }
        }
      ]
    }
  }]
 }
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
};
//クイックリプライ2
function sendLineQuickReplyMessageFromReplyToken2(token, replyText) {
 var url = "https://api.line.me/v2/bot/message/reply";
 var postData = {
   "replyToken": token,
   "messages": [{
    "type": "text", // ①
    "text": replyText,
    "quickReply": { // ②
      "items": [
        {
          "type": "action", // ③
          "action": {
            "type": "message",
            "label": "はい",
            "text": "はい"
          }
        },
        {
          "type": "action",
          "action": {
            "type": "message",
            "label": "いいえ",
            "text": "いいえ"
          }
        },
        {
          "type": "action",
          "action": {
            "type": "message",
            "label": "キャンセル",
            "text": "キャンセル"
          }
        }
      ]
    }
  }]
 };
 
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}

//タイムピッカーポストバック
function sendDatetimepicker(token,expirationDate) {
var url = "https://api.line.me/v2/bot/message/reply";
  var postData = {
   "replyToken": token,
   "messages": [{
        "type": "template",
        "altText": "this is a buttons template",
        "template": {
            "type": "buttons",
            "title": "賞味期限の日付",
            "text": expirationDate,
            "actions": [
                
                {
                  "type": "datetimepicker",
                  "label": "ここを押して日付を選択",
                  "mode": "date",
                  "data": "action=datetemp&selectId=1"
                }
            ]
        }
    }]
 }

 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}
//テンプレートメッセージ送信
function sendLineTemplateMessageFromReplyToken(token,templateMessage) {
 var url = "https://api.line.me/v2/bot/message/reply";
 var postData = {
   "replyToken": token,
   "messages": [{
     "type": "template",
     "altText": "this is a confirm template",
     "template": {
       "type": "confirm",
       "actions": [
          {
            "type": "message",
            "label": "はい",
            "text": "はい"
          },
          {
            "type": "message",
            "label": "いいえ",
            "text": "いいえ"
          }
       ],
        "text": templateMessage
     }
   }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}

//
function sendLineMessageFromUserId(userId, text) {
 var url = "https://api.line.me/v2/bot/message/push";
 var postData = {
   "to": userId,
   "messages": [{
     "type": "text",
     "text": text
   }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}

function sendLineImageAndMessageFromUserId(userId, text,lineImageUrl) {
 var url = "https://api.line.me/v2/bot/message/push";
 var postData = {
   "to": userId,
   "messages": [{
     "type": "text",
     "text": text
   },
   {
      'type'              : 'image',
      'originalContentUrl': originalBase + lineImageUrl,
      'previewImageUrl'   : previewBase  + lineImageUrl
    }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}
function sendMsg(userId) {
 var url = "https://api.line.me/v2/bot/message/push";
 var postData = {
   "to": userId,
   "messages": [{
     "type": "text",
     "text": "画像を読み取り中です。"
   }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}
//画像取得
function getImage(lineImageUrl){
 //messageIdを使い画像のＵＲＬ取得
 var options = {
   "headers": headers,
   'method': 'get'
 };
 return UrlFetchApp.fetch(lineImageUrl,options);
}
//テキスト返信
function sendLineHowToUseMessageFromReplyToken(token) {
 var url = "https://api.line.me/v2/bot/message/reply";
 var postData = {
   "replyToken": token,
   "messages": [
     {
     "type": "text",
     "text": "登録したい商品の賞味期限の画像を送信することで画像から賞味期限を読み取ってくれます。その後食品名を送ると登録が完了します"
     },
     {
     "type": "text",
     "text": "登録された食品の賞味期限が切れる３日前、前日、当日に「あと〇日で(商品名)の賞味期限が切れます」というメッセージが送られてきます"
     },
     {
     "type": "text",
     "text": "登録されている情報を確認したい場合は「リスト」と送ると今まで登録した食品の一覧を表示します。「確認」と送信することで画像を確認できます。"
     },
     {
     "type": "text",
     "text": "また、食品を消費し登録されている情報から削除したい場合は「削除」と送信すること食品リストから削除できます"
     }
    ]
    };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}

/*クイックリプライ見本
function sendLineQuickReplyMessageFromReplyToken(token, replyText) {
 var url = "https://api.line.me/v2/bot/message/reply";
 var postData = {
   "replyToken": token,
   "messages": [{
    "type": "text", // ①
    "text": "Select your favorite food category or send me your location!",
    "quickReply": { // ②
      "items": [
        {
          "type": "action", // ③
          "imageUrl": "https://example.com/sushi.png",
          "action": {
            "type": "message",
            "label": "Sushi",
            "text": "Sushi"
          }
        },
        {
          "type": "action",
          "imageUrl": "https://example.com/tempura.png",
          "action": {
            "type": "message",
            "label": "Tempura",
            "text": "Tempura"
          }
        },
        {
          "type": "action", // ④
          "action": {
            "type": "location",
            "label": "Send location"
          }
        },
        {
          "type": "action", // ④
          "action": {  
             "type":"camera",
             "label":"Camera"
           }
        },
        {
          "type": "action", // ④
          "action": {  
             "type":"datetimepicker",
             "label":"Select date",
             "data":"storeId=12345",
             "mode":"datetime",
             "initial":"2017-12-25t00:00",
             "max":"2018-01-24t23:59",
             "min":"2017-12-25t00:00"
          }
        }
      ]
    }
  }]
 };*/
