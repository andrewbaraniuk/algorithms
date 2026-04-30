function sort(arr: number[]): number[] {
    if (arr.length < 2) {
        return arr;
    }

    const pivot = arr[0];
    // Skip first element (pivot).
    const [newArrLess, newArrGreater] = arr.slice(1).reduce<[number[], number[]]>(
        ([less, greater], x) => {
            (x <= pivot ? less : greater).push(x);
            return [less, greater];
        },
        [[], []]
    );

    // return [...sort(less), ...[pivot], ...sort(greater)];
    return [...sort(newArrLess), pivot, ...sort(newArrGreater)];
}

export function quickSort(arr: number[]): number[] {
    console.log('➡️  Sorted array: ', JSON.stringify(sort(arr)));
    return sort(arr);
}