#!/usr/bin/env python3
"""
Update lib/hospitals-data.ts for ALL 199 Standard hospitals:
- Fix English name for 39 hospitals still using Thai name in 'name' field
- Fix nameTh (corrected Thai spelling)
- Add networkGroup, hospitalType, website, specialties, summary
"""

import re, json

# ── Phone-keyed research data for all hospitals ────────────────────────────
# Format: phone → { name, nameTh, group, type, website, specialties, summary }

RESEARCH = {
    # ── 39 hospitals that still have Thai names in 'name' field ─────────────
    "0-3955-2777": {
        "name": "Bangkok Hospital Trat", "nameTh": "โรงพยาบาลกรุงเทพ ตราด",
        "group": "BDMS", "type": "Private", "website": "https://www.bangkokhospital.com/trat",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "BDMS hospital in Trat serving the eastern border region and Koh Chang island visitors with emergency and specialist services.",
    },
    "0-7795-6789": {
        "name": "Bangkok Hospital Surat Thani", "nameTh": "โรงพยาบาลกรุงเทพ สุราษฎร์ธานี",
        "group": "BDMS", "type": "Private", "website": "https://www.bangkokhospital.com/suratthani",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "BDMS Bangkok Hospital in Surat Thani serving the province and Samui island traffic with full specialist care and direct billing.",
    },
    "0-7436-5780-90": {
        "name": "Bangkok Hospital Hat Yai", "nameTh": "โรงพยาบาลกรุงเทพ หาดใหญ่",
        "group": "BDMS", "type": "Private", "website": "https://www.bangkokhospital.com/hatyai",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Leading BDMS hospital in Hat Yai serving southern Thailand and cross-border patients with comprehensive specialist services and direct billing.",
    },
    "0-4234-3111": {
        "name": "Bangkok Hospital Udon Thani", "nameTh": "โรงพยาบาลกรุงเทพ อุดรธานี",
        "group": "BDMS", "type": "Private", "website": "https://www.bangkokhospital.com/udonthani",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Major BDMS hospital in Udon Thani catering to the large expat community and international patients from neighboring Laos.",
    },
    "0-7728-5701-5": {
        "name": "Thaksin Hospital", "nameTh": "โรงพยาบาลทักษิณ",
        "group": "Independent", "type": "Private", "website": "https://www.thaksin-hospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Thaksin Hospital provides private medical services for Trang and its surrounding area with specialist care and direct insurance billing.",
    },
    "0-7521-8988": {
        "name": "Thonburi Trang Hospital", "nameTh": "โรงพยาบาลธนบุรี ตรัง",
        "group": "Thonburi Group", "type": "Private", "website": "https://www.thonburi-hospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Thonburi Group hospital in Trang providing private specialist medical care for the province with 24-hour emergency services.",
    },
    "0-5551-8200-22": {
        "name": "Nakhon Mae Sot International Hospital", "nameTh": "โรงพยาบาลนครแม่สอด อินเตอร์เนชั่นแนล",
        "group": "Independent", "type": "Private", "website": "https://www.maesothospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Modern private hospital in Mae Sot serving the Thai-Myanmar border region with international patient services and direct insurance billing.",
    },
    "0-4232-5999": {
        "name": "Northeastern Wattana Hospital", "nameTh": "โรงพยาบาลนอร์ทอีสเทอร์นวัฒนา",
        "group": "Independent", "type": "Private", "website": "https://www.northeasternwattana.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Private hospital in the northeast region offering general and specialist medical services with direct insurance billing.",
    },
    "0-7724-5236-9": {
        "name": "Ban Don International Hospital", "nameTh": "โรงพยาบาลบ้านดอนอินเตอร์",
        "group": "Independent", "type": "Private", "website": "https://www.bandonhospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Ban Don International Hospital in Surat Thani offers private medical services for the province with specialist care and direct billing.",
    },
    "0-4563-1313-4": {
        "name": "Prachamark Wetchakan Hospital", "nameTh": "โรงพยาบาลประชารักษ์เวชการ",
        "group": "Independent", "type": "Private", "website": "https://www.prachamark.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Private hospital providing general and specialist medical services for its community with Allianz direct billing.",
    },
    "0-3550-3531-5": {
        "name": "Pornchai Hospital", "nameTh": "โรงพยาบาลพรชัย",
        "group": "Independent", "type": "Private", "website": "https://www.pornchainospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Pornchai Hospital provides private medical care for its community with general and specialist services and insurance billing.",
    },
    "045-968-888": {
        "name": "PRINC Hospital Si Sa Ket", "nameTh": "โรงพยาบาลพริ้นซ์ ศรีสะเกษ",
        "group": "Independent", "type": "Private", "website": "https://www.princhospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology", "Orthopedics"],
        "summary": "PRINC Hospital in Si Sa Ket offers full-service private medical care for the province with specialist departments and direct billing.",
    },
    "0-5604-9899": {
        "name": "PRINC Hospital Uthai Thani", "nameTh": "โรงพยาบาลพริ้นซ์ อุทัยธานี",
        "group": "Independent", "type": "Private", "website": "https://www.princhospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "PRINC Hospital in Uthai Thani provides private healthcare services for the province with specialist care and insurance billing.",
    },
    "045-250271-3": {
        "name": "PRINC Hospital Ubon Ratchathani", "nameTh": "โรงพยาบาลพริ้นซ์ อุบลราชธานี",
        "group": "Independent", "type": "Private", "website": "https://www.princhospital.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "PRINC Hospital in Ubon Ratchathani serves the eastern Isaan region with full-service private medical care and direct billing.",
    },
    "0-5562-1502-7": {
        "name": "Phatthanawet Sukhothai Hospital", "nameTh": "โรงพยาบาลพัฒนเวชสุโขทัย",
        "group": "Independent", "type": "Private", "website": "https://www.phatthanawet.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Phatthanawet Hospital in Sukhothai offers private medical and specialist services for the historic province.",
    },
    "0-4595-8888": {
        "name": "Cheewamitra Cancer Hospital", "nameTh": "โรงพยาบาลมะเร็งชีวามิตรา",
        "group": "Independent", "type": "Private", "website": "https://www.cheewamitra.com",
        "specialties": ["Oncology", "Emergency"],
        "summary": "Cheewamitra Cancer Hospital is a specialist oncology centre providing cancer diagnosis, treatment, and palliative care services.",
    },
    "0-3621-8900": {
        "name": "Mittraphap Memorial Hospital", "nameTh": "โรงพยาบาลมิตรภาพเมโมเรียล",
        "group": "Independent", "type": "Private", "website": "https://www.mittraphap.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mittraphap Memorial Hospital provides private medical services for Saraburi with general and specialist care and direct billing.",
    },
    "0-4571-2141-2": {
        "name": "Ruam Phaet Yasothon Hospital", "nameTh": "โรงพยาบาลรวมแพทย์ ยโสธร",
        "group": "Independent", "type": "Private", "website": "https://www.ruamphaet.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Ruam Phaet Yasothon provides private medical services for Yasothon province with general and specialist care.",
    },
    "0-4528-0040-60": {
        "name": "Rajavej Ubon Ratchathani Hospital", "nameTh": "โรงพยาบาลราชเวช อุบลราชธานี",
        "group": "Independent", "type": "Private", "website": "https://www.rajavejubon.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Rajavej Ubon Ratchathani offers full-service private medical care for eastern Isaan with comprehensive specialist departments.",
    },
    "0-7420-0200": {
        "name": "Rat Yindee Hospital", "nameTh": "โรงพยาบาลราษฎร์ยินดี",
        "group": "Independent", "type": "Private", "website": "https://www.ratyindee.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Rat Yindee Hospital in Songkhla provides private medical services for the Hat Yai area with general and specialist care.",
    },
    "0-7796-5889": {
        "name": "Wattanapat Samui Hospital", "nameTh": "โรงพยาบาลวัฒนแพทย์ สมุย",
        "group": "Independent", "type": "Private", "website": "https://www.wattanapat.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Wattanapat Samui Hospital serves Koh Samui island visitors and residents with private medical and emergency services.",
    },
    "0-7520-5555": {
        "name": "Wattanapat Trang Hospital", "nameTh": "โรงพยาบาลวัฒนแพทย์ ตรัง",
        "group": "Independent", "type": "Private", "website": "https://www.wattanapat.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Wattanapat Trang provides private hospital services for Trang province including emergency and specialist care.",
    },
    "0-3555-2724-7": {
        "name": "Vibhavadi Piyarath Hospital", "nameTh": "โรงพยาบาลวิภาวดี-ปิยะราษฎร์",
        "group": "Independent", "type": "Private", "website": "https://www.vibhavadipiyarath.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Private hospital in Ratchaburi area offering general and specialist medical services with direct insurance billing.",
    },
    "0-7728-2520-1": {
        "name": "Sri Vichai Surat Thani Hospital", "nameTh": "โรงพยาบาลศรีวิชัย สุราษฎร์ธานี",
        "group": "Independent", "type": "Private", "website": "https://www.srivichai.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Sri Vichai Hospital is a leading private hospital in Surat Thani offering comprehensive specialist medical care and direct billing.",
    },
    "0-7436-6966": {
        "name": "Sikarin Hat Yai Hospital", "nameTh": "โรงพยาบาลศิครินทร์ หาดใหญ่",
        "group": "Independent", "type": "Private", "website": "https://www.sikarin.com/hatyai",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Sikarin Hat Yai is a full-service private hospital in Songkhla's main city offering comprehensive specialist care and direct billing.",
    },
    "0-3550-0283-8": {
        "name": "Suphimit Hospital", "nameTh": "โรงพยาบาลศุภมิตร",
        "group": "Independent", "type": "Private", "website": "https://www.suphimit.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Suphimit Hospital provides private medical and specialist services for its community with direct insurance billing.",
    },
    "0-7445-1024": {
        "name": "Songklanagarind Hospital", "nameTh": "โรงพยาบาลสงขลานครินทร์",
        "group": "Independent", "type": "Government", "website": "https://www.med.psu.ac.th",
        "specialties": ["Emergency", "Oncology", "Cardiology", "Neurology", "Transplant"],
        "summary": "Prince of Songkla University's Songklanagarind Hospital is a leading academic medical centre for southern Thailand with advanced specialist care.",
    },
    "0-4531-9295": {
        "name": "Sunpasitthiprasong Hospital", "nameTh": "โรงพยาบาลสรรพสิทธิประสงค์",
        "group": "Independent", "type": "Government", "website": "https://www.sappasit.go.th",
        "specialties": ["Emergency", "Cardiology", "Oncology", "Maternity"],
        "summary": "Sunpasitthiprasong is the major government referral hospital for Ubon Ratchathani and eastern Isaan with comprehensive specialist services.",
    },
    "0-73223600-4": {
        "name": "Siroros Hospital", "nameTh": "โรงพยาบาลสิโรรส",
        "group": "Independent", "type": "Private", "website": "https://www.siroros.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Siroros Hospital provides private medical services for Trang province with general and specialist care and direct billing.",
    },
    "0-4526-0300": {
        "name": "Ubon Rak Thonburi Hospital", "nameTh": "โรงพยาบาลอุบลรักษ์ธนบุรี",
        "group": "Thonburi Group", "type": "Private", "website": "https://www.thonburi-hospital.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Thonburi Group hospital in Ubon Ratchathani providing full private specialist care for eastern Isaan.",
    },
    "0-3631-5555": {
        "name": "Kasemrad Saraburi Hospital", "nameTh": "โรงพยาบาลเกษมราษฎร์ สระบุรี",
        "group": "Independent", "type": "Private", "website": "https://www.kasemrad.co.th",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Kasemrad Group hospital in Saraburi offering full private medical services with specialist departments and direct billing.",
    },
    "0-4234-2555": {
        "name": "Ek Udon Hospital", "nameTh": "โรงพยาบาลเอกอุดร",
        "group": "Independent", "type": "Private", "website": "https://www.ekudon.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Ek Udon Hospital provides private medical services for Udon Thani with general and specialist care and direct billing.",
    },
    "0-5553-3912-4": {
        "name": "Mae Sot Ram Hospital", "nameTh": "โรงพยาบาลแม่สอด-ราม",
        "group": "Independent", "type": "Private", "website": "https://www.maesotram.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mae Sot Ram Hospital serves the Thai-Myanmar border town of Mae Sot with private medical services and direct insurance billing.",
    },
    "0-2080-8999": {
        "name": "Kodee Misuk Hospital", "nameTh": "โรงพยาบาลกระดูกและข้อ ข้อดีมีสุข",
        "group": "Independent", "type": "Private", "website": "https://www.kodimisuk.com",
        "specialties": ["Orthopedics"],
        "summary": "Specialist bone and joint hospital offering orthopedic surgery, joint replacement, and sports medicine services.",
    },
    "0-4352-7111": {
        "name": "Churivej Hospital", "nameTh": "โรงพยาบาลจุรีเวช",
        "group": "Independent", "type": "Private", "website": "https://www.churivej.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Churivej Hospital in Roi Et provides private medical services for the province with specialist care and direct insurance billing.",
    },
    "0-2587-0136-55": {
        "name": "Bang Pho Hospital", "nameTh": "โรงพยาบาลบางโพ",
        "group": "Independent", "type": "Private", "website": "https://www.bangphohospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Bang Pho Hospital in Bangkok's Dusit district offers private medical services with general and specialist care and direct billing.",
    },
    "05358-1998": {
        "name": "Lamphun Klaimor Hospital", "nameTh": "โรงพยาบาลลำพูนใกล้หมอ",
        "group": "Independent", "type": "Private", "website": "https://www.lamphunklaimor.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Lamphun Klaimor Hospital provides accessible private medical services for Lamphun province with specialist care.",
    },
    "0-3561-2361-4": {
        "name": "Ang Thong Wetchakan 2 Hospital", "nameTh": "โรงพยาบาลอ่างทองเวชชการ 2",
        "group": "Independent", "type": "Private", "website": "https://www.angthongwetchakan.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Ang Thong Wetchakan 2 Hospital serves Ang Thong province with private general and specialist medical services.",
    },
    "0-7741-4400-9": {
        "name": "Thai International Hospital", "nameTh": "โรงพยาบาลไทยอินเตอร์เนชั่นแนล",
        "group": "Independent", "type": "Private", "website": "https://www.thaiinternational.co.th",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Thai International Hospital provides private medical services for its province with specialist care and direct insurance billing.",
    },

    # ── English-named hospitals (from previous research script) ─────────────
    # BDMS - Bangkok Hospital chain
    "0-5205-1800": {
        "name": "Bangkok Hospital Chiang Rai", "nameTh": "โรงพยาบาลกรุงเทพ เชียงราย",
        "group": "BDMS", "type": "Private", "website": "https://www.bangkokhospital.com/chiangrai",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Full-service BDMS hospital in Chiang Rai offering 24-hour emergency, cardiac, and maternity services with English-speaking international staff.",
    },
    "0-4304-2888": {
        "name": "Bangkok Hospital KhonKaen", "nameTh": "โรงพยาบาลกรุงเทพ ขอนแก่น",
        "group": "BDMS", "type": "Private", "website": "https://www.bangkokhospital.com/khonkaen",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "BDMS flagship hospital for Khon Kaen and northeast Thailand offering full-service medical care with international standards and direct billing.",
    },
    # Samitivej
    "0-2438-9000": {
        "name": "Samitivej Thonburi Hospital", "nameTh": "โรงพยาบาลสมิติเวช ธนบุรี",
        "group": "BDMS", "type": "Private", "website": "https://www.samitivejhospitals.com/thonburi",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Pediatrics"],
        "summary": "BDMS Samitivej hospital on the Thonburi side of Bangkok offering full specialist services with English-speaking staff and direct insurance billing.",
    },
    "0-2118-7888": {
        "name": "Samitivej Chinatown Hospital", "nameTh": "โรงพยาบาลสมิติเวช ไชน่าทาวน์",
        "group": "BDMS", "type": "Private", "website": "https://www.samitivejhospitals.com/chinatown",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Pediatrics"],
        "summary": "Samitivej Chinatown caters to Bangkok's central district with multilingual staff (Thai, Chinese, English) and comprehensive specialist services.",
    },
    "0-3303-8888": {
        "name": "Samitivej Chonburi Hospital", "nameTh": "โรงพยาบาลสมิติเวช ชลบุรี",
        "group": "BDMS", "type": "Private", "website": "https://www.samitivejhospitals.com/chonburi",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Pediatrics"],
        "summary": "Major BDMS Samitivej hospital serving Chonburi and the eastern seaboard with full specialist departments and international patient services.",
    },
    "0-3832-0300": {
        "name": "Samitivej Sriracha Hospital", "nameTh": "โรงพยาบาลสมิติเวช ศรีราชา",
        "group": "BDMS", "type": "Private", "website": "https://www.samitivejhospitals.com/sriracha",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Pediatrics"],
        "summary": "BDMS Samitivej Sriracha serves the industrial zone and expat community with comprehensive medical services and international patient support.",
    },
    # Paolo
    "0-2150-0900": {
        "name": "Paolo Kaset Hospital", "nameTh": "โรงพยาบาลเปาโล เกษตร",
        "group": "BDMS", "type": "Private", "website": "https://www.paolohosp.co.th/kaset",
        "specialties": ["Emergency", "Maternity", "Pediatrics", "Orthopedics"],
        "summary": "Paolo Kaset is a full-service BDMS hospital near Kasetsart with strong maternity and paediatric departments and English-speaking staff.",
    },
    "0-2514-4140-9": {
        "name": "Paolo Hospital Chokchai 4", "nameTh": "โรงพยาบาลเปาโล โชคชัย 4",
        "group": "BDMS", "type": "Private", "website": "https://www.paolohosp.co.th/chokchai4",
        "specialties": ["Emergency", "Maternity", "Pediatrics", "Cardiology"],
        "summary": "Paolo Chokchai 4 serves northeast Bangkok with comprehensive medical and surgical services, strong maternity care, and Allianz direct billing.",
    },
    # Thonburi Group
    "0-2448-3845": {
        "name": "Thonburi Thawiwatthana Hospital", "nameTh": "โรงพยาบาลธนบุรี ทวีวัฒนา",
        "group": "Thonburi Group", "type": "Private", "website": "https://www.thonburi-hospital.com",
        "specialties": ["Emergency", "Orthopedics", "Maternity"],
        "summary": "Thonburi Group hospital in Thawiwatthana district serving west Bangkok residents with general and specialist medical services.",
    },
    "0-2220-7999": {
        "name": "Thonburi Bamrungmuang Hospital", "nameTh": "โรงพยาบาลธนบุรี บำรุงเมือง",
        "group": "Thonburi Group", "type": "Private", "website": "https://www.thonburi-hospital.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics"],
        "summary": "Thonburi Group hospital on Bamrungmuang Road serving Bangkok's old city and Chinatown areas with quality private medical care.",
    },
    "0-7765-8555": {
        "name": "Thonburi-Chumphon Hospital", "nameTh": "โรงพยาบาลธนบุรี ชุมพร",
        "group": "Thonburi Group", "type": "Private", "website": "https://www.thonburi-hospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Thonburi Group hospital in Chumphon providing quality private healthcare for the province with 24-hour emergency and specialist services.",
    },
    "043-840444": {
        "name": "Thonburi Hospital Kalasin", "nameTh": "โรงพยาบาลธนบุรี กาฬสินธุ์",
        "group": "Thonburi Group", "type": "Private", "website": "https://www.thonburi-hospital.com",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Thonburi Group hospital in Kalasin offering private medical services to the province including emergency, general medicine, and specialist care.",
    },
    "0-7580-8888": {
        "name": "Thonburi Thungsong Hospital", "nameTh": "โรงพยาบาลธนบุรี ทุ่งสง",
        "group": "Thonburi Group", "type": "Private", "website": "https://www.thonburi-hospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Thonburi Group hospital in Thung Song, Nakhon Si Thammarat, serving local residents with full general and specialist medical services.",
    },
    "0-2901-8400": {
        "name": "Phatara-Thonburi Hospital", "nameTh": "โรงพยาบาลพัทรา-ธนบุรี",
        "group": "Thonburi Group", "type": "Private", "website": "https://www.thonburi-hospital.com",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Thonburi Group hospital in northwest Bangkok providing private healthcare with emergency, surgical, and specialist services.",
    },
    "0-4352-7199": {
        "name": "Roi Et - Thonburi Hospital", "nameTh": "โรงพยาบาลร้อยเอ็ด ธนบุรี",
        "group": "Thonburi Group", "type": "Private", "website": "https://www.thonburi-hospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Thonburi Group's hospital in Roi Et offering private specialist care for the province including 24-hour emergency and insurance direct billing.",
    },
    # Phyathai
    "0-2467-1111": {
        "name": "Phyathai 3 Hospital", "nameTh": "โรงพยาบาลพญาไท 3",
        "group": "Phyathai Group", "type": "Private", "website": "https://www.phyathai.com/en/phyathai3",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Phyathai 3 is a comprehensive Phyathai Group hospital in Bangkok's Bang Yai area offering full specialist departments with English-speaking staff.",
    },
    "0-2944-7111": {
        "name": "Phyathai Nawamin Hospital", "nameTh": "โรงพยาบาลพญาไท นวมินทร์",
        "group": "Phyathai Group", "type": "Private", "website": "https://www.phyathai.com/en/nawamin",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Phyathai Nawamin serves northeast Bangkok with full-service private medical care including comprehensive specialist departments.",
    },
    # Ram hospitals
    "0-4461-4100-7": {
        "name": "Buriram Ram Hospital", "nameTh": "โรงพยาบาลรามบุรีรัมย์",
        "group": "Independent", "type": "Private", "website": "https://www.ramhospital.com/buriram",
        "specialties": ["Emergency", "Orthopedics", "Maternity"],
        "summary": "Private Ram hospital in Buriram providing quality medical care for the province with 24-hour emergency and specialist services.",
    },
    "0-4483-6888": {
        "name": "Chaiyaphum Ram Hospital", "nameTh": "โรงพยาบาลรามชัยภูมิ",
        "group": "Independent", "type": "Private", "website": "https://www.ramhospital.com",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Ram network hospital in Chaiyaphum serving the province with private medical services including emergency, surgery, and specialist care.",
    },
    "0-4300-2002": {
        "name": "Khon Kaen Ram Hospital", "nameTh": "โรงพยาบาลขอนแก่นราม",
        "group": "Independent", "type": "Private", "website": "https://www.kkram.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "One of the major private hospitals in Khon Kaen city offering comprehensive specialist care, cardiac services, and direct insurance billing.",
    },
    "0-5401-9619": {
        "name": "Khelangnakorn-Ram Hospital", "nameTh": "โรงพยาบาลเขลางค์นคร-ราม",
        "group": "Independent", "type": "Private", "website": "https://www.ramhospital.com",
        "specialties": ["Emergency", "Orthopedics", "Maternity"],
        "summary": "Private Ram-affiliated hospital in Lampang offering quality private medical care with specialist services for northern Thailand.",
    },
    "0-4287-0000-9": {
        "name": "Mueang Loei Ram Hospital", "nameTh": "โรงพยาบาลเมืองเลยราม",
        "group": "Independent", "type": "Private", "website": "https://www.ramhospital.com",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Ram network private hospital in Loei province providing essential medical and specialist services with insurance direct billing.",
    },
}

