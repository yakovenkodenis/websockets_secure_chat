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
}
