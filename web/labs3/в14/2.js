let primeSum = 0;

for (let i = 2; i <= 1000; i++) {
    let prime = true;

    for (let j = 2; j <= Math.sqrt(i); j++) {
        if (i % j === 0) {
            prime = false;
            break;
        }
    }

    if (prime) {
        primeSum += i;
    }
}

console.log("Prime sum:", primeSum);