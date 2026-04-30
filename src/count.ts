function countTail(arr: number[], count: number = 0) : number {
    return arr.length < 1 ? count : countTail(arr.slice(1), count + 1);
}

// Можна навіть узагальнити тип, щоб працювало з будь-яким масивом.
// function countTail<T>(arr: T[], count: number = 0): number {
//     return arr.length < 1 ? count : countTail(arr.slice(1), count + 1);
// }

export function arrayCount(arr: number[]): number {
    console.log('➡️  Number of elements in array: ', JSON.stringify(arr), ' = ', countTail(arr));

    return countTail(arr);
}