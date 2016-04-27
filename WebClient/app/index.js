require('./index.styl');

import io from 'socket.io-client';
import { hashFunction } from './hash/hashFunction';
import {
    randInt,
    encryptMessage,
    decryptMessage,
    getHTMLNodeForMessage
} from './util/chatFunctions';
import { des } from './des/des_var2';
import DiffieHellman from './diffie_hellman/diffie_hellman';



global.P = null;
global.G = null;
global.KEY_LENGTH = null;
global.PRIVATE_KEY = randInt();
global.SHARED_KEY = null;
global.GENERATED_PUBLIC_KEY = null;
global.OTHER_PUBLIC_KEY = null;
global.DES_HASH_PRIVATE_KEY = null;
global.DH = null;
global.DES = null;


function appendChatLogWithHTMLNodeEvent(e, message) {
    let msg = message ? message : textArea.value;
    const sender = message ? 'other' : 'mine';

    if (msg !== '') {
        chatLog.appendChild(getHTMLNodeForMessage(msg, sender));
        chatLog.scrollIntoView(false);
        textArea.value = '';

        if (sender === 'mine') {

            // TODO DES encrypt message

            if (DES_HASH_PRIVATE_KEY) {
                msg = des(DES_HASH_PRIVATE_KEY, msg, 1, 0, '0x0000000000000000', '*');
            }

            console.log('ENCRYPTED_RESPONSE: ' + msg);

            const response = {
                'payload': msg,
                'public_shared_key': GENERATED_PUBLIC_KEY
            }

            socket.emit('chat_message', response);
        }
    }
}


const address = 'http://192.168.1.101:8080',
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
    console.log('A new user connected!');
});

socket.on('public_keys', (data) => {
    const keys = data['message'];
    let p = keys['p'],
        g = keys['g'],
        keyLength = keys['key_length'];

    if (!GENERATED_PUBLIC_KEY || (P && G && (P != p || G != g))) {
        DH = new DiffieHellman(g, p, keyLength, PRIVATE_KEY);
        GENERATED_PUBLIC_KEY = DH.getPublicKey();
        console.log('GENERATED_PUBLIC_KEY: ' + GENERATED_PUBLIC_KEY);
    }

    P = p;
    G = g;
    KEY_LENGTH = keyLength;

});

socket.on('chat_message', (data) => {

    let message = data['message'].payload;
    let otherPublicKey = data['message'].public_shared_key;

    if (!OTHER_PUBLIC_KEY ||
        (OTHER_PUBLIC_KEY && OTHER_PUBLIC_KEY !== otherPublicKey)) {
        OTHER_PUBLIC_KEY = otherPublicKey;

        if (DH) {
            DH.genKey(OTHER_PUBLIC_KEY);
            SHARED_KEY = DH.getSharedSecret();
            console.log('P: ' + P);
            console.log('G: ' + G);
            console.log('PRIVATE_KEY: ' + PRIVATE_KEY);
            console.log('OTHER_PUBLIC_KEY: ' + OTHER_PUBLIC_KEY);
            console.log('SHARED_KEY: ' + SHARED_KEY);
            DES_HASH_PRIVATE_KEY = hashFunction(SHARED_KEY.toString());
            console.log('DES_HASH_PRIVATE_KEY: ' + DES_HASH_PRIVATE_KEY);
        }
    }

    // TODO DES decrypt message

    let msg = data['message'].payload;

    console.log('CIPHERED_MESSAGE: ' + msg);

    if (DES_HASH_PRIVATE_KEY && msg !== 'hello') {
        msg = des(DES_HASH_PRIVATE_KEY, msg, 0, 0);
    }


    appendChatLogWithHTMLNodeEvent(null, msg);
});
