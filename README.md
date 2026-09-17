# 雲頂天宮

> 高性能、多平台机器人中枢与自动化调度框架。

---

## 🌟 核心特性

- **多平台统一接入**：单个控制中心同时挂载 **Telegram、Discord、微信、QQ、飞书、钉钉** 等主流通讯软件。
- **高并发轻量运行**：Node.js 单线程异步事件总线设计，单台 4G 内存轻量服务器可稳定驱动 **50+ 独立机器人实例**。
- **原生 AI 模型生态**：无缝对接 OpenAI (ChatGPT)、Anthropic (Claude)、DeepSeek、Mistral 等主流大语言模型。
- **专属视觉与中枢联动**：
  - 前端主导航站直达：[https://www.yun-ding.com/](https://www.yun-ding.com/)
  - TG 机器人控制中心联动：[https://tg.yun-ding.com](https://tg.yun-ding.com)
- **开箱即用容器化**：全套 Docker Compose 编排，支持在 AWS、Vultr、Oracle 等任何主流 Linux 节点上一键启停。

---

## 🚀 快速启动

### 方式一：一键脚本部署 (推荐)

在 Linux 服务器上克隆本仓库并执行部署：

```bash
git clone https://github.com/Tian-Gong-W/YundingTiangong.git
cd YundingTiangong
chmod +x deploy.sh
./deploy.sh
```

### 方式二：Docker Compose 手动启动

```bash
# 启动容器服务
docker compose up -d

# 注入专属品牌与导航链接补丁
python3 scripts/apply_branding.py ./data

# 重启容器使其生效
docker compose restart
```

---

## 🖥️ 访问与管理

* **中控台入口**：`http://<服务器IP>:5140/`
* **默认功能**：
  * **主导航卡片**：直接跳转至 [前端主导航站](https://www.yun-ding.com/)
  * **TG 控制台卡片**：直达 [TG 「雲頂天宮」控制台](https://tg.yun-ding.com)
  * **插件市场**：支持一键安装各平台 Adapter 协议适配器与各类业务功能插件。

---

## 📋 50+ 机器人并发推荐配置

| 规模 | 推荐 CPU | 推荐内存 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **1 ~ 15 个机器人** | 1 核 vCPU | 1 GB ~ 2 GB | 个人助手、日常自动问答、告警转发 |
| **15 ~ 50 个机器人** | 2 核 vCPU | 4 GB | 社群规模化运营、多平台客服矩阵、AI 知识库分发 |
| **50 ~ 100+ 机器人**| 4 核 vCPU | 8 GB | 大型自动化集群、高频 Puppeteer 网页渲染与画图 |

---

## 🔒 安全与生产建议

1. **反向代理与 HTTPS**：
   建议搭配 Nginx 或 Caddy 将 `5140` 端口反向代理并配置独立域名及 SSL 证书。
2. **数据库选型**：
   机器人数量超过 30 个且群消息密集时，建议在控制台将存储从默认的 SQLite 切换为 PostgreSQL / MySQL，以获取更佳的并发吞吐能力。

---

## 📄 版权与协议

本项目基于 MIT 协议进行深度定制与专属优化。
