# BookTok — Analytics Taxonomy

Authoritative event spec for Amplitude/Mixpanel. All events carry:
- context: appVersion, platform, locale, region, deviceModel
- user: userId (or anonymousId), isVerified, isCreator
- session: sessionId
- privacy: trackingConsent: { marketing: bool, analytics: bool }

## Core Events

1) app_open
- props: source (cold|warm|push|deep_link), experimentAssignments (map)
- goal: Session starts baseline

2) onboarding_completed
- props: method (guest|email|apple|google), selectedGenres (array), selectedMoods (array)
- goal: Onboarding funnel

3) listen_start
- props: trailerId, bookId, creatorId, positionMs, network (wifi|cellular), bitrateKbps
- goal: Playback engagement

4) listen_complete
- props: trailerId, bookId, durationMs, completionPct
- goal: Completion rate KPI

5) save_title
- props: bookId, source (feed|book_page|share)
- goal: Save intent

6) follow_creator
- props: creatorId, source (feed|profile)
- goal: Social graph growth

7) buy_borrow_click
- props: bookId, retailer (amazon|apple|bookshop|overdrive), format (ebook|audio|print), priceShown (number|null), region
- goal: CTR KPI

8) search_performed
- props: query, filters (genres[], moods[], format[]), resultsCount
- goal: Search relevance

9) create_publish
- props: trailerId, bookId, durationMs, transcriptChars, hasMusicBed (bool)
- goal: Supply and creator health

10) report_submitted
- props: entityType (trailer|user|comment), reason (spoiler|harassment|copyright|spam|other)
- goal: Trust & safety volume

## User Properties
- account_age_days, preferredGenres [], preferredMoods [], verifiedEmail, locale, region, pushOptIn, marketingOptIn

## Conversion Funnel (Signup)
- page_view → cta_click → auth_start → auth_success → email_verify_sent → email_verified
- KPI: verified signups / unique visitors (landing)
