---
name: screenshot-to-code
description: >
  Convert screenshots, mockups, Figma designs, or UI images into clean functional code
  (HTML/Tailwind, React, Vue, Bootstrap) using AI. Use when the user says "convert this
  screenshot to code", "turn this mockup into HTML", "screenshot to code", "image to code",
  "generate code from this design", "UI from screenshot", or "code this UI". Covers all
  output stacks and auto-manages the local backend service. For subagents: use the s2c.py
  CLI wrapper at the integration path. For browser UI, start the service and open localhost:5173.
metadata:
  author: podhi
  version: 1.0.0
  upstream: https://github.com/abi/screenshot-to-code
  license: MIT
related_skills:
  - frontend-design
  - frontend-coding-agent
  - react-dev
  - ui-skills
  - artifacts-builder
routing:
  domain_keywords:
    - screenshot
    - mockup
    - figma
    - image
    - convert
    - replicate
    - clone
    - pixel
    - faithful
    - recreation
  intent_patterns:
    - "(?:convert|turn|replicate|clone|recreate|match)\\s+(?:this\\s+)?(?:screenshot|mockup|design|image|figma)"
    - "(?:build|code|implement)\\s+(?:from\\s+)?(?:this\\s+)?(?:screenshot|mockup|design|image)"
  lane: codex-worker
  task_type: coding-frontend
---

# Screenshot to Code

Converts screenshots, UI mockups, and Figma designs into functional code using AI.
Powered by [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) (MIT).

## Quick Reference

| What | Path |
|------|------|
| Repo | `/home/podhi/.openclaw/workspace/integrations/screenshot-to-code/` |
| CLI wrapper | `.../s2c.py` |
| Service manager | `.../service.sh` |
| Backend port | `7001` |
| Frontend port | `5173` (optional, run separately) |
| Python venv | `.../venv/` |
| Logs | `.../s2c.log` |

## Supported Stacks

- `html_tailwind` (default) — plain HTML + Tailwind CSS
- `html_css` — plain HTML + vanilla CSS
- `react_tailwind` — React JSX + Tailwind CSS
- `bootstrap` — HTML + Bootstrap
- `ionic_tailwind` — Ionic + Tailwind
- `vue_tailwind` — Vue SFC + Tailwind

## API Keys Required (at least one)

| Key | Models unlocked |
|-----|----------------|
| `OPENAI_API_KEY` | GPT-4.1, GPT-5.x (already configured) |
| `ANTHROPIC_API_KEY` | Claude Sonnet/Opus |
| `GEMINI_API_KEY` | Gemini 3 Flash/Pro |

Keys are read from environment automatically. Add to backend `.env` to persist:
`/home/podhi/.openclaw/workspace/integrations/screenshot-to-code/backend/.env`

## Workflow for Subagents

### Step 1 — Ensure backend is running
```bash
bash /home/podhi/.openclaw/workspace/integrations/screenshot-to-code/service.sh status
bash /home/podhi/.openclaw/workspace/integrations/screenshot-to-code/service.sh start
```

### Step 2 — Convert screenshot to code
```bash
cd /home/podhi/.openclaw/workspace/integrations/screenshot-to-code

# Basic usage (outputs to stdout)
/home/podhi/.openclaw/workspace/integrations/screenshot-to-code/venv/bin/python3 s2c.py \
  /path/to/screenshot.png

# With stack and output file
/home/podhi/.openclaw/workspace/integrations/screenshot-to-code/venv/bin/python3 s2c.py \
  /path/to/screenshot.png \
  --stack react_tailwind \
  --output /tmp/output.jsx

# With text context
/home/podhi/.openclaw/workspace/integrations/screenshot-to-code/venv/bin/python3 s2c.py \
  /path/to/mockup.png \
  --stack html_tailwind \
  --text "make it dark mode" \
  --output /tmp/index.html

# With explicit API key override
/home/podhi/.openclaw/workspace/integrations/screenshot-to-code/venv/bin/python3 s2c.py \
  /path/to/design.png \
  --openai-key "$OPENAI_API_KEY" \
  --output /tmp/result.html
```

### Step 3 — Use the output
- HTML/Bootstrap output → save as `.html`, open in browser or serve
- React output → save as `.jsx`, integrate into React project
- Vue output → save as `.vue`, integrate into Vue project

## Service Management

```bash
S2C="$HOME/.openclaw/workspace/integrations/screenshot-to-code/service.sh"
bash "$S2C" start    # start backend (auto-starts if using s2c.py by default)
bash "$S2C" stop     # stop backend
bash "$S2C" restart  # restart
bash "$S2C" status   # check if running
bash "$S2C" logs     # tail logs
```

## Optional: Launch Browser UI

If the user wants the interactive web interface:

```bash
# Backend must already be running
cd /home/podhi/.openclaw/workspace/integrations/screenshot-to-code/frontend
# First time only:
yarn install
# Start:
yarn dev
# Opens at http://localhost:5173
```

## CLI Arguments Reference

| Argument | Default | Description |
|----------|---------|-------------|
| `image` | required | Path to screenshot/image |
| `--stack` | `html_tailwind` | Output code format |
| `--output` / `-o` | stdout | Output file path |
| `--variant` | `0` | Which variant to use (0-3) |
| `--port` | `7001` | Backend port |
| `--timeout` | `120` | Generation timeout (seconds) |
| `--text` / `-t` | empty | Extra text context |
| `--openai-key` | env | OpenAI API key override |
| `--anthropic-key` | env | Anthropic API key override |
| `--no-auto-start` | false | Don't auto-start backend |

## Example: Full Agent Workflow

**User says:** "Convert this mockup.png to React + Tailwind"

```bash
# 1. Convert image
/home/podhi/.openclaw/workspace/integrations/screenshot-to-code/venv/bin/python3 \
  /home/podhi/.openclaw/workspace/integrations/screenshot-to-code/s2c.py \
  mockup.png \
  --stack react_tailwind \
  --output /tmp/MockupComponent.jsx

# 2. Read the output
cat /tmp/MockupComponent.jsx

# 3. If iterating: run browser UI instead
# bash service.sh start && open http://localhost:5173
```

## Troubleshooting

### Backend fails to start
- Check logs: `tail -50 /home/podhi/.openclaw/workspace/integrations/screenshot-to-code/.s2c.log`
- Ensure venv is built: `ls venv/bin/uvicorn` — if missing, re-run setup
- Ensure at least one API key is set: `echo $OPENAI_API_KEY`

### "No code received for variant 0"
- Check backend logs for API errors
- OpenAI key may be rate-limited or invalid
- Try `--timeout 180` for slow connections

### "websockets package not found"
- Run: `venv/bin/pip install websockets`

### Rebuilding venv from scratch
```bash
cd /home/podhi/.openclaw/workspace/integrations/screenshot-to-code
rm -rf venv
python3 -m venv venv
venv/bin/pip install fastapi "uvicorn[standard]" websockets "openai==2.16.0" \
  python-dotenv beautifulsoup4 httpx anthropic pillow aiohttp \
  "pydantic>=2.10" google-genai langfuse moviepy
```

## License Note

screenshot-to-code is MIT licensed. Upstream: https://github.com/abi/screenshot-to-code
Our wrapper scripts (s2c.py, service.sh) are also MIT.
No restrictions on internal/commercial use.

## Related Skills
- **coding-agent**: For large-scale code generation tasks
- **canvas-design**: For creating visual designs to then convert
- **browser-automation**: For capturing screenshots to feed into this skill
