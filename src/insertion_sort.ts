// ─── Imperative Version ───────────────────────────────────────────────────────

// Classic insertion sort: for each element, shift it leftward
// into its correct position among the already-sorted left partition.
export function insertionSortImperative(arr: number[]): number[] {
    for (let i = 1; i < arr.length; i++) {
        let j = i - 1;
        // Walk leftward, swapping adjacent elements until the current
        // element is no longer less than its left neighbor.
        while (j >= 0 && arr[j + 1] < arr[j]) {
            const tmp = arr[j + 1];
            arr[j + 1] = arr[j];
            arr[j] = tmp;
            j -= 1;
        }
    }
    return arr;
}


// ─── Functional Version (naive recursion) ─────────────────────────────────────

// No mutations, no index variables — just recursive function calls.
// Risk: may blow the call stack on very large arrays (no TCO in JS/TS).
export function insertionSortFunctional(arr: number[]): number[] {

    // Insert `value` into the correct position within an already-sorted array.
    // Recursively peels the last element off `sorted` until it finds the spot
    // where `value` belongs, then rebuilds the array on the way back up.
    function insert(sorted: number[], value: number): number[] {
        if (sorted.length === 0 || value >= sorted[sorted.length - 1]) {
            // Base case: either the sorted partition is empty, or value belongs at the end.
            return [...sorted, value];
        }
        // value is smaller than the last element — peel off the last element,
        // recurse, then reattach it after value has been placed.
        return insert(sorted.slice(0, sorted.length - 1), value).concat(sorted[sorted.length - 1]);
    }

    // Consume `remaining` one element at a time, inserting each `head`
    // into the growing `sorted` accumulator. Tail-recursive in shape,
    // but JS engines do not guarantee tail-call optimization.
    function sort(remaining: number[], sorted: number[]): number[] {
        if (remaining.length === 0) return sorted;
        const [head, ...tail] = remaining;
        return sort(tail, insert(sorted, head));
    }

    return sort(arr, []);
}


// ─── Functional Version with Trampoline ───────────────────────────────────────

// A trampoline turns recursive calls into an iterative loop,
// preventing stack overflow for large inputs while keeping the
// logic purely functional (no mutation, no explicit loops in business logic).

// A thunk is a zero-argument function that represents a deferred computation.
// The trampoline repeatedly calls thunks until a plain value is returned.
type Thunk<T> = () => T | Thunk<T>;

// The trampoline runner: keeps bouncing as long as it receives a function (thunk),
// and stops when it receives a plain value.
function trampoline<T>(fn: Thunk<T>): T {
    let result: T | Thunk<T> = fn;
    // Instead of recursive calls growing the stack, we loop here.
    while (typeof result === "function") {
        result = (result as Thunk<T>)();
    }
    return result;
}

export function insertionSortTrampoline(arr: number[]): number[] {

    // Same logic as the functional version, but instead of calling itself directly,
    // `insert` returns a thunk when it needs to recurse — handing control back
    // to the trampoline to avoid growing the call stack.
    function insert(sorted: number[], value: number): number[] {
        function step(s: number[]): number[] | Thunk<number[]> {
            if (s.length === 0 || value >= s[s.length - 1]) {
                // Base case: value belongs at the end of the current partition.
                return [...s, value];
            }
            // Defer the recursive step as a thunk instead of calling directly.
            return () =>
                (trampoline(() => step(s.slice(0, s.length - 1))) as number[]).concat(s[s.length - 1]);
        }
        return trampoline(() => step(sorted)) as number[];
    }

    // Same accumulator pattern as the functional version, but the recursive
    // call to `sort` is wrapped in a thunk so the trampoline drives the loop.
    function sort(remaining: number[], sorted: number[]): number[] {
        function step(rem: number[], acc: number[]): number[] | Thunk<number[]> {
            if (rem.length === 0) return acc;
            const [head, ...tail] = rem;
            // Return a thunk — the trampoline will call it in the next iteration.
            return () => step(tail, insert(acc, head));
        }
        return trampoline(() => step(remaining, sorted)) as number[];
    }

    return sort(arr, []);
}
