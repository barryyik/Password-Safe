var obj = [[
    "",
    "",
    "",
    ""
]];

$(document).ready(function(){

    basicTable();

});

function readFile(file, onLoadCallback){
    var reader = new FileReader();
    reader.onload = onLoadCallback;
    reader.readAsText(file);
}

function basicTable() {
    
    obj = [[
        "",
        "",
        "",
        ""
    ]];
    createTable(obj);
}

function createTable(obj) {
    $("#jsonTableDiv").empty();
    $("#jsonTableDiv").append('<table class="table table-dark" id="jsonTable"><thead><tr><th scope="col">#</th><th scope="col">Site</th><th scope="col">URL</th><th scope="col">AC</th><th scope="col">PW</th><th scope="col">To Be Deleted</th></tr></thead></table>');
    $("#jsonTable").append('<tbody></tbody>');
    
    for(i = 0; i < obj.length*5; i++) {
        if(i%5==0) {
            $("#jsonTable > tbody").append('<tr><th scope="row">'+(i+5)/5+'</th></tr>');
        }
        var req = "";
        if(i%5 == 1) {
            req = "";
        }
        else {
            req = " required";
        }

        // checkbox
        if(i%5 == 4) {
            $("#jsonTable > tbody > tr:last-child").append('<td>'+ '<input type="checkbox" class="form-check-input" id="CheckRow'+((i-i%5)/5)+'">' +'</td>');
        }
        else{
            $("#jsonTable > tbody > tr:last-child").append('<td>'+ '<input class="form-control" id="tableInput'+(i)+'" type="text" value="'+(obj[(i-i%5)/5][i%5]==null?"":obj[(i-i%5)/5][i%5])+'"'+req+'>' +'</td>');
        }
        
    }
    $("#jsonTable").before('<div class="container-fluid alert alert-success" id="tablebtnDiv"/>');
    
    
    
    $("#tablebtnDiv").append('<label id="fileUploadbtn" for="inputfile" class="custom-file-upload btn">Import JSON File</label><input type="file" name="inputfile" id="inputfile"></input>');
    $("#tablebtnDiv").append('<button class="btn btn-primary" id="btnClear">Clear All</button>');
    $("#tablebtnDiv").append('<button class="btn btn-danger" id="btnDelete">Delete Selected</button>');
    $("#tablebtnDiv").append('<button class="btn btn-info" id="btnExport">Export JSON</button>');
    $("#tablebtnDiv").append('<input class="form-control" id="encryptInput" type="password" placeholder="Encrypt/Decryption Password"/>');
    $("#tablebtnDiv").append('<button class="btn btn-primary" id="btnEncrypt">Encrypt</button>');
    $("#tablebtnDiv").append('<button class="btn btn-primary" id="btnDecrypt">Decrypt</button>');

    $("#tablebtnDiv").after('<div id="messageDisplay"></div>');


    // No Submit
    $('#jsonTableDiv').submit(function () {
        return false;
    });


    // #################### tablebtnDiv Functions ####################

    // Import JSON File
    $('#inputfile').on('change', function(e){
        readFile(this.files[0], function(e) {

            obj = $.parseJSON(e.target.result);

            createTable(obj);
            
        });
    });
    
    // Clear All
    $("#btnClear").click(function () {
        basicTable();
        $('#inputfile').val('');
    });

    // Delete Selected 
    $("#btnDelete").click(function () {
        $("#messageDisplay").empty();
        var tableRowCount = $('#jsonTable tbody tr').length;
        var arrData = JSON.parse(jsonStringMake(tableRowCount));
        var arrToRemove = [];
        // To see which row to remove
        for(i = 0; i < tableRowCount; i++){
            if($('#CheckRow'+(i)).is(':checked')){
                arrToRemove[arrToRemove.length] = i;
            }
        }
        // To remove the data
        for(i = arrToRemove.length -1; i >= 0; i--){
            arrData.splice(arrToRemove[i],1);
        }
        if(tableRowCount!=arrToRemove.length+arrData.length){
            $("#messageDisplay").append('<div class="alert alert-danger" role="alert">Error. Nothing was deleted from the table.</div>');
        }
        else{
            createTable(arrData);
            $("#messageDisplay").append('<div class="alert alert-primary" role="alert">'+arrToRemove.length+' piece(s) of data was successfully removed from the table. (To save the table, please export the JSON file)</div>');
        }
    });

    // Export JSON
    $('#btnExport').click(function() {
        $("#messageDisplay").empty();
        if(!checkTableValid()) {
            $("#messageDisplay").append('<div class="alert alert-danger" role="alert">Invalid input.</div>');
        }
        else{
            jsonExport($('#jsonTable tbody tr').length);
            $("#messageDisplay").append('<div class="alert alert-primary" role="alert">JSON file exported. Check your downloaded folder.</div>');
        }
    });

    // show/hide password
    $('#encryptInput').mouseenter(function(){
        $('#encryptInput').attr("type", "text");
    });
    $('#encryptInput').mouseleave(function(){
        $('#encryptInput').attr("type", "password");
    });

    // Encrypt
    $('#btnEncrypt').click(function() {
        $("#messageDisplay").empty();
        if(!checkTableValid()){
            $("#messageDisplay").append('<div class="alert alert-danger" role="alert">Invalid input.</div>');
        }
        else if($('#encryptInput').val().trim()==''){
            $("#messageDisplay").append('<div class="alert alert-danger" role="alert">Invalid encrypt/decryption password.</div>');
        }
        else{
            $("#messageDisplay").append('<div id="waitingMsg" class="alert alert-warning" role="alert">Encryption takes time, please wait......</div>');
            $('#waitingMsg').ready(()=>{
                var encryptPassword = $('#encryptInput').val();
                for(i = 0; i < $('#jsonTable tbody tr').length*5; i++) {
                    if (i%5 == 4) { continue; }
                    var tempDataVal = encryptData($('#tableInput'+(i)).val(), encryptPassword);
                    $('#tableInput'+(i)).val(tempDataVal);
                }
                $("#messageDisplay").empty();
                $("#messageDisplay").append('<div class="alert alert-primary" role="alert">Encryption Completed.</div>');
            });
        }
    });

    // Decrypt
    $('#btnDecrypt').click(function() {
        $("#messageDisplay").empty();
        if(!checkAllValid()){
            $("#messageDisplay").append('<div class="alert alert-danger" role="alert">Invalid input. No empty fields is allowed.</div>');
        }
        else if($('#encryptInput').val().trim()==''){
            $("#messageDisplay").append('<div class="alert alert-danger" role="alert">Invalid encrypt/decryption password.</div>');
        }
        else{
            $("#messageDisplay").append('<div id="waitingMsg" class="alert alert-warning" role="alert">Decryption takes time, please wait......</div>');
            $('#waitingMsg').ready(()=>{
                var encryptPassword = $('#encryptInput').val();
                for(i = 0; i < $('#jsonTable tbody tr').length*5; i++) {
                    if (i%5 == 4) { continue; }
                    var tempDataVal = decryptData($('#tableInput'+(i)).val(), encryptPassword);
                    $('#tableInput'+(i)).val(tempDataVal);
                }
                $("#messageDisplay").empty();
                $("#messageDisplay").append('<div class="alert alert-primary" role="alert">Decryption Completed.</div>');
            });
        }
        
    });

    // #################### InsertTable ####################

    // Create insert data input table
    $('#jsonTable').before('<table class="table table-dark" id="insertTable"><thead><tr><th scope="col">#</th><th scope="col">Site</th><th scope="col">URL</th><th scope="col">AC</th><th scope="col">PW</th><th scope="col">Insert</th></tr></thead></table>');
    $("#insertTable").append('<tbody></tbody>');
    $("#insertTable > tbody").append('<tr><th scope="row">0</th></tr>');
    $("#insertTable > tbody > tr:last-child").append('<td>'+ '<input class="form-control" id="insertInput0" type="text"></td>');
    $("#insertTable > tbody > tr:last-child").append('<td>'+ '<input class="form-control" id="insertInput1" type="text"></td>');
    $("#insertTable > tbody > tr:last-child").append('<td>'+ '<input class="form-control" id="insertInput2" type="text"></td>');
    $("#insertTable > tbody > tr:last-child").append('<td>'+ '<input class="form-control" id="insertInput3" type="text"></td>');
    $("#insertTable > tbody > tr:last-child").append('<td>'+ '<button class="btn btn-primary" id="btnInsertData">Insert</button>' +'</td>');

    // Insert
    $('#btnInsertData').click(function() {
        $("#messageDisplay").empty();
        if(!checkInsertValid()){
            $("#messageDisplay").append('<div class="alert alert-danger" role="alert">Invalid input to insert.</div>');
        }
        else{
            var arrData = JSON.parse(jsonStringMake($('#jsonTable tbody tr').length));
            var arrInput = [$('#insertInput0').val(),$('#insertInput1').val(),$('#insertInput2').val(),$('#insertInput3').val()];
            arrData.push(arrInput);
            createTable(arrData.sort(function(a, b) {
                if (a[0].toLowerCase() > b[0].toLowerCase()) {
                    return 1;
                }
                if (b[0].toLowerCase() > a[0].toLowerCase()) {
                    return -1;
                }
                return 0;
            }));
            $("#messageDisplay").append('<div class="alert alert-primary" role="alert">Data Inserted.</div>');
        }
    });
}

