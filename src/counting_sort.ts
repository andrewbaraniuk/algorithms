export function countingSort(arr: number[], max: number): number[] {
    const counts = new Array(max + 1).fill(0);

    // Count occurrences of each value
    for (const n of arr) {
        counts[n] += 1;
    }

    // Reconstruct sorted array
    let i = 0;
    for (let n = 0; n < counts.length; n++) {
        for (let j = 0; j < counts[n]; j++) {
            arr[i] = n;
            i++;
        }
    }

    return arr;
}