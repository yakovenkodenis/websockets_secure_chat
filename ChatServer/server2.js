import DES from './des/DES';
import User from './models/user';
import primes from './prime/primes';
import { powMod } from './utils/powMod';
import { randInRange } from './utils/random';
import { hashFunction } from './hash/hashFunction';
import { getExternalIpAddress } from './utils/inet';


const P = primes['sample'],
      G = 2,
      a = randInRange(10, 100),
      A = powMod(G, a, P);

let users = [];


console.log(`IP address is ${getExternalIpAddress()}`);

const io = require('socket.io')();

io.on('connection', (socket) => {

    console.log(`User connected ${socket.id}`);

    // Emit public keys to the new user
    io.emit('public_keys', {
        'message': { P, G, A }
    });

    socket.on('public_keys', (B) => {
        console.log('--------------------');
        console.log(B);
        users = users.filter(user => user.id !== socket.id);
        users.push(new User(socket.id, powMod(B, a, P).toString()));
        console.log(users)
        console.log('--------------------');
    });

    socket.on('chat_message', (msg) => {

        console.log('RECEIVED MESSAGE:\n' + msg);

        const msgBits = new Buffer(msg, 'base64').toString()
            .split('').map(i => parseInt(i));

        let key = users.find(user => user.id === socket.id).key,
            desKey = hashFunction(key),
            message = new DES(desKey).decrypt(msgBits, true);

        users
            .filter(user => user.id !== socket.id)
            .map(user => {
                let cipher = new DES(hashFunction(user.key)).encrypt(message),
                    cipherB64 = new Buffer(cipher.join('')).toString('base64');
                io
                    .to(user.id)
                    .emit('chat_message', cipherB64);
            });
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
        users = users.filter(user => user.id !== socket.id);
    });

});

io.listen(8080);
