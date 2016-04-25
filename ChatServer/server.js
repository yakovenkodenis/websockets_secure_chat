import { getExternalIpAddress } from './utils/inet';


console.log(getExternalIpAddress());

const io = require('socket.io')();

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('tweet', {user: 'nodesource', text: 'Hello, World!'});

    socket.on('disconnect', () => {
        console.log('user disconnected')
    });

    setInterval(() => {
        socket.emit('chat_message', {hello: 'world'});

    }, 1000);

    socket.on('chat_message', (msg) => {
        console.log(msg, typeof msg);
        io.emit('chat_message', { 'message': msg });
    });
});

io.listen(8080);
