export type Graph = Record<string, Record<string, number>>;

function dijkstra(graph: Graph, start: string): {
    distances: Record<string, number>;
    previous: Record<string, string | null>;
} {
    // Таблиця відстаней: скільки коштує дістатися до кожної вершини
    // Спочатку всі відстані = нескінченність (ще не знаємо)
    const distances: Record<string, number> = {};

    // Таблиця попередників: через яку вершину ми прийшли
    // Потрібна для відновлення шляху в кінці (крок 4)
    const previous: Record<string, string | null> = {};

    // Множина вже оброблених вершин — повторно не заходимо
    const visited = new Set<string>();

    // --- Ініціалізація таблиць ---
    for (const node in graph) {
        distances[node] = Infinity; // ще не знаємо жодної відстані
        previous[node] = null;      // ще не знаємо звідки прийшли
    }
    distances[start] = 0; // до стартової вершини — 0 хвилин

    // --- Головний цикл: обробляємо вершини одну за одною ---
    while (true) {

        // КРОК 1: знайди найдешевшу невідвідану вершину
        // (ту, до якої наразі найменша відома відстань)
        let current: string | null = null;
        let minDist = Infinity;

        for (const node in distances) {
            if (!visited.has(node) && distances[node] < minDist) {
                minDist = distances[node];
                current = node;
            }
        }

        // Якщо не знайшли жодної — всі вершини оброблено, виходимо
        if (current === null) break;

        // Позначаємо поточну вершину як оброблену
        visited.add(current);

        // КРОК 2: перевір усіх сусідів поточної вершини
        // і онови таблицю, якщо знайшли коротший шлях
        for (const neighbor in graph[current]) {
            if (visited.has(neighbor)) continue; // вже оброблений — пропускаємо

            // Новий можливий шлях = відстань до поточної + вага ребра до сусіда
            const newDist = distances[current] + graph[current][neighbor];

            // КРОК 2 (продовження): якщо новий шлях коротший — оновлюємо таблицю
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;  // оновлюємо відстань
                previous[neighbor] = current;   // запам'ятовуємо звідки прийшли
            }
        }

        // КРОК 3: повторюємо — while(true) повертає нас на початок циклу
    }

    return { distances, previous };
}

// КРОК 4: відновлення фінального шляху
// Йдемо від фінішу назад через таблицю previous до старту
function getPath(previous: Record<string, string | null>, target: string): string[] {
    const path: string[] = [];
    let current: string | null = target;

    while (current !== null) {
        path.unshift(current);       // додаємо вершину на початок масиву
        current = previous[current]; // переходимо до попередника
    }

    return path; // повертає шлях від старту до фінішу
}

export function dijkstraProcess(graph: Graph, start: string, end: string): void {
    const { distances, previous } = dijkstra(graph, start);
    const path = getPath(previous, end);

    console.log(`Найкоротша відстань до "${end}": ${distances[end]} хв`);
    console.log(`Шлях: ${path.join(" → ")}`);

    console.log("\nВсі відстані від", start);
    for (const [node, dist] of Object.entries(distances)) {
        console.log(`  ${node}: ${dist} хв`);
    }
}
