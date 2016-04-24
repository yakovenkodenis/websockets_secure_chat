import {
    ECB, CBC,
    PAD_NORMAL, PAD_PKCS5
} from 'constants';


export default class DesBase {

    constructor(mode=ECB, IV=null, pad=null padmode=PAD_NORMAL) {
        if (IV) {
            IV = this._guardAgainstUnicode(IV);
        }
        if (pad) {
            pad = this._guardAgainstUnicode(pad);
        }
        this.block_size = 8;

        // Sanity checking for arguments
        if (pad && padmode == PAD_PKCS5) {
            throw new Error('Cannot use a pad character with PAD_PKCS5');
        }
        if (IV && IV.length != this.block_size) {
            throw new Error(
                'Invalid Initial Value (IV), must be a ' +
                `multiple of ${this.block_size} bytes`
            );
        }

        // Set the passed in variables
        this._mode = mode;
        this._iv = IV;
        this._padding = pad;
        this._padmode = padmode;
    }

    // get key -> bytes
    get key() {
        return this.__key;
    }

    // Will set the crypting key for this object
    set key(key) {
        key = this._guardAgainstUnicode(key);
        this.__key = key;
    }

    // get mode -> ECB or CBC
    get mode() {
        return this._mode;
    }

    // Sets the type of crypting mode: ECB or CBC
    set mode(mode) {
        this._mode = mode;
    }

    // get padding -> bytes of length 1. Padding character.
    get padding() {
        return this._padding;
    }

    // set padding -> bytes of length 1. Padding character.
    set padding(pad) {
        if (pad) {
            pad = this._guardAgainstUnicode(pad);
        }
        this._padding = pad;
    }

    // get padMode -> PAD_NORMAL or PAD_PKCS5
    get padMode() {
        return this._padmode;
    }

    // Sets the type of padding mode: PAD_NORMAL or PAD_PKCS5
    set padMode(mode) {
        this._padmode = mode;
    }

    // get IV -> bytes
    get IV() {
        return this._iv;
    }

    // Will set the Initial Value used in conjunction with CBC mode
    set IV(IV) {
        if (!IV || IV.length != this.block_size) {
            throw new Error(
                'Invalid Initial Valie (IV), must be ' +
                `a multiple of ${this.block_size} bytes`
            );
        }

        IV = this._guardAgainstUnicode(IV);
        this._iv = IV;
    }

    _padData(data, pad, padmode) {
        // Pad data depending on the mode
        if (!padmode) {
            // Get the default padding mode.
            padmode = this.padMode;
        }

        if (pad && padmode === PAD_PKCS5) {
            throw new Error('Cannot use a pad character with PAD_PKCS5');
        }

        if (padmode === PAD_NORMAL) {
            if (data.length % this.block_size === 0) {
                // No padding required
                return data;
            }

            if (!pad) {
                pad = this.padding;
            }

            if (!pad) {
                throw new Error(
                    'Data must be a multiple of ' +
                    `${this.block_size} bytes in length. ` +
                    'Use padmode=PAD_PKCS5 or set the pad character'
                );
            }

            // data += (this.block_size - data.length % this.block_size) * pad;
            data.push(
                ...this._populateNumberToArray(
                    this.block_size - data.length % this.block_size,
                    this._stringToBytesArray(pad))
            );
        } else if (padmode === PAD_PKCS5) {
            const pad_len = 8 - (data.length % this.block_size);
            data.push(
                ...this._populateNumberToArray(pad_len)
            );
        }

        return data;
    }

    _unpadData(data, pad, padmode) {
        // Unpad data depending on mode
        if (!data) {
            return data;
        }

        if (pad && padmode === PAD_PKCS5) {
            throw new Error('Cannot use a pad character with PAD_PKCS5');
        }

        if (!padmode) {
            // Get the default padding mode.
            padmode = this.padMode;
        }

        if (padmode === PAD_NORMAL) {
            if (!pad) {
                // Get the default padding.
                pad = this.padding;
            }

            if (pad) {
                data = data.slice(0, -this.block_size);
                data.push(
                    ...this._rstrip(data[data.length - this.block_size].join(''))
                        .split('');
                );
            }
        } else if (padmode === PAD_PKCS5) {
            const pad_len = data[data.length - 1];
            data = data.slice(0, -pad_len);
        }

        return data;
    }

    _guardAgainstUnicode(data) {
        if (data instanceof str) {
            // TODO
        }
    }

    _populateNumberToArray(number, pad=number) {
        let array = [];
        for (let i = 0; i < number; ++i) {
            array.push(pad);
        }
        return array;
    }

    _stringToBytesArray(str) {
        const buff = new Buffer(str, 'utf16le');
        let resBuffer = [];

        for (let i = 0; i < buff.length; ++i) {
            resBuffer.push(buff[i]);
        }

        return resBuffer;
    }

    _rstrip(str, ch) {
        let i = str.length - 1,
            toSlice = 0;

        while (i >= 0 && str[i] === ch) {
            toSlice++;
            i--;
        }

        return str.slice(0, -toSlice);
    }
}
