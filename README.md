# How to Debug?

A guide to debugging the **call stack** in Node.js / TypeScript — recursion depth, Stack Overflow, and frame inspection.

---

## 1. Quickest Option — `console.trace()`

Prints the current call stack directly to the console.

```typescript
function fTail(number: number, acc: number = 1): number | Thunk<number> {
    console.trace(`fTail called: number=${number}, acc=${acc}`);

    if (number <= 1) return acc;
    return () => fTail(number - 1, number * acc);
}
```

Output:
```
Trace: fTail called: number=5, acc=1
    at fTail (index.ts:3:13)
    at factorialTail (index.ts:12:20)
    at Object.<anonymous> (index.ts:20:1)
```

---

## 2. Track Recursion Depth Manually

Pass a `depth` counter through each recursive call to visualize how deep you go.

```typescript
function fTail(number: number, acc: number = 1, depth: number = 0): number | Thunk<number> {
    console.log(`${'  '.repeat(depth)}→ fTail(${number}, acc=${acc}) depth=${depth}`);

    if (number <= 1) return acc;
    return () => fTail(number - 1, number * acc, depth + 1);
}
```

Output:
```
→ fTail(5, acc=1) depth=0
  → fTail(4, acc=5) depth=1
    → fTail(3, acc=20) depth=2
      → fTail(2, acc=60) depth=3
        → fTail(1, acc=120) depth=4
```

---

## 3. Chrome DevTools — Visual Call Stack

Best for serious debugging with a full UI. Two ways to launch:

**Option A — via `--inspect`:**
```bash
node --inspect-brk dist/index.js
```
Then open `chrome://inspect` in the browser → click **"inspect"**.

**Option B — via `debugger` statement:**
```typescript
function fTail(number: number, acc: number = 1): number | Thunk<number> {
    debugger; // execution pauses here
    if (number <= 1) return acc;
    return () => fTail(number - 1, number * acc);
}
```

In DevTools, the **Call Stack** panel on the right shows all active frames in real time.

---

## 4. Catch Stack Overflow Before It Happens

Instead of a cryptic `RangeError`, throw a descriptive error with context.

```typescript
function fTailSafe(
    number: number,
    acc: number = 1,
    depth: number = 0,
    maxDepth: number = 10000
): number | Thunk<number> {
    if (depth >= maxDepth) {
        throw new Error(`Stack limit reached at depth ${depth}, number=${number}`);
    }

    if (number <= 1) return acc;
    return () => fTailSafe(number - 1, number * acc, depth + 1, maxDepth);
}
```

A clear error with context is always better than a silent crash.

---

## 5. VS Code Debugger — No Browser Needed

Create `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug TS",
            "runtimeArgs": ["--nolazy", "-r", "ts-node/register"],
            "args": ["src/index.ts"],
            "sourceMaps": true
        }
    ]
}
```

Set a breakpoint by clicking a line number → press `F5` → inspect the **Call Stack** panel.

---

## When to Use What

| Situation | Tool |
|---|---|
| Quick stack snapshot | `console.trace()` |
| Track recursion depth | `depth` parameter |
| Step-through logic | VS Code Debugger |
| Complex multi-function bugs | Chrome DevTools |
| Prevent overflow proactively | `maxDepth` guard |
