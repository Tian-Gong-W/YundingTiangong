/**
 * 雲頂天宮 - 独立站悬浮客服组件 (Standalone Embeddable Widget)
 * 可直接通过 <script src=".../widget.js" data-bot="yunding_master"></script> 嵌入任意网站
 */
(function() {
  if (window.__YUNDING_WIDGET_LOADED__) return;
  window.__YUNDING_WIDGET_LOADED__ = true;

  const CONFIG = {
    title: '雲頂天宮 · 智能客服',
    subTitle: '7x24小时 在线导购与技术支援',
    avatar: '💎',
    accentColor: '#00c5c8',
    goldColor: '#d8b77a',
    welcomeMsg: '您好！欢迎光临「雲頂天宮」！我是您的专属智能顾问。请问有什么可以协助您？',
    quickQuestions: [
      '⚡ 节点订阅如何购买与开通？',
      '📱 支持哪些客户端与翻墙协议？',
      '💳 付款后没有收到卡密怎么办？',
      '👨‍💻 如何接入人工客服支持？'
    ]
  };

  // 动态注入样式
  const style = document.createElement('style');
  style.textContent = `
    .yd-widget-bubble {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00c5c8 0%, #00888a 100%);
      box-shadow: 0 8px 25px rgba(0, 197, 200, 0.4), 0 0 15px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      z-index: 999999;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }
    .yd-widget-bubble:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 12px 30px rgba(0, 197, 200, 0.6);
    }
    .yd-widget-bubble-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background: #00bb7f;
      border-radius: 50%;
      border: 2px solid #041017;
      animation: yd-pulse 2s infinite;
    }
    @keyframes yd-pulse {
      0% { box-shadow: 0 0 0 0 rgba(0, 187, 127, 0.7); }
      70% { box-shadow: 0 0 0 6px rgba(0, 187, 127, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 187, 127, 0); }
    }
    .yd-chat-window {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 380px;
      height: 540px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 120px);
      background: #061620;
      border: 1px solid rgba(0, 197, 200, 0.3);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 197, 200, 0.15);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px) scale(0.95);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .yd-chat-window.yd-open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }
    .yd-chat-header {
      padding: 16px 18px;
      background: rgba(8, 28, 39, 0.95);
      border-bottom: 1px solid rgba(0, 197, 200, 0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .yd-header-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .yd-header-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(0, 197, 200, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .yd-header-text h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }
    .yd-header-text p {
      margin: 2px 0 0;
      font-size: 11px;
      color: #8aa4af;
    }
    .yd-header-close {
      background: none;
      border: none;
      color: #8aa4af;
      font-size: 18px;
      cursor: pointer;
      padding: 4px;
    }
    .yd-header-close:hover {
      color: #fff;
    }
    .yd-chat-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #041017;
    }
    .yd-msg-bubble {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
      word-break: break-word;
    }
    .yd-msg-bot {
      align-self: flex-start;
      background: rgba(8, 28, 39, 0.85);
      border: 1px solid rgba(0, 197, 200, 0.2);
      color: #f0f7f8;
    }
    .yd-msg-user {
      align-self: flex-end;
      background: linear-gradient(135deg, #00c5c8 0%, #009396 100%);
      color: #041017;
      font-weight: 600;
    }
    .yd-quick-tags {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 4px;
    }
    .yd-quick-btn {
      text-align: left;
      background: rgba(0, 197, 200, 0.08);
      border: 1px solid rgba(0, 197, 200, 0.2);
      color: #00c5c8;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .yd-quick-btn:hover {
      background: rgba(0, 197, 200, 0.2);
      border-color: #00c5c8;
    }
    .yd-chat-footer {
      padding: 12px 14px;
      background: rgba(8, 28, 39, 0.95);
      border-top: 1px solid rgba(0, 197, 200, 0.15);
      display: flex;
      gap: 8px;
    }
    .yd-chat-input {
      flex: 1;
      background: #061924;
      border: 1px solid rgba(0, 197, 200, 0.2);
      border-radius: 8px;
      padding: 8px 12px;
      color: #fff;
      font-size: 13px;
      outline: none;
    }
    .yd-chat-input:focus {
      border-color: #00c5c8;
    }
    .yd-chat-send {
      background: #00c5c8;
      color: #041017;
      border: none;
      border-radius: 8px;
      padding: 0 14px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .yd-chat-send:hover {
      background: #1ae5e8;
    }
  `;
  document.head.appendChild(style);

  // 创建 DOM 节点
  const bubble = document.createElement('div');
  bubble.className = 'yd-widget-bubble';
  bubble.innerHTML = `${CONFIG.avatar}<span class="yd-widget-bubble-badge"></span>`;

  const chatWin = document.createElement('div');
  chatWin.className = 'yd-chat-window';
  chatWin.innerHTML = `
    <div class="yd-chat-header">
      <div class="yd-header-info">
        <div class="yd-header-avatar">${CONFIG.avatar}</div>
        <div class="yd-header-text">
          <h3>${CONFIG.title}</h3>
          <p>${CONFIG.subTitle}</p>
        </div>
      </div>
      <button class="yd-header-close" id="yd-btn-close">✕</button>
    </div>
    <div class="yd-chat-body" id="yd-chat-body">
      <div class="yd-msg-bubble yd-msg-bot">
        ${CONFIG.welcomeMsg}
      </div>
      <div class="yd-quick-tags" id="yd-quick-tags">
        ${CONFIG.quickQuestions.map(q => `<button class="yd-quick-btn" data-q="${q}">${q}</button>`).join('')}
      </div>
    </div>
    <div class="yd-chat-footer">
      <input type="text" class="yd-chat-input" id="yd-input-msg" placeholder="请输入您的问题..." />
      <button class="yd-chat-send" id="yd-btn-send">发送</button>
    </div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(chatWin);

  // 状态与事件绑定
  let isOpen = false;
  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      chatWin.classList.add('yd-open');
      document.getElementById('yd-input-msg').focus();
    } else {
      chatWin.classList.remove('yd-open');
    }
  }

  bubble.onclick = toggleChat;
  document.getElementById('yd-btn-close').onclick = toggleChat;

  const chatBody = document.getElementById('yd-chat-body');
  const inputEl = document.getElementById('yd-input-msg');
  const sendBtn = document.getElementById('yd-btn-send');

  function appendMessage(text, isUser) {
    const msg = document.createElement('div');
    msg.className = `yd-msg-bubble ${isUser ? 'yd-msg-user' : 'yd-msg-bot'}`;
    msg.innerHTML = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function handleSend(text) {
    const q = text || inputEl.value.trim();
    if (!q) return;

    appendMessage(q, true);
    if (!text) inputEl.value = '';

    // 智能应答规则库
    setTimeout(() => {
      let reply = `已收到您的咨询「${q}」。雲頂天宮客服集群正在为您服务。`;
      if (q.includes('购买') || q.includes('开通')) {
        reply = `您可以直接前往 <b>yun-ding.com</b> 官方发卡商城选购心仪的套餐，系统支持支付宝/微信即时到账，支付成功后卡密秒级推送。`;
      } else if (q.includes('客户端') || q.includes('协议')) {
        reply = `雲頂天宮全面支持 Clash, v2rayN, Shadowrocket (小火箭), Surge, Loon 等主流客户端，节点支持 VLESS / Trojan / Hysteria2 / Shadowsocks 等高强度抗封锁协议。`;
      } else if (q.includes('卡密') || q.includes('付款')) {
        reply = `若付款后页面未自动跳转，您可在商城顶部点击【订单查询】，输入您的查询密码或联系 TG 在线客服进行极速人工补单。`;
      } else if (q.includes('人工')) {
        reply = `如需人工协助，请随时点击左侧 Telegram 官方客服链接：<a href="https://t.me/yunding_support" target="_blank" style="color: #00c5c8; font-weight: bold;">@yunding_support</a>，人工客服将在 3 分钟内介入。`;
      }
      appendMessage(reply, false);
    }, 500);
  }

  sendBtn.onclick = () => handleSend();
  inputEl.onkeydown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // 快捷问题点击
  document.getElementById('yd-quick-tags').onclick = (e) => {
    if (e.target.classList.contains('yd-quick-btn')) {
      const q = e.target.getAttribute('data-q');
      handleSend(q);
    }
  };
})();