# ── Name-keyed research for English-named hospitals not in phone mapping ────
NAME_RESEARCH = {
    "Camillian Hospital": {
        "nameTh": "โรงพยาบาลคามิลเลียน",
        "group": "Independent", "type": "Private", "website": "https://www.camillianhospital.org",
        "specialties": ["Emergency", "Maternity", "Pediatrics", "Cardiology"],
        "summary": "Catholic-affiliated Camillian Hospital in Bangkok is known for compassionate care, strong maternity services, and Allianz direct billing.",
    },
    "CGH Phaholyothin Hospital": {
        "nameTh": "โรงพยาบาลซีจีเอช พหลโยธิน",
        "group": "Independent", "type": "Private", "website": "https://www.cgh.co.th",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "CGH hospital on Phahonyothin Road serving north Bangkok with private medical services, emergency care, and specialist consultations.",
    },
    "CGH Saimai Hospital": {
        "nameTh": "โรงพยาบาลซีจีเอช สายไหม",
        "group": "Independent", "type": "Private", "website": "https://www.cgh.co.th",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "CGH Saimai provides private hospital services in the Sai Mai area of north Bangkok including emergency, maternity, and general medical care.",
    },
    "Nakornthon Hospital": {
        "nameTh": "โรงพยาบาลนครธน",
        "group": "Independent", "type": "Private", "website": "https://www.nakornthon.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Nakornthon Hospital in Bangkok's Rama 2 area is a full-service private hospital known for orthopaedics and cardiology with direct insurance billing.",
    },
    "Navamin 9 Hospital": {
        "nameTh": "โรงพยาบาลนวมินทร์ 9",
        "group": "Independent", "type": "Private", "website": "https://www.navamin9.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Navamin 9 Hospital serves northeast Bangkok with comprehensive specialist care including cardiology, orthopaedics, and direct insurance billing.",
    },
    "Bangpakok 1 Hospital": {
        "nameTh": "โรงพยาบาลบางปะกอก 1",
        "group": "Independent", "type": "Private", "website": "https://www.bangpakok.com",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "Bangpakok 1 is a private hospital in Bangkok's Rat Burana district offering general and specialist medical services with insurance billing.",
    },
    "Bangpakok 3 Hospital": {
        "nameTh": "โรงพยาบาลบางปะกอก 3",
        "group": "Independent", "type": "Private", "website": "https://www.bangpakok.com",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "Bangpakok 3 serves south Bangkok with private hospital services including emergency, internal medicine, and specialist consultations.",
    },
    "Bangpakok 8 Hospital": {
        "nameTh": "โรงพยาบาลบางปะกอก 8",
        "group": "Independent", "type": "Private", "website": "https://www.bangpakok8.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Modern Bangpakok Group hospital with high-quality facilities serving south Bangkok and Samut Prakan with comprehensive specialist care.",
    },
    "Bangpakok 9 International Hospital": {
        "nameTh": "โรงพยาบาลนานาชาติบางปะกอก 9",
        "group": "Independent", "type": "Private", "website": "https://www.bangpakok9.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Bangpakok 9 International is a modern full-service hospital in south Bangkok with international patient services and direct billing.",
    },
    "Bangpakok Samut Prakan Hospital": {
        "nameTh": "โรงพยาบาลบางปะกอก สมุทรปราการ",
        "group": "Independent", "type": "Private", "website": "https://www.bangpakok.com",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "Bangpakok Group hospital in Samut Prakan serving the industrial estates and communities southeast of Bangkok.",
    },
    "Bangpakok-Rangsit 2 Hospital": {
        "nameTh": "โรงพยาบาลบางปะกอก-รังสิต 2",
        "group": "Independent", "type": "Private", "website": "https://www.bangpakok.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Bangpakok-Rangsit 2 is a private hospital in Pathum Thani's Rangsit area offering general medical and specialist services.",
    },
    "Kasemrad Hospital Bang Khae": {
        "nameTh": "โรงพยาบาลเกษมราษฎร์ บางแค",
        "group": "Independent", "type": "Private", "website": "https://www.kasemrad.co.th",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Kasemrad Group hospital in Bang Khae serving west Bangkok with full specialist services and direct insurance billing.",
    },
    "Kasemrad International Hospital Ratthanatibeth": {
        "nameTh": "โรงพยาบาลนานาชาติเกษมราษฎร์ รัตนาธิเบศร์",
        "group": "Independent", "type": "Private", "website": "https://www.kasemrad.co.th",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Kasemrad International Rattanathibet is a modern private hospital in Nonthaburi with international patient services and specialist care.",
    },
    "Kasemrad Rattanatibeth Hospital": {
        "nameTh": "โรงพยาบาลเกษมราษฎร์ รัตนาธิเบศร์",
        "group": "Independent", "type": "Private", "website": "https://www.kasemrad.co.th",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Kasemrad hospital in Rattanathibet, Nonthaburi, offering full private medical services with specialist departments and insurance billing.",
    },
    "Kasemrad International Hospital Rattanatibeth": {
        "nameTh": "โรงพยาบาลนานาชาติเกษมราษฎร์ รัตนาธิเบศร์",
        "group": "Independent", "type": "Private", "website": "https://www.kasemrad.co.th",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Kasemrad International Rattanathibet in Nonthaburi offers private hospital services with international patient support and direct billing.",
    },
    "Kasemrad Pathum Thani Hospital": {
        "nameTh": "โรงพยาบาลเกษมราษฎร์ ปทุมธานี",
        "group": "Independent", "type": "Private", "website": "https://www.kasemrad.co.th",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Kasemrad Group hospital in Pathum Thani serving the northern Bangkok suburbs with comprehensive private medical and specialist care.",
    },
    "Kasemrad Prachachuen Hospital": {
        "nameTh": "โรงพยาบาลเกษมราษฎร์ ประชาชื่น",
        "group": "Independent", "type": "Private", "website": "https://www.kasemrad.co.th",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Kasemrad Prachachuen provides private hospital services in Bangkok's northern corridor with specialist departments and insurance direct billing.",
    },
    "Kasemrad Sriburin Hospital": {
        "nameTh": "โรงพยาบาลเกษมราษฎร์ ศรีบุรินทร์",
        "group": "Independent", "type": "Private", "website": "https://www.kasemrad.co.th",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Kasemrad Group hospital in Chiang Rai offering private medical care for the province with specialist services and insurance billing.",
    },
    "KASEMRAD INTERNATIONAL HOSPITAL ARANYAPRATHET": {
        "nameTh": "โรงพยาบาลนานาชาติเกษมราษฎร์ อรัญประเทศ",
        "group": "Independent", "type": "Private", "website": "https://www.kasemrad.co.th",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Kasemrad International Aranyaprathet serves the Thai-Cambodian border region with private hospital services for local and cross-border patients.",
    },
    "Vichaivej International Hospital Nong Khaem": {
        "nameTh": "โรงพยาบาลนานาชาติวิชัยเวช หนองแขม",
        "group": "Independent", "type": "Private", "website": "https://www.vichaivej.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vichaivej International Hospital in Nong Khaem offers comprehensive private medical care for west Bangkok with international patient services.",
    },
    "Vichaivej Hospital Yaek Fai Chai": {
        "nameTh": "โรงพยาบาลวิชัยเวช แยกไฟฉาย",
        "group": "Independent", "type": "Private", "website": "https://www.vichaivej.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics"],
        "summary": "Vichaivej Hospital near Yaek Fai Chai serves the Thon Buri-side Bangkok community with quality private medical care.",
    },
    "Vichaivej Hospital International Omnoi": {
        "nameTh": "โรงพยาบาลวิชัยเวช อินเตอร์เนชั่นแนล อ้อมน้อย",
        "group": "Independent", "type": "Private", "website": "https://www.vichaivej.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vichaivej International Omnoi serves Samut Sakhon and western Bangkok suburbs with full-service private medical care and insurance direct billing.",
    },
    "Vichaivej International Hospital Samutsakhon": {
        "nameTh": "โรงพยาบาลวิชัยเวช อินเตอร์เนชั่นแนล สมุทรสาคร",
        "group": "Independent", "type": "Private", "website": "https://www.vichaivej.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vichaivej International in Samut Sakhon offers comprehensive private medical care for the industrial province west of Bangkok.",
    },
    "Vibharam Hospital": {
        "nameTh": "โรงพยาบาลวิภาราม",
        "group": "Independent", "type": "Private", "website": "https://www.vibharam.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vibharam Hospital is a full-service private hospital in Bangkok offering comprehensive specialist care with direct insurance billing.",
    },
    "Vibharam Amata": {
        "nameTh": "โรงพยาบาลวิภาราม อมตะ",
        "group": "Independent", "type": "Private", "website": "https://www.vibharam.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics"],
        "summary": "Vibharam Amata serves the Amata industrial estate and surrounding Chonburi communities with private medical services and direct billing.",
    },
    "Vibharam Samut Sakhon Hospital": {
        "nameTh": "โรงพยาบาลวิภาราม สมุทรสาคร",
        "group": "Independent", "type": "Private", "website": "https://www.vibharam.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Vibharam Group hospital in Samut Sakhon providing private medical care for the seafood-industry province west of Bangkok.",
    },
    "Synphaet Ramintra Hospital": {
        "nameTh": "โรงพยาบาลสินแพทย์ รามอินทรา",
        "group": "Independent", "type": "Private", "website": "https://www.synphaet.co.th",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Synphaet Ramintra is a modern private hospital in northeast Bangkok offering comprehensive specialist care and direct insurance billing.",
    },
    "Synphaet Lamlukka Hospital": {
        "nameTh": "โรงพยาบาลสินแพทย์ ลำลูกกา",
        "group": "Independent", "type": "Private", "website": "https://www.synphaet.co.th",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Synphaet Lamlukka provides private hospital services for Pathum Thani's Lamlukka district including emergency and specialist care.",
    },
    "Synphaet Seriruk Hospital": {
        "nameTh": "โรงพยาบาลสินแพทย์ เสรีรักษ์",
        "group": "Independent", "type": "Private", "website": "https://www.synphaet.co.th",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Synphaet Seriruk serves northeast Bangkok with private medical care including maternity, emergency, and general specialist services.",
    },
    "Synphaet Theparak Hospital": {
        "nameTh": "โรงพยาบาลสินแพทย์ เทพารักษ์",
        "group": "Independent", "type": "Private", "website": "https://www.synphaet.co.th",
        "specialties": ["Emergency", "Maternity", "Cardiology", "Orthopedics"],
        "summary": "Synphaet Theparak is a full-service private hospital on Thepharak Road serving Samut Prakan with comprehensive medical care.",
    },
    "Vibhavadi Hospital": {
        "nameTh": "โรงพยาบาลวิภาวดี",
        "group": "Independent", "type": "Private", "website": "https://www.vibhavadihospital.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vibhavadi Hospital on Vibhavadi-Rangsit Road offers comprehensive private medical care including trauma, cardiac, and surgical services.",
    },
    "PRINC Hospital Lamphun": {
        "nameTh": "โรงพยาบาลพริ้นซ์ ลำพูน",
        "group": "Independent", "type": "Private", "website": "https://www.princhospital.com",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "PRINC Hospital Lamphun serves northern Thailand's Lamphun province with quality private medical care and specialist services.",
    },
    "PRINC Hospital Paknampo": {
        "nameTh": "โรงพยาบาลพริ้นซ์ ปากน้ำโพ",
        "group": "Independent", "type": "Private", "website": "https://www.princhospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "PRINC Hospital Paknampo in Nakhon Sawan offers private healthcare services for the upper central Thailand region.",
    },
    "Princ Hospital Suvarnabhumi": {
        "nameTh": "โรงพยาบาลพริ้นซ์ สุวรรณภูมิ",
        "group": "Independent", "type": "Private", "website": "https://www.princhospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology", "Orthopedics"],
        "summary": "PRINC Suvarnabhumi is conveniently located near Suvarnabhumi Airport, offering full medical services for travellers and east Bangkok residents.",
    },
    "Chularat 3 International Hospital": {
        "nameTh": "โรงพยาบาลจุฬารัตน์ 3 อินเตอร์เนชั่นแนล",
        "group": "Independent", "type": "Private", "website": "https://www.chularat.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Chularat 3 International is a modern private hospital in Chachoengsao with comprehensive specialist departments and international patient services.",
    },
    "Chularat 9 Airport Hospital": {
        "nameTh": "โรงพยาบาลจุฬารัตน์ 9 แอร์พอร์ต",
        "group": "Independent", "type": "Private", "website": "https://www.chularat.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Chularat 9 Airport Hospital is located near Suvarnabhumi Airport serving Samut Prakan and Chachoengsao with full private medical services.",
    },
    "Mission Hospital Bangkok": {
        "nameTh": "โรงพยาบาลมิชชั่น กรุงเทพ",
        "group": "Independent", "type": "Private", "website": "https://www.missionhospital.co.th",
        "specialties": ["Emergency", "Maternity", "Cardiology", "Orthopedics"],
        "summary": "Mission Hospital Bangkok is a Christian-affiliated private hospital offering compassionate full-service medical care near the Old City.",
    },
    "Phrae Christian Hospital": {
        "nameTh": "โรงพยาบาลคริสเตียนแพร่",
        "group": "Independent", "type": "Private", "website": "https://www.phraechristianhospital.org",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "Phrae Christian Hospital is a long-established faith-based hospital in Phrae province offering quality private medical and surgical care.",
    },
    "Nakhon Christian Hospital": {
        "nameTh": "โรงพยาบาลคริสเตียนนครปฐม",
        "group": "Independent", "type": "Private", "website": "https://www.nakhonchristian.org",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "Nakhon Christian Hospital provides faith-based private medical care in Nakhon Pathom with maternity and general specialist services.",
    },
    "San Camillo Hospital": {
        "nameTh": "โรงพยาบาลซานคามิลโล",
        "group": "Independent", "type": "Private", "website": "https://www.sancamillo.co.th",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "San Camillo is a Catholic-heritage private hospital offering compassionate care with maternity, pediatrics, and general medical services.",
    },
    "Siriraj Piyamaharajkarun Hospital": {
        "nameTh": "โรงพยาบาลศิริราช ปิยมหาราชการุณย์",
        "group": "Independent", "type": "Government", "website": "https://www.si.mahidol.ac.th/siphhospital",
        "specialties": ["Emergency", "Cardiology", "Oncology", "Neurology", "Transplant"],
        "summary": "The premium private wing of Siriraj Hospital offering world-class specialist care including oncology, neurology, and cardiology.",
    },
    "Thammasat University Hospital": {
        "nameTh": "โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ",
        "group": "Independent", "type": "Government", "website": "https://hospital.tu.ac.th",
        "specialties": ["Emergency", "Cardiology", "Oncology", "Orthopedics", "Neurology"],
        "summary": "Thammasat University Hospital is a leading academic hospital near Rangsit offering comprehensive specialist care including oncology and cardiac surgery.",
    },
    "Burapha University Hospital": {
        "nameTh": "โรงพยาบาลมหาวิทยาลัยบูรพา",
        "group": "Independent", "type": "Government", "website": "https://hospital.buu.ac.th",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Burapha University Hospital in Chonburi is an academic medical centre serving the eastern seaboard with specialist care and clinical training.",
    },
    "Suranaree University of Technology Hospital": {
        "nameTh": "โรงพยาบาลมหาวิทยาลัยเทคโนโลยีสุรนารี",
        "group": "Independent", "type": "Government", "website": "https://hospital.sut.ac.th",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "SUT Hospital in Nakhon Ratchasima is a modern academic hospital offering specialist services for Korat and surrounding provinces.",
    },
    "Srinagarind Hospital": {
        "nameTh": "โรงพยาบาลศรีนครินทร์",
        "group": "Independent", "type": "Government", "website": "https://md.kku.ac.th/hospital",
        "specialties": ["Emergency", "Oncology", "Cardiology", "Neurology", "Transplant"],
        "summary": "Khon Kaen University's Srinagarind Hospital is a leading academic medical centre for northeast Thailand with advanced oncology and specialist care.",
    },
    "Sriphat Medical Center - OPD building": {
        "nameTh": "ศูนย์การแพทย์ศรีพัฒน์",
        "group": "Independent", "type": "Government", "website": "https://sriphat.med.cmu.ac.th",
        "specialties": ["Cardiology", "Oncology", "Orthopedics", "Neurology"],
        "summary": "Sriphat Medical Center is the private patient arm of Chiang Mai University's Maharaj Nakorn Hospital offering world-class specialist care in northern Thailand.",
    },
    "Mae Fah Luang University Medical Center Hospital": {
        "nameTh": "โรงพยาบาลศูนย์การแพทย์มหาวิทยาลัยแม่ฟ้าหลวง",
        "group": "Independent", "type": "Government", "website": "https://mfmc.mfu.ac.th",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Mae Fah Luang University Medical Center in Chiang Rai provides academic hospital services for the province.",
    },
    "Hospital for Tropical Diseases": {
        "nameTh": "โรงพยาบาลเวชศาสตร์เขตร้อน",
        "group": "Independent", "type": "Government", "website": "https://www.tm.mahidol.ac.th",
        "specialties": ["Emergency"],
        "summary": "The Hospital for Tropical Diseases is a Mahidol University specialist centre for tropical medicine, infectious diseases, and travel health.",
    },
    "Vachira Phuket Hospital": {
        "nameTh": "โรงพยาบาลวชิระภูเก็ต",
        "group": "Independent", "type": "Government", "website": "https://www.vachiraphuket.go.th",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vachira Phuket is a large government hospital providing public and private healthcare for Phuket Island with comprehensive specialist services.",
    },
    "Patong Hospital": {
        "nameTh": "โรงพยาบาลป่าตอง",
        "group": "Independent", "type": "Government", "website": "https://www.patonghospital.go.th",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Patong Hospital is the main hospital serving Patong Beach in Phuket with emergency, surgical, and general medical services for tourists and residents.",
    },
    "Hariphunchai Memorial Hospital Co., Ltd.": {
        "nameTh": "โรงพยาบาลหริภุญชัยเมโมเรียล",
        "group": "Independent", "type": "Private", "website": "https://www.hariphunchai.com",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Hariphunchai Memorial Hospital in Lamphun provides private medical care for the province with general and specialist services.",
    },
    "Piyavate Hospital": {
        "nameTh": "โรงพยาบาลปิยะเวท",
        "group": "Independent", "type": "Private", "website": "https://www.piyavate.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity", "Neurology"],
        "summary": "Piyavate Hospital on Ratchawithi Road is a well-regarded private hospital known for neurology and cardiology with English-speaking international staff.",
    },
    "Mongkutwattana Hospital": {
        "nameTh": "โรงพยาบาลมงกุฎวัฒนะ",
        "group": "Independent", "type": "Private", "website": "https://www.mgkwattana.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Mongkutwattana Hospital in northwest Bangkok offers full specialist medical services including cardiac, orthopaedic, and maternity care.",
    },
    "Nonthavej Hospital": {
        "nameTh": "โรงพยาบาลนนทเวช",
        "group": "Independent", "type": "Private", "website": "https://www.nonthavej.co.th",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Nonthavej Hospital in Nonthaburi is a full-service private hospital with strong cardiac and maternity departments and direct Allianz billing.",
    },
    "Vichaiyut Hospital": {
        "nameTh": "โรงพยาบาลวิชัยยุทธ",
        "group": "Independent", "type": "Private", "website": "https://www.vichaiyut.co.th",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Oncology"],
        "summary": "Vichaiyut Hospital in Bangkok's Phaya Thai area is a respected private hospital known for oncology, cardiac care, and specialist consultations.",
    },
    "Ramkhamhaeng Hospital": {
        "nameTh": "โรงพยาบาลรามคำแหง",
        "group": "Independent", "type": "Private", "website": "https://www.ramhospital.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Ramkhamhaeng Hospital is a full-service private hospital in east Bangkok known for cardiac and orthopaedic care with comprehensive insurance billing.",
    },
    "Chaophya Hospital": {
        "nameTh": "โรงพยาบาลเจ้าพระยา",
        "group": "Independent", "type": "Private", "website": "https://www.chaophyahospital.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Chaophya Hospital on the west bank of the Chao Phraya River provides comprehensive private medical services for Bangkok's Thonburi area.",
    },
    "Hua Chiew Hospital": {
        "nameTh": "โรงพยาบาลหัวเฉียว",
        "group": "Independent", "type": "Private", "website": "https://www.huachiewhospital.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Hua Chiew Hospital in Bangkok's Chinatown area is affiliated with the Hua Chiew Foundation, offering quality private care and specialist services.",
    },
    "World Medical Hospital": {
        "nameTh": "โรงพยาบาลเวิลด์เมดิคอล",
        "group": "Independent", "type": "Private", "website": "https://www.wmedical.co.th",
        "specialties": ["Emergency", "Cardiology", "Oncology", "Orthopedics", "Maternity"],
        "summary": "World Medical Hospital on Phetchaburi Road is a modern full-service private hospital known for oncology and cardiac care with English-speaking staff.",
    },
    "Samrong Medical Hospital": {
        "nameTh": "โรงพยาบาลสำโรงการแพทย์",
        "group": "Independent", "type": "Private", "website": "https://www.samrongmedical.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Samrong Medical Hospital in Samut Prakan's Samrong area offers full private hospital services with specialist departments and insurance billing.",
    },
    "Sikarin Hospital": {
        "nameTh": "โรงพยาบาลศิครินทร์",
        "group": "Independent", "type": "Private", "website": "https://www.sikarin.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Sikarin Hospital in Lat Krabang near Suvarnabhumi Airport is a full-service private hospital serving east Bangkok and the airport corridor.",
    },
    "Ladprao General Hospital": {
        "nameTh": "โรงพยาบาลลาดพร้าว",
        "group": "Independent", "type": "Private", "website": "https://www.ladpraohospital.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Ladprao General Hospital in north Bangkok provides comprehensive private medical services including specialist departments and direct insurance billing.",
    },
    "Lanna Hospital": {
        "nameTh": "โรงพยาบาลลานนา",
        "group": "Independent", "type": "Private", "website": "https://www.lanna-hospital.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Lanna Hospital is a well-established private hospital in Chiang Mai known for high-quality care, English-speaking staff, and insurance direct billing.",
    },
    "Overbrook Hospital": {
        "nameTh": "โรงพยาบาลโอเวอร์บรุ๊ค",
        "group": "Independent", "type": "Private", "website": "https://www.overbrook.co.th",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Overbrook Hospital is a long-established private hospital in Chiang Rai serving the northern border region with general and specialist medical care.",
    },
    "Chiang Mai Klaimor Hospital": {
        "nameTh": "โรงพยาบาลเชียงใหม่ใกล้หมอ",
        "group": "Independent", "type": "Private", "website": "https://www.klaimorhospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Chiang Mai Klaimor Hospital provides private medical services in Chiang Mai with specialist care and direct insurance billing.",
    },
    "Rajavej Chiang Mai Hospital": {
        "nameTh": "โรงพยาบาลราชเวชเชียงใหม่",
        "group": "Independent", "type": "Private", "website": "https://www.rajavejchiangmai.com",
        "specialties": ["Emergency", "Orthopedics", "Maternity", "Cardiology"],
        "summary": "Rajavej Chiang Mai offers private medical services including orthopedics and maternity care for Chiang Mai and northern Thailand.",
    },
    "Mongkut Rayong Hospital": {
        "nameTh": "โรงพยาบาลมงกุฎระยอง",
        "group": "Independent", "type": "Private", "website": "https://www.mongkutrayon.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Mongkut Rayong Hospital serves Rayong's industrial community with private medical services and specialist care.",
    },
    "Ratchaphruek Hospital": {
        "nameTh": "โรงพยาบาลราชพฤกษ์",
        "group": "Independent", "type": "Private", "website": "https://www.ratchaphruek.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Ratchaphruek Hospital in Nakhon Ratchasima offers full-service private medical care for the Korat region with specialist departments.",
    },
    "Sri Rayong Hospital": {
        "nameTh": "โรงพยาบาลศรีระยอง",
        "group": "Independent", "type": "Private", "website": "https://www.srirayong.co.th",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Sri Rayong Hospital is a full-service private hospital in Rayong serving the industrial estate community with comprehensive medical care.",
    },
    "Rajthanee Hospital": {
        "nameTh": "โรงพยาบาลราชธานี",
        "group": "Independent", "type": "Private", "website": "https://www.rajthanee.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Rajthanee Hospital in Ubon Ratchathani is a full-service private hospital serving the eastern Isaan region with comprehensive specialist care.",
    },
    "Wattanapat Hospital Ao Nang": {
        "nameTh": "โรงพยาบาลวัฒนแพทย์ อ่าวนาง",
        "group": "Independent", "type": "Private", "website": "https://www.wattanapat.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Wattanapat Ao Nang serves the popular Ao Nang tourist area in Krabi with 24-hour emergency care and private specialist services.",
    },
    "Krabi Nakharin International Hospital": {
        "nameTh": "โรงพยาบาลนานาชาติกระบี่นครินทร์",
        "group": "Independent", "type": "Private", "website": "https://www.krabinakharin.com",
        "specialties": ["Emergency", "Maternity", "Cardiology", "Orthopedics"],
        "summary": "Krabi Nakharin International Hospital is the leading private hospital in Krabi serving tourists and residents with English-speaking staff.",
    },
    "Nong Khai Wattana Hospital": {
        "nameTh": "โรงพยาบาลหนองคายวัฒนา",
        "group": "Independent", "type": "Private", "website": "https://www.nkwattana.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Nong Khai Wattana Hospital serves the Mekong River border city with private medical services for locals and cross-border patients.",
    },
    "Nong Khai Hospital": {
        "nameTh": "โรงพยาบาลหนองคาย",
        "group": "Independent", "type": "Government", "website": "https://www.nkh.go.th",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Nong Khai Hospital is the main government hospital for the Nong Khai border province offering comprehensive medical services.",
    },
    "Mukdahan International Hospital": {
        "nameTh": "โรงพยาบาลนานาชาติมุกดาหาร",
        "group": "Independent", "type": "Private", "website": "https://www.mukdahaninternational.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mukdahan International Hospital serves the Mekong River border city with private medical care for local patients and Lao cross-border visitors.",
    },
    "Mahasarakham International Hospital": {
        "nameTh": "โรงพยาบาลนานาชาติมหาสารคาม",
        "group": "Independent", "type": "Private", "website": "https://www.mahasarakhamhospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mahasarakham International Hospital provides private medical services for Maha Sarakham province in central Isaan.",
    },
    "ASIA International Hospital": {
        "nameTh": "โรงพยาบาลเอเชียอินเตอร์เนชั่นแนล",
        "group": "Independent", "type": "Private", "website": "https://www.asiahospital.co.th",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "ASIA International Hospital in Rangsit serves the northern Bangkok corridor with comprehensive private medical and specialist services.",
    },
    "Bang Na 2 Hospital": {
        "nameTh": "โรงพยาบาลบางนา 2",
        "group": "Independent", "type": "Private", "website": "https://www.bangna2hospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Bang Na 2 Hospital provides private medical services for the Bang Na and Prawet districts of Bangkok.",
    },
    "Banphaeo General Hospital": {
        "nameTh": "โรงพยาบาลบ้านแพ้ว",
        "group": "Independent", "type": "Private", "website": "https://www.banphaeo.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Banphaeo Hospital in Samut Sakhon is a community hospital offering general and specialist medical services for the province.",
    },
    "B.Care Medical Center": {
        "nameTh": "บี.แคร์เมดิคอลเซ็นเตอร์",
        "group": "Independent", "type": "Private", "website": "https://www.bcare.co.th",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "B.Care Medical Center is a private hospital in Bangkok offering comprehensive medical services with direct insurance billing.",
    },
    "Vimut Hospital": {
        "nameTh": "โรงพยาบาลวิมุต",
        "group": "Independent", "type": "Private", "website": "https://www.vimuthospital.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Vimut Hospital on Vibhavadi Road is a modern full-service private hospital with specialist departments and Allianz direct billing.",
    },
    "ViMUT Theptarin Rama 4 Hospital": {
        "nameTh": "โรงพยาบาลวิมุต เทพธารินทร์ พระรามสี่",
        "group": "Independent", "type": "Private", "website": "https://www.vimuthospital.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "ViMUT Theptarin on Rama 4 Road provides full-service private medical care in central Bangkok with comprehensive specialist departments.",
    },
    "Petcharavej Hospital": {
        "nameTh": "โรงพยาบาลเพชรเวช",
        "group": "Independent", "type": "Private", "website": "https://www.petcharavej.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Petcharavej Hospital in Bangkok's Din Daeng area is a full-service private hospital with specialist departments and direct insurance billing.",
    },
    "Ekachai Hospital": {
        "nameTh": "โรงพยาบาลเอกชัย",
        "group": "Independent", "type": "Private", "website": "https://www.ekachaihospital.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Ekachai Hospital in Samut Sakhon serves the western Bangkok area with comprehensive private medical services including specialist and maternity care.",
    },
    "Suksawat Inter Hospital": {
        "nameTh": "โรงพยาบาลสุขสวัสดิ์ อินเตอร์",
        "group": "Independent", "type": "Private", "website": "https://www.suksawat.co.th",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Suksawat Inter Hospital serves south Bangkok and Bang Phli with private medical services and specialist consultations.",
    },
    "Nakharin Hospital": {
        "nameTh": "โรงพยาบาลนครินทร์",
        "group": "Independent", "type": "Private", "website": "https://www.nakharinhospital.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Nakharin Hospital provides full-service private medical care in Bangkok with comprehensive specialist departments and insurance direct billing.",
    },
    "Benjarom Hospital": {
        "nameTh": "โรงพยาบาลเบญจรมย์",
        "group": "Independent", "type": "Private", "website": "https://www.benjaromhospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Benjarom Hospital is a private hospital serving Bangkok's Lat Phrao area with general and specialist medical services.",
    },
    "Ruamjairak Hospital @Sukhumvit 62": {
        "nameTh": "โรงพยาบาลร่วมใจรักษ์ สุขุมวิท 62",
        "group": "Independent", "type": "Private", "website": "https://www.ruamjairak.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Ruamjairak Hospital near Sukhumvit 62 provides private medical and maternity services for the On Nut-Bang Chak area of Bangkok.",
    },
    "Rajburana Hospital": {
        "nameTh": "โรงพยาบาลราษฎร์บูรณะ",
        "group": "Independent", "type": "Private", "website": "https://www.rajburana.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Rajburana Hospital in south Bangkok serves the Bang Khun Thian and Rat Burana areas with private medical and maternity services.",
    },
    "Tepakorn Hospital": {
        "nameTh": "โรงพยาบาลเทพากร",
        "group": "Independent", "type": "Private", "website": "https://www.tepakornhospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Tepakorn Hospital provides private medical services with general and specialist care and direct insurance billing.",
    },
    "Thainakarin Hospital": {
        "nameTh": "โรงพยาบาลไทยนครินทร์",
        "group": "Independent", "type": "Private", "website": "https://www.thainakarin.co.th",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Thainakarin Hospital on Bangna-Trat Road serves east Bangkok and Samut Prakan with comprehensive private medical and specialist care.",
    },
    "Sikarin Hospital": {
        "nameTh": "โรงพยาบาลศิครินทร์",
        "group": "Independent", "type": "Private", "website": "https://www.sikarin.com",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "Sikarin Hospital near Suvarnabhumi Airport is a full-service private hospital serving east Bangkok and the airport corridor.",
    },
    "Bangkok Christian Nakhon Pathom Hospital": {
        "nameTh": "โรงพยาบาลกรุงเทพคริสเตียน นครปฐม",
        "group": "Independent", "type": "Private", "website": "https://www.bcnph.com",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "Faith-based private hospital in Nakhon Pathom offering compassionate care with maternity, paediatrics, and general medical services.",
    },
    "Bangkok Sanam Chan Hospital": {
        "nameTh": "โรงพยาบาลกรุงเทพสนามจันทร์",
        "group": "BDMS", "type": "Private", "website": "https://www.bangkokhospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology", "Orthopedics"],
        "summary": "Bangkok Sanam Chan is a BDMS-affiliated hospital in Nakhon Pathom offering private specialist medical care for the province.",
    },
    "Nakhonpat Inter Hospital": {
        "nameTh": "โรงพยาบาลนครปฐมอินเตอร์",
        "group": "Independent", "type": "Private", "website": "https://www.nakhonpatinter.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Nakhonpat Inter Hospital in Nakhon Pathom provides private medical services with specialist care and direct insurance billing.",
    },
    "San Paulo Hospital": {
        "nameTh": "โรงพยาบาลซานเปาโล",
        "group": "Independent", "type": "Private", "website": "https://www.sanpaulohospital.com",
        "specialties": ["Emergency", "Maternity", "Pediatrics", "Cardiology"],
        "summary": "San Paulo is a Catholic-affiliated private hospital in Bangkok known for compassionate care, maternity services, and direct insurance billing.",
    },
    "Saint Mary's Hospital": {
        "nameTh": "โรงพยาบาลเซนต์แมรี่",
        "group": "Independent", "type": "Private", "website": "https://www.saintmarythailand.com",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "Saint Mary's Hospital provides private medical care with maternity and general specialist services and direct insurance billing.",
    },
    "Ratchaburi Hospital": {
        "nameTh": "โรงพยาบาลราชบุรี",
        "group": "Independent", "type": "Private", "website": "https://www.ratchaburihospital.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Private hospital in Ratchaburi offering comprehensive medical services for the province with specialist departments and direct billing.",
    },
    "Aikchol Hospital": {
        "nameTh": "โรงพยาบาลไผทโอสถ",
        "group": "Independent", "type": "Private", "website": "https://www.aikchol.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Aikchol Hospital in Chonburi provides comprehensive private medical care for the Chonburi-Sriracha area with specialist services.",
    },
    "Hospital AIKCHOL Angsila": {
        "nameTh": "โรงพยาบาลไผทโอสถ อ่างศิลา",
        "group": "Independent", "type": "Private", "website": "https://www.aikchol.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Aikchol Angsila serves the Angsila seafront area of Chonburi with private medical and general specialist services.",
    },
    "Intrarat Hospital": {
        "nameTh": "โรงพยาบาลอินทรารัตน์",
        "group": "Independent", "type": "Private", "website": "https://www.intrarat.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Intrarat Hospital provides private medical care with general and specialist services and Allianz direct billing.",
    },
    "Inter Kamphaeng Saen Hospital": {
        "nameTh": "โรงพยาบาลอินเตอร์ กำแพงแสน",
        "group": "Independent", "type": "Private", "website": "https://www.interkamphaengsaen.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Inter Kamphaeng Saen Hospital serves the Kamphaeng Saen district in Nakhon Pathom with private medical and specialist care.",
    },
    "Ekkachon Mueang Kamphaeng Phet Hospital": {
        "nameTh": "โรงพยาบาลเอกชนเมืองกำแพงเพชร",
        "group": "Independent", "type": "Private", "website": "https://www.ekkacomphet.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Private hospital in Kamphaeng Phet offering medical services for the province with specialist care and direct insurance billing.",
    },
    "Mueang Narai Hospital": {
        "nameTh": "โรงพยาบาลเมืองนารายณ์",
        "group": "Independent", "type": "Private", "website": "https://www.mueangnarai.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mueang Narai Hospital in Lop Buri provides private medical services for the province with general and specialist care.",
    },
    "Pitsanuvej Hospital": {
        "nameTh": "โรงพยาบาลพิษณุเวช",
        "group": "Independent", "type": "Private", "website": "https://www.pitsanuvej.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Pitsanuvej Hospital in Phitsanulok is a full-service private hospital offering comprehensive specialist care for the north-central region.",
    },
    "Phitsanuwet Phichit Hospital": {
        "nameTh": "โรงพยาบาลพิษณุเวชพิจิตร",
        "group": "Independent", "type": "Private", "website": "https://www.phitsanuwetphichit.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Phitsanuwet Phichit Hospital serves Phichit province with private medical services including emergency and specialist care.",
    },
    "Ruam Phaet Chai Nat Hospital": {
        "nameTh": "โรงพยาบาลรวมแพทย์ชัยนาท",
        "group": "Independent", "type": "Private", "website": "https://www.ruamphaetchainat.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Ruam Phaet Chai Nat provides private medical services for Chai Nat province with general and specialist care.",
    },
    "Paholpolpayuhasena Hospital": {
        "nameTh": "โรงพยาบาลพหลพลพยุหเสนา",
        "group": "Independent", "type": "Government", "website": "https://www.paholpolpayuhasena.go.th",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Paholpolpayuhasena is a major government hospital in Kanchanaburi offering comprehensive medical services including specialist care.",
    },
    "Pathumvech Hospital": {
        "nameTh": "โรงพยาบาลปทุมเวช",
        "group": "Independent", "type": "Private", "website": "https://www.pathumvech.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Pathumvech Hospital in Pathum Thani serves the northern Bangkok suburbs with private medical services and specialist consultations.",
    },
    "Pat Rangsit Mother & Child Hospital": {
        "nameTh": "โรงพยาบาลแม่และเด็กแพทย์รังสิต",
        "group": "Independent", "type": "Private", "website": "https://www.patrangsit.com",
        "specialties": ["Maternity", "Pediatrics", "Fertility"],
        "summary": "Pat Rangsit Mother & Child Hospital specialises in maternity, newborn care, and paediatrics for families in the Rangsit corridor.",
    },
    "patRangsit Hospital": {
        "nameTh": "โรงพยาบาลแพทย์รังสิต",
        "group": "Independent", "type": "Private", "website": "https://www.patrangsithospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Pat Rangsit Hospital provides private medical services in the Rangsit corridor of Pathum Thani with specialist care and direct billing.",
    },
    "Mahachai Hospital": {
        "nameTh": "โรงพยาบาลมหาชัย",
        "group": "Independent", "type": "Private", "website": "https://www.mahachaihospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mahachai Hospital in Samut Sakhon's seafood-industry hub provides private medical care for the province.",
    },
    "Mahachai 2 Hospital": {
        "nameTh": "โรงพยาบาลมหาชัย 2",
        "group": "Independent", "type": "Private", "website": "https://www.mahachai2hospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mahachai 2 Hospital is the second branch of Mahachai Group in Samut Sakhon providing private general and specialist medical services.",
    },
    "Mahachai Petcharat Hospital": {
        "nameTh": "โรงพยาบาลมหาชัยเพชรรัตน์",
        "group": "Independent", "type": "Private", "website": "https://www.mahachaipetcharat.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mahachai Petcharat Hospital provides private medical services for Samut Sakhon with specialist care and insurance billing.",
    },
    "Sri Sawan Hospital": {
        "nameTh": "โรงพยาบาลศรีสวรรค์",
        "group": "Independent", "type": "Private", "website": "https://www.srisawan.com",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "Sri Sawan Hospital provides private medical services for its community with specialist care and direct insurance billing.",
    },
    "Krung Siam St. Carlos Hospital": {
        "nameTh": "โรงพยาบาลกรุงสยาม เซนต์คาร์ลอส",
        "group": "Independent", "type": "Private", "website": "https://www.krunsiamstcarlos.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Krung Siam St. Carlos is a Catholic-heritage private hospital in Bangkok offering compassionate care with general and specialist services.",
    },
    "Mueang Samut Pu Chao Hospital": {
        "nameTh": "โรงพยาบาลเมืองสมุทรปู่เจ้า",
        "group": "Independent", "type": "Private", "website": "https://www.samutpuchao.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Private hospital in Samut Prakan serving the Phra Pradaeng area with general and specialist medical services.",
    },
    "Chaloem Phrakiat Princess Maha Chakri Sirindhorn Hospital": {
        "nameTh": "โรงพยาบาลเฉลิมพระเกียรติสมเด็จพระเทพรัตนราชสุดา",
        "group": "Independent", "type": "Government", "website": "https://www.cmpsh.go.th",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Government hospital honouring HRH Princess Sirindhorn, providing public healthcare services for its province.",
    },
    "Virajsilp hospital": {
        "nameTh": "โรงพยาบาลวิราษฎร์",
        "group": "Independent", "type": "Private", "website": "https://www.virajsilp.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Virajsilp Hospital provides private medical and specialist care services with direct insurance billing.",
    },
    "Rak Sakon Nakhon Hospital": {
        "nameTh": "โรงพยาบาลรักษ์สกลนคร",
        "group": "Independent", "type": "Private", "website": "https://www.raksakon.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Rak Sakon Nakhon Hospital provides private medical services for Sakon Nakhon province with specialist care and insurance billing.",
    },
    "Sakon Nakhon Hospital": {
        "nameTh": "โรงพยาบาลสกลนคร",
        "group": "Independent", "type": "Private", "website": "https://www.sakonhospital.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Private hospital in Sakon Nakhon offering medical care for the province with general and specialist services.",
    },
    "Sukumvit Hospital": {
        "nameTh": "โรงพยาบาลสุขุมวิท",
        "group": "Independent", "type": "Private", "website": "https://www.sukumvithospital.com",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Orthopedics"],
        "summary": "Sukumvit Hospital on Sukhumvit Road serves Bangkok's expat-heavy eastern corridor with comprehensive private specialist care and English staff.",
    },
    "Suddhavej Hospital": {
        "nameTh": "โรงพยาบาลสุทธาเวช",
        "group": "Independent", "type": "Private", "website": "https://www.suddhavej.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Suddhavej Hospital offers private medical services in Maha Sarakham province with specialist care and direct billing.",
    },
    "Phetcharat Hospital": {
        "nameTh": "โรงพยาบาลเพชรรัตน์",
        "group": "Independent", "type": "Private", "website": "https://www.phetcharat.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Phetcharat Hospital provides private medical care with general and specialist departments and Allianz direct billing.",
    },
    "Mitrpracha Hospital": {
        "nameTh": "โรงพยาบาลมิตรประชา",
        "group": "Independent", "type": "Private", "website": "https://www.mitrpracha.com",
        "specialties": ["Emergency", "Maternity", "Cardiology"],
        "summary": "Mitrpracha Hospital provides private medical care with general and specialist services and direct insurance billing.",
    },
    "Phrae Christian Hospital": {
        "nameTh": "โรงพยาบาลคริสเตียนแพร่",
        "group": "Independent", "type": "Private", "website": "https://www.phraechristianhospital.org",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "Phrae Christian Hospital is a long-established faith-based hospital in Phrae province offering quality private medical and surgical care.",
    },
    "Samitivej Rayong Hospital": {
        "nameTh": "โรงพยาบาลสมิติเวช ระยอง",
        "group": "BDMS", "type": "Private", "website": "https://www.samitivejhospitals.com/rayong",
        "specialties": ["Emergency", "Cardiology", "Maternity", "Pediatrics"],
        "summary": "Samitivej Rayong provides full-service private medical care for the Eastern Economic Corridor community and expat residents.",
    },
    "Paolo Rangsit Hospital": {
        "nameTh": "โรงพยาบาลเปาโล รังสิต",
        "group": "BDMS", "type": "Private", "website": "https://www.paolohosp.co.th/rangsit",
        "specialties": ["Emergency", "Maternity", "Pediatrics", "Cardiology"],
        "summary": "Paolo Rangsit is a BDMS hospital in Pathum Thani serving the Rangsit corridor with maternity, paediatric, and full specialist services.",
    },
    "Paolo Hospital Phra Pradaeng": {
        "nameTh": "โรงพยาบาลเปาโล พระประแดง",
        "group": "BDMS", "type": "Private", "website": "https://www.paolohosp.co.th",
        "specialties": ["Emergency", "Maternity", "Pediatrics"],
        "summary": "Paolo Phra Pradaeng serves the Samut Prakan peninsula community with BDMS quality medical care and maternity services.",
    },
    "Paolo Hospital Samut Prakan": {
        "nameTh": "โรงพยาบาลเปาโล สมุทรปราการ",
        "group": "BDMS", "type": "Private", "website": "https://www.paolohosp.co.th",
        "specialties": ["Emergency", "Maternity", "Pediatrics", "Cardiology"],
        "summary": "Paolo Samut Prakan serves the eastern Bangkok province with BDMS quality specialist medical and maternity care.",
    },
    "Bangkok Hospital Pakchong": {
        "nameTh": "โรงพยาบาลกรุงเทพ ปากช่อง",
        "group": "BDMS", "type": "Private", "website": "https://www.bangkokhospital.com",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "BDMS Bangkok Hospital in Pak Chong serving Nakhon Ratchasima's gateway town and Khao Yai visitors with private specialist care.",
    },
    "Bangkok Hospital Phetchaburi": {
        "nameTh": "โรงพยาบาลกรุงเทพ เพชรบุรี",
        "group": "BDMS", "type": "Private", "website": "https://www.bangkokhospital.com/phetchaburi",
        "specialties": ["Emergency", "Cardiology", "Maternity"],
        "summary": "BDMS Bangkok Hospital serving Phetchaburi province and Cha-am beach visitors with private specialist medical care.",
    },
    "Bangkok Hospital Phitsanulok": {
        "nameTh": "โรงพยาบาลกรุงเทพ พิษณุโลก",
        "group": "BDMS", "type": "Private", "website": "https://www.bangkokhospital.com/phitsanulok",
        "specialties": ["Emergency", "Cardiology", "Orthopedics", "Maternity"],
        "summary": "BDMS Bangkok Hospital in Phitsanulok serving the upper north-central region with full specialist medical care and direct billing.",
    },
    "Phayao Ram Hospital": {
        "nameTh": "โรงพยาบาลพะเยาราม",
        "group": "Independent", "type": "Private", "website": "https://www.ramhospital.com",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Phayao Ram Hospital provides private medical care for Phayao province with general and specialist services.",
    },
    "Phrae-Ram Hospital": {
        "nameTh": "โรงพยาบาลแพร่-ราม",
        "group": "Independent", "type": "Private", "website": "https://www.ramhospital.com",
        "specialties": ["Emergency", "Maternity", "Orthopedics"],
        "summary": "Phrae Ram Hospital serves Phrae province with private medical care including emergency and specialist services.",
    },
}


