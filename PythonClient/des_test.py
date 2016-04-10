from des import *


data = b'Some random message'

key = DES(b'DESCRYPT', CBC, b'\0\0\0\0\0\0\0\0', pad=None, padmode=PAD_PKCS5)
print(key)
d = key.encrypt(data)
print(d)
print(key.decrypt(d))

assert key.decrypt(d, padmode=PAD_PKCS5) == data
