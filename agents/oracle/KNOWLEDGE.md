# Oracle Knowledge Base

## Architecture (from @0xwhrrari blueprint)
Three-agent system running on Mac Mini:
- **Agent-01 (Scanner):** Scans markets every 10 min, flags mispricing above threshold
- **Agent-02 (Fair Value):** Builds fair value from NOAA weather, on-chain metrics, sentiment
- **Agent-03 (Executor):** Signs EIP-712, posts to CLOB on Polygon (FUTURE — not yet active)

## Polymarket API
- Markets: `https://gamma-api.polymarket.com/markets?active=true&limit=50`
- CLOB: `https://clob.polymarket.com/markets` (for order books)
- Auth for trading: API key + EIP-712 signature (not yet configured)
- Docs: https://docs.polymarket.com/

## NOAA Weather API (free, no key needed)
- Forecasts: `https://api.weather.gov/points/{lat},{lon}` → get office → `https://api.weather.gov/gridpoints/{office}/{x},{y}/forecast`
- Hourly: `/forecast/hourly`
- Alerts: `https://api.weather.gov/alerts/active?area={state_code}`
- Updates: every ~6 hours

## Edge: Weather Market Lag
Polymarket weather markets update every few hours. NOAA updates every 6h.
When NOAA confidence diverges from Polymarket price by >10%, there's a tradeable edge.

Example: NOAA confidence 63% on Texas rain, Polymarket showing 72% → 14% mispricing → BUY NO

## Mispricing Threshold
Default: 10% edge minimum (e.g., fair value 0.60, market price 0.72 → 12% gap → signal)
Conservative: 15% edge for high-confidence signals only

## Market Categories (priority order)
1. Weather (best edge — NOAA data advantage)
2. Crypto price (on-chain data advantage)
3. Sports (sentiment + stats advantage)
4. Political (needs Twitter/news API — future)

## Paper Trading Stats (targets to beat)
From @0xwhrrari: 67.5% win rate, $22.10 avg per trade, 2.8% max drawdown
Starting Oracle should target: 60%+ win rate, positive EV per signal

## Output Files
- `agents/oracle/signals.json` — current open signals
- `agents/oracle/paper-log.json` — historical paper trade log
- `agents/oracle/scan-results.json` — latest scan output
