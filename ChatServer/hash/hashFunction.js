export function hashFunction(s='') {
    let [a, b, c, d] = [0xa0, 0xb1, 0x11, 0x4d];
    let resultHash= '';

    for (let byte of s.split('')) {
        const tmp = byte.charCodeAt(0);
        a ^= tmp;
        b = b ^ a ^ 0x55;
        c = b ^ 0x94;
        d = c ^ tmp ^ 0x74;
    }

    for (let i of [d, c, a, b]) {
        const tmp = i.toString(16);
        resultHash += tmp.length === 2 ? tmp : `0${tmp}`;
    }

    return resultHash;
}
