require('./index.styl');

import io from 'socket.io-client';
import { randInt } from './util/random';
import {
    getHTMLNodeForMessage
} from './util/chatFunctions';



global.P = null;
global.G = null;
global.KEY_LENGTH = null;
global.PRIVATE_KEY = randInt();

const address = 'http://192.168.1.101:8080',
      socket = io(address, { origins: '*:*' });

function appendChatLogWithHTMLNodeEvent(e, message) {
    const msg = message ? message : textArea.value;
    const sender = message ? 'other' : 'mine';

    if (msg !== '') {
        chatLog.appendChild(getHTMLNodeForMessage(msg, sender));
        chatLog.scrollIntoView(false);
        textArea.value = '';

        if (sender === 'mine') {
            socket.emit('chat_message', {'payload': msg});
        }
    }
}


const chatLog = document.querySelector('ul.chat-log'),
      sendBtn = document.querySelector('.control-group--btn'),
      textArea = document.querySelector('.input-form--wrapper textarea');

sendBtn.addEventListener('click', appendChatLogWithHTMLNodeEvent);

textArea.addEventListener('keydown', (e) => {
    if (!e) {
        e = window.event;
    }
    if (e.ctrlKey && e.code === 'Enter') {
        sendBtn.click();
    }
});

socket.on('connect', () => {
    console.log('A new user connected!');
});

socket.on('public_keys', (data) => {
    const keys = data['message'];
    P = keys['p'];
    G = keys['g'];
    KEY_LENGTH = keys['key_length'];
});

socket.on('chat_message', (data) => {
    console.log(data);
    appendChatLogWithHTMLNodeEvent(null, data['message'].payload);
});
