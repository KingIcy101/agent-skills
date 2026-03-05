AI Agency Build Specs

Everything Alo needs to build components, dashboards, and portals for the AI Agency

1. ROI Calculator Component

Interactive calculator that shows potential savings. Great for landing pages and sales

conversations.

State Variables

const [hoursPerWeek, setHoursPerWeek] = useState(20);

const [hourlyRate, setHourlyRate] = useState(25);

const [missedLeads, setMissedLeads] = useState(10);

const [avgDealValue, setAvgDealValue] = useState(500);

// Calculations

const monthlySavings = hoursPerWeek * hourlyRate * 4;

const missedRevenue = missedLeads * avgDealValue * 0.3 * 4; // 30% close rate

const totalMonthly = monthlySavings + missedRevenue;

const yearlyValue = totalMonthly * 12;

Slider Ranges

Hours on repetitive tasks: 5-60 hrs/week

Hourly employee cost: $15-$75/hr

Missed leads per week: 0-50

Avg deal value: $100-$5,000

Output Display

Time saved (monthly): hours × 4

Labor cost savings: hours × rate × 4

Captured revenue: leads × deal value × 0.3 × 4

Total monthly value

Annual projection

2. Industry Color Themes

12 ready-to-use color palettes for different verticals:

const themes = {

  healthcare:   { primary: '#10b981', light: '#34d399', dark: '#059669' },

  legal:        { primary: '#d4af37', light: '#f0d861', dark: '#b8942e' },

  homeservices: { primary: '#f97316', light: '#fb923c', dark: '#ea580c' },

  ecommerce:    { primary: '#ec4899', light: '#f472b6', dark: '#db2777' },

  saas:         { primary: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },

  finance:      { primary: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },

  education:    { primary: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' },

  fitness:      { primary: '#ef4444', light: '#f87171', dark: '#dc2626' },

  restaurant:   { primary: '#f59e0b', light: '#fbbf24', dark: '#d97706' },

  realestate:   { primary: '#64748b', light: '#94a3b8', dark: '#475569' },

  automotive:   { primary: '#dc2626', light: '#ef4444', dark: '#b91c1c' },

  default:      { primary: '#6366f1', light: '#818cf8', dark: '#4f46e5' },

};

Industry

Primary Color

Use Case

Healthcare

#10b981 (Emerald)

Medical practices, clinics, chiropractors

Legal

#d4af37 (Gold)

Law firms, attorneys

Home Services

#f97316 (Orange)

HVAC, plumbing, electrical, contractors

E-commerce

#ec4899 (Rose)

Online stores, retail

SaaS

#06b6d4 (Cyan)

Software companies, tech startups

Finance

#3b82f6 (Blue)

Financial services, accounting

3. Dashboard Stat Card

Reusable metric display component with trend indicator:

<div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">

  <div className="flex justify-between mb-2">

    <MessageSquare className="w-4 h-4 text-cyan-400" />

    <span className="text-xs text-emerald-400 flex items-center gap-0.5">

      <ArrowUpRight className="w-3 h-3" /> 12%

    </span>

  </div>

  <p className="text-2xl font-bold">1,247</p>

  <p className="text-xs text-neutral-500">Messages this week</p>

</div>

Variants

Up trend: text-emerald-400 with ArrowUpRight

Down trend: text-red-400 with ArrowDownRight

Neutral: text-neutral-400 with Minus icon

Common Metrics

Messages handled (this week/month)

Leads captured

Appointments booked

Revenue influenced

Response time (avg)

Satisfaction score (%)

4. Live Activity Feed

Shows real-time AI actions in the dashboard:

const activities = [

  { 

    icon: MessageSquare, 

    color: 'cyan',

    action: 'AI answered pricing question', 

    time: 'Just now', 

    user: 'Sarah M.' 

  },

  { 

    icon: Calendar, 

    color: 'orange',

    action: 'Appointment booked for tomorrow 2pm', 

    time: '2m ago', 

    user: 'Mike R.' 

  },

  { 

    icon: Users, 

    color: 'purple',

    action: 'New lead captured from website chat', 

    time: '5m ago', 

    user: 'Jennifer L.' 

  },

  { 

    icon: CheckCircle, 

    color: 'emerald',

    action: 'Support ticket resolved automatically', 

    time: '12m ago', 

    user: 'David K.' 

  },

  { 

    icon: Send, 

    color: 'blue',

    action: 'Follow-up email sent', 

    time: '18m ago', 

    user: 'Amy S.' 

  },

];

Features

Pulse dot indicator for "Live" status

Icon with colored background per action type

Relative timestamps (Just now, 2m ago, etc.)

User name who triggered/received action

"View all" link to full activity log

5. Client Portal Pages

Four main pages every client portal needs:

Dashboard (/dashboard)

4 stat cards: Messages, Leads, Appointments, Revenue

Weekly/monthly performance chart

Live activity feed

AI status indicator (online/offline with pulse)

Today's schedule sidebar

Quick actions panel

AI insights section (smart recommendations)

Chat (/chat)

Message thread with AI responses

Input field at bottom with send button

"AI is typing..." indicator

Message timestamps

User vs AI message styling (different sides/colors)

Training (/training)

List of recent conversations

Click to expand full thread

Thumbs up/down buttons per AI message

"Flag for review" button

Modal to add correction notes

Filter by: flagged, positive, negative, all

Settings (/settings)

Business info form (name, industry, description)

Notification toggles (email alerts, SMS alerts)

AI personality slider (formal ↔ casual)

Billing section with current plan and upgrade button

API keys section (for developers)

6. Booking Journey Flow

Emotional, not transactional. 4 steps to qualify leads:

Step 1: Pain Point

Question: "What's eating up your team's time?"

Options (multi-select):

Answering the same questions over and over

Following up with leads manually

Scheduling and rescheduling appointments

Data entry and admin work

Customer support requests

Step 2: Vision

Transition screen: "Imagine if that was handled automatically..."

Brief benefits copy, then continue button.

Step 3: Business Info

Industry dropdown

Company size (1-5, 6-20, 21-50, 50+)

Current tools used (CRM, scheduling, etc.)

Step 4: Book Call

Calendar embed (Calendly/Cal.com) OR

Simple contact form (name, email, phone)

7. Integration Logos

16 core tools to display (show as grid with logos):

Category

CRM

Tools

Salesforce, HubSpot

Communication

Slack, Intercom

Scheduling

Google Calendar, Calendly

Payments

Support

E-commerce

Stripe, QuickBooks

Zendesk

Shopify

Field Service

ServiceTitan

Email

Voice/SMS

Database

Mailchimp, Gmail

Twilio

Airtable, Notion

Automation

Zapier

Display as grid with tool name and category label. Add "+ hundreds more via API" at bottom.

8. Dark Theme Base

Core CSS variables for consistent dark theme:

:root {

  /* Backgrounds */

  --bg-primary: #0a0a0f;

  --bg-secondary: #0c0c14;

  --bg-card: #12121a;

  --bg-hover: #1a1a24;

  /* Borders */

  --border: rgba(255, 255, 255, 0.06);

  --border-hover: rgba(255, 255, 255, 0.1);

  /* Text */

  --text-primary: #ffffff;

  --text-secondary: #9ca3af;

  --text-muted: #6b7280;

  /* Accent (default indigo) */

  --accent: #6366f1;

  --accent-light: #818cf8;

  --accent-dark: #4f46e5;

  /* Status */

  --success: #10b981;

  --warning: #f59e0b;

  --error: #ef4444;

  --info: #3b82f6;

}

  
  
  
  
9. Key UI Patterns

Tailwind classes for consistent components:

Cards

className="rounded-2xl bg-white/[0.02] border border-white/[0.06]"

// Hover state

className="hover:bg-white/[0.04] hover:border-white/[0.1] transition-colors"

Primary Button

className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500

  text-white font-semibold hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] 

  transition-all duration-200"

