# Maestro Syntax Reference
<!-- Mirrored from github.com/mobile-dev-inc/maestro-docs/api-reference  -->
<!-- This is the ONLY source of truth for Maestro YAML syntax.           -->
<!-- If Copilot is unsure of a command's exact syntax, it must check     -->
<!-- this file or web_fetch the official docs — never guess.            -->
<!--                                                                     -->
<!-- Last verified against: docs.maestro.dev (June 2026)                -->
<!-- Source repo: github.com/mobile-dev-inc/maestro-docs                -->

---

## File anatomy (every flow file, no exceptions)

```yaml
appId: com.yourcompany.appname
---
- launchApp
- tapOn: "Some text"
```

- `appId:` line, then a bare `---` separator, then the command list.
- Commands are a YAML list (`-` prefixed) of either bare strings
  (shorthand) or maps (full form with named arguments).
- There is no `describe()`, `it()`, `test()` block. Maestro is not
  Jest/Mocha syntax. Do not nest commands inside a function-like wrapper.

---

## Core commands (most frequently needed)

### launchApp
```yaml
- launchApp
- launchApp:
    clearState: true       # wipes app data before launch
```

### tapOn
```yaml
- tapOn: "Login"                    # shorthand: match by visible text
- tapOn:
    id: "login_button"               # match by testID
    label: "Tap on Login Button"     # optional human-readable label
- tapOn:
    id: "task_checkbox"
    index: 1                         # 0-based, Nth match
```
There is no `click:` command. Maestro always uses `tapOn`.

### inputText
```yaml
- inputText: "hello@example.com"
```
Inputs into whatever field is currently focused. There is no
`type:` command and no `fill:` command — only `inputText`.

### assertVisible / assertNotVisible
```yaml
- assertVisible: "Welcome back"
- assertVisible:
    id: "error_message"
- assertNotVisible:
    id: "task_row"
    index: 0
```
There is no `expect()` syntax. There is no `toBeVisible()`. Maestro
uses `assertVisible` / `assertNotVisible` as top-level commands.

### clearText
```yaml
- clearText
```
Clears whichever text field is currently focused. No arguments.

### clearState
```yaml
- clearState                # clears the current app's data
- clearState: com.other.app # clears a different app's data
```

### back / stopApp
```yaml
- back        # Android hardware back button
- stopApp     # stops the app, used before launchApp to test persistence
```

### swipe
```yaml
- swipe:
    direction: LEFT       # UP | DOWN | LEFT | RIGHT
    duration: 2000         # ms, default 400 — do not use absolute coordinates
```

### scroll / scrollUntilVisible
```yaml
- scroll
- scrollUntilVisible:
    element:
      id: "save_button"
    direction: DOWN
```

### extendedWaitUntil
```yaml
- extendedWaitUntil:
    visible: "Recommended Products"
    timeout: 5000           # ms
```
This is Maestro's wait command. There is no `sleep()` and no
`cy.wait()`. Maestro auto-waits by default; use this only when the
default wait isn't long enough (slow network, heavy computation).

### runFlow (reusable subflows)
```yaml
- runFlow: e2e/flows/_shared/logged-in-user.yaml
```
Paths are relative to the calling flow file, not the working directory.

---

## Selector reference

Selectors are used as the value under `tapOn`, `assertVisible`,
`assertNotVisible`, `scrollUntilVisible`, etc.

| Selector | Example | Use for |
|---|---|---|
| bare string | `tapOn: "Login"` | matching visible text (assertions only — see note) |
| `id:` | `tapOn: {id: "login_button"}` | testID match — preferred for all interactions |
| `id:` + `index:` | `{id: "task_checkbox", index: 1}` | Nth element with that testID |
| `text:` | `{text: "Login"}` | explicit text match (same as bare string) |
| `label:` | `{label: "Tap on Login"}` | human-readable name in console output only — not a matcher |

**Do not use `text:` or bare-string selectors for tapping interactive
elements that have a testID available.** Text changes when copy
changes; testID does not. Reserve text matching for assertions.

---

## What does NOT exist in Maestro (common Copilot hallucinations)

| Copilot sometimes generates | Reality |
|---|---|
| `click:` | Does not exist. Use `tapOn:`. |
| `type: "text"` | Does not exist. Use `inputText:`. |
| `fill: {selector, value}` | Does not exist. Use `tapOn` then `inputText`. |
| `expect(x).toBeVisible()` | Does not exist. Use `assertVisible:`. |
| `cy.get(...)` / `page.locator(...)` | Not Maestro syntax at all — this is Cypress/Playwright. |
| `describe()` / `it()` / `test()` blocks | Maestro flows are a flat YAML list, not a JS test framework. |
| `sleep(ms)` | Does not exist. Use `extendedWaitUntil:` if a wait is truly needed. |
| `waitFor(selector)` | Does not exist. Use `extendedWaitUntil:`. |
| `selector: "#id"` (CSS-style) | Not how Maestro selects elements. Use `id:` (testID) or `text:`. |
| `$(...)` (WebdriverIO-style) | Not Maestro syntax. |

If you see Copilot produce anything resembling the left column,
stop and regenerate — these are pattern-matched guesses, not real
Maestro commands.

---

## Full command list (for anything not covered above)

If a command is needed that isn't in this file, do not guess its
syntax. Instead:

1. Check the official command page directly:
   `https://docs.maestro.dev/api-reference/commands/{command-name}`
2. Or browse the source repo:
   `https://github.com/mobile-dev-inc/maestro-docs/tree/main/api-reference/commands`
3. Or run `maestro --help` / consult `maestro studio` for live
   element inspection during authoring.

**After fetching a command's real syntax from the official docs,
append it to this file's Core Commands section before using it in
any flow.** Use this format, matching the existing entries:

```markdown
### [commandName]
\`\`\`yaml
- [minimal working example from the official docs]
\`\`\`
[one-line note only if the command has a non-obvious gotcha —
otherwise omit this line]
```

This closes the gap permanently for this project — the next time
any command in this file is needed, in this session or a future
one, it is already grounded locally and no fetch is required.
Do not append speculative or paraphrased syntax; only append what
the fetched page actually shows, copied structurally (not verbatim
prose, just the command's real YAML shape).

If the same command is fetched again in a later session despite
already being appended here, that means this file was not re-read
before generating — re-read it first; do not fetch by default.

Known full command list (names only — verify exact syntax via the
links above before using anything not already documented in this file):

```
addMedia, assertVisible, assertNotVisible, assertWithAI, assertNoDefectsWithAI,
back, clearKeychain, clearState, copyTextFrom, doubleTapOn, evalScript,
extendedWaitUntil, hideKeyboard, inputText, inputRandomText, inputRandomNumber,
inputRandomEmail, inputRandomPersonName, killApp, launchApp, longPressOn,
openLink, pasteText, pressKey, repeat, retry, runFlow, runScript, scroll,
scrollUntilVisible, setAirplaneMode, setLocation, startRecording, stopApp,
stopRecording, swipe, takeScreenshot, tapOn, toggleAirplaneMode, travel, waitForAnimationToEnd
```

---

## Pre-flight check for /speckit.flows

Before generating any flow file, confirm every command used appears
either in this file's Core Commands section, or has been verified
against the official docs in this session. Do not use a command
from memory alone if it is not in this file.