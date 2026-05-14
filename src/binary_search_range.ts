// Return 1 if n is too big, -1 if too small, 0 if correct
function isCorrect(n: number, target: number): number {
    if (n > target) return 1;
    if (n < target) return -1;
    return 0;
}

// Binary search on some range of values
export default function binarySearchRange(low: number, high: number, target: number): number {
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        if (isCorrect(mid, target) > 0) {
            high = mid - 1;
        } else if (isCorrect(mid, target) < 0) {
            low = mid + 1;
        } else {
            return mid;
        }
    }

    return -1;
}
