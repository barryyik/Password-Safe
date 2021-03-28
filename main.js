var obj = [["","","",""]];

$(document).ready(() => basicTable());

const readFile = (file, onLoadCallback) => {
    var reader = new FileReader();
    reader.onload = onLoadCallback;
    reader.readAsText(file);
}

const basicTable = () => {
    obj = [["","","",""]];
    createTable(obj);
}

const createTable = (obj) => {
    $("#jsonTableDiv")
        .empty()
        .append(
            `<table class="table table-dark" id="jsonTable">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Site</th>
                    <th scope="col">URL</th>
                    <th scope="col">AC</th>
                    <th scope="col">PW</th>
                    <th scope="col">To Be Deleted</th>
                    </tr>
                </thead>
            </table>`);
    $("#jsonTable").append('<tbody></tbody>');
    
    for(let i = 0; i < obj.length*5; i++) {
        if(i%5==0) $("#jsonTable > tbody").append(`<tr><th scope="row">${(i+5)/5}</th></tr>`);
        var req = (i%5 == 1) ? "" : " required";

        // checkbox
        if (i%5 == 4) {
            $("#jsonTable > tbody > tr:last-child").append(
                `<td> <input type="checkbox" class="form-check-input" id="CheckRow${((i-i%5)/5)}"> </td>`);
                continue;
            }
        $("#jsonTable > tbody > tr:last-child").append(
            `<td> <input class="form-control" id="tableInput${i}" type="text" value="${(obj[(i-i%5)/5][i%5]==null?"":obj[(i-i%5)/5][i%5])}"${req}> </td>`);
    }
    $("#jsonTable").before('<div class="container-fluid alert alert-success" id="tablebtnDiv"/>');
    
    $("#tablebtnDiv").append(
        `<label id="fileUploadbtn" for="inputfile" class="custom-file-upload btn">Import JSON File</label>
        <input type="file" name="inputfile" id="inputfile"/>
        <button class="btn btn-primary" id="btnClear">Clear All</button>
        <button class="btn btn-danger" id="btnDelete">Delete Selected</button>
        <button class="btn btn-info" id="btnExport">Export JSON</button>
        <input class="form-control" id="encryptInput" type="password" placeholder="Encrypt/Decryption Password"/>
        <button class="btn btn-primary" id="btnEncrypt">Encrypt</button>
        <button class="btn btn-primary" id="btnDecrypt">Decrypt</button>`);

    $("#tablebtnDiv").after('<div id="messageDisplay"></div>');

    // Create insert data input table
    $('#jsonTable').before(
        `<table class="table table-dark" id="insertTable">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Site</th>
                <th scope="col">URL</th>
                <th scope="col">AC</th>
                <th scope="col">PW</th>
                <th scope="col">Insert</th>
                </tr>
            </thead>
        </table>`);
    $("#insertTable").append('<tbody></tbody>');
    $("#insertTable > tbody").append('<tr><th scope="row">0</th></tr>');
    $("#insertTable > tbody > tr:last-child").append(
        `<td><input class="form-control" id="insertInput0" type="text"></td>
        <td><input class="form-control" id="insertInput1" type="text"></td>
        <td><input class="form-control" id="insertInput2" type="text"></td>
        <td><input class="form-control" id="insertInput3" type="text"></td>
        <td><button class="btn btn-primary" id="btnInsertData">Insert</button></td>`);

    /* Event Listeners */

    $('#jsonTableDiv').submit(() => false);

    // Import JSON File
    $('#inputfile').on('change', e => {
        readFile(e.target.files[0], e => {
            obj = $.parseJSON(e.target.result);
            createTable(obj);
        });
    });
    
    // Clear Button
    $("#btnClear").click(() => {
        basicTable();
        $('#inputfile').val('');
    });

    // Delete Button 
    $("#btnDelete").click(() => {
        $("#messageDisplay").empty();
        var tableRowCount = $('#jsonTable tbody tr').length,
            arrData = JSON.parse(jsonStringMake(tableRowCount)),
            arrToRemove = [];
        // Getting which row to remove
        for(let i = 0; i < tableRowCount; i++){
            if($('#CheckRow'+(i)).is(':checked')) arrToRemove.push(i);
        }
        // Removing the data
        for(let i = arrToRemove.length -1; i >= 0; i--){
            arrData.splice(arrToRemove[i],1);
        }
        if(tableRowCount!=arrToRemove.length+arrData.length) return $("#messageDisplay").append(
            `<div class="alert alert-danger" role="alert">Error. Nothing was deleted from the table.</div>`);
        createTable(arrData);
        $("#messageDisplay").append(
            `<div class="alert alert-primary" role="alert">${arrToRemove.length} piece(s) of data was successfully removed from the table. (To save the table, please export the JSON file)</div>`);
    });

    // Export Button
    $('#btnExport').click(() => {
        $("#messageDisplay").empty();
        if(!checkTableValid()) return $("#messageDisplay").append(
            `<div class="alert alert-danger" role="alert">Invalid input.</div>`);
        jsonExport($('#jsonTable tbody tr').length);
        $("#messageDisplay").append(`<div class="alert alert-primary" role="alert">JSON file exported. Check your downloaded folder.</div>`);
    });

    // show/hide password
    $('#encryptInput').mouseenter(() => $('#encryptInput').attr("type", "text"));
    $('#encryptInput').mouseleave(() => $('#encryptInput').attr("type", "password"));

    // Encrypt
    $('#btnEncrypt').click(() => {
        $("#messageDisplay").empty();
        if(!checkTableValid()) return $("#messageDisplay").append(
            `<div class="alert alert-danger" role="alert">Invalid input.</div>`);
        if($('#encryptInput').val().trim()=='') return $("#messageDisplay").append(`<div class="alert alert-danger" role="alert">Invalid encrypt/decryption password.</div>`);
        $("#messageDisplay").append(`<div id="waitingMsg" class="alert alert-warning" role="alert">Encryption takes time, please wait......</div>`);
        $('#waitingMsg').ready(() => {
            var encryptPassword = $('#encryptInput').val();
            for(let i = 0; i < $('#jsonTable tbody tr').length*5; i++) {
                if(i%5 == 4) continue;
                var tempDataVal = encryptData($('#tableInput'+(i)).val(), encryptPassword);
                $('#tableInput'+(i)).val(tempDataVal);
            }
            $("#messageDisplay")
                .empty()
                .append(`<div class="alert alert-primary" role="alert">Encryption Completed.</div>`);
        });
    });

    // Decrypt
    $('#btnDecrypt').click(() => {
        $("#messageDisplay").empty();
        if(!checkAllValid()) return $("#messageDisplay").append(
            `<div class="alert alert-danger" role="alert">Invalid input. No empty fields is allowed.</div>`);
        if($('#encryptInput').val().trim()=='') return $("#messageDisplay").append(
            `<div class="alert alert-danger" role="alert">Invalid encrypt/decryption password.</div>`);
        $("#messageDisplay").append(`<div id="waitingMsg" class="alert alert-warning" role="alert">Decryption takes time, please wait......</div>`);
        $('#waitingMsg').ready(()=>{
            var encryptPassword = $('#encryptInput').val();
            for(let i = 0; i < $('#jsonTable tbody tr').length*5; i++) {
                if (i%5 == 4) continue;
                var tempDataVal = decryptData($('#tableInput'+(i)).val(), encryptPassword);
                $('#tableInput'+(i)).val(tempDataVal);
            }
            $("#messageDisplay")
                .empty()
                .append(`<div class="alert alert-primary" role="alert">Decryption Completed.</div>`);
        });
    });

    // Insert
    $('#btnInsertData').click(() => {
        $("#messageDisplay").empty();
        if(!checkInsertValid()) return $("#messageDisplay").append(`<div class="alert alert-danger" role="alert">Invalid input to insert.</div>`);
        var arrData = JSON.parse(jsonStringMake($('#jsonTable tbody tr').length)),
            arrInput = [$('#insertInput0').val(),$('#insertInput1').val(),$('#insertInput2').val(),$('#insertInput3').val()];
        arrData.push(arrInput);
        createTable(arrData.sort((a, b) => {
            if(a[0].toLowerCase() > b[0].toLowerCase()) return 1;
            if(b[0].toLowerCase() > a[0].toLowerCase()) return -1;
            return 0;
        }));
        $("#messageDisplay").append(`<div class="alert alert-primary" role="alert">Data Inserted.</div>`);
    });
}