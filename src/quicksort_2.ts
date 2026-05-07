function quickSort(arr: number[], s: number, e: number): number[] {
    if (e - s + 1 <= 1) {
        return arr;
    }

    const pivot = arr[e];
    let left = s;

    // Partition: elements smaller than pivot on left side
    for (let i = s; i <= e; i++) {
        if (arr[i] < pivot) {
            const tmp = arr[left];
            arr[left] = arr[i];
            arr[i] = tmp;
            left++;
        }
    }

    // Move pivot in-between left & right sides
    arr[e] = arr[left];
    arr[left] = pivot;

    quickSort(arr, s, left - 1);
    quickSort(arr, left + 1, e);

    return arr;
}

export function sort(arr: number[]): number[] {
    return quickSort([...arr], 0, arr.length - 1);
}
