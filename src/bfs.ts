// Suppose "thom" is a seller.
const personIsSeller = (name: string): boolean => name.endsWith("m");
// or implement a simple queue manually:
export function search(name: string, graph: Record<string, string[]>): boolean {
    // graph[name] returns an array, e.g. ["alice", "bob", "claire"].
    // The spread ... unpacks it, and [...] wraps it into a new array.
    //
    // If you did const searchQueue = graph[name], then calling searchQueue.push(...)
    // or searchQueue.shift() would mutate the original graph object.
    // With the spread, you're working on a copy, so graph stays untouched.
    const searchQueue: string[] = [...graph[name]];
    // new Set() is a built-in JavaScript/TypeScript data structure,
    // specifically a collection of unique values.
    const searched: Set<string> = new Set();

    while (searchQueue.length > 0) {
        // ! is TypeScript's non-null assertion operator.
        // It tells the compiler "trust me, this won't be undefined."
        const person = searchQueue.shift()!;
        // Set — O(1), instant lookup via hash.
        // Whereas in case of an Array — O(n), scans the whole list each time
        if (!searched.has(person)) {
            if (personIsSeller(person)) {
                console.log(`${person} is a mango seller!`);
                return true;
            } else {
                searchQueue.push(...graph[person]);
                searched.add(person);
            }
        }
    }

    return false;
}