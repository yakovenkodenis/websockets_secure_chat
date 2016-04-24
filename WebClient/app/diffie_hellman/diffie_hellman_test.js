import DiffieHellman from './diffie_hellman';


const p = 11,
      g = 2,
      keyLength = 3;

let d1 = new DiffieHellman(g, p, keyLength);
// let d2 = new DiffieHellman(g, p, keyLength);

console.log('Public keys:');
console.log(d1.getPublicKey());
// console.log(d2.getPublicKey());

// d1.genKey(d2.getPublicKey());
// d2.genKey(d1.getPublicKey());
d1.genKey(2);

console.log('Private keys:');
console.log(d1.privateKey);
// console.log(d2.privateKey);

console.log(d1.getKey());
// console.log(d2.getKey());
console.log(d1.sharedSecret);

console.log('-------');
console.log(d1.genPublicKey());
console.log(d1.sharedSecret);
