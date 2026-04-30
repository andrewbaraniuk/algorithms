import * as readline from "readline";

// Можливі стани турнікету:
//   "locked"   — турнікет заблокований, чекає монету
//   "unlocked" — турнікет відкритий, чекає проходу
//   "done"     — програма завершується
type State = "locked" | "unlocked" | "done";

// Можливі події (вхідні дії користувача):
//   "coin" — користувач кинув монету
//   "pass" — користувач намагається пройти
//   "quit" — вихід з програми
type Event = "coin" | "pass" | "quit";

// --- Дії (side effects) ---
// Ці функції — це "побічні ефекти" машини станів.
// Вони не змінюють стан самі по собі, лише виконують дію
// (у реальному житті це могло б бути: увімкнути мотор, подати сигнал тощо).

function lock(): void {
    console.log("  🔒 lock() — замикаємо турнікет");
}
function unlock(): void {
    console.log("  🔓 unlock() — відмикаємо турнікет");
}
function thankyou(): void {
    // Викликається коли монету кидають у вже відкритий турнікет
    console.log("  🙏 thankyou() — дякуємо за зайву монету");
}
function alarm(): void {
    // Викликається коли намагаються пройти без монети
    console.log("  🚨 alarm() — спроба пройти без монети!");
}

// --- FSM (Finite State Machine — скінченна машина станів) ---
// Функція отримує поточний стан (s) і подію (e),
// виконує відповідну дію і повертає НОВИЙ стан.
//
// Таблиця переходів:
//
//  Стан      | Подія  | Дія        | Новий стан
//  ----------|--------|------------|------------
//  locked    | coin   | unlock()   | unlocked
//  locked    | pass   | alarm()    | locked
//  locked    | quit   | —          | done
//  unlocked  | coin   | thankyou() | unlocked
//  unlocked  | pass   | lock()     | locked
//  unlocked  | quit   | —          | done
//  done      | будь-яка | —        | done

function turnstileFSM(s: State, e: Event): State {
    console.log(`\n📥 Подія: "${e}"  |  Поточний стан: "${s}"`);

    let next: State;

    switch (s) {
        case "locked":
            switch (e) {
                case "coin": unlock(); next = "unlocked"; break; // монета → відкрити
                case "pass": alarm(); next = "locked"; break; // прохід без монети → тривога
                case "quit": next = "done"; break; // вихід
            }
            break;

        case "unlocked":
            switch (e) {
                case "coin": thankyou(); next = "unlocked"; break; // зайва монета → подякувати
                case "pass": lock(); next = "locked"; break; // пройшли → закрити
                case "quit": next = "done"; break; // вихід
            }
            break;

        case "done":
            // Термінальний стан — з нього немає виходу
            next = "done";
            break;
    }

    console.log(`📤 Новий стан: "${next!}"`);
    return next!;
}

// --- Введення з консолі (Node.js) ---

// readline — стандартний модуль Node.js для читання рядків з потоку вводу (stdin)
const rl = readline.createInterface({ input: process.stdin });

// Черга подій — буфер на випадок якщо користувач вводить швидше,
// ніж FSM встигає обробити попередню подію
const eventQueue: Event[] = [];

// Якщо getEvent() вже чекає на подію (Promise ще не виконано),
// тут зберігається функція resolve щоб передати їй подію напряму
let resolveNext: ((e: Event) => void) | null = null;

// Обробник кожного введеного рядка
rl.on("line", (line) => {
    // Беремо лише перший символ рядка (решта ігнорується)
    const c = line.trim()[0];

    let event: Event | null = null;
    if (c === "c") event = "coin";
    else if (c === "p") event = "pass";
    else if (c === "q") event = "quit";
    else {
        console.log('  ⚠️  Невідома команда. Використовуйте: c / p / q');
        return;
    }

    // Якщо getEvent() вже чекає — передаємо подію одразу через resolve
    // Якщо ні — кладемо в чергу, getEvent() забере її пізніше
    if (resolveNext) {
        resolveNext(event);
        resolveNext = null;
    } else {
        eventQueue.push(event);
    }
});

// Повертає Promise, який виконається коли з'явиться наступна подія.
// Це "міст" між асинхронним вводом (rl.on("line")) і циклом while у tourniquet.
function getEvent(): Promise<Event> {
    return new Promise((resolve) => {
        if (eventQueue.length > 0) {
            // Подія вже є в черзі — повертаємо її одразу
            resolve(eventQueue.shift()!);
        } else {
            // Черга порожня — зберігаємо resolve, щоб rl.on("line") викликав його пізніше
            resolveNext = resolve;
        }
    });
}

// --- Головний цикл ---
// Async функція, яка крутить цикл поки стан не стане "done".
// На кожній ітерації: чекає на подію від користувача → передає в FSM → отримує новий стан.
export async function tourniquet(s: State): Promise<void> {
    console.log(`\n🚦 Початковий стан: "${s}"`);
    console.log('Вводьте: "c" (coin), "p" (pass), "q" (quit)\n');

    // Цикл замінює рекурсію з оригінальної C-програми.
    // Це безпечніше, бо не викликає переповнення стека (немає TCO).
    while (s !== "done") {
        // await тут "зупиняє" виконання і чекає поки користувач щось введе
        s = turnstileFSM(s, await getEvent());
    }

    console.log("\n✅ Турнікет завершив роботу.");
    rl.close(); // закриваємо потік вводу, інакше програма не завершиться
}

// Головна ідея яку варто зрозуміти — це зв'язок між `getEvent()` і `rl.on("line")`:

// користувач вводить рядок
//         ↓
//    rl.on("line")        ← Node.js викликає це
//         ↓
//   resolveNext(event)    ← "розбуджує" Promise
//         ↓
//    await getEvent()     ← повертає подію в цикл while
//         ↓
//    turnstileFSM(...)    ← FSM обробляє подію