# Agentic Design Patterns — Visual Guide

24 patterns organized into five categories. Every pattern shown as a data-flow diagram with 3 real-world examples so you can see exactly how each one is applied in practice.

---

## Table of Contents

| # | Pattern | Category |
|---|---------|----------|
| — | [The Agentic Loop (Foundation)](#-foundation-the-agentic-loop) | Foundation |
| 1 | [Tool Dispatch](#pattern-1--tool-dispatch) | A. Reason-Act Core Loops |
| 2 | [Reflexion](#pattern-2--reflexion-post-task-self-critique) | A. Reason-Act Core Loops |
| 3 | [Tree-of-Thought](#pattern-3--tree-of-thought-tot) | A. Reason-Act Core Loops |
| 4 | [Self-Consistency Voting](#pattern-4--self-consistency-voting) | A. Reason-Act Core Loops |
| 5 | [Deliberate Reasoning Scratchpad](#pattern-5--deliberate-reasoning-scratchpad) | A. Reason-Act Core Loops |
| 6 | [Planner-Executor Split](#pattern-6--planner-executor-split) | B. Planning & Decomposition |
| 7 | [Code-as-Orchestrator](#pattern-7--code-as-orchestrator) | B. Planning & Decomposition |
| 8 | [Workflow DAG / State Machine](#pattern-8--workflow-dag--state-machine) | B. Planning & Decomposition |
| 9 | [Constraint/Checklist-Driven Planning](#pattern-9--constraintchecklist-driven-planning) | B. Planning & Decomposition |
| 10 | [Orchestrator/Worker](#pattern-10--orchestratorworker) | C. Multi-Agent Orchestration |
| 11 | [Handoff Chain](#pattern-11--handoff-chain) | C. Multi-Agent Orchestration |
| 12 | [Fan-Out + Judge](#pattern-12--fan-out--judge) | C. Multi-Agent Orchestration |
| 13 | [Debate/Deliberation with Arbiter](#pattern-13--debatedeliberation-with-arbiter) | C. Multi-Agent Orchestration |
| 14 | [Specialist Swarm with Coordinator](#pattern-14--specialist-swarm-with-coordinator) | C. Multi-Agent Orchestration |
| 15 | [Skill Router / Intent-Based Dispatch](#pattern-15--skill-router--intent-based-dispatch) | C. Multi-Agent Orchestration |
| 16 | [Self-Correction Retry Loop](#pattern-16--self-correction-retry-loop) | D. Quality & Safety |
| 17 | [Evaluator-Worker](#pattern-17--evaluator-worker) | D. Quality & Safety |
| 18 | [Guardrails & Policy Enforcement Layer](#pattern-18--guardrails--policy-enforcement-layer) | D. Quality & Safety |
| 19 | [Evals-in-the-Loop & Canary Runs](#pattern-19--evals-in-the-loop--canary-runs) | D. Quality & Safety |
| 20 | [Memory Patterns](#pattern-20--memory-patterns) | E. Memory & State |
| 21 | [Event-Driven / Long-Running Agents](#pattern-21--event-driven--long-running-agents) | E. Memory & State |
| 22 | [Knowledge Graph-Augmented Agents](#pattern-22--knowledge-graph-augmented-agents) | E. Memory & State |
| 23 | [Human-in-the-Loop](#pattern-23--human-in-the-loop) | E. Memory & State |
| 24 | [Structured Output](#pattern-24--structured-output) | E. Memory & State |

---

## 🔑 Foundation: The Agentic Loop

Every pattern below is built on this core loop. The LLM decides how many steps to take.

```
┌─────────────────────────────────────────────────────────────────┐
│                        AGENTIC LOOP                             │
│                                                                 │
│   User Message                                                  │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────┐    tool_calls?   ┌──────────────┐                 │
│  │   LLM   │ ───────────────▶ │ Execute Tools│                 │
│  └─────────┘                  └──────────────┘                 │
│       │                              │                          │
│       │ stop?                        │ results                  │
│       ▼                              └──────────▶ (loop back)  │
│  Final Answer                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```python
while True:
    response = client.chat.completions.create(model=MODEL, messages=messages, tools=tools)
    if response.choices[0].finish_reason == "stop":
        return response.choices[0].message.content
    for tool_call in response.choices[0].message.tool_calls:
        result = dispatch(tool_call.function.name, json.loads(tool_call.function.arguments))
        messages.append({"role": "tool", "tool_call_id": tool_call.id, "content": json.dumps(result)})
```

The LLM decides the number of steps. All other patterns build on this.

---

## 🅐 Category A — Reason-Act Core Loops

---

### Pattern 1 — Tool Dispatch

How the agent routes a tool call to the right function.

```
                    LLM decides: "call search_web"
                            │
                            ▼
              ┌─────────────────────────┐
              │      DISPATCHER         │
              │                         │
              │  Strategy A: globals()  │
              │  Strategy B: registry   │
              └─────────────────────────┘
                    │          │          │
                    ▼          ▼          ▼
              search_web  send_email  get_weather
                    │
                    ▼
              {"results": ...}  ──▶  back to LLM
```

Two strategies:
- **`globals()[name]`** — zero registration, scales to any number of tools
- **`TOOL_REGISTRY[name]`** — explicit, auditable, safer

**When to use:** Every tool-using agent needs this. It's the plumbing behind the agentic loop.

**Real-world examples:**
- **Customer service bot** — LLM routes calls to `lookup_order()`, `process_refund()`, `send_email()`, or `escalate_to_human()` depending on what the customer needs
- **Coding assistant** — LLM routes to `read_file()`, `run_tests()`, `search_docs()`, or `apply_patch()` to autonomously fix a bug end-to-end
- **Financial trading agent** — LLM routes to `get_market_price()`, `fetch_earnings_report()`, `place_order()`, or `send_alert()` based on market conditions

---

### Pattern 2 — Reflexion (Post-task Self-Critique)

Unlike a simple retry, reflections are **saved to memory** and reused in future runs.

```
 Session 1                              Session 2
 ──────────                              ──────────
 Task ──▶ LLM ──▶ Output               Task ──▶ LLM (+ past lessons) ──▶ Better Output
               │                                       ▲
               ▼                                       │
          Self-Critique                                │
          "Too vague, missing citations"               │
               │                                      │
               ▼                                      │
       ┌────────────────┐                             │
       │ EPISODIC STORE │ ──── lesson saved ──────────┘
       │  (persistent)  │
       └────────────────┘
               │
               ▼
          Revised Output  ◀── inject critique ◀──
```

**Key distinction from Self-Correction (Pattern 16):**
- Self-Correction is inline — fixes within the same task, lessons are discarded
- Reflexion stores lessons that survive across sessions and inform future tasks

**When to use:** Reports, code review, policy alignment, any task that repeats.

**Real-world examples:**
- **AI writing assistant** — After producing a blog post that was flagged for passive voice, it stores "always use active voice for this client." Every future draft avoids the same mistake without being told again
- **Code review agent** — After missing a null pointer exception three times, it stores "always check for unguarded pointer dereferences in C++ submissions." Future reviews catch it automatically
- **Marketing copy agent** — After drafts are consistently rejected for using competitor brand names, it learns and stores "never mention Brand X or Brand Y" as a permanent lesson

---

### Pattern 3 — Tree-of-Thought (ToT)

Explores multiple reasoning paths simultaneously, like a game tree, and prunes weak branches.

```
                    Problem
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
      Branch A      Branch B      Branch C
    (approach 1)  (approach 2)  (approach 3)
         │             │             │
      Score:0.7     Score:0.9     Score:0.4
         │             │             │
       PRUNE        EXPAND!        PRUNE
                       │
              ┌────────┴────────┐
              ▼                 ▼
           Sub-B1            Sub-B2
         Score:0.85         Score:0.92
                                │
                             EXPAND!
                                │
                                ▼
                            Solution ✓
```

**When to use:** Complex planning, puzzle-like tasks, creative ideation. Higher compute cost but finds solutions a linear thinker would miss.

**Real-world examples:**
- **Drug discovery** — Explores three synthesis routes simultaneously (enzymatic, chemical, fermentation). Scores each on yield, cost, and safety. Expands only the two highest-scoring routes into detailed protocols, saving weeks of lab time
- **Infrastructure architecture design** — Branches into microservices, monolith, and serverless approaches. Each branch is scored on scalability, cost, and team expertise. The winning branch is expanded into a full technical spec
- **Legal argument strategy** — A litigation-support agent explores three defense theories in parallel, scores each on precedent strength and jury appeal, then builds the full brief around the strongest theory

---

### Pattern 4 — Self-Consistency Voting

Ask the same question N times independently, then pick the consensus.

```
        ┌────────────────────────────────────────┐
        │               Question                  │
        └──────┬──────────┬──────────┬───────────┘
               │          │          │
        temp=0.7    temp=0.7    temp=0.7   (diversity via temperature)
               ▼          ▼          ▼
          Answer: A   Answer: A   Answer: B
               │          │          │
               └──────────┴──────────┘
                           │
                    ┌──────▼──────┐
                    │ VOTE COUNTER │
                    │  A: 2 votes  │
                    │  B: 1 vote   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────────────────────┐
                    │ clear majority?              │
                    │   Yes → return A             │
                    │   No  → Judge LLM picks best │
                    └──────────────────────────────┘
```

**When to use:** Ambiguous questions where single-shot answers vary. Trades cost (N × API calls) for reliability.

**Real-world examples:**
- **Medical differential diagnosis** — An AI clinical decision support system samples 7 independent diagnoses for ambiguous symptoms. If 5+ agree on "viral pneumonia vs bacterial pneumonia," that grouping is presented to the physician with high confidence
- **Legal case outcome prediction** — A litigation analytics tool samples 5 independent outcome predictions for a contract dispute. The majority prediction is surfaced as the most reliable forecast, reducing the influence of any single hallucination
- **Financial fraud detection** — A transaction classifier runs 5 independent classifications on an edge-case transaction. Only flags as fraud if 4+ agree, dramatically reducing false positive rates that annoy legitimate customers

---

### Pattern 5 — Deliberate Reasoning Scratchpad

The LLM thinks privately in a hidden field; only the final polished answer is shown.

```
  User sees:                        Internally (hidden):
  ──────────                        ─────────────────────────────────
                                    scratchpad:
  Question ──▶ LLM ──▶ Answer       "Let me think step by step...
                                     The user is asking X.
                                     Edge case: what if Y?
                                     Risk: Z might cause problem...
                                     Regulation requires...
                                     Okay, the safe answer is..."
                                             │
                                             ▼
                                    final_answer: "Here is..."
                                             │
                                             ▼
                                       ──▶ Answer (shown to user)
```

**When to use:** Sensitive domains (compliance, medical, legal) where exposing raw chain-of-thought is risky or confusing for the end user.

**Real-world examples:**
- **Healthcare triage chatbot** — Internally reasons "patient mentions chest pain + age 58 + smoker → high cardiac risk → do NOT suggest wait-and-see." The scratchpad holds the clinical logic; the user sees only "Please call 911 or visit your nearest ER immediately"
- **Children's educational assistant** — Internally considers "this question about reproduction is age-appropriate but must be answered at a 5th-grade level without clinical detail." The raw reasoning is hidden; the child sees a clean, age-appropriate explanation
- **Financial compliance advisor** — Internally works through "this transaction pattern matches structuring under 31 U.S.C. §5324 — must flag but cannot accuse customer directly." The scratchpad holds the regulatory analysis; the advisor output is a neutral, carefully worded alert

---

## 🅑 Category B — Planning & Decomposition

---

### Pattern 6 — Planner-Executor Split

Strong model thinks, cheap model acts. Intelligence where it matters, efficiency everywhere else.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  User Goal: "Write a market analysis report"                     │
│       │                                                          │
│       ▼                                                          │
│  ┌──────────────┐  gpt-4o (strong model)                        │
│  │   PLANNER    │  dynamically generates:                        │
│  └──────────────┘    1. Research competitors                     │
│       │              2. Gather market data                       │
│       │              3. Analyze trends                           │
│       │              4. Write draft                              │
│       ▼                                                          │
│  ┌─────────────────────────────────────────────┐                │
│  │            EXECUTORS (gpt-4o-mini)           │                │
│  │  Step 1 ──▶ Executor ──▶ result 1            │                │
│  │  Step 2 ──▶ Executor ──▶ result 2            │                │
│  │  Step 3 ──▶ Executor ──▶ result 3            │                │
│  │  Step 4 ──▶ Executor ──▶ result 4            │                │
│  └─────────────────────────────────────────────┘                │
│       │                                                          │
│       ▼                                                          │
│  SYNTHESIZER ──▶ Final Report                                    │
└──────────────────────────────────────────────────────────────────┘
```

**Key distinction from Code-as-Orchestrator:** The LLM generates the plan dynamically. Use when the decomposition itself requires intelligence (you can't predict the steps in advance).

**Real-world examples:**
- **Travel itinerary builder** — GPT-4o plans the itinerary (flight layovers, hotel proximity, attraction order). GPT-4o-mini executes each booking step (search Skyscanner, book hotel, add calendar events), cutting cost by 70% while maintaining planning quality
- **Software feature implementation** — GPT-4o architects the approach (which files to touch, which APIs to call, which tests to write). GPT-4o-mini writes each individual function and unit test, with the planner reviewing integration at the end
- **Competitive intelligence report** — GPT-4o decides which angles to research (pricing, hiring signals, product roadmap, customer sentiment). GPT-4o-mini runs each individual search query, scrapes the data, and writes each section. GPT-4o synthesizes the final executive summary

---

### Pattern 7 — Code-as-Orchestrator

Python drives the entire workflow. No LLM decides the order of operations.

```
Python Script (you control this 100%)
         │
         ├──▶ step 1: plan_agent(query)              LLM call #1
         │              └── returns: SearchPlan
         │
         ├──▶ step 2: asyncio.gather(                LLM calls #2–6 (parallel)
         │              search_agent(query_1),
         │              search_agent(query_2),
         │              search_agent(query_3),
         │            )
         │
         ├──▶ step 3: write_agent(summaries)         LLM call #7
         │              └── returns: Report
         │
         └──▶ step 4: email_agent(report)            LLM call #8
```

**The recommended default for most pipelines.** Predictable, debuggable, cost-efficient. LLMs are workers; Python is the boss.

**When NOT to use:** When the task structure itself can't be determined in advance (use Planner-Executor instead).

**Real-world examples:**
- **CI/CD pipeline** — Python orchestrates: `lint_agent()` → `test_agent()` → `security_scan_agent()` → `build_agent()` → `deploy_agent()` → `notify_agent()`. Each stage is a fixed LLM worker; Python determines the order and handles failures at each gate
- **Nightly data ETL** — Python runs: `extract_agent(source)` → `validate_agent(data)` → `transform_agent(schema)` → `load_agent(warehouse)` → `quality_report_agent()`. Executes on cron at 2am; Python manages retries if any step fails
- **Content moderation pipeline** — Python sequences: `classify_agent(post)` → `toxicity_agent(post)` → `legal_review_agent(post)` → `decision_agent(scores)` → `action_agent(decision)`. The fixed order is legally required — Python enforces it, never an LLM

---

### Pattern 8 — Workflow DAG / State Machine

Makes agents deterministic by defining every possible state and transition explicitly.

```
               START
                 │
                 ▼
           ┌──────────┐
           │  INTAKE  │
           └──────────┘
                 │
                 ▼
           ┌──────────┐   error?   ┌──────────┐
           │ PROCESS  │ ──────────▶│  RETRY   │◀─── retry_count < 3
           └──────────┘            └──────────┘
                 │
                 │ ok
                 ▼
           ┌──────────┐   failed?  ┌──────────────┐
           │  REVIEW  │ ──────────▶│   FALLBACK   │──▶ END
           └──────────┘            └──────────────┘
                 │
                 │ approved
                 ▼
           ┌──────────┐
           │  NOTIFY  │
           └──────────┘
                 │
                 ▼
               END
```

**When to use:** Production systems that need SLAs, traceability, and automatic fault recovery. LangGraph's `StateGraph` is the canonical implementation.

**Real-world examples:**
- **Insurance claims processing** — States: `RECEIVED → VALIDATE → ASSESS_DAMAGE → VERIFY_COVERAGE → CALCULATE_PAYOUT → HUMAN_REVIEW → APPROVED/REJECTED → PAYMENT → CLOSED`. If `VERIFY_COVERAGE` fails, auto-transition to `REQUEST_DOCUMENTS` state. Every state transition is logged for audit
- **Mortgage application** — States: `SUBMITTED → CREDIT_CHECK → INCOME_VERIFY → PROPERTY_APPRAISAL → UNDERWRITING → CONDITIONAL_APPROVAL → FINAL_DOCS → FUNDED`. Each state has a timeout; if `UNDERWRITING` exceeds 48h, auto-escalate to senior underwriter
- **Patient discharge workflow** — Hospital system uses states: `DISCHARGE_ORDER → MEDICATION_RECONCILE → PATIENT_EDUCATION → TRANSPORT_ARRANGED → DISCHARGED`. If `MEDICATION_RECONCILE` catches a drug interaction, hard-block transition to `PATIENT_EDUCATION` until pharmacist resolves it

---

### Pattern 9 — Constraint/Checklist-Driven Planning

Agent cannot proceed until every compliance gate is verified and checked off.

```
  Task: "Process financial audit"
         │
         ▼
  ┌─────────────────────────────────────┐
  │           PLAN (structured)          │
  │  steps: [...]                        │
  │                                      │
  │  constraints:                        │
  │    • "Must comply with SOX §404"     │
  │    • "No PII in output"              │
  │    • "Dual approval required"        │
  │                                      │
  │  checklist:                          │
  │    □ Evidence collected              │
  │    □ Risk score computed             │
  │    □ Manager signed off              │
  └─────────────────────────────────────┘
         │
         ▼ (execute steps)
         │
         ▼
  ┌─────────────────────────────────────┐
  │         VERIFY CHECKLIST            │
  │    ✓ Evidence collected             │
  │    ✓ Risk score computed            │
  │    ✗ Manager signed off  ← BLOCKED  │
  └─────────────────────────────────────┘
         │
         ▼
    Human Approval Gate  ──▶  (continue once approved)
```

**When to use:** Regulated industries (SOX, HIPAA, PCI), high-stakes workflows. Each checklist item records the evidence used to verify it, providing a full audit trail.

**Real-world examples:**
- **GDPR data deletion request** — Constraints: "delete from all 12 systems," "generate deletion certificate," "notify DPA within 72h." Checklist verifies each system was cleared, with a database timestamp as evidence. Cannot generate the certificate until all 12 boxes are checked
- **FDA drug submission package** — Constraints: "include Phase I/II/III trial data," "adverse event reporting complete," "bioequivalence studies attached." Checklist has 47 mandatory items. The agent blocks submission if any item lacks attached evidence documents
- **PCI-DSS quarterly access review** — Constraints: "no inactive accounts with card data access," "all privileged accounts MFA-enabled." Checklist cross-references IAM exports against HR termination records. Fails loudly with evidence if even one account violates policy

---

## 🅒 Category C — Multi-Agent Orchestration

---

### Pattern 10 — Orchestrator/Worker

A manager agent delegates tasks to specialist workers. Workers return results — the manager never loses control.

```
                    ┌─────────────────┐
                    │  MANAGER AGENT  │  (gpt-4o — strong model)
                    └─────────────────┘
                    "I need to analyze the AI chip market."
                      │            │           │
              as_tool()    as_tool()    direct tool
             (returns)    (returns)    (returns)
                      │            │           │
                      ▼            ▼           ▼
              ┌────────────┐ ┌──────────┐ ┌──────────────┐
              │ RESEARCHER │ │ ANALYST  │ │ send_report()│
              │  (worker)  │ │ (worker) │ │   (tool)     │
              └────────────┘ └──────────┘ └──────────────┘
                      │            │
              returns result  returns result
                      └────────────┘
                           │
                    Manager synthesizes
                           │
                           ▼
                      Final Report
```

Workers return results **back to the manager** — control is never permanently transferred (unlike Handoffs).

**Real-world examples:**
- **Investment research platform** — Portfolio manager agent dispatches: `market_data_worker` (fetches prices/volumes), `news_worker` (scans headlines), `fundamentals_worker` (reads 10-K/10-Q), `sentiment_worker` (analyzes social media). Manager synthesizes into a buy/hold/sell recommendation
- **Customer 360 view** — CRM orchestrator dispatches: `billing_worker` (payment history), `support_worker` (ticket history), `product_worker` (feature usage), `churn_worker` (risk score). Manager assembles a unified customer health report for the account manager
- **HR onboarding coordinator** — HR manager agent dispatches: `IT_worker` (provision laptop, accounts), `facilities_worker` (assign desk, badge), `payroll_worker` (set up direct deposit), `training_worker` (enroll in Day 1 courses). Manager confirms all steps complete before marking onboarding done

---

### Pattern 11 — Handoff Chain

Control transfers **permanently** to the next agent. Like a relay race — the baton never comes back.

```
  Customer: "I have a billing issue with invoice #4521"
               │
               ▼
        ┌─────────────┐
        │ TRIAGE AGENT│  classifies intent
        └─────────────┘
               │
               │ intent = "billing" ────────────────────────────┐
               │                                                 ▼
               │ intent = "tech"     ┌──────────────────────────────────┐
               └───────────────────▶ │        BILLING AGENT             │
                                     │  (now permanently owns convo)    │
                                     │  tools: lookup_invoice           │
                                     │         process_refund           │
                                     │         send_confirmation        │
                                     └──────────────────────────────────┘
                                                      │
                                                      ▼
                                               Resolves fully
                                     (Triage is NEVER called back)
```

**Key distinction from Orchestrator/Worker:** `as_tool()` returns control to the caller. Handoff permanently transfers ownership. Use when the specialist needs full autonomy to see the task through.

**Real-world examples:**
- **Hospital patient journey** — ER triage agent classifies and hands off to the Cardiology specialist agent, which then hands off to the Pharmacy agent for discharge medications, which hands off to the Billing agent. Each specialist owns their domain end-to-end; the ER never re-engages
- **E-commerce support escalation** — First-line bot handles FAQs; hands off to a Human Agent assist bot for complex issues; which hands off to a Logistics specialist agent when tracking is involved; which hands off to a Returns specialist agent for refunds. Each hand off is permanent
- **Sales pipeline automation** — SDR bot qualifies leads and hands off to AE Assistant agent for demos; AE hands off to Legal agent for contract redlining; Legal hands off to Finance agent for payment processing. The deal moves forward linearly, never backward

---

### Pattern 12 — Fan-Out + Judge

Get multiple independent answers in parallel, then let a judge pick the best.

```
            Question: "Explain quantum entanglement simply"
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
    ┌─────────┐         ┌─────────┐          ┌─────────┐
    │  GPT-4o │         │ Claude  │          │ Gemini  │
    └─────────┘         └─────────┘          └─────────┘
         │                    │                    │
      Answer A             Answer B             Answer C
    (too technical)       (well-balanced)      (too simple)
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                     ┌─────────────┐
                     │  JUDGE LLM  │  evaluates: accuracy,
                     └─────────────┘  clarity, depth
                              │
                              ▼
                       Answer B wins ✓
```

**Value comes from model diversity** — different architectures have different strengths. All three running the same model provides much less value.

**Real-world examples:**
- **Legal document review** — Three LLMs (GPT-4o, Claude, Gemini) each review a contract clause for risk. A judge LLM identifies where all three agree (high-confidence risk) vs. where only one flags something (needs human review). Law firms use this to catch issues no single model would reliably catch
- **Technical RFP response writing** — Three models each draft a response to a government RFP. A judge scores on: compliance with requirements, technical depth, and clarity. The winning draft is submitted, consistently outperforming single-model outputs in win rate
- **Job interview question generation** — For a senior ML engineer role, three models each generate 10 interview questions. A judge ranks by depth, practical relevance, and difficulty calibration. The top-ranked set is used, producing a more comprehensive question bank than any one model

---

### Pattern 13 — Debate/Deliberation with Arbiter

Structured adversarial debate before a high-stakes decision. Surfaces blind spots neither side would find alone.

```
   Proposal: "Acquire Company X for $500M"
              │
     ┌────────┼────────┐
     ▼        ▼        ▼
┌──────────┐  │  ┌──────────┐     ┌──────────┐
│ ADVOCATE │  │  │ SKEPTIC  │     │  RISK    │
│          │  │  │          │     │ ANALYST  │
│ argues   │  │  │ argues   │     │          │
│   FOR    │  │  │ AGAINST  │     │ quantifies│
└──────────┘  │  └──────────┘     └──────────┘
     │        │        │               │
     └────────┴────────┴───────────────┘
                       │
                ┌─────────────┐
                │   ARBITER   │  scores on rubric:
                │             │    quality:  0.8
                │             │    risk:     0.3  (lower = safer)
                │             │    ROI:      0.7
                └─────────────┘
                       │
                       ▼
              Decision + conditions for revisiting
```

**Token-heavy** — only justified for decisions where the cost of being wrong exceeds the cost of debate. Not for simple factual questions.

**Real-world examples:**
- **Venture capital investment committee** — Advocate agent argues the bull case for a Series B investment. Skeptic agent identifies market timing and execution risks. Risk analyst quantifies downside scenarios. Arbiter scores on IRR potential, team quality, and market size. The VC uses this structured analysis alongside human judgment
- **Enterprise cloud vendor selection** — AWS advocate argues reliability and ecosystem. Azure skeptic highlights vendor lock-in risks. GCP risk analyst prices switching costs. Arbiter scores on 5-year TCO, compliance needs, and team skillset. Procurement uses the debate transcript as the decision audit trail
- **Clinical trial design review** — Efficacy advocate argues the dosing protocol maximizes response. Safety skeptic argues the dose is too aggressive for the patient population. Biostatistics analyst quantifies statistical power. Arbiter (regulatory affairs agent) scores against FDA guidance. Enables non-expert sponsors to stress-test trial design before submission

---

### Pattern 14 — Specialist Swarm with Coordinator

All specialists run at the **same time** (parallel). This is the key difference from Orchestrator/Worker (sequential).

```
  Task: "Review this 200-page contract"
         │
         ▼
  ┌─────────────┐
  │ COORDINATOR │  breaks task into parallel domains
  └─────────────┘
         │
         │ ─────────── fires all simultaneously ───────────
         │
    ┌────┘      ┌───────────┐       ┌────────────┐
    ▼           ▼           ▼       ▼            ▼
┌────────┐ ┌─────────┐ ┌──────────┐
│ LEGAL  │ │ FINANCE │ │ TECHNICAL│   all run in parallel
│ EXPERT │ │ EXPERT  │ │ EXPERT   │   simultaneously
└────────┘ └─────────┘ └──────────┘
    │           │           │
  section1   section2   section3
    │           │           │
    └───────────┴───────────┘
                │
                ▼
         COORDINATOR synthesizes
                │
                ▼
         Unified Report  (3x faster than sequential)
```

**Real-world examples:**
- **M&A due diligence** — Legal specialist reviews IP and litigation risks, Finance specialist reviews EBITDA and working capital, Technical specialist reviews codebase and infrastructure debt, Market specialist reviews competitive positioning — all in parallel. Coordinator assembles the board memo in hours, not weeks
- **Pandemic response modeling** — Epidemiology agent models infection spread, Economics agent models GDP impact, Logistics agent models vaccine supply chain, Policy agent reviews legal authorities — all simultaneously. Coordinator produces a unified national response recommendation
- **Building permit review** — City deploys Structural, Electrical, Plumbing, Fire Safety, and Zoning specialist agents simultaneously on a construction submission. Coordinator merges all findings into a single approval-with-conditions letter in 2 hours vs. the 6-week sequential process

---

### Pattern 15 — Skill Router / Intent-Based Dispatch

A cheap classifier routes each request to the optimal model or tool, saving cost and improving accuracy.

```
  User Input: "What's 15% of $847.50?"
                    │
                    ▼
           ┌──────────────┐
           │    ROUTER    │  (cheap model: gpt-4.1-mini)
           │              │  intent: "calculation"
           │              │  confidence: 0.97
           └──────────────┘
                    │
         ┌──────────┼──────────────────────────┐
         │          │                           │
         ▼          ▼                           ▼
   "retrieval"  "calculation"          "code_generation"
        │              │                        │
   RAG Pipeline   Calculator Tool          gpt-4o + linter
  (gpt-4-mini)   (no LLM needed!)        (strongest model)
   $0.01/call      $0.00/call               $0.05/call
```

**Optimizes cost + latency** by routing simple tasks (math, lookup) to cheap/fast paths and complex tasks (coding, analysis) to powerful models.

**Real-world examples:**
- **Enterprise IT helpdesk** — Router classifies tickets: "password reset" → automated self-service tool (no LLM at all), "software install" → IT knowledge base RAG pipeline, "network outage" → senior IT on-call paging system, "security incident" → SIEM integration agent. 60% of tickets never touch an expensive LLM
- **Banking virtual assistant** — Routes "account balance" → real-time API call, "mortgage rate" → product RAG lookup, "suspicious transaction" → fraud analysis agent (most capable model), "loan application" → underwriting workflow agent. Each path uses the minimum cost appropriate to the risk
- **E-commerce customer chat** — Routes "where's my order" → order tracking API (no LLM), "return policy" → FAQ retrieval, "product recommendation" → personalization model, "damaged item complaint" → empathy-tuned agent + human escalation path. Handles 10× the volume at 40% of the cost

---

## 🅓 Category D — Quality & Safety

---

### Pattern 16 — Self-Correction Retry Loop

An independent evaluator judges the output and feeds specific feedback back into the agent.

```
  User Input
       │
       ▼
  ┌─────────┐
  │  AGENT  │  Model A: gpt-4.1-mini
  └─────────┘
       │
       │ Response (attempt 1)
       ▼
  ┌───────────┐
  │ EVALUATOR │  Model B: gemini-2.5  ← MUST be a different model!
  └───────────┘
       │
       ├─ is_acceptable: True  ──────────────────────▶ Return ✓
       │
       └─ is_acceptable: False
              │
              │ feedback: "Missing citations, conclusion too vague"
              ▼
         ┌──────────────────────────────┐
         │ inject feedback into messages │
         └──────────────────────────────┘
              │
              ▼ retry (attempt 2 of 3)
         ┌─────────┐
         │  AGENT  │  now sees: previous attempt + specific feedback
         └─────────┘
              │
         ... (max 3 retries, then return best attempt)
```

**Critical rules:**
- Never use the same model to evaluate its own output — it will self-approve
- Always set `MAX_RETRIES` — never an unbounded loop

**Real-world examples:**
- **SQL query generator** — Agent generates a SQL query, evaluator runs it against the database, catches the syntax error and feeds back "column `user_id` doesn't exist in `orders` table — use `customer_id`." Agent fixes and retries. Result: queries that actually execute, first-try success rate improved from 60% to 94%
- **Contract clause drafter** — Agent drafts an indemnification clause, evaluator (a legal-specialist LLM) checks for "one-sided liability exposure" and "missing carve-outs for gross negligence." Feedback injected: agent revises with bilateral caps and carve-outs. Prevents clauses that would be rejected in negotiation
- **API integration code generator** — Agent writes Python code to call a third-party API, evaluator runs the code in a sandbox, gets a `401 Unauthorized` error, feeds back "missing Authorization header." Agent adds `headers={"Authorization": f"Bearer {api_key}"}` and retries. 3 rounds of execution → correction produces working code

---

### Pattern 17 — Evaluator-Worker

The most powerful quality pattern. Worker has access to tools and acts; evaluator has no tools but judges and provides structured feedback.

```
 Task: "Research and write a comprehensive report on EV market"
          │
          ▼
   ┌────────────┐   uses tools:
   │   WORKER   │   web_search, read_pdf, run_sql
   └────────────┘
          │
          │ draft report (attempt 1)
          ▼
   ┌────────────┐   structured output:
   │  EVALUATOR │   {
   └────────────┘     feedback: "Missing Asia market data,
          │                      no 5-year projections",
          │           success_criteria_met: false,
          │           needs_human_input: false
          │         }
          │
          ├─ success_criteria_met: true  ──────────────▶ END ✓
          │
          ├─ needs_human_input: true  ──────────────────▶ END (ask user)
          │
          └─ neither
                  │
                  │ inject feedback
                  ▼
           ┌────────────┐
           │   WORKER   │  attempt 2, reads evaluator feedback,
           └────────────┘  goes back to tools for missing data
                  │
                  ... (up to max_iterations)
```

**Real-world examples:**
- **Academic literature review** — Worker searches PubMed, downloads PDFs, synthesizes findings. Evaluator checks: "methodology section missing, only 8 of 12 required papers cited, no discussion of confounding variables." Worker goes back to search and revise. Final output meets journal submission standards without human iteration
- **Security vulnerability assessment** — Worker runs automated scans (SAST, DAST, dependency check), generates findings report. Evaluator checks: "CVSS scores not included, remediation steps missing for 3 findings, no executive summary." Worker re-runs specific scans and augments the report. Produces a client-ready deliverable in one automated run
- **Marketing campaign brief** — Worker researches target audience, competitive landscape, drafts campaign angles. Evaluator checks against brand guidelines: "tone too casual for B2B audience, missing a digital-first channel recommendation, budget allocation doesn't match Q3 priorities." Worker revises with corrected positioning. Brief approved by CMO without a single back-and-forth email

---

### Pattern 18 — Guardrails & Policy Enforcement Layer

Wraps the entire agent in safety filters — both on input and output.

```
┌──────────────────────────────────────────────────────────────────┐
│                       GUARDRAILS SYSTEM                          │
│                                                                  │
│  Raw User Input                                                  │
│      │                                                           │
│      ▼                                                           │
│  ┌────────────────────────────────────────┐                      │
│  │            INPUT GUARDRAIL             │                      │
│  │   Rule-based (fast, cheap):            │                      │
│  │   • PII detection — SSN, email, CC#    │                      │
│  │   • Prompt injection patterns          │                      │
│  │   • Topic blocklist                    │                      │
│  └────────────────────────────────────────┘                      │
│      │ sanitized input (PII redacted)                            │
│      ▼                                                           │
│  ┌───────────────────┐                                           │
│  │    AGENT (LLM)    │  processes safely                         │
│  └───────────────────┘                                           │
│      │ raw agent output                                          │
│      ▼                                                           │
│  ┌────────────────────────────────────────┐                      │
│  │           OUTPUT GUARDRAIL             │                      │
│  │   LLM-based (flexible, higher cost):   │                      │
│  │   • Policy compliance check            │                      │
│  │   • Brand tone enforcement             │                      │
│  │   • Blocked content filter             │                      │
│  │   • Hallucination detection            │                      │
│  └────────────────────────────────────────┘                      │
│      │ safe, policy-compliant output                             │
│      ▼                                                           │
│  User sees clean response                                        │
└──────────────────────────────────────────────────────────────────┘
```

**Two approaches:**
- **Rule-based** (regex, blocklists) — fast and cheap, use for well-defined patterns like PII
- **LLM-based** (small safety model) — flexible, use for nuanced policy enforcement

**Real-world examples:**
- **Healthcare patient portal chatbot** — Input guardrail redacts PHI (patient names, DOB, MRN) before it reaches the LLM. Output guardrail checks: "does this response constitute medical advice beyond the agent's licensed scope?" If so, replaces with "Please consult your physician." Ensures HIPAA compliance without burdening the main LLM with compliance logic
- **Children's online learning platform** — Input guardrail flags any attempt to discuss violence, adult content, or personal information sharing. Output guardrail ensures language stays at appropriate reading level and contains no external links. Both layers together make the platform safe for COPPA compliance without manual content review of every response
- **Financial services robo-advisor** — Input guardrail detects if a user is asking for personalized investment advice beyond the platform's regulatory license. Output guardrail adds mandatory SEC-required disclosures to any response touching specific securities. Prevents the platform from inadvertently acting as an unregistered investment advisor

---

### Pattern 19 — Evals-in-the-Loop & Canary Runs

Never deploy a new agent version without running it through a test suite first.

```
         Agent v1 (production)                  Agent v2 (candidate)
               │                                         │
               │ 95% of traffic                5% of traffic
               │                                         │
               ▼                                         ▼
         Real users                           ┌──────────────────┐
                                              │    EVAL SUITE    │
                                              │                  │
                                              │  accuracy:  ✓    │
                                              │  p95 latency: ✓  │
                                              │  cost/task:  ✓   │
                                              │  violations: ✓   │
                                              │  tool errors: ✓  │
                                              └──────────────────┘
                                                       │
                                          ┌────────────┴────────────┐
                                          │                         │
                                          ▼                         ▼
                                     PASS all checks?         FAIL any check?
                                          │                         │
                                          ▼                         ▼
                                    Gradual rollout:          Auto-rollback
                                    5% → 25% → 100%          to v1 instantly
```

**Track these metrics:** accuracy, p50/p95 latency, cost per task, tool failure rate, policy violations.

**Real-world examples:**
- **Search ranking AI** — Google-style teams route 5% of queries to a new ranking model. Eval suite measures click-through rate, session length, and zero-result rate vs. baseline. If any metric degrades beyond threshold in the first 24h, traffic automatically reverts to the previous model. Enables weekly model updates with zero user-facing outages
- **Customer service bot upgrade** — A telecom company routes 5% of support chats to the new LLM version. Eval suite measures resolution rate, CSAT score (via post-chat survey), average handle time, and escalation rate. A regression in escalation rate auto-triggers rollback and pages the ML team. 12 sequential canary deployments over 3 months, zero production incidents
- **Recommendation engine** — E-commerce platform sends 5% of homepage impressions to a new recommendation model. Eval suite measures add-to-cart rate, revenue per session, and diversity score (to avoid filter bubbles). The canary must beat baseline on all three before traffic increases. A/B test runs for 2 weeks to account for weekend/weekday behavioral differences

---

## 🅔 Category E — Memory & State

---

### Pattern 20 — Memory Patterns

Five types of memory, each with a different scope and storage mechanism.

```
┌──────────────────────────────────────────────────────────────────────┐
│                          MEMORY TYPES                                │
│                                                                      │
│  SHORT-TERM              ──────────── Single session only            │
│  [msg1, msg2, msg3...]   message list grows during conversation      │
│                          lost when session ends                      │
│                                                                      │
│  CROSS-TURN              ──────────── Multiple invocations           │
│  checkpoint + thread_id  agent pauses & resumes, full state saved    │
│                          "What did I say earlier?" works             │
│                                                                      │
│  LONG-TERM               ──────────── Across sessions                │
│  SQLite / vector store   "Last month you asked about competitor X"   │
│                          survives restarts, persists indefinitely    │
│                                                                      │
│  ENTITY                  ──────────── Named entities                 │
│  RAG store               "Customer: Acme Corp                        │
│                           plan: Enterprise, status: churning"        │
│                          consistent across all agents in system      │
│                                                                      │
│  EPISODIC                ──────────── Task history                   │
│  reflection store        lessons from past runs (used by Reflexion)  │
│                          "Last time I missed Asia data — check it"   │
└──────────────────────────────────────────────────────────────────────┘
```

**Real-world examples:**
- **Personal AI executive assistant** — Short-term memory holds the current meeting's context. Cross-turn memory persists the draft email across a 3-step editing conversation. Long-term memory remembers "this executive prefers bullet points, hates jargon, and never schedules before 9am." All three layers work simultaneously
- **Multi-agent customer support platform** — Entity memory stores a canonical customer profile (plan, lifetime value, past issues, NPS score) shared across the Billing, Technical, and Retention agents. Whichever agent the customer reaches, they never have to re-explain their history. Entity store updated in real-time by any agent
- **AI tutoring system** — Episodic memory stores which problems the student got wrong and what misconceptions were identified per session. Next session, the tutor agent loads past errors and explicitly revisits those concepts before introducing new material, implementing spaced repetition automatically

---

### Pattern 21 — Event-Driven / Long-Running Agents

Agents that sleep and wake up when something happens, persisting state across weeks or months.

```
  ┌───────────────────────────────────────────────────────────────┐
  │                    EVENT-DRIVEN LIFECYCLE                      │
  │                                                               │
  │  Trigger sources:                                             │
  │    webhook  ──┐                                               │
  │    cron job  ─┼──▶  AGENT WAKES UP                           │
  │    message Q ─┘          │                                    │
  │                          ▼                                    │
  │                  ┌───────────────┐                            │
  │                  │  LOAD STATE   │  from checkpoint DB         │
  │                  └───────────────┘                            │
  │                          │                                    │
  │                          ▼                                    │
  │                  ┌───────────────┐                            │
  │                  │ PROCESS EVENT │  LLM + tools               │
  │                  └───────────────┘                            │
  │                          │                                    │
  │                          ▼                                    │
  │                  ┌───────────────┐                            │
  │                  │  SAVE STATE   │  checkpoint for next wake   │
  │                  └───────────────┘                            │
  │                          │                                    │
  │                          ▼                                    │
  │                     AGENT SLEEPS  💤                          │
  └───────────────────────────────────────────────────────────────┘
```

**Use cases:** inbox watchers, nightly review agents, SLA monitors, scheduled data pipelines.
**Tools:** Use Temporal or Prefect for fault-tolerant durable execution across weeks/months.

**Real-world examples:**
- **Stock price alert agent** — Runs as a long-lived daemon, sleeping until a price crosses a configured threshold (webhook from market data feed). Wakes up, loads the user's portfolio context, generates a natural-language alert with recommended action, pushes a notification, saves updated state including what was alerted and when, goes back to sleep. Handles thousands of users' portfolios simultaneously
- **GitHub PR review agent** — Triggered by `pull_request` webhook events. Loads repository coding standards and the PR author's past feedback patterns from checkpoint. Reviews the diff, posts inline comments, saves a summary of issues found. Sleeps until the next `push` event on the same PR, then loads previous review state and checks if issues were addressed before re-approving
- **SLA breach monitor** — Runs on a 15-minute cron. Wakes up, loads the current open support tickets and their SLA deadlines, identifies tickets approaching breach, sends proactive alerts to team leads, saves state to avoid re-alerting for the same ticket. Has been running continuously for 14 months, accumulating 50MB of checkpoint data tracking 200,000+ ticket events

---

### Pattern 22 — Knowledge Graph-Augmented Agents

Combines structured entity-relationship data with LLM reasoning for precise, hallucination-resistant answers.

```
  Question: "Which drugs interact with Drug X in patients with kidney disease?"
                              │
                              ▼
              ┌──────────────────────────┐
              │    ENTITY EXTRACTION     │
              │  finds: Drug X,          │
              │         kidney disease   │
              └──────────────────────────┘
                              │
                              ▼
              ┌──────────────────────────────────────┐
              │          KNOWLEDGE GRAPH              │
              │                                      │
              │   Drug X ──interacts_with──▶ Drug Y  │
              │   Drug X ──contraindicated──▶ CKD    │
              │   Drug Y ──metabolized_by──▶ CYP3A4  │
              │   CKD    ──impairs──────────▶ CYP3A4 │
              └──────────────────────────────────────┘
                              │ structured facts (not text blobs)
                              ▼
              ┌──────────────────────────────────────┐
              │              LLM                      │
              │  reasons over facts:                  │
              │  "Drug Y is contraindicated because   │
              │   it's metabolized by CYP3A4, which   │
              │   is impaired by kidney disease.      │
              │   Source: Drug X→Drug Y→CYP3A4→CKD"  │
              └──────────────────────────────────────┘
```

The LLM doesn't guess — it reasons over facts with full provenance. Critical in pharma, compliance, and manufacturing.

**Real-world examples:**
- **Pharmaceutical clinical decision support** — Hospital deploys a drug interaction checker where the KG contains 2.4 million drug-drug and drug-disease relationships from FDA databases. When a physician orders a new medication, the agent traverses the KG for the patient's current meds and conditions, explains exactly which metabolic pathway causes the interaction, and cites the specific FDA warning. Zero hallucinated interactions; every alert is traceable to a KG edge
- **Supply chain disruption analysis** — A manufacturer's KG maps supplier → component → sub-assembly → product → customer relationships. When a news event mentions "factory fire in Taiwan," the agent queries the KG to find which components come from that region, which products those components feed into, and which customers will be impacted. Generates a prioritized impact report in minutes that would take a human analyst 2 days
- **Regulatory compliance mapping** — A fintech company's KG maps regulation → rule → control → evidence requirement relationships across 12 jurisdictions. When a new regulation is published, the agent traverses the KG to find which existing controls satisfy new requirements, which create gaps, and which products are affected. Reduces compliance gap analysis from 3 weeks to 4 hours

---

### Pattern 23 — Human-in-the-Loop

Three modes for bringing a human into the agent's decision process.

```
MODE 1: EVALUATOR FLAG  (simplest — no special interrupt needed)
─────────────────────────────────────────────────────────────────
  Worker ──▶ Evaluator
               │
               └─ needs_human_input: true
                          │
                          ▼
                    EXIT graph to UI
                    User sees question, types response
                          │
                          ▼
                    RESUME — next invoke() call
                    continues with user's response in messages


MODE 2: CHECKPOINT-BASED  (for long reviews)
─────────────────────────────────────────────
  Agent runs ──▶ saves full state ──▶ PAUSE
                                         │
                              Human reviews checkpoint
                              (can take hours/days)
                                         │
                              RESUME from exact saved state


MODE 3: APPROVAL GATE  (for high-risk actions)
────────────────────────────────────────────────
  Agent: "I'm about to delete 10,000 customer records from DB"
                       │
                       ▼
               ┌───────────────┐
               │   APPROVE?    │  Human must explicitly say yes
               └───────────────┘
                       │
             ┌─────────┴──────────┐
             ▼                    ▼
        Yes → proceed         No → abort / revise plan
```

**Real-world examples:**
- **AI-assisted radiology** — Agent analyzes a chest CT, identifies a 6mm nodule, generates a report draft, then sets `needs_human_input: true` because the nodule is in an ambiguous borderline size range. The radiologist's worklist dashboard shows the draft report with the flagged region highlighted. Radiologist confirms or corrects the finding; agent finalizes the report. Human time per scan drops from 20 minutes to 4 minutes
- **Legal contract review with approval gates** — Agent autonomously redlines 80% of clauses (standard deviations). Before accepting any clause that involves indemnification caps or IP ownership, it surfaces an approval gate: "Proposed change to §8.3 Indemnification: [original] → [proposed]. This increases our liability exposure by $2M. Approve?" Attorney clicks approve or rejects with a comment. Agent resumes
- **Autonomous DevOps with checkpoint review** — Agent identifies and implements a database index optimization. Before running `ALTER TABLE` on the production database (which would lock the table for 45 minutes at peak hours), it saves its full plan as a checkpoint and sends a Slack message: "Ready to run optimization. Recommend scheduling during 2am maintenance window. React ✅ to proceed." Agent resumes from saved checkpoint when a human reacts

---

### Pattern 24 — Structured Output

Force the LLM to return machine-readable, typed data instead of free text.

```
  WITHOUT Structured Output:              WITH Structured Output:
  ──────────────────────────              ──────────────────────────

  LLM returns freetext:                   LLM returns Pydantic model:

  "The answer seems acceptable            {
   but could be improved by                 "is_acceptable": false,
   adding more detail about                 "feedback": "Add citations,
   the topic. I would suggest                expand section 2 with data",
   revising section 2..."                    "score": 0.6
                                          }
        │                                        │
        │ parse with regex? 😬                   │ .parsed ✓
        │ guess True/False?                      │ always valid, typed
        ▼                                        ▼
   Fragile routing                        Reliable routing
   breaks in production                   works every time


  class EvaluationResult(BaseModel):
      is_acceptable: bool
      feedback: str = Field(description="Specific improvement suggestions")
      score: float  = Field(ge=0, le=1)

  response = client.beta.chat.completions.parse(
      model="gpt-4.1-mini",
      messages=[...],
      response_format=EvaluationResult   # ← enforced by API
  )
  result = response.choices[0].message.parsed
  # result.is_acceptable is guaranteed to be a bool
```

**Always use `Field(description=...)` on every field** — the description is included in the JSON schema and significantly improves output quality.

**Real-world examples:**
- **Appointment booking agent** — Returns `AppointmentResult(date="2026-03-15", time="14:30", provider_id="dr_chen_42", confirmation_code="APT-7821", prep_instructions=["Fast for 4 hours", "Bring insurance card"])`. Downstream calendar and reminder systems read typed fields directly — no parsing of "Your appointment is confirmed for March 15th at 2:30pm with Dr. Chen"
- **Resume screening pipeline** — Returns `ScreeningResult(score=0.82, recommendation="phone_screen", reasons=["7 years relevant exp", "Python + ML skills match"], concerns=["No fintech background"], next_action="schedule_call")`. ATS system reads `recommendation` as a typed enum to route the candidate into the right hiring stage automatically, zero string parsing
- **Real-time fraud detection** — Returns `FraudDecision(is_fraud=True, confidence=0.94, rule_triggered="velocity_check", recommended_action="block_and_alert", evidence=["3 transactions in 90 seconds", "3 different countries", "amount 8x average"])`. Payment gateway reads `is_fraud` as a boolean to block the transaction in under 50ms. The typed `recommended_action` triggers the correct downstream workflow without any NLP parsing

---

## 🗺️ How All 24 Patterns Relate

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          ALL 24 PATTERNS                                 │
│                                                                          │
│  FOUNDATION                                                              │
│  └── Agentic Loop  ◀── all patterns build on this                       │
│                                                                          │
│  REASONING STYLE             what the agent "thinks"                     │
│  ├── Tool Dispatch           how to route tool calls                     │
│  ├── Reflexion               learn from past sessions                    │
│  ├── Tree-of-Thought         explore many paths, pick best               │
│  ├── Self-Consistency        reduce variance via voting                  │
│  └── Scratchpad              hide raw reasoning from user                │
│                                                                          │
│  TASK PLANNING               how work is broken down                     │
│  ├── Planner-Executor        LLM plans, cheap model executes             │
│  ├── Code-as-Orchestrator    Python plans, LLMs execute                  │
│  ├── Workflow DAG            states + transitions, fully deterministic   │
│  └── Constraint Planning     checklist + compliance gates                │
│                                                                          │
│  AGENT COLLABORATION         how agents work together                    │
│  ├── Orchestrator/Worker     manager + workers, control returns          │
│  ├── Handoff Chain           baton passed permanently                    │
│  ├── Fan-Out + Judge         parallel answers, best picked               │
│  ├── Debate/Arbiter          advocate vs skeptic, arbiter decides        │
│  ├── Specialist Swarm        parallel domain experts + coordinator       │
│  └── Skill Router            classify intent → best agent/tool           │
│                                                                          │
│  QUALITY ENFORCEMENT         how output is validated                     │
│  ├── Self-Correction         inline retry with feedback                  │
│  ├── Evaluator-Worker        iterative refinement loop                   │
│  ├── Guardrails              I/O safety filters                          │
│  └── Evals + Canary          test before deploy, auto-rollback           │
│                                                                          │
│  STATE MANAGEMENT            how memory and state are handled            │
│  ├── Memory Patterns         short/long/entity/episodic                  │
│  ├── Event-Driven Agents     sleep/wake on events, durable state         │
│  ├── Knowledge Graph         structured facts + LLM reasoning            │
│  ├── Human-in-the-Loop       approval gates + checkpoints                │
│  └── Structured Output       typed LLM responses, reliable routing       │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Decision Cheat Sheet

```
What's your situation?                        →  Pattern to use
────────────────────────────────────────────────────────────────────────
Need a tool-using autonomous agent            →  Agentic Loop + Tool Dispatch
Want diverse, high-quality output             →  Fan-Out + Judge
Output must meet specific criteria            →  Self-Correction Retry
Need iterative quality improvement            →  Evaluator-Worker
Complex task, need intelligent planning       →  Planner-Executor Split
Simple fixed pipeline, stay predictable       →  Code-as-Orchestrator
High-stakes decision with trade-offs          →  Debate / Arbiter
Specialists needed, work in parallel          →  Specialist Swarm
Mixed user intents, route to best tool        →  Skill Router
Compliance / regulated workflow               →  Constraint/Checklist Planning
Need content safety & PII protection          →  Guardrails Layer
Multi-turn conversation state                 →  Memory (checkpointing)
Agent monitors events, runs on schedule       →  Event-Driven Agent
Relational / multi-hop queries                →  Knowledge Graph + LLM
Deploy safely to production                   →  Evals + Canary Runs
Explore multiple reasoning paths              →  Tree-of-Thought
Learn from past mistakes across sessions      →  Reflexion
Reduce variance in uncertain answers          →  Self-Consistency Voting
Hide raw reasoning from end users             →  Deliberate Scratchpad
Human must approve before action              →  Human-in-the-Loop
```

---

## 🔗 Common Pattern Combinations

| System | Patterns Combined |
|--------|------------------|
| **Research pipeline** | Code-as-Orchestrator + Fan-Out + Evaluator-Worker + Structured Output |
| **Customer support** | Handoff Chain + Skill Router + Human-in-the-Loop + Memory + Guardrails |
| **Code generation** | Self-Correction Retry + Tool Dispatch + Structured Output + Constraint Planning |
| **Content creation** | Fan-Out + Judge + Code-as-Orchestrator + Structured Output |
| **DevOps incident response** | Specialist Swarm + Tool Dispatch + Human-in-the-Loop + Guardrails |
| **Compliance audit** | Constraint Planning + Guardrails + Structured Output + Knowledge Graph |
| **High-stakes decisions** | Debate/Arbiter + Tree-of-Thought + Human-in-the-Loop |
| **Enterprise automation** | Skill Router + Event-Driven + Guardrails + Evals-in-the-Loop + Memory |

---

## ⚠️ Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Same model evaluates its own output | Self-approval bias — always passes | Use a different model for evaluation |
| No MAX_RETRIES on correction loops | Infinite loops, runaway API costs | Always set a retry limit |
| Prepending a new system message each turn | Context window pollution | Upsert system message in-place |
| LLM deciding orchestration when flow is fixed | Unnecessary cost and unpredictability | Use Code-as-Orchestrator |
| Handoff when you need the result back | Control never returns | Use `as_tool()` instead |
| Fan-out with the same model for all branches | No diversity, no benefit | Use different models |
| Debate/Arbiter for simple factual questions | Token-heavy overkill | Reserve for genuinely hard trade-offs |
| Giant context injection exceeding window | Truncation, degraded quality | Switch to RAG with vector store |
| No structured output on evaluation steps | Fragile text parsing for routing | Always use Pydantic `response_format` |
