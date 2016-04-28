from des import DES


d = DES('qwertyui')

cipher = d.encrypt_64bit('hello we')

l = cipher

cipher_str = ''.join(chr(int(
    ''.join(map(str, l[i:i + 8])), 2)) for i in range(0, len(l), 8))

print(cipher_str)
