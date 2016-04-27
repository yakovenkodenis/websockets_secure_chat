import secureRandom from 'secure-random';
import { hashFunction } from '../hash/hashFunction';


export default class DiffieHellman {

    constructor(generator=2, prime=11, keyLength=3, privateKey) {
        const defaultGenerator = 2,
              validGenerators = [2, 3, 5, 7];

        if (validGenerators.indexOf(generator) === -1) {
            console.warn('Invalid generator. Using default');
            this.generator = defaultGenerator;
        } else {
            this.generator = generator;
        }

        this.keyLength = keyLength;
        this.prime = prime;

        if (privateKey) {
            this.privateKey = privateKey;
        } else {
            this.privateKey = this.genPrivateKey(this.keyLength);
        }

        this.publicKey = this.genPublicKey();
    }

    getRandom(bits) {
        let _rand = 0;
        const _bytes = bits;

        while (_rand.toString(2).length < bits) {
            _rand = parseInt(
                secureRandom(bits, {type: 'Array'})
                .map(x => x.toString(16))
                .map(x => x.length === 2 ? x : `0${x}`)
                .join(''),
            16);
        }

        return _rand;
    }

    genPrivateKey(bits) {
        return this.getRandom(bits);
    }

    genPublicKey() {
        return this.powMod(this.generator, this.privateKey, this.prime);
    }

    genSecret(privateKey, otherKey) {
        return this.powMod(otherKey, privateKey, this.prime);
    }

    genKey(otherKey) {
        this.sharedSecret = this.genSecret(this.privateKey, otherKey);

        let _sharedSecretBytes;

        try {
            const bitLenByEight = (
                this.sharedSecret.toString(2).length / 8
            ) | 0;
            _sharedSecretBytes =
                this.intToByteArray(this.sharedSecret, bitLenByEight + 1)
                .map(i => i.toString(16))
                .map(i => i.length === 1 ? `0${i}` : i)
                .reverse()
                .join('');
        } catch (e) {
            _sharedSecretBytes = this.sharedSecret.toString();
        }

        this.key = hashFunction(_sharedSecretBytes);
    }

    getPublicKey() {
        return this.publicKey;
    }

    getSharedSecret() {
        return this.sharedSecret;
    }

    getKey() {
        return this.key;
    }

    showParams() {
        console.log('Parameters:');
        console.log(`Prime [${this.prime.toString(2).length}]: ${this.prime}`);
        console.log(`Generator [${this.generator.toString(2).length}]: ` +
            `${this.generator}\n`);
        console.log(`Private key [${this.privateKey.toString(2).length}]: ` +
            this.privateKey);
        console.log(`Public key [${this.publicKey.toString(2).length}]` +
            this.publicKey);
    }

    showResults() {
        console.log('Results:');
        console.log(`Shared secret [${this.sharedSecret.toString(2).length}]` +
            `: ${this.sharedSecret}`);
        console.log(`Shared key [${this.key.toString().length}]: ` +
            this.key);
    }

    powMod(x, y, z) {
        let number = 1;

        while (y) {
            if (y & 1) {
                number = number * x % z;
            }
            y >>= 1;
            x = x * x % z;
        }

        return number;
    }

    intToByteArray(intToConvert, length=4) {
        let byteArray = new Array(length);

        for (let i = 0; i < byteArray.length; ++i) {
            const byte = intToConvert & 0xff;
            byteArray[i] = byte;
            intToConvert = (intToConvert - byte) / 256;
        }

        return byteArray;
    }
}
