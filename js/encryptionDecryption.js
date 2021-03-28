/* Encryption & Decryption */

const encryptData = (msg, pwd) => {
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

const decryptData = (msg, pwd) => {
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