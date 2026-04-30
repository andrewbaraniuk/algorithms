// 5! = 5 * 4 * 3 * 2 * 1.
// n! = n * (n - 1)! = n * (n - 1) * (n - 2)!
function f(number: number): number {
    if (number <= 1) {
        return 1;
    }

    return number * f(number - 1);
}
//  Хвостова рекурсія.
function fTail(number: number, acc: number = 1): number {
    if (number <= 1) {
        return acc;
    }

    return fTail(number - 1, number * acc);
}

export function factorial(number: number): number {
    console.log('➡️  Factorial for: ', number, ' = ', f(number));
    // return fTail(number);
    return f(number);
}