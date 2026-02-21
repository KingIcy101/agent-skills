#!/usr/bin/env python3
"""
Halo Marketing — Healthcare Lead Scraper
Pulls licensed practitioners from the federal NPI Registry (free, no key needed),
with optional enrichment via Apollo.io API (website + email + social).

Usage:
    # Fast: NPI data only (name, phone, address) — great for cold calling
    python3 lead_scraper.py --specialty chiropractor --state VA --limit 500

    # Enriched: adds website + email via Apollo.io (needs APOLLO_KEY)
    python3 lead_scraper.py --specialty dentist --state VA --limit 200 --apollo YOUR_KEY_HERE

    # Filter by city
    python3 lead_scraper.py --specialty chiropractor --state VA --city "Richmond" --limit 100

    # Export to specific file
    python3 lead_scraper.py --specialty chiropractor --state VA --output my_leads.csv

Supported specialties:
    chiropractor, dentist, physical therapist, naturopath,
    acupuncturist, optometrist, podiatrist, med spa, telehealth

Apollo.io enrichment:
    - Free tier: 50 exports/month
    - Paid: starts at $49/month (hundreds of exports)
    - Get key at: https://app.apollo.io/#/settings/integrations/api
    - Adds: website URL, professional email, LinkedIn, company info

Output CSV columns:
    name, practice, specialty, address, city, state, zip,
    phone, website, email, linkedin, source
"""

import requests
import csv
import time
import re
import sys
import argparse
import os
import warnings
import json
from datetime import datetime
from urllib.parse import urlparse, quote_plus

warnings.filterwarnings("ignore")

# ── Specialty taxonomy map ────────────────────────────────────────────────────

