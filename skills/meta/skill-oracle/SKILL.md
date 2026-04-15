---
name: skill-oracle
description: >
  Graph-routed skill discovery and activation. Given any task, queries the
  goatedskills knowledge graph to find the most relevant skills, installs
  any that are missing locally, and returns their SKILL.md paths for loading.
  Use when: asked "do we have a skill for X?", "find a skill for X",
  "what skill should I use?", or when a capability gap is detected mid-task.
  Also invoked as preflight routing — analyzing a prompt to determine which
  skills would create the highest-impact output.
argument-hint: "<task description or capability query>"
context: fork
allowed-tools: Bash, Read, Write
related_skills: [find-local-skills, find-skills, skill-creator, sync-skills]
---

# skill-oracle: Graph-Routed Skill Discovery

Find and activate the right skills for any task using the goatedskills
knowledge graph. One invocation — sync, query, install, return.

## Architecture

```
goatedskills repo (GitHub: itsAR-VR/goatedskills)
├── skills/                    ← 290+ skill directories
├── graphify-out/graph.json    ← knowledge graph (nodes + edges + communities)
└── scripts/                   ← query + incremental update tools

Local clone syncs bidirectionally. The graph.json is the routing index.
Skills are copied to ~/.claude/skills/ on demand.
```

## How to Invoke

```
skill-oracle "help me write a cold email"
skill-oracle "refactor auth and review code"
skill-oracle "build a landing page with pricing"
```

Or invoke automatically as preflight routing on any non-trivial task.

## Execution Flow

Follow these steps in order. Do not skip steps.

### Step 1 — Locate the goatedskills repo

```bash
if [ -d "$HOME/Desktop/Codespace/goatedskills" ]; then
  REPO="$HOME/Desktop/Codespace/goatedskills"
elif [ -d "$HOME/.openclaw/workspace/goatedskills" ]; then
  REPO="$HOME/.openclaw/workspace/goatedskills"
else
  echo "ERROR: goatedskills repo not found"
  exit 1
fi
echo "REPO=$REPO"
```

### Step 2 — Sync the repo (pull latest, additive only)

```bash
cd "$REPO" && git pull --ff-only origin main 2>&1 | tail -3
```

If `--ff-only` fails, try `git pull --rebase origin main`.

This ensures the local graph.json and skills are up to date with the remote.

### Step 3 — Query the graph

Run the query script with the task description:

```bash
cd "$REPO" && python3 scripts/query-skill-graph.py "TASK_DESCRIPTION_HERE" --top 5 --json
```

Replace `TASK_DESCRIPTION_HERE` with the actual task or prompt being analyzed.

The script returns JSON:
```json
[
  {
    "skill": "cold-email",
    "score": 18.5,
    "match_type": "direct",
    "community": "Marketing & Content",
    "path": "skills/cold-email/SKILL.md"
  }
]
```

### Step 4 — Select the highest-impact skills

From the query results:

1. **Take all direct matches with score >= 3.0** — these are relevant
2. **Take neighbor matches with score >= 2.0** — these add value
3. **Cap at 5 total skills** — more than 5 creates noise, not value
4. **Prefer diversity** — if all matches are from one community, check if the task spans multiple domains

### Step 5 — Install missing skills locally

For each selected skill, check if it exists in `~/.claude/skills/`:

```bash
SKILL_NAME="the-skill-name"
REPO="/path/to/goatedskills"

if [ ! -d "$HOME/.claude/skills/$SKILL_NAME" ]; then
  cp -r "$REPO/skills/$SKILL_NAME" "$HOME/.claude/skills/$SKILL_NAME"
  echo "INSTALLED $SKILL_NAME → ~/.claude/skills/$SKILL_NAME"
fi
```

Also distribute to other consumers if they exist:

```bash
for CONSUMER in "$HOME/.codex/skills" "$HOME/.agents/skills"; do
  if [ -d "$CONSUMER" ] && [ ! -d "$CONSUMER/$SKILL_NAME" ]; then
    cp -r "$REPO/skills/$SKILL_NAME" "$CONSUMER/$SKILL_NAME"
  fi
done
```

### Step 6 — Return results

Report the selected skills to the caller:

```
## Skill Oracle Results

### Selected Skills (by relevance)
| Skill | Score | Community | Status |
|-------|-------|-----------|--------|
| cold-email | 18.5 | Marketing | already installed |
| email-sequence | 3.5 | Marketing | INSTALLED |
| copywriting | 4.5 | Marketing | already installed |

### Load These Skills
Read and follow these SKILL.md files for the task:
1. ~/.claude/skills/cold-email/SKILL.md
2. ~/.claude/skills/email-sequence/SKILL.md
3. ~/.claude/skills/copywriting/SKILL.md
```

## When No Match Is Found

If the query returns no results with score >= 3.0:

1. Check the graph report for related communities:
   ```bash
   head -30 "$REPO/graphify-out/GRAPH_REPORT.md"
   ```

2. If still no match, suggest creating a new skill:
   > No existing skill matches this task. Consider using `skill-creator` to build one,
   > or `find-skills` to search external registries (skills.sh, ClawHub).

## Graph Maintenance

The graph grows incrementally. When new skills are added:

```bash
cd "$REPO" && python3 scripts/add-skill-to-graph.py NEW_SKILL_NAME
```

This adds the skill as a node + edges to the existing graph.json.
No rebuild needed — the graph only grows.

## Relationship to Other Skills

| Skill | Purpose | When to Use Instead |
|-------|---------|---------------------|
| **find-local-skills** | Preflight task→skill router | Thin routing, delegates here for complex matches |
| **find-skills** | External skill discovery | When no local skill matches and you need something new |
| **sync-skills** | Bidirectional repo sync | Run manually or let skill-oracle sync on first call |
| **skill-creator** | Build a new skill | When no skill exists for the task |

## Notes

- **Additive only**: skill-oracle never deletes skills — it only installs missing ones
- **Graph is source of truth**: The graphify-out/graph.json in the goatedskills repo
  contains all skill relationships and community groupings
- **No rebuild needed**: New skills are appended via add-skill-to-graph.py
- **Cross-platform**: Works on macOS and Linux — auto-detects repo location
