# BookTok PRD v1.0 (MVP)

## Overview
BookTok is a social discovery app for books. Users swipe through 60–90 second, spoiler‑free audio “trailers,” then buy or borrow in one tap.

## Goals (MVP)
- Help users decide what to read in under a minute.
- Enable creators/publishers to publish high‑quality trailers easily.
- Drive measurable clicks to retailers/libraries.

## Value Proposition
Hear a spoiler‑free, 60–90 second audio “trailer” for any book and decide what to read next in seconds—then purchase or borrow with one tap.

## Target Audience & Persona
- Readers across genres; mobile-first, audio-friendly.
- Primary persona: Maya Chen (27, urban commuter, 1–2 books/month, trusts creator recs; wants fast, spoiler‑safe discovery).

## Success Metrics (KPIs)
- CTR to buy/borrow links
- Trailer completion rate (75%+ listened)
- D7 retention; DAU/MAU
- Weekly Active Creators (≥1 trailer/week)

## In-Scope (MVP)
1. Personalized audio trailer feed (auto‑play, Save/Like/Share/Follow/Buy–Borrow)
2. Creator tools (record/upload, trim, length cap, auto‑transcription, noise reduction)
3. Book detail pages (metadata, aggregated trailers, mood tags)
4. Search & discovery (title/author/genre/mood; trending)
5. Profiles & follows (saved lists/playlists v0, follower graph)
6. Notifications (new from followed creators)
7. Admin moderation (reports, takedowns)
8. Analytics (listens, completion, saves, follows, clicks)

## Out of Scope (MVP)
- Long-form reviews; comments
- Offline listening (queued) — roadmap
- Advanced playlists and sharing — roadmap
- Payments/subscriptions

## Key User Stories (selected)
- As a new user, I can select genres/moods to personalize my feed.
- As a listener, I can play/pause trailers, view transcripts, and save titles.
- As a listener, I can purchase or borrow a book from my preferred retailer/library.
- As a creator, I can record and publish a 60–90s trailer tied to a specific book/ISBN.
- As a moderator, I can review flagged content and take action quickly.

### Acceptance Criteria (samples)
- Trailers auto‑play muted or with remembered last preference; play/pause is reachable with a 44pt tap target.
- Buy/borrow buttons deep link by region and display format/price when available.
- Creator uploads are constrained to audio MIME types; media re‑encoded server‑side; transcript auto‑generated.
- Transcript, title, and descriptions pass profanity/spoiler policy checks.
- All actions emit analytics events (OpenTelemetry schema; Amplitude/Mixpanel integration).

## User Flows
- Onboarding: Sign in → pick genres/moods → seeded feed → first Save
- Listen & decide: Feed auto‑play → Save/Follow → Book page → Buy/Borrow
- Create: Tap Create → record/trim → pick book (ISBN) → tags + transcript → publish
- Moderation: User report → admin queue → review → action (hide/remove/ban)

## Data Model (high level)
- User (id, displayName, email, emailVerified, preferences)
- Book (id, isbn, title, author, metadata, retailerLinks)
- Trailer (id, bookId, creatorId, audioUrl, duration, transcript, tags, status)
- Engagement (userId, trailerId, eventType: listenStart/completion/save/like/click)
- Follow (followerId, followeeId)
- Report (reporterId, entityId, reason, status)

## Non-Functional Requirements
- Performance: Time to First Play ≤ 1.5s on 4G; prefetch next trailer.
- Accessibility: WCAG AA; transcripts required; large touch targets; VoiceOver/TalkBack labels.
- Security: See OWASP checklist; presigned S3 uploads; OIDC + PKCE; rate limits.
- Privacy: GDPR/CCPA basics; data export/delete; tracking toggles.
- Observability: Sentry + product analytics; structured logs with PII redaction.

## Integrations
- Auth: Auth0/Cognito (OIDC)
- Media: Mux (ingest, HLS, analytics)
- Search: Algolia
- Books metadata: Google Books/Open Library
- Retailers/Libraries: Amazon, Apple Books, Bookshop.org, OverDrive/Libby

## Milestones (8 weeks)
- W1–2: Spec, Figma prototype, infra scaffolding
- W3–4: Auth, creator flow, media pipeline, feed v1
- W5: Book pages, buy/borrow, search, saves/follows, notifications
- W6: Admin, analytics, perf tuning, internal alpha
- W7–8: QA + a11y, security/privacy, closed beta, launch gates

## Risks & Mitigations
- Rights/spoilers: Strict content policy; transcript scanning; publisher partnerships.
- Naming/trademark: Run search; consider alternatives (BookReel/PagePulse/LitLoop).
- Mobile audio reliability: Use track player; background permissions; offline later.
