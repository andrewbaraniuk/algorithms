/**
 * Finds the index of the smallest element in an array.
 * @param arr - The array to search through
 * @returns The index of the smallest element
 */
function findSmallest(arr: number[]): number {
    return arr.reduce(
        (smallestIndex, current, index) =>
            current < arr[smallestIndex] ? index : smallestIndex,
        0 // start by assuming index 0 is the smallest
    );
}
// start:      smallestIndex = 0  (value 5)
// index 1:    3 < 5  → smallestIndex = 1
// index 2:    6 < 3  → false, smallestIndex = 1
// index 3:    2 < 3  → smallestIndex = 3
// index 4:    10 < 2 → false, smallestIndex = 3

// result: 3 ✅

function findHighest(arr: number[]): number {
    return arr.reduce(
        (highestIndex, current, index) =>
            current > arr[highestIndex] ? index : highestIndex,
        0 // start by assuming index 0 is the smallest
    );
}

/**
 * Sorts an array of numbers in ascending order using the selection sort algorithm.
 * Repeatedly finds the smallest element and moves it to a new array.
 * Time complexity: O(n²)
 * @param arr - The array to sort (will be mutated)
 * @returns A new sorted array
 */
export function selectionSort(arr: number[]): number[] {
    console.log('⬅️  Source array: ', JSON.stringify(arr));
    const newArr: number[] = [];

    // Each iteration picks the smallest remaining element from arr
    // and appends it to newArr, until arr is empty
    while (arr.length > 0) {
        const smallest = findSmallest(arr);
        // splice() removes the element in-place and returns it as a single-item array,
        // so spread (...) is used to unpack it into push()
        newArr.push(...arr.splice(smallest, 1));
    }

    console.log('➡️  Sorted array: ', JSON.stringify(newArr));
    return newArr;
}
// Initial state:
//   arr    = [5, 3, 6, 2, 10]
//   newArr = []

// --- Iteration 1 ---
//   findSmallest([5, 3, 6, 2, 10]) → index 3  (value 2)
//   arr.splice(3, 1)               → removes 2, arr becomes [5, 3, 6, 10]
//   newArr.push(2)                 → newArr = [2]

// --- Iteration 2 ---
//   findSmallest([5, 3, 6, 10])   → index 1  (value 3)
//   arr.splice(1, 1)              → removes 3, arr becomes [5, 6, 10]
//   newArr.push(3)                → newArr = [2, 3]

// --- Iteration 3 ---
//   findSmallest([5, 6, 10])      → index 0  (value 5)
//   arr.splice(0, 1)              → removes 5, arr becomes [6, 10]
//   newArr.push(5)                → newArr = [2, 3, 5]

// --- Iteration 4 ---
//   findSmallest([6, 10])         → index 0  (value 6)
//   arr.splice(0, 1)              → removes 6, arr becomes [10]
//   newArr.push(6)                → newArr = [2, 3, 5, 6]

// --- Iteration 5 ---
//   findSmallest([10])            → index 0  (value 10)
//   arr.splice(0, 1)              → removes 10, arr becomes []
//   newArr.push(10)               → newArr = [2, 3, 5, 6, 10]

// --- arr.length is now 0, while loop exits ---

// Final result: [2, 3, 5, 6, 10] ✅