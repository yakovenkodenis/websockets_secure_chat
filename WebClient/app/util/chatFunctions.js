
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
