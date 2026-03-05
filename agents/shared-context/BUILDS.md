# BUILDS.md — What We've Built

Every agent should know these exist. Updated automatically after overnight builds.

---

## Active Builds & Tools

| Name | What It Is | URL / Path | Notes |
|------|-----------|------------|-------|
| Mission Control | Main dashboard — agent HQ, delegation, brain dump, analytics | localhost:7900 | Tunnel URL changes on restart — run `get-url.sh` |
| Luna | Vanessa's personal sleep guide | MC_URL/sleep.html | Built by Alo for Matt's girlfriend Vanessa Underwood |
| Velora Dashboard | Vanessa's design business dashboard | localhost:7902 | Client: designsbyvelora@gmail.com |
| Voice Server | AI phone call handler (Twilio + Deepgram + Claude) | localhost:3000 | Matt's line: (703) 389-3533 |
| Sellerboard Scraper | Auto-scrapes Amazon/Walmart revenue data every 2h | PM2: sb-scraper | Feeds /api/commerce |
| Kargo Slack Sync | Syncs Slack order posts to Notion every 30min | PM2: kargo-slack-sync | Channels: orders-amz-walmart |
| Ember Scanner | Scans Alo Gmail inbox, drafts responses every 30min | PM2: ember-scanner | alo@gohalomarketing.com |
| n8n | Workflow automation for Halo deterministic flows | localhost:5678 | PM2: n8n |
| Morning Flow | 4-step morning routine in MC (Brain Dump → Inbox → Brief → Commit) | MC → Morning Brief nav | Fires chime on first visit |

## Key Contacts (for email drafts)
| Name | Email | Context |
|------|-------|---------|
| Vanessa Underwood | vanessaunderwood2003@gmail.com | Matt's girlfriend, runs Velora Design |
| Preston | preston@gohalomarketing.com | Halo Marketing co-founder |
| Hafsa | Slack @U092H36CT7F | Amazon/Walmart VA |
| Irene | Slack | Halo salesperson |

## Halo Marketing Clients
- **Renee** — chiro, $950/mo
- **Jacek** — supplements, $950/mo  
- **Alex** — 3 locations, free trial, pending A2P
- **Pierce** — signing at $1,950/mo

---

*Auto-updated by overnight builder after each build run*


## Overnight Builds — Mar 2
- [Mar 2] Make sure approvals button at the top screen when approvals come in works
- [Mar 2] Improve spacing between icons on the menu. Kinda close together

## Overnight Builds — Mar 2
- [Mar 2] Improve spacing between icons on the menu. Kinda close together

## Overnight Builds — Mar 2
- [Mar 2] Make sure approvals button at the top screen when approvals come in works

## Overnight Builds — Mar 2
- [Mar 2] Improve spacing between icons on the menu. Kinda close together