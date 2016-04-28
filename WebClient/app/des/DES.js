
export default class DES {

    _initial_permutation = [
        58, 50, 42, 34, 26, 18, 10, 2,
        60, 52, 44, 36, 28, 20, 12, 4,
        62, 54, 46, 38, 30, 22, 14, 6,
        64, 56, 48, 40, 32, 24, 16, 8,
        57, 49, 41, 33, 25, 17, 9, 1,
        59, 51, 43, 35, 27, 19, 11, 3,
        61, 53, 45, 37, 29, 21, 13, 5,
        63, 55, 47, 39, 31, 23, 15, 7
    ]

    _final_permutation = [
        40, 8, 48, 16, 56, 24, 64, 32,
        39, 7, 47, 15, 55, 23, 63, 31,
        38, 6, 46, 14, 54, 22, 62, 30,
        37, 5, 45, 13, 53, 21, 61, 29,
        36, 4, 44, 12, 52, 20, 60, 28,
        35, 3, 43, 11, 51, 19, 59, 27,
        34, 2, 42, 10, 50, 18, 58, 26,
        33, 1, 41, 9, 49, 17, 57, 25
    ]

    _expansion_function = [
        32, 1, 2, 3, 4, 5,
        4, 5, 6, 7, 8, 9,
        8, 9, 10, 11, 12, 13,
        12, 13, 14, 15, 16, 17,
        16, 17, 18, 19, 20, 21,
        20, 21, 22, 23, 24, 25,
        24, 25, 26, 27, 28, 29,
        28, 29, 30, 31, 32, 1
    ]

    _permutation = [
        16, 7, 20, 21, 29, 12, 28, 17,
        1, 15, 23, 26, 5, 18, 31, 10,
        2, 8, 24, 14, 32, 27, 3, 9,
        19, 13, 30, 6, 22, 11, 4, 25
    ]

    _pc1 = [
        57, 49, 41, 33, 25, 17, 9,
        1, 58, 50, 42, 34, 26, 18,
        10, 2, 59, 51, 43, 35, 27,
        19, 11, 3, 60, 52, 44, 36,
        63, 55, 47, 39, 31, 23, 15,
        7, 62, 54, 46, 38, 30, 22,
        14, 6, 61, 53, 45, 37, 29,
        21, 13, 5, 28, 20, 12, 4
    ]

    _pc2 = [
        14, 17, 11, 24, 1, 5,
        3, 28, 15, 6, 21, 10,
        23, 19, 12, 4, 26, 8,
        16, 7, 27, 20, 13, 2,
        41, 52, 31, 37, 47, 55,
        30, 40, 51, 45, 33, 48,
        44, 49, 39, 56, 34, 53,
        46, 42, 50, 36, 29, 32
    ]

    _left_rotations = [
        1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1
    ]

    _sbox = [
        // S1
        [
            14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7,
            0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8,
            4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0,
            15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13
        ],

        // S2
        [
            15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10,
            3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5,
            0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15,
            13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9
        ],

        // S3
        [
            10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8,
            13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1,
            13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7,
            1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12
        ],

        // S4
        [
            7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15,
            13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9,
            10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4,
            3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14
        ],

        // S5
        [
            2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9,
            14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6,
            4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14,
            11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3
        ],

        // S6
        [
            12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11,
            10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8,
            9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6,
            4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13
        ],

        // S7
        [
            4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1,
            13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6,
            1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2,
            6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12
        ],

        // S8
        [
            13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7,
            1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2,
            7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8,
            2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11
        ]
    ]

    constructor(key) {
        this.key = key;
    }

    encrypt64bit(message) {
        let bitsArrayMsg = this._stringToBitsArray(message);
        let bitsArrayKey = this._stringToBitsArray(this.key);
    }

    crypt(message, encrypt=true, msgInBits=false) {
        let bitsArrayMsg;

        if (msgInBits) {
            bitsArrayMsg = message;
        } else {
            bitsArrayMsg = this._stringToBitsArray(message);
        }

        let bitsArrayKey = this._stringToBitsArray(this.key);

        if (bitsArrayMsg.length != 64) {
            throw new Error('Message must be 64 bit!');
        }

        if (bitsArrayKey.length != 64) {
            throw new Error('Key must be 64 bit!');
        }

        // Compute 16 48-bit subkeys
        let subkeys = this.getSubkeys(bitsArrayKey);

        // Convert the message using the initial permutation block
        let msg = [];
        for (let i of this._initial_permutation) {
            msg.push(bitsArrayMsg[i - 1]);
        }

        let L = msg.slice(0, 32),
            R = msg.slice(32);

        if (encrypt) {
            for (let i = 0; i < 16; ++i) {
                // TODO implement feistel function rounds
            }
        } else {
            for (let i = 15; i >= 0; --i) {
                // TODO implement feistel function rounds
            }
        }

        let beforeFinalPermute = L.concat(R);

        // compute final permutation
    }

    getSubkeys(bitsArrayKey) {
        // Compute Permuted Choice 1 on the key
        let key56bit = []

        for (let i of this._pc1) {
            key56bit.push(bitsArrayKey[i-1]);
        }

        // Split the key into two 28-bit subkeys
        let key56left = key56bit.slice(0, 28),
            key56right = key56bit.slice(28);

        // Compute 16 48-bit keys using left rotations and permuted choice 2
        let subkeys48bit = [];
        let C = key56left, D = key56right;

        for (let i = 0; i < 16; ++i) {
            C = this._arrayLeftRotate(C, this._left_rotations[i]);
            D = this._arrayLeftRotate(D, this._left_rotations[i]);
            let CD = C.concat(D);

            let CDres = []
            for (let j of this._pc2) {
                CDres.push(CD[j-1]);
            }
            subkeys48bit.push(CDres);
        }

        return subkeys48bit;
    }

    _stringToBitsArray(str) {
        return this._stringToByteArray(str)
                .map(i => this._createBinaryString(i).substr(24))
                .map(i => i.split(''))
                .reduce((i1, i2) => i1.concat(i2))
                .map(i => parseInt(i));
    }

    _stringToByteArray(str) {
        let byteArray = [],
            len = str.length,
            i = 0;

        for (i; i < len; ++i) {
            byteArray.push(str.charCodeAt(i));
        }

        return byteArray;
    }

    _createBinaryString(nMask) {
        for (var nFlag = 0, nShifted = nMask, sMask = ''; nFlag < 32;
             nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
        return sMask;
    }

    _arrayLeftRotate(arr, rotations=1) {
        for (let i = 0; i < rotations; ++i) {
            arr = this._arrayLeftShift(arr);
        }
        return arr;
    }

    _arrayLeftShift(arr) {
        let temp = new Array(),
            len = arr.length - 1,
            i = 1;

        for (i; i <= len; ++i) {
            temp.push(arr[i]);
        }
        temp.push(arr[0]);

        return temp;
    }
}
