import os
import sys
import json
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MOCK_DIR = os.path.join(BASE_DIR, 'api_mock')

with open(os.path.join(MOCK_DIR, 'pro_index.json'), 'r', encoding='utf-8') as f:
    INDEX_DATA = f.read().encode('utf-8')

with open(os.path.join(MOCK_DIR, 'pro_app.json'), 'r', encoding='utf-8') as f:
    APP_DATA = f.read().encode('utf-8')

SUCCESS_RESP = json.dumps({"status": 200, "message": "成功", "data": []}).encode('utf-8')
INSTALL_SUCCESS = json.dumps({"status": 200, "message": "配置保存成功", "data": {"status": 1}}).encode('utf-8')
BENEFITS_DATA = json.dumps({
    "status": 200,
    "message": "成功",
    "data": {
        "id": 88888,
        "username": "雲頂天宮",
        "name": "雲頂天宮",
        "company_name": "雲頂天宮",
        "mobile": "18888888888",
        "role_name": "超级管理员",
        "is_admin": 1,
        "level": "SVIP 至尊商业版",
        "company_level_id": 4,
        "electric_power": "999,999",
        "end_at": "永久有效",
        "api_key": "sk-yunding-master-tiangong-888888",
        "describe": "雲頂天宮 · 全球多渠道智能机器人调度中枢",
        "list": [
            {"level": 1, "title": "基础版", "price": "0", "describe": "轻量体验"},
            {"level": 2, "title": "专业版", "price": "99", "describe": "团队协作"},
            {"level": 3, "title": "企业版", "price": "299", "describe": "多渠道矩阵"},
            {"level": 4, "title": "SVIP 至尊版", "price": "永久", "describe": "终身独立集群"}
        ]
    }
}).encode('utf-8')

INDEX_HTML_PATH = os.path.join(BASE_DIR, 'index.html')

class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'device, token, Content-Type, Authorization')
        self.end_headers()



    def do_GET(self):
        parsed = urlparse(self.path)
        p = parsed.path

        # 0. 静态资源路径前缀归一化（处理 SPA 相对路径请求如 /dialogue/js/...）
        for prefix in ['/js/', '/css/', '/fonts/', '/img/', '/upload/', '/static/', '/config/', '/favicon.ico']:
            if prefix in p and not p.startswith(prefix):
                p = p[p.find(prefix):]
                self.path = p
                break

        # 1. API 响应处理
        if p == '/pro/index':
            return self._send_json(INDEX_DATA)
        elif p == '/pro/app':
            return self._send_json(APP_DATA)
        elif p == '/pro/upgrade/benefits':
            return self._send_json(BENEFITS_DATA)
        elif p.startswith('/pro/'):
            return self._send_json(SUCCESS_RESP)

        # 2. SPA 前端路由拦截（凡是非静态资产文件均回退至 index.html）
        static_exts = ('.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.ico', '.json', '.html')
        if not any(p.lower().endswith(ext) for ext in static_exts):
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            with open(INDEX_HTML_PATH, 'rb') as f:
                self.wfile.write(f.read())
            return

        return super().do_GET()

    def do_HEAD(self):
        return self.do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        p = parsed.path
        if p == '/pro/debug_log':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode('utf-8', errors='ignore')
            print(f"[CLIENT LOG] {body}", flush=True)
            with open(os.path.join(BASE_DIR, 'debug.log'), 'a', encoding='utf-8') as f:
                f.write(body + '\n')
            return self._send_json(SUCCESS_RESP)

        if p == '/pro/app/install':
            return self._send_json(INSTALL_SUCCESS)
        return self._send_json(SUCCESS_RESP)

    def _send_json(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'device, token, Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(data)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5150
    server = HTTPServer(('0.0.0.0', port), AppHandler)
    print(f"雲頂天宮 · 超迹AI 1:1复刻服务启动在 0.0.0.0:{port}...")
    server.serve_forever()