# ── Read and parse hospitals-data.ts ──────────────────────────────────────
TS_PATH = '/Users/tonkla/claude/covercare-thailand/lib/hospitals-data.ts'
with open(TS_PATH) as f:
    content = f.read()

# ── Helper: find hospital blocks by phone ─────────────────────────────────
def update_hospital_block(content, phone, research):
    """Find a hospital by phone and update its fields."""
    # Find the phone field within a hospital object
    phone_pattern = re.compile(
        r'(    phone: "' + re.escape(phone) + r'",)',
        re.MULTILINE
    )
    match = phone_pattern.search(content)
    if not match:
        return content, False

    pos = match.start()

    # Now scan backward to find the start of this hospital object
    # The block starts with "  {" and has "id: " right after
    # Find the opening { that contains this phone
    # We'll go backward from pos to find "  {\n    id:"
    search_area = content[:pos]
    block_start = search_area.rfind('\n  {\n')
    if block_start == -1:
        return content, False
    block_start += 1  # skip the newline

    # Find the end of this block
    block_end_search = content[pos:]
    # End is marked by "  },"  or "  }" on its own line
    end_match = re.search(r'\n  \},?\n', block_end_search)
    if not end_match:
        return content, False
    block_end = pos + end_match.end()

    block = content[block_start:block_end]

    # Apply updates
    updates_made = []

    # 1. Fix name field if needed (for Thai-named hospitals)
    if 'name' in research:
        new_name = research['name']
        block = re.sub(
            r'    name: "([^"]*)",',
            f'    name: "{new_name}",',
            block, count=1
        )

    # 2. Fix nameTh
    if 'nameTh' in research:
        new_nameth = research['nameTh']
        block = re.sub(
            r'    nameTh: [^,\n]+,',
            f'    nameTh: "{new_nameth}",',
            block, count=1
        )

    # 3. Fix networkGroup
    if 'group' in research:
        block = re.sub(
            r'    networkGroup: [^,\n]+,',
            f'    networkGroup: "{research["group"]}",',
            block, count=1
        )

    # 4. Fix hospitalType
    if 'type' in research:
        block = re.sub(
            r'    hospitalType: [^,\n]+,',
            f'    hospitalType: "{research["type"]}",',
            block, count=1
        )

    # 5. Fix website
    if 'website' in research and research['website']:
        block = re.sub(
            r'    website: [^,\n]+,',
            f'    website: "{research["website"]}",',
            block, count=1
        )

    # 6. Fix specialties
    if 'specialties' in research:
        specs_json = json.dumps(research['specialties'], ensure_ascii=False)
        block = re.sub(
            r'    specialties: \[.*?\],',
            f'    specialties: {specs_json},',
            block, count=1, flags=re.DOTALL
        )

    # 7. Fix summary
    if 'summary' in research:
        # Escape any quotes in summary
        safe_summary = research['summary'].replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
        block = re.sub(
            r'    summary: ".*?",',
            f'    summary: "{safe_summary}",',
            block, count=1, flags=re.DOTALL
        )

    content = content[:block_start] + block + content[block_end:]
    return content, True


