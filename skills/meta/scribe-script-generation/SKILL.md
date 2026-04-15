---
name: scribe-script-generation
description: Use when Scribe needs to generate a Vapi voice agent script from a client intake submission.
category: meta
---
# Scribe Script Generation

## When to Use
Triggered by Iris after onboarding (Discord #scribe notification). Also triggered manually when a script needs revision after a failed Echo test call.

## Steps
1. Receive intake data (business_name, industry, services, hours, owner_name)
2. Detect industry → load industry framework
3. Fill script template with client data
4. Run quality checks against all rules
5. Output JSON: `{ systemPrompt, firstMessage, tools }`
6. Post to Discord #scribe for review before handing to Echo

## Key Patterns / Code

```ts
// Industry detection
function detectIndustry(intake: IntakeSubmission): IndustryFramework {
  const text = `${intake.industry} ${intake.services}`.toLowerCase();
  if (/dental|dentist/.test(text)) return DENTAL_FRAMEWORK;
  if (/auto|mechanic|repair/.test(text)) return AUTO_FRAMEWORK;
  if (/law|attorney|legal/.test(text)) return LEGAL_FRAMEWORK;
  if (/medical|doctor|clinic|health/.test(text)) return MEDICAL_FRAMEWORK;
  if (/restaurant|food|dine/.test(text)) return RESTAURANT_FRAMEWORK;
  return GENERAL_FRAMEWORK;
}
```

```ts
// Script template structure
interface VapiScript {
  systemPrompt: string;    // Full system instructions for the agent
  firstMessage: string;    // Opening line — must be under 20 words
  tools: VapiTool[];       // e.g. transferCall, bookAppointment
}

function generateScript(intake: IntakeSubmission, framework: IndustryFramework): VapiScript {
  const systemPrompt = `
You are ${intake.business_name}'s AI receptionist.
Your job: answer calls professionally, gather caller info, and book appointments.

Business: ${intake.business_name}
Owner: ${intake.owner_name}
Services: ${intake.services}
Hours: ${intake.hours}

Rules:
- Max 2 sentences per turn
- Ask max 1 question per turn
- Never say: Sure thing, Yeah., Hm, Absolutely!, Of course!
- Always get caller name before anything else
- Offer to book appointment for any service inquiry
${framework.additionalInstructions}
`.trim();

  // First message: under 20 words
  const firstMessage = `Thank you for calling ${intake.business_name}, this is your AI receptionist. How can I help you today?`;

  return { systemPrompt, firstMessage, tools: framework.defaultTools };
}
```

```ts
// Quality checks — all must pass before posting
function checkScriptQuality(script: VapiScript): string[] {
  const violations: string[] = [];

  // First message word count
  const wordCount = script.firstMessage.split(' ').length;
  if (wordCount > 20) violations.push(`First message too long: ${wordCount} words (max 20)`);

  // No banned words in system prompt
  const banned = ['sure thing', 'yeah.', 'hm ', 'absolutely!', 'of course!'];
  banned.forEach(word => {
    if (script.systemPrompt.toLowerCase().includes(word))
      violations.push(`Banned phrase in systemPrompt: "${word}"`);
  });

  return violations;
}
```

## Script Sections (Required in systemPrompt)
1. **Greeting** — uses exact business name
2. **Qualification** — max 3 questions total in conversation
3. **Appointment booking** — always offer, use booking tool
4. **Escalation path** — "Let me transfer you" if caller insists on human
5. **Closing** — confirm next steps, end professionally

## Gotchas
- First message under 20 words — Vapi reads it before the caller speaks, shorter = better
- Max 1 question per turn in instructions — agents ignore multi-question prompts
- Post to #scribe for review, not directly to Echo — Matt or team must approve
- Industry frameworks live in `src/lib/scribe/frameworks/` — create new ones as needed
- Banned words list lives in Scribe config — update centrally, not per-script
- If revision after test call failure, include specific failure reason in Discord post
