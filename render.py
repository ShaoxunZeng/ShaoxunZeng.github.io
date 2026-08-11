

# pip3 install pytest-playwright playwright
# /Users/wq/Library/Python/3.9/bin/playwright install chromium
# python -m http.server 8000 --bind 0.0.0.0

from playwright.sync_api import sync_playwright
import os
import re
from datetime import date

OUTPUT_HTML = "index.html"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    page.goto(f"http://localhost:8000/js_index.html", wait_until="networkidle")
    page.wait_for_timeout(5000)

    rendered_html = page.content()
    browser.close()

# 删除包含 "script.js" 的整行（基于字符串处理）
lines = rendered_html.splitlines()
filtered_lines = [line for line in lines if "script.js" not in line]

# 写入新的 HTML 文件
with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write("\n".join(filtered_lines))

print(f"save to {OUTPUT_HTML}")

# 更新 sitemap.xml 的 lastmod 为当前日期，便于搜索引擎识别更新
SITEMAP = "sitemap.xml"
today = date.today().isoformat()
if os.path.exists(SITEMAP):
    with open(SITEMAP, "r", encoding="utf-8") as f:
        sitemap_content = f.read()
    sitemap_content = re.sub(
        r"<lastmod>[^<]+</lastmod>",
        f"<lastmod>{today}</lastmod>",
        sitemap_content,
    )
    with open(SITEMAP, "w", encoding="utf-8") as f:
        f.write(sitemap_content)
    print(f"update {SITEMAP} lastmod to {today}")