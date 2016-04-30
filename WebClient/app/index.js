require('./index.styl');

import io from 'socket.io-client';
import { hashFunction } from './hash/hashFunction';
import {
    randInt,
    encryptMessage,
    decryptMessage,
    getHTMLNodeForMessage
} from './util/chatFunctions';
import DiffieHellman from './diffie_hellman/diffie_hellman';
import DES from './des/DES';



global.P = null;
global.G = null;
global.KEY_LENGTH = null;
global.PRIVATE_KEY = randInt();
global.SHARED_KEY = null;
global.GENERATED_PUBLIC_KEY = null;
global.OTHER_PUBLIC_KEY = null;
global.DES_HASH_PRIVATE_KEY = null;
global.DH = null;
global.Des = null;
global.MESSAGE_COUNT = 0;


function appendChatLogWithHTMLNodeEvent(e, message) {
    let msg = message ? message : textArea.value;
    const sender = message ? 'other' : 'mine';

    if (msg !== '') {
        console.log('SHITTY MSG: ' + msg);
        // try {
        //     msg = sender === 'other' ? atob(msg) : msg;
        // } catch (e) {

        // }
        chatLog.appendChild(getHTMLNodeForMessage(msg, sender));
        chatLog.scrollIntoView(false);
        textArea.value = '';

        if (sender === 'mine') {

            MESSAGE_COUNT++;
            // DES encrypt message

            let cipher = msg;

            if (MESSAGE_COUNT !== 1) {
                if (!Des && DES_HASH_PRIVATE_KEY) {
                    Des = new DES(DES_HASH_PRIVATE_KEY);
                }

                if (Des) {
                    console.log('BEFORE ENCRYPTION: ' + msg);
                    cipher = Des.encrypt(msg);
                }
            }

            if (cipher.constructor === Array) {
                msg = cipher.join('');
            }
            console.log('BEFORE btoa: ' + msg);
            msg = btoa(msg);

            console.log('ENCRYPTED_RESPONSE: ' + msg);

            const response = {
                'payload': msg,
                'public_shared_key': GENERATED_PUBLIC_KEY,
                'encrypted': MESSAGE_COUNT != 1
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
    let encrypted = data['message'].encrypted;

    if (encrypted) {
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

        // DES decrypt message

        console.log('CIPHERED_MESSAGE: ' + message);

        if (!Des && DES_HASH_PRIVATE_KEY) {
           Des = new DES(DES_HASH_PRIVATE_KEY);
        }

        if (Des && atob(message).length % 8 === 0) {
            let bits = atob(message).split('').map(i => parseInt(i));
            message = Des.decrypt(bits, true);
        }
    }

    try {
        message = atob(message);
    } catch (e) {
        message = message;
    }

    appendChatLogWithHTMLNodeEvent(null, message);
});
