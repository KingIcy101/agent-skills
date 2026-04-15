---
name: zta-community-slack
description: Use when setting up or managing the ZTA Slack community workspace — channels, welcome flow, onboarding, and Stripe integration.
category: business
---
# ZTA Community Slack

## When to Use
Setting up the ZTA Slack workspace for new members, configuring welcome automations, managing invite links, or connecting payment events to access grants.

## Steps
1. Create workspace with core channels
2. Configure Slackbot welcome message with CAO quickstart link
3. Pin onboarding checklist in #general
4. Set up n8n → Slack webhook for new member notifications
5. Connect Stripe webhook → n8n → Slack invite automation
6. Rotate invite links monthly for security

## Channel Structure
```
#general         — main community feed, onboarding checklist pinned here
#announcements   — Matt-only posts, major updates, office hours
#cao-builds      — share CAO agent builds, get feedback
#wins            — client results, milestones, revenue screenshots
#resources       — templates, swipe files, tools list
#introductions   — new member intros, auto-prompted on join
```

## Key Patterns / Code

```js
// n8n workflow: Stripe webhook → Slack invite
// Trigger: Stripe checkout.session.completed
// Filter: product = ZTA membership
// Action: Slack API → conversations.invite or users.admin.invite

// Slack API: invite user by email
const res = await fetch('https://slack.com/api/users.admin.invite', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    token: process.env.SLACK_ADMIN_TOKEN,
    email: customerEmail,
    channels: 'C_GENERAL_ID,C_INTRO_ID',
    resend: 'true',
  }),
});
```

```js
// Welcome DM flow — Slackbot auto-message on join
// Set in Slack Admin → Settings → Slack Connect → Welcome Message:
`Welcome to Zero to Agent! 🎉
Here's your CAO quickstart: [link]
First step: introduce yourself in #introductions.
Office hours every [day] at [time] — link in #announcements.`
```

```js
// n8n: Weekly office hours announcement
// Cron: every Monday 9am ET
// Action: Post to #announcements
const message = `📅 *Office Hours this week:* [Day] at [Time] ET\nBring your CAO build questions — Matt will be live.\nJoin: [Zoom/Huddle link]`;
```

## Invite Link Rotation
```bash
# Monthly rotation — run first of each month
# 1. Expire old invite link in Slack Admin → Invitations
# 2. Create new invite: max-uses = 50, expiry = 30 days
# 3. Update link in: PandaDoc proposal template, Stripe success page, cao-overview.pdf footer
```

## Gotchas
- `users.admin.invite` requires workspace admin token — not standard bot token
- Rotate invite links monthly — leaked links can let anyone join
- Stripe webhook must verify signature before processing — never trust payload without `stripe.webhooks.constructEvent()`
- #announcements should be read-only for non-admins — set in channel settings
- n8n workflow ID for Slack notifications — check n8n dashboard (running at port 5678)
- Never share workspace invite link publicly — use Stripe webhook for paid access control