Secondary Button

className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 

  text-white hover:bg-white/10 transition-colors"

Input Fields

className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg 

  text-white placeholder:text-neutral-500 

  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/

Badges

// Success

className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs"

// Warning

className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs"

// Info

className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs"

Status Dot (Live Indicator)

className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"

Sidebar Nav Item

// Active

className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/10 text-white

// Inactive

className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-neutral-400 

  hover:bg-white/5 hover:text-white transition-colors"

10. Tech Stack

Layer

Technology

Notes

Framework

Next.js 14

App Router, Server Components

Styling

Tailwind CSS

Dark theme, custom config

Auth

Clerk

Easy setup, good free tier

Database

Supabase

Postgres + realtime

AI Routing

OpenRouter

Multi-model access

Voice

Icons

Cartesia

Same as Alo uses

Lucide React

Consistent, clean

Deployment

Vercel

Auto deploys from Git

Model Routing Strategy

Haiku / Gemini Flash: Routine tasks, simple queries (~$0.25/$1.25 per M tokens)

Sonnet: Main workhorse, most conversations (~$3/$15 per M tokens)

Opus: Complex reasoning only, use sparingly (~$15/$75 per M tokens)

11. Pricing Model

Tier

Setup

Monthly

Includes

Starter

$5,000

$750/mo

Basic AI assistant, single channel, dashboard

Pro

$9,500

$1,000/mo

Multi-channel, custom training, analytics,

priority support

Enterprise

$25,000+

$2,500/mo

Full custom build, dedicated support, SLA,

integrations

Generated by Zora • AI Agency Build Specs • February 2026


