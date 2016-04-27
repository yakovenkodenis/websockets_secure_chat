# -*- coding: utf-8 -*-

import threading
from tkinter import *
from des_var2 import *
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


ADDRESS = 'http://192.168.1.101'
PORT = 8080

# Diffie-Hellman public generator and prime
G = None
P = None
KEY_LENGTH = None
PRIVATE_KEY = randint(10, 99)
SHARED_KEY = None
GENERATED_PUBLIC_KEY = None
OTHER_PUBLIC_KEY = None
DES_HASH_PRIVATE_KEY = None
DH = None
DES = None


def emit_message(address=ADDRESS, port=PORT, message=''):
    with SocketIO(address, port, LoggingNamespace) as socketIO:
        # TODO encrypt DES message

        global DES

        if not DES and DES_HASH_PRIVATE_KEY:
            DES = des(bytes(DES_HASH_PRIVATE_KEY, 'ascii'), mode=ECB,
                      IV='\0\0\0\0\0\0\0\0', pad='*', padmode=PAD_NORMAL)

        if DES:
            message = bytes(message, 'ascii')
            print('BEFORE ENCRYPTION: ' + str(message))
            message = DES.encrypt(message)
            print('AFTER ENCRYPTION: ' + str(message))

        print('ENCRYPTED_RESPONSE: ' + str(message))
        print('DES_HASH_PRIVATE_KEY: ' + str(DES_HASH_PRIVATE_KEY))
        print(DES)

        response = {
            'payload': message,
            'sender': 'me',
            'public_shared_key': GENERATED_PUBLIC_KEY
        }
        socketIO.emit('chat_message', response, on_bbb_response)


def listen_for_messages_loop():
    with SocketIO(ADDRESS, PORT, LoggingNamespace) as socketIO:
        socketIO.on('public_keys', receive_public_keys_callback)
        socketIO.on('chat_message', add_message_to_chat_log)
        socketIO.wait()


def add_message_to_chat_log(*data):
    message = data[0].get('message')
    if not message.get('sender'):

        msg = message.get('payload')
        other_public_key = message.get('public_shared_key')

        global OTHER_PUBLIC_KEY
        global SHARED_KEY
        global DES_HASH_PRIVATE_KEY
        global DH

        if not OTHER_PUBLIC_KEY or (
           OTHER_PUBLIC_KEY and OTHER_PUBLIC_KEY != other_public_key):
            OTHER_PUBLIC_KEY = other_public_key

            if DH:
                DH.gen_key(OTHER_PUBLIC_KEY)
                SHARED_KEY = DH.get_shared_secret()
                print('P: ' + str(P))
                print('G: ' + str(G))
                print('PRIVATE_KEY:' + str(PRIVATE_KEY))
                print('OTHER_PUBLIC_KEY:' + str(OTHER_PUBLIC_KEY))
                print('SHARED_KEY: ' + str(SHARED_KEY))
                des_hash = hash_function(bytes(str(SHARED_KEY), 'ascii'))
                DES_HASH_PRIVATE_KEY = des_hash
                print('DES_HASH_PRIVATE_KEY: ' + str(DES_HASH_PRIVATE_KEY))

        # TODO decrypt DES msg

        print('CIPHERED_MESSAGE: ' + str(msg))

        global DES

        if not DES and DES_HASH_PRIVATE_KEY:
            DES = des(bytes(DES_HASH_PRIVATE_KEY, 'ascii'), mode=ECB,
                      IV='\0\0\0\0\0\0\0\0', pad='*', padmode=PAD_NORMAL)

        if DES:
            msg = DES.decrypt(msg)

        log.insert(END, msg + '\n')
        log.see('end')


def receive_public_keys_callback(*data):
    keys = data[0].get('message')

    if keys and keys.get('p') and keys.get('g'):
        global G
        global P
        global KEY_LENGTH
        global GENERATED_PUBLIC_KEY
        global DH

        p = int(keys.get('p'))
        g = int(keys.get('g'))
        key_length = int(keys.get('key_length'))

        if not GENERATED_PUBLIC_KEY or (P and G and (P != p or G != g)):
            DH = DiffieHellman(generator=g, prime=p,
                               key_length=key_length, private_key=PRIVATE_KEY)
            GENERATED_PUBLIC_KEY = DH.public_key
            print('GENERATED_PUBLIC_KEY: ' + str(GENERATED_PUBLIC_KEY))

        P = p
        G = g
        KEY_LENGTH = key_length


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
