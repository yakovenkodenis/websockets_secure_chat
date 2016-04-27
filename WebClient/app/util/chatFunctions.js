import { hashFunction } from '../hash/hashFunction';


export function getHTMLNodeForMessage(message, sender='mine') {
    const mine = sender === 'mine';
    let frame = document.createElement('iframe');

    const template = `
        <li class="chat-log__entry${mine ? ' chat-log__entry_mine' : ''}">
            <img src='https://placekitten.com/g/50/50' alt='' class='chat-log__avatar'>
            <p class='chat-log__message'>${message}</p>
        </li>
    `;

    frame.style.display = 'none';
    document.body.appendChild(frame);
    frame.contentDocument.open();
    frame.contentDocument.write(template);
    frame.contentDocument.close();

    let resultNode = frame.contentDocument.body.firstChild;
    document.body.removeChild(frame);
    return resultNode;
}


export function randInt(min=10, max=99) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


export function decryptMessage(message, key) {

    // TODO DES decryption
}


export function encryptMessage(message, key) {

    // TODO DES encryption
}
