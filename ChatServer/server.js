import { getExternalIpAddress } from './utils/inet';


const server = require('net').createServer(),
      io = require('socket.io')(server);

const handleClient = (socket) => {

    socket.emit('tweet', {user: 'nodesource', text: 'Hello, World!'});
};


console.log(getExternalIpAddress());

io.on('connection', handleClient);
server.listen(8080);
