var moment = Moment.load();

function getExpirationDate1(text){
    // 年/月/日の形式のみ許容する
    if(!text.match(/\d{4}\/\d{1,2}\/\d{1,2}/)){
        return false;
    } 
    var d=text.match(/\d{4}\/\d{1,2}\/\d{1,2}/)
    // 日付変換された日付が入力値と同じ事を確認
    // new Date()の引数に不正な日付が入力された場合、相当する日付に変換されてしまうため
    var m = Moment.moment(d[0]);  
    if(m.year() !=  d[0].split("/")[0] 
        || m.month() != d[0].split("/")[1] - 1 
        || m.date() != d[0].split("/")[2]
    ){
        return false;
    }

    return m;
}
function getExpirationDate2(text){
    // 年/月/日の形式のみ許容する
    if(!text.match(/\d{2}\/\d{1,2}\/\d{1,2}/)){
        return false;
    }
    var d=text.match(/\d{2}\/\d{1,2}\/\d{1,2}/);
    d[0]="20"+d[0];
    // 日付変換された日付が入力値と同じ事を確認
    var m = Moment.moment(d[0]);  
    if(m.year() !=  d[0].split("/")[0] 
        || m.month() != d[0].split("/")[1] - 1 
        || m.date() != d[0].split("/")[2]
    ){
        return false;
    }

    return m;
}
function getExpirationDate3(text){
    // 年/月の形式のみ許容する
    if(!text.match(/\d{4}\/\d{1,2}/)){
        return false;
    } 
    var d=text.match(/\d{4}\/\d{1,2}/);
     var date=d[0];
     d[0]=d[0]+"/28";//日付を月の最後の日付に設定
    // 日付変換された日付が入力値と同じ事を確認
    var m = Moment.moment(d[0]);  
    if(m.year() !=  d[0].split("/")[0] 
        || m.month() != d[0].split("/")[1] - 1 
    ){
        return false;
    }
    month=m.month();
    switch (month-1) {
      case 1:
        date+="/31";
        break;
      case 2:
        date+="/28";
        break;
      case 3:
        date+="/31";
        break;
      case 4:
        date+="/30";
        break;
      case 5:
        date+="/31";
        break;
      case 6:
        date+="/30";
        break;
      case 7:
        date+="/31";
        break;
      case 8:
        date+="/31";
        break;
      case 9:
        date+="/30";
        break;
      case 10:
        date+="/31";
        break;
      case 11:
        date+="/30";
        break;
      case 12:
        date+="/31";
        break;
      default:
          break;
  }
    mn = Moment.moment(date);
    return mn;
}
function getExpirationDate4(text){
    // 年/月の形式のみ許容する
    if(!text.match(/\d{2}\/\d{1,2}/)){
        return false;
    }
     var d=text.match(/\d{2}\/\d{1,2}/)
     var date=d[0];
     d[0]="20"+d[0]+"/28";//日付を月の最後の日付に設定
    // 日付変換された日付が入力値と同じ事を確認
   var m = Moment.moment(d[0]);  
    if(m.year() !=  d[0].split("/")[0] 
        || m.month() != d[0].split("/")[1] - 1 
        || m.date() != d[0].split("/")[2]
    ){
        return false;
    }month=m.month();
    switch (month-1) {
      case 1:
        date+="/31";
        break;
      case 2:
        date+="/28";
        break;
      case 3:
        date+="/31";
        break;
      case 4:
        date+="/30";
        break;
      case 5:
        date+="/31";
        break;
      case 6:
        date+="/30";
        break;
      case 7:
        date+="/31";
        break;
      case 8:
        date+="/31";
        break;
      case 9:
        date+="/30";
        break;
      case 10:
        date+="/31";
        break;
      case 11:
        date+="/30";
        break;
      case 12:
        date+="/31";
        break;
      default:
          break;
  }
    mn = Moment.moment(date);
    return mn;
}

function getExpirationDate(text){
  // 空文字は無視
  if(text == ""){
    return false;  
  }else if(getExpirationDate1(text)){
    return getExpirationDate1(text).format('YYYY/MM/DD');
  }else if(getExpirationDate2(text)){
    return getExpirationDate2(text).format('YYYY/MM/DD');
  }else if(getExpirationDate3(text)){
    return getExpirationDate3(text).format('YYYY/MM/DD');
  }else if(getExpirationDate4(text)){
    return getExpirationDate4(text).format('YYYY/MM/DD');
  }
  return false;
}

//日付をYYYY/MM/DDに変換
function getYMD(dt){
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth()+1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var result = y + "/" + m + "/" + d;
  return result;
}