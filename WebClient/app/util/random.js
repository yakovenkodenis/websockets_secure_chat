
export function randInt(min=10, max=99) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
