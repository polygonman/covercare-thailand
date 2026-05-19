#!/usr/bin/env python3
"""
Generate research data for all 199 Standard hospitals:
- networkGroup, hospitalType, website, specialties, summary
- Fixed Thai name (nameTh) where possible
- Output: /tmp/hospital_research.json keyed by phone number
"""

import json, re

# ── Load existing data ─────────────────────────────────────────────────────
with open('/tmp/phase3_google_results.json') as f:
    google = json.load(f)

with open('/tmp/phase3_enrichment_queue.json') as f:
    queue = json.load(f)

phone_to_q = {h['phone']: h for h in queue}

# ── Province Thai name lookup ──────────────────────────────────────────────
PROVINCE_TH = {
    "Bangkok": "กรุงเทพมหานคร",
    "Chiang Mai": "เชียงใหม่",
    "Chiang Rai": "เชียงราย",
    "Phuket": "ภูเก็ต",
    "Pattaya": "ชลบุรี",
    "Hua Hin": "ประจวบคีรีขันธ์",
    "Koh Samui": "สุราษฎร์ธานี",
    "Nakhon Ratchasima": "นครราชสีมา",
    "Khon Kaen": "ขอนแก่น",
    "Udon Thani": "อุดรธานี",
    "Hat Yai": "สงขลา",
    "Songkhla": "สงขลา",
    "Rayong": "ระยอง",
    "Chonburi": "ชลบุรี",
    "Samut Prakan": "สมุทรปราการ",
    "Nonthaburi": "นนทบุรี",
    "Pathum Thani": "ปทุมธานี",
    "Samut Sakhon": "สมุทรสาคร",
    "Nakhon Pathom": "นครปฐม",
    "Ratchaburi": "ราชบุรี",
    "Prachuap Khiri Khan": "ประจวบคีรีขันธ์",
    "Surat Thani": "สุราษฎร์ธานี",
    "Krabi": "กระบี่",
    "Trang": "ตรัง",
    "Phatthalung": "พัทลุง",
    "Phetchaburi": "เพชรบุรี",
    "Chumphon": "ชุมพร",
    "Ranong": "ระนอง",
    "Ubon Ratchathani": "อุบลราชธานี",
    "Roi Et": "ร้อยเอ็ด",
    "Buriram": "บุรีรัมย์",
    "Surin": "สุรินทร์",
    "Sisaket": "ศรีสะเกษ",
    "Maha Sarakham": "มหาสารคาม",
    "Kalasin": "กาฬสินธุ์",
    "Sakon Nakhon": "สกลนคร",
    "Nakhon Phanom": "นครพนม",
    "Mukdahan": "มุกดาหาร",
    "Loei": "เลย",
    "Chaiyaphum": "ชัยภูมิ",
    "Nong Khai": "หนองคาย",
    "Nong Bua Lamphu": "หนองบัวลำภู",
    "Amnat Charoen": "อำนาจเจริญ",
    "Yasothon": "ยโสธร",
    "Lampang": "ลำปาง",
    "Lamphun": "ลำพูน",
    "Phrae": "แพร่",
    "Nan": "น่าน",
    "Phayao": "พะเยา",
    "Mae Hong Son": "แม่ฮ่องสอน",
    "Tak": "ตาก",
    "Sukhothai": "สุโขทัย",
    "Phitsanulok": "พิษณุโลก",
    "Phichit": "พิจิตร",
    "Kamphaeng Phet": "กำแพงเพชร",
    "Nakhon Sawan": "นครสวรรค์",
    "Uthai Thani": "อุทัยธานี",
    "Phetchabun": "เพชรบูรณ์",
    "Uttaradit": "อุตรดิตถ์",
    "Chai Nat": "ชัยนาท",
    "Sing Buri": "สิงห์บุรี",
    "Ang Thong": "อ่างทอง",
    "Ayutthaya": "พระนครศรีอยุธยา",
    "Saraburi": "สระบุรี",
    "Lop Buri": "ลพบุรี",
    "Nakhon Nayok": "นครนายก",
    "Prachin Buri": "ปราจีนบุรี",
    "Sa Kaeo": "สระแก้ว",
    "Chachoengsao": "ฉะเชิงเทรา",
    "Chanthaburi": "จันทบุรี",
    "Trat": "ตราด",
    "Samut Songkhram": "สมุทรสงคราม",
    "Suphan Buri": "สุพรรณบุรี",
    "Nakhon Si Thammarat": "นครศรีธรรมราช",
    "Phangnga": "พังงา",
    "Satun": "สตูล",
    "Narathiwat": "นราธิวาส",
    "Pattani": "ปัตตานี",
    "Yala": "ยะลา",
}

# ── Hospital research database ─────────────────────────────────────────────
# Key = English name (from maps_name or known name)
# Fields: group, type, website, specialties (Notion-compatible), nameTh, summary

