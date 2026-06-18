# Presentation Outline: Speckit Todo · Expo + Maestro

---

## 1. The Problem

> *"Most todo app tutorials stop at the code — they never prove it actually works."*

- Shipping mobile apps is easy. **Shipping correct mobile apps** is hard.
- Manual testing is slow and forgetful. Unit tests don't catch real device interactions.
- There's no standard way to **verify acceptance criteria automatically** on mobile.

---

## 2. The Solution — Two Ideas in One

This repo demonstrates **two things simultaneously**:

| What | Why |
|------|-----|
| A **task management app** | Simple, familiar domain — easy to focus on the process |
| A **Spec-Driven Development (SDD) workflow** | Every acceptance criterion is an executable Maestro flow |

---

## 3. What the App Does

> *Five use cases, 11 acceptance criteria, all E2E-tested.*

| UC | Feature | Flows |
|----|---------|-------|
| UC-01 | Create a task | 2 (valid title, empty rejection) |
| UC-02 | Edit a task | 2 (edit confirmed, cancelled) |
| UC-03 | Complete a task | 2 (mark done, revert) |
| UC-04 | Delete a task | 1 (delete) |
| UC-05 | Filter tasks | 4 (all, active, completed, empty state) |

**Demo**: Walk through the app on the simulator — create a task, edit it, complete it, filter, delete.

---

## 4. The Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | **Expo SDK 56** | Fastest path to iOS + Android from one codebase |
| UI | **React Native** (built-in components) | No third-party UI library — pure RN |
| Language | **TypeScript 6.0** | Type-safe, modern |
| State | **React hooks** (`useState`) | No Redux, no Zustand — intentionally minimal |
| E2E Testing | **Maestro** | Declarative YAML flows, works on real devices/simulators |

---

## 5. The SDD Workflow (The Real Story)

> *"Spec first. Flows second. Code third."*

```
  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
  │ SPECIFY  │ → │  FLOWS   │ → │   PLAN   │ → │  TASKS   │ → │ IMPLEMENT│
  │ spec.md  │   │  .yaml   │   │ model.md │   │ tasks.md │   │  code    │
  └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
                       ↓              ↓              ↓              ↓
                  Confirmed       Architecture   Dependency      UC by UC
                    RED          & data model     order        until GREEN
```

**Key insight**: By the time you write a single line of production code, every acceptance criterion is already defined and the Maestro flows are written. You run the flows against the empty app → they fail RED. Then you implement, one use case at a time, until each flow turns GREEN.

---

## 6. Project Structure Walkthrough

```
specs/                        ← The "source of truth"
├── _project/                 ← Vision, architecture, feature map
└── 001-task-management/
    ├── spec.md               ← 4-layer spec (BR, UC, Entity, AC)
    ├── data-model.md         ← TypeScript types
    ├── plan.md               ← Architecture decisions
    ├── tasks.md              ← Implementation tasks
    ├── quickstart.md         ← Validation scenarios
    └── contracts/
        └── testid-inventory.md  ← Every testID mapped to ACs

e2e/                          ← Executable acceptance criteria
├── suite.yaml                ← Master test suite
├── suites/001-task-management.yaml
└── flows/001-task-management/
    ├── UC-01-create-task/    ← 2 flows
    ├── UC-02-edit-task/      ← 2 flows
    ├── UC-03-complete-task/  ← 2 flows
    ├── UC-04-delete-task/    ← 1 flow
    └── UC-05-filter-tasks/   ← 4 flows

App.tsx                       ← ~280 lines, all the code
```

**Note**: The `specs/` directory has *more files* than the `src/` directory. That's intentional — in SDD, specification is the primary artifact, code is derived.

---

## 7. The testID Contract

> *"Every interactable element has a `testID` — and it's documented in a contract."*

The `testid-inventory.md` maps every testID to the components and acceptance criteria that use it:

| testID | Component | Used By |
|--------|-----------|---------|
| `task_input` | TextInput for new tasks | UC-01 AC-1, UC-01 AC-2 |
| `task_checkbox` | Completion toggle | UC-03 AC-1/2, UC-05 AC-1/2/3 |
| `filter_all` | Filter: All | UC-05 AC-1 |

**Selector rules**: Use `id:` for taps, `text:` only for assertions. No array-index suffixes — use Maestro `index:` instead.

---

## 8. How a Maestro Flow Looks

> *Declarative YAML — no SDK, no test framework, no assertions API.*

```yaml
# AC-1-task-created-with-valid-title.yaml
appId: host.exp.Exponent
---
- tapOn:
    id: task_input
- inputText: "Buy groceries"
- tapOn:
    id: add_task_button
- assertVisible:
    id: task_item
- assertVisible:
    text: "Buy groceries"
```

A flow is just: **tap, type, assert**. No promises, no timeouts, no flaky selectors.

---

## 9. The Code in 30 Seconds

Open `App.tsx` — it's a single component with:

- **State**: 4 `useState` hooks — `tasks`, `activeFilter`, `editingTaskId`, `inputText`
- **Rendering**: `FlatList` with an inline `renderItem` that handles display/edit/completed/delete states
- **Filtering**: A derived `filteredTasks` computed from `tasks` + `activeFilter`
- **Styling**: React Native `StyleSheet` — no CSS-in-JS library

~280 lines, single file, single screen.

---

## 10. The Results

```
All 11 Maestro flows → ✅ GREEN
TypeScript check     → ✅ No errors
Spec-flow sync check → ✅ In sync
```

**Feature status**: 🟢 implemented

---

## 11. Key Takeaways

1. **SDD inverts the workflow** — spec and tests come before code. You know you're done when the flows pass.
2. **Maestro is the bridge** between acceptance criteria and automated validation. Plain YAML, works on real devices.
3. **testID contracts** eliminate guesswork — test authors and developers share a single source of truth.
4. **Minimalism by design** — no Redux, no navigation, no persistence. The entire app is one file. This makes the SDD process visible without framework noise.
5. **11 flows, 1 file, ~280 lines of code** — a working mobile app with full E2E coverage.

---

## 12. Discussion / Q&A

Potential questions to prepare for:

- **"Why not just unit tests?"** — Unit tests don't verify that taps, inputs, and list rendering actually work on a device. Maestro tests the real thing.
- **"Is this practical for larger apps?"** — The process scales. Each feature gets its own `spec.md` and its own Maestro suite. The `feature-map.md` tracks status across all features.
- **"What about persistence?"** — Intentionally out of scope. The next feature could add AsyncStorage or SQLite — and it would start with a spec and Maestro flows.
- **"How long did this take?"** — From spec to green flows: under 30 minutes. That's the target.
