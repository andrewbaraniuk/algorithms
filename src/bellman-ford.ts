type NodeName = string;

// Ребро графа: звідки, куди, і яка вартість (може бути від'ємною)
type Edge = {
    from: NodeName;
    to: NodeName;
    weight: number;
};

// Результат алгоритму: або успішно знайдені відстані, або виявлено від'ємний цикл
type BFResult =
    | { kind: "ok"; distances: Map<NodeName, number>; predecessors: Map<NodeName, NodeName | null> }
    | { kind: "negative-cycle" };

export function bellmanFord(nodes: NodeName[], edges: Edge[], source: NodeName): BFResult {
    // Ініціалізація: всі вузли нескінченно далекі від джерела...
    const distances = new Map<NodeName, number>();
    // ...і жоден вузол ще не має попередника
    const predecessors = new Map<NodeName, NodeName | null>();

    for (const node of nodes) {
        distances.set(node, Infinity);
        predecessors.set(node, null);
    }

    // Відстань від джерела до себе самого — завжди 0
    distances.set(source, 0);

    // ── Фаза 1: Релаксація ────────────────────────────────────────────────────
    // Повторюємо |V| - 1 разів, бо найдовший можливий найкоротший шлях
    // без циклів містить щонайбільше |V| - 1 ребер.
    // Кожна ітерація гарантовано "фіксує" оптимальний шлях
    // до вузлів, що знаходяться на відстані i ребер від джерела.
    for (let i = 0; i < nodes.length - 1; i++) {
        for (const { from, to, weight } of edges) {
            const d = distances.get(from)!;

            // Пропускаємо вузли, до яких ще не знайшли шляху
            if (d === Infinity) continue;

            // "Релаксація": якщо шлях через `from` коротший — оновлюємо
            if (d + weight < distances.get(to)!) {
                distances.set(to, d + weight);
                // Запам'ятовуємо, звідки прийшли — для відновлення шляху
                predecessors.set(to, from);
            }
        }
    }

    // ── Фаза 2: Перевірка на від'ємний цикл ──────────────────────────────────
    // Після |V| - 1 ітерацій відстані мають бути стабільними.
    // Якщо хоча б одне ребро ще можна релаксувати — є від'ємний цикл
    // (тобто можна нескінченно зменшувати відстань, ходячи по циклу).
    for (const { from, to, weight } of edges) {
        const d = distances.get(from)!;
        if (d !== Infinity && d + weight < distances.get(to)!) {
            return { kind: "negative-cycle" };
        }
    }

    return { kind: "ok", distances, predecessors };
}

// Відновлення шляху: йдемо від цілі назад по ланцюжку попередників
export function reconstructPath(
    predecessors: Map<NodeName, NodeName | null>,
    target: NodeName
): NodeName[] {
    const path: NodeName[] = [];
    let current: NodeName | null = target;

    // Зупиняємось, коли доходимо до джерела (у нього predecessors = null)
    while (current !== null) {
        path.unshift(current); // додаємо на початок, щоб шлях йшов зліва направо
        current = predecessors.get(current) ?? null;
    }

    return path;
}
