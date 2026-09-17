#!/usr/bin/env python3
"""
雲頂天宮 - 品牌化与中文深度定制补丁脚本
功能：
1. 替换标题为「雲頂天宮」并配置专属 Logo 图标
2. 将官方链接深度重定向至：
   - 前端主导航站：https://www.yun-ding.com/
   - TG 控制台：https://tg.yun-ding.com
3. 关闭烦人的新手向导 (oobe) 与遥测上报 (telemetry)
"""

import os
import sys

DATA_DIR = sys.argv[1] if len(sys.argv) > 1 else "./data"
CONSOLE_DIST = os.path.join(DATA_DIR, "node_modules/@koishijs/plugin-console/dist")
INDEX_HTML = os.path.join(CONSOLE_DIST, "index.html")
INDEX_JS = os.path.join(CONSOLE_DIST, "index.js")
CONFIG_YML = os.path.join(DATA_DIR, "koishi.yml")

def patch_index_html():
    if not os.path.exists(INDEX_HTML):
        print(f"[-] 未找到 {INDEX_HTML}，跳过 HTML 替换")
        return
    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        html = f.read()

    html = html.replace("<title>Koishi 控制台</title>", "<title>雲頂天宮</title>")
    html = html.replace('href="/logo.png"', 'href="/logo.svg" type="image/svg+xml"')

    with open(INDEX_HTML, "w", encoding="utf-8") as f:
        f.write(html)
    print("[+] index.html 标题与 Logo 替换完成")

def patch_index_js():
    if not os.path.exists(INDEX_JS):
        print(f"[-] 未找到 {INDEX_JS}，跳过 JS 替换")
        return
    with open(INDEX_JS, "r", encoding="utf-8") as f:
        js = f.read()

    # 替换主卡片文案
    js = js.replace(
        'docs:{title:"阅读文档",description:"开始阅读官方文档。官方文档里包含了你想要了解的全部内容。"}',
        'docs:{title:"前端主导航站",description:"点击直达 www.yun-ding.com 前端主导航站。"}'
    )
    js = js.replace(
        'forum:{title:"前往论坛",description:"前往论坛与其他用户交流。如果你遇到了问题，可以在这里寻求帮助。"}',
        'forum:{title:"TG 「雲頂天宮」控制台",description:"点击直达 tg.yun-ding.com Telegram 控制台。"}'
    )
    js = js.replace("开启你的 Koishi 之旅吧。", "开启你的雲頂天宮之旅吧。")
    js = js.replace("欢迎使用 Koishi", "欢迎来到雲頂天宮")

    # 替换卡片跳转外链
    js = js.replace('href:"https://koishi.chat"', 'href:"https://www.yun-ding.com/"')
    js = js.replace('href:"https://k.ilharp.cc"', 'href:"https://tg.yun-ding.com"')
    js = js.replace('href:"https://forum.koishi.chat"', 'href:"https://tg.yun-ding.com"')

    with open(INDEX_JS, "w", encoding="utf-8") as f:
        f.write(js)
    print("[+] index.js 导航卡片文案与链接替换完成")

def patch_config_yml():
    if not os.path.exists(CONFIG_YML):
        print(f"[-] 未找到 {CONFIG_YML}，跳过配置文件精简")
        return
    with open(CONFIG_YML, "r", encoding="utf-8") as f:
        yml = f.read()

    yml = yml.replace("oobe:0qs2qf: {}", "~oobe:0qs2qf: {}")
    yml = yml.replace("telemetry:sbre4p: {}", "~telemetry:sbre4p: {}")

    with open(CONFIG_YML, "w", encoding="utf-8") as f:
        f.write(yml)
    print("[+] koishi.yml 禁用弹窗规则注入完成")

if __name__ == "__main__":
    patch_index_html()
    patch_index_js()
    patch_config_yml()
    print("[*] 全部「雲頂天宮」专属补丁执行完毕！")
