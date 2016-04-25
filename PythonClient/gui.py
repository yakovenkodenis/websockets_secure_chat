# -*- coding: utf-8 -*-

import threading
from tkinter import *
from socketIO_client import SocketIO, LoggingNamespace


tk = Tk()

text = StringVar()
name = StringVar()
name.set('me')
text.set('')
tk.title('Secure Chat')
tk.geometry('400x300')

log = Text(tk)
nick = Entry(tk, textvariable=name)
msg = Entry(tk, textvariable=text)

msg.pack(side='bottom', fill='x', expand='true')
nick.pack(side='bottom', fill='x', expand='true')
log.pack(side='top', fill='both', expand='true')


ADDRESS = 'http://192.168.1.101'
PORT = 8080


def emit_message(address=ADDRESS, port=PORT, message=''):
    with SocketIO(address, port, LoggingNamespace) as socketIO:
        socketIO.emit('chat_message', {'payload': message, 'sender': 'me'},
                      on_bbb_response)


def listen_for_messages_loop():
    with SocketIO(ADDRESS, PORT, LoggingNamespace) as socketIO:
        socketIO.on('chat_message', add_message_to_chat_log)
        socketIO.wait()


def add_message_to_chat_log(*data):
    if not data[0].get('message').get('sender'):
        log.insert(END, data[0].get('message').get('payload') + '\n')
        log.see('end')


def sendproc(event):
    log.insert(END, name.get() + ': ' + text.get() + '\n')
    log.see('end')

    emit_message(message=text.get())

    text.set('')


def on_bbb_response(*args):
    print('on_bbb_response', args)


def on_chat_message_response(*args):
    print('on_chat_message_response: ', args)


msg.bind('<Return>', sendproc)
threading.Thread(target=listen_for_messages_loop).start()

tk.mainloop()
