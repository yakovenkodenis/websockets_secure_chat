from des import DES


d = DES('qwertyui')

cipher = d.encrypt_64bit('heleo we')

l = cipher


cipher_str = ''.join(chr(int(
    ''.join(map(str, l[i:i + 8])), 2)) for i in range(0, len(l), 8))

print(cipher_str)

# cipher_arr = d._string_to_bitsarray(cipher_str)

# print(len(cipher_str))
# print(cipher_arr)
# print(len(cipher_arr))

deciphered_bits = d.decrypt_64bit(cipher, msg_in_bits=True)

print(len(deciphered_bits))
l = deciphered_bits

deciphered_str = ''.join(chr(int(
    ''.join(map(str, l[i:i + 8])), 2)) for i in range(0, len(l), 8))

print(deciphered_str)

print('------------------------')


print(d._string_to_bitsarray('hi'))

print('----------------------------')

print(d.get_subkeys([0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1]))
