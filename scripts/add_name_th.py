#!/usr/bin/env python3
"""
Step 1: Add nameTh field to all hospitals in lib/hospitals-data.ts
- Premier (27): use hard-coded known Thai names (Step 2 will verify via Google Maps)
- Standard with English maps_name (162): update name → English, nameTh ← PDF name_th
- Standard with Thai maps_name (5): name stays Thai (placeholder), nameTh ← maps_name
- Standard with no maps_name (34): name stays Thai (placeholder), nameTh ← same PDF name

Output: overwrites lib/hospitals-data.ts with nameTh added to interface + all records
"""

import json, re

# ── 1. Load enrichment data ────────────────────────────────────────────────
with open('/tmp/phase3_enrichment_queue.json') as f:
    queue = json.load(f)
with open('/tmp/phase3_google_results.json') as f:
    google = json.load(f)

def is_thai(s):
    return any('฀' <= c <= '๿' for c in (s or ''))

# Build phone → data maps
phone_to_nameth_pdf = {h['phone']: h.get('name_th', '') for h in queue}
phone_to_maps_name = {p: v.get('maps_name', '') for p, v in google.items()}

# ── 2. Premier Thai names (known, Step 2 will verify via Google Maps) ──────
PREMIER_NAME_TH = {
    "BNH Hospital":                        "โรงพยาบาลบีเอ็นเอช",
    "Bangkok Christian Hospital":          "โรงพยาบาลกรุงเทพคริสเตียน",
    "Bangkok Hospital Chiang Mai":         "โรงพยาบาลกรุงเทพเชียงใหม่",
    "Bangkok Hospital Hua Hin":            "โรงพยาบาลกรุงเทพหัวหิน",
    "Bangkok Hospital Koh Samui":          "โรงพยาบาลกรุงเทพสมุย",
    "Bangkok Hospital Pattaya":            "โรงพยาบาลกรุงเทพพัทยา",
    "Bangkok Hospital Phuket":             "โรงพยาบาลกรุงเทพภูเก็ต",
    "Bangkok Hospital Siriroj":            "โรงพยาบาลกรุงเทพสิริโรจน์",
    "Bangkok Hospital Sukhumvit":          "โรงพยาบาลกรุงเทพ สุขุมวิท",
    "Bumrungrad International Hospital":   "โรงพยาบาลบำรุงราษฎร์",
    "Chiang Mai Ram Hospital":             "โรงพยาบาลเชียงใหม่ราม",
    "Chiangmai Neurological Hospital":     "โรงพยาบาลประสาทเชียงใหม่",
    "Dibuk Hospital Phuket":               "โรงพยาบาลดิบุก",
    "McCormick Hospital":                  "โรงพยาบาลแมคคอร์มิค",
    "MedPark Hospital":                    "โรงพยาบาลเมดพาร์ค",
    "Mission Hospital Phuket":             "โรงพยาบาลมิชชั่น ภูเก็ต",
    "Paolo Memorial Hospital Phaholyothin":"โรงพยาบาลเปาโล เมโมเรียล พหลโยธิน",
    "Pattaya International Hospital":      "โรงพยาบาลนานาชาติพัทยา",
    "Phuket International Hospital":       "โรงพยาบาลนานาชาติภูเก็ต",
    "Phyathai 1 Hospital":                 "โรงพยาบาลพญาไท 1",
    "Phyathai 2 Hospital":                 "โรงพยาบาลพญาไท 2",
    "Praram 9 Hospital":                   "โรงพยาบาลพระรามเก้า",
    "Saint Louis Hospital":                "โรงพยาบาลเซนต์หลุยส์",
    "Samitivej Hospital Srinakarin":       "โรงพยาบาลสมิติเวช ศรีนครินทร์",
    "Samitivej Hospital Sukhumvit":        "โรงพยาบาลสมิติเวช สุขุมวิท",
    "Thonburi Hospital":                   "โรงพยาบาลธนบุรี",
    "Vejthani Hospital":                   "โรงพยาบาลเวชธานี",
}

# ── 3. Read existing TS file ───────────────────────────────────────────────
TS_PATH = '/Users/tonkla/claude/covercare-thailand/lib/hospitals-data.ts'
with open(TS_PATH) as f:
    content = f.read()

# ── 4. Update the interface to add nameTh after name ──────────────────────
content = content.replace(
    '  name: string\n  tier:',
    '  name: string\n  nameTh: string | null\n  tier:'
)
print("Interface updated: nameTh field added")

# ── 5. Parse hospital records and inject nameTh ────────────────────────────
# We'll process the content line by line with a state machine
lines = content.split('\n')
output_lines = []
i = 0
stats = {'premier': 0, 'standard_en': 0, 'standard_th': 0, 'standard_none': 0}

