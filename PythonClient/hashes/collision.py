from random import choice, seed
from hash_function import hash_function


# ASCII chars that print nicely
ascii = ''.join([chr(i) for i in range(33, 127)])

seed(37)

found = {}
for j in range(5000):
    # Build a 4 byte random string
    s = bytes(''.join([choice(ascii) for _ in range(4)]), 'ascii')
    h = hash_function(s)
    if h in found:
        v = found[h]
        if v == s:
            # Same hash, but from the same source string
            continue
        print(h, found[h], s)
    found[h] = s