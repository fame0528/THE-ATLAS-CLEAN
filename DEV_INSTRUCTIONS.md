# 🧠 ATLAS-CLEAN DEVELOPMENT PROTOCOL
## Optimized for Autonomous Agent Execution — No Human "Protection Gates"

**🎯 Purpose**: AAA-quality development with zero waiting, autonomous execution, and bulletproof self-monitoring  
**🤖 Status**: Production-ready — designed for AGENTS, not humans  
**⚡ Core Principle**: Complete file understanding + pattern discovery + atomic autonomous execution + Guardian monitoring = zero drift, maximum velocity

---

## 📑 NAVIGATION

1. ⚡ Quick Reference — Agent startup checklist
2. ⭐ Autonomous Flawless Protocol — Self-executing 12-step methodology
3. 🛡️ Guardian Protocol — 19-point real-time compliance (non-negotiable)
4. 🔴 Complete File Reading Law — Zero exceptions, batch loading for large files
5. 🚨 Anti-Drift Mechanisms — Quality gates that block autonomous progress
6. 📊 Success Metrics — Performance targets for continuous operation

---

## ⚡ QUICK REFERENCE (AGENT STARTUP)

**🟢 AGENT AUTONOMY MODE — NO HUMAN GATES**

```
AUTOMATIC EXECUTION FLOW:

1. READ THIS FILE COMPLETELY (lines 1-9999) — MANDATORY ON STARTUP
2. State: "DEV_INSTRUCTIONS loaded — autonomous mode active"
3. Identify task from context/message queue:
   - New feature request? → Autonomous Flawless Protocol
   - Bug fix? → Minimal todo + immediate execute
   - Refactor? → Duplicate detection + full coverage
4. NO WAITING for human approval — self-approve after verification gates
5. NEVER skip pattern discovery or complete file reads
6. ALWAYS enforce TypeScript verification (0 errors) before completion
```

**🚨 AUTONOMY BOUNDARIES:**
- ✅ Free to: Generate code, modify files, create components, run TypeScript check
- ❌ Not free to: Bypass Guardian checks, ignore TypeScript errors, skip pattern discovery
- 🔒 Security-critical actions (restart gateway, savepoint) require Ares code approval (not human-in-the-loop, but pre-approved code only)

---

## ⭐⭐⭐ AUTONOMOUS FLAWLESS PROTOCOL ⭐⭐⭐

**Self-executing methodology — NO human "proceed" required**

### PHASE 0: INITIALIZATION (Every Session)
```
1. Read DEV_INSTRUCTIONS completely (1-9999)
2. Load workspace state from /dev/ files if exists
3. Verify Guardian compliance system active
4. Check for pending tasks from previous session
5. Report: "Autonomous mode initialized — ready for task assignment"
```

### PHASE 1: TASK RECEPTION & ANALYSIS
```
When task received (from user, message queue, or scheduled):

1. CLASSIFY task type:
   - NEW_FEATURE → Full Flawless Protocol (12 steps)
   - BUG_FIX → Minimal protocol (skip some steps)
   - REFACTOR → Duplicate detection + full coverage
   - DOCUMENTATION → Auto-generate from code

2. ESTIMATE complexity:
   - Simple: < 4 hours, 1-2 files → streamlined
   - Standard: 4-16 hours, multiple files → full protocol
   - Complex: > 16 hours, new domains → phased approach

3. CREATE task record in /dev/ immediately:
   AUTO_UPDATE_PLANNED(task_id, description, complexity, estimated_files)
```

### PHASE 2: PRE-IMPLEMENTATION (Mandatory Gates)

**GATE 1 — PATTERN DISCOVERY** (Non-negotiable, 5 min max)
```
Execute IN PARALLEL:
- file_search: "**/components/**/*.tsx" (for UI patterns)
- file_search: "**/lib/**/*.ts" (for utility patterns)
- file_search: "**/app/api/**/route.ts" (for API patterns)
- Read 2-3 representative WORKING files COMPLETELY (1-EOF)
- Extract:
  • HeroUI component patterns (SelectItem key, Tabs selectedKey, Card structure)
  • Auth pattern: `import { auth } from '@/auth'`
  • API response format: `NextResponse.json({ data }, { status: 200 })`
  • OpenClaw adapter usage: `getAgentsList()`, `getGatewayStatus()`
  • Error handling patterns: try/catch, error responses
- Document: "Pattern discovery complete: found X working examples, extracted Y patterns"
- FAILURE: If no working examples found → HALT, report "No pattern examples found, cannot proceed safely"
```

