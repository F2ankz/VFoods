@echo off
REM ─────────────────────────────────────────────────────────────
REM  สร้างไฟล์ VFoods-News.exe ใหม่
REM  ต้องมี Python 3 ก่อน  แล้วดับเบิลคลิกไฟล์นี้
REM ─────────────────────────────────────────────────────────────
cd /d "%~dp0"

echo == ติดตั้ง PyInstaller (ถ้ายังไม่มี) ==
python -m pip install --quiet --upgrade pyinstaller pillow || goto :err

echo == สร้างไอคอนจากโลโก้ ==
python -c "from PIL import Image; im=Image.open('../../img/logo-vfoods.png').convert('RGBA'); s=max(im.size); c=Image.new('RGBA',(s,s),(0,0,0,0)); c.paste(im,((s-im.width)//2,(s-im.height)//2),im); c.save('vfoods.ico',sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])" || goto :err

echo == build ==
python -m PyInstaller --noconfirm --onefile --windowed ^
  --name "VFoods-News" --icon vfoods.ico --add-data "vfoods.ico;." ^
  vfoods_news.py || goto :err

echo == คัดลอกไปไว้ที่โฟลเดอร์เว็บ ==
copy /y "dist\VFoods-News.exe" "..\..\VFoods-News.exe" || goto :err

echo.
echo เสร็จแล้ว  ไฟล์อยู่ที่  %~dp0..\..\VFoods-News.exe
pause
exit /b 0

:err
echo.
echo *** build ไม่สำเร็จ ***
pause
exit /b 1