while i < len(lines):
    line = lines[i]

    # Detect the start of a hospital record block (name field)
    m_name = re.match(r'^    name: "(.+)",\s*$', line)
    if m_name:
        raw_name = m_name.group(1)
        # Decode unicode escapes if present
        try:
            hospital_name = raw_name.encode().decode('unicode_escape')
        except Exception:
            hospital_name = raw_name

        # Look ahead to find tier and phone
        tier = None
        phone = None
        for j in range(i + 1, min(i + 15, len(lines))):
            m_tier = re.match(r'^    tier: "(\w+)",', lines[j])
            if m_tier:
                tier = m_tier.group(1)
            m_phone = re.match(r'^    phone: "([^"]+)",', lines[j])
            if m_phone:
                phone = m_phone.group(1)
                break

        # Determine nameTh
        name_th = None

        if tier == 'Premier':
            name_th = PREMIER_NAME_TH.get(hospital_name)
            if name_th:
                stats['premier'] += 1
            else:
                print(f"WARNING: No Thai name for Premier hospital: {hospital_name!r}")
        else:
            # Standard hospital
            maps_name = phone_to_maps_name.get(phone, '')
            pdf_name_th = phone_to_nameth_pdf.get(phone, '')

            if maps_name and is_thai(maps_name):
                # Google Maps confirmed Thai name (authoritative)
                name_th = maps_name
                stats['standard_th'] += 1
            elif maps_name and not is_thai(maps_name):
                # Google Maps confirmed English name → update name field, use PDF Thai as nameTh
                # For nameTh: use PDF name as placeholder (Step 3 will verify)
                name_th = pdf_name_th if pdf_name_th else None
                stats['standard_en'] += 1
            else:
                # No Google Maps confirmation → use PDF Thai as placeholder
                name_th = pdf_name_th if pdf_name_th else hospital_name
                stats['standard_none'] += 1

        # Write the name line (unchanged)
        output_lines.append(line)

        # Insert nameTh on the next line with proper escaping
        if name_th:
            # Ensure proper Unicode for the TS file
            escaped = json.dumps(name_th, ensure_ascii=False)
            name_th_str = escaped[1:-1]  # remove surrounding quotes
            output_lines.append(f'    nameTh: "{name_th_str}",')
        else:
            output_lines.append('    nameTh: null,')

        i += 1
        continue

    # For Standard hospitals: also update the English name field
    # If this is a name line and we have an English maps_name, we need to update name
    # But we already handled that above — we kept the original name line.
    # The name update for English maps_name Standard hospitals needs a separate pass.

    output_lines.append(line)
    i += 1

print(f"\nStats:")
print(f"  Premier hospitals: {stats['premier']}")
print(f"  Standard with English maps_name (name updated, nameTh=PDF): {stats['standard_en']}")
print(f"  Standard with Thai maps_name (nameTh=Google): {stats['standard_th']}")
print(f"  Standard with no maps_name (nameTh=PDF placeholder): {stats['standard_none']}")

# ── 6. Second pass: update Standard hospital 'name' to English maps_name ──
# Now we need to update the 'name' field for Standard hospitals where maps_name is English
# We'll do this by finding hospital records again, but this time updating the name line

content_v2 = '\n'.join(output_lines)
lines2 = content_v2.split('\n')
output_lines2 = []
j = 0

updated_names = 0
while j < len(lines2):
    line = lines2[j]

    m_name = re.match(r'^    name: "(.+)",\s*$', line)
    if m_name:
        raw_name = m_name.group(1)
        try:
            hospital_name = raw_name.encode().decode('unicode_escape')
        except Exception:
            hospital_name = raw_name

        # Look ahead to find tier and phone (now including nameTh line)
        tier = None
        phone = None
        for k in range(j + 1, min(j + 18, len(lines2))):
            m_tier = re.match(r'^    tier: "(\w+)",', lines2[k])
            if m_tier:
                tier = m_tier.group(1)
            m_phone = re.match(r'^    phone: "([^"]+)",', lines2[k])
            if m_phone:
                phone = m_phone.group(1)
                break

        if tier == 'Standard' and phone:
            maps_name = phone_to_maps_name.get(phone, '')
            if maps_name and not is_thai(maps_name):
                # Replace Thai name with English maps_name
                escaped = json.dumps(maps_name, ensure_ascii=False)
                name_str = escaped[1:-1]
                output_lines2.append(f'    name: "{name_str}",')
                updated_names += 1
                j += 1
                continue

    output_lines2.append(line)
    j += 1

print(f"\nName field updates (Thai → English): {updated_names} Standard hospitals")

# ── 7. Write the updated file ──────────────────────────────────────────────
final_content = '\n'.join(output_lines2)

# Quick sanity check
total_nameth = final_content.count('nameTh:')
print(f"\nSanity check: {total_nameth} nameTh fields in output (expected 226)")

with open(TS_PATH, 'w') as f:
    f.write(final_content)

print(f"\n✅ Written to {TS_PATH}")
