// The core issue is that reading and understanding code is passive. Your brain recognizes the logic but doesn't build the muscle memory to produce it. So the key shift is moving from reading to active recall.
// A few things that actually work:
// 1. Close the book and retype it from scratch. Not copy-paste — close everything and write it again. You'll immediately discover what you actually retained vs. what you thought you did.
// 2. Solve variations, not repetitions. Once you understand selection sort, don't sort numbers again — sort strings, sort by object property, find the largest instead of smallest. Forces your brain to understand the principle, not memorize the code.
// 3. Explain it out loud. The step-by-step walkthrough you just asked me to do — do that yourself, without looking. If you can't narrate it, you don't own it yet.
// 4. Spaced repetition. Come back to the same problem after 1 day, then 3 days, then a week. Each time, write it from scratch. This is how long-term memory actually works.
// 5. Connect it to something real. You're a web developer — where would you actually use sorting? Rendering a sorted list of posts, ordering search results, etc. Real context makes abstract algorithms sticky.
// The honest truth is that even experienced engineers google algorithm details. The goal isn't memorizing syntax — it's recognizing "this is a selection sort situation" and knowing roughly how to reach for it. That pattern recognition only comes from repetition over time.

// Турнікет (Tourniquet).
import { tourniquet } from "./tourniquet";
// Стартуємо турнікет у стані "locked"
// tourniquet("locked");

// Решето Ератосфена (Sieve of Eratosthenes).
import { sieve } from "./sieve";
// Стартуємо решето для числа 50 => [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47].
// sieve(50);

// бінарний пошук (Binary search).
import { binarySearch } from "./binary_search";
// Застосовуємо бінарний пошук в масиві зі 128 чисел для пошуку заданого числа.
// binarySearch(13, 1024);

// Сортування вибором.
import { selectionSort } from "./selection_sort"
// [5, 3, 6, 2, 10] => [2, 3, 5, 6, 10].
// selectionSort([5, 3, 6, 2, 10]);

// n!, Факторіал.
import { factorial } from "./factorial";
// factorial(10);

// n!, Факторіал, хвостова рекурсія.
import { factorialTail } from "./factorial_tail";
// factorialTail(10);

// Сума числових значень в масиві.
import { arraySum } from "./sum";
// arraySum([1, 2, 3, 4, 5]);

// Кількість елементів у масиві.
import { arrayCount } from "./count";
// arrayCount([1, 2, 3, 4, 5]);

// Швидке сортування.
import { quickSort } from "./quicksort";
// quickSort([7, 3, 10, 23, 6, 2, 0, 8]);

// Пошук в ширину.
import { search } from "./bfs";
// Dummy graph - "thom" is a mango seller.
// const graph: Record<string, string[]> = {
//     you: ["alice", "bob", "claire"],
//     bob: ["anuj", "peggy"],
//     alice: ["peggy"],
//     claire: ["thom", "jonny"],
//     anuj: [],
//     peggy: [],
//     thom: [],
//     jonny: [],
// };
// search("you", graph);

// Алгоритм Дейкстри (Dijkstra's algorithm).
// import { Graph, dijkstraProcess } from "./dijkstra";
// Граф з книги: Twin Peaks → Міст Голден Гейт.
// Використовується "вага" для визначення найкоротшого шляху (наприклад, часу в дорозі).
// ![Dijkstra graph](../assets/graph-dijkstra.png)
// const graph: Graph = {
//     "Twin Peaks": { "A": 4, "B": 10 },
//     "A": { "C": 5, "D": 21 },
//     "B": { "C": 5, "E": 8 },
//     "C": { "D": 4, "Bridge": 12 },
//     "D": { "Bridge": 4 },
//     "E": { "Bridge": 0 },
//     "Bridge": {},
// };
// const start = "Twin Peaks";
// const end = "Bridge";

// dijkstraProcess(graph, start, end);

// Алгоритм Дейкстри (Dijkstra's algorithm), OOP.
import { Graph, dijkstraProcess } from "./dijkstra_oop";
// const graph: Graph = {
//     "Twin Peaks": { "A": 4, "B": 10 },
//     "A": { "C": 5, "D": 21 },
//     "B": { "C": 5, "E": 8 },
//     "C": { "D": 4, "Bridge": 12 },
//     "D": { "Bridge": 4 },
//     "E": { "Bridge": 0 },
//     "Bridge": {},
// };
// const start = "Twin Peaks";
// const end = "Bridge";
// З пріоритетною чергою (min-heap).
// dijkstraProcess(graph, start, end, "priority");

// Алгоритм Беллмана-Форда (Bellman-Ford algorithm).
// ![Bellman-Ford](../assets/graph-bellman-ford.jpg)
import { bellmanFord, reconstructPath } from "./bellman-ford";
const nodes = [
    "нотний зошит",
    "рідкісна платівка",
    "постер",
    "бас-гітара",
    "барабанна установка",
    "піаніно",
];

const edges = [
    { from: "нотний зошит", to: "рідкісна платівка", weight: 5 },
    { from: "нотний зошит", to: "постер", weight: 0 },
    { from: "рідкісна платівка", to: "бас-гітара", weight: 15 },
    { from: "рідкісна платівка", to: "барабанна установка", weight: 20 },
    { from: "постер", to: "бас-гітара", weight: 30 },
    { from: "постер", to: "барабанна установка", weight: 35 },
    { from: "бас-гітара", to: "піаніно", weight: 20 },
    // Від'ємне ребро — саме через нього Дейкстра б дала неправильну відповідь
    { from: "барабанна установка", to: "піаніно", weight: -10 },
];

const source = "нотний зошит";
const target = "піаніно";

// ── Запуск ────────────────────────────────────────────────────────────────────

const result = bellmanFord(nodes, edges, source);

if (result.kind === "negative-cycle") {
    console.log("⚠️  Граф містить від'ємний цикл — найкоротшого шляху не існує.");
} else {
    const { distances, predecessors } = result;
    const path = reconstructPath(predecessors, target);

    console.log("Найдешевший шлях:", path.join(" → "));
    console.log("Загальна вартість: $" + distances.get(target));

    // Покроковий розбір шляху з вартістю кожного обміну
    console.log("\nКроки:");
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const edge = edges.find((e) => e.from === from && e.to === to)!;
        const sign = edge.weight >= 0 ? "+" : ""; // мінус і так є в числі
        console.log(`  ${from} → ${to}: ${sign}${edge.weight}$`);
    }
}
