import numpy as np
import matplotlib.pyplot as plt
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


# Calculate the probability of collision for 100 keys using Birthday Attack
n = num_of_all_hashes = 2 ** 8  # 256
keys = 256
no_coll_probs = np.array([(n - k) / n for k in range(keys)])
keys_arr = np.array(range(keys))
no_collision = np.prod(no_coll_probs)
print(no_collision)
coll_prob = 1 - no_collision
print('Probability of collision in %d keys is %f' % (keys, coll_prob))

plt.plot(keys_arr, 1 - no_coll_probs)
plt.show()
