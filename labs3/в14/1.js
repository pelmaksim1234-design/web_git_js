let a = 10;
let b = 15;
let count = 15;
let sum = 10;

while (count <= 100) {
    sum += a;
    let next= a+b;
    a=b;
    b=next;
    count++;
}
console.log("сума 100 чисел:",sum);