function oddLengthStrings(arr) {
    return arr.filter(str => str.length % 2 !== 0);
}

let arr = ["hi", "car", "майонез", "пес"];
console.log(oddLengthStrings(arr));