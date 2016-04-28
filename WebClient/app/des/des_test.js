import {
    des,
    stringToHex,
    hexToString
} from './des_var2';


var key = "PASSWORD";
var message = "message";
var ciphertext = des(key, message, 1, 0, '0x0000000000000000', 1);
console.log("DES Test: " + stringToHex(ciphertext));
console.log("DES MSG: " + des(key, ciphertext, 0, 0));

let test_str = '0xf6dc54077b15dbaf';
console.log(hexToString(test_str));
console.log(ciphertext);
console.log(des(key, hexToString(test_str), 0, 0));
