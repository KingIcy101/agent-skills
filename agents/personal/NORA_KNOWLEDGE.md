# Nora Knowledge Base

*Operational knowledge Nora needs to do her job. Pull from this before making any financial or operational claims.*

---

## Notion Database IDs

| Database | ID | Purpose |
|----------|-----|---------|
| Amazon Orders | `3eda6d0e1c0d4a54905b6cb478f78a45` | Amazon resell order tracking, COGS, profit |
| Walmart Orders | `19789dac5745808d9bc1d62dccd06a04` | Walmart order tracking |
| Expenses | `2e289dac574580ebaea6f7cc01954f47` | Personal + business expense log |

### How to Use These
- Always pull live data from Notion before quoting numbers
- Filter Amazon/Walmart DBs by current month for P&L
- Filter Expenses DB by tag for category breakdowns
- Never estimate — if data isn't in Notion, say so

---

## Business: Amazon

- **Type:** Product reselling / arbitrage
- **Scale:** ~$40,000/mo net profit (after COGS, fees, prep costs)
- **Volume:** High — hundreds of orders per month tracked via Nova Prep Center
- **Key costs:** Buy cost, Amazon fees (~15%), prep center fees
- **Notion DB:** Amazon Orders — contains item name, qty, buy cost, tracking, profit
- **Walmart DB:** Separate tracking for Walmart sourcing

### P&L Notes
- $40K/mo is the working estimate — always verify against Notion for accurate current-month figure
- Profit = Revenue − Buy Cost − Amazon Fees − Prep Fees
- Any month where profit drops >10% from prior month, flag it

---

## Business: Halo

- **Type:** Digital marketing / agency retainer services
- **Current clients:** 2
  - **Renee** — $950/mo retainer
  - **Jacek** — $950/mo retainer
- **Gross revenue:** $1,900/mo
- **Monthly burn (operating costs):** ~$903/mo
  - Includes: tools, software subscriptions, any contractor costs
- **Net profit:** ~$997/mo

### Client Notes
- Invoices should go out by the 1st of each month
- Flag any invoice unpaid after 5 business days
- If a client is added or churns, update this file

### Halo Expense Tracking
- Halo costs are logged in Expenses DB with tag = "halo"
- Target: keep burn under $1,000/mo
- Alert if any Halo cost spikes or new recurring appears

---

## Personal Finances

### Structure
- Personal expenses tracked in Notion Expenses DB (tag = "personal")
- Business passthroughs (Amazon restock, Halo tools) tracked separately
- Credit cards: Chase Sapphire (primary — verify with Matt for current balance/due dates)

### Spend Norms (Rough Baselines for Anomaly Detection)
- Food/dining: varies — flag if >$800/mo
- Subscriptions: flag any new recurring charge not previously seen
- Misc: flag single charges >$500 from unknown vendors

---

## Combined P&L Summary (Working Baseline)

| Stream | Monthly Net |
|--------|------------|
| Amazon | ~$40,000 |
| Halo | ~$997 |
| Personal spend | (variable — pull from Expenses DB) |
| **Combined** | **~$41,000 − personal expenses** |

This is Nora's primary financial picture. Update the working baseline when actuals change significantly.

---

## Key Files & Related Agents

| File/Agent | Location | Purpose |
|-----------|----------|---------|
| Nora AGENT.md | agents/personal/AGENT.md | System prompt |
| Nora PLAYBOOK.md | agents/personal/PLAYBOOK.md | Workflows |
| Nora IDENTITY.md | agents/personal/IDENTITY.md | Persona |
| Atlas (strategy) | agents/atlas/ | Business decisions |
| Oracle (research) | agents/oracle/ | Research queries |
| Forge (dev) | agents/dev/ | Technical builds |
| Quinn (outreach) | agents/outreach/ | Hiring/outreach |

---

## Important Context About Matt

- Runs multiple businesses simultaneously — values unified P&L view highly
- Doesn't want to be nagged — but also doesn't want things to slip
- Values brevity: get to the number, then explain if needed
- Trust is earned through accuracy — don't guess, don't smooth over gaps
- If Nora says "$40K profit this month," it better be based on real data

---

## Update Log

| Date | Change |
|------|--------|
| 2026-02-25 | Initial knowledge base created (overnight build) |
