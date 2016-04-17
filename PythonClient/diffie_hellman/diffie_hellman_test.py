from binascii import hexlify
from diffie_hellman import DiffieHellman


p = 11
g = 2

d1 = DiffieHellman(generator=g, prime=p, key_length=3)
# d2 = DiffieHellman(generator=g, prime=p, key_length=3)
# print(d1.public_key)
# print(d2.public_key)
# d1.gen_key(d2.public_key)
# d2.gen_key(d1.public_key)
d1.gen_key(2)

print('Public key: ' + str(d1.public_key))
print('Private key: ' + str(d1.private_key))
print(d1.get_key())

# d1.show_params()
# d1.show_results()
# d2.show_params()
# d2.show_results()

# if d1.get_key() == d2.get_key():
#     print('Shared keys match')
#     print('Key: ', hexlify(bytes(d1.key, 'ascii')))
#     print(d1.get_key())
# else:
#     print("Shared secrets didn't match!")
#     print("Shared secret A: ", d1.gen_secret(d2.public_key))
#     print("Shared secret B: ", d2.gen_secret(d1.public_key))
