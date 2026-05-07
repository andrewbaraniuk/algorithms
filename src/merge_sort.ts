// ============================================================
// VERSION 1: IMPERATIVE (in-place) — faithful to the original
// ============================================================

/**
 * Merges two sorted sub-arrays of `arr` back into `arr` in-place.
 * Left sub-array:  arr[s..m]
 * Right sub-array: arr[m+1..e]
 */
function merge(arr: number[], s: number, m: number, e: number): void {
    const left = arr.slice(s, m + 1);   // copy left half
    const right = arr.slice(m + 1, e + 1); // copy right half

    let i = 0, j = 0, k = s;

    // Pick the smaller element from each half and write it back
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
        }
    }

    // Drain whichever half still has elements
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}

/**
 * Imperative merge sort — mutates `arr` in-place.
 * Mirrors the original Java pseudocode directly.
 *
 * @param arr - the array to sort (modified in place)
 * @param s   - start index (inclusive)
 * @param e   - end index (inclusive)
 */
export function mergeSort(arr: number[], s: number, e: number): number[] {
    // Base case: a sub-array of 0 or 1 elements is already sorted
    if (e - s + 1 <= 1) return arr;

    const m = Math.floor((s + e) / 2); // find the midpoint

    mergeSort(arr, s, m);       // recursively sort the left half
    mergeSort(arr, m + 1, e);   // recursively sort the right half

    merge(arr, s, m, e);        // merge the two sorted halves

    return arr;
}

// --- Usage ---
const data = [38, 27, 43, 3, 9, 82, 10];
mergeSort(data, 0, data.length - 1);
console.log("Imperative:", data); // [3, 9, 10, 27, 38, 43, 82]


// ============================================================
// VERSION 2: FUNCTIONAL (pure) — immutable, no side effects
// ============================================================

/**
 * Merges two already-sorted arrays into a new sorted array.
 * Pure function — does not touch the originals.
 */
const mergeSorted = (left: number[], right: number[]): number[] => {
    // Both halves exhausted → nothing left to merge
    if (left.length === 0) return right;
    if (right.length === 0) return left;

    // Compare heads: take the smaller one, recurse on the rest
    const [lHead, ...lTail] = left;
    const [rHead, ...rTail] = right;

    return lHead <= rHead
        ? [lHead, ...mergeSorted(lTail, right)]  // left head wins
        : [rHead, ...mergeSorted(left, rTail)];  // right head wins
};

/**
 * Functional merge sort — returns a brand-new sorted array.
 * The input array is never modified (referential transparency).
 *
 * Strategy: split → sort each half → merge results
 *
 * @param arr - any readonly array of numbers
 * @returns   - a new sorted array
 */
export const mergeSortFn = (arr: readonly number[]): number[] => {
    // Base case: arrays with 0 or 1 element are trivially sorted
    if (arr.length <= 1) return [...arr];

    const mid = Math.floor(arr.length / 2);

    const left = mergeSortFn(arr.slice(0, mid)); // sort left half
    const right = mergeSortFn(arr.slice(mid));     // sort right half

    return mergeSorted(left, right); // combine into a sorted whole
};

// --- Usage ---
const original = [38, 27, 43, 3, 9, 82, 10];
const sorted = mergeSortFn(original);
console.log("Functional:", sorted);   // [3, 9, 10, 27, 38, 43, 82]
console.log("Original unchanged:", original); // still [38, 27, 43, ...]

// One heads-up on the functional mergeSorted:
// it uses recursion internally too,
// which is elegant but can hit stack limits on very large arrays.
// For production FP code you'd typically replace that with a simple while loop inside the pure merge,
// keeping the outer mergeSortFn recursive/pure.