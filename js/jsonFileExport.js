/* JSON & Array String */

const jsonStringMake = row => {
    var jsonString = '';
    for(let i = 0; i < row*5; i++){
        if(i == 0){
            jsonString = jsonString.concat('[["'+$('#tableInput'+(i)).val()+'",');
        }
        else{
            if(i%5 == 4) continue;
            if(i%5 == 0){
                jsonString = jsonString.concat(',[');
            }
            jsonString = jsonString.concat('"'+$('#tableInput'+(i)).val()+'"');
            if(i%5 != 3){
                jsonString = jsonString.concat(',');
            }
            else{
                jsonString = jsonString.concat(']');
            }
        }
        if(i == row*5-2){
            jsonString = jsonString.concat(']');
        }
    }
    return jsonString;
}

const jsonExport = row => {
    var jsonString = jsonStringMake(row);
    // Create the file and download it

    var jsonBlob = new Blob([jsonString]);
    var downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(jsonBlob);
    downloadLink.download = "data_"+getNowFormatDate()+".json";
    downloadLink
        .click()
        .remove();
}



const getNowFormatDate = () => {
    var date = new Date(),
        seperator1 = "-",
        seperator2 = "_",
        month = date.getMonth() + 1,
        strDate = dateTimeAddZero(date.getDate()),
        strHour = dateTimeAddZero(date.getHours()),
        strMin = dateTimeAddZero(date.getMinutes()),
        strSec = dateTimeAddZero(date.getSeconds());

    if (month >= 1 && month <= 9) month = "0" + month;

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + seperator2 + strHour + strMin + strSec;
    
    return currentdate;
}

const dateTimeAddZero = time => {
    if (time >= 0 && time <= 9) time = "0" + time;
    return time;
}