// ============================================================
// ФІНАНСОВІ СУТНОСТІ (data layer)
// ![OCP](../assets/OCP.png)
// ============================================================

interface FinancialRecord {
    id: string;
    description: string;
    amount: number;
    date: string;
}

// ============================================================
// БАЗА ДАНИХ
// ============================================================

class FinancialDatabase {
    private records: FinancialRecord[] = [
        { id: "1", description: "Дохід від продажів", amount: 150000, date: "2026-01" },
        { id: "2", description: "Операційні витрати", amount: -45000, date: "2026-01" },
        { id: "3", description: "Дохід від інвестицій", amount: 20000, date: "2026-02" },
    ];

    getAll(): FinancialRecord[] {
        return [...this.records];
    }
}

// ============================================================
// ШЛЮЗ ФІНАНСОВИХ ДАНИХ <I> — інтерфейс доступу до БД
// (позначений <I> на діаграмі)
// ============================================================

interface IFinancialDataGateway {
    fetchRecords(): FinancialRecord[];
}

// ============================================================
// ДИСПЕТЧЕР ФІНАНСОВИХ ДАНИХ
// Знає про БД, але Шлюз — не знає про Диспетчера
// ============================================================

class FinancialDataDispatcher implements IFinancialDataGateway {
    constructor(private db: FinancialDatabase) { }

    fetchRecords(): FinancialRecord[] {
        return this.db.getAll();
    }
}

// ============================================================
// ФІНАНСОВІ СУТНОСТІ — структура зведеного звіту
// <DS> — data structures
// ============================================================

interface FinancialReportDS {
    title: string;
    period: string;
    totalIncome: number;
    totalExpenses: number;
    netResult: number;
    lines: string[];
}

// ============================================================
// ІНТЕРАКТОР — бізнес-логіка
// ============================================================

// Запит фінансового звіту <DS>
interface FinancialReportRequest {
    period: string;
    format: "screen" | "print" | "web" | "pdf";
}

// Замовник фінансового звіту <I>
interface IFinancialReportRequester {
    request(req: FinancialReportRequest): FinancialReportDS;
}

// Генератор фінансового звіту
class FinancialReportGenerator implements IFinancialReportRequester {
    constructor(private gateway: IFinancialDataGateway) { }

    request(req: FinancialReportRequest): FinancialReportDS {
        const records = this.gateway.fetchRecords();
        const income = records.filter(r => r.amount > 0).reduce((s, r) => s + r.amount, 0);
        const expenses = records.filter(r => r.amount < 0).reduce((s, r) => s + r.amount, 0);

        return {
            title: "Фінансовий звіт",
            period: req.period,
            totalIncome: income,
            totalExpenses: expenses,
            netResult: income + expenses,
            lines: records.map(r => `${r.date} | ${r.description}: ${r.amount} грн`),
        };
    }
}

// Фінансовий звіт, що повернувся <DS> — результат інтерактора
type ReturnedFinancialReport = FinancialReportDS;

// ============================================================
// ПРЕЗЕНТЕРИ — шар відображення
// ============================================================

// Інтерфейс презентера <I>
interface IFinancialReportPresenter {
    present(report: ReturnedFinancialReport): string;
}

// Модель екранного представлення <DS>
interface ScreenViewModel {
    header: string;
    body: string[];
    footer: string;
}

// Екранний презентер
class ScreenPresenter implements IFinancialReportPresenter {
    buildViewModel(report: ReturnedFinancialReport): ScreenViewModel {
        return {
            header: `=== ${report.title} | ${report.period} ===`,
            body: report.lines,
            footer: `Доходи: ${report.totalIncome} | Витрати: ${report.totalExpenses} | Результат: ${report.netResult}`,
        };
    }

    present(report: ReturnedFinancialReport): string {
        const vm = this.buildViewModel(report);
        return [vm.header, ...vm.body, vm.footer].join("\n");
    }
}

