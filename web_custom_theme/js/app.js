/**
 * 雲頂天宮 - 机器人智能总控台 核心逻辑引擎
 */

// 预置机器人数据集
const INITIAL_BOTS = [
  {
    id: 'bot-1',
    name: '雲頂天宮 · Telegram 主调度助手',
    platform: 'telegram',
    platformName: 'Telegram',
    model: 'DeepSeek-V3 / GPT-4o',
    status: 'online',
    token: '719283****:AAH...',
    avatar: '☁️',
    description: '负责 Telegram 私聊与群聊主通道的 7x24 小时自动问答、指令中转与工单派发。',
    todayQueries: 1420,
    tokensUsed: '84.5K',
    uptime: '99.98%'
  },
  {
    id: 'bot-2',
    name: '独角发卡商城 · 智能售前客服',
    platform: 'web',
    platformName: '网站网页客服',
    model: 'Claude 3.5 Sonnet',
    status: 'online',
    token: 'widget_yunding_sales_01',
    avatar: '💎',
    description: '嵌入在 yun-ding.com 商城右下角，为访客提供商品选型、节点购买指南及常见问题解答。',
    todayQueries: 2890,
    tokensUsed: '192.3K',
    uptime: '100%'
  },
  {
    id: 'bot-3',
    name: '全球社区 · Discord 联络官',
    platform: 'discord',
    platformName: 'Discord',
    model: 'Mistral Large',
    status: 'online',
    token: 'MTE5Mjkz****.G3...',
    avatar: '🌐',
    description: '服务于海外 Discord 频道的社群活跃、多语言翻译及产品公告自动同步。',
    todayQueries: 630,
    tokensUsed: '42.1K',
    uptime: '99.9%'
  },
  {
    id: 'bot-4',
    name: '企业微信 · 内部工单告警机器人',
    platform: 'wx',
    platformName: '企业微信群',
    model: 'ChatGPT (gpt-4o)',
    status: 'online',
    token: 'https://qyapi.weixin.qq.com/...',
    avatar: '🛡️',
    description: '监控服务器宕机、支付异常与关键日志，向企业微信群推送即时预警卡片。',
    todayQueries: 120,
    tokensUsed: '11.8K',
    uptime: '100%'
  }
];

