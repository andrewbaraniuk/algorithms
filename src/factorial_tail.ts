//  Хвостова рекурсія через трамплін.
// 1. Тип для thunk
type Thunk<T> = () => T | Thunk<T>;

// 2. Трамплін — виконує thunk-и у циклі
function trampoline<T>(fn: Thunk<T>): T {
    let result: T | Thunk<T> = fn;

    while (typeof result === "function") {
        result = (result as Thunk<T>)();
    }

    return result;
}

// 3. fTail повертає або число (базовий випадок) або thunk (наступний крок)
function fTail(number: number, acc: number = 1): number | Thunk<number> {
    if (number <= 1) {
        return acc;                                    // кінець — повертаємо число
    }

    return () => fTail(number - 1, number * acc);     // наступний крок — thunk
}

// 4. factorialTail запускає все через трамплін
export function factorialTail(number: number): number {
    // 1. Передаємо thunk у трамплін
    const result = trampoline(() => fTail(number));
    // 2. Трамплін викликає його: result = fTail(100000)
    //    fTail повертає ще один thunk: () => fTail(99999, ...)

    // 3. Трамплін бачить що result — це функція, викликає знову
    //    result = fTail(99999, ...) → () => fTail(99998, ...)

    // 4. ... і так у циклі while, без росту стеку ...

    // 5. Коли number <= 1, fTail повертає number (не функцію)
    //    Трамплін бачить що result — не функція → виходить з циклу → повертає результат
    console.log('➡️  Factorial for: ', number, ' = ', result);
    return result;
}

// KNOWLEDGE BASE:
// Це НЕ thunk — вираз обчислюється одразу
// const result = 2 + 2; // result = 4 прямо зараз

// Це thunk — обчислення відкладене
// const thunk = () => 2 + 2; // нічого не відбулось
// thunk(); // = 4, тільки тепер