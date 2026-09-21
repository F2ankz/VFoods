/* ─────────────────────────────────────────────────────────────
   คลังข่าวสารของ VFOODS — ไฟล์นี้คือ "สารบัญข่าว" ไฟล์เดียวของทั้งเว็บ

   โครงสร้างโฟลเดอร์
     news/current/<slug>/   = รูปของ 3 ข่าวปัจจุบัน (ที่โชว์หน้า news.html)
     news/archive/<slug>/   = รูปของข่าวเก่าทั้งหมด (โชว์ในหน้า news-archive.html)
     news/news-index.js     = ไฟล์นี้ (ข้อความ + ลำดับ + พาธรูปของทุกข่าว)

   ฟิลด์ของแต่ละข่าว
     slug   = ชื่อโฟลเดอร์ + ชื่อในลิงก์ (news-article.html?id=slug) ห้ามซ้ำ
     tag    = หมวดหมู่สั้นๆ เช่น "กิจกรรม" "รางวัล" "NPD"
     title  = หัวข้อข่าว
     date   = วันที่ (พิมพ์อิสระ เช่น "สิงหาคม 2026")
     text   = เนื้อหาย่อ 2–3 บรรทัด (ใช้บนการ์ด)
     cover  = รูปปก (พาธจากรากเว็บ)
     body   = เนื้อข่าวเต็ม — 1 ย่อหน้าต่อ 1 บรรทัดในอาร์เรย์
     images = รูปเพิ่มเติมในหน้าข่าว [{ src, caption }]
     link   = ลิงก์โพสต์ต้นฉบับบน Facebook (ถ้ามี)

   ★ ไม่ต้องแก้ไฟล์นี้ด้วยมือ ★
   ใช้โปรแกรมลงข่าวแทน — ดับเบิลคลิก VFoods-News.exe ที่โฟลเดอร์เว็บ
   แก้ข้อความ/ใส่รูป → กด "อัปโหลดขึ้นเว็บจริง" จบในปุ่มเดียว
   (ถ้าไม่มีโปรแกรม: เปิด admin/news-admin.html → "ส่งออกเป็น .zip" → ส่งให้คนดูแลเว็บ)
   ───────────────────────────────────────────────────────────── */
window.NEWS_INDEX = {
  /* 3 ข่าวปัจจุบัน — โชว์เป็นการ์ดใหญ่ข้างฟีด Facebook บนหน้า news.html */
  current: [
    {
      slug: "new-mascot-2026",
      tag: "New Mascot",
      title: "เปิดตัว New Mascot ของวาไรตี้ฟู้ดส์",
      date: "สิงหาคม 2026",
      text: "จากชิ้นขนมแสนอร่อย มาเป็นตัวการ์ตูนน่ารักสดใส พร้อมหมวกสีส้มโลโก้ V ที่พร้อมเดินทางลุยทุกกิจกรรม พาลูกค้าแสนน่ารักของเราไปหาขนมแสนอร่อยหลากหลาย สไตล์วาไรตี้ฟู้ดส์ในทุกๆ วัน",
      cover: "news/current/new-mascot-2026/cover.png",
      body: [
        "จากชิ้นขนมแสนอร่อย มาเป็นตัวการ์ตูนน่ารักสดใส พร้อมหมวกสีส้มโลโก้ V ที่พร้อมเดินทางลุยทุกกิจกรรม พาลูกค้าแสนน่ารักของเราไปหาขนมแสนอร่อยหลากหลาย สไตล์วาไรตี้ฟู้ดส์ในทุกๆ วัน"
      ],
      images: [
        { src: "news/current/new-mascot-2026/01.jpg", caption: "" }
      ]
    },
    {
      slug: "thaifex-2026",
      tag: "กิจกรรม",
      title: "VFOODS ในงาน THAIFEX 2026",
      date: "พฤษภาคม 2026",
      text: "พาชมความอลังการของบูธ VFOODS ในงาน THAIFEX 2026 เปิดตัวสินค้าใหม่ พร้อมสินค้าหลากหลายจัดแสดงโชว์ เพื่อรอต้อนรับลูกค้าทั้งในและต่างประเทศที่สนใจเข้ามาสั่งผลิต OEM สินค้า",
      cover: "news/current/thaifex-2026/cover.jpg",
      body: [
        "พาชมความอลังการของบูธ VFOODS ในงาน THAIFEX 2026 เปิดตัวสินค้าใหม่ พร้อมสินค้าหลากหลายจัดแสดงโชว์ เพื่อรอต้อนรับลูกค้าทั้งในและต่างประเทศที่สนใจเข้ามาสั่งผลิต OEM สินค้า"
      ],
      images: [
        { src: "news/current/thaifex-2026/01.jpg", caption: "" },
        { src: "news/current/thaifex-2026/02.jpg", caption: "" },
        { src: "news/current/thaifex-2026/03.jpg", caption: "" },
        { src: "news/current/thaifex-2026/04.jpg", caption: "" },
        { src: "news/current/thaifex-2026/05.jpg", caption: "" },
        { src: "news/current/thaifex-2026/06.jpg", caption: "" },
        { src: "news/current/thaifex-2026/07.jpg", caption: "" },
        { src: "news/current/thaifex-2026/08.jpg", caption: "" },
        { src: "news/current/thaifex-2026/09.jpg", caption: "" },
        { src: "news/current/thaifex-2026/10.jpg", caption: "" },
        { src: "news/current/thaifex-2026/11.jpg", caption: "" }
      ],
      link: "https://www.facebook.com/share/p/1JDN2hptCu/"
    },
    {
      slug: "tiktok-shop-awards-2026",
      tag: "รางวัล",
      title: "VFOODS คว้ารางวัล TikTok Shop Awards 2026",
      date: "สิงหาคม 2026",
      text: "ทีม E-Commerce ของ VFOODS ไม่ธรรมดา คว้ารางวัลยอดขายสูงสุดในหมวด Food & Beverage บนช่องทาง TikTok",
      cover: "news/current/tiktok-shop-awards-2026/cover.jpg",
      body: [
        "ทีม E-Commerce ของ VFOODS ไม่ธรรมดา คว้ารางวัลยอดขายสูงสุดในหมวด Food & Beverage บนช่องทาง TikTok",
        "VFOODS ขอขอบคุณลูกค้าทุกท่านที่ไว้วางใจและสั่งซื้อสินค้าของเรา จนติดอันดับ 1 บนช่องทาง TikTok"
      ],
      images: [
        { src: "news/current/tiktok-shop-awards-2026/01.jpg", caption: "" },
        { src: "news/current/tiktok-shop-awards-2026/02.jpg", caption: "" }
      ]
    }
  ],

  /* ข่าวย้อนหลัง — โชว์ในหน้า news-archive.html และท้ายหน้าข่าวแต่ละข่าว */
  archive: []
};