// 23 个应用市场完整数据
const MARKET_APPS = [
  // 1. API 直连
  { id: 'app-tg', cat: 'api', name: 'Telegram 机器人', desc: '利用 Telegram Bot API 进行私聊咨询、群聊管家和频道广播。', icon: '✈️', color: '#2f80ed' },
  { id: 'app-ding', cat: 'api', name: '钉钉机器人', desc: '基于阿里钉钉开放平台，支持群消息拦截与交互式卡片推送。', icon: '⚡', color: '#007fff' },
  { id: 'app-wxwork', cat: 'api', name: '企微群机器人', desc: '通过 Webhook 高速将 AI 问答能力与业务通知投递到企业微信群。', icon: '💬', color: '#27ae60' },
  { id: 'app-mpwx', cat: 'api', name: '微信公众号', desc: '粉丝在公众号后台发送消息，AI 自动结合知识库提供秒级回复。', icon: '📢', color: '#07c160' },
  { id: 'app-wa-biz', cat: 'api', name: 'WhatsApp 企业版', desc: '通过 WhatsApp Business Platform 触达全球海量海外客户。', icon: '📱', color: '#25d366' },
  { id: 'app-line', cat: 'api', name: 'Line 官方号', desc: '利用 Line Messaging API 覆盖日韩与东南亚地区核心用户群。', icon: '🟢', color: '#06c755' },
  { id: 'app-discord', cat: 'api', name: 'Discord Bot', desc: '构建 Web3 与极客社区，支持斜杠命令(/)与多角色权限分流。', icon: '👾', color: '#5865f2' },
  { id: 'app-email', cat: 'api', name: '企业邮箱助手', desc: 'IMAP/SMTP 双向连接，自动阅读询盘邮件并拟写专业答复。', icon: '✉️', color: '#4a90e2' },
  { id: 'app-douyin', cat: 'api', name: '抖音企业号', desc: '抖音企业号扫码授权，实现私信线索自动承接与留资引导。', icon: '🎵', color: '#fe2c55' },
  { id: 'app-messenger', cat: 'api', name: 'FB Messenger', desc: '绑定 Meta 官方主页，24 小时承接海外社交媒体咨询流量。', icon: '💙', color: '#0084ff' },
  { id: 'app-instagram', cat: 'api', name: 'Instagram Direct', desc: '通过 IG 官方 Graph API 实现快拍互动与私信智能应答。', icon: '📸', color: '#e1306c' },
  { id: 'app-social', cat: 'api', name: '海外社媒全渠道矩阵', desc: '一处编辑，多平台同步分发（X/Twitter、LinkedIn、TikTok）。', icon: '🌐', color: '#00c5c8' },

  // 2. 自主集成
  { id: 'app-web-page', cat: 'self', name: '网页全屏客服', desc: '独立 H5/PC 专属客服页面，可直接嵌入微信菜单或小程序。', icon: '💻', color: '#00c5c8' },
  { id: 'app-web-popup', cat: 'self', name: '网站弹窗客服 (推荐)', desc: '一行 JS 代码嵌入任意独立站，右下角悬浮智能气泡。', icon: '✨', color: '#d8b77a' },
  { id: 'app-internal', cat: 'self', name: '内部知识库面板', desc: '企业员工内部访问的专属知识查询与办事中台。', icon: '📚', color: '#9b51e0' },
  { id: 'app-robot-hardware', cat: 'self', name: '智能终端网关', desc: '将 AI 对话能力下发到展厅、前台实体迎宾终端设备。', icon: '🤖', color: '#f2994a' },

  // 3. 插件集成
  { id: 'app-shopify', cat: 'plugin', name: 'Shopify 独立站插件', desc: '一键将 AI 导购与售后客服挂载到 Shopify 跨境网店。', icon: '🛍️', color: '#95bf47' },
  { id: 'app-wordpress', cat: 'plugin', name: 'WordPress / WooCommerce', desc: '为 WP 博客与外贸独立站注入强大的自学习知识库。', icon: '🌐', color: '#21759b' },
  { id: 'app-shoplazza', cat: 'plugin', name: '店匠 Shoplazza', desc: '无缝接入店匠海外独立站，大幅降低海外跳出率。', icon: '🛒', color: '#ff6600' },
  { id: 'app-shopline', cat: 'plugin', name: 'SHOPLINE 插件', desc: '覆盖亚洲与全球 DTC 品牌的智能出海客服助手。', icon: '📦', color: '#0066cc' },

  // 4. RPA 手机
  { id: 'app-rpa-wx', cat: 'rpa', name: '微信个人号 (RPA)', desc: '真机无障碍自动化辅助，安全承接个人微信私域流量。', icon: '📱', color: '#07c160' },
  { id: 'app-rpa-work', cat: 'rpa', name: '企业微信个人版 (RPA)', desc: '支持手机端企微客户自动通过、标签分类与欢迎语。', icon: '🏢', color: '#27ae60' },
  { id: 'app-rpa-wa', cat: 'rpa', name: 'WA 个人号 (扫码)', desc: '原生个人版 WhatsApp 扫码托管，适合小规模矩阵。', icon: '💬', color: '#25d366' }
];

// 初始化本地状态
let state = {
  bots: JSON.parse(localStorage.getItem('yunding_bots')) || INITIAL_BOTS,
  activeChatBotId: 'bot-1',
  marketFilter: 'all'
};

function saveBots() {
  localStorage.setItem('yunding_bots', JSON.stringify(state.bots));
  renderBotCards();
  renderStats();
  renderChatBotList();
}

// 渲染总数据指标
function renderStats() {
  const total = state.bots.length;
  const online = state.bots.filter(b => b.status === 'online').length;
  document.getElementById('stat-total-bots').textContent = total;
  document.getElementById('stat-online-bots').textContent = online;
  document.getElementById('header-online-count').textContent = `${online} 在线 / 共 ${total} 个`;
}

