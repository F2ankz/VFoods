# VFOODS — COOKIEVERSE

เว็บไซต์ VFOODS สไตล์ dark-cinematic **COOKIEVERSE** — หน้าแรกเป็น scroll-driven hero
(scroll-scrub animation) พร้อมหน้าแบรนด์ สินค้า ข่าว OEM และติดต่อ

🔗 **เข้าเว็บ:** เปิด `index.html` (จะ redirect ไป `scroll-site/index.html`)

## โครงสร้าง

| ส่วน | ไฟล์ |
|------|------|
| หน้าแรก (scroll hero) | `scroll-site/` — `index.html`, `js/`, `css/`, `media/`, `img/` |
| แคตตาล็อกแบรนด์/สินค้า | `brands.html`, `products.html`, `brand-products.js` |
| ข่าว / OEM / ติดต่อ | `news.html`, `oem-guide.html`, `contact.html` |
| หน้าเปลี่ยนทาง | `index.html` |
| สไตล์ / สคริปต์รวม | `style.css`, `theme-white.css`, `main.js` |
| รูป / แผนที่ / ฟอนต์ | `img/`, `map/`, `fonts/` |

## รันในเครื่อง

เป็น static site ล้วน เปิดผ่าน local server ได้เลย:

```bash
python -m http.server 8000
# แล้วเปิด http://localhost:8000
```

## หมายเหตุ

ไฟล์ต้นฉบับขนาดใหญ่ (Google Drive dump, วิดีโอ/รูปต้นฉบับ, ไฟล์ backup, `.ai`, `.xlsx`)
ไม่ได้อยู่ใน repo — ดู `.gitignore` เก็บเฉพาะไฟล์ที่เว็บออนไลน์ต้องใช้จริง
