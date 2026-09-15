# -*- coding: utf-8 -*-
"""
VFoods News Updater — โปรแกรมลงข่าวหน้าเว็บ VFOODS (เวอร์ชัน .exe)

ทำอะไร
  1. หา "โฟลเดอร์เว็บ" (โฟลเดอร์ที่มีไฟล์ news.html) — จำไว้ให้ใช้ครั้งต่อไป
  2. เปิดเว็บเซิร์ฟเวอร์เล็ก ๆ ที่ 127.0.0.1 ให้หน้า admin/news-admin.html ทำงาน
  3. เปิดหน้าโปรแกรมลงข่าวในเบราว์เซอร์
  4. รับคำสั่งจากหน้าเว็บ: บันทึกไฟล์ลงโฟลเดอร์เว็บโดยตรง / สั่ง git push ขึ้นเว็บจริง

ใช้เฉพาะ standard library ของ Python (http.server, tkinter, subprocess) — build เป็น exe ด้วย PyInstaller
"""

import base64
import json
import os
import posixpath
import queue
import socket
import subprocess
import sys
import threading
import webbrowser
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

APP_NAME = "VFoods News Updater"
CONFIG_DIR = os.path.join(os.environ.get("APPDATA") or os.path.expanduser("~"), "VFoodsNews")
CONFIG_PATH = os.path.join(CONFIG_DIR, "config.json")
ADMIN_PAGE = "admin/news-admin.html"
MARKER = "news.html"

# ── ข้อความ log ที่ส่งกลับไปแสดงบนหน้าต่างโปรแกรม ────────────────
LOG = queue.Queue()


def log(msg):
    LOG.put(str(msg))


# ══════════════════════════════════════════════════════════════
#  หาโฟลเดอร์เว็บ
# ══════════════════════════════════════════════════════════════
def app_dir():
    """โฟลเดอร์ที่ไฟล์ exe (หรือ .py) วางอยู่"""
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))


def looks_like_site(path):
    return bool(path) and os.path.isfile(os.path.join(path, MARKER)) \
        and os.path.isfile(os.path.join(path, ADMIN_PAGE.replace("/", os.sep)))


def read_config():
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def write_config(cfg):
    try:
        os.makedirs(CONFIG_DIR, exist_ok=True)
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(cfg, f, ensure_ascii=False, indent=2)
    except Exception as e:
        log("บันทึกค่าตั้งไม่ได้: %s" % e)


def guess_site_root():
    """ไล่หาโฟลเดอร์เว็บจาก: ข้าง exe -> โฟลเดอร์แม่ 3 ชั้น -> ค่าที่เคยเลือกไว้"""
    here = app_dir()
    candidates = [here]
    p = here
    for _ in range(4):
        p = os.path.dirname(p)
        if not p or p in candidates:
            break
        candidates.append(p)
    candidates.append(read_config().get("site_root", ""))
    for c in candidates:
        if looks_like_site(c):
            return os.path.abspath(c)
    return None


def ask_site_root():
    """ให้ผู้ใช้เลือกโฟลเดอร์เว็บเอง"""
    import tkinter as tk
    from tkinter import filedialog, messagebox

    root = tk.Tk()
    root.withdraw()
    messagebox.showinfo(
        APP_NAME,
        "ยังหาโฟลเดอร์เว็บไม่เจอ\n\n"
        "กรุณาเลือกโฟลเดอร์ของเว็บ VFOODS\n"
        "(โฟลเดอร์ที่มีไฟล์ news.html อยู่ข้างใน)",
    )
    while True:
        picked = filedialog.askdirectory(title="เลือกโฟลเดอร์เว็บ VFOODS (ที่มีไฟล์ news.html)")
        if not picked:
            root.destroy()
            return None
        picked = os.path.abspath(picked)
        if looks_like_site(picked):
            root.destroy()
            return picked
        again = messagebox.askretrycancel(
            APP_NAME,
            "โฟลเดอร์นี้ไม่มีไฟล์ news.html หรือ admin/news-admin.html\n\nลองเลือกใหม่อีกครั้งไหม?",
        )
        if not again:
            root.destroy()
            return None


# ══════════════════════════════════════════════════════════════
#  git
# ══════════════════════════════════════════════════════════════
def run_git(root, args, timeout=180):
    flags = 0
    if os.name == "nt":
        flags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
    p = subprocess.run(
        ["git"] + args,
        cwd=root,
        capture_output=True,
        timeout=timeout,
        creationflags=flags,
    )
    out = (p.stdout + p.stderr).decode("utf-8", "replace").strip()
    return p.returncode, out


