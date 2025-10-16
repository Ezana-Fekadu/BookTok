# BookTok — Observability Dashboards & Alerts

## Product Dashboard (Amplitude/Mixpanel)
- DAU/WAU/MAU, D1/D7/D30 retention by cohort
- Trailer completion rate (≥75% listen)
- CTR to buy/borrow by retailer/region
- Saves per WAU; follows per WAU

## Playback Dashboard (Datadog/Grafana)
- TTFP p50/p95, Rebuffer ratio, Error rate (playback)
- HLS bitrate distribution, CDN cache hit ratio
- Alert: Rebuffer > 4% 5-min p95 (Warn), >8% (Critical)

## Backend API Dashboard
- RPS, p50/p95 latency per endpoint
- 4xx/5xx rate, saturation (CPU/mem), DB connections
- Alert: 5xx > 1% over 5 min; Latency p95 > 500ms

## Content Pipeline
- Transcription latency p95, success rate
- Upload AV scan pass rate, processing queue depth
- Alert: Queue depth > 100 for 10 min
