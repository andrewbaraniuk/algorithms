// Жадібний цикл
export default function greedyAlgorithm(statesNeeded: Set<string>, stations: Map<string, Set<string>>) {
    const finalStations: Set<string> = new Set();

    while (statesNeeded.size > 0) {
        let bestStation: string | null = null;
        let statesCovered: Set<string> = new Set();

        for (const [station, statesForStation] of stations) {
            // Перетин множин: які непокриті штати покриває ця станція.
            const covered: Set<string> = new Set(
                [...statesNeeded].filter(s => statesForStation.has(s))
            );
            // Якщо ця станція покриває більше штатів, ніж попередня найкраща — оновлюємо.
            if (covered.size > statesCovered.size) {
                bestStation = station;
                statesCovered = covered;
            }
        }
        // Додаємо найкращу станцію до фінального набору
        if (bestStation !== null) {
            finalStations.add(bestStation);
            // Вилучаємо покриті штати з множини тих, що залишились
            statesNeeded = new Set(
                [...statesNeeded].filter(s => !statesCovered.has(s))
            );
        }
    }

    return finalStations;
}
