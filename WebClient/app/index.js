require('./index.styl');
import { getHTMLNodeForMessage } from './util/chatFunctions';
import io from 'socket.io-client';


const chatLog = document.querySelector('ul.chat-log'),
      sendBtn = document.querySelector('.control-group--btn'),
      textArea = document.querySelector('.input-form--wrapper textarea');

sendBtn.addEventListener('click', () => {
    const msg = textArea.value;

    if (msg !== '') {
        console.log(msg);
        chatLog.appendChild(getHTMLNodeForMessage(msg));
    }
});

textArea.addEventListener('keydown', (e) => {
    if (!e) {
        e = window.event;
    }
    if (e.ctrlKey && e.code === 'Enter') {
        sendBtn.click();
    }
});

// const address = 'http://192.168.1.101:8080';

// const socket = io(address, { origins: '*:*' });

// socket.on('connect', () => {
//     console.log('Connected!');
// });

// socket.on('chat_message', (data) => {
//     console.log(data);
// });

// socket.emit('chat_message', {'payload': 'hey'})
