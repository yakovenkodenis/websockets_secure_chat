# -*- coding: utf-8 -*-

from socketIO_client import SocketIO, LoggingNamespace


def on_bbb_response(*args):
    print('on_bbb_response', args)


def on_chat_message_response(*args):
    print(args)

with SocketIO('http://192.168.0.110', 8080, LoggingNamespace) as socketIO:
    socketIO.emit('hello', {'xxx': 'yyy'}, on_bbb_response)
    # socketIO.wait_for_callbacks(seconds=1)

    socketIO.on('chat message', on_chat_message_response)

print('hello')