SPECIALTY_MAP = {
    "chiropractor":         "Chiropractor",
    "chiro":                "Chiropractor",
    "dentist":              "Dentist",
    "dental":               "Dentist",
    "physical therapist":   "Physical Therapist",
    "pt":                   "Physical Therapist",
    "naturopath":           "Naturopathic Medicine",
    "acupuncturist":        "Acupuncturist",
    "optometrist":          "Optometrist",
    "podiatrist":           "Podiatrist",
    "med spa":              "Dermatology",
    "telehealth":           "Internal Medicine",
    "family medicine":      "Family Medicine",
    "internal medicine":    "Internal Medicine",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/122.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

# ── NPI Registry Fetch ────────────────────────────────────────────────────────

NPI_API = "https://npiregistry.cms.hhs.gov/api/"


def fetch_npi_page(taxonomy_desc: str, state: str, city: str = None,
                   skip: int = 0, page_size: int = 200) -> list:
    params = {
        "version": "2.1",
        "enumeration_type": "NPI-1",
        "taxonomy_description": taxonomy_desc,
        "state": state,
        "limit": min(page_size, 200),
        "skip": skip,
    }
    if city:
        params["city"] = city.upper()
    try:
        r = requests.get(NPI_API, params=params, timeout=20, verify=False)
        r.raise_for_status()
        return r.json().get("results", [])
    except Exception as e:
        print(f"\n  ⚠️  NPI API error (skip={skip}): {e}")
        return []


def parse_npi(record: dict) -> dict:
    basic = record.get("basic", {})
    first = basic.get("first_name", "").title()
    last  = basic.get("last_name", "").title()
    cred  = basic.get("credential", "")
    name  = f"{first} {last}".strip()
    if cred:
        name += f", {cred}"
    org   = basic.get("organization_name", "")

    loc = None
    for addr in record.get("addresses", []):
        if addr.get("address_purpose") == "LOCATION":
            loc = addr
            break
    if not loc and record.get("addresses"):
        loc = record["addresses"][0]

    addr_str = city = state = zip5 = phone = ""
    if loc:
        addr_str = loc.get("address_1", "").title()
        city     = loc.get("city", "").title()
        state    = loc.get("state", "")
        raw_zip  = loc.get("postal_code", "")
        zip5     = raw_zip[:5] if raw_zip else ""
        phone    = loc.get("telephone_number", "")

    specialty = ""
    for t in record.get("taxonomies", []):
        if t.get("primary"):
            specialty = t.get("desc", "")
            break

    return {
        "name": name,
        "practice": org,
        "specialty": specialty,
        "address": addr_str,
        "city": city,
        "state": state,
        "zip": zip5,
        "phone": phone,
        "website": "",
        "email": "",
        "linkedin": "",
        "source": "NPI Registry",
    }


def fetch_all_npi(taxonomy_desc: str, state: str, city: str = None,
                  total_limit: int = 500) -> list:
    results = []
    skip = 0
    page = 200

    print(f"\n📋 NPI Registry → {taxonomy_desc} | {state}"
          + (f" | {city}" if city else "")
          + f" | up to {total_limit} records")

    while len(results) < total_limit:
        batch = fetch_npi_page(taxonomy_desc, state, city, skip, page)
        if not batch:
            break
        results.extend(batch)
        sys.stdout.write(f"\r  Fetched {min(len(results), total_limit)} records...")
        sys.stdout.flush()
        if len(batch) < page:
            break
        skip += page
        time.sleep(0.4)

    print()
    return results[:total_limit]


# ── Apollo.io Enrichment ──────────────────────────────────────────────────────

def enrich_with_apollo(records: list, api_key: str) -> list:
    """
    Use Apollo.io People Search API to find website + email for each record.
    Docs: https://apolloio.github.io/apollo-api-docs/?shell#people-search
    Free tier: 50 exports/month. Paid: $49+/month.
    """
    print(f"\n🔍 Apollo.io enrichment for {len(records)} records...")
    enriched = 0
    errors = 0

    for i, rec in enumerate(records):
        sys.stdout.write(f"\r  [{i+1}/{len(records)}] {rec['name'][:40]:<42}")
        sys.stdout.flush()

        first, last = _split_name(rec["name"])
        if not last:
            continue

        try:
            payload = {
                "api_key": api_key,
                "first_name": first,
                "last_name": last,
                "organization_locations": [rec["city"] + ", " + rec["state"]],
                "person_titles": [rec["specialty"]],
                "page": 1,
                "per_page": 1,
            }
            r = requests.post(
                "https://api.apollo.io/v1/people/search",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            data = r.json()
            people = data.get("people", [])

            if people:
                person = people[0]
                org = (person.get("organization") or {})
                rec["website"]  = org.get("website_url", "") or ""
                rec["email"]    = person.get("email", "") or ""
                rec["linkedin"] = person.get("linkedin_url", "") or ""
                if rec["email"] or rec["website"]:
                    enriched += 1

        except Exception as e:
            errors += 1

        time.sleep(0.8)  # Rate limit: ~75 req/min on free tier

    print(f"\n  ✅ Apollo enriched {enriched}/{len(records)} records "
          f"({errors} errors)")
    return records


def _split_name(full_name: str):
    """Split 'Joe Abretski, DC' → ('Joe', 'Abretski')."""
    clean = re.sub(r",\s*(DC|D\.C\.|DDS|MD|DO|PT|NP|PA|DC|OD|RD)\.?.*$",
                   "", full_name, flags=re.IGNORECASE).strip()
    parts = clean.split()
    if len(parts) >= 2:
        return parts[0], " ".join(parts[1:])
    return clean, ""


# ── Simple Email Guess (Fallback) ─────────────────────────────────────────────

def guess_email_from_website(rec: dict) -> str:
    """If we have a website, try scraping the contact page for an email."""
    url = rec.get("website", "")
    if not url or "://" not in url:
        return ""
    
    email_re = re.compile(
        r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
    )
    junk = {"example", "wixpress", "sentry", "adobe", ".png", ".jpg",
            "wordpress", "squarespace"}

    pages = [url, url.rstrip("/") + "/contact",
             url.rstrip("/") + "/contact-us"]

    for page in pages:
        try:
            r = requests.get(page, headers=HEADERS, timeout=7,
                             verify=False, allow_redirects=True)
            if r.status_code != 200:
                continue
            emails = email_re.findall(r.text)
            for e in emails:
                if len(e) < 80 and not any(j in e.lower() for j in junk):
                    return e.lower()
        except Exception:
            pass
        time.sleep(0.3)
    return ""


# ── CSV Export ────────────────────────────────────────────────────────────────

FIELDS = ["name", "practice", "specialty", "address", "city", "state",
          "zip", "phone", "website", "email", "linkedin", "source"]


def save_csv(records: list, path: str) -> None:
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(records)


def print_summary(records: list, path: str) -> None:
    n = len(records)
    def pct(k): return sum(1 for r in records if r.get(k)) * 100 // n if n else 0
    def cnt(k): return sum(1 for r in records if r.get(k))

    print(f"\n{'='*56}")
    print(f"  ✅  {n} practitioners")
    print(f"  📞  Phone:    {cnt('phone'):>4}  ({pct('phone')}%)")
    print(f"  🌐  Website:  {cnt('website'):>4}  ({pct('website')}%)")
    print(f"  ✉️   Email:    {cnt('email'):>4}  ({pct('email')}%)")
    print(f"  🔗  LinkedIn: {cnt('linkedin'):>4}  ({pct('linkedin')}%)")
    print(f"  📄  Saved → {path}")
    print(f"{'='*56}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    p = argparse.ArgumentParser(
        description="Halo Marketing — Healthcare Practitioner Lead Scraper"
    )
    p.add_argument("--specialty", "-s", default="chiropractor",
                   help="chiropractor | dentist | physical therapist | etc.")
    p.add_argument("--state", "-st", default="VA",
                   help="2-letter US state code (default: VA)")
    p.add_argument("--city", "-c", default=None,
                   help="Optional city filter (e.g. Richmond, Norfolk, Roanoke)")
    p.add_argument("--limit", "-l", type=int, default=200,
                   help="Max records to pull (default: 200, max: ~5000+)")
    p.add_argument("--apollo", "-a", default=None,
                   help="Apollo.io API key for email/website enrichment")
    p.add_argument("--output", "-o", default=None,
                   help="Output CSV path (auto-named if not set)")
    args = p.parse_args()

    # Resolve specialty
    taxonomy = SPECIALTY_MAP.get(args.specialty.lower(), args.specialty)

    # Output path
    if not args.output:
        ts = datetime.now().strftime("%Y%m%d_%H%M")
        slug = args.specialty.replace(" ", "_").lower()
        state_low = args.state.lower()
        city_slug = ("_" + args.city.replace(" ", "").lower()) if args.city else ""
        args.output = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            f"leads_{slug}_{state_low}{city_slug}_{ts}.csv"
        )

    print(f"\n🌟  Halo Marketing Lead Scraper")
    print(f"    Specialty : {taxonomy}")
    print(f"    Location  : {args.state}" + (f", {args.city}" if args.city else ""))
    print(f"    Limit     : {args.limit}")
    print(f"    Enrich    : {'Apollo.io ✅' if args.apollo else 'OFF (NPI only)'}")

    # Step 1: NPI
    raw = fetch_all_npi(taxonomy, args.state, args.city, args.limit)
    if not raw:
        print("\n❌ No results. Try a different specialty or state.")
        return

    records = [parse_npi(r) for r in raw]
    print(f"  ✅ {len(records)} records from NPI (100% have practice address)")

    # Step 2: Apollo enrichment (optional)
    if args.apollo:
        records = enrich_with_apollo(records, args.apollo)

    # Step 3: Email scrape from website (if website found)
    if any(r.get("website") for r in records):
        print("\n📧 Scraping emails from known websites...")
        for r in records:
            if r.get("website") and not r.get("email"):
                r["email"] = guess_email_from_website(r)

    # Save
    save_csv(records, args.output)
    print_summary(records, args.output)

    if not args.apollo:
        print("""
💡 To add website + email enrichment:
   1. Get a free Apollo.io API key at:
      https://app.apollo.io/#/settings/integrations/api
   2. Run again with:
      python3 lead_scraper.py --specialty chiropractor --state VA --apollo YOUR_KEY
   Free tier: 50 enrichments/month
   Paid tier ($49/mo): unlimited exports
""")


if __name__ == "__main__":
    main()