// #################### Encryption & Decryption ####################

function encryptData(msg, pwd) {
    var salt = CryptoJS.lib.WordArray.random(128/8);
    var key = CryptoJS.PBKDF2(pwd, salt, {
        keySize: 512/32,
        iterations: 500
    });
    var iv = CryptoJS.lib.WordArray.random(128/8);
    var encrypted = CryptoJS.AES.encrypt(msg, key, { 
        iv: iv, 
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });

    var encryptedMessage = salt.toString()+ iv.toString() + encrypted.toString();
    return encryptedMessage;
}

function decryptData(msg, pwd) {
    var salt = CryptoJS.enc.Hex.parse(msg.substr(0, 32));
    var iv = CryptoJS.enc.Hex.parse(msg.substr(32, 32))
    var encrypted = msg.substring(64);

    var key = CryptoJS.PBKDF2(pwd, salt, {
        keySize: 512/32,
        iterations: 500
    });

    var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
        iv: iv, 
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// #################### Check Valid ####################

function checkTableValid() {
    var tableValidCount = $('#jsonTable tbody tr').length*3;
    for(i = 0; i < $('#jsonTable tbody tr').length*5; i++) {
        if(i%5 != 1 && i%5 != 4){
            if($("#tableInput"+(i)).val().trim() != ''){
                tableValidCount -=1;
            }
        }
    }
    if(tableValidCount==0){
        return true;
    }
    else{
        return false;
    }
    
}

function checkAllValid() {
    var tableValidCount = $('#jsonTable tbody tr').length*4;
    for(i = 0; i < $('#jsonTable tbody tr').length*5; i++) {
        if(i%5 != 4){
            if($("#tableInput"+(i)).val().trim() != ''){
                tableValidCount -=1;
            }
        }
    }
    if(tableValidCount==0){
        return true;
    }
    else{
        return false;
    }
    
}

function checkInsertValid() {
    var tableValidCount = $('#insertTable tbody tr').length*3;
    for(i = 0; i < $('#insertTable tbody tr').length*5; i++) {
        if(i%5 != 1 && i%5 != 4){
            if($("#insertInput"+(i)).val().trim() != ''){
                tableValidCount -=1;
            }
        }
    }
    if(tableValidCount==0){
        return true;
    }
    else{
        return false;
    }
    
}

// #################### JSON & Array String ####################

function jsonExport(row) {
    var jsonString = jsonStringMake(row);
    // Create the file and download it

    var jsonBlob = new Blob([jsonString]);
    var downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(jsonBlob);
    downloadLink.download = "data_"+getNowFormatDate()+".json";
    downloadLink.click();
    downloadLink.remove();
}

function jsonStringMake(row){
    var jsonString = '';
    for(i = 0; i < row*5; i++){
        if(i == 0){
            jsonString = jsonString.concat('[["'+$('#tableInput'+(i)).val()+'",');
        }
        else{
            if (i%5 == 4) { continue; }
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

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = "_";
    var month = date.getMonth() + 1;
    var strDate = dateTimeAddZero(date.getDate());
    var strHour = dateTimeAddZero(date.getHours());
    var strMin = dateTimeAddZero(date.getMinutes());
    var strSec = dateTimeAddZero(date.getSeconds());
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + seperator2 + strHour + strMin + strSec;
    return currentdate;
}

function dateTimeAddZero(time){
    if (time >= 0 && time <= 9) {
        time = "0" + time;
    }
    return time;
}