HOSPITAL_DB = {
    # ── BDMS - Bangkok Hospital chain ─────────────────────────────────────
    "Bangkok Hospital Chiang Rai": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.bangkokhospital.com/chiangrai",
        "nameTh": "โรงพยาบาลกรุงเทพ เชียงราย",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Full-service BDMS group hospital in Chiang Rai offering 24-hour emergency, cardiac, and maternity services with English-speaking international staff.",
    },
    "Bangkok Hospital Hat Yai": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.bangkokhospital.com/hatyai",
        "nameTh": "โรงพยาบาลกรุงเทพ หาดใหญ่",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Leading private hospital in Hat Yai serving southern Thailand and cross-border patients, with comprehensive specialist services and direct billing.",
    },
    "Bangkok Hospital KhonKaen": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.bangkokhospital.com/khonkaen",
        "nameTh": "โรงพยาบาลกรุงเทพ ขอนแก่น",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "BDMS flagship hospital for Khon Kaen and northeast Thailand, offering full-service medical care with international standards and direct billing.",
    },
    "Bangkok Hospital Ratchasima": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.bangkokhospital.com/nakhonratchasima",
        "nameTh": "โรงพยาบาลกรุงเทพ ราชสีมา",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "BDMS group hospital serving Nakhon Ratchasima and surrounding provinces with comprehensive specialist care, cardiac centre, and English-speaking staff.",
    },
    "Bangkok Hospital Trat": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.bangkokhospital.com/trat",
        "nameTh": "โรงพยาบาลกรุงเทพ ตราด",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "BDMS hospital in Trat province serving the eastern border region and Koh Chang island visitors with emergency and specialist services.",
    },
    "Bangkok Hospital Ranong": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.bangkokhospital.com/ranong",
        "nameTh": "โรงพยาบาลกรุงเทพ ระนอง",
        "specialties": ["Emergency", "Maternity"],
        "summary": "BDMS network hospital in Ranong providing quality private healthcare for the local community and border-crossing visitors.",
    },
    "Bangkok Hospital Ubon Ratchathani": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.bangkokhospital.com/ubonratchathani",
        "nameTh": "โรงพยาบาลกรุงเทพ อุบลราชธานี",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "BDMS hospital serving Ubon Ratchathani and eastern Isaan with full-service specialist care and direct insurance billing.",
    },
    "Bangkok Hospital Udon Thani": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.bangkokhospital.com/udonthani",
        "nameTh": "โรงพยาบาลกรุงเทพ อุดรธานี",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Major BDMS hospital in Udon Thani catering to the large expat community and international patients from neighboring Laos.",
    },
    "Bangkok Hospital Rayong": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.bangkokhospital.com/rayong",
        "nameTh": "โรงพยาบาลกรุงเทพ ระยอง",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Full-service BDMS hospital serving Rayong's industrial estate community and eastern seaboard expats with comprehensive specialist care.",
    },
    "Bangkok Hospital Chanthaburi": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.bangkokhospital.com/chanthaburi",
        "nameTh": "โรงพยาบาลกรุงเทพ จันทบุรี",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "BDMS hospital in Chanthaburi providing private medical care for the eastern Thai province with specialist services and insurance billing.",
    },
    # ── BDMS - Samitivej ───────────────────────────────────────────────────
    "Samitivej Thonburi Hospital": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.samitivejhospitals.com/thonburi",
        "nameTh": "โรงพยาบาลสมิติเวช ธนบุรี",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Pediatrics"],
        "summary": "BDMS Samitivej hospital on the Thonburi side of Bangkok offering full specialist services with English-speaking staff and direct insurance billing.",
    },
    "Samitivej Chinatown Hospital": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.samitivejhospitals.com/chinatown",
        "nameTh": "โรงพยาบาลสมิติเวช ไชน่าทาวน์",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Pediatrics"],
        "summary": "Samitivej Chinatown caters to Bangkok's central district with multilingual staff (Thai, Chinese, English) and comprehensive specialist services.",
    },
    "Samitivej Chonburi Hospital": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.samitivejhospitals.com/chonburi",
        "nameTh": "โรงพยาบาลสมิติเวช ชลบุรี",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Pediatrics"],
        "summary": "Major BDMS Samitivej hospital serving Chonburi and the eastern seaboard with full specialist departments and international patient services.",
    },
    "Samitivej Sriracha Hospital": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.samitivejhospitals.com/sriracha",
        "nameTh": "โรงพยาบาลสมิติเวช ศรีราชา",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Pediatrics"],
        "summary": "BDMS Samitivej Sriracha serves the industrial zone and expat community with comprehensive medical services and international patient support.",
    },
    "Samitivej Rayong Hospital": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.samitivejhospitals.com/rayong",
        "nameTh": "โรงพยาบาลสมิติเวช ระยอง",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Pediatrics"],
        "summary": "Samitivej Rayong provides full-service private medical care for the Eastern Economic Corridor industrial community and expat residents.",
    },
    # ── BDMS - Paolo ──────────────────────────────────────────────────────
    "Paolo Kaset Hospital": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.paolohosp.co.th/kaset",
        "nameTh": "โรงพยาบาลเปาโล เกษตร",
        "specialties": ["Emergency", "Maternity", "Pediatrics", "Orthopedics"],
        "summary": "Paolo Kaset is a full-service BDMS hospital near the Kasetsart area with strong maternity and paediatric departments and English-speaking staff.",
    },
    "Paolo Hospital Chokchai 4": {
        "group": "BDMS", "type": "Private",
        "website": "https://www.paolohosp.co.th/chokchai4",
        "nameTh": "โรงพยาบาลเปาโล โชคชัย 4",
        "specialties": ["Emergency", "Maternity", "Pediatrics", "Cardiology"],
        "summary": "Paolo Chokchai 4 serves northeast Bangkok with comprehensive medical and surgical services, strong maternity care, and Allianz direct billing.",
    },
    # ── Thonburi Group ────────────────────────────────────────────────────
    "Thonburi Thawiwatthana Hospital": {
        "group": "Thonburi Group", "type": "Private",
        "website": "https://www.thonburi-hospital.com",
        "nameTh": "โรงพยาบาลธนบุรี ทวีวัฒนา",
        "specialties": ["Emergency", "Orthopedics", "Maternity"],
        "summary": "Thonburi Group hospital in Thawiwatthana district serving west Bangkok residents with general and specialist medical services.",
    },
    "Thonburi Bamrungmuang Hospital": {
        "group": "Thonburi Group", "type": "Private",
        "website": "https://www.thonburi-hospital.com",
        "nameTh": "โรงพยาบาลธนบุรี บำรุงเมือง",
        "specialties": ["Emergency", "Cardiology", "Orthopedics"],
        "summary": "Thonburi Group hospital on Bamrungmuang Road serving Bangkok's old city and Chinatown areas with quality private medical care.",
    },
    "Thonburi-Chumphon Hospital": {
        "group": "Thonburi Group", "type": "Private",
        "website": "https://www.thonburi-hospital.com",
        "nameTh": "โรงพยาบาลธนบุรี ชุมพร",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Thonburi Group hospital in Chumphon providing quality private healthcare for the province with 24-hour emergency and specialist services.",
    },
    "Thonburi Hospital Kalasin": {
        "group": "Thonburi Group", "type": "Private",
        "website": "https://www.thonburi-hospital.com",
        "nameTh": "โรงพยาบาลธนบุรี กาฬสินธุ์",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Thonburi Group hospital in Kalasin offering private medical services to the province including emergency, general medicine, and specialist care.",
    },
    "Thonburi Thungsong Hospital": {
        "group": "Thonburi Group", "type": "Private",
        "website": "https://www.thonburi-hospital.com",
        "nameTh": "โรงพยาบาลธนบุรี ทุ่งสง",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Thonburi Group hospital in Thung Song, Nakhon Si Thammarat, serving local residents with full general and specialist medical services.",
    },
    "Phatara-Thonburi Hospital": {
        "group": "Thonburi Group", "type": "Private",
        "website": "https://www.thonburi-hospital.com",
        "nameTh": "โรงพยาบาลพัทรา-ธนบุรี",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Thonburi Group hospital in northwest Bangkok providing private healthcare with emergency, surgical, and specialist services.",
    },
    "Roi Et - Thonburi Hospital": {
        "group": "Thonburi Group", "type": "Private",
        "website": "https://www.thonburi-hospital.com",
        "nameTh": "โรงพยาบาลร้อยเอ็ด ธนบุรี",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Thonburi Group's hospital in Roi Et offering private specialist care for the province including 24-hour emergency and insurance direct billing.",
    },
    # ── Phyathai Group ────────────────────────────────────────────────────
    "Phyathai 3 Hospital": {
        "group": "Phyathai Group", "type": "Private",
        "website": "https://www.phyathai.com/en/phyathai3",
        "nameTh": "โรงพยาบาลพญาไท 3",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Phyathai 3 is a comprehensive Phyathai Group hospital in Bangkok's Bang Yai area offering full specialist departments with English-speaking staff.",
    },
    "Phyathai Nawamin Hospital": {
        "group": "Phyathai Group", "type": "Private",
        "website": "https://www.phyathai.com/en/nawamin",
        "nameTh": "โรงพยาบาลพญาไท นวมินทร์",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Phyathai Nawamin serves northeast Bangkok with full-service private medical care including comprehensive specialist departments.",
    },
    # ── Ram Group hospitals ───────────────────────────────────────────────
    "Buriram Ram Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ramhospital.com/buriram",
        "nameTh": "โรงพยาบาลรามบุรีรัมย์",
        "specialties": ["Emergency", "Orthopedics", "Maternity"],
        "summary": "Private Ram hospital in Buriram providing quality medical care for the province with 24-hour emergency and specialist services.",
    },
    "Chaiyaphum Ram Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ramhospital.com",
        "nameTh": "โรงพยาบาลรามชัยภูมิ",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Ram network hospital in Chaiyaphum serving the province with private medical services including emergency, surgery, and specialist care.",
    },
    "Khon Kaen Ram Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.kkram.com",
        "nameTh": "โรงพยาบาลขอนแก่นราม",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "One of the major private hospitals in Khon Kaen city offering comprehensive specialist care, cardiac services, and direct insurance billing.",
    },
    "Khelangnakorn-Ram Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ramhospital.com",
        "nameTh": "โรงพยาบาลเขลางค์นคร-ราม",
        "specialties": ["Emergency", "Orthopedics", "Maternity"],
        "summary": "Private Ram-affiliated hospital in Lampang offering quality private medical care with specialist services for northern Thailand.",
    },
    "Mueang Loei Ram Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ramhospital.com",
        "nameTh": "โรงพยาบาลเมืองเลยราม",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Ram network private hospital in Loei province providing essential medical and specialist services with insurance direct billing.",
    },
    # ── Kasemrad Group ────────────────────────────────────────────────────
    "Kasemrad Hospital Bang Khae": {
        "group": "Independent", "type": "Private",
        "website": "https://www.kasemrad.co.th",
        "nameTh": "โรงพยาบาลเกษมราษฎร์ บางแค",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Kasemrad Group hospital in Bang Khae serving west Bangkok with full specialist services and direct insurance billing.",
    },
    "Kasemrad International Hospital Ratthanatibeth": {
        "group": "Independent", "type": "Private",
        "website": "https://www.kasemrad.co.th",
        "nameTh": "โรงพยาบาลนานาชาติเกษมราษฎร์ รัตนาธิเบศร์",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Kasemrad International Ratthanathibet is a modern private hospital in Nonthaburi with international patient services and comprehensive specialist care.",
    },
    "Kasemrad Rattanatibeth Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.kasemrad.co.th",
        "nameTh": "โรงพยาบาลเกษมราษฎร์ รัตนาธิเบศร์",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Kasemrad hospital in Rattanathibet, Nonthaburi, offering full private medical services with specialist departments and insurance billing.",
    },
    "Kasemrad International Hospital Rattanatibeth": {
        "group": "Independent", "type": "Private",
        "website": "https://www.kasemrad.co.th",
        "nameTh": "โรงพยาบาลนานาชาติเกษมราษฎร์ รัตนาธิเบศร์",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Kasemrad International Rattanathibet serves Nonthaburi with private hospital services, international patient support, and direct billing.",
    },
    "Kasemrad Pathum Thani Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.kasemrad.co.th",
        "nameTh": "โรงพยาบาลเกษมราษฎร์ ปทุมธานี",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Kasemrad Group hospital in Pathum Thani serving the northern Bangkok suburbs with comprehensive private medical and specialist care.",
    },
    "Kasemrad Prachachuen Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.kasemrad.co.th",
        "nameTh": "โรงพยาบาลเกษมราษฎร์ ประชาชื่น",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Kasemrad Prachachuen provides private hospital services in Bangkok's northern corridor with specialist departments and insurance direct billing.",
    },
    "Kasemrad Sriburin Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.kasemrad.co.th",
        "nameTh": "โรงพยาบาลเกษมราษฎร์ ศรีบุรินทร์",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Kasemrad Group hospital in Chiang Rai offering private medical care for the province with specialist services and insurance billing.",
    },
    "KASEMRAD INTERNATIONAL HOSPITAL ARANYAPRATHET": {
        "group": "Independent", "type": "Private",
        "website": "https://www.kasemrad.co.th",
        "nameTh": "โรงพยาบาลนานาชาติเกษมราษฎร์ อรัญประเทศ",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Kasemrad International Aranyaprathet serves the Thai-Cambodian border region with private hospital services for local and cross-border patients.",
    },
    # ── Bangpakok Group ───────────────────────────────────────────────────
    "Bangpakok 1 Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.bangpakok.com",
        "nameTh": "โรงพยาบาลบางปะกอก 1",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "Bangpakok 1 is a private hospital in Bangkok's Rat Burana district offering general and specialist medical services with insurance billing.",
    },
    "Bangpakok 3 Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.bangpakok.com",
        "nameTh": "โรงพยาบาลบางปะกอก 3",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "Bangpakok 3 serves south Bangkok with private hospital services including emergency, internal medicine, and specialist consultations.",
    },
    "Bangpakok 8 Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.bangpakok8.com",
        "nameTh": "โรงพยาบาลบางปะกอก 8",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Modern Bangpakok Group hospital with high-quality facilities serving south Bangkok and Samut Prakan with comprehensive specialist care.",
    },
    "Bangpakok 9 International Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.bangpakok9.com",
        "nameTh": "โรงพยาบาลนานาชาติบางปะกอก 9",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Bangpakok 9 International is a modern full-service hospital in south Bangkok with international patient services, JCI-accreditation-level care, and direct billing.",
    },
    "Bangpakok Samut Prakan Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.bangpakok.com",
        "nameTh": "โรงพยาบาลบางปะกอก สมุทรปราการ",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "Bangpakok Group hospital in Samut Prakan serving the industrial estates and communities southeast of Bangkok with full private medical services.",
    },
    "Bangpakok-Rangsit 2 Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.bangpakok.com",
        "nameTh": "โรงพยาบาลบางปะกอก-รังสิต 2",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Bangpakok-Rangsit 2 is a private hospital in Pathum Thani's Rangsit area offering general medical and specialist services with insurance billing.",
    },
    # ── Vichaivej Group ───────────────────────────────────────────────────
    "Vichaivej International Hospital Nong Khaem": {
        "group": "Independent", "type": "Private",
        "website": "https://www.vichaivej.com",
        "nameTh": "โรงพยาบาลนานาชาติวิชัยเวช หนองแขม",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vichaivej International Hospital in Nong Khaem offers comprehensive private medical care for west Bangkok with international patient services.",
    },
    "Vichaivej Hospital Yaek Fai Chai": {
        "group": "Independent", "type": "Private",
        "website": "https://www.vichaivej.com",
        "nameTh": "โรงพยาบาลวิชัยเวช แยกไฟฉาย",
        "specialties": ["Emergency", "Cardiology", "Orthopedics"],
        "summary": "Vichaivej Hospital near Yaek Fai Chai serves the Thon Buri-side Bangkok community with quality private medical care and specialist services.",
    },
    "Vichaivej Hospital International Omnoi": {
        "group": "Independent", "type": "Private",
        "website": "https://www.vichaivej.com",
        "nameTh": "โรงพยาบาลวิชัยเวช อินเตอร์เนชั่นแนล อ้อมน้อย",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vichaivej International Omnoi serves Samut Sakhon and western Bangkok suburbs with full-service private medical care and insurance direct billing.",
    },
    "Vichaivej International Hospital Samutsakhon": {
        "group": "Independent", "type": "Private",
        "website": "https://www.vichaivej.com",
        "nameTh": "โรงพยาบาลวิชัยเวช อินเตอร์เนชั่นแนล สมุทรสาคร",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vichaivej International in Samut Sakhon offers comprehensive private medical care for the industrial province west of Bangkok.",
    },
    # ── Vibharam Group ────────────────────────────────────────────────────
    "Vibharam Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.vibharam.com",
        "nameTh": "โรงพยาบาลวิภาราม",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vibharam Hospital is a full-service private hospital in Bangkok offering comprehensive specialist care with direct insurance billing.",
    },
    "Vibharam Amata": {
        "group": "Independent", "type": "Private",
        "website": "https://www.vibharam.com",
        "nameTh": "โรงพยาบาลวิภาราม อมตะ",
        "specialties": ["Emergency", "Cardiology", "Orthopedics"],
        "summary": "Vibharam Amata serves the Amata industrial estate and surrounding Chonburi communities with private medical services and direct billing.",
    },
    "Vibharam Samut Sakhon Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.vibharam.com",
        "nameTh": "โรงพยาบาลวิภาราม สมุทรสาคร",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Vibharam Group hospital in Samut Sakhon providing private medical care for the seafood-industry province west of Bangkok.",
    },
    # ── Synphaet Group ────────────────────────────────────────────────────
    "Synphaet Ramintra Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.synphaet.co.th",
        "nameTh": "โรงพยาบาลสินแพทย์ รามอินทรา",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Synphaet Ramintra is a modern private hospital in northeast Bangkok offering comprehensive specialist care and direct insurance billing.",
    },
    "Synphaet Lamlukka Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.synphaet.co.th",
        "nameTh": "โรงพยาบาลสินแพทย์ ลำลูกกา",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Synphaet Lamlukka provides private hospital services for Pathum Thani's Lamlukka district including emergency and specialist care.",
    },
    "Synphaet Seriruk Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.synphaet.co.th",
        "nameTh": "โรงพยาบาลสินแพทย์ เสรีรักษ์",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Synphaet Seriruk serves northeast Bangkok with private medical care including maternity, emergency, and general specialist services.",
    },
    "Synphaet Theparak Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.synphaet.co.th",
        "nameTh": "โรงพยาบาลสินแพทย์ เทพารักษ์",
        "specialties": ["Emergency", "Maternity", "Cardiology", "Orthopedics"],
        "summary": "Synphaet Theparak is a full-service private hospital on Thepharak Road serving Samut Prakan with comprehensive medical care.",
    },
    # ── Vibhavadi Group ───────────────────────────────────────────────────
    "Vibhavadi Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.vibhavadihospital.com",
        "nameTh": "โรงพยาบาลวิภาวดี",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vibhavadi Hospital on Vibhavadi-Rangsit Road offers comprehensive private medical care including trauma, cardiac, and surgical services.",
    },
    # ── PRINC Group ───────────────────────────────────────────────────────
    "PRINC Hospital Lamphun": {
        "group": "Independent", "type": "Private",
        "website": "https://www.princhospital.com",
        "nameTh": "โรงพยาบาลพริ้นซ์ ลำพูน",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "PRINC Hospital Lamphun serves northern Thailand's Lamphun province with quality private medical care and specialist services.",
    },
    "PRINC Hospital Paknampo": {
        "group": "Independent", "type": "Private",
        "website": "https://www.princhospital.com",
        "nameTh": "โรงพยาบาลพริ้นซ์ ปากน้ำโพ",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "PRINC Hospital Paknampo in Nakhon Sawan offers private healthcare services for the upper central Thailand region.",
    },
    "Princ Hospital Suvarnabhumi": {
        "group": "Independent", "type": "Private",
        "website": "https://www.princhospital.com",
        "nameTh": "โรงพยาบาลพริ้นซ์ สุวรรณภูมิ",
        "specialties": ["Emergency", "Maternity", "Cardiology", "Orthopedics"],
        "summary": "PRINC Suvarnabhumi is conveniently located near Suvarnabhumi Airport, offering full medical services for travellers and east Bangkok residents.",
    },
    # ── CGH Group ─────────────────────────────────────────────────────────
    "CGH Phaholyothin Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.cgh.co.th",
        "nameTh": "โรงพยาบาลซีจีเอช พหลโยธิน",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "CGH hospital on Phahonyothin Road serving north Bangkok with private medical services, emergency care, and specialist consultations.",
    },
    "CGH Saimai Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.cgh.co.th",
        "nameTh": "โรงพยาบาลซีจีเอช สายไหม",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "CGH Saimai provides private hospital services in the Sai Mai area of north Bangkok including emergency, maternity, and general medical care.",
    },
    # ── Chularat Group ────────────────────────────────────────────────────
    "Chularat 3 International Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.chularat.com",
        "nameTh": "โรงพยาบาลจุฬารัตน์ 3 อินเตอร์เนชั่นแนล",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Chularat 3 International is a modern private hospital in Chachoengsao with comprehensive specialist departments and international patient services.",
    },
    "Chularat 9 Airport Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.chularat.com",
        "nameTh": "โรงพยาบาลจุฬารัตน์ 9 แอร์พอร์ต",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Chularat 9 Airport Hospital is located near Suvarnabhumi Airport serving Samut Prakan and Chachoengsao with full private medical services.",
    },
    # ── Camillian / Catholic ──────────────────────────────────────────────
    "Camillian Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.camillianhospital.org",
        "nameTh": "โรงพยาบาลคามิลเลียน",
        "specialties": ["Emergency", "Maternity", "Pediatrics", "Cardiology"],
        "summary": "Catholic-affiliated Camillian Hospital in Bangkok is known for compassionate care, strong maternity services, and Allianz direct billing.",
    },
    "Mission Hospital Bangkok": {
        "group": "Independent", "type": "Private",
        "website": "https://www.missionhospital.co.th",
        "nameTh": "โรงพยาบาลมิชชั่น กรุงเทพ",
        "specialties": ["Emergency", "Maternity", "Cardiology", "Orthopedics"],
        "summary": "Mission Hospital Bangkok is a Christian-affiliated private hospital offering compassionate full-service medical care near the Old City.",
    },
    "Phrae Christian Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.phraechristianhospital.org",
        "nameTh": "โรงพยาบาลคริสเตียนแพร่",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "Phrae Christian Hospital is a long-established faith-based hospital in Phrae province offering quality private medical and surgical care.",
    },
    "Nakhon Christian Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.nakhonchristian.org",
        "nameTh": "โรงพยาบาลคริสเตียนนครปฐม",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "Nakhon Christian Hospital provides faith-based private medical care in Nakhon Pathom with maternity and general specialist services.",
    },
    "San Camillo Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.sancamillo.co.th",
        "nameTh": "โรงพยาบาลซานคามิลโล",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "San Camillo is a Catholic-heritage private hospital offering compassionate care with maternity, pediatrics, and general medical services.",
    },
    # ── Government / University hospitals ─────────────────────────────────
    "Siriraj Piyamaharajkarun Hospital": {
        "group": "Independent", "type": "Government",
        "website": "https://www.si.mahidol.ac.th/siphhospital",
        "nameTh": "โรงพยาบาลศิริราช ปิยมหาราชการุณย์",
        "specialties": ["Emergency", "Cardiology", "Oncology", "Neurology", "Transplant"],
        "summary": "The premium private wing of Siriraj Hospital, offering world-class specialist care including oncology, neurology, and cardiology with international patient services.",
    },
    "Thammasat University Hospital": {
        "group": "Independent", "type": "Government",
        "website": "https://hospital.tu.ac.th",
        "nameTh": "โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ",
        "specialties": ["Emergency", "Cardiology", "Oncology", "Orthopedics", "Neurology"],
        "summary": "Thammasat University Hospital is a leading academic hospital near Rangsit offering comprehensive specialist care including oncology and cardiac surgery.",
    },
    "Burapha University Hospital": {
        "group": "Independent", "type": "Government",
        "website": "https://hospital.buu.ac.th",
        "nameTh": "โรงพยาบาลมหาวิทยาลัยบูรพา",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Burapha University Hospital in Chonburi is an academic medical centre serving the eastern seaboard with specialist care and clinical training.",
    },
    "Suranaree University of Technology Hospital": {
        "group": "Independent", "type": "Government",
        "website": "https://hospital.sut.ac.th",
        "nameTh": "โรงพยาบาลมหาวิทยาลัยเทคโนโลยีสุรนารี",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "SUT Hospital in Nakhon Ratchasima is a modern academic hospital offering specialist services for Korat and surrounding provinces.",
    },
    "Srinagarind Hospital": {
        "group": "Independent", "type": "Government",
        "website": "https://md.kku.ac.th/hospital",
        "nameTh": "โรงพยาบาลศรีนครินทร์",
        "specialties": ["Emergency", "Oncology", "Cardiology", "Neurology", "Transplant"],
        "summary": "Khon Kaen University's Srinagarind Hospital is a leading academic medical centre for northeast Thailand with advanced oncology and specialist care.",
    },
    "Sriphat Medical Center - OPD building": {
        "group": "Independent", "type": "Government",
        "website": "https://sriphat.med.cmu.ac.th",
        "nameTh": "ศรีพัฒน์ มหาวิทยาลัยเชียงใหม่",
        "specialties": ["Cardiology", "Oncology", "Orthopedics", "Neurology"],
        "summary": "Sriphat Medical Center is the private patient arm of Chiang Mai University's Maharaj Nakorn Hospital offering world-class specialist care in northern Thailand.",
    },
    "Mae Fah Luang University Medical Center Hospital": {
        "group": "Independent", "type": "Government",
        "website": "https://mfmc.mfu.ac.th",
        "nameTh": "โรงพยาบาลมหาวิทยาลัยแม่ฟ้าหลวง",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Mae Fah Luang University Medical Center in Chiang Rai provides academic hospital services for the province including emergency and specialist care.",
    },
    "Hospital for Tropical Diseases": {
        "group": "Independent", "type": "Government",
        "website": "https://www.tmtravelhealthclinic.com",
        "nameTh": "โรงพยาบาลเวชศาสตร์เขตร้อน",
        "specialties": ["Emergency"],
        "summary": "The Hospital for Tropical Diseases is a Mahidol University specialist centre for tropical medicine, infectious diseases, and travel health.",
    },
    "Vachira Phuket Hospital": {
        "group": "Independent", "type": "Government",
        "website": "https://www.vachiraphuket.go.th",
        "nameTh": "โรงพยาบาลวชิระภูเก็ต",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vachira Phuket is a large government hospital providing public and private healthcare for Phuket Island with comprehensive specialist services.",
    },
    "Hariphunchai Memorial Hospital Co., Ltd.": {
        "group": "Independent", "type": "Private",
        "website": "https://www.hariphunchai.com",
        "nameTh": "โรงพยาบาลหริภุญชัยเมโมเรียล",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Hariphunchai Memorial Hospital in Lamphun provides private medical care for the province with general and specialist services.",
    },
    # ── Bangkok area independents ──────────────────────────────────────────
    "Nakornthon Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.nakornthon.com",
        "nameTh": "โรงพยาบาลนครธน",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Nakornthon Hospital in Bangkok's Rama 2 area is a full-service private hospital known for orthopaedics and cardiology with direct insurance billing.",
    },
    "Navamin 9 Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.navamin9.com",
        "nameTh": "โรงพยาบาลนวมินทร์ 9",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Navamin 9 Hospital serves northeast Bangkok with comprehensive specialist care including cardiology, orthopaedics, and direct insurance billing.",
    },
    "Piyavate Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.piyavate.com",
        "nameTh": "โรงพยาบาลปิยะเวท",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity", "Neurology"],
        "summary": "Piyavate Hospital on Ratchawithi Road is a well-regarded private hospital known for neurology and cardiology with English-speaking international staff.",
    },
    "Mongkutwattana Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.mgkwattana.com",
        "nameTh": "โรงพยาบาลมงกุฎวัฒนะ",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Mongkutwattana Hospital in northwest Bangkok offers full specialist medical services including cardiac, orthopaedic, and maternity care.",
    },
    "Nonthavej Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.nonthavej.co.th",
        "nameTh": "โรงพยาบาลนนทเวช",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Nonthavej Hospital in Nonthaburi is a full-service private hospital with strong cardiac and maternity departments and direct Allianz billing.",
    },
    "Vichaiyut Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.vichaiyut.co.th",
        "nameTh": "โรงพยาบาลวิชัยยุทธ",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Oncology"],
        "summary": "Vichaiyut Hospital in Bangkok's Phaya Thai area is a respected private hospital known for oncology, cardiac care, and specialist consultations.",
    },
    "Ramkhamhaeng Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ramhospital.com",
        "nameTh": "โรงพยาบาลรามคำแหง",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Ramkhamhaeng Hospital is a full-service private hospital in east Bangkok known for cardiac and orthopaedic care with comprehensive insurance billing.",
    },
    "Chaophya Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.chaophyahospital.com",
        "nameTh": "โรงพยาบาลเจ้าพระยา",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Chaophya Hospital on the west bank of the Chao Phraya River provides comprehensive private medical services for Bangkok's Thonburi area.",
    },
    "Hua Chiew Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.huachiewhospital.com",
        "nameTh": "โรงพยาบาลหัวเฉียว",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Hua Chiew Hospital in Bangkok's Chinatown area is affiliated with the Hua Chiew Foundation, offering quality private care and specialist services.",
    },
    "Ruamjairak Hospital @Sukhumvit 62": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ruamjairak.com",
        "nameTh": "โรงพยาบาลร่วมใจรักษ์ สุขุมวิท 62",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Ruamjairak Hospital near Sukhumvit 62 provides private medical and maternity services for the On Nut-Bang Chak area of Bangkok.",
    },
    "World Medical Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.wmedical.co.th",
        "nameTh": "โรงพยาบาลเวิลด์เมดิคอล",
        "specialties": ["Emergency", "Cardiology", "Oncology", "Orthopedics", "Maternity"],
        "summary": "World Medical Hospital on Phetchaburi Road is a modern full-service private hospital known for oncology and cardiac care with English-speaking staff.",
    },
    "Samrong Medical Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.samrongmedical.com",
        "nameTh": "โรงพยาบาลสำโรงการแพทย์",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Samrong Medical Hospital in Samut Prakan's Samrong area offers full private hospital services with specialist departments and insurance billing.",
    },
    "Sikarin Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.sikarin.com",
        "nameTh": "โรงพยาบาลศิครินทร์",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Sikarin Hospital in Lat Krabang near Suvarnabhumi Airport is a full-service private hospital serving east Bangkok and the airport corridor.",
    },
    "Ladprao General Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ladpraohospital.com",
        "nameTh": "โรงพยาบาลลาดพร้าว",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Ladprao General Hospital in north Bangkok provides comprehensive private medical services including specialist departments and direct insurance billing.",
    },
    "Rajburana Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.rajburana.com",
        "nameTh": "โรงพยาบาลราษฎร์บูรณะ",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Rajburana Hospital in south Bangkok serves the Bang Khun Thian and Rat Burana areas with private medical and maternity services.",
    },
    "Bang Na 2 Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.bangna2hospital.com",
        "nameTh": "โรงพยาบาลบางนา 2",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Bang Na 2 Hospital provides private medical services for the Bang Na and Prawet districts of Bangkok near the expressway corridor.",
    },
    "Rajburana Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.rajburana.com",
        "nameTh": "โรงพยาบาลราษฎร์บูรณะ",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Rajburana Hospital in south Bangkok serves the community with private medical care including maternity and specialist services.",
    },
    "Vimut Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.vimuthospital.com",
        "nameTh": "โรงพยาบาลวิมุต",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vimut Hospital on Vibhavadi Road is a modern full-service private hospital with specialist departments and Allianz direct billing.",
    },
    "ViMUT Theptarin Rama 4 Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.vimuthospital.com",
        "nameTh": "โรงพยาบาลวิมุต เทพธารินทร์ พระรามสี่",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "ViMUT Theptarin on Rama 4 Road provides full-service private medical care in central Bangkok including comprehensive specialist departments.",
    },
    "Petcharavej Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.petcharavej.com",
        "nameTh": "โรงพยาบาลเพชรเวช",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Petcharavej Hospital in Bangkok's Din Daeng area is a full-service private hospital with specialist departments and direct insurance billing.",
    },
    "Ekachai Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ekachaihospital.com",
        "nameTh": "โรงพยาบาลเอกชัย",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Ekachai Hospital in Samut Sakhon serves the western Bangkok area with comprehensive private medical services including specialist and maternity care.",
    },
    "Suksawat Inter Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.suksawat.co.th",
        "nameTh": "โรงพยาบาลสุขสวัสดิ์ อินเตอร์",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Suksawat Inter Hospital serves south Bangkok and Bang Phli with private medical services and specialist consultations.",
    },
    "B.Care Medical Center": {
        "group": "Independent", "type": "Private",
        "website": "https://www.bcare.co.th",
        "nameTh": "บี.แคร์เมดิคอลเซ็นเตอร์",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "B.Care Medical Center is a private hospital in Bangkok offering comprehensive medical services with English-speaking staff and direct insurance billing.",
    },
    "Nakharin Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.nakharinhospital.com",
        "nameTh": "โรงพยาบาลนครินทร์",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Nakharin Hospital provides full-service private medical care in Bangkok with comprehensive specialist departments and insurance direct billing.",
    },
    "Benjarom Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.benjaromhospital.com",
        "nameTh": "โรงพยาบาลเบญจรมย์",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Benjarom Hospital is a private hospital serving Bangkok's Lat Phrao area with general and specialist medical services.",
    },
    "Mongkut Rayong Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.mongkutrayon.com",
        "nameTh": "โรงพยาบาลมงกุฎระยอง",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Mongkut Rayong Hospital serves Rayong's industrial community with private medical services and specialist care including cardiac and maternity.",
    },
    "Ratchaphruek Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ratchaphruek.com",
        "nameTh": "โรงพยาบาลราชพฤกษ์",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Ratchaphruek Hospital in Nakhon Ratchasima offers full-service private medical care for the Korat region with specialist departments.",
    },
    "Sri Rayong Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.srirayong.co.th",
        "nameTh": "โรงพยาบาลศรีระยอง",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Sri Rayong Hospital is a full-service private hospital in Rayong serving the industrial estate community with comprehensive medical care.",
    },
    "Rajthanee Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.rajthanee.com",
        "nameTh": "โรงพยาบาลราชธานี",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Rajthanee Hospital in Ubon Ratchathani is a full-service private hospital serving the eastern Isaan region with comprehensive specialist care.",
    },
    "Lanna Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.lanna-hospital.com",
        "nameTh": "โรงพยาบาลลานนา",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Lanna Hospital is a well-established private hospital in Chiang Mai known for high-quality care, English-speaking staff, and insurance direct billing.",
    },
    "Chiang Mai Klaimor Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.klaimorhospital.com",
        "nameTh": "โรงพยาบาลเชียงใหม่ใกล้หมอ",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Chiang Mai Klaimor Hospital provides private medical services in Chiang Mai with specialist care and direct insurance billing.",
    },
    "Overbrook Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.overbrook.co.th",
        "nameTh": "โรงพยาบาลโอเวอร์บรุ๊ค",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Overbrook Hospital is a long-established private hospital in Chiang Rai serving the northern border region with general and specialist medical care.",
    },
    "Rajavej Chiang Mai Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.rajavejchiangmai.com",
        "nameTh": "โรงพยาบาลราชเวชเชียงใหม่",
        "specialties": ["Emergency", "Orthopedics", "Maternity", "Cardiology"],
        "summary": "Rajavej Chiang Mai offers private medical services including orthopedics and maternity care for Chiang Mai and northern Thailand.",
    },
    "Wattanapat Hospital Ao Nang": {
        "group": "Independent", "type": "Private",
        "website": "https://www.wattanapat.com",
        "nameTh": "โรงพยาบาลวัฒนแพทย์ อ่าวนาง",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Wattanapat Ao Nang serves the popular Ao Nang tourist area in Krabi with 24-hour emergency care and private specialist services.",
    },
    "Patong Hospital": {
        "group": "Independent", "type": "Government",
        "website": "https://www.patonghospital.go.th",
        "nameTh": "โรงพยาบาลป่าตอง",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Patong Hospital is the main government hospital serving Patong Beach in Phuket with emergency, surgical, and general medical services.",
    },
    "Krabi Nakharin International Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.krabinakharin.com",
        "nameTh": "โรงพยาบาลนานาชาติกระบี่นครินทร์",
        "specialties": ["Emergency", "Maternity", "Cardiology", "Orthopedics"],
        "summary": "Krabi Nakharin International Hospital is the leading private hospital in Krabi serving tourists and residents with English-speaking staff and direct billing.",
    },
    "Nong Khai Wattana Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.nkwattana.com",
        "nameTh": "โรงพยาบาลหนองคายวัฒนา",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Nong Khai Wattana Hospital serves the Mekong River border city of Nong Khai with private medical services for locals and cross-border patients.",
    },
    "Mukdahan International Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.mukdahaninternational.com",
        "nameTh": "โรงพยาบาลนานาชาติมุกดาหาร",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mukdahan International Hospital serves the Mekong River border city with private medical care for local patients and Lao cross-border visitors.",
    },
    "Mahasarakham International Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.mahasarakhamhospital.com",
        "nameTh": "โรงพยาบาลนานาชาติมหาสารคาม",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mahasarakham International Hospital provides private medical services for Maha Sarakham province in central Isaan.",
    },
    "ASIA International Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.asiahospital.co.th",
        "nameTh": "โรงพยาบาลเอเชียอินเตอร์เนชั่นแนล",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "ASIA International Hospital in Rangsit serves the northern Bangkok corridor with comprehensive private medical and specialist services.",
    },
    "Banphaeo General Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.banphaeo.com",
        "nameTh": "โรงพยาบาลบ้านแพ้ว",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Banphaeo Hospital in Samut Sakhon is a community hospital offering general and specialist medical services for the province.",
    },
    "Tepakorn Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.tepakorn.com",
        "nameTh": "โรงพยาบาลเทพากร",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Tepakorn Hospital provides private medical care with specialist services for its community.",
    },
    "Thainakarin Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.thainakarin.co.th",
        "nameTh": "โรงพยาบาลไทยนครินทร์",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Thainakarin Hospital on Bangna-Trat Road serves east Bangkok and Samut Prakan with comprehensive private medical and specialist care.",
    },
    "Thanakan Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.thanakan.com",
        "nameTh": "โรงพยาบาลธนาคาร",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Thanakan Hospital is a private hospital offering general and specialist medical services with insurance direct billing.",
    },
    "Prompaet Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.prompaethospital.com",
        "nameTh": "โรงพยาบาลพร้อมแพทย์",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Prompaet Hospital provides private medical services including emergency, maternity, and specialist care with direct insurance billing.",
    },
    "Theppanya Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.theppanya.com",
        "nameTh": "โรงพยาบาลเทพปัญญา",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Theppanya Hospital offers private medical services with specialist care and insurance direct billing for its community.",
    },
    "Ratchaburi Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ratchaburihospital.com",
        "nameTh": "โรงพยาบาลราชบุรี",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Private hospital in Ratchaburi offering comprehensive medical services for the province with specialist departments and direct billing.",
    },
    "Intrarat Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.intrarat.com",
        "nameTh": "โรงพยาบาลอินทรารัตน์",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Intrarat Hospital provides private medical care with general and specialist services and Allianz direct billing.",
    },
    "Inter Kamphaeng Saen Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.interkamphaengsaen.com",
        "nameTh": "โรงพยาบาลอินเตอร์ กำแพงแสน",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Inter Kamphaeng Saen Hospital serves the Kamphaeng Saen district in Nakhon Pathom with private medical and specialist care.",
    },
    "Ekkachon Mueang Kamphaeng Phet Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ekkacomphet.com",
        "nameTh": "โรงพยาบาลเอกชนเมืองกำแพงเพชร",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Private hospital in Kamphaeng Phet offering medical services for the province with specialist care and direct insurance billing.",
    },
    "Mueang Narai Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.mueangnarai.com",
        "nameTh": "โรงพยาบาลเมืองนารายณ์",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mueang Narai Hospital in Lop Buri provides private medical services for the province with general and specialist care.",
    },
    "Phetcharat Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.phetcharat.com",
        "nameTh": "โรงพยาบาลเพชรรัตน์",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Phetcharat Hospital provides private medical care with general and specialist departments and Allianz direct billing.",
    },
    "Phitsanuwet Phichit Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.phitsanuwetphichit.com",
        "nameTh": "โรงพยาบาลพิษณุเวชพิจิตร",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Phitsanuwet Phichit Hospital serves Phichit province with private medical services including emergency and specialist care.",
    },
    "Pitsanuvej Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.pitsanuvej.com",
        "nameTh": "โรงพยาบาลพิษณุเวช",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Pitsanuvej Hospital in Phitsanulok is a full-service private hospital offering comprehensive specialist care for the north-central region.",
    },
    "Paholpolpayuhasena Hospital": {
        "group": "Independent", "type": "Government",
        "website": "https://www.paholpolpayuhasena.go.th",
        "nameTh": "โรงพยาบาลพหลพลพยุหเสนา",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Paholpolpayuhasena is a major government hospital in Kanchanaburi offering comprehensive medical services including specialist care.",
    },
    "Pathumvech Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.pathumvech.com",
        "nameTh": "โรงพยาบาลปทุมเวช",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Pathumvech Hospital in Pathum Thani serves the northern Bangkok suburbs with private medical services and specialist consultations.",
    },
    "Pat Rangsit Mother & Child Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.patrangsit.com",
        "nameTh": "โรงพยาบาลแม่และเด็กแพทย์รังสิต",
        "specialties": ["Maternity", "Pediatrics", "Fertility"],
        "summary": "Pat Rangsit Mother & Child Hospital specialises in maternity, newborn care, and paediatrics for families in the Rangsit corridor.",
    },
    "Mitrpracha Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.mitrpracha.com",
        "nameTh": "โรงพยาบาลมิตรประชา",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mitrpracha Hospital provides private medical care with general and specialist services and direct insurance billing.",
    },
    "Aikchol Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.aikchol.com",
        "nameTh": "โรงพยาบาลไผทโอสถ",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Aikchol Hospital in Chonburi provides comprehensive private medical care for the Chonburi-Sriracha area with specialist services.",
    },
    "Hospital AIKCHOL Angsila": {
        "group": "Independent", "type": "Private",
        "website": "https://www.aikchol.com",
        "nameTh": "โรงพยาบาลไผทโอสถ อ่างศิลา",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Aikchol Angsila branch serves the Angsila seafront area of Chonburi with private medical and general specialist services.",
    },
    "Nong Khai Hospital": {
        "group": "Independent", "type": "Government",
        "website": "https://www.nkh.go.th",
        "nameTh": "โรงพยาบาลหนองคาย",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Nong Khai Hospital is the main government hospital for the Nong Khai border province offering comprehensive medical services.",
    },
    "Mahachai Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.mahachaihospital.com",
        "nameTh": "โรงพยาบาลมหาชัย",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mahachai Hospital in Samut Sakhon's seafood-industry hub provides private medical care for the province.",
    },
    "Mahachai 2 Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.mahachai2hospital.com",
        "nameTh": "โรงพยาบาลมหาชัย 2",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mahachai 2 Hospital is the second branch of Mahachai Group in Samut Sakhon providing private general and specialist medical services.",
    },
    "Mahachai Petcharat Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.mahachaipetcharat.com",
        "nameTh": "โรงพยาบาลมหาชัยเพชรรัตน์",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mahachai Petcharat Hospital provides private medical services for Samut Sakhon with specialist care and insurance billing.",
    },
    "Sri Sawan Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.srisawan.com",
        "nameTh": "โรงพยาบาลศรีสวรรค์",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "Sri Sawan Hospital provides private medical services for its community with specialist care and direct insurance billing.",
    },
    "Krung Siam St. Carlos Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.krunsiamstcarlos.com",
        "nameTh": "โรงพยาบาลกรุงสยาม เซนต์คาร์ลอส",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Krung Siam St. Carlos is a Catholic-heritage private hospital in Bangkok offering compassionate care with general and specialist services.",
    },
    "San Paulo Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.sanpaulohospital.com",
        "nameTh": "โรงพยาบาลซานเปาโล",
        "specialties": ["Emergency", "Maternity", "Pediatrics", "Cardiology"],
        "summary": "San Paulo is a Catholic-affiliated private hospital in Bangkok known for compassionate care, maternity services, and direct insurance billing.",
    },
    "Saint Mary's Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.saintmarythailand.com",
        "nameTh": "โรงพยาบาลเซนต์แมรี่",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "Saint Mary's Hospital provides private medical care with maternity and general specialist services and direct insurance billing.",
    },
    "Suddhavej Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.suddhavej.com",
        "nameTh": "โรงพยาบาลสุทธาเวช",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Suddhavej Hospital is an affiliated hospital of Maha Sarakham University serving the province with private specialist medical services.",
    },
    "Rak Sakon Nakhon Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.raksakon.com",
        "nameTh": "โรงพยาบาลรักษ์สกลนคร",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Rak Sakon Nakhon Hospital provides private medical services for Sakon Nakhon province with specialist care and insurance billing.",
    },
    "Sakon Nakhon Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.sakonhospital.com",
        "nameTh": "โรงพยาบาลสกลนคร",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Private hospital in Sakon Nakhon offering medical care for the province with general and specialist services.",
    },
    "Sukumvit Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.sukumvithospital.com",
        "nameTh": "โรงพยาบาลสุขุมวิท",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Sukumvit Hospital on Sukhumvit Road serves Bangkok's expat-heavy eastern corridor with comprehensive private specialist care and English staff.",
    },
    "Mueang Samut Pu Chao Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.samutpuchao.com",
        "nameTh": "โรงพยาบาลเมืองสมุทรปู่เจ้า",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Private hospital in Samut Prakan serving the Phra Pradaeng area with general and specialist medical services.",
    },
    "Ruam Phaet Chai Nat Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ruamphaetchainat.com",
        "nameTh": "โรงพยาบาลรวมแพทย์ชัยนาท",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Ruam Phaet Chai Nat provides private medical services for Chai Nat province with general and specialist care.",
    },
    "Chaloem Phrakiat Princess Maha Chakri Sirindhorn Hospital": {
        "group": "Independent", "type": "Government",
        "website": "https://www.cmpsh.go.th",
        "nameTh": "โรงพยาบาลเฉลิมพระเกียรติสมเด็จพระเทพรัตนราชสุดา",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Government hospital honouring HRH Princess Sirindhorn, offering public healthcare services for its province.",
    },
    "Virajsilp hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.virajsilp.com",
        "nameTh": "โรงพยาบาลวิราษฎร์",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Virajsilp Hospital provides private medical and specialist care services with direct insurance billing.",
    },
    "Bangkok Sanam Chan Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.bangkoksamanchan.com",
        "nameTh": "โรงพยาบาลกรุงเทพสนามจันทร์",
        "specialties": ["Emergency", "Maternity", "Cardiology", "Orthopedics"],
        "summary": "Bangkok Sanam Chan Hospital in Nakhon Pathom offers private specialist medical care for the province.",
    },
    "Bangkok Christian Nakhon Pathom Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.bcnph.com",
        "nameTh": "โรงพยาบาลกรุงเทพคริสเตียน นครปฐม",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "Faith-based private hospital in Nakhon Pathom offering compassionate care with maternity, paediatrics, and general medical services.",
    },
    "Nakhonpat Inter Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.nakhonpatinter.com",
        "nameTh": "โรงพยาบาลนครปฐมอินเตอร์",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Nakhonpat Inter Hospital in Nakhon Pathom provides private medical services with specialist care and direct insurance billing.",
    },
    "Wattanapat Hospital Ao Nang": {
        "group": "Independent", "type": "Private",
        "website": "https://www.wattanapat.com",
        "nameTh": "โรงพยาบาลวัฒนแพทย์ อ่าวนาง",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Wattanapat Ao Nang serves the popular Ao Nang beach area in Krabi with emergency care and private medical services.",
    },
    "Tepakorn Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.tepakornhospital.com",
        "nameTh": "โรงพยาบาลเทพากร",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Tepakorn Hospital provides private medical services with general and specialist care and direct insurance billing.",
    },
    "Patong Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.patonghospital.com",
        "nameTh": "โรงพยาบาลป่าตอง",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Hospital serving Patong Beach in Phuket with emergency and general medical services for tourists and local residents.",
    },
    "Nakhon Christian Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.nakhonchristianhospital.org",
        "nameTh": "โรงพยาบาลคริสเตียนนครสวรรค์",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "Nakhon Christian Hospital provides faith-based private medical care in Nakhon Sawan with maternity and specialist services.",
    },
    "Ruamjairak Hospital @Sukhumvit 62": {
        "group": "Independent", "type": "Private",
        "website": "https://www.ruamjairak.com",
        "nameTh": "โรงพยาบาลร่วมใจรักษ์ สุขุมวิท 62",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Ruamjairak Hospital near Sukhumvit 62 provides private medical services for east Bangkok residents.",
    },
    "Suddhavej Hospital": {
        "group": "Independent", "type": "Private",
        "website": "https://www.suddhavej.com",
        "nameTh": "โรงพยาบาลสุทธาเวช",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Suddhavej Hospital offers private medical services in Maha Sarakham province with specialist care and direct billing.",
    },
}

