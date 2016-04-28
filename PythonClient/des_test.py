import base64
# from des_var2 import *


# # TODO currently does not unpad the data.
# # Also, needs to be refactored to use PKCS7 instead of PKCS5.
# data = b'message'

# key = des(b'PASSWORD', mode=ECB, IV='\0\0\0\0\0\0\0\0', pad='*', padmode=PAD_NORMAL)
# # key = DES(b'PASSWORD', mode=ECB, pad=None, padmode=PAD_PKCS5)
# print(key)
# d = key.encrypt(data)
# print(d)
# print(key.decrypt(d))

# for i in d:
#     print(hex(i))

# assert key.decrypt(d, padmode=PAD_NORMAL) == data


from des import *


# data = bytes('hello', 'ascii')
# # key = bytes('91d29d46', 'ascii')
# key = bytes('91dc9048', 'ascii')

# des = DES(key, padmode=PAD_PKCS5)

# ciphered = des.encrypt(data)

# print(ciphered)

# # deciphered = des.decrypt(ciphered)
# deciphered = des.decrypt(b'xbc*****')

# print('deciphered: ' + str(deciphered))


data = b'yearh, shit'
key = b'97d39947'

des = DES(key, padmode=PAD_PKCS5)

ciphered = des.encrypt(data)

print(base64.b64encode(ciphered))

deciphered = des.decrypt(ciphered)

print(deciphered)

print(des.decrypt(b'\xf4\xb2\xbb\r\xf9\x8e\xcd\x8bJ=|Z=n\x1f_'))
