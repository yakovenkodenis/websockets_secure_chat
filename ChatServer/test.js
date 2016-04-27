import Decimal from 'decimal.js';


function powMod(x, y, z) {
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

function powModV3(x, y, z) {
    let number = new Decimal(1);

    x = new Decimal(x);
    y = new Decimal(y);
    z = new Decimal(z);

    const two = new Decimal(2),
          zero = new Decimal(0);

    while (y.greaterThan(zero)) {
        if (new Decimal(y & 1) == 1) {
            number = number.times(x).modulo(z);
        }
        y = y.dividedBy(2).floor();
        x = x.times(x).modulo(z);
    }

    return number.toString();
}

function powModV2(a, b, c) {
    let x = new Decimal(1);

    a = new Decimal(a);
    b = new Decimal(b);
    c = new Decimal(c);

    while (b > 0) {
        if (b & 1 == 1) {
            x = x.times(a).mod(c);
        }
        a = a.times(a).mod(c);
        b >>= 1;
    }

    return parseInt(x.mod(c).toString());
}

console.log(powMod(176672119508, 55, 200000023499));
console.log(powModV3(176672119508, 55, 200000023499));
