# BookTok — Incident Response Runbook

## Severity Levels
- SEV1: Outage (auth/playback down > 10% users)
- SEV2: Major degradation (TTFP>3s p95, push failures)
- SEV3: Minor degradation (subset of platforms)
- SEV4: Non-prod or informational

## Roles
- Incident Commander (IC), Comms Lead, Ops Lead, Eng On-Call, Product, Support

## Lifecycle
1) Declare & Create Ticket (#inc-YYYYMMDD-HHMM)
2) Triage: scope, blast radius, user impact, suspected cause
3) Mitigate: rollback/feature-flag/scale up
4) Communicate: status page update, internal Slack, support macro
5) Verify: monitor metrics, confirm recovery
6) Postmortem (within 72h): blameless doc with action items and owners

## Comms Templates
- Status page update (user-facing)
- Internal update (exec + CS)
- Regulator notice (if data breach)

## Metrics to Watch
- Error Rate (API 5xx), Auth success rate, TTFP, Rebuffer %, Listen start rate/min
