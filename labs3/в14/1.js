let a = 0;
let b = 1;
let count = 1;
let sum = 0;

while (count <= 10) {
    sum += a;
    let next= a+b;
    a=b;
    b=next;
    count++;
}
console.log("сума 100 чисел:",sum);