// 渲染机器人卡片网格
function renderBotCards() {
  const container = document.getElementById('bots-grid-container');
  container.innerHTML = '';

  // 添加新机器人卡片
  const addCard = document.createElement('div');
  addCard.className = 'add-bot-card';
  addCard.id = 'btn-open-create-modal';
  addCard.innerHTML = `
    <div class="add-circle">+</div>
    <h4>创建新机器人</h4>
    <p>接入 Telegram、微信、Discord 或独立站客服</p>
  `;
  addCard.onclick = () => openModal();
  container.appendChild(addCard);

  // 循环渲染已有机器人
  state.bots.forEach(bot => {
    const card = document.createElement('div');
    card.className = 'bot-card';
    card.id = `card-${bot.id}`;

    const platformClass = `platform-${bot.platform}`;
    const statusClass = bot.status === 'online' ? 'online' : 'paused';
    const statusText = bot.status === 'online' ? '运行中' : '已暂停';

    card.innerHTML = `
      <div class="bot-card-top">
        <div class="bot-avatar">${bot.avatar}</div>
        <div class="bot-meta">
          <h3>${bot.name}</h3>
          <span class="platform-pill ${platformClass}">${bot.platformName} · ${bot.model}</span>
        </div>
      </div>
      <div class="bot-card-body">
        <p class="bot-desc">${bot.description}</p>
        <div class="bot-stats-row">
          <span>今日对话: <b>${bot.todayQueries}</b></span>
          <span>消耗 Token: <b>${bot.tokensUsed}</b></span>
          <span>可用率: <b style="color: var(--accent-green)">${bot.uptime}</b></span>
        </div>
      </div>
      <div class="bot-card-footer">
        <div class="status-badge ${statusClass}">
          <span class="pulse-dot" style="${bot.status !== 'online' ? 'background: #666; box-shadow: none; animation: none;' : ''}"></span>
          <span>${statusText}</span>
        </div>
        <div class="card-actions">
          <button class="btn-icon" title="在线调试对话" onclick="openChatWithBot('${bot.id}')">💬</button>
          <button class="btn-icon" title="暂停/启动" onclick="toggleBotStatus('${bot.id}')">⏯️</button>
          <button class="btn-icon" title="删除机器人" onclick="deleteBot('${bot.id}')">🗑️</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// 切换机器人运行状态
window.toggleBotStatus = function(botId) {
  const bot = state.bots.find(b => b.id === botId);
  if (bot) {
    bot.status = bot.status === 'online' ? 'paused' : 'online';
    saveBots();
  }
};

// 删除机器人
window.deleteBot = function(botId) {
  if (confirm('确定要移除该机器人配置吗？')) {
    state.bots = state.bots.filter(b => b.id !== botId);
    saveBots();
  }
};

// 渲染应用市场
function renderMarket() {
  const container = document.getElementById('market-grid-container');
  container.innerHTML = '';

  const filtered = state.marketFilter === 'all' 
    ? MARKET_APPS 
    : MARKET_APPS.filter(a => a.cat === state.marketFilter);

  filtered.forEach(app => {
    const card = document.createElement('div');
    card.className = 'market-item-card';
    card.innerHTML = `
      <div>
        <div class="market-icon-box" style="background: ${app.color}15; color: ${app.color};">
          ${app.icon}
        </div>
        <h4 class="market-item-title">${app.name}</h4>
        <p class="market-item-desc">${app.desc}</p>
      </div>
      <button class="btn-outline-install" onclick="quickInstallApp('${app.name}', '${app.cat}')">
        + 立即接入配置
      </button>
    `;
    container.appendChild(card);
  });
}

// 点击应用市场的快捷接入
window.quickInstallApp = function(appName, cat) {
  openModal();
  document.getElementById('input-bot-name').value = `雲頂天宮 · ${appName}`;
  if (appName.includes('Telegram')) {
    document.getElementById('select-platform').value = 'telegram';
  } else if (appName.includes('微信')) {
    document.getElementById('select-platform').value = 'wx';
  } else if (appName.includes('Discord')) {
    document.getElementById('select-platform').value = 'discord';
  } else {
    document.getElementById('select-platform').value = 'web';
  }
};

// 渲染在线调试界面的机器人列表
function renderChatBotList() {
  const list = document.getElementById('chat-bot-list');
  list.innerHTML = '';
  state.bots.forEach(bot => {
    const li = document.createElement('li');
    li.className = `chat-bot-item ${bot.id === state.activeChatBotId ? 'active' : ''}`;
    li.innerHTML = `
      <span>${bot.avatar}</span>
      <div style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <div style="font-size: 0.85rem; font-weight: 700;">${bot.name}</div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">${bot.platformName}</div>
      </div>
    `;
    li.onclick = () => {
      state.activeChatBotId = bot.id;
      renderChatBotList();
      updateChatHeader();
    };
    list.appendChild(li);
  });
}

function updateChatHeader() {
  const bot = state.bots.find(b => b.id === state.activeChatBotId) || state.bots[0];
  if (bot) {
    document.getElementById('chat-active-title').textContent = `${bot.avatar} ${bot.name}`;
    document.getElementById('chat-active-desc').textContent = `${bot.platformName} · 引擎: ${bot.model}`;
  }
}

// 打开特定机器人聊天
window.openChatWithBot = function(botId) {
  state.activeChatBotId = botId;
  switchPage('chat');
  renderChatBotList();
  updateChatHeader();
};

// 发送调试消息
window.handleSendMessage = function() {
  const input = document.getElementById('chat-user-input');
  const text = input.value.trim();
  if (!text) return;

  const messagesBox = document.getElementById('chat-messages-container');

  // 用户气泡
  const userMsg = document.createElement('div');
  userMsg.className = 'msg-bubble msg-user';
  userMsg.textContent = text;
  messagesBox.appendChild(userMsg);
  input.value = '';
  messagesBox.scrollTop = messagesBox.scrollHeight;

  const activeBot = state.bots.find(b => b.id === state.activeChatBotId) || state.bots[0];

  // 模拟机器人实时思考与回复
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'msg-bubble msg-bot';
    botMsg.innerHTML = `<b>${activeBot.name}</b>: 已收到您的指令「${text}」。\n当前正在通过 <b>${activeBot.model}</b> 为您处理，底座运行在 日本 AWS (18.176.182.71) 调度中枢。`;
    messagesBox.appendChild(botMsg);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }, 600);
};

// 页面导航切换
function switchPage(pageKey) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.page-container').forEach(el => el.classList.remove('active'));

  const navBtn = document.getElementById(`nav-${pageKey}`);
  const pageContainer = document.getElementById(`page-${pageKey}`);

  if (navBtn) navBtn.classList.add('active');
  if (pageContainer) pageContainer.classList.add('active');

  if (pageKey === 'chat') {
    renderChatBotList();
    updateChatHeader();
  }
}

// 模态窗控制
function openModal() {
  document.getElementById('create-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('create-modal').classList.remove('open');
}

// 创建新机器人表单提交
window.handleCreateBot = function(e) {
  e.preventDefault();
  const name = document.getElementById('input-bot-name').value;
  const platform = document.getElementById('select-platform').value;
  const model = document.getElementById('select-model').value;
  const token = document.getElementById('input-token').value;
  const desc = document.getElementById('input-desc').value || '雲頂天宮专属智能助理，提供高可用实时应答服务。';

  const platformMap = {
    telegram: { name: 'Telegram', avatar: '✈️' },
    web: { name: '网页客服', avatar: '💎' },
    discord: { name: 'Discord', avatar: '👾' },
    wx: { name: '企业微信群', avatar: '💬' }
  };

  const newBot = {
    id: 'bot-' + Date.now(),
    name,
    platform,
    platformName: platformMap[platform].name,
    model,
    status: 'online',
    token,
    avatar: platformMap[platform].avatar,
    description: desc,
    todayQueries: 0,
    tokensUsed: '0K',
    uptime: '100%'
  };

  state.bots.unshift(newBot);
  saveBots();
  closeModal();
  alert('🎉 恭喜！新机器人「' + name + '」已成功创建并同步上线！');
};

// 复制嵌入代码
window.copyWidgetCode = function() {
  const code = `<script src="http://18.176.182.71:5140/widget.js" data-bot="yunding_master" async></script>`;
  navigator.clipboard.writeText(code).then(() => {
    alert('已成功复制嵌入代码！直接粘贴到 https://yun-ding.com/ 任何页面的 </body> 之前即可。');
  });
};

// DOM 加载完成初始化
document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  renderBotCards();
  renderMarket();
  renderChatBotList();
  updateChatHeader();

  // 绑定市场选项卡切换
  document.querySelectorAll('.market-tab').forEach(tab => {
    tab.onclick = function() {
      document.querySelectorAll('.market-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      state.marketFilter = this.dataset.cat;
      renderMarket();
    };
  });

  // 回车发送消息
  document.getElementById('chat-user-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSendMessage();
  });
});
