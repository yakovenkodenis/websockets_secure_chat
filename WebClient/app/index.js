require('./index.styl');
import io from 'socket.io-client';


const address = 'http://localhost';

const socket = io(address);

socket.on('connect', () => {
    console.log('Connected!');
});

socket.on('chat_message', (data) => {
    console.log(data);
});
