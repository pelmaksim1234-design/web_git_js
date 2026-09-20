function checkNumbers(a, b) {
    return (a + b === 10 || Math.abs(a - b) === 10);
}

console.log(checkNumbers(7,3));
console.log(checkNumbers(20,10));