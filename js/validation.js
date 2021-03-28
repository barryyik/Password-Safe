/* Check Valid */

const checkTableValid = () => {
    var tableValidCount = $('#jsonTable tbody tr').length*3;
    for(let i = 0; i < $('#jsonTable tbody tr').length*5; i++) {
        if(i%5 != 1 && i%5 != 4){
            if($("#tableInput"+(i)).val().trim() != '') tableValidCount--;
        }
    }
    if(tableValidCount==0) return true;
    return false;
}

const checkAllValid = () => {
    var tableValidCount = $('#jsonTable tbody tr').length*4;
    for(let i = 0; i < $('#jsonTable tbody tr').length*5; i++) {
        if(i%5 != 4){
            if($("#tableInput"+(i)).val().trim() != '') tableValidCount--;
        }
    }
    if(tableValidCount==0) return true;
    return false;
}

const checkInsertValid = () => {
    var tableValidCount = $('#insertTable tbody tr').length*3;
    for(let i = 0; i < $('#insertTable tbody tr').length*5; i++) {
        if(i%5 != 1 && i%5 != 4){
            if($("#insertInput"+(i)).val().trim() != '') tableValidCount--;
        }
    }
    if(tableValidCount==0) return true;
    return false;
}