#!/usr/bin/env python3
"""
Extract qualifying hospitals from Allianz Ayudhya Hospital Network PDF.
Uses coordinate-based approach per page.

PDF structure (26 pages):
  Pages 1-3:   Bangkok hospitals (rows 1-81)
  Pages 4-6:   Bangkok clinics — SKIP
  Pages 7-8:   Greater Bangkok hospitals (rows 1-36)
  Page 9:      Greater Bangkok clinics — SKIP
  Pages 10-11: Central/West hospitals (rows 1-51)
  Page 12:     Central/West clinics — SKIP
  Pages 13-14: North hospitals (rows 1-40)
  Pages 15-16: Northeast hospitals (rows 1-43)
  Pages 17-18: East hospitals (rows 1-38)
  Pages 19-22: East clinics — SKIP
  Pages 23-24: South hospitals (rows 1-48)
  Page 25:     South clinics — SKIP
  Page 26:     Summary — SKIP

Column x-positions (from page 1 coordinate analysis):
  Row number:       x  20-45
  Hospital name:    x  42-210
  Province (Thai):  x 210-245
  Phone:            x 245-340
  Life IPD Ind:     x 337-365  ← must have √
  Life OPD Ind:     x 473-498  ← must have √
"""

import pdfplumber
import json
import re
from collections import defaultdict

PDF_PATH = "/Users/tonkla/.claude/projects/-Users-tonkla-claude/3057c5f4-8e60-452e-a830-9d41d62c6d7f/tool-results/webfetch-1779128988183-5oou2i.pdf"
OUTPUT_PATH = "/Users/tonkla/claude/covercare-thailand/scripts/hospitals_allianz_network.json"

CHECK = "√"

# Column x-boundaries
COL_ROW_NUM  = (18, 46)
COL_NAME     = (42, 200)    # hospital name — ends before province column
COL_PROVINCE = (200, 243)   # province — x starts ~205-216 depending on page
COL_PHONE    = (243, 342)   # phone — x starts ~245
COL_LIFE_IPD = (333, 368)   # Life IPD Individual Health Insurance
COL_LIFE_OPD = (470, 500)   # Life OPD Individual Health Insurance

def in_col(x, col_range):
    return col_range[0] <= x <= col_range[1]

def is_clinic_page(page):
    """Detect clinic/non-hospital pages by checking header for คลินิก keyword."""
    words = page.extract_words(x_tolerance=5, y_tolerance=5)
    header_words = [w['text'] for w in words if w['top'] < 200]
    header_text = ' '.join(header_words)
    # Clinic sections have คลินิก or คลนิกิ (garbled rendering) in header
    return 'คลินิก' in header_text or 'คลนิกิ' in header_text or 'คลนิิก' in header_text

def get_section_name(page):
    """Extract section name from page header (e.g., กรุงเทพ, ปริมณฑล, etc.)."""
    words = page.extract_words(x_tolerance=5, y_tolerance=5)
    # Section name appears at the very top (y < 130) left-center of page
    top_words = [w['text'] for w in words if w['top'] < 130 and w['x0'] > 50]
    return ' '.join(top_words) if top_words else ''

def extract_page_hospitals(page, page_num):
    """Extract hospital data from a single page using word coordinates."""
    words = page.extract_words(x_tolerance=5, y_tolerance=8, keep_blank_chars=False)

    # Group words by y-position bucket (8px slots = safe for 14px row spacing)
    y_groups = defaultdict(list)
    for w in words:
        y_key = round(w['top'] / 8) * 8
        y_groups[y_key].append(w)

    hospitals = []
    for y_key in sorted(y_groups.keys()):
        row_words = y_groups[y_key]

        # Find row number
        row_nums = [w for w in row_words
                    if in_col(w['x0'], COL_ROW_NUM) and re.match(r'^\d+$', w['text'])]
        if not row_nums:
            continue

        row_num = int(row_nums[0]['text'])

        # Hospital name (words in name column, sorted by x)
        name_words = sorted(
            [w for w in row_words if in_col(w['x0'], COL_NAME)],
            key=lambda w: w['x0']
        )
        name_th = ' '.join(w['text'] for w in name_words).strip()

        # Province (words in province column)
        prov_words = sorted(
            [w for w in row_words if in_col(w['x0'], COL_PROVINCE)],
            key=lambda w: w['x0']
        )
        province_th = ' '.join(w['text'] for w in prov_words).strip()

        # Phone (words in phone column)
        phone_words = sorted(
            [w for w in row_words if in_col(w['x0'], COL_PHONE)],
            key=lambda w: w['x0']
        )
        phone = ' '.join(w['text'] for w in phone_words).strip()

        # Life IPD: √ at x in COL_LIFE_IPD
        life_ipd_checks = [w for w in row_words
                           if in_col(w['x0'], COL_LIFE_IPD) and CHECK in w['text']]
        # Life OPD: √ at x in COL_LIFE_OPD
        life_opd_checks = [w for w in row_words
                           if in_col(w['x0'], COL_LIFE_OPD) and CHECK in w['text']]

        has_ipd = len(life_ipd_checks) > 0
        has_opd = len(life_opd_checks) > 0

        hospitals.append({
            'row_num': row_num,
            'name_th': name_th,
            'province_th': province_th,
            'phone': phone,
            'has_life_ipd': has_ipd,
            'has_life_opd': has_opd,
            '_page': page_num,
        })

    return hospitals

