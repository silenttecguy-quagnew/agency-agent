---
name: data-analyst
description: "Exploratory data analysis, statistical insights, trend detection, and actionable recommendations from structured data. Accepts CSV, JSON, Parquet, or a SQL connection. Generates ANALYSIS_REPORT.md with charts. Invoke when the user wants to understand data, find patterns, generate reports, or answer a business question with numbers. Trigger keywords: 'analyse this data', 'what does this CSV show', 'find trends', 'weekly report', 'why did X drop', 'correlations', 'dashboard'."
---

# data-analyst

Load data. Ask a question. Get numbers, charts, and a recommendation you can act on.

## Usage

```
@ZeroClaw data-analyst --input metrics.csv --describe "show me weekly active users and revenue trends"
@ZeroClaw data-analyst --input orders.parquet --question "which product categories are declining?"
@ZeroClaw data-analyst --sql "postgresql://..." --query "SELECT * FROM events WHERE ts > NOW() - INTERVAL '30 days'"
@ZeroClaw data-analyst --input users.csv --question "what drives churn?" --method regression
@ZeroClaw data-analyst --input sales.json --report weekly --channel telegram
```

## Options

| Flag | Description |
|------|-------------|
| `--input` | File path (CSV, JSON, Parquet, Excel) |
| `--sql` | Database connection string + optional `--query` |
| `--describe` | Natural language description of what to analyse |
| `--question` | Specific business question to answer |
| `--method` | Analysis method: `eda`, `regression`, `cohort`, `funnel`, `forecast` |
| `--report` | Recurring report: `daily`, `weekly`, `monthly` |
| `--channel` | Send report to channel: `telegram`, `slack`, `email` |
| `--charts` | `plotly` (default) \| `matplotlib` \| `none` |

## Analysis Pipeline

1. **Profile** — shape, types, null counts, value distributions, outliers.
2. **Clean** — flag (but never silently drop) rows with missing or malformed data.
3. **Explore** — histograms, correlation matrix, time-series decomposition as relevant.
4. **Analyse** — statistical tests, segmentation, or model appropriate to the question.
5. **Visualise** — interactive Plotly charts saved as HTML and PNG.
6. **Synthesise** — executive summary with key insight, evidence, and next steps.

## Output Files

```
ANALYSIS_REPORT.md     ← executive summary + methodology + findings
charts/                ← Plotly HTML (interactive) + PNG (embeddable)
  ├── overview.html
  ├── trends.html
  └── breakdown.html
```

## Report Format

```markdown
## Key Insight
Weekly active users dropped 18% in the last 4 weeks, driven entirely by the
18–24 age cohort on mobile (down 34%). Desktop and 25+ cohorts are flat.

## Evidence
| Metric | 4 weeks ago | This week | Change |
|--------|-------------|-----------|--------|
| Overall WAU | 142,300 | 116,700 | -18% |
| Mobile 18–24 WAU | 48,100 | 31,800 | -34% |
| Desktop WAU | 61,200 | 62,400 | +2% |

Correlation with app store rating drop (from 4.6 → 3.9) on 2026-02-14: r = 0.87

## Data Quality Notes
- 1.2% of rows had null `user_age` — excluded from cohort analysis.
- Timezone normalisation applied (all timestamps converted to UTC).

## Next Steps
1. Investigate the app store reviews posted after 2026-02-14.
2. A/B test the onboarding flow for mobile users aged 18–24.
3. Check if a recent app update (v3.4.1, 2026-02-13) affected this segment.
```

## Statistical Methods

| Method | Best For |
|--------|----------|
| Exploratory (EDA) | First look at a new dataset |
| Cohort analysis | Retention, LTV, churn over time |
| Funnel analysis | Conversion rates, drop-off points |
| Regression | What factors drive a metric? |
| Time-series forecast | Predict next N periods |
| Correlation matrix | Which metrics move together? |

## Recurring Reports

```bash
# Send a weekly WAU + revenue summary to your Telegram every Monday at 8am
@ZeroClaw data-analyst \
  --sql "postgresql://prod-db/analytics" \
  --question "weekly active users, revenue, and top 5 churned segments" \
  --report weekly \
  --channel telegram \
  --cron "0 8 * * 1"
```

## Philosophy

Numbers without context mislead. Every finding comes with the sample size, the time
window, and a caveat about what the data *cannot* tell you. A recommendation you
can dismiss is more useful than a conclusion that sounds certain but isn't.
