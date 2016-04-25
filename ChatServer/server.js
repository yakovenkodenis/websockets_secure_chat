import { getExternalIpAddress } from './utils/inet';
import primes from './prime/primes';


const P = primes['sample'],
      KEY_LENGTH = 3,
      G = 2;

console.log(getExternalIpAddress());

const io = require('socket.io')();

io.on('connection', (socket) => {
    console.log('A user connected');


    socket.on('disconnect', () => {
        console.log('user disconnected')
    });

    // Emit public keys to the new user
    io.emit('public_keys', {
        'message': {
            'p': P.toString(),
            'g': G,
            'key_length': KEY_LENGTH
        }
    });

    socket.on('chat_message', (msg) => {
        console.log(msg);
        socket.broadcast.emit('chat_message', { 'message': msg });
    });
});

io.listen(8080);
