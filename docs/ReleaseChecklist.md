# BookTok — Release Checklist

- Product
  - PRD/story acceptance met; changelog updated
  - A/B flags default set + kill switch in LaunchDarkly

- Engineering
  - CI green; 0 high/critical vulnerabilities
  - Sentry DSNs set; version bump; source maps uploaded
  - Feature flags verified in staging + prod

- QA
  - Smoke tests pass on iOS/Android (latest -1)
  - Accessibility checks (TalkBack/VoiceOver) pass
  - Offline/backgound playback sanity

- Security/Privacy
  - OWASP checklist pass; secrets rotated if needed
  - Privacy policy updated; data map current

- Marketing
  - Store assets updated; release notes localized
  - Email/push copy scheduled (opt-in only)