def main():
    all_rows = []
    skipped_pages = []

    print(f"Opening PDF: {PDF_PATH}")

    with pdfplumber.open(PDF_PATH) as pdf:
        print(f"Total pages: {len(pdf.pages)}")
        current_section = "unknown"

        for page_num, page in enumerate(pdf.pages, 1):
            # Detect clinic pages and skip
            if is_clinic_page(page):
                section = get_section_name(page)
                print(f"  Page {page_num}: CLINIC page (section: {section}) — skipping")
                skipped_pages.append(page_num)
                continue

            # Get section header
            section_text = get_section_name(page)
            if section_text:
                current_section = section_text

            page_hospitals = extract_page_hospitals(page, page_num)

            # Tag each hospital with section
            for h in page_hospitals:
                h['_section'] = current_section

            print(f"  Page {page_num}: {len(page_hospitals)} hospital rows (section: {current_section[:40]})")
            all_rows.extend(page_hospitals)

    # Post-process: fix empty names by searching in adjacent y-range
    # (handles PDF merged cells where name appears at different y than row number)
    page_word_cache = {}

    def get_page_words(page_idx, pdf):
        if page_idx not in page_word_cache:
            page_word_cache[page_idx] = pdf.pages[page_idx].extract_words(
                x_tolerance=5, y_tolerance=8, keep_blank_chars=False)
        return page_word_cache[page_idx]

    with pdfplumber.open(PDF_PATH) as pdf2:
        for row in all_rows:
            if not row['name_th'].strip():
                page_idx = row['_page'] - 1
                page_words = get_page_words(page_idx, pdf2)
                # Find row number position
                rn_str = str(row['row_num'])
                rn_word = next((w for w in page_words
                                if in_col(w['x0'], COL_ROW_NUM) and w['text'] == rn_str),
                               None)
                if rn_word:
                    center_y = rn_word['top']
                    # Search wider ±25px for name words
                    nearby_name_words = [
                        w for w in page_words
                        if abs(w['top'] - center_y) <= 25
                        and in_col(w['x0'], COL_NAME)
                    ]
                    if nearby_name_words:
                        # Pick words closest in y to center_y, by sorting
                        nearby_name_words.sort(key=lambda w: (abs(w['top'] - center_y), w['x0']))
                        # Only take words from the closest y-group
                        best_y = nearby_name_words[0]['top']
                        closest_group = [w for w in nearby_name_words if abs(w['top'] - best_y) <= 5]
                        row['name_th'] = ' '.join(w['text'] for w in sorted(closest_group, key=lambda w: w['x0']))
                        print(f"  Fixed empty name for row {row['row_num']} p{row['_page']}: {repr(row['name_th'])}")

    # Dedup: use (name_th + province_th) as key
    # If same name+province appears multiple times, merge IPD/OPD flags
    dedup_map = {}
    for h in all_rows:
        key = (h['name_th'].replace(' ', ''), h['province_th'].replace(' ', ''))
        if key not in dedup_map:
            dedup_map[key] = h.copy()
        else:
            # Merge flags
            dedup_map[key]['has_life_ipd'] = dedup_map[key]['has_life_ipd'] or h['has_life_ipd']
            dedup_map[key]['has_life_opd'] = dedup_map[key]['has_life_opd'] or h['has_life_opd']

    all_unique = list(dedup_map.values())

    # Filter: must have BOTH Life IPD and Life OPD
    qualifying = [h for h in all_unique if h['has_life_ipd'] and h['has_life_opd']]

    # Clean up internal keys
    for h in qualifying:
        h.pop('_page', None)
        h.pop('_section', None)
        h.pop('_y', None)

    # Sort by province then name
    qualifying.sort(key=lambda h: (h['province_th'], h['name_th']))

    print(f"\n=== Summary ===")
    print(f"Total rows found: {len(all_rows)}")
    print(f"After dedup by name+province: {len(all_unique)}")
    print(f"  IPD + OPD (qualifying): {len([h for h in all_unique if h['has_life_ipd'] and h['has_life_opd']])}")
    print(f"  IPD only:               {len([h for h in all_unique if h['has_life_ipd'] and not h['has_life_opd']])}")
    print(f"  OPD only:               {len([h for h in all_unique if not h['has_life_ipd'] and h['has_life_opd']])}")
    print(f"  Neither:                {len([h for h in all_unique if not h['has_life_ipd'] and not h['has_life_opd']])}")
    print(f"Skipped pages (clinics): {skipped_pages}")

    # Province distribution
    from collections import Counter
    province_counts = Counter(h['province_th'] for h in qualifying)
    print(f"\nProvince distribution (qualifying hospitals):")
    for prov, cnt in province_counts.most_common(30):
        print(f"  {prov}: {cnt}")

    # Write output
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(qualifying, f, ensure_ascii=False, indent=2)

    print(f"\nOutput written to: {OUTPUT_PATH} ({len(qualifying)} hospitals)")

    # Sample output
    print("\nFirst 20 qualifying hospitals:")
    for h in qualifying[:20]:
        ipd = "IPD✓" if h['has_life_ipd'] else "IPD✗"
        opd = "OPD✓" if h['has_life_opd'] else "OPD✗"
        print(f"  {h['name_th'][:35]:35s} | {h['province_th']:20s} | {ipd} {opd}")

    return qualifying

if __name__ == "__main__":
    main()
