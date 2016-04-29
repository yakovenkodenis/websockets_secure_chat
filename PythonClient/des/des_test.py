from des import DES


d = DES('qwertyui')

cipher = d.encrypt('hello world!')

deciphered = d.decrypt(cipher, msg_in_bits=True)

print(deciphered)