def has_git(root):
    try:
        code, _ = run_git(root, ["rev-parse", "--is-inside-work-tree"], timeout=20)
        return code == 0
    except Exception:
        return False


def git_publish(root, message):
    """add เฉพาะโฟลเดอร์ news/ แล้ว commit + push"""
    steps = []
    code, out = run_git(root, ["add", "--", "news"])
    steps.append("git add news/\n" + out)
    if code != 0:
        return False, "\n".join(steps)

    code, out = run_git(root, ["status", "--porcelain", "--", "news"])
    if code == 0 and not out.strip():
        return True, "ไม่มีอะไรเปลี่ยนแปลง — ข่าวบนเว็บเป็นเวอร์ชันล่าสุดอยู่แล้ว"

    code, out = run_git(root, ["commit", "-m", message])
    steps.append("git commit\n" + out)
    if code != 0:
        return False, "\n".join(steps)

    code, out = run_git(root, ["push"])
    steps.append("git push\n" + out)
    return code == 0, "\n".join(steps)


# ══════════════════════════════════════════════════════════════
#  เว็บเซิร์ฟเวอร์ + API
# ══════════════════════════════════════════════════════════════
class Handler(SimpleHTTPRequestHandler):
    site_root = "."

    def translate_path(self, path):
        path = path.split("?", 1)[0].split("#", 1)[0]
        path = posixpath.normpath(path.lstrip("/"))
        parts = [p for p in path.split("/") if p not in ("", ".", "..")]
        return os.path.join(self.site_root, *parts)

    def log_message(self, fmt, *args):
        pass  # เงียบไว้ ไม่ต้องรก log

    # ── helper ──────────────────────────────────────────────
    def _json(self, obj, status=HTTPStatus.OK):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        n = int(self.headers.get("Content-Length") or 0)
        if n <= 0:
            return {}
        return json.loads(self.rfile.read(n).decode("utf-8"))

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        SimpleHTTPRequestHandler.end_headers(self)

    # ── routes ──────────────────────────────────────────────
    def do_GET(self):
        if self.path.split("?")[0] == "/__api/ping":
            return self._json({
                "ok": True,
                "app": APP_NAME,
                "root": self.site_root,
                "git": has_git(self.site_root),
            })
        return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        route = self.path.split("?")[0]
        try:
            if route == "/__api/save":
                return self._save()
            if route == "/__api/publish":
                return self._publish()
        except Exception as e:
            log("ผิดพลาด: %s" % e)
            return self._json({"ok": False, "error": str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR)
        self.send_error(HTTPStatus.NOT_FOUND)

    def _safe_target(self, name):
        """กันไม่ให้เขียนไฟล์ออกนอกโฟลเดอร์ news/ ของเว็บ"""
        parts = [p for p in str(name).replace("\\", "/").split("/") if p not in ("", ".", "..")]
        if not parts or parts[0] != "news":
            raise ValueError("เขียนได้เฉพาะไฟล์ในโฟลเดอร์ news/ เท่านั้น: %s" % name)
        return os.path.join(self.site_root, *parts)

    def _save(self):
        payload = self._read_json()
        files = payload.get("files") or []
        written = []
        for f in files:
            target = self._safe_target(f.get("name", ""))
            os.makedirs(os.path.dirname(target), exist_ok=True)
            data = base64.b64decode(f.get("b64", ""))
            with open(target, "wb") as fh:
                fh.write(data)
            written.append(os.path.relpath(target, self.site_root).replace("\\", "/"))
        log("บันทึก %d ไฟล์ลงโฟลเดอร์เว็บแล้ว" % len(written))
        for w in written:
            log("   · " + w)
        return self._json({"ok": True, "written": written})

    def _publish(self):
        payload = self._read_json()
        msg = (payload.get("message") or "").strip() or "อัปเดตข่าวสาร"
        if not has_git(self.site_root):
            return self._json({"ok": False, "error": "โฟลเดอร์เว็บนี้ไม่ใช่ git repository จึงอัปโหลดขึ้นเว็บอัตโนมัติไม่ได้"})
        log("กำลังอัปโหลดขึ้นเว็บ (git push) …")
        ok, out = git_publish(self.site_root, msg)
        for line in out.splitlines():
            log("   " + line)
        log("อัปโหลดสำเร็จ ✅" if ok else "อัปโหลดไม่สำเร็จ ❌")
        return self._json({"ok": ok, "output": out})


def free_port():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


def start_server(site_root):
    Handler.site_root = site_root
    port = free_port()
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    return httpd, port


# ══════════════════════════════════════════════════════════════
#  หน้าต่างควบคุม (tkinter)
# ══════════════════════════════════════════════════════════════
def main():
    site_root = guess_site_root()
    if not site_root:
        site_root = ask_site_root()
    if not site_root:
        return 1
    write_config({"site_root": site_root})

    httpd, port = start_server(site_root)
    url = "http://127.0.0.1:%d/%s" % (port, ADMIN_PAGE)

    import tkinter as tk
    from tkinter import scrolledtext

    win = tk.Tk()
    win.title(APP_NAME)
    win.geometry("720x420")
    win.configure(bg="#FBF6EF")
    try:
        ico = os.path.join(app_dir(), "vfoods.ico")
        if os.path.isfile(ico):
            win.iconbitmap(ico)
    except Exception:
        pass

    head = tk.Frame(win, bg="#E45F06")
    head.pack(fill="x")
    tk.Label(head, text="VFOODS · โปรแกรมลงข่าว", bg="#E45F06", fg="white",
             font=("Segoe UI Semibold", 15), pady=12).pack(side="left", padx=18)

    info = tk.Frame(win, bg="#FBF6EF")
    info.pack(fill="x", padx=18, pady=(14, 6))
    tk.Label(info, text="โฟลเดอร์เว็บ:", bg="#FBF6EF", fg="#7a6a62",
             font=("Segoe UI", 9)).grid(row=0, column=0, sticky="w")
    tk.Label(info, text=site_root, bg="#FBF6EF", fg="#2B1B16",
             font=("Segoe UI", 9, "bold")).grid(row=0, column=1, sticky="w", padx=(8, 0))
    tk.Label(info, text="git:", bg="#FBF6EF", fg="#7a6a62",
             font=("Segoe UI", 9)).grid(row=1, column=0, sticky="w")
    tk.Label(info, text=("พร้อมอัปโหลดขึ้นเว็บได้" if has_git(site_root) else "ไม่พบ git — ใช้ปุ่มส่งออก .zip แทน"),
             bg="#FBF6EF", fg="#2B1B16", font=("Segoe UI", 9)).grid(row=1, column=1, sticky="w", padx=(8, 0))

    bar = tk.Frame(win, bg="#FBF6EF")
    bar.pack(fill="x", padx=18, pady=(4, 10))

    def mkbtn(text, cmd, primary=False):
        b = tk.Button(bar, text=text, command=cmd, relief="flat", cursor="hand2",
                      font=("Segoe UI Semibold", 10), padx=16, pady=7,
                      bg=("#E45F06" if primary else "#ffffff"),
                      fg=("#ffffff" if primary else "#B8480A"),
                      activebackground=("#c85305" if primary else "#fff1e6"),
                      activeforeground=("#ffffff" if primary else "#B8480A"))
        b.pack(side="left", padx=(0, 10))
        return b

    mkbtn("เปิดหน้าลงข่าว", lambda: webbrowser.open(url), primary=True)
    mkbtn("เปิดโฟลเดอร์เว็บ", lambda: os.startfile(site_root))

    def change_root():
        picked = ask_site_root()
        if picked:
            write_config({"site_root": picked})
            tk.messagebox.showinfo(APP_NAME, "บันทึกแล้ว — กรุณาปิดแล้วเปิดโปรแกรมใหม่อีกครั้ง")
    mkbtn("เปลี่ยนโฟลเดอร์เว็บ", change_root)

    tk.Label(win, text="บันทึกการทำงาน", bg="#FBF6EF", fg="#7a6a62",
             font=("Segoe UI", 9)).pack(anchor="w", padx=18)
    box = scrolledtext.ScrolledText(win, height=10, font=("Consolas", 9),
                                    bg="#ffffff", fg="#2B1B16", relief="flat",
                                    borderwidth=1, wrap="word")
    box.pack(fill="both", expand=True, padx=18, pady=(4, 16))
    box.configure(state="disabled")

    def pump():
        try:
            while True:
                line = LOG.get_nowait()
                box.configure(state="normal")
                box.insert("end", line + "\n")
                box.see("end")
                box.configure(state="disabled")
        except queue.Empty:
            pass
        win.after(250, pump)

    log("พร้อมใช้งานแล้ว — เปิดหน้าลงข่าวที่ %s" % url)
    log("ปิดหน้าต่างนี้เมื่อใช้งานเสร็จ (หน้าเว็บจะใช้งานไม่ได้หลังปิด)")
    pump()

    def on_close():
        httpd.shutdown()
        win.destroy()

    win.protocol("WM_DELETE_WINDOW", on_close)
    webbrowser.open(url)
    win.mainloop()
    return 0


if __name__ == "__main__":
    sys.exit(main())
