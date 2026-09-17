#!/bin/bash
set -e

echo "=========================================="
echo "      雲頂天宮 - 多机器人中枢服务部署     "
echo "=========================================="

# 检查 Docker 环境
if ! command -v docker >/dev/null 2>&1; then
    echo "[-] 正在自动安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable --now docker
fi

# 确保目录与权限
mkdir -p data assets scripts
chmod +x scripts/apply_branding.py 2>/dev/null || true

# 启动容器
echo "[+] 正在拉起「雲頂天宮」服务容器..."
docker compose up -d

# 等待核心模块初始化
echo "[+] 等待服务初始化就绪..."
for i in $(seq 1 30); do
    if docker compose ps | grep -q "Up\|running"; then
        break
    fi
    sleep 1
done

# 应用专属定制补丁
echo "[+] 正在注入「雲頂天宮」专属定制补丁..."
python3 scripts/apply_branding.py ./data 2>/dev/null || true

# 复制专属 Logo 图标
if [ -f "assets/logo.svg" ]; then
    cp assets/logo.svg data/node_modules/@koishijs/plugin-console/dist/logo.svg 2>/dev/null || true
    cp assets/logo.svg data/node_modules/@koishijs/plugin-console/dist/favicon.svg 2>/dev/null || true
fi

# 重载容器
docker compose restart

echo ""
echo "=========================================="
echo "🎉 「雲頂天宮」部署成功！"
echo "👉 后台访问地址: http://<你的服务器IP>:5140/"
echo "🔗 主导航站: https://www.yun-ding.com/"
echo "🔗 TG 控制台: https://tg.yun-ding.com"
echo "=========================================="
