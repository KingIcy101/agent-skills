# Halo Marketing Tools

---

## lead_scraper.py — Healthcare Practitioner Lead Scraper

Pulls licensed practitioners from the **federal NPI Registry** (always free, no API key needed). Every licensed healthcare provider in the US is in this database.

### What you get
- ✅ Full name (with credentials: DC, DDS, MD, etc.)
- ✅ Practice/organization name
- ✅ Specialty
- ✅ Practice address
- ✅ City, state, zip
- ✅ Direct practice phone number (100% coverage)
- ⬜ Website (requires Apollo.io key)
- ⬜ Email (requires Apollo.io key)

### Quick start

```bash
cd ~/.openclaw/workspace/tools

# Chiropractors in Virginia (500 records, ~20 seconds)
python3 lead_scraper.py --specialty chiropractor --state VA --limit 500

# Dentists in Virginia
python3 lead_scraper.py --specialty dentist --state VA --limit 500

# Filter by city
python3 lead_scraper.py --specialty chiropractor --state VA --city Richmond --limit 200

# With Apollo.io enrichment (adds website + email)
python3 lead_scraper.py --specialty chiropractor --state VA --limit 200 --apollo YOUR_API_KEY
```

### All options

| Flag | Default | Description |
|---|---|---|
| `--specialty` / `-s` | `chiropractor` | See supported specialties below |
| `--state` / `-st` | `VA` | Any 2-letter US state |
| `--city` / `-c` | _(all cities)_ | Filter by city (e.g. Richmond, Norfolk) |
| `--limit` / `-l` | `200` | Max records (can go up to 5,000+) |
| `--apollo` / `-a` | _(none)_ | Apollo.io API key for email/website enrichment |
| `--output` / `-o` | _(auto-named)_ | Output CSV filename |

### Supported specialties

```
chiropractor      dentist         physical therapist
naturopath        acupuncturist   optometrist
podiatrist        med spa         telehealth
family medicine   internal medicine
```

### Importing to Google Sheets

1. Open Google Sheets
2. File → Import → Upload → select the CSV file
3. Import as: "Comma separated values"
4. Done — all 500+ records populate instantly

### Adding website + email (Apollo.io)

The NPI Registry doesn't have website/email data. To enrich:

1. Create a free account at https://app.apollo.io
2. Go to Settings → Integrations → API → Create API Key
3. Run with `--apollo YOUR_KEY_HERE`
4. Free tier: 50 enrichments/month
5. Basic paid ($49/month): 1,000 exports/month — enough for Halo's needs

### Virginia lead files (pre-pulled 2026-02-21)

| File | Contents |
|---|---|
| `leads_chiro_VA.csv` | 500 Virginia chiropractors |
| `leads_dentist_VA.csv` | 500 Virginia dentists |

### Need more? Pull the full state:

```bash
# Full Virginia chiropractor list (~1,800 total licensed)
python3 lead_scraper.py --specialty chiropractor --state VA --limit 2000

# Maryland (close to Virginia, good for expansion)
python3 lead_scraper.py --specialty chiropractor --state MD --limit 500
```
