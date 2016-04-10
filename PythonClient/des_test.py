from des_var2 import *


data = b'message'

key = des(b'PASSWORD', mode=ECB, IV='\0\0\0\0\0\0\0\0', pad='*', padmode=PAD_NORMAL)
# key = DES(b'PASSWORD', mode=ECB, pad=None, padmode=PAD_PKCS5)
print(key)
d = key.encrypt(data)
print(d)
print(key.decrypt(d))

for i in d:
    print(hex(i))

assert key.decrypt(d, padmode=PAD_NORMAL) == data
