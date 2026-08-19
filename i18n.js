/* ══════════════════════════════════════════════════════════════
   VFoods — Site-wide Thai / English switch
   ──────────────────────────────────────────────────────────────
   How it works
     • The HTML stays as authored (mostly Thai, some English).
       Nothing needs data-* attributes to be translated.
     • On switch, every text node and every user-visible attribute
       is looked up in the dictionary below and swapped.
     • The ORIGINAL text of each node is remembered, so switching
       back is lossless and repeated switching never compounds.
     • A MutationObserver catches anything a page script renders
       later (brand catalogue, search banner, speech bubbles…).

   Adding a string
     • Thai in the HTML  → add it to TH2EN.
     • English in the HTML → add it to EN2TH.
     • A string that is generated with a number or other value in
       the middle → add a rule to RULES_EN / RULES_TH.
     • A one-off that must differ from the shared dictionary →
       put data-i18n-en="…" / data-i18n-th="…" on the element.
     • Never translate this element or its children →
       data-i18n-skip.
   ══════════════════════════════════════════════════════════════ */
(function (w, d) {
  'use strict';

  /* ══════════ 1. Thai in the markup → English ══════════ */
  var TH2EN = {

    /* ── navigation, search, footer ── */
    'ค้นหาสินค้า…': 'Search products…',
    'ค้นหาสินค้า': 'Search products',
    'ค้นหาชื่อสินค้า…': 'Search product name…',
    'ค้นหา': 'Search',
    'เมนู': 'Menu',
    'VFOODS หน้าแรก': 'VFOODS Home',
    'VFOODS วีฟู้ดส์': 'VFOODS',
    'หน้าแรก': 'Home',
    'สินค้า': 'Products',
    'แบรนด์': 'Brands',
    'แบรนด์ของเรา': 'Our Brands',
    'ข่าวสาร': 'News',
    'บริการ': 'Services',
    'บริษัท': 'Company',
    'ติดต่อ': 'Contact',
    'ติดต่อเรา': 'Contact Us',
    'ติดต่อเรา →': 'Contact Us →',
    'ร่วมงานกับเรา': 'Careers',
    'เกี่ยวกับเรา': 'About Us',
    'ทั้งหมด': 'All',
    'แผนที่บริษัท': 'Company Map',
    'ช้อปออนไลน์:': 'Shop online:',
    'คู่มือ OEM': 'OEM Guide',
    'กลับหน้าหลัก': 'Back to Home',
    'ผู้ผลิตขนมปังปี๊บอันดับ 1 ในประเทศไทย': 'Thailand’s No.1 tin-packed biscuit manufacturer',
    'บริษัท วาไรตี้ ฟู้ดส์ อินเตอร์เนชั่นแนล จำกัด': 'Variety Foods International Co., Ltd.',
    'บริษัท วาไรตี้ ฟู้ดส์ อินเตอร์เนชั่นแนล จำกัด ผู้ผลิตบิสกิตและขนมขบเคี้ยวคุณภาพสูง อันดับ 1 ในประเทศไทย ส่งออกกว่า 30 ประเทศทั่วโลก':
      'Variety Foods International Co., Ltd. — Thailand’s No.1 manufacturer of premium biscuits and snacks, exporting to over 30 countries worldwide.',
    'บริษัท วาไรตี้ ฟู้ดส์ จำกัด ผู้ผลิตขนมปังปี๊บและบิสกิตคุณภาพสูง อันดับ 1 ในประเทศไทย':
      'Variety Foods Co., Ltd. — Thailand’s No.1 manufacturer of premium tin-packed biscuits and cookies.',

    /* ── home: hero, about, certifications ── */
    'VFOODS — อร่อยทุกคำ ทุกโอกาส | The Variety World of Snacks':
      'VFOODS — Delicious in Every Bite, for Every Occasion | The Variety World of Snacks',
    'ดูสินค้า': 'View Products',
    'เมนูด่วน': 'Quick menu',
    'บริษัทของเรา': 'Our Company',
    'บริษัท วาไรตี้ ฟู้ดส์ อินเตอร์เนชั่นแนล จำกัด เป็นผู้นำด้านการผลิตบิสกิต และขนมขบเคี้ยวของประเทศไทย ด้วยการคัดสรรส่วนประกอบคุณภาพ และเฟ้นหารสชาติที่ดีที่สุด ไปจนถึงกระบวนการผลิตที่ทันสมัย และปลอดภัย รวมไปถึงการได้รับความไว้วางใจจากลูกค้า โดยมีสินค้าส่งออกไปกว่า 30 ประเทศทั่วโลก':
      'Variety Foods International Co., Ltd. is a leader in biscuit and snack manufacturing in Thailand — from selecting quality ingredients and searching out the very best flavours, to a modern, safe production process and the trust our customers place in us, with products exported to more than 30 countries worldwide.',
    'Finish · เสร็จ!': 'Finish · Done!',
    'ผู้เชี่ยวชาญด้านการผลิตบิสกิต คุกกี้ แครกเกอร์ เวเฟอร์ และขนมขบเคี้ยว เราใส่ใจในทุกขั้นตอนการผลิต และพิถีพิถันในการเลือกสรรวัตถุดิบ':
      'Specialists in biscuits, cookies, crackers, wafers and snacks. We care about every step of production and are meticulous about the ingredients we choose.',
    'เจตนารมณ์': 'Our Intention',
    'นับตั้งแต่ปี 2547 จนถึงปัจจุบัน เกิดการเปลี่ยนแปลงต่างๆ อย่างมากมาย แต่เพียงหนึ่งเดียวที่ไม่เคยเปลี่ยนแปลงคือ ความยึดมั่นในคุณภาพ ที่ส่งต่อเจตนารมณ์จากรุ่นสู่รุ่น':
      'Much has changed since 2004, but one thing never has: our commitment to quality, an intention handed down from one generation to the next.',
    'จากความชอบ สู่การเป็นผู้ผลิต': 'From a Passion to a Manufacturer',
    'มั่นใจได้ว่า สินค้าของเราจะถูกส่งต่อถึงทุกคนจากความใส่ใจในทุกขั้นตอน ตั้งแต่การเลือกวัตถุดิบ ไปจนถึงความประทับใจของลูกค้าทุกท่านที่เราให้ความสำคัญเสมอมา':
      'You can be confident that every product reaches you through care at every step, from choosing the ingredients to the impression left on each customer, which has always mattered to us.',
    'การรับรองคุณภาพ': 'Quality Certifications',
    'เรายึดมั่นในการผลิตสินค้าที่ได้คุณภาพ ตั้งแต่การคัดเลือกส่วนประกอบไปจนถึงกระบวนการผลิต ทำให้เราได้รับการรับรองมาตรฐานสากลจากหลายหน่วยงาน':
      'We are committed to quality from ingredient selection through to production, which has earned us international certification from a number of bodies.',
    'ระบบความปลอดภัยอาหาร': 'Food Safety System',
    'วิเคราะห์จุดวิกฤตที่ต้องควบคุม': 'Hazard Analysis Critical Control Point',
    'หลักเกณฑ์วิธีการผลิตที่ดี': 'Good Manufacturing Practice',
    'ฮาลาล': 'Halal',
    'มาตรฐานอาหารฮาลาล': 'Halal Food Standard',
    'ตราสัญลักษณ์คุณภาพไทย': 'Thailand Trust Mark',
    'ปีประสบการณ์': 'Years of Experience',
    'ประเทศส่งออก': 'Export Countries',
    'แบรนด์ในเครือ': 'Brands in the Group',
    'ผลิตภัณฑ์': 'Products',
    'ต้องการสินค้าที่เหมาะกับกลุ่มลูกค้า และตลาดของคุณอยู่หรือเปล่า?':
      'Looking for products that suit your customers and your market?',
    'ติดต่อเราได้เลย!': 'Get in touch with us!',

    /* ── home: product preview ── */
    'สินค้าของเรา': 'Our Products',
    'บิสกิต คุกกี้ เวเฟอร์ และขนมขบเคี้ยว กว่า 9 หมวดหมู่ — คัดสรรรสชาติที่ดีที่สุดในทุกคำ':
      'Biscuits, cookies, wafers and snacks across more than 9 categories — the best flavour in every bite.',
    'ดูสินค้าทั้งหมด →': 'View All Products →',
    'ตัวคุกกี้ VFoods': 'The VFoods cookie character',

    /* ── home: OEM journey ── */
    'เดินไปกับคุกกี้น้อย สู่แบรนด์ของคุณ': 'Walk with Little Cookie to Your Own Brand',
    'เลื่อนลงเพื่อออกเดินทาง — คุกกี้น้อยจะพาคุณผ่าน 3 ขั้นตอน จากตัวคุกกี้ สู่รสชาติ และบรรจุภัณฑ์ จนได้สินค้าแบรนด์ของคุณเอง':
      'Scroll down to set off — Little Cookie takes you through 3 steps, from the cookie itself to the flavour and the packaging, until you have a product under your own brand.',
    'ผลิตแบรนด์ของคุณ': 'Make Your Own Brand',
    'สูตรเฉพาะแบรนด์': 'Brand-exclusive recipe',
    'พร้อมส่งทั่วไทย': 'Delivered nationwide',
    'เลือก': 'Choose',
    'ตัวคุกกี้': 'the cookie',
    'ที่ใช่': 'that fits',
    'หัวใจของสินค้า — เลือกรูปร่าง เนื้อสัมผัส และขนาดชิ้น ทีม R&D พัฒนาสูตรเฉพาะให้แบรนด์คุณ':
      'The heart of the product — pick the shape, the texture and the piece size. Our R&D team develops a recipe exclusively for your brand.',
    'รูปร่าง': 'Shape',
    'ขนาดชิ้น': 'Piece size',
    'พัฒนาสูตร': 'Recipe R&D',
    'อร่อย!': 'Delicious!',
    'เติม': 'Add',
    'รสชาติ': 'flavour',
    'จากของแท้': 'from the real thing',
    'สตรอเบอรี่ มะม่วง มะพร้าว ช็อกโกแลต หรือรสพิเศษเฉพาะแบรนด์ — คัดวัตถุดิบจริง ปรุงรสคงที่ทุกล็อต':
      'Strawberry, mango, coconut, chocolate — or a flavour made only for your brand. Real ingredients, consistent taste in every batch.',
    'รสคลาสสิก': 'Classic flavours',
    'รสผลไม้': 'Fruit flavours',
    'รสพิเศษ': 'Custom flavour',
    '7 รส+': '7+ flavours',
    'แพ็กเป็น': 'Pack it as',
    'แบรนด์คุณ': 'your brand',
    'กล่องพรีเมียม · กระป๋อง / ปี๊บ · พัสดุ · ซองซิปล็อก ออกแบบลายเอง พิมพ์สีจริง เด่นบนชั้นวาง':
      'Premium boxes · cans / tins · cartons · zip-lock pouches. Design your own artwork, printed in full colour, standing out on the shelf.',
    'กล่อง': 'Box',
    'ปี๊บ': 'Tin',
    'พัสดุ': 'Carton',
    'ซอง': 'Pouch',
    'คัสตอม': 'Custom',
    'พร้อม': 'Ready',
    'วางขาย!': 'to sell!',
    'ผลิตมาตรฐาน GMP & HACCP รสคงที่ทุกล็อต': 'Made to GMP & HACCP standards, consistent taste in every batch',
    'บรรจุลงแพ็กเกจแบรนด์คุณ พร้อมติดฉลาก': 'Packed in your own branded packaging, labelled and ready',
    'ส่งทั่วไทย เอกสารครบ ดูแลต่อเนื่อง': 'Shipped nationwide, full documentation, ongoing support',
    'ดูคู่มือ OEM →': 'View the OEM Guide →',
    'ติดต่อทีมงาน': 'Contact the Team',
    'สวัสดีครับ! ผม': 'Hi there! I’m',
    'คุกกี้น้อย': 'Little Cookie',
    '— เลื่อนลงมาเดินไปพร้อมกันเลย!': '— scroll down and walk along with me!',
    'เลื่อนลง': 'Scroll down',

    /* ── news (home teaser + news page) ── */
    'ข่าวสารและกิจกรรม': 'News & Activities',
    'ข่าวสารและกิจกรรม — VFoods': 'News & Activities — VFoods',
    'อัปเดตข่าวสารล่าสุด ผลิตภัณฑ์ใหม่ และกิจกรรมจากวาไรตี้ ฟู้ดส์':
      'The latest news, new products and activities from Variety Foods',
    'อัปเดตล่าสุดจากวาไรตี้ ฟู้ดส์ สินค้าใหม่ กิจกรรม และข่าวดีๆ':
      'The latest from Variety Foods — new products, events and good news',
    'เปิดตัวสินค้าใหม่! คุกกี้หยอดไส้ รสชาติพรีเมียม': 'New launch! Drop cookies with a premium filling',
    'VFoods เปิดตัวสินค้าหมวดหมู่ใหม่ "Drop Cookies" สูตรพิเศษ รสชาติเข้มข้น':
      'VFoods launches a brand new category, "Drop Cookies" — a special recipe with a rich, intense flavour',
    'VFoods ออกบูธ THAIFEX 2026 อย่างยิ่งใหญ่': 'VFoods exhibits in style at THAIFEX 2026',
    'VFoods ออกบูธ THAIFEX 2026': 'VFoods at THAIFEX 2026',
    'พบกับสินค้าล่าสุดและโปรโมชั่นพิเศษ ณ งาน THAIFEX - Anuga Asia 2026':
      'Meet our newest products and special promotions at THAIFEX – Anuga Asia 2026',
    'รับรางวัล "แบรนด์ที่น่าเชื่อถือที่สุด" ประจำปี 2025': 'Winner of the "Most Trusted Brand" award for 2025',
    'VFoods คว้ารางวัล Most Trusted Brand จากการโหวตของผู้บริโภคทั่วประเทศ':
      'VFoods takes the Most Trusted Brand award, voted for by consumers nationwide',
    'ดูข่าวสารทั้งหมด →': 'View All News →',
    'กิจกรรม': 'Events',
    'รางวัล': 'Awards',
    'ประกาศ': 'Announcements',
    'ส่งออก': 'Export',
    'เปิดตัว! "Drop Cookies" สายพรีเมียมรุ่นใหม่จาก VFoods':
      'Launched! "Drop Cookies", the new premium line from VFoods',
    'VFoods เปิดตัวสินค้าหมวดหมู่ใหม่ล่าสุด "คุกกี้หยอดไส้" ที่ผสมผสานความกรุบกรอบของคุกกี้กับไส้ครีมสูตรพิเศษ มีให้เลือกถึง 3 รสชาติ ช็อคโกแลตชิพ บลูเบอร์รี่ และคาราเมล':
      'VFoods launches its newest category, "drop cookies", combining a crunchy cookie with a special cream filling. Available in 3 flavours: chocolate chip, blueberry and caramel.',
    'โครงการ "ขนมเพื่อน้อง" ส่งมอบขนมให้เด็กด้อยโอกาส':
      'The "Snacks for Kids" project delivers treats to underprivileged children',
    'VFoods ขยายโรงงานผลิตรองรับดีมานด์ที่เพิ่มขึ้น': 'VFoods expands its factory to meet rising demand',
    'เพิ่มกำลังผลิต 40% ด้วยเทคโนโลยีการผลิตที่ทันสมัยที่สุด':
      'Production capacity up 40% with the most modern manufacturing technology',
    'เวเฟอร์รสใหม่! มัทฉะ จากญี่ปุ่น': 'A new wafer flavour! Matcha from Japan',
    'เปิดตัวรสชาติใหม่ล่าสุด เวเฟอร์สติ๊กรสมัทฉะ สูตรพรีเมียม':
      'Introducing our newest flavour — premium matcha rolled wafer sticks',
    'โครงการทุนการศึกษาพนักงาน VFoods': 'The VFoods employee scholarship programme',
    'มอบทุนการศึกษาแก่บุตรพนักงาน 100 ทุน ประจำปี 2025':
      '100 scholarships awarded to employees’ children in 2025',
    'เปิดตัวช้อปออนไลน์บน Shopee และ Lazada': 'Official online stores now open on Shopee and Lazada',
    'ช้อปสินค้า VFoods ได้ง่ายขึ้นผ่านแพลตฟอร์มออนไลน์ชั้นนำ':
      'Shopping for VFoods products is easier than ever on the leading online platforms',
    'Fried Snacks หมวดหมู่ใหม่ที่รอคอย': 'Fried Snacks — the new category worth the wait',
    'VFoods บุกตลาดขนมทอด ด้วยสูตรกรอบนานพิเศษ':
      'VFoods enters the fried-snack market with an extra-long-lasting crunch',
    'VFoods ขยายตลาดสู่ ASEAN 5 ประเทศ': 'VFoods expands into 5 ASEAN markets',
    'ส่งออกสินค้าไปยังเวียดนาม มาเลเซีย อินโดนีเซีย ฟิลิปปินส์ และเมียนมา':
      'Now exporting to Vietnam, Malaysia, Indonesia, the Philippines and Myanmar',
    'ติดตามเราได้ที่': 'Find Us Here',
    'ข่าวสาร โปรโมชั่น และกิจกรรมก่อนใคร ติดตามเราทุกช่องทาง':
      'News, promotions and events before anyone else — follow us on every channel',
    'ข่าวสาร โปรโมชั่น และกิจกรรมล่าสุด อัปเดตทุกวัน':
      'The latest news, promotions and activities, updated daily',
    'เยี่ยมชม Facebook →': 'Visit Facebook →',
    'มกราคม 2026': 'January 2026',
    'กุมภาพันธ์ 2026': 'February 2026',
    'มีนาคม 2026': 'March 2026',
    'เมษายน 2026': 'April 2026',
    'พฤษภาคม 2025': 'May 2025',
    'มิถุนายน 2025': 'June 2025',
    'กรกฎาคม 2025': 'July 2025',
    'สิงหาคม 2025': 'August 2025',
    'กันยายน 2025': 'September 2025',
    'ตุลาคม 2025': 'October 2025',
    'พฤศจิกายน 2025': 'November 2025',
    'ธันวาคม 2025': 'December 2025',

    /* ── product categories (nav mega-menu, tunnel, headings) ── */
    'ขนมขาไก่': 'Biscuit Sticks',
    'บิสกิตและแครกเกอร์': 'Biscuits & Crackers',
    'บิสกิตสอดไส้': 'Cream Filled Biscuits',
    'แยมสับปะรด': 'Pineapple Jam',
    'เวเฟอร์สติ๊ก': 'Rolled Wafer Sticks',
    'คุ้กกี้สอดไส้ครีม': 'Sandwich Cookies',
    'ขนมทานเล่น': 'Snacks',
    'เวเฟอร์แผ่น': 'Wafer Sheets',
    'ตัวทอด': 'Fried Snacks',
    'บิสกิตสอดไส้แยมสับปะรด': 'Pineapple Jam Biscuits',

    /* ── products page ── */
    'สินค้าของเรา — VFoods': 'Our Products — VFoods',
    '9 หมวดหมู่ หลากหลายรสชาติ เพื่อทุกรสนิยม': '9 categories, countless flavours — one for every taste',
    'อุโมงค์แห่งรสชาติ': 'The Flavour Tunnel',
    'เลื่อนลงเพื่อบินทะลุ 9 หมวดหมู่สินค้า — ทุกประตูคือรสชาติใหม่ที่รอให้ค้นพบ':
      'Scroll to fly through all 9 product categories — every gate is a new flavour waiting to be found',
    'เลื่อนต่อเพื่อเดินทางผ่านรสชาติ ↓': 'Keep scrolling to travel through the flavours ↓',
    'ขนมขาไก่กรุบกรอบ หลากหลายรสชาติ ใส่ซองสะดวก':
      'Crunchy biscuit sticks in a range of flavours, in convenient packs',
    'บิสกิตและแครกเกอร์กรอบ อร่อยทุกคำ (แบบไม่มีไส้)':
      'Crisp biscuits and crackers, delicious in every bite (unfilled)',
    'บิสกิตสอดไส้ครีมและหมีสอดไส้ รสชาติเข้มข้นทุกคำ':
      'Cream-filled biscuits and filled bears — rich flavour in every bite',
    'รสแยมสับปะรดหวานอมเปรี้ยว ความอร่อยดั้งเดิม': 'Sweet-and-tangy pineapple jam — the original taste',
    'เวเฟอร์ม้วนกรอบ สอดไส้ครีม หลายรสชาติ': 'Crisp rolled wafers with a cream filling, in many flavours',
    'คุกกี้สองชั้น สอดไส้ครีมสูตรพิเศษ หลากหลายรสชาติ':
      'Two-layer cookies with a special cream filling, in a range of flavours',
    'ขนมทานเล่นหลากหลาย อร่อยได้ทุกที่ทุกเวลา': 'A wide range of snacks to enjoy anywhere, anytime',
    'เวเฟอร์แผ่นบางกรอบ สอดไส้ครีม รสชาติหลากหลาย':
      'Thin, crisp wafer sheets with a cream filling, in many flavours',
    'ข้าวเกรียบทอดกรอบ รสเข้มข้น หลากหลายรสชาติ':
      'Crispy fried crackers with a bold taste, in many flavours',
    'สนใจสั่งผลิต OEM?': 'Interested in OEM production?',
    'ผลิตสินค้าภายใต้แบรนด์ของคุณได้เลย เพียง 4 ขั้นตอนง่ายๆ':
      'Produce under your own brand in just 4 easy steps',
    'ใหม่ล่าสุด': 'Newest',
    'VFoods · ใหม่ล่าสุด': 'VFoods · Newest',

    /* ── product names ── */
    'ขนมขาไก่ 5 รสชาติ': 'Tasty Sticks, 5 Flavours',
    'ขาไก่ 5 รส': 'Tasty Sticks, 5 Flavours',
    'ขาไก่แท่งเค็ม': 'Salted Tasty Sticks',
    'คิงคอง': 'King Kong',
    'น่องทอง': 'Golden Drumstick',
    'บุษราคัม': 'Butsarakham',
    'ปูจ๋า': 'Poo Ja Crab',
    'ปูเผ็ด': 'Spicy Crab',
    'ขนมขาไก่ (แบบกอง)': 'Tasty Sticks (Bulk)',
    'ขาไก่กอง': 'Bulk Tasty Sticks',
    'บิสกิตบางรสดั้งเดิม': 'Thin Biscuits, Original',
    'แครกเกอร์บางรสดั้งเดิม': 'Thin Crackers, Original',
    'อิงลิชแครกเกอร์': 'English Crackers',
    'อิงลิชแครกเกอร์สาหร่าย': 'English Crackers, Seaweed',
    'บิสกิตงาทอง': 'Golden Sesame Biscuits',
    'มินิครีมแครกเกอร์': 'Mini Cream Crackers',
    'บิสกิต ABC': 'ABC Biscuits',
    'บิสกิตฉลาม': 'Shark Biscuits',
    'หมีสอดไส้ดับเบิลช็อก': 'Double Choco Filled Bear',
    'หมีช็อก': 'Choco Bear',
    'หมีน้อยช็อกโกแลต': 'Little Choco Bear',
    'บิสกิตดอกไม้หน้าครีมช็อกโกแลต': 'Flower Biscuits, Chocolate Cream',
    'บิสกิตดอกไม้หน้าครีมสตรอเบอร์รี่': 'Flower Biscuits, Strawberry Cream',
    'ไวโอลินสอดไส้ช็อกโกแลต': 'Violin Biscuits, Chocolate Filling',
    'ไวโอลินสอดไส้ทุเรียน': 'Violin Biscuits, Durian Filling',
    'เทดดี้คุกกี้': 'Teddy Cookies',
    'บิสกิตลายท้องทะเล': 'Under-the-Sea Biscuits',
    'โดนัทสับปะรด': 'Pineapple Donut',
    'ทาร์ตหนอนสับปะรด': 'Pineapple Worm Tart',
    'จักรทองสับปะรด': 'Golden Wheel Pineapple',
    'มะลิสับปะรด': 'Jasmine Pineapple',
    'ยิ้มแฉ่งสับปะรด': 'Smiley Pineapple',
    'ชีสสอดไส้สับปะรด': 'Cheese with Pineapple Filling',
    'เกี๊ยวโก๊ะไส้สับปะรด': 'Kiew Koh Pineapple',
    'อิงลิชสับปะรด': 'English Pineapple',
    'ชีสจิ๋วสับปะรด': 'Mini Pineapple Cheese',
    'กะทิสับปะรด': 'Coconut Pineapple',
    'เวเฟอร์สติ๊กช็อกโกแลต': 'Chocolate Wafer Stick',
    'เวเฟอร์สติ๊กทุเรียน': 'Durian Wafer Stick',
    'เวเฟอร์สติ๊กมะม่วง': 'Mango Wafer Stick',
    'เวเฟอร์สติ๊กลิ้นจี่': 'Lychee Wafer Stick',
    'เวเฟอร์สติ๊กชาไทย': 'Thai Tea Wafer Stick',
    'เวเฟอร์สติ๊กลาเต้': 'Latte Wafer Stick',
    'เวเฟอร์สติ๊กเรนโบว์สตรอเบอร์รี่': 'Rainbow Strawberry Wafer Stick',
    'เวเฟอร์สติ๊กซีบราช็อกโกแลต': 'Zebra Chocolate Wafer Stick',
    'คุกกี้เดซี่ช็อกโกแลต': 'Daisy Cookies, Chocolate',
    'คุกกี้เดซี่นม': 'Daisy Cookies, Milk',
    'คุกกี้เดซี่ใบเตย': 'Daisy Cookies, Pandan',
    'คุกกี้ชาไทย': 'Thai Tea Cookies',
    'คุกกี้เผือก': 'Taro Cookies',
    'คุกกี้กระต่าย': 'Bunny Cookies',
    'คุกกี้ครีมวานิลลา': 'Vanilla Cream Cookies',
    'วีโอ สตรอเบอร์รี่': 'VO Strawberry',
    'มินิวีโอ': 'Mini VO',
    'มินิคุกกี้กาแล็คซี': 'Mini Galaxy Cookies',
    'คุกกี้กาแล็กซี่': 'Galaxy Cookies',
    'คุกกี้ดอกไม้สตรอว์เบอร์รี': 'Strawberry Flower Cookies',
    'คุกกี้หมีน้อย': 'Teddy Bear Cookies',
    'บิสกิตทรงหมี ทั้งรสนมและช็อกโกแลต ถูกใจเด็ก ๆ':
      'Bear-shaped biscuits in milk and chocolate — a favourite with kids',
    'เฟรนช์ฟรายส์ BBQ': 'French Fries BBQ',
    'เฟรนช์ฟรายส์กุ้งสไปซี่': 'French Fries, Spicy Shrimp',
    'เฟรนช์ฟรายส์มะเขือเทศ': 'French Fries, Tomato',
    'มันจังบาร์บีคิว': 'Manjang BBQ',
    'มันจังโนริ': 'Manjang Nori',
    'ข้าวโพดอบช็อกโกแลต': 'Baked Corn Snack, Chocolate',
    'หนวดกุ้ง': 'Shrimp Whiskers',
    'บอมบ์บอมบ์': 'Bomb Bomb',
    'เวเฟอร์แผ่นช็อกโกแลต': 'Chocolate Wafer Sheet',
    'เวเฟอร์แผ่นนม': 'Milk Wafer Sheet',
    'เวเฟอร์แผ่นมะพร้าว': 'Coconut Wafer Sheet',
    'เวเฟอร์แผ่นสตรอเบอร์รี่': 'Strawberry Wafer Sheet',
    'เวเฟอร์แผ่นส้ม': 'Orange Wafer Sheet',
    'เวเฟอร์ลูกเต๋าช็อกโกแลต': 'Chocolate Wafer Cubes',
    'เวเฟอร์ลูกเต๋าบลูเบอร์รี่': 'Blueberry Wafer Cubes',
    'เวเฟอร์คิ้วช็อกโกแลต': 'Chocolate Eyebrow Wafer',
    'ข้าวเกรียบตารางรสกุ้ง': 'Grid Crackers, Shrimp',
    'ข้าวเกรียบตารางรสปาปริก้า': 'Grid Crackers, Paprika',
    'ข้าวเกรียบหลอดรสกุ้ง': 'Tube Crackers, Shrimp',
    'ข้าวเกรียบกุ้ง': 'Shrimp Crackers',

    /* ── flavours ── */
    'สตรอเบอรี่': 'Strawberry',
    'สตรอเบอร์รี่': 'Strawberry',
    'ช็อกโกแลต': 'Chocolate',
    'ช็อคโกแลต': 'Chocolate',
    'รสนม': 'Milk',
    'ทุเรียน': 'Durian',
    'มะม่วง': 'Mango',
    'มะพร้าว': 'Coconut',

    /* ── brands page ── */
    'แบรนด์ของเรา — VFoods': 'Our Brands — VFoods',
    'แคตตาล็อกสินค้า · 129 รายการ': 'Product Catalogue · 129 items',
    'รวมสินค้าทุกแบรนด์ในกลุ่มวีฟู้ดส์ พร้อมขนาดสินค้า ขนาดลัง และจำนวนบรรจุจริงจากโรงงาน':
      'Every product across the VFoods group, with real product sizes, carton sizes and pack counts straight from the factory',
    'สินค้าทั้งหมดพร้อมขนาดจริง': 'All Products with Real Dimensions',
    'เลือกแบรนด์เพื่อดูสินค้าทั้งหมด พร้อมขนาดสินค้า ขนาดลัง และจำนวนบรรจุต่อลัง — อ้างอิงสเปคจริงจากโรงงาน':
      'Pick a brand to see all of its products with product size, carton size and units per carton — real factory specs',
    'Product Catalog · สินค้าพร้อมขนาดจริง': 'Product Catalogue · Real Dimensions',
    'เลือกแบรนด์ด้านบนเพื่อดูสินค้าทั้งหมด พร้อมขนาดสินค้า ขนาดลัง และจำนวนบรรจุ — อ้างอิงสเปคจริงจากโรงงาน':
      'Choose a brand above to see all of its products with product size, carton size and pack count — real factory specs',
    'ไม่พบสินค้าที่ค้นหา': 'No products found',
    'สร้างแบรนด์ของคุณ': 'Create Your Own Brand',
    'ผลิตสินค้าภายใต้แบรนด์ของคุณเองผ่านบริการ OEM ของเรา':
      'Produce under your own brand with our OEM service',
    'กรองตามบรรจุภัณฑ์': 'Filter by packaging',
    'มิกซ์': 'Mix',
    'เบนจี้': 'Benjy',
    'อื่นๆ': 'Other',
    'ขนาดสินค้า': 'Product size',
    'ขนาดลัง': 'Carton size',
    'บรรจุ/ลัง': 'Units/carton',
    'พบ': 'Found',
    'รายการ': 'items',
    'แบรนด์ต่อไปนี้กำลังจัดเตรียมแคตตาล็อกสินค้า เร็วๆ นี้':
      'Catalogues for the following brands are coming soon',
    'แสดงขนาดสินค้า · ขนาดลัง · จำนวนบรรจุต่อลัง อ้างอิงสเปคจริงจากโรงงาน — คลิกแบรนด์อื่นเพื่อสลับดู':
      'Showing product size · carton size · units per carton from real factory specs — click another brand to switch',
    'สินค้าแบรนด์นี้ (ข้อมูลขนาดบรรจุอยู่ระหว่างจัดเก็บ) — คลิกแบรนด์อื่นเพื่อสลับดู':
      'Products for this brand (packaging dimensions are still being collected) — click another brand to switch',
    'แบรนด์ในกลุ่มนี้กำลังจัดเตรียมข้อมูลสินค้า เร็วๆ นี้':
      'Product information for these brands is coming soon',

    /* ── brands page: packaging groups + descriptions ── */
    'EOE (ฝาดึง)': 'EOE (Easy-Open Lid)',
    'ฝาหมุน': 'Screw Lid',
    'กระปุกเหลี่ยม': 'Square Jar',
    'ปี๊บใหญ่ 900g': 'Large Tin 900 g',
    'ปี๊บ B10': 'Tin B10',
    'ปี๊บไมโคร เจาะหน้าต่าง': 'Micro Tin, Window Cut',
    'ปี๊บไมโคร ฝาครอบ': 'Micro Tin, Cover Lid',
    'เวเฟอร์แผ่นกล่อง': 'Boxed Wafer Sheets',
    'เซตรวมรส (ถัง/ถุงหิ้ว)': 'Mixed-Flavour Set (Bucket / Carry Bag)',
    'เบนจี้ ข้าวอบกรอบ (ซองตั้ง)': 'Benjy Crispy Rice (Stand-up Pouch)',
    'กระปุกของเล่น': 'Toy Jar',
    'มิกซ์ ขาไก่ (ซองตั้ง)': 'Mix Tasty Sticks (Stand-up Pouch)',
    'ขนมข้าวโพดอบกรอบ (ซอง)': 'Baked Corn Snack (Pouch)',
    'ซอง / ถาด / ถุงหิ้ว': 'Pouch / Tray / Carry Bag',
    'เดียร์ เทดดี้ (150g)': 'Dear Teddy (150 g)',
    'รอยัล เวเฟอร์ (125g)': 'Royal Wafer (125 g)',
    'เซเลเบรท (400g)': 'Celebrate (400 g)',
    'ปี๊บพลาสติกฝา EOE ดึงเปิดง่าย': 'Plastic tin with an easy-open EOE lid',
    'ปี๊บฝาหมุนเกลียว': 'Tin with a screw-thread lid',
    'กระปุกทรงเหลี่ยมใบใหญ่': 'Large square jar',
    'ปี๊บพลาสติกใบใหญ่': 'Large plastic tin',
    'ปี๊บทรงสูง': 'Tall tin',
    'ปี๊บไมโครแบบเจาะหน้าต่างโชว์สินค้า': 'Micro tin with a window that shows the product',
    'ปี๊บไมโครแบบฝาครอบ': 'Micro tin with a cover lid',
    'กล่องเวเฟอร์แผ่นสอดไส้ครีม': 'Box of cream-filled wafer sheets',
    'ชุดรวมรสสำหรับเป็นของฝาก': 'Mixed-flavour gift set',
    'ข้าวอบกรอบเพื่อสุขภาพ แบรนด์เบนจี้': 'Healthy crispy rice snack from Benjy',
    'กระปุกใสทรงของเล่น': 'Clear toy-shaped jar',
    'ซองตั้งขาไก่แบรนด์มิกซ์': 'Stand-up pouch of Mix tasty sticks',
    'ซองขนมข้าวโพดอบกรอบ': 'Pouch of baked corn snack',
    'ขนาดพกพา 25-35 กรัม': 'Portable size, 25–35 g',
    'บิสกิตพรีเมียมแบรนด์เดียร์ เทดดี้': 'Premium biscuits from Dear Teddy',
    'เวเฟอร์แท่งพรีเมียม สูตรหลวง': 'Premium wafer sticks, royal recipe',
    'เซตขนมรวมรสสำหรับทุกโอกาส': 'Mixed-flavour snack set for every occasion',

    /* ── OEM guide ── */
    'VFoods OEM — คู่มือการผลิต': 'VFoods OEM — Manufacturing Guide',
    'ไม่เพียงแต่เป็นผู้ผลิต เรายังเป็นผู้เชี่ยวชาญ OEM ที่พร้อมให้คำแนะนำตั้งแต่ตัวสินค้า รสชาติ จนถึงบรรจุภัณฑ์ที่ตอบโจทย์แบรนด์ของคุณ':
      'More than a manufacturer — we are OEM specialists, ready to advise on the product, the flavour and the packaging that answers your brand’s brief.',
    'ปรึกษาทีม OEM': 'Talk to the OEM Team',
    'ดูขั้นตอน OEM': 'See the OEM Steps',
    'คุกกี้หลากหลายรูปแบบ': 'Cookies in Many Shapes',
    'เลือกจากหลายประเภทหรือให้เราพัฒนารูปแบบใหม่ตามความต้องการของคุณ':
      'Choose from our range, or let us develop a new shape to your requirements',
    'คุกกี้ทรงเดซี่ สอดไส้ครีมช็อกโกแลตเข้มข้น หอมนุ่มทุกคำ':
      'Daisy-shaped cookies with a rich chocolate cream filling, soft and fragrant in every bite',
    'ลายกาแล็กซี่สุดพิเศษ สอดไส้ครีมหวานละมุน':
      'A striking galaxy pattern with a smooth, sweet cream filling',
    'บิสกิตทรงดอกไม้ สอดไส้ครีมสตรอว์เบอร์รีหวานน่ารัก':
      'Flower-shaped biscuits with a sweet strawberry cream filling',
    'รสชาติที่เรามี': 'Our Flavours',
    'หลากหลายรสให้เลือก ทั้งรสคลาสสิกและรสผลไม้ไทย หรือสั่งรสพิเศษเฉพาะแบรนด์คุณก็ได้เลย':
      'A wide range to choose from — classics and Thai fruit flavours — or order a flavour made only for your brand',
    'บรรจุภัณฑ์ที่เลือกได้': 'Packaging You Can Choose',
    'หลากรูปแบบให้เลือก ออกแบบลายบรรจุภัณฑ์ได้เอง เพื่อให้แบรนด์ของคุณโดดเด่นบนชั้นวาง':
      'Plenty of formats, with artwork you design yourself, so your brand stands out on the shelf',
    'กล่องลังกระดาษ': 'Corrugated Carton',
    'คุกกี้ดอกไม้สอดไส้ช็อกโกแลต VFoods': 'VFoods flower cookies with chocolate filling',
    'สตรอเบอรี่สด วัตถุดิบแต่งรส VFoods': 'Fresh strawberries, a VFoods flavouring ingredient',
    'ปี๊บโลหะ · กระปุก · ซองตั้งได้ · กล่องพิมพ์ลาย · ลังขนส่ง ออกแบบลายเอง พิมพ์สีจริง เด่นบนชั้นวาง':
      'Metal tin, jar, stand-up pouch, printed carton, shipping case — design your own artwork, printed in full colour, standing out on the shelf',
    'ลัง': 'Shipping case',
    'ลังลูกฟูกกระดาษคราฟท์ VFOODS': 'VFOODS kraft corrugated carton',
    'ซองฟอยล์ตั้งได้ Doy-pack': 'Stand-up doy-pack foil pouch',
    'ปี๊บโลหะฝาหน้าต่าง VFOODS': 'VFOODS metal tin with window lid',
    'ปี๊บโลหะพิมพ์ลายเต็มใบ VFOODS': 'VFOODS metal tin printed edge to edge',
    'กระปุกใส PET VFOODS': 'VFOODS clear PET jar',
    'ลังลูกฟูกกระดาษคราฟท์ แข็งแรง สำหรับบรรจุ-ขนส่งจำนวนมาก พิมพ์โลโก้แบรนด์ได้':
      'Sturdy kraft corrugated cartons for bulk packing and shipping, printable with your brand logo',
    'ลูกฟูกแข็งแรง': 'Strong corrugation',
    'ขนส่งได้': 'Ship-ready',
    'พิมพ์โลโก้': 'Logo printing',
    'ซองตั้งได้ Stand-up': 'Stand-up Pouch',
    'ซองฟอยล์ตั้งได้ Doy-pack ซีลแน่นกันความชื้น มีหูแขวน พิมพ์ฟิล์มสีจริง':
      'A stand-up doy-pack foil pouch — tightly sealed against moisture, euro-slot hanger, printed in full colour',
    'หูแขวน': 'Euro-slot hanger',
    'กันความชื้น': 'Moisture resistant',
    'ตั้งได้': 'Stands upright',
    'ปี๊บ (กระป๋องโลหะ)': 'Tin (Metal Can)',
    'บรรจุภัณฑ์โลหะทรงเหลี่ยม ทน ปิดสนิท เก็บได้นาน ดูพรีเมียม เหมาะเป็นของฝาก':
      'A square metal pack — tough, airtight, long-keeping and premium-looking, ideal as a gift',
    'โลหะ': 'Metal',
    'ปิดสนิท': 'Airtight',
    'เก็บนาน': 'Long shelf life',
    'กระปุก': 'Jar',
    'กระปุกใส PET เห็นตัวสินค้าชัด ฝาเกลียวปิดแน่น หยิบง่าย เหมาะวางหน้าร้าน-โชว์คุกกี้':
      'A clear PET jar that shows off the product, with a tight screw cap — easy to serve and made for counter display',
    'มองเห็นสินค้า': 'Product visible',
    'ฝาเกลียว': 'Screw cap',
    'โชว์หน้าร้าน': 'Counter display',
    'แบรนด์ชั้นนำที่ไว้วางใจให้เราผลิต': 'Leading Brands That Trust Us to Make Their Products',
    'ลูกค้าและคู่ค้าที่เลือกให้ VFoods เป็นผู้ผลิต OEM เบื้องหลังสินค้าคุณภาพของพวกเขา':
      'Customers and partners who chose VFoods as the OEM manufacturer behind their quality products',
    'โลโก้ลูกค้าของ VFoods': 'VFoods customer logos',
    'ลูกค้า VFoods': 'VFoods customer',
    'พร้อมสร้างแบรนด์ของคุณแล้ว?': 'Ready to build your own brand?',
    'ติดต่อทีมผู้เชี่ยวชาญของเราวันนี้ รับคำปรึกษาฟรี':
      'Talk to our specialists today for a free consultation',
    'และเริ่มผลิต OEM ภายใต้แบรนด์ของคุณได้เลย': 'and start OEM production under your own brand',
    'ดูข้อมูลเพิ่มเติม': 'Learn More',
    'สวัสดีครับ! มาดูขั้นตอน OEM กันเลยนะ!': 'Hi there! Let’s walk through the OEM steps!',
    'VFoods พร้อมเป็นพาร์ทเนอร์ของคุณ!': 'VFoods is ready to be your partner!',
    'เราพัฒนาสูตรเฉพาะให้แบรนด์คุณได้เลย!': 'We can develop a recipe just for your brand!',
    'สินค้าคุณภาพ ราคาดี ส่งไว!': 'Great quality, great price, fast delivery!',
    'แบรนด์ของคุณ สูตรของคุณ!': 'Your brand, your recipe!',
    'กดปุ่ม "ติดต่อเรา" เพื่อเริ่มต้น OEM เลย!': 'Hit "Contact Us" to get your OEM started!',

    /* ── contact page ── */
    'ติดต่อเรา — VFoods': 'Contact Us — VFoods',
    'ติดตามข่าวสาร โปรโมชั่น และสินค้าใหม่ของ VFoods ได้ทุกช่องทาง':
      'Follow VFoods for news, promotions and new products on every channel',
    'ช่องทางการติดต่อ': 'Get in Touch',
    'มีข้อสงสัย?': 'Have a question?',
    'พูดคุยกับเราได้เลย': 'Talk to us',
    'ทีมผู้เชี่ยวชาญ VFoods พร้อมให้คำปรึกษาด้านการผลิต OEM รสชาติ บรรจุภัณฑ์ และการตลาด ตอบทุกคำถามอย่างรวดเร็วและเป็นมืออาชีพ':
      'The VFoods specialist team is ready to advise on OEM production, flavour, packaging and marketing — every question answered quickly and professionally.',
    'อีเมล': 'Email',
    'โทรศัพท์': 'Telephone',
    'แฟกซ์': 'Fax',
    'ที่ตั้งโรงงาน': 'Factory location',
    'ถ.พระราม 2 กม.43+300 สมุทรสาคร': 'Rama II Rd. km 43+300, Samut Sakhon',
    'หากมีคำถามหรือข้อเสนอแนะ กรอกแบบฟอร์มด้านล่าง — ทีมงานจะติดต่อกลับโดยเร็วที่สุด':
      'Have a question or a suggestion? Fill in the form below and our team will come back to you as soon as possible.',
    'Name / ชื่อ': 'Name',
    'Email / อีเมล': 'Email',
    'Company / บริษัท': 'Company',
    'Telephone / เบอร์โทรศัพท์': 'Telephone',
    'Subject / เรื่องที่ติดต่อ': 'Subject',
    'Message / ข้อความ': 'Message',
    '-- เลือกหัวข้อ --': '-- Select a topic --',
    'สั่งซื้อสินค้า / Wholesale': 'Ordering / Wholesale',
    'OEM / รับจ้างผลิต': 'OEM / Contract manufacturing',
    'ร่วมงานกับ VFoods (Join Us)': 'Working at VFoods (Join Us)',
    'ข้อมูลแบรนด์': 'Brand information',
    'ชื่อของคุณ (Required)': 'Your name (Required)',
    'ชื่อบริษัท (Optional)': 'Company name (Optional)',
    'บอกเราว่าต้องการอะไร...': 'Tell us what you need...',
    'ส่งข้อความ →': 'Send message →',
    'ข้อมูลของคุณจะถูกเก็บเป็นความลับ ไม่มีการแชร์ให้บุคคลอื่น':
      'Your details are kept confidential and never shared with anyone else.',
    'วิธีเดินทางมาหาเรา': 'How to Get Here',
    'โรงงาน VFoods ตั้งอยู่ริมถนนพระราม 2 กม.43+300 (ฝั่งขาเข้ากรุงเทพฯ) อำเภอเมือง จังหวัดสมุทรสาคร':
      'The VFoods factory sits on Rama II Road at km 43+300 (Bangkok-bound side), Mueang District, Samut Sakhon.',
    'แผนที่เส้นทางมาโรงงาน VFoods บนถนนพระราม 2':
      'Map of the route to the VFoods factory on Rama II Road',
    'ที่ตั้งสำนักงาน และโรงงาน': 'Head Office & Factory',
    'ที่อยู่ / Address': 'Address',
    'โทรศัพท์ / Tel': 'Telephone',
    'แฟกซ์ / Fax': 'Fax',
    'อีเมล / Email': 'Email',
    '44/4 หมู่ 10 ถนนพระราม 2 ตำบลบางโทรัด': '44/4 Moo 10, Rama II Road, Bang Torat',
    'อำเภอเมือง จังหวัดสมุทรสาคร 74000': 'Mueang District, Samut Sakhon 74000',
    'ร่วมงานกับ': 'Join',
    'เราเปิดรับทีมที่มีความหลงใหลในการสร้างสรรค์ขนมที่ดีที่สุด ไม่ว่าจะเป็นสายการผลิต R&D การตลาด หรือโลจิสติกส์ — มาเติบโตไปด้วยกัน':
      'We are looking for people who love making the best snacks — in production, R&D, marketing or logistics. Let’s grow together.',
    'สมัครงานทางอีเมล': 'Apply by Email',
    'ดูตำแหน่งงานบน Facebook': 'See Openings on Facebook',
    'กำลังเปิดอีเมล...': 'Opening your email app...',
    'เปิดอีเมลแล้ว!': 'Email opened!',
    'เปิดโปรแกรมอีเมลแล้ว — กด Send เพื่อส่งถึงเรา':
      'Your email app is open — press Send to reach us',
    'ติดต่อจากเว็บไซต์ VFoods': 'Enquiry from the VFoods website',
    'ชื่อ: ': 'Name: ',
    'บริษัท: ': 'Company: ',
    'เบอร์โทรศัพท์: ': 'Telephone: ',
    'เรื่องที่ติดต่อ: ': 'Subject: ',
    'อีเมล: ': 'Email: ',
    '\nข้อความ:\n': '\nMessage:\n',

    /* ── search banner (main.js) ── */
    'ผลการค้นหา "': 'Search results for "',
    '" — พบ': '" — found',
    'รายการ ·': 'items ·',
    'ล้างการค้นหา': 'Clear search',
    'ไม่พบสินค้าที่ตรงกับ "': 'No products match "',
    'ดูสินค้าทั้งหมด': 'View all products',

    /* ── landing redirect ── */
    'VFOODS — เว็บไซต์ตัวอย่าง': 'VFOODS — Demo Site',
    'กำลังพาไปหน้าแรก…': 'Taking you to the homepage…',
    'เข้าสู่เว็บไซต์ →': 'Enter the site →'
  };

  /* ══════════ 2. English in the markup → Thai ══════════ */
  var EN2TH = {

    /* ── navigation ── */
    'Home': 'หน้าแรก',
    'News & Activities': 'ข่าวสารและกิจกรรม',
    'Products': 'สินค้า',
    'Our Brands': 'แบรนด์ของเรา',
    'OEM Engagement Guide': 'คู่มือการร่วมงาน OEM',
    'Contact Us': 'ติดต่อเรา',
    'OEM Guide': 'คู่มือ OEM',

    /* ── section eyebrows ── */
    'About Us': 'รู้จักเรา',
    'Our Products': 'ผลิตภัณฑ์ของเรา',
    'OEM Process': 'ขั้นตอน OEM',
    'News & Updates': 'ข่าวสารและอัปเดต',
    'Flavor Tunnel': 'อุโมงค์รสชาติ',
    'Product Catalog': 'แคตตาล็อกสินค้า',
    'Product Catalog · สินค้าพร้อมขนาดจริง': 'แคตตาล็อกสินค้า · ขนาดจริง',
    'Cookie Showcase': 'คุกกี้ของเรา',
    'Available Flavors': 'รสชาติที่มีให้เลือก',
    'Packaging Options': 'ตัวเลือกบรรจุภัณฑ์',
    'Our Customers': 'ลูกค้าของเรา',
    'Follow Us': 'ติดตามเรา',
    'How to meet us': 'การเดินทางมาหาเรา',
    'Our location': 'ที่ตั้งของเรา',

    /* ── home hero + journey ── */
    'THE VARIETY WORLD OF': 'โลกแห่งความหลากหลายของ',
    'BISCUITS, COOKIES, AND SNACKS': 'บิสกิต คุกกี้ และขนมขบเคี้ยว',
    'CERTIFIED': 'ผ่านการรับรอง',
    'STANDARD': 'มาตรฐาน',
    'OEM by': 'ผลิต OEM โดย',
    'Step 01 · Cookie': 'ขั้นที่ 01 · ตัวคุกกี้',
    'Step 02 · Flavor': 'ขั้นที่ 02 · รสชาติ',
    'Step 03 · Package': 'ขั้นที่ 03 · บรรจุภัณฑ์',
    'Finish · เสร็จ!': 'ขั้นสุดท้าย · เสร็จแล้ว!',
    'GO!': 'ไป!',

    /* ── news ── */
    'NPD Update': 'อัปเดตสินค้าใหม่',
    'NPD': 'สินค้าใหม่',
    'Event': 'กิจกรรม',
    'EVENT': 'กิจกรรม',
    'Award': 'รางวัล',
    'AWARD': 'รางวัล',
    'NEWS': 'ข่าวสาร',
    'SHOP': 'ช้อป',
    'EXPORT': 'ส่งออก',
    'E-Commerce': 'อีคอมเมิร์ซ',
    'News': 'ข่าวสาร',
    'Product': 'สินค้า',
    'VFoods Thailand Facebook Page': 'เพจเฟซบุ๊ก VFoods Thailand',

    /* ── product categories (tunnel gates, section sub-lines) ── */
    'Biscuit Sticks': 'ขนมขาไก่',
    'Biscuit & Cracker': 'บิสกิตและแครกเกอร์',
    'Biscuits & Crackers': 'บิสกิตและแครกเกอร์',
    'Cream Filled': 'บิสกิตสอดไส้',
    'Cream Filled Biscuits': 'บิสกิตสอดไส้ครีม',
    'Pineapple Jam': 'แยมสับปะรด',
    'Pineapple Jam Biscuits': 'บิสกิตสอดไส้แยมสับปะรด',
    'Rolled Wafer': 'เวเฟอร์สติ๊ก',
    'Rolled Wafer Stick': 'เวเฟอร์สติ๊ก',
    'Sandwich Cookies': 'คุ้กกี้สอดไส้ครีม',
    'Snack': 'ขนมทานเล่น',
    'Wafer': 'เวเฟอร์แผ่น',
    'Wafer Sheet': 'เวเฟอร์แผ่น',
    'Fried Snacks': 'ตัวทอด',
    'NEW': 'ใหม่',

    /* ── OEM guide ── */
    'VFoods OEM Manufacturing & Consulting': 'VFoods รับผลิต OEM และให้คำปรึกษา',
    '— OEM Manufacturing & Consulting Thailand': '— รับผลิต OEM และให้คำปรึกษา ประเทศไทย',
    'scroll': 'เลื่อนลง',
    'Strawberry': 'สตรอเบอรี่',
    'Chocolate': 'ช็อกโกแลต',
    'Milk': 'รสนม',
    'Durian': 'ทุเรียน',
    'Mango': 'มะม่วง',
    'Coconut': 'มะพร้าว',
    'Custom Order': 'สั่งรสพิเศษ',

    /* ── contact ── */
    'Join with': 'มาเป็นเพื่อนกับ',
    'me': 'เรา',
    'Rama II Rd. · km 43+300': 'ถ.พระราม 2 · กม.43+300',
    'Variety Foods International Co., Ltd.': 'บริษัท วาไรตี้ ฟู้ดส์ อินเตอร์เนชั่นแนล จำกัด',
    'your@email.com (Required)': 'your@email.com (จำเป็น)',
    '08x-xxx-xxxx (Optional)': '08x-xxx-xxxx (ไม่บังคับ)',

    /* ── footers ── */
    'VFoods Co., Ltd.': 'บริษัท วีฟู้ดส์ จำกัด',
    'All rights reserved.': 'สงวนลิขสิทธิ์',
    'Made with love in Thailand': 'สร้างสรรค์ด้วยใจในประเทศไทย',
    '© 2025 VFoods Co., Ltd.': '© 2025 บริษัท วีฟู้ดส์ จำกัด',
    '© 2026 Variety Foods International Co., Ltd. All rights reserved.':
      '© 2026 บริษัท วาไรตี้ ฟู้ดส์ อินเตอร์เนชั่นแนล จำกัด สงวนลิขสิทธิ์'
  };

  /* ══════════ 3. Patterns for strings built around a value ══════════
     Applied only when there is no exact match. No /g flags — the
     engine calls .test() then .replace() on the same RegExp.        */
  var RULES_EN = [
    [/^(\d+)\s*สินค้า$/, '$1 products'],
    [/^บรรจุภัณฑ์ทั้งหมด\s*\((\d+)\)$/, 'All packaging ($1)'],
    [/^น้ำหนัก\s*(.*?)\s*·\s*ขนาดบรรจุ:\s*สอบถามฝ่ายขาย$/, 'Weight $1 · Pack size: ask our sales team'],
    [/^([\d.,\s×x]+)ซม\.$/, '$1cm']
  ];
  var RULES_TH = [
    [/^(\d+) products$/, '$1 สินค้า'],
    [/^All packaging\s*\((\d+)\)$/, 'บรรจุภัณฑ์ทั้งหมด ($1)'],
    [/^Weight\s*(.*?)\s*·\s*Pack size: ask our sales team$/, 'น้ำหนัก $1 · ขนาดบรรจุ: สอบถามฝ่ายขาย'],
    [/^([\d.,\s×x]+)cm$/, '$1ซม.']
  ];

  /* ══════════ 4. Engine ══════════ */

  var KEY = 'vf-lang';
  var ATTRS = ['placeholder', 'aria-label', 'title', 'alt', 'data-name'];
  var HAS = Object.prototype.hasOwnProperty;

  var lang = 'th';
  try {
    var saved = w.localStorage && localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'th') lang = saved;
  } catch (e) { /* private mode — fall back to Thai */ }

  var textMem = new WeakMap();   // text node  -> { src, out }
  var attrMem = new WeakMap();   // element    -> { 'attr': {src,out}, __txt: string }
  var blockMem = new WeakMap();  // .lb element-> { src, key, out }
  var titleMem = null;

  /* Manual line-break markers are invisible layout hints, never part of the
     string an editor typed — drop them so the dictionary still matches:
     U+200B zero-width space (&#8203;, our soft break point), U+200C/U+200D
     zero-width joiners, U+2060 word joiner, U+00AD soft hyphen.
     &nbsp; needs no rule: it is \s, so it folds into a plain space below. */
  var ZW = /[\u200b\u200c\u200d\u2060\u00ad]/g;
  function norm(s) { return s.replace(ZW, '').replace(/[\s ]+/g, ' ').trim(); }

  /* Dictionary keys are written for readability, so fold them once into
     the same shape lookup() produces (collapsed whitespace, trimmed). */
  (function normalizeKeys() {
    [TH2EN, EN2TH].forEach(function (map) {
      Object.keys(map).forEach(function (k) {
        var n = norm(k);
        if (n !== k) { map[n] = map[k]; delete map[k]; }
      });
    });
  })();

  /* returns the translation of `raw` for `lg`, or null when unchanged */
  function lookup(raw, lg) {
    var key = norm(raw);
    if (!key) return null;
    var map = lg === 'en' ? TH2EN : EN2TH;
    if (HAS.call(map, key)) return map[key];
    var rules = lg === 'en' ? RULES_EN : RULES_TH;
    for (var i = 0; i < rules.length; i++) {
      if (rules[i][0].test(key)) return key.replace(rules[i][0], rules[i][1]);
    }
    return null;
  }

  var EDGES = /^(\s*)([\s\S]*?)(\s*)$/;

  function applyText(node) {
    var cur = node.nodeValue;
    if (!cur || !/\S/.test(cur)) return;
    var rec = textMem.get(node);
    // a page script rewrote this node → treat the new value as the source
    if (!rec || rec.out !== cur) { rec = { src: cur }; textMem.set(node, rec); }
    var m = EDGES.exec(rec.src);
    var hit = lookup(m[2], lang);
    var out = hit === null ? rec.src : m[1] + hit + m[3];
    rec.out = out;
    if (cur !== out) node.nodeValue = out;
  }

  function applyAttrs(el) {
    var rec = null;
    for (var i = 0; i < ATTRS.length; i++) {
      var name = ATTRS[i];
      if (!el.hasAttribute(name)) continue;
      var cur = el.getAttribute(name);
      if (!cur || !/\S/.test(cur)) continue;
      if (!rec) { rec = attrMem.get(el) || {}; attrMem.set(el, rec); }
      var slot = rec[name];
      if (!slot || slot.out !== cur) { slot = { src: cur }; rec[name] = slot; }
      var hit = lookup(slot.src, lang);
      var out = hit === null ? slot.src : hit;
      slot.out = out;
      if (cur !== out) el.setAttribute(name, out);
    }
  }

  /* data-i18n-en / data-i18n-th win over the dictionary */
  function applyOverride(el) {
    var rec = attrMem.get(el);
    if (!rec) { rec = {}; attrMem.set(el, rec); }
    if (rec.__txt === undefined) rec.__txt = el.textContent;
    var pick = el.getAttribute(lang === 'en' ? 'data-i18n-en' : 'data-i18n-th');
    var out = pick === null ? rec.__txt : pick;
    if (el.textContent !== out) el.textContent = out;
  }

  /* An element carrying class="lb" has its line breaks placed by hand: the
     markup inside it — <span class="nb">, &#8203;, <br> — is layout, not
     language. Translate it as ONE unit so the dictionary stays keyed on the
     plain sentence, and put the original markup back when Thai returns. */
  function blockKey(html) {
    var box = d.createElement('div');
    box.innerHTML = html.replace(/<br\s*\/?>/gi, ' ');
    return box.textContent;
  }

  function applyBlock(el) {
    var cur = el.innerHTML;
    var rec = blockMem.get(el);
    // a page script re-rendered this element -> the new markup is the source
    if (!rec || rec.out !== cur) { rec = { src: cur, key: blockKey(cur) }; blockMem.set(el, rec); }
    var hit = lookup(rec.key, lang);
    if (hit === null) {
      if (cur !== rec.src) el.innerHTML = rec.src;   // back to the hand-wrapped original
    } else if (el.textContent !== hit) {
      el.textContent = hit;                          // the other language wraps on its own
    }
    rec.out = el.innerHTML;
  }

  function isSkipped(el) {
    var t = el.tagName;
    return t === 'SCRIPT' || t === 'STYLE' || t === 'NOSCRIPT' ||
           el.hasAttribute('data-i18n-skip');
  }

  function walk(node) {
    if (!node) return;
    if (node.nodeType === 3) { applyText(node); return; }
    if (node.nodeType !== 1) {
      if (node.nodeType === 9 || node.nodeType === 11) {
        for (var c = node.firstChild; c; c = c.nextSibling) walk(c);
      }
      return;
    }
    if (isSkipped(node)) return;
    applyAttrs(node);
    // a textarea's placeholder is ours to translate, its value is the user's
    if (node.tagName === 'TEXTAREA') return;
    if (node.hasAttribute('data-i18n-en') || node.hasAttribute('data-i18n-th')) {
      applyOverride(node);   // replaces the children — do not descend
      return;
    }
    if (node.classList && node.classList.contains('lb')) {
      applyBlock(node);      // hand-wrapped block — translated whole, do not descend
      return;
    }
    for (var ch = node.firstChild; ch; ch = ch.nextSibling) walk(ch);
  }

  function applyTitle() {
    var cur = d.title;
    if (!cur) return;
    if (!titleMem || titleMem.out !== cur) titleMem = { src: cur };
    var hit = lookup(titleMem.src, lang);
    var out = hit === null ? titleMem.src : hit;
    titleMem.out = out;
    if (cur !== out) d.title = out;
  }

  function syncButtons() {
    var btns = d.querySelectorAll('.vf-lang-btn');
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute('data-lang') === lang;
      btns[i].classList.toggle('is-on', on);
      btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function setLang(next, remember) {
    lang = next === 'en' ? 'en' : 'th';
    if (remember !== false) {
      try { localStorage.setItem(KEY, lang); } catch (e) { /* ignore */ }
    }
    d.documentElement.setAttribute('lang', lang);
    d.documentElement.setAttribute('data-lang', lang);
    applyTitle();
    walk(d.body);
    syncButtons();
    try {
      w.dispatchEvent(new CustomEvent('vf:langchange', { detail: { lang: lang } }));
    } catch (e) { /* older browsers — nobody is listening anyway */ }
  }

  /* ── catch anything rendered after load ── */
  var queue = [], queued = false;
  function flush() {
    queued = false;
    var list = queue; queue = [];
    for (var i = 0; i < list.length; i++) {
      var n = list[i];
      if (!n.isConnected) continue;
      var p = n.parentElement;
      // skip our own rewrites: data-i18n overrides and .lb hand-wrapped blocks
      if (p && (p.hasAttribute('data-i18n-en') || p.hasAttribute('data-i18n-th'))) continue;
      if (p && p.closest && p.closest('.lb')) continue;
      walk(n);
    }
    syncButtons();
  }
  var observer = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var added = records[i].addedNodes;
      for (var j = 0; j < added.length; j++) queue.push(added[j]);
    }
    // setTimeout, not requestAnimationFrame: a backgrounded tab never paints,
    // and content rendered there still has to come out translated.
    if (queue.length && !queued) { queued = true; setTimeout(flush, 0); }
  });

  d.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('.vf-lang-btn') : null;
    if (!btn) return;
    e.preventDefault();
    setLang(btn.getAttribute('data-lang'));
  });

  function init() {
    d.documentElement.setAttribute('lang', lang);
    d.documentElement.setAttribute('data-lang', lang);
    applyTitle();
    walk(d.body);
    syncButtons();
    observer.observe(d.body, { childList: true, subtree: true });
  }

  /* Merge extra Thai→English pairs. Data-driven pages (the brand catalogue)
     already carry both names per record, so they hand them over instead of
     duplicating 129 rows in the dictionary above. A page can either call
     VFI18N.add() or, when it runs before this script, set window.VF_I18N_EXTRA. */
  function add(map) {
    if (!map) return;
    Object.keys(map).forEach(function (k) {
      var n = norm(k);
      if (n && map[k]) TH2EN[n] = map[k];
    });
  }

  w.VFI18N = {
    get lang() { return lang; },
    setLang: setLang,
    /* translate one string for the current language (for JS-built strings) */
    t: function (s) { var hit = lookup(s, lang); return hit === null ? s : hit; },
    add: function (map) { add(map); if (d.body) walk(d.body); }
  };

  add(w.VF_I18N_EXTRA);

  if (d.body) init();
  else d.addEventListener('DOMContentLoaded', init);
})(window, document);
