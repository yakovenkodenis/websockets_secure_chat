
def hash_function(s=b''):
    a, b, c, d = 0xa0, 0xb1, 0x11, 0x4d

    for byte in bytearray(s):
        a ^= byte
        b = b ^ a ^ 0x55
        c = b ^ 0x94
        d = c ^ byte ^ 0x74

    return format(d << 24 | c << 16 | a << 8 | b, '08x')
