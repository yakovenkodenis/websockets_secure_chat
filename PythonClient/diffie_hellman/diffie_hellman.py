from hashes.hash_function import hash_function
from binascii import hexlify
try:
    import ssl
    random_function = ssl.RAND_bytes
    random_provider = "Python SSL"
except (AttributeError, ImportError):
    import OpenSSL
    random_function = OpenSSL.rand.bytes
    random_provider = "OpenSSL"


class DiffieHellman(object):

    def __init__(self, generator=2, prime=11, key_length=540):

        default_generator = 2
        valid_generators = [2, 3, 5, 7]

        if generator not in valid_generators:
            print('Invalid generator. Using default')
            self.generator = default_generator
        else:
            self.generator = generator

        self.key_length = key_length

        self.prime = prime
        self.private_key = self.gen_private_key(self.key_length)
        self.public_key = self.gen_public_key()

    def get_random(self, bits):
        _rand = 0
        _bytes = bits

        while _rand.bit_length() < bits:
            _rand = int.from_bytes(random_function(_bytes), byteorder='big')

        return _rand

    def gen_private_key(self, bits):
        return self.get_random(bits)

    def gen_public_key(self):
        return pow(self.generator, self.private_key, self.prime)

    def gen_secret(self, private_key, other_key):
        return pow(other_key, private_key, self.prime)

    def gen_key(self, other_key):
        self.shared_secret = self.gen_secret(self.private_key, other_key)
        print('Shared secret: ' + str(self.shared_secret))

        try:
            _shared_secret_bytes = self.shared_secret.to_bytes(
                self.shared_secret.bit_length() // 8 + 1, byteorder='big'
            )
        except AttributeError:
            _shared_secret_bytes = str(self.shared_secret)

        # self.key = hash_function(bytes(_shared_secret_bytes, 'ascii'))
        self.key = hash_function(_shared_secret_bytes)

    def get_key(self):
        return self.key

    def show_params(self):
        print('Parameters:')
        print('Prime [{0}]: {1}'.format(self.prime.bit_length(), self.prime))
        print(
            'Generator [{0}]: {1}\n'
            .format(self.generator.bit_length(), self.generator))
        print(
            'Private key [{0}]: {1}\n'
            .format(self.private_key.bit_length(), self.private_key))
        print(
            'Public key [{0}]: {1}'
            .format(self.public_key.bit_length(), self.public_key))

    def show_results(self):
        print('Results:')
        print(
            'Shared secret [{0}]: {1}'
            .format(self.shared_secret.bit_length(), self.shared_secret))
        print(
            'Shared key [{0}]: {1}'.format(len(self.key),
                                           hexlify(bytes(self.key, 'ascii'))))
