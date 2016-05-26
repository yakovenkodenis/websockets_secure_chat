require('./index.styl');

import io from 'socket.io-client';
import { powMod } from './util/powMod';
import { hashFunction } from './hash/hashFunction';
import {
    randInt,
    getHTMLNodeForMessage
} from './util/chatFunctions';
import DES from './des/DES';


global.Des = null;


function appendChatLogWithHTMLNodeEvent(e, message) {
    let msg = message ? message : textArea.value;
    const sender = message ? 'other' : 'mine';

    if (msg !== '') {
        console.log('RECEIVED MSG: ' + msg);

        chatLog.appendChild(getHTMLNodeForMessage(msg, sender));
        chatLog.scrollIntoView(false);
        textArea.value = '';

        if (sender === 'mine') {

            let cipherArr = Des.encrypt(msg),
                cipher = btoa(cipherArr.join(''));

            socket.emit('chat_message', cipher);
        }
    }
}


const address = 'http://127.0.0.1:8080',
      socket = io(address, { origins: '*:*' });

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
    console.log('Connected!');
});

socket.on('public_keys', (data) => {
    console.log('RECEIVED PUBLIC KEYS');

    const { P, G, A } = data['message'];
    const PRIVATE_KEY = randInt();

    const B = powMod(G, PRIVATE_KEY, P),
          K = powMod(A, PRIVATE_KEY, P).toString(),
          DES_HASH_PRIVATE_KEY = hashFunction(K);

    Des = new DES(DES_HASH_PRIVATE_KEY);

    socket.emit('public_keys', B);

    console.log(data['message']);
    console.log(B);
    console.log(K);
});

socket.on('chat_message', (data) => {
    let cipher = data;

    console.log('FOR BITS: ' + cipher);
    let bits = atob(cipher).split('').map(i => parseInt(i)),
        message = Des.decrypt(bits, true);

    appendChatLogWithHTMLNodeEvent(null, message);
});
