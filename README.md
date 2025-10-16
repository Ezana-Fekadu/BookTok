# BookTok — Core Docs

A book discovery app with 60–90s, spoiler‑free audio trailers and one‑tap buy/borrow.
This repo contains the foundational product docs for BookTok.

## Files
- docs/PRD.md — Product Requirements Document (MVP)
- docs/DesignCopy.md — Landing page copy + Login/Sign-up microcopy
- docs/API/auth-register.yaml — OpenAPI 3.0 spec for User Registration
- backlog/EngineeringBacklog.csv — JIRA-importable backlog (epics, stories, acceptance criteria)

## How to use
- PRD: Align team on scope and success metrics.
- DesignCopy: Hand off to marketing/UX writers.
- API: Import into Swagger UI or Postman for contract-first development.
- Backlog: Import CSV to JIRA (or Linear/Asana) and assign owners.


-----------------------------------------------------------------------------------------------------

## Quick Links
- PRD (MVP): docs/PRD.md
- Design Copy: docs/DesignCopy.md
- Security Checklist: docs/SecurityChecklist.md
- Competitive Landscape: docs/CompetitiveLandscape.md
- OpenAPI (User Registration): docs/API/auth-register.yaml
- Frontend Component: frontend/components/MainNavigationBar.tsx
- Engineering Backlog (CSV): backlog/EngineeringBacklog.csv

## Repo Structure

.
├─ README.md
├─ docs/
│  ├─ PRD.md
│  ├─ DesignCopy.md
│  ├─ SecurityChecklist.md
│  ├─ CompetitiveLandscape.md
│  └─ API/
│     └─ auth-register.yaml
├─ frontend/
│  └─ components/
│     └─ MainNavigationBar.tsx
├─ backlog/
│  └─ EngineeringBacklog.csv
└─ scripts/
   └─ package-docs.sh


## How to Use
- Product/Design
  - PRD: Align on MVP scope, KPIs, and acceptance criteria.
  - DesignCopy: Landing page + login/signup microcopy for handoff.
- Engineering
  - API: Import YAML into Swagger UI or Postman for contract-first dev.
  - Component: Plug MainNavigationBar.tsx into React Navigation (Expo).
  - Backlog: Import CSV into JIRA/Linear; assign owners and sprints.
- Security
  - SecurityChecklist: Pre-launch controls aligned to OWASP Top 10; use as audit checklist.

## Preview the API Spec Locally
- Using Docker (Swagger UI):
docker run -p 8080:8080 -e SWAGGER_JSON=/spec/auth-register.yaml
-v "$PWD/docs/API/auth-register.yaml:/spec/auth-register.yaml" swaggerapi/swagger-ui

text

Open http://localhost:8080

## Frontend Component Dependencies (Expo)
expo install @react-navigation/native @react-navigation/bottom-tabs react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-reanimated
expo install @expo/vector-icons expo-haptics

text


## Experimentation
- CTA A/B Test (Landing): Variant “Get started free” on brand purple (#6D5EF6), success = ≥10% lift in verified signups at 95% sig/80% power.

## Security Gates (Go/No‑Go)
- Pen test highs/criticals remediated
- No public S3; WAF+rate limits on all endpoints
- Secrets rotation + DR drill (RDS+S3)
- Monitoring/alerts verified via synthetic checks

## Change Management
- Open PRs for doc/code updates; tag Product (CPO), Eng (Lead), Design (UX).
- Keep OpenAPI spec and PRD in sync with shipped behavior.


Questions or updates? Open a doc PR and tag Product + Eng leads.
