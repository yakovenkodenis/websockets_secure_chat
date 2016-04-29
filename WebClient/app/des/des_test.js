import DES from './DES';


let d = new DES('qwertyui');

let cipher = d.encrypt64bit('heleo we')

console.log(cipher);

let decipheredBits = d.decrypt64bit(cipher, true);

console.log(decipheredBits.length);

console.log(decipheredBits);
