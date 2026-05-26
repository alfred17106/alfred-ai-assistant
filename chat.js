const AlfredAI = {
  isOpen: false,
  isTyping: false,
  history: [],

  init() {
    this.createWidget();
    this.bindEvents();
    setTimeout(() => this.showWelcome(), 1000);
  },

  createWidget() {
    const widget = document.createElement('div');
    widget.id = 'alfred-ai-widget';
    widget.innerHTML = `
      <div id="aai-btn" title="Parler avec Alfred AI">
        <div class="aai-btn-inner">
          <span class="aai-btn-icon">💬</span>
          <span class="aai-btn-icon aai-btn-close" style="display:none;">✕</span>
        </div>
        <div class="aai-pulse"></div>
        <div class="aai-badge">IA</div>
      </div>
      <div id="aai-window" style="display:none;">
        <div id="aai-header">
          <div class="aai-header-left">
            <div class="aai-avatar">AE</div>
            <div class="aai-header-info">
              <div class="aai-name">Alfred AI</div>
              <div class="aai-status"><span class="aai-dot"></span>En ligne</div>
            </div>
          </div>
          <button class="aai-close-btn" id="aai-close">✕</button>
        </div>
        <div id="aai-messages"></div>
        <div id="aai-input-zone">
          <div class="aai-input-wrap">
            <input type="text" id="aai-input" placeholder="Posez votre question..." maxlength="500" autocomplete="off"/>
            <button id="aai-send">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div class="aai-footer-text">Propulsé par Alfred AI × Gemini</div>
        </div>
      </div>
    `;
    document.body.appendChild(widget);
  },

  bindEvents() {
    document.getElementById('aai-btn').addEventListener('click', () => this.toggle());
    document.getElementById('aai-close').addEventListener('click', () => this.close());
    document.getElementById('aai-send').addEventListener('click', () => this.send());
    document.getElementById('aai-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    });
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    this.isOpen = true;
    const win = document.getElementById('aai-window');
    const btn = document.getElementById('aai-btn');
    win.style.display = 'flex';
    win.style.flexDirection = 'column';
    setTimeout(() => win.classList.add('aai-open'), 10);
    btn.classList.add('aai-active');
    document.querySelector('.aai-btn-icon').style.display = 'none';
    document.querySelector('.aai-btn-close').style.display = 'block';
    document.getElementById('aai-input').focus();
  },

  close() {
    this.isOpen = false;
    const win = document.getElementById('aai-window');
    const btn = document.getElementById('aai-btn');
    win.classList.remove('aai-open');
    btn.classList.remove('aai-active');
    document.querySelector('.aai-btn-icon').style.display = 'block';
    document.querySelector('.aai-btn-close').style.display = 'none';
    setTimeout(() => { win.style.display = 'none'; }, 300);
  },

  showWelcome() {
    this.addMessage('bot', 'Bonjour ! 👋 Je suis <strong>Alfred AI</strong>, l\'assistant personnel d\'Alfred Mbondo Céleste.<br><br>Je peux vous renseigner sur ses <strong>services</strong>, ses <strong>projets</strong> ou vous aider à le <strong>contacter</strong>. Comment puis-je vous aider ?');
    this.showSuggestions([
      '🌐 Ses services',
      '💼 Ses projets',
      '📧 Le contacter',
      '🤖 Ses compétences IA'
    ]);
  },

  showSuggestions(suggestions) {
    const msgs = document.getElementById('aai-messages');
    const div = document.createElement('div');
    div.className = 'aai-suggestions';
    div.innerHTML = suggestions.map(s =>
      `<button class="aai-suggestion" onclick="AlfredAI.sendSuggestion('${s}')">${s}</button>`
    ).join('');
    msgs.appendChild(div);
    this.scrollBottom();
  },

  sendSuggestion(text) {
    document.querySelectorAll('.aai-suggestions').forEach(el => el.remove());
    this.sendMessage(text);
  },

  send() {
    const input = document.getElementById('aai-input');
    const msg = input.value.trim();
    if (!msg || this.isTyping) return;
    input.value = '';
    document.querySelectorAll('.aai-suggestions').forEach(el => el.remove());
    this.sendMessage(msg);
  },

  sendMessage(msg) {
    this.addMessage('user', msg);
    this.showTyping();
    this.history.push({ role: 'user', content: msg });

    fetch('api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, history: this.history.slice(-6) })
    })
    .then(r => r.json())
    .then(data => {
      this.hideTyping();
      if (data.reply) {
        this.history.push({ role: 'model', content: data.reply });
        this.typeMessage(data.reply);
      } else {
        this.addMessage('bot', 'Désolé, une erreur est survenue. Contactez Alfred directement : <a href="mailto:alfred@eamc.fr">alfred@eamc.fr</a>');
      }
    })
    .catch(() => {
      this.hideTyping();
      this.addMessage('bot', 'Connexion impossible. Contactez Alfred : <a href="mailto:alfred@eamc.fr">alfred@eamc.fr</a>');
    });
  },

  typeMessage(text) {
    this.isTyping = true;
    const msgs = document.getElementById('aai-messages');
    const bubble = document.createElement('div');
    bubble.className = 'aai-msg aai-bot';
    bubble.innerHTML = '<div class="aai-bubble"></div>';
    msgs.appendChild(bubble);
    this.scrollBottom();

    const content = bubble.querySelector('.aai-bubble');
    const clean = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    let i = 0;
    const chars = clean.split('');
    const interval = setInterval(() => {
      if (i < chars.length) {
        content.innerHTML = clean.substring(0, i + 1);
        i++;
        this.scrollBottom();
      } else {
        clearInterval(interval);
        this.isTyping = false;
      }
    }, 12);
  },

  addMessage(type, text) {
    const msgs = document.getElementById('aai-messages');
    const div = document.createElement('div');
    div.className = `aai-msg aai-${type}`;
    div.innerHTML = `<div class="aai-bubble">${text}</div>`;
    msgs.appendChild(div);
    this.scrollBottom();
  },

  showTyping() {
    this.isTyping = true;
    const msgs = document.getElementById('aai-messages');
    const div = document.createElement('div');
    div.id = 'aai-typing';
    div.className = 'aai-msg aai-bot';
    div.innerHTML = `<div class="aai-bubble aai-typing-bubble">
      <span></span><span></span><span></span>
    </div>`;
    msgs.appendChild(div);
    this.scrollBottom();
  },

  hideTyping() {
    const t = document.getElementById('aai-typing');
    if (t) t.remove();
    this.isTyping = false;
  },

  scrollBottom() {
    const msgs = document.getElementById('aai-messages');
    msgs.scrollTop = msgs.scrollHeight;
  }
};

document.addEventListener('DOMContentLoaded', () => AlfredAI.init());