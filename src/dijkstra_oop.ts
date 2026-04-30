export type Graph = Record<string, Record<string, number>>;

// ─── Абстракція: "як обираємо наступну вершину" ───────────────────────────────

abstract class NodePicker {
    protected distances: Record<string, number> = {};
    protected visited = new Set<string>();

    // Ініціалізація — спільна для всіх реалізацій
    init(nodes: string[], start: string): void {
        for (const node of nodes) {
            this.distances[node] = Infinity;
        }
        this.distances[start] = 0;
        this.visited.clear();
    }

    // Оновлення відстані — поведінка може відрізнятись (напр. heap потрібно оновити)
    abstract update(node: string, newDist: number): void;

    // Обрати наступну вершину для обробки
    abstract pick(): string | null;

    markVisited(node: string): void {
        this.visited.add(node);
    }

    getDistance(node: string): number {
        return this.distances[node];
    }
}

// ─── Реалізація 1: лінійний пошук (як і було) ─────────────────────────────────

class LinearPicker extends NodePicker {
    update(node: string, newDist: number): void {
        this.distances[node] = newDist;
    }

    pick(): string | null {
        let current: string | null = null;
        let minDist = Infinity;

        for (const node in this.distances) {
            if (!this.visited.has(node) && this.distances[node] < minDist) {
                minDist = this.distances[node];
                current = node;
            }
        }
        return current;
    }
}

// ─── Реалізація 2: пріоритетна черга (min-heap через sorted array) ─────────────
// Для навчальних цілей — без зовнішніх бібліотек.
// У production варто використати справжній binary heap.

class PriorityQueuePicker extends NodePicker {
    // Черга: [відстань, назва вершини], відсортована від найменшої
    private queue: [number, string][] = [];

    override init(nodes: string[], start: string): void {
        super.init(nodes, start);
        this.queue = [[0, start]]; // стартова вершина з відстанню 0
    }

    update(node: string, newDist: number): void {
        this.distances[node] = newDist;
        // Додаємо нову пару — стара залишиться в черзі, але буде "застарілою"
        this.queue.push([newDist, node]);
        // Тримаємо чергу відсортованою (простий варіант замість справжнього heap)
        this.queue.sort((a, b) => a[0] - b[0]);
    }

    pick(): string | null {
        // Витягуємо вершини з черги, поки не знайдемо невідвідану
        while (this.queue.length > 0) {
            const [, node] = this.queue.shift()!;
            if (!this.visited.has(node)) return node;
            // Якщо вже відвідана — це "застаріла" пара, пропускаємо
        }
        return null;
    }
}

// ─── Сам алгоритм — не знає, яка реалізація всередині ────────────────────────

function dijkstra(
    graph: Graph,
    start: string,
    picker: NodePicker     // <-- поліморфізм тут: приймаємо будь-який NodePicker
): {
    distances: Record<string, number>;
    previous: Record<string, string | null>;
} {
    const previous: Record<string, string | null> = {};

    for (const node in graph) {
        previous[node] = null;
    }

    picker.init(Object.keys(graph), start);

    while (true) {
        const current = picker.pick(); // крок 1 — делегуємо вибір
        if (current === null) break;

        picker.markVisited(current);

        for (const neighbor in graph[current]) {
            if (picker["visited"].has(neighbor)) continue;

            const newDist = picker.getDistance(current) + graph[current][neighbor];

            if (newDist < picker.getDistance(neighbor)) {
                picker.update(neighbor, newDist); // крок 2 — делегуємо оновлення
                previous[neighbor] = current;
            }
        }
    }

    const distances: Record<string, number> = {};
    for (const node in graph) {
        distances[node] = picker.getDistance(node);
    }

    return { distances, previous };
}

// ─── Відновлення шляху (без змін) ─────────────────────────────────────────────

function getPath(previous: Record<string, string | null>, target: string): string[] {
    const path: string[] = [];
    let current: string | null = target;

    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }

    return path;
}

// ─── Публічний API ─────────────────────────────────────────────────────────────

export function dijkstraProcess(
    graph: Graph,
    start: string,
    end: string,
    strategy: "linear" | "priority" = "linear"
): void {
    const picker = strategy === "priority"
        ? new PriorityQueuePicker()
        : new LinearPicker();

    const { distances, previous } = dijkstra(graph, start, picker);
    const path = getPath(previous, end);

    console.log(`Стратегія: ${picker.constructor.name}`);
    console.log(`Найкоротша відстань до "${end}": ${distances[end]} хв`);
    console.log(`Шлях: ${path.join(" → ")}`);

    console.log(`\nВсі відстані від ${start}:`);
    for (const [node, dist] of Object.entries(distances)) {
        console.log(`  ${node}: ${dist} хв`);
    }
}