/**
 * AVISHATECH — VIRTUAL ASSISTANT CHATBOT
 * Intelligent instant knowledge base matcher with natural conversation flow,
 * suggestions, and zero-crash fallback.
 */

document.addEventListener('DOMContentLoaded', () => {
  const chatLauncherBtn = document.getElementById('chatLauncherBtn');
  const chatModalWindow = document.getElementById('chatModalWindow');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatMessagesContainer = document.getElementById('chatMessagesContainer');
  const chatInputField = document.getElementById('chatInputField');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatQuickChips = document.getElementById('chatQuickChips');

  if (!chatLauncherBtn || !chatModalWindow) return;

  let isOpen = false;

  function toggleChat(force) {
    isOpen = typeof force === 'boolean' ? force : !isOpen;
    chatModalWindow.classList.toggle('open', isOpen);
    if (isOpen) {
      chatLauncherBtn.querySelector('.chat-badge-ping')?.remove();
      chatInputField?.focus();
    }
  }

  chatLauncherBtn.addEventListener('click', () => toggleChat());
  chatCloseBtn?.addEventListener('click', () => toggleChat(false));

  function appendMessage(text, role) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${role}`;
    msg.textContent = text;
    chatMessagesContainer.appendChild(msg);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    return msg;
  }

  function appendTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot typing';
    typing.innerHTML = '<span style="display:inline-block;width:6px;height:6px;background:var(--teal-400);border-radius:50%;margin-right:4px;animation:pulseBlip 1s infinite;"></span><span style="display:inline-block;width:6px;height:6px;background:var(--teal-400);border-radius:50%;margin-right:4px;animation:pulseBlip 1s infinite 0.2s;"></span><span style="display:inline-block;width:6px;height:6px;background:var(--teal-400);border-radius:50%;animation:pulseBlip 1s infinite 0.4s;"></span>';
    chatMessagesContainer.appendChild(typing);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    return typing;
  }

  // Knowledge Base Engine
  function getBotResponse(userText) {
    const q = userText.toLowerCase().trim();

    if (q.includes('service') || q.includes('what do you do') || q.includes('capability') || q.includes('offer')) {
      return "AvishaTech provides full-lifecycle software engineering:\n• Custom Web & Enterprise Software (Next.js, Node, Python, Go)\n• Mobile Applications (Flutter, React Native, iOS, Android)\n• Cloud Infrastructure & DevOps (AWS, GCP, Docker, Kubernetes, CI/CD)\n• UI/UX Product Design\n• Data & AI Solutions (LLMs, analytics pipelines)\n• Cybersecurity Audits & Performance Optimization.";
    }

    if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('rosy') || q.includes('quickmandu') || q.includes('news')) {
      return "Here are our featured live platforms in active production:\n1. Rosy Shopping Store — E-commerce platform (rosystore.avishatech.com)\n2. QuickMandu — On-demand home services ecosystem in Nepal (quickmandu.avishatech.com)\n3. Daily Janta News — Bilingual digital news portal (dailyjantanews.avishatech.com)\n\nWe've also engineered high-throughput inventory engines and HIPAA-compliant patient migration systems.";
    }

    if (q.includes('price') || q.includes('cost') || q.includes('quote') || q.includes('rate') || q.includes('how much') || q.includes('budget')) {
      return "Every project is scoped to exact technical requirements. Typical MVP builds range from 8-12 weeks with weekly demo milestones and 90-day post-launch warranty included. We offer both fixed-scope milestone delivery and flexible dedicated sprint teams. Fill out the contact form below or call us for a same-day custom estimate!";
    }

    if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('call') || q.includes('whatsapp') || q.includes('location') || q.includes('address') || q.includes('office')) {
      return "You can reach the AvishaTech engineering team directly:\n📞 Phone / WhatsApp: +977 98652 72545\n✉️ Email: help.avishatech@outlook.com\n📍 Office: Kathmandu, Nepal\n🕒 Hours: Mon - Fri, 9:30 AM - 6:00 PM NPT\n\nWe respond to all technical inquiries within 24 hours.";
    }

    if (q.includes('process') || q.includes('how you work') || q.includes('timeline') || q.includes('guarantee')) {
      return "Our 4-phase agile process removes surprises:\n1. Discover & Technical Architecture (1-2 weeks)\n2. Design & Interactive Prototyping (2-3 weeks)\n3. Agile Build & Weekly Demos (4-8 weeks)\n4. Production Deploy & 90-Day Uptime SLA Support.";
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste')) {
      return "Hello! Welcome to Avisha Technologies (AvishaTech). How can we help you scale your software or infrastructure today?";
    }

    // Default Fallback
    return "Thank you for reaching out! We build high-performance custom software, mobile apps, and cloud systems. You can share your project details directly via the inquiry form below, or reach our lead engineers at +977 98652 72545 / help.avishatech@outlook.com.";
  }

  function handleUserMessage() {
    const text = chatInputField.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInputField.value = '';

    const typingEl = appendTypingIndicator();
    chatSendBtn.disabled = true;

    setTimeout(() => {
      typingEl.remove();
      const botReply = getBotResponse(text);
      appendMessage(botReply, 'bot');
      chatSendBtn.disabled = false;
    }, 700);
  }

  chatSendBtn?.addEventListener('click', handleUserMessage);
  chatInputField?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUserMessage();
  });

  // Suggestion Chips
  chatQuickChips?.querySelectorAll('.chat-chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      chatInputField.value = chip.textContent.trim();
      handleUserMessage();
    });
  });
});