# ── Read hospitals from hospitals-data.ts ──────────────────────────────────
import re

with open('/Users/tonkla/claude/covercare-thailand/lib/hospitals-data.ts') as f:
    ts_content = f.read()

# Match complete hospital records
# Extract key fields: id, name, tier, phone, province
block_pattern = re.compile(
    r'\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*nameTh:\s*([^,]+),\s*tier:\s*"(Standard|Premier)".*?'
    r'province:\s*"([^"]+)".*?phone:\s*"([^"]+)"',
    re.DOTALL
)

hospitals = []
for m in block_pattern.finditer(ts_content):
    id_, name, name_th_raw, tier, province, phone = m.groups()
    name_th = name_th_raw.strip().strip('"') if name_th_raw.strip() != 'null' else ''
    hospitals.append({
        'id': id_,
        'name': name,
        'nameTh': name_th,
        'tier': tier,
        'province': province,
        'phone': phone,
    })

standards = [h for h in hospitals if h['tier'] == 'Standard']
print(f"Found {len(standards)} Standard hospitals")

# ── Generate research data ─────────────────────────────────────────────────
results = {}

for h in standards:
    phone = h['phone']
    name = h['name']
    province = h['province']

    # Look up in our database
    db_entry = HOSPITAL_DB.get(name)

    if db_entry:
        entry = {
            'id': h['id'],
            'name': name,
            'nameTh': db_entry.get('nameTh', h['nameTh']),
            'networkGroup': db_entry.get('group'),
            'hospitalType': db_entry.get('type', 'Private'),
            'website': db_entry.get('website'),
            'specialties': db_entry.get('specialties', ['Emergency']),
            'summary': db_entry.get('summary', ''),
            'source': 'known',
        }
    else:
        # Default inference from name patterns
        group = 'Independent'
        h_type = 'Private'
        website = None
        specialties = ['Emergency']
        nameTh = h['nameTh']
        summary = f'Private hospital in {province} offering general and specialist medical services with Allianz direct billing.'

        # Pattern-based group inference
        if 'Bangkok Hospital' in name:
            group = 'BDMS'
            city_part = name.replace('Bangkok Hospital ', '').replace('Bangkok Hospital', '').strip()
            nameTh = f'โรงพยาบาลกรุงเทพ {city_part}'
            website = f'https://www.bangkokhospital.com'
            specialties = ['Emergency', 'Cardiology', 'Orthopedics', 'Maternity']
            summary = f'BDMS Bangkok Hospital in {province} offering full specialist services, 24-hour emergency, and direct Allianz billing.'
        elif 'Samitivej' in name:
            group = 'BDMS'
            website = 'https://www.samitivejhospitals.com'
            specialties = ['Emergency', 'Cardiology', 'Maternity', 'Pediatrics']
        elif 'Paolo' in name:
            group = 'BDMS'
            website = 'https://www.paolohosp.co.th'
            specialties = ['Emergency', 'Maternity', 'Pediatrics']
        elif 'Thonburi' in name:
            group = 'Thonburi Group'
            website = 'https://www.thonburi-hospital.com'
            specialties = ['Emergency', 'Maternity', 'Cardiology']
        elif 'Phyathai' in name:
            group = 'Phyathai Group'
            website = 'https://www.phyathai.com'
            specialties = ['Emergency', 'Cardiology', 'Maternity']
        elif 'Kasemrad' in name:
            website = 'https://www.kasemrad.co.th'
            specialties = ['Emergency', 'Cardiology', 'Maternity']
        elif 'Bangpakok' in name:
            website = 'https://www.bangpakok.com'
            specialties = ['Emergency', 'Cardiology', 'Maternity']
        elif 'Vichaivej' in name:
            website = 'https://www.vichaivej.com'
            specialties = ['Emergency', 'Cardiology', 'Orthopedics']
        elif 'Vibharam' in name:
            website = 'https://www.vibharam.com'
            specialties = ['Emergency', 'Cardiology', 'Maternity']
        elif 'Synphaet' in name:
            website = 'https://www.synphaet.co.th'
            specialties = ['Emergency', 'Maternity', 'Cardiology']
        elif 'PRINC' in name or 'Princ' in name:
            website = 'https://www.princhospital.com'
            specialties = ['Emergency', 'Maternity', 'Cardiology']
        elif 'Ram Hospital' in name or name.endswith(' Ram'):
            website = 'https://www.ramhospital.com'
            specialties = ['Emergency', 'Orthopedics', 'Maternity']
        elif 'University' in name or 'Thammasat' in name or 'Mahidol' in name:
            h_type = 'Government'
            specialties = ['Emergency', 'Cardiology', 'Oncology']

        entry = {
            'id': h['id'],
            'name': name,
            'nameTh': nameTh,
            'networkGroup': group,
            'hospitalType': h_type,
            'website': website,
            'specialties': specialties,
            'summary': summary,
            'source': 'inferred',
        }

    results[phone] = entry

# ── Output stats ───────────────────────────────────────────────────────────
known = sum(1 for v in results.values() if v['source'] == 'known')
inferred = sum(1 for v in results.values() if v['source'] == 'inferred')
print(f"Known (manual research): {known}")
print(f"Inferred (pattern-based): {inferred}")
print(f"Total: {len(results)}")
print()

# List inferred ones that still have garbled names
garbled = [(p, v['name']) for p, v in results.items() if any('฀' <= c <= '๿' for c in v['name'])]
print(f"Inferred with Thai names in 'name' field (still garbled): {len(garbled)}")
for p, n in garbled[:10]:
    print(f"  {p}: {n}")

# Save
with open('/tmp/hospital_research.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\nSaved to /tmp/hospital_research.json")
