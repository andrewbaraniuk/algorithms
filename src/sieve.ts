// Публічний інтерфейс — просто викликаєш з числом і отримуєш масив простих чисел.
// Створює об'єкт Sieve, який одразу будує решето в конструкторі,
// а потім getPrimes() повертає результат.
function primesUpTo(upTo: number): number[] {
    return new Sieve(upTo).getPrimes();
}

// Решето Ератосфена (Sieve of Eratosthenes) — алгоритм пошуку всіх простих чисел
// до заданого числа. Ідея: починаємо з масиву де всі числа "можливо прості",
// потім послідовно "викреслюємо" всі кратні кожного простого числа.
class Sieve {
    // Масив прапорців: isComposite[n] = true означає "n є складеним (не простим)"
    // Індекс масиву = саме число. Тобто isComposite[6] = true означає "6 — не просте".
    private isComposite: boolean[];

    constructor(upTo: number) {
        if (upTo < 1) upTo = 1; // захист від некоректного вводу

        // Створюємо масив розміром upTo+1, щоб індекс відповідав числу.
        // Наприклад для upTo=10: індекси 0..10, тобто 11 елементів.
        // Заповнюємо false — спочатку вважаємо всі числа простими.
        this.isComposite = new Array(upTo + 1).fill(false);

        // 0 і 1 — не прості числа за визначенням, одразу позначаємо їх.
        this.isComposite[0] = true;
        this.isComposite[1] = true;

        // Основний цикл решета:
        for (let i = 0; i < this.isComposite.length; i++) {

            // Якщо isComposite[i] === false — число i є простим.
            // Починаємо викреслювати всі його кратні.
            if (!this.isComposite[i]) {

                // c = i+i — починаємо з першого кратного (2*i),
                // бо саме i є простим і викреслювати його не треба.
                // c += i — кожен крок збільшуємо на i (наступне кратне).
                // Приклад для i=3: викреслюємо 6, 9, 12, 15...
                for (let c = i + i; c < this.isComposite.length; c += i) {
                    this.isComposite[c] = true; // позначаємо як складене
                }
            }
        }
    }

    // Збирає всі прості числа з масиву isComposite і повертає їх.
    getPrimes(): number[] {
        return this.isComposite
            // Перетворюємо масив прапорців на масив чисел або null:
            // false (просте)   → повертаємо сам індекс (тобто число)
            // true  (складене) → повертаємо null (потім відфільтруємо)
            // Наприклад: [true, true, false, false, true, false, ...]
            //          → [null, null, 2,     3,     null, 5,    ...]
            .map((composite, index) => composite ? null : index)

            // Прибираємо всі null — залишаються лише прості числа.
            // "(n): n is number" — це type guard: підказка для TypeScript,
            // що після фільтрації в масиві залишились тільки number, не null.
            .filter((n): n is number => n !== null);
    }
}

// Використання
export async function sieve(number: number): Promise<void> {
    console.log(primesUpTo(number));
}

// Щоб краще зрозуміти як виглядає масив `isComposite` після роботи алгоритму для `primesUpTo(10)`:

// індекс:      0     1     2     3     4     5     6     7     8     9     10
// isComposite: true  true  false false true  false true  false true  true  true
//              ↑     ↑     ↑           ↑           ↑           ↑     ↑     ↑
//              0,1   руч.  просте      2*2         просте      2*3   3*3   2*5
//              не    позн.
//              прості