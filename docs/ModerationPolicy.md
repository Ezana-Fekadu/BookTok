# BookTok — Moderation Policy

## Goals
- Keep the platform safe, spoiler‑aware, and trustworthy.
- Balance creator freedom with community standards.

## Report Reasons
- Spoilers, Harassment/Hate, Copyright, Spam/Scam, Adult Content (minor risk), Other

## SLAs
- Critical (harm to minors, violent threats, active doxxing): 4 hours
- High (copyright complaints, harassment, spoilers trending): 24 hours
- Normal: 72 hours

## Actions
- No Action, Soft Warning, Remove Content, Temporary Suspension (7/30 days), Permanent Ban
- Shadow limits for spammy behavior (rate reduce creation/links)

## Workflow
1. User flags content → moderation queue
2. Auto triage: transcript scan + heuristics
3. Moderator review: evidence, policy tag, decision
4. Notify reporter and creator; allow appeal (7 days)
5. Log all actions to audit log

## Tools Required
- Queue with filters, bulk actions, entity preview, transcript view
- Evidence capture (screens, transcript excerpts)
- Audit log and metrics (reports per 1k sessions, time to action)
