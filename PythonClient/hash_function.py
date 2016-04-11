
def hash_function(s=''):
    a, b, c, d = 0xa0, 0xb1, 0x11, 0x4d
    result_hash = ''

    for byte in bytes(s, 'ascii'):
        a ^= byte
        b = b ^ a ^ 0x55
        c = b ^ 0x94
        d = c ^ byte ^ 0x74

    for i in [d, c, a, b]:
        tmp = str(hex(i))[2:]
        result_hash += tmp if len(tmp) is 2 else '0' + tmp

    return result_hash
