---
name: skill-creator
description: >
  Create, update, and validate skills that extend Claude's capabilities with
  specialized knowledge, workflows, and tool integrations. Use when users want
  to create a new skill, make a skill, build a skill, update an existing skill,
  or ask "how do I write a skill." Covers YAML frontmatter, progressive disclosure,
  instruction design, and validation.
metadata:
  author: anthropic-community
  version: 2.0.0
source: anthropics/skills
license: Apache-2.0
related_skills: [skill-judge, find-local-skills, find-skills, skill-oracle, agent-md-refactor]
---

# Skill Creator

Create modular skill packages that extend Claude's capabilities. This skill encodes
the official Anthropic skill authoring standards.

## When to Use

- User says "create a skill", "make a new skill", "build a skill"
- User says "update this skill", "improve this skill", "fix this skill"
- User asks "how do I write a skill?" or "what makes a good skill?"
- User wants to package specialized knowledge for reuse
- User wants to validate an existing skill against best practices

## Core Principles

### 1. Concise is Key
The context window is shared. Only add context Claude doesn't already have.
Challenge each line: "Does Claude really need this?"

### 2. Progressive Disclosure
Content loads in layers — only pay for what you use:

| Layer | When Loaded | What Goes Here |
|-------|------------|----------------|
| **Frontmatter** (name + description) | Always (routing decisions) | WHAT it does + WHEN to trigger |
| **SKILL.md body** | When skill is relevant | Core instructions, workflow, examples |
| **references/** | On demand (agent reads when needed) | Detailed docs, templates, API specs |

### 3. Composability
Skills share context with other skills and system prompts. Never assume
exclusive access. Keep state minimal and instructions self-contained.

---

## Skill Anatomy

```
skill-name/           ← kebab-case, matches frontmatter `name`
├── SKILL.md           ← required (case-sensitive, exactly this name)
├── scripts/           ← optional: executable code
├── references/        ← optional: detailed documentation
└── assets/            ← optional: templates, images
```

### File Rules (Hard)
- File must be exactly `SKILL.md` (not `skill.md`, not `Skill.md`)
- Folder name must be kebab-case and match the `name` field in frontmatter
- **No README.md** inside skill folders (skills are for agents, not humans)
- No `CHANGELOG.md` or `INSTALLATION_GUIDE.md`
- No "claude" or "anthropic" in the folder name
- Keep SKILL.md under 500 lines; split longer content into `references/`

---

## YAML Frontmatter (Most Critical)

The frontmatter is **always loaded** for routing decisions. Get this right.

```yaml
---
name: my-skill-name
description: >
  [What it does in one sentence]. Use when [trigger phrases the user would say].
  Also activated by [additional triggers]. Covers [key capabilities].
  For [related task], see [other-skill].
metadata:
  author: your-name
  version: 1.0.0
---
```

### Frontmatter Rules

| Field | Required | Rules |
|-------|----------|-------|
| `name` | ✅ | kebab-case, must match folder name |
| `description` | ✅ | Under 1024 chars. Must include WHAT + WHEN (trigger phrases). No XML angle brackets. |
| `metadata.author` | Recommended | Who created/maintains this skill |
| `metadata.version` | Recommended | Semantic version |
| `source` | Optional | Attribution (e.g., `anthropics/skills`) |
| `license` | Optional | License identifier |

### Description Formula

```
[What it does] + [When to use it / trigger phrases] + [Key capabilities] + [Cross-references]
```

**Good example:**
```yaml
description: >
  Generate, edit, and iterate on images using Google Imagen 3. Use when the user
  asks to generate, create, draw, design, or edit an image, or mentions "image
  generation." Covers photography, illustrations, logos, and multi-turn refinement.
  For OpenAI image generation, see openai-image-gen.
```

**Bad example:**
```yaml
description: Image generation tool for various use cases.
```
Why bad: No trigger phrases, no specifics, agent can't route to it.

### Anti-Pattern: XML in Frontmatter

```yaml
# ❌ BAD — angle brackets break YAML parsing
description: Use <tool> for <task>

# ✅ GOOD — describe without angle brackets
description: Use the browser tool for web automation tasks
```

---

## Three Skill Categories

Design your skill around one of these patterns:

### 1. Document/Asset Creation
Creates files, reports, or content with consistent quality.

**Key elements:** Style guides, templates, quality checklists, output format specs.

**Example:** A skill that generates changelogs from git commits with a specific format.

### 2. Workflow Automation
Guides Claude through multi-step processes with validation gates.

**Key elements:** Step-by-step instructions, decision points, validation checks,
iterative loops ("repeat until quality bar met").

**Example:** A skill that reviews PRs by checking security, performance, and style.

### 3. MCP Enhancement
Coordinates MCP tool calls with domain expertise.

**Key elements:** Tool call sequences, parameter guidance, error interpretation,
domain-specific prompting around raw tool output.

**Example:** A skill that wraps `mcporter call` with knowledge of when to use
which MCP server and how to interpret results.

---

## Writing Instructions

### Be Specific and Actionable

```markdown
# ❌ Vague
Validate the data before processing.

# ✅ Specific
Run `jsonschema validate --schema schema.json --instance data.json`.
If validation fails, extract the error path and message, then fix the
specific field before retrying.
```

### Include Error Handling

Every skill should have a troubleshooting section with cause → fix pairs:

```markdown
## Troubleshooting

### Script fails with "permission denied"
- **Cause:** Script not marked executable
- **Fix:** Run `chmod +x scripts/generate.sh` and retry

### API returns 429 (rate limited)
- **Cause:** Too many requests in short window
- **Fix:** Wait 60 seconds, then retry with exponential backoff
```

### Provide Concrete Examples

Use the pattern: **User says X → Actions taken → Result**

```markdown
## Examples

### Example 1: User asks to create a weather skill
**User says:** "Create a skill that checks the weather"

**Actions:**
1. Create `weather/SKILL.md` with frontmatter
2. Write description with trigger phrases ("what's the weather", "temperature in")
3. Add workflow: parse location → call wttr.in → format response
4. Add error handling for invalid locations

**Result:** A working skill at `weather/SKILL.md` that triggers on weather queries
and returns formatted forecasts.
```

### Reference Bundled Resources Explicitly

```markdown
# ❌ Implicit
See the template for details.

# ✅ Explicit
See [references/api-template.md](references/api-template.md) for the full
API response template.
```

---

## Skill Creation Process

### Step 1: Gather Requirements
Ask the user:
- "What should this skill do?"
- "What would a user say that should trigger it?"
- "What tools or APIs does it use?"
- "Are there related skills it should cross-reference?"

### Step 2: Design the Structure
Decide on:
- **Category:** Document creation, workflow automation, or MCP enhancement?
- **Frontmatter:** Name, description with triggers, metadata
- **Body structure:** What sections are needed?
- **Resources:** Any scripts, templates, or reference docs?

### Step 3: Write the Frontmatter
Start with the frontmatter. Get the description right first — it's the most
critical part because it controls routing.

Use the description formula:
```
[What it does] + [When to use / trigger phrases] + [Capabilities] + [Cross-refs]
```

### Step 4: Write the Body
Structure with clear sections:
1. **When to Use** — expand on triggers from the description
2. **Workflow** — step-by-step instructions
3. **Examples** — user says X → result Z
4. **Troubleshooting** — common errors with fixes
5. **Related Skills** — cross-references

### Step 5: Add Resources (if needed)
- **scripts/** — executable code the skill references
- **references/** — detailed documentation, templates, API specs
- **assets/** — images, data files

### Step 6: Validate
Run through the validation checklist (below).

### Step 7: Iterate
Use the skill on real tasks. Notice where Claude struggles. Improve.

---

## Validation Checklist

Before finalizing any skill, verify:

### Frontmatter
- [ ] `name` is kebab-case and matches the folder name
- [ ] `description` is under 1024 characters
- [ ] `description` includes WHAT it does AND WHEN to use it (trigger phrases)
- [ ] No XML angle brackets (`<`, `>`) in the description
- [ ] `metadata.version` is present

### File Structure
- [ ] File is named exactly `SKILL.md` (case-sensitive)
- [ ] No `README.md` in the skill folder
- [ ] Folder name is kebab-case
- [ ] No "claude" or "anthropic" in the folder name
- [ ] SKILL.md is under 500 lines (or has references/ for overflow)

### Content Quality
- [ ] Has a step-by-step workflow or clear process
- [ ] Has at least one concrete example (user says → actions → result)
- [ ] Has an error handling / troubleshooting section
- [ ] References to bundled files use explicit paths
- [ ] Doesn't assume exclusive context (composable with other skills)
- [ ] Cross-references related skills where appropriate

---

## Common Mistakes (Anti-Patterns)

| Anti-Pattern | Why It's Bad | Fix |
|-------------|-------------|-----|
| Vague description without triggers | Agent can't route to the skill | Add "Use when user says..." with specific phrases |
| Monolithic SKILL.md (500+ lines) | Burns context on every load | Move detailed docs to `references/` |
| No error handling section | Agent gets stuck on failures | Add troubleshooting with cause → fix |
| Assuming exclusive context | Breaks when loaded with other skills | Keep state minimal, instructions self-contained |
| README.md inside skill folder | Skills are for agents, not humans | Delete it |
| XML brackets in frontmatter | Breaks YAML parsing | Rewrite without `<` `>` |
| Description over 1024 chars | May be truncated | Tighten to essentials |
| Generic examples | Agent doesn't learn the pattern | Use specific "User says X → Result Z" format |

---

## Quick Reference: Minimal Skill Template

```markdown
---
name: my-skill
description: >
  [One sentence: what it does]. Use when the user asks to [trigger 1],
  [trigger 2], or mentions [trigger 3]. Covers [capability list].
  For [related task], see [other-skill].
metadata:
  author: your-name
  version: 1.0.0
---

# My Skill

## When to Use
- User says "[trigger phrase 1]"
- User says "[trigger phrase 2]"
- User mentions [keyword]

## Workflow
1. [Step 1 with specific action]
2. [Step 2 with specific action]
3. [Step 3 with validation]

## Examples

### Example: [Scenario]
**User says:** "[exact phrase]"
**Actions:** [what the skill does]
**Result:** [what the user gets]

## Troubleshooting

### [Common error]
- **Cause:** [why it happens]
- **Fix:** [how to resolve]

## Related Skills
- **[skill-name]**: For [related task]
```
