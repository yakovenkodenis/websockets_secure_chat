export function powMod(x, y, z) {
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