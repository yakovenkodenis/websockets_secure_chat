from binascii import hexlify
from diffie_hellman import DiffieHellman


a = DiffieHellman()
b = DiffieHellman()

a.gen_key(b.public_key)
b.gen_key(a.public_key)

a.show_params()
a.show_results()
b.show_params()
b.show_results()

if a.get_key() == b.get_key():
    print('Shared keys match')
    print('Key: ', hexlify(bytes(a.key, 'ascii')))
    print(a.get_key())
else:
    print("Shared secrets didn't match!")
    print("Shared secret A: ", a.gen_secret(b.public_key))
    print("Shared secret B: ", b.gen_secret(a.public_key))