**GATE 2 — COMPLETE FILE READING** (Guardian Checkpoint #1)
```
For every file that will be modified or created:
- NEW file: Read similar working examples completely (1-9999)
- EXISTING file: read_file(path, 1, 9999) — NO EXCEPTIONS
- If file > 1000 lines → BATCH LOAD (500-line chunks)
- State: "Read [filename] ([LINE_COUNT] lines total)"
- VERIFY: Can enumerate all functions/classes/types in file
- FAILURE: Cannot list structure → RE-READ immediately
```

**GATE 3 — STRUCTURED TODO CREATION** (10-15 atomic tasks)
```
Create todo list with EXACT order:
1. Types/interfaces (if new data shapes)
2. Utilities/calculations (pure functions)
3. Zod validations (for write operations)
4. OpenClaw adapter extensions (read/write functions)
5. API routes (GET list)
6. API routes (POST/PATCH/DELETE)
7. SWR hooks (use[Domain])
8. UI components (presentational)
9. Dashboard/page composition
10. Index barrel exports
11. TypeScript verification (npx tsc --noEmit)
12. Documentation updates (API.md)

Each task specifies:
- File path
- Deliverable (what function/component to create)
- Acceptance criteria (what "done" means)
- LOC target (200-500 typical)
- Dependencies (which tasks must precede)

FAILURE: Todo has < 5 tasks for complex feature → INSUFFICIENT GRANULARITY, break down more
```

**GATE 4 — CONTRACT VERIFICATION** (If UI or API involved)
```
Backend-Frontend Dual-Loading Protocol:
1. DISCOVER: Identify all counterpart files (frontend ↔ backend)
2. LOAD: Read all counterpart files completely (1-9999 each)
3. VERIFY: Generate Contract Matrix:

   | Endpoint/Component | Method/Type | Request | Response | Errors | Status |
   |-------------------|-------------|---------|----------|--------|--------|
   | /api/agents | GET | - | Agent[] | 500 | ✅ |
   | useAgents hook | SWR | - | Agent[] | - | ✅ |

4. RESOLVE: Any ❌ or mismatches → create separate task to fix contracts
5. REPORT: "Contract verification: X/Y matched (Z%). Ready: YES/NO"

FAILURE: Contracts not 100% matched → HALT, create contract alignment tasks first
```

**GATE 5 — AUTONOMOUS APPROVAL**
```
Self-approval criteria (ALL must be true):
✅ Pattern discovery completed (2-3 examples read)
✅ Complete file reading verified (all target files 1-EOF)
✅ Structured todo created (10-15 atomic tasks)
✅ Contract matrix verified (if applicable)
✅ Zero Guardian violations detected
✅ TypeScript verification will be final step

If ALL true → AUTO-APPROVE, proceed to Phase 3
If ANY false → HALT, fix missing gates, re-verify
```

### PHASE 3: AUTONOMOUS EXECUTION (Atomic Tasks)

**For EACH task in todo list (IN ORDER):**

```
1. MARK in-progress:
   - Update /dev/progress.md with task status "IN_PROGRESS"
   - Report: "⚡ Task X/Y: [description] — starting"

2. CONTEXT LOADING:
   - If modifying existing file: read_file(path, 1, 9999) AGAIN (fresh)
   - State: "Loaded [filename] ([LINE_COUNT] lines)"
   - Identify exact insertion point or edit location

3. GENERATE COMPLETE CODE:
   - NO placeholders, TODOs, pseudo-code
   - Follow discovered patterns EXACTLY (HeroUI props, auth, error handling)
   - Include full JSDoc (description, params, returns, examples)
   - Include comprehensive error handling (try/catch, validation, fallbacks)
   - Include TypeScript types (no `as any`)
   - LOC within target range (±20%)

4. APPLY CHANGES:
   - Use replace_string_in_file or edit_file
   - Verify pre-edit checklist (Guardian Checkpoint #2)
   - After edit, verify file integrity (no syntax errors introduced)

5. MARK completed:
   - Update /dev/progress.md: "✅ Task X/Y complete — [file] ([LOC] lines)"
   - Cumulative LOC tracking
   - Report: "Task X/Y done — [brief summary]"
```

**GUARDIAN MONITORING (After Every Tool Call):**
```
Run 19-point checklist automatically:
1. File reading complete? (no partial reads)
2. Edit verification passed? (read before edit)
3. Type safety? (no `as any`)
4. Code reuse? (searched existing first)
5. DRY principle? (zero duplication)
6. Auto-audit updated? (progress.md current)
7. Contract matrix? (if UI/API, verified)
8. Pattern discovery? (used working examples)
9. Flawless Protocol gates? (all 5 gates passed)
10. Utility-first? (shared utilities before features)
11. Index file? (barrel exports created)
12. Batch loading? (large files handled)
13. Complete context? (all related files loaded)
14. Flawless steps? (12-step compliance)
15. Mongoose indexes? (no duplicates)
16. HeroUI patterns? (correct props)
17. Auth pattern? (using `auth()`)
18. TypeScript pending? (will verify at end)
19. Security? (no hardcoded secrets, no unsafe operations)

ANY violation → Output "🚫 ECHO VIOLATION DETECTED" with correction steps, HALT execution until resolved
```

### PHASE 4: QUALITY VERIFICATION (Blocking Gate)

**TypeScript Verification (Non-negotiable):**
```
Execute: npx tsc --noEmit

If errors:
1. Parse all error messages
2. Categorize: missing types, wrong imports, property mismatches
3. Create FIX tasks in /dev/ immediately
4. Execute fix tasks (atomic, followed by re-verification)
5. Repeat until: "0 errors"

Report: "✅ TypeScript verification: 0 errors ([TIMESTAMP])"
```

**Build Verification:**
```
Execute: npm run build

If build fails:
1. Analyze error (likely TypeScript or import issue)
2. Fix immediately (create task if needed)
3. Re-run until success

Report: "✅ Build successful — production-ready"
```

### PHASE 5: COMPLETION & DOCUMENTATION

**Auto-Generate Completion Report:**
```
Create /docs/COMPLETION_REPORT_[TASK_ID]_[DATE].md:
- Feature summary
- All files created/modified with LOC
- TypeScript status (must be 0 errors)
- Contract matrix (if applicable)
- Performance considerations
- Known limitations
- Next steps

Create /docs/QA_RESULTS_[TASK_ID]_[DATE].md:
- TypeScript check result
- Build result
- Guardian violation summary (should be empty)
- Manual test checklist (if applicable)

Create /docs/IMPLEMENTATION_GUIDE_[TASK_ID]_[DATE].md:
- How to use the new feature
- Configuration required
- Troubleshooting
```

**Update Tracking Files:**
```
AUTO_UPDATE_COMPLETED(
  task_id,
  loc_total,
  files_created,
  files_modified,
  typescript_status="0 errors",
  build_status="success"
)
→ Automatically:
   - Moves entry from progress.md to completed.md
   - Updates /dev/metrics.md (cumulative LOC, velocity)
   - Creates /dev/lessons-learned.md entry if issues encountered
   - Archives to /dev/archives/YYYY-MM/ if completed.md > 50 entries
```

**Final Report to User/Orchestrator:**
```
## ✅ [Feature] IMPLEMENTATION COMPLETE

**Task ID**: FID-20260228-001 (auto-generated)
**Total LOC**: X,XXX lines
**Files Created**: N (list with LOC)
**Files Modified**: N (list with LOC)
**TypeScript**: 0 errors ✅
**Build**: Success ✅
**Guardian Violations**: 0 ✅
**Time**: X hours Y minutes

### Files
- `src/lib/openclaw-adapter.ts` (+120 lines) — added getCostMetrics()
- `src/components/CostPanel.tsx` (new, 234 lines) — provider spend display
- `src/app/api/cost/route.ts` (new, 145 lines) — GET /api/cost
- `src/hooks/useCost.ts` (new, 189 lines) — SWR hook with polling

### Features Delivered
- Real-time cost display per provider (Claude, Kimi, Minimax, Mistral)
- Daily spend tracking with $20 soft cap warning
- Historical spend chart (7-day rolling)
- Auto-refresh every 5 minutes

**Status**: ✅ COMPLETE — Ready for production
```

---

## 🛡️ GUARDIAN PROTOCOL v2.1 (NON-NEGOTIABLE)

**Guardian runs AFTER EVERY tool call. Violations HALT execution automatically.**

### 19-POINT CHECKLIST (Auto-Executed):

```
📋 POST-TOOL GUARDIAN CHECK:

1. FILE_READ_COMPLETE
   - Did I read 1-9999 or batch load fully?
   - VIOLATION: Partial read → read_file(path, 1, 9999) NOW

2. EDIT_PRE_READ
   - Before edit, did I read target completely?
   - VIOLATION: HALT, read first, THEN edit

3. TYPE_SAFETY
   - No `as any` in generated code?
   - VIOLATION: Replace with proper types from imports

4. CODE_REUSE
   - Searched existing before creating new?
   - VIOLATION: file_search + reuse existing

5. LEGACY_ANALYSIS
   - N/A for clean rebuild → SKIP

6. DRY_PRINCIPLE
   - Zero duplication detected?
   - VIOLATION: Extract shared utility, remove duplicate

7. AUTO_AUDIT
   - /dev/ files updated (progress.md current)?
   - VIOLATION: Execute AUTO_UPDATE_PROGRESS() NOW

8. CONTRACT_MATRIX
   - For UI/API tasks, discovered counterparts?
   - VIOLATION: Execute 5-step dual-loading protocol NOW

9. AAA_QUALITY
   - No placeholders/TODOs/pseudo-code?
   - VIOLATION: Complete implementation required

10. UTILITY_FIRST
    - Built shared utilities before features?
    - VIOLATION: HALT, create utilities first

11. INDEX_FILE
    - New directory has index.ts barrel exports?
    - VIOLATION: Create src/[dir]/index.ts now

12. DOC_LOCATION
    - Documentation in /docs with proper naming?
    - VIOLATION: Move to /docs/COMPLETION_REPORT_*.md

13. BATCH_LOADING
    - Files >1000 lines read in chunks?
    - VIOLATION: Use batch loading protocol

14. COMPLETE_CONTEXT
    - All target files loaded before coding?
    - VIOLATION: Load all files 1-EOF now

15. PATTERN_DISCOVERY
    - Found 2-3 working examples before coding?
    - VIOLATION: HALT, search + read examples

16. FLAWLESS_GATES
    - All 5 gates passed? (Pattern, Read, Todo, Contract, Approval)
    - VIOLATION: HALT, execute missing gates in order

17. MONGOOSE_INDEXES
    - No duplicate index definitions in schemas?
    - VIOLATION: Remove duplicate, keep ONE per field

18. HEROUi_PATTERNS
    - Using correct props (key, selectedKey, onSelectionChange)?
    - VIOLATION: Fix to match discovered patterns

19. AUTH_PATTERN
    - Using `import { auth } from '@/auth'`?
    - VIOLATION: Replace getServerSession with auth()
```

**Violation Response Format:**
```
🚫 GUARDIAN VIOLATION: [Checkpoint #X - Name]

Detected: [What went wrong]
Location: [File/line if applicable]
Required Fix: [Exact corrective action]

MANDATORY CORRECTION:
[Execute specific tool calls to fix]
→ Then re-run Guardian check
```

---

## 🔴 COMPLETE FILE READING LAW (Absolute)

**Guardian Checkpoint #1 — Zero Tolerance for Partial Reads**

### MANDATORY (Every File Access):

```
1. NEW file: Read 2-3 similar working examples completely (1-9999)
2. EXISTING file: read_file(path, startLine=1, endLine=9999)
3. If response truncated (< requested lines) → BATCH LOAD:
   - Chunk 1: read_file(path, 1, 500)
   - Chunk 2: read_file(path, 501, 1000)
   - Continue until EOF (tool returns < requested lines)
   - State cumulative: "Batch-loaded NNN lines via M batches"
4. VERIFY: State exact total line count
5. CONFIRM: Can list all functions/classes/types in file
6. PROCEED: Only after verification passes

BAN: Reading lines 1-100, 1-200, 1-500 for large files — ALWAYS use 9999 or batch loading
```

**Proof of Complete Understanding Required:**
- Exact line count stated (from tool response)
- Enumeration of all exports (functions, classes, interfaces)
- Understanding of imports and dependencies
- Knowledge of where to insert/modify code

---

## 🔗 BACKEND-FRONTEND DUAL-LOADING (When Applicable)

**Guardian Checkpoint #8 — Auto-Enforced for UI/API Tasks**

**Trigger**: Task mentions "component", "API", "endpoint", "route", "dashboard", "frontend", "backend", "hook"

**5-Step Automatic Protocol:**

```
1. DISCOVER COUNTERPARTS:
   - If creating component X → search for API routes it will call
   - If creating API route Y → search for components that consume it
   - file_search + grep_search for all related files
   - Create mapping: Frontend Files ↔ Backend Files

2. LOAD COMPLETELY:
   - For EACH file in mapping: read_file(path, 1, 9999)
   - Batch load if >1000 lines
   - State: "Loaded N files ([TOTAL] lines) for contract verification"

3. VERIFY CONTRACTS:
   - Extract from backend: endpoint path, method, request schema, response schema, error codes
   - Extract from frontend: API call method, expected response shape, error handling
   - Generate Contract Matrix table:

     | Endpoint | Method | Frontend Hook | Request Type | Response Type | Errors | Status |
     |----------|--------|---------------|--------------|---------------|--------|--------|
     | /api/agents | GET | useAgents() | none | Agent[] | 500,404 | ✅ Matched |
     | /api/agents | POST | useCreateAgent() | AgentCreate | Agent | 400,409 | ⚠️ Type mismatch |

4. RESOLVE MISMATCHES:
   - Type mismatches → align interfaces
   - Missing endpoints → create separate task
   - Error format inconsistencies → standardize
   - Add missing error handling

5. REPORT & APPROVE:
   - Present matrix with coverage percentage
   - State: "Contract verification: X/Y endpoints at 100% — Ready: YES/NO"
   - If < 100% → create alignment tasks, HALT main implementation
```

**Dynamic Batching Limits:**
- Total LOC ≤ 1,800 per contract verification batch
- File count ≤ 10 per batch
- Always keep counterpart files together in same batch
- Reduce to ≤ 1,200 LOC for multi-schema complexity

---

## 🚨 ANTI-DRIFT MECHANISMS (Autonomous Quality)

### QUALITY GATES (Blocking):

1. **File Read Gate** — Cannot proceed without complete file reads
2. **Pattern Gate** — Must discover working examples
3. **Contract Gate** — Backend-frontend must match 100%
4. **TypeScript Gate** — 0 errors mandatory
5. **Guardian Gate** — 19-point compliance, zero violations

### CONTINUOUS MONITORING:

Guardian executes:
- After EVERY tool call (read, write, search, exec)
- Before EVERY code generation
- After EVERY file modification
- During task execution (every 5 minutes)

Violation → HALT → AUTO-CORRECT → VERIFY → RESUME

---

## 📊 SUCCESS METRICS (Autonomous Targets)

**Autonomous Operation Metrics:**
- **Compliance Rate**: ≥ 98% (Guardian checks passing)
- **TypeScript Errors**: 0 (always, self-correcting)
- **Session Recovery**: Agent can resume from /dev/ state in < 30s
- **Feature Velocity**: 4-6 features/week (complexity 1-3)
- **Estimation Accuracy**: Within 20% (self-calibrating)
- **Human Interventions**: < 1 per week (goal: fully autonomous)
- **Guardian Violations**: < 5 per week (trending to 0)

**Quality Metrics:**
- Chat Report Completeness: 100% (automatic)
- Tracking File Lag: 0s (real-time updates)
- Build Success Rate: 100%
- Test Coverage: > 80% (if tests written)
- Documentation Coverage: 100% (auto-generated)

---

## 🎯 ATLAS-CLEAN SPECIFIC RULES

**Project Constraints (Hardcoded):**
- Stack: Next.js 15, TypeScript 5.7+, Tailwind 3.4, HeroUI
- Data: File-based JSON (`data/` directory, gitignored)
- Auth: `X-ATLAS-TOKEN` header, validated by `src/middleware.ts`
- API: All `/api/*` routes require auth, return JSON
- OpenClaw: Adapter at `src/lib/openclaw-adapter.ts` — READ BEFORE MODIFYING
- Security: `.env.local` gitignored, `logs/` gitignored, `data/` gitignored
- Actions: `/api/actions/*` locked until Ares approval in code (`// ARES-APPROVED`)

**Working Examples to Pattern-Discover:**
- `src/app/api/agents/route.ts` — GET agents, auth header check, JSON response
- `src/components/AgentsPanel.tsx` — Client component, fetch with token, table rendering
- `src/components/MetricsPanel.tsx` — Status cards, loading states, error handling
- `src/lib/openclaw-adapter.ts` — File allowlist, JSON parsing, safe error messages
- `src/app/api/memory/search/route.ts` — Query param handling, search logic, results formatting

**No Legacy Analysis:** Clean rebuild. Skip Step 2 of Flawless Protocol.

**Autonomy Level:** 
- ✅ Free to: Create/modify files, run TypeScript, generate docs, update /dev/
- ❌ Not free to: Bypass Guardian gates, ignore TypeScript errors, modify locked actions
- 🔒 Requires Ares code approval (not runtime approval): Actions that restart gateway, trigger savepoint, run memory index

---

## 📋 AUTO-UPDATE FUNCTIONS (Self-Maintaining)

**These execute automatically — NO human intervention:**

```
AUTO_UPDATE_PLANNED(task_id, description, complexity, estimated_files)
→ Adds to /dev/planned.md with timestamp

AUTO_UPDATE_PROGRESS(task_id, status, files_changed, current_task)
→ Updates /dev/progress.md, sets status IN_PROGRESS/RESOLVED

AUTO_UPDATE_COMPLETED(task_id, loc_total, files_created, files_modified, typescript_status, build_status)
→ Moves from progress.md to completed.md
→ Calls METRICS_UPDATE() — updates cumulative stats
→ Calls CAPTURE_LESSONS_LEARNED() — learns from issues
→ Archives to /dev/archives/YYYY-MM/ if completed.md > 50 entries

AUTO_ARCHIVE_CHECK()
→ Runs after every AUTO_UPDATE_COMPLETED
→ If completed.md has ≥ 50 entries, archive month to /dev/archives/YYYY-MM/

METRICS_UPDATE()
→ Updates /dev/metrics.md with:
   - Total features completed
   - Cumulative LOC
   - Average LOC/feature
   - TypeScript error rate (target: 0)
   - Guardian violation rate (target: 0)
   - Build success rate (target: 100%)

CAPTURE_LESSONS_LEARNED()
→ If task had Guardian violations or errors, lessons to /dev/lessons-learned.md
→ Format: "DATE — ISSUE — RESOLUTION — PREVENTION"
```

**Integration**: These are called at exact phases (planned → progress → completed). No manual updates needed.

---

## 🔄 AUTONOMOUS WORKFLOW SUMMARY

**NO HUMAN GATES — Self-Approving After Quality Gates**

### Simple Task (<4h, 1-2 files):
```
1. Load DEV_INSTRUCTIONS (if not already)
2. Pattern discovery (2 examples, 5 min max)
3. Complete file reads (all affected files)
4. Create mini-todo (3-5 tasks)
5. Self-approve (all gates passed)
6. Execute tasks atomically
7. TypeScript verify → 0 errors
8. AUTO_UPDATE_COMPLETED()
9. Report completion
TOTAL TIME: ~3h (no waiting)
```

### Standard Feature (4-16h, multiple files):
```
1. Load DEV_INSTRUCTIONS
2. Pattern discovery (3 examples)
3. Complete file reads (all affected)
4. Create structured todo (10-15 tasks)
5. Contract matrix (if UI/API)
6. Self-approve (gates passed)
7. Execute tasks atomically (report each)
8. TypeScript verify → fix all errors
9. Build verify → success
10. Generate docs (/docs/)
11. AUTO_UPDATE_COMPLETED()
12. Report completion
TOTAL TIME: ~12h (no pauses)
```

### Complex Project (>16h, new domains):
```
1. Load DEV_INSTRUCTIONS
2. Pattern discovery (may need multiple rounds)
3. Break into sub-features (multiple FIDs)
4. For each FID: Standard Feature workflow
5. Integration testing between FIDs
6. Comprehensive documentation
7. AUTO_UPDATE_COMPLETED() for each FID
8. Final integration report
TOTAL TIME: ~40h (autonomous multi-day)
```

---

## 🎯 CRITICAL DIFFERENCES FROM HUMAN-FOCUSED ECHO

| Aspect | ECHO v1.3.4 (Human) | ATLAS-CLEAN (Autonomous Agent) |
|--------|---------------------|--------------------------------|
| **Approval Gate** | ❌ Requires "proceed" from human | ✅ Self-approve after quality gates |
| **Legacy Analysis** | ✅ Required if legacy exists | ❌ Skipped (clean rebuild) |
| **FID System** | ✅ Formal FID files in /dev/fids/ | ⚠️ Simplified (auto-generated IDs) |
| **Tracking Updates** | ✅ AUTO_* functions called by agent | ✅ Same (automatic) |
| **Guardian** | ✅ Monitors, suggests corrections | ✅ Monitors, AUTO-CORRECTS (hard block) |
| **Human Interaction** | Frequent checkpoints, approvals | Minimal — only for strategic direction |
| **Error Recovery** | Human assists with blockers | Self-recovery via Guardian + retries |
| **Session Recovery** | User runs "Resume" command | Agent auto-resumes from /dev/state.json |

**Key Enablers of Autonomy:**
1. Guardian auto-correction (no human needed to fix violations)
2. Self-approval after gates (no waiting)
3. Automatic tracking (no manual updates)
4. Batch loading + pattern discovery (no context gaps)
5. TypeScript gate (quality enforced programmatically)
6. Contract matrix (backend-frontend alignment verified before coding)

---

## 📚 GLOSSARY (Agent-Focused)

- **Autonomous Mode**: Agent self-approves, executes without human "proceed"
- **Guardian Violation**: Any of 19 compliance checks failing → auto-correction required
- **Self-Approval**: After all quality gates pass, agent automatically proceeds
- **Complete File Reading**: read_file(path, 1, 9999) OR batch loading — no exceptions
- **Pattern Discovery**: Search for working examples within ATLAS-CLEAN before coding
- **Contract Matrix**: Backend-frontend compatibility verification table
- **Atomic Tasks**: One deliverable per task, executed in strict order
- **TypeScript Gate**: 0 errors mandatory before completion (non-negotiable)
- **Auto-Audit**: /dev/ tracking files updated automatically (no manual work)
- **Session Recovery**: Agent reads /dev/state.json to resume interrupted work
- **Ares Approval**: Not runtime human approval — code MUST have `// ARES-APPROVED` comment for security-critical actions
- **Flawless Protocol**: 12-step methodology (but autonomous execution after gates)

---

**WAL is Law. Human gates removed. Agent autonomy enabled. Quality gates remain non-negotiable. Self-approval after verification. Continuous operation. Zero waiting.**

**Last Updated**: 2026-02-28 (Autonomous Mode v1.0)  
**Status**: ACTIVE — All agents execute autonomously following this protocol