// Модель друкованого представлення <DS>
interface PrintViewModel {
    pageTitle: string;
    rows: string[];
    summary: string;
}

// Презентер друку
class PrintPresenter implements IFinancialReportPresenter {
    buildViewModel(report: ReturnedFinancialReport): PrintViewModel {
        return {
            pageTitle: `ДРУК: ${report.title} за ${report.period}`,
            rows: report.lines.map(l => `  > ${l}`),
            summary: `Підсумок: ${report.netResult} грн`,
        };
    }

    present(report: ReturnedFinancialReport): string {
        const vm = this.buildViewModel(report);
        return [vm.pageTitle, ...vm.rows, vm.summary].join("\n");
    }
}

// Веб-представлення (наслідує Екранний презентер)
class WebView extends ScreenPresenter {
    present(report: ReturnedFinancialReport): string {
        const vm = this.buildViewModel(report);
        const rows = vm.body.map(l => `  <li>${l}</li>`).join("\n");
        return `<h1>${vm.header}</h1>\n<ul>\n${rows}\n</ul>\n<p>${vm.footer}</p>`;
    }
}

// PDF-представлення (наслідує Презентер друку)
class PDFView extends PrintPresenter {
    present(report: ReturnedFinancialReport): string {
        const vm = this.buildViewModel(report);
        return `[PDF] ${vm.pageTitle}\n` + vm.rows.join("\n") + `\n[PDF] ${vm.summary}`;
    }
}

// ============================================================
// КОНТРОЛЕР — оркеструє весь потік
// ============================================================

class FinancialReportController {
    constructor(
        private requester: IFinancialReportRequester,
        private presenters: Map<string, IFinancialReportPresenter>
    ) { }

    handle(req: FinancialReportRequest): string {
        // 1. Запит до інтерактора
        const report = this.requester.request(req);

        // 2. Вибір презентера за форматом
        const presenter = this.presenters.get(req.format);
        if (!presenter) throw new Error(`Невідомий формат: ${req.format}`);

        // 3. Повернути відформатований звіт
        return presenter.present(report);
    }
}

// ============================================================
// ЗБІРКА (Composition Root)
// ============================================================

const db = new FinancialDatabase();
const dispatcher = new FinancialDataDispatcher(db);
const generator = new FinancialReportGenerator(dispatcher);

const presenters = new Map<string, IFinancialReportPresenter>([
    ["screen", new ScreenPresenter()],
    ["print", new PrintPresenter()],
    ["web", new WebView()],
    ["pdf", new PDFView()],
]);

const controller = new FinancialReportController(generator, presenters);

// ============================================================
// ЗАПУСК
// ============================================================

const formats: Array<FinancialReportRequest["format"]> = ["screen", "print", "web", "pdf"];

for (const format of formats) {
    console.log(`\n${"─".repeat(60)}`);
    console.log(controller.handle({ period: "2026-Q1", format }));
}

// Це діаграма архітектури системи фінансових звітів із розділенням на **Контролер**, **Інтерактор** і **База даних**.

// | `<DS>` — data structure | `interface` (FinancialReportDS, ScreenViewModel…) |
// | `<I>` — інтерфейс | `interface I...` (IFinancialReportPresenter тощо) |
// | **Контролер** | `FinancialReportController` — оркеструє потік |
// | **Інтерактор** | `FinancialReportGenerator` — бізнес-логіка |
// | **Шлюз / Диспетчер** | `IFinancialDataGateway` / `FinancialDataDispatcher` |
// | **Екранний / Друк презентер** | `ScreenPresenter` / `PrintPresenter` |
// | **Веб / PDF** | `WebView extends ScreenPresenter` / `PDFView extends PrintPresenter` |

// **Ключова ідея:** Шлюз (`IFinancialDataGateway`) знає про Диспетчера — але через інтерфейс.
// Диспетчер знає про БД. Контролер не знає деталей ні БД, ні презентерів — тільки інтерфейси.
// Це і є **інверсія залежностей**.