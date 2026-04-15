---
name: openclaw-skills-bank
description: Set up and maintain the shared skills bank across all OpenClaw agent workspaces.
category: meta
---

# OpenClaw Skills Bank

## When to Use
- Setting up a new agent workspace
- Adding a new reusable skill after a build
- Syncing skills to all agents after update

## Structure
- Active skills: `~/.openclaw/workspace/.agents/skills/` — 90+ dirs, each with SKILL.md
- Index: `~/.openclaw/workspace/.agents/skills-index.md` — full searchable list
- GitHub repo: KingIcy101/agent-skills — canonical source of truth
- Extended bank: 447+ skills from goatedskills, catalogued in skills-extended-index.json

## Adding a New Skill (Manual)
```bash
bash ~/.openclaw/workspace/scripts/auto-skill.sh \
  --name "skill-name" \
  --category "dev|design|sales|business|itp|infra|meta" \
  --description "one sentence" \
  --content "$(cat /path/to/SKILL.md)"
```
This saves to workspace AND pushes to GitHub in one step.

## Syncing Index to All Agents
```bash
python3 ~/.openclaw/workspace/scripts/rebuild-skills-index.py
```
Rebuilds skills-index.md/json and copies to all 9 agent workspaces.

## Auto-Learning (Daily Cron)
skill-extractor.js runs at 2am ET, reads that day session log, detects patterns, generates SKILL.md via Claude, pushes automatically.

## Gotchas
- Agents only see skills that were in their workspace at session start — new skills need a fresh session
- No URLs in Telegram (any URL auto-embeds)
- Extended bank (goatedskills) is on disk but not in active list — search skills-index.md first