# ── Apply updates ─────────────────────────────────────────────────────────
updated = 0
skipped = 0

# First pass: phone-keyed updates
for phone, research in RESEARCH.items():
    content, ok = update_hospital_block(content, phone, research)
    if ok:
        updated += 1
    else:
        print(f"WARNING: Phone not found in TS: {phone} ({research.get('name', '?')})")
        skipped += 1

print(f"\nPhone-keyed updates: {updated} applied, {skipped} not found")

# Second pass: name-keyed updates for remaining hospitals
# Re-parse to find hospitals that still have empty research fields
name_pattern = re.compile(
    r'    name: "([^"]+)",\n    nameTh:.*?\n.*?    phone: "([^"]+)",',
    re.DOTALL
)
name_to_phone = {}
for m in name_pattern.finditer(content):
    name_to_phone[m.group(1)] = m.group(2)

name_updated = 0
for name, research in NAME_RESEARCH.items():
    phone = name_to_phone.get(name)
    if phone:
        content, ok = update_hospital_block(content, phone, research)
        if ok:
            name_updated += 1
    else:
        # Try to find it differently
        print(f"  Name not found: {name!r}")

print(f"Name-keyed updates: {name_updated} applied")

# ── Write output ───────────────────────────────────────────────────────────
with open(TS_PATH, 'w') as f:
    f.write(content)

print(f"\n✅ Updated {TS_PATH}")
print(f"Total updates: {updated + name_updated}")

# Quick sanity check
has_specialties = content.count('"Cardiology"') + content.count('"Emergency"')
print(f"Specialties references in file: {has_specialties}")
