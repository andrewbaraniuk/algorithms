function sum(arr: number[]) : number {
    if (arr.length < 1) {
        return 0;
    }
    const first = arr[0];

    return first + sum(arr.slice(1));
}

// Функціональна (без операторів присвоєння) "single line" хвостова рекурсія.
function sumTail(arr: number[], acc: number = 0) : number {
    return arr.length < 1 ? acc : sumTail(arr.slice(1), arr[0] + acc);
}

export function arraySum(arr: number[]): number {
    console.log('➡️  Sum of array: ', JSON.stringify(arr), ' = ', sumTail(arr));
    // return sum(arr);
    return sumTail(arr);
}