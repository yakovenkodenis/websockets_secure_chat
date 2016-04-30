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
Des = None
MESSAGE_COUNT = 0


def emit_message(address=ADDRESS, port=PORT, message=''):
    with SocketIO(address, port, LoggingNamespace) as socketIO:
        # Encrypt DES message

        cipher = message

        global Des
        global MESSAGE_COUNT

        MESSAGE_COUNT += 1

        if MESSAGE_COUNT != 1:
            if not Des and DES_HASH_PRIVATE_KEY:
                Des = DES(DES_HASH_PRIVATE_KEY)

            if Des:
                print('BEFORE ENCRYPTION: ' + str(message))
                cipher = Des.encrypt(message)
                print(cipher)

        print(cipher)
        print('DES_HASH_PRIVATE_KEY: ' + str(DES_HASH_PRIVATE_KEY))
        print(Des)

        print('BELOW WILL BE THE ENCODED MESSAGE:')
        cipher_b64 = base64.b64encode(
            bytes(''.join(str(b) for b in cipher), 'ascii')
        ).decode('ascii')

        print(cipher_b64)

        response = {
            'payload': cipher_b64,
            'sender': 'me',
            'public_shared_key': GENERATED_PUBLIC_KEY,
            'encrypted': MESSAGE_COUNT != 1
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
        encrypted = bool(message.get('encrypted'))

        if encrypted:

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

            # Decrypt DES msg

            print('CIPHERED_MESSAGE: ' + str(msg))

            global Des

            if not Des and DES_HASH_PRIVATE_KEY:
                Des = DES(DES_HASH_PRIVATE_KEY)

            if Des:
                try:
                    print(list(base64.b64decode(msg).decode('ascii')))
                    bits = list(
                        map(int, list(base64.b64decode(msg).decode('ascii')))
                    )
                    msg = Des.decrypt(bits, msg_in_bits=True)
                except Exception:
                    msg = base64.b64decode(msg).decode('ascii')

        else:
            msg = base64.b64decode(msg).decode('ascii')

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
