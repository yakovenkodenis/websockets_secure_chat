# -*- coding: utf-8 -*-

import base64
import threading
from tkinter import *
from des.des import DES
from random import randint
from hashes.hash_function import hash_function
from diffie_hellman.diffie_hellman import DiffieHellman
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


ADDRESS = 'http://127.0.0.1'
PORT = 8080

Des = None

def run_once(f):
    def wrapper(*args, **kwargs):
        if not wrapper.has_run:
            wrapper.has_run = True
            return f(*args, **kwargs)
    wrapper.has_run = False
    return wrapper

def emit_message(address=ADDRESS, port=PORT, message=''):
    with SocketIO(address, port, LoggingNamespace) as socketIO:
        # Encrypt DES message
        cipher = message

        global Des

        cipher = Des.encrypt(message)

        cipher_b64 = base64.b64encode(
            bytes(''.join(str(b) for b in cipher), 'ascii')
        ).decode('ascii')

        socketIO.emit('chat_message', cipher_b64, on_bbb_response)


def listen_for_messages_loop():
    with SocketIO(ADDRESS, PORT, LoggingNamespace) as socketIO:
        socketIO.on('public_keys', receive_public_keys_callback)
        print('LOOP')
        socketIO.on('chat_message', add_message_to_chat_log)
        socketIO.wait()


def add_message_to_chat_log(*data):
    print(data)
    cipher = data[0]
    message = cipher

    if text.get() != cipher:
        bits = list(
            map(int, list(base64.b64decode(cipher).decode('ascii')))
        )
        message = Des.decrypt(bits, msg_in_bits=True)

    log.insert(END, message + '\n')
    log.see('end')

@run_once
def receive_public_keys_callback(*data):
    keys = data[0].get('message')

    P = keys.get('P')
    G = keys.get('G')
    A = keys.get('A')

    PRIVATE_KEY = randint(10, 100)

    B = pow(G, PRIVATE_KEY, P)
    K = str(pow(A, PRIVATE_KEY, P))
    DES_HASH_PRIVATE_KEY = hash_function(bytes(K, 'ascii'))

    global Des
    Des = DES(DES_HASH_PRIVATE_KEY)

    with SocketIO(ADDRESS, PORT, LoggingNamespace) as socketIO:
        socketIO.emit('public_keys', B)

    print(P, G, A, DES_HASH_PRIVATE_KEY)


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
