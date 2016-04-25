import { getExternalIpAddress } from './utils/inet';


console.log(getExternalIpAddress());

const io = require('socket.io')();

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('tweet', {user: 'nodesource', text: 'Hello, World!'});

    socket.on('disconnect', () => {
        console.log('user disconnected')
    });

    socket.on('chat_message', (msg) => {
        console.log(msg);
        socket.broadcast.emit('chat_message', { 'message': msg });
    });
});

io.listen(8080);
