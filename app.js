/**
 * ZEDU CHAT - WHIMSICAL EMOJI & INTERACTIVE SYSTEM
 * Reproduces the Telegram hover reactions, physics burst particles,
 * realistic Zedu channel data, and the whimsical mouse lamp follower.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const state = {
    currentChannel: 'announcement',
    activeTab: 'messages',
    lampEnabled: true,
    emojiDrawerOpen: true,
    activeContextMessageId: null,
    focusedMessageForReaction: null,
    userReactions: {}, // { messageId_emoji: true/false }
  };

  // ---------------------------------------------------------------------------
  // REALISTIC CHANNEL DATA (Matching Screenshot & Telegram Video)
  // ---------------------------------------------------------------------------
  const channelsData = {
    announcement: {
      name: 'announcement',
      prefix: '#',
      isLocked: true,
      membersCount: 1912,
      searchTag: '#announcement',
      messages: [
        {
          id: 'msg-ann-1',
          author: 'mark essien',
          avatarText: 'ME',
          avatarColor: '#2563eb',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces',
          timestamp: '7:04 AM',
          date: 'Yesterday',
          content: [
            { type: 'mention', text: '@channel' },
            { type: 'text', text: ' on the call today we will handle feedback on individual submissions' }
          ],
          reactions: [
            { emoji: '👏', count: 1 }
          ]
        },
        {
          id: 'msg-ann-2',
          author: 'mark essien',
          avatarText: 'ME',
          avatarColor: '#2563eb',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces',
          timestamp: '7:04 AM',
          date: null,
          content: [
            { type: 'mention', text: '@channel' },
            { type: 'text', text: ' Hello All. The deadline for the individual task has changed to tommorow, wednesday by 10am. Everyone will submit before then. On a call today we are to ensure each person gets part of the team task to work on. It seems the team tasks are being worked on by few people. So we end individual tasks tommorow and we will only see how you fared and contributed to the team task. Ensure you have been assigned a team task. All teams please update your members directory and write out what each person has been assigned to.' }
          ],
          reactions: [
            { emoji: '👍', count: 1 },
            { emoji: '🤯', count: 1 }
          ],
          replies: {
            count: 2,
            lastReplyTime: '7 hours ago',
            avatars: [
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&h=48&fit=crop',
              'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=48&h=48&fit=crop'
            ]
          }
        }
      ]
    },
    'team-vulcon': {
      name: 'team-vulcon-2.0',
      prefix: '💬',
      isLocked: false,
      membersCount: 55,
      searchTag: '#team-vulcon',
      messages: [
        {
          id: 'msg-vlc-1',
          author: 'Dev B',
          avatarText: 'DB',
          avatarColor: '#3b82f6',
          timestamp: '3:02 PM',
          date: 'Yesterday',
          content: [
            { type: 'text', text: 'Hey guys at the UX and Individual Tasks. Here is a playbook that may help: ' },
            { type: 'link', text: 'https://whimsical.com/zedu-interactions-playbook', url: '#' }
          ],
          reactions: [
            { emoji: '🔥', count: 3 },
            { emoji: '❤️', count: 2 }
          ]
        },
        {
          id: 'msg-vlc-2',
          author: 'Michael (stressed)',
          avatarText: 'M',
          avatarColor: '#10b981',
          timestamp: '3:13 PM',
          date: null,
          content: [
            { type: 'text', text: 'Anyone got the team submission spreadsheet out? Need the link.' }
          ],
          reactions: []
        },
        {
          id: 'msg-vlc-3',
          author: 'Michael (stressed)',
          avatarText: 'M',
          avatarColor: '#10b981',
          timestamp: '3:13 PM',
          date: null,
          content: [
            { type: 'text', text: 'Please help me review: ' },
            { type: 'link', text: 'https://whimsical.vercel.app/figants', url: '#' }
          ],
          reactions: [
            { emoji: '❤️', count: 2 },
            { emoji: '👍', count: 3 },
            { emoji: '🚀', count: 1 }
          ]
        },
        {
          id: 'msg-vlc-4',
          author: 'Increase Chima',
          avatarText: 'IC',
          avatarColor: '#ec4899',
          timestamp: '4:02 PM',
          date: null,
          content: [
            { type: 'text', text: 'Guyyysss... who’s awake? Am done cooking, please help review: ' },
            { type: 'link', text: 'https://whimsical.vercel.app/figants', url: '#' }
          ],
          reactions: [
            { emoji: '🔥', count: 1 },
            { emoji: '👏', count: 2 }
          ]
        },
        {
          id: 'msg-vlc-5',
          author: 'Dera',
          avatarText: 'D',
          avatarColor: '#eab308',
          timestamp: '4:05 PM',
          date: null,
          content: [
            { type: 'text', text: 'Guyyysss... who’s awake? Need the latest repo branch link' }
          ],
          reactions: [
            { emoji: '👍', count: 2 }
          ]
        },
        {
          id: 'msg-vlc-6',
          author: 'Godswereon Patrick Udofe',
          avatarText: 'GP',
          avatarColor: '#6366f1',
          timestamp: '4:55 PM',
          date: null,
          content: [
            { type: 'text', text: 'Guyyysss... who’s awake? Please what repository are we pulling a branch to? 🚀' }
          ],
          reactions: [
            { emoji: '🔥', count: 2 }
          ]
        }
      ]
    },
    general: {
      name: 'general',
      prefix: '#',
      isLocked: false,
      membersCount: 2450,
      searchTag: '#general',
      messages: [
        {
          id: 'msg-gen-1',
          author: 'Mentor Alex',
          avatarText: 'MA',
          avatarColor: '#8b5cf6',
          timestamp: '9:15 AM',
          date: 'Today',
          content: [
            { type: 'text', text: 'Welcome everyone! For the whimsical design task, remember to prioritize smooth CSS animations and delightful interactive details. Have fun with the emojis!' }
          ],
          reactions: [
            { emoji: '🎉', count: 12 },
            { emoji: '🔥', count: 8 },
            { emoji: '❤️', count: 5 }
          ]
        }
      ]
    }
  };

  // ---------------------------------------------------------------------------
  // EMOJI REACTION LIBRARY
  // ---------------------------------------------------------------------------
  const quickReactions = ['👍', '❤️', '🔥', '👏', '🎉', '🤩', '🚀', '💯'];

  const emojiCategories = {
    smileys: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥹', '😊',
      '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😋', '😛',
      '😜', '🤪', '🤩', '🥳', '😎', '🤓', '🧐', '😏', '😒', '😞',
      '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢',
      '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱'
    ],
    gestures: [
      '👍', '👎', '👏', '🙌', '👐', '🤝', '👊', '✊', '🤛', '🤜',
      '🤞', '✌️', '🤟', '🤘', '👌', '🤏', '👈', '👉', '👆', '👇',
      '☝️', '✋', '🤚', '🖐', '🖖', '👋', '🤙', '💪', '🦾', '🖕',
      '✍️', '🙏', '💅', '🤝', '🫂', '👀', '👁️', '🧠', '🫀', '🫁'
    ],
    symbols: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝',
      '✨', '⭐', '🌟', '💫', '⚡', '💥', '🔥', '🎉', '🎊', '🚀',
      '💡', '🎈', '🏆', '🥇', '🥈', '🥉', '🎯', '🔮', '💯', '🌈'
    ]
  };

  // ---------------------------------------------------------------------------
  // DOM ELEMENTS
  // ---------------------------------------------------------------------------
  const dom = {
    lamp: document.getElementById('whimsical-lamp'),
    whimsicalToggleBtn: document.getElementById('whimsicalToggleBtn'),
    lampStatusDot: document.getElementById('lampStatusDot'),
    channelList: document.getElementById('channelList'),
    currentChannelName: document.getElementById('currentChannelName'),
    currentSearchChannelTag: document.getElementById('currentSearchChannelTag'),
    globalSearchInput: document.getElementById('globalSearchInput'),
    membersStack: document.getElementById('membersStack'),
    messagesFeed: document.getElementById('messagesFeed'),
    chatFooterContainer: document.getElementById('chatFooterContainer'),
    emojiDrawer: document.getElementById('emojiDrawer'),
    toggleEmojiPanelBtn: document.getElementById('toggleEmojiPanelBtn'),
    drawerCloseBtn: document.getElementById('drawerCloseBtn'),
    emojiSearchInput: document.getElementById('emojiSearchInput'),
    smileysGrid: document.getElementById('smileysGrid'),
    gesturesGrid: document.getElementById('gesturesGrid'),
    symbolsGrid: document.getElementById('symbolsGrid'),
    contextMenu: document.getElementById('messageContextMenu'),
    contextReactionsRow: document.getElementById('contextReactionsRow'),
    particleContainer: document.getElementById('particleCanvasContainer'),
    toast: document.getElementById('toastNotification'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    channelsSidebar: document.getElementById('channelsSidebar'),
  };

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------
  function init() {
    setupWhimsicalLamp();
    populateEmojiDrawer();
    setupEventListeners();
    renderChannel(state.currentChannel);
  }

  // ---------------------------------------------------------------------------
  // WHIMSICAL LAMP (FOLLOWS MOUSE)
  // Subtle desk lamp light with CSS radial gradient tracking coordinates
  // ---------------------------------------------------------------------------
  function setupWhimsicalLamp() {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let animationFrameId = null;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateLampPosition);
      }
    });

    function updateLampPosition() {
      // Smooth interpolation for whimsical organic lamp physics
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;

      dom.lamp.style.setProperty('--mouse-x', `${currentX.toFixed(1)}px`);
      dom.lamp.style.setProperty('--mouse-y', `${currentY.toFixed(1)}px`);

      if (Math.abs(mouseX - currentX) > 0.5 || Math.abs(mouseY - currentY) > 0.5) {
        animationFrameId = requestAnimationFrame(updateLampPosition);
      } else {
        animationFrameId = null;
      }
    }

    // Toggle button handler
    dom.whimsicalToggleBtn.addEventListener('click', () => {
      state.lampEnabled = !state.lampEnabled;
      if (state.lampEnabled) {
        dom.lamp.classList.remove('disabled');
        dom.lampStatusDot.classList.add('active');
        showToast('💡 Whimsical Lamp: Active (Follows mouse)');
      } else {
        dom.lamp.classList.add('disabled');
        dom.lampStatusDot.classList.remove('active');
        showToast('💡 Whimsical Lamp: Disabled');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // CHANNEL RENDERING
  // ---------------------------------------------------------------------------
  function renderChannel(channelKey) {
    const data = channelsData[channelKey] || channelsData['announcement'];
    state.currentChannel = channelKey;

    // Update Headers
    dom.currentChannelName.textContent = data.name;
    dom.currentSearchChannelTag.textContent = data.prefix + data.name;
    dom.globalSearchInput.placeholder = `Search in ${data.prefix}${data.name}...`;

    // Update Active Channel in sidebar
    document.querySelectorAll('.channel-item').forEach(item => {
      if (item.getAttribute('data-channel') === channelKey) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Render Messages
    renderMessages(data.messages);

    // Render Footer (Locked announcement vs active text box)
    renderFooter(data.isLocked);
  }

  function renderMessages(messages) {
    dom.messagesFeed.innerHTML = '';

    messages.forEach((msg) => {
      // Optional date divider
      if (msg.date) {
        const divider = document.createElement('div');
        divider.className = 'date-divider';
        divider.innerHTML = `<span class="date-badge">${msg.date}</span>`;
        dom.messagesFeed.appendChild(divider);
      }

      const row = document.createElement('div');
      row.className = 'message-row';
      row.id = msg.id;
      row.setAttribute('data-message-id', msg.id);

      // Avatar
      let avatarHtml = '';
      if (msg.avatarUrl) {
        avatarHtml = `<img src="${msg.avatarUrl}" alt="${msg.author}" class="message-avatar" loading="lazy" />`;
      } else {
        avatarHtml = `<div class="message-avatar-fallback" style="background-color: ${msg.avatarColor || '#475569'}">${msg.avatarText}</div>`;
      }

      // Message Body Content
      const bodyHtml = msg.content.map(part => {
        if (part.type === 'mention') {
          return `<span class="mention-pill">${part.text}</span>`;
        } else if (part.type === 'link') {
          return `<a href="${part.url}" class="message-link" target="_blank" rel="noopener">${part.text}</a>`;
        } else {
          return escapeHtml(part.text);
        }
      }).join('');

      // Reactions Badges
      const reactionsHtml = (msg.reactions || []).map(r => {
        const isUserReacted = state.userReactions[`${msg.id}_${r.emoji}`] || false;
        return `
          <button class="reaction-pill ${isUserReacted ? 'active' : ''}" data-msg-id="${msg.id}" data-emoji="${r.emoji}">
            <span class="emoji-char">${r.emoji}</span>
            <span class="reaction-count">${r.count}</span>
          </button>
        `;
      }).join('');

      // Optional replies
      let repliesHtml = '';
      if (msg.replies) {
        const avatarImgs = msg.replies.avatars.map(url => `<img src="${url}" class="thread-avatar-mini" alt="Reply avatar" />`).join('');
        repliesHtml = `
          <div class="thread-preview-line">
            <div class="thread-avatars">${avatarImgs}</div>
            <span>${msg.replies.count} replies</span>
            <span class="thread-last-reply">Last reply ${msg.replies.lastReplyTime}</span>
          </div>
        `;
      }

      // Floating Quick Reaction Bar (Telegram style on hover)
      const quickEmojiButtons = quickReactions.map(emoji => `
        <button class="quick-emoji-btn" data-msg-id="${msg.id}" data-emoji="${emoji}" title="React with ${emoji}">${emoji}</button>
      `).join('');

      row.innerHTML = `
        <div class="message-avatar-wrap">
          ${avatarHtml}
        </div>
        <div class="message-content">
          <div class="message-header-line">
            <span class="author-name">${msg.author}</span>
            <span class="message-timestamp">${msg.timestamp}</span>
          </div>
          <div class="message-body-text">${bodyHtml}</div>
          <div class="reactions-wrapper" id="reactions-${msg.id}">
            ${reactionsHtml}
            <button class="btn-add-reaction" data-msg-id="${msg.id}" title="Add reaction">
              ☺
            </button>
          </div>
          ${repliesHtml}
        </div>

        <!-- Floating Quick Reaction Bar on Hover (Telegram Video Feature) -->
        <div class="floating-reaction-bar" aria-label="Quick reactions">
          ${quickEmojiButtons}
          <button class="quick-action-trigger" data-msg-id="${msg.id}" title="More actions">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>
      `;

      dom.messagesFeed.appendChild(row);
    });

    // Scroll to bottom
    dom.messagesFeed.scrollTop = dom.messagesFeed.scrollHeight;
  }

  function renderFooter(isLocked) {
    if (isLocked) {
      dom.chatFooterContainer.innerHTML = `
        <div class="restricted-channel-banner">
          <div class="restricted-icon-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2 class="restricted-title">Only admins can send message on this channel</h2>
          <p class="restricted-subtitle">Posting in #announcement is restricted. You can still read messages and interact with reactions in #announcement.</p>
        </div>
      `;
    } else {
      dom.chatFooterContainer.innerHTML = `
        <div class="active-chat-input-box">
          <textarea class="chat-textarea" id="chatMessageInput" placeholder="Message #${state.currentChannel}..." rows="1"></textarea>
          <div class="chat-input-toolbar">
            <div class="input-tools-left">
              <button class="tool-action-btn" id="inputEmojiTrigger" title="Insert Emoji">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </button>
              <button class="tool-action-btn" title="Attach file">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
            </div>
            <button class="btn-send-message" id="btnSendMessage" title="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      `;

      // Input event bindings
      const input = document.getElementById('chatMessageInput');
      const sendBtn = document.getElementById('btnSendMessage');
      const emojiTrigger = document.getElementById('inputEmojiTrigger');

      if (input && sendBtn) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageFromInput(input.value);
            input.value = '';
          }
        });

        sendBtn.addEventListener('click', () => {
          sendMessageFromInput(input.value);
          input.value = '';
        });
      }

      if (emojiTrigger) {
        emojiTrigger.addEventListener('click', () => {
          toggleEmojiDrawer(true);
        });
      }
    }
  }

  function sendMessageFromInput(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const currentData = channelsData[state.currentChannel];
    if (!currentData) return;

    const newMsg = {
      id: `msg-user-${Date.now()}`,
      author: 'You',
      avatarText: 'V',
      avatarColor: '#8b5cf6',
      timestamp: formatTime(new Date()),
      content: [{ type: 'text', text: trimmed }],
      reactions: []
    };

    currentData.messages.push(newMsg);
    renderMessages(currentData.messages);
    showToast('Message sent! Try hovering over it to test reactions ✨');
  }

  // ---------------------------------------------------------------------------
  // WHIMSICAL EMOJI PHYSICS BURST ANIMATION
  // ---------------------------------------------------------------------------
  function triggerWhimsicalEmojiBurst(sourceElement, emoji) {
    if (!sourceElement) return;

    const rect = sourceElement.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    const particleCount = 7;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'flying-emoji-particle';
      particle.textContent = emoji;

      // Random trajectories for whimsical fluttering effect
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
      const distanceMid = 30 + Math.random() * 40;
      const distanceEnd = 60 + Math.random() * 80;

      const txMid = Math.cos(angle) * distanceMid;
      const tyMid = -Math.abs(Math.sin(angle) * distanceMid) - 20;

      const txEnd = Math.cos(angle) * distanceEnd * 1.3;
      const tyEnd = -Math.abs(Math.sin(angle) * distanceEnd) - 60;

      const rotMid = `${(Math.random() - 0.5) * 45}deg`;
      const rotEnd = `${(Math.random() - 0.5) * 90}deg`;

      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particle.style.setProperty('--tx-mid', `${txMid}px`);
      particle.style.setProperty('--ty-mid', `${tyMid}px`);
      particle.style.setProperty('--tx-end', `${txEnd}px`);
      particle.style.setProperty('--ty-end', `${tyEnd}px`);
      particle.style.setProperty('--rot-mid', rotMid);
      particle.style.setProperty('--rot-end', rotEnd);

      dom.particleContainer.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 1050);
    }
  }

  // ---------------------------------------------------------------------------
  // REACTION HANDLING (ADD / TOGGLE / INCREMENT)
  // ---------------------------------------------------------------------------
  function handleEmojiReaction(messageId, emoji, triggerElement) {
    const currentData = channelsData[state.currentChannel];
    if (!currentData) return;

    const msg = currentData.messages.find(m => m.id === messageId);
    if (!msg) return;

    if (!msg.reactions) msg.reactions = [];

    const reactionKey = `${messageId}_${emoji}`;
    const alreadyReacted = state.userReactions[reactionKey];

    let reactionObj = msg.reactions.find(r => r.emoji === emoji);

    if (alreadyReacted) {
      // Toggle off
      state.userReactions[reactionKey] = false;
      if (reactionObj) {
        reactionObj.count -= 1;
        if (reactionObj.count <= 0) {
          msg.reactions = msg.reactions.filter(r => r.emoji !== emoji);
        }
      }
    } else {
      // Toggle on with whimsical burst
      state.userReactions[reactionKey] = true;
      if (reactionObj) {
        reactionObj.count += 1;
      } else {
        msg.reactions.push({ emoji, count: 1 });
      }

      // Trigger burst physics
      triggerWhimsicalEmojiBurst(triggerElement, emoji);
    }

    // Update UI for the reactions of this message
    updateReactionsUI(msg);
  }

  function updateReactionsUI(msg) {
    const wrapper = document.getElementById(`reactions-${msg.id}`);
    if (!wrapper) return;

    const reactionsHtml = msg.reactions.map(r => {
      const isUserReacted = state.userReactions[`${msg.id}_${r.emoji}`] || false;
      return `
        <button class="reaction-pill ${isUserReacted ? 'active' : ''}" data-msg-id="${msg.id}" data-emoji="${r.emoji}">
          <span class="emoji-char">${r.emoji}</span>
          <span class="reaction-count">${r.count}</span>
        </button>
      `;
    }).join('');

    wrapper.innerHTML = `
      ${reactionsHtml}
      <button class="btn-add-reaction" data-msg-id="${msg.id}" title="Add reaction">☺</button>
    `;
  }

  // ---------------------------------------------------------------------------
  // EMOJI DRAWER LOGIC
  // ---------------------------------------------------------------------------
  function populateEmojiDrawer() {
    renderGrid(dom.smileysGrid, emojiCategories.smileys);
    renderGrid(dom.gesturesGrid, emojiCategories.gestures);
    renderGrid(dom.symbolsGrid, emojiCategories.symbols);
  }

  function renderGrid(container, emojiArray) {
    container.innerHTML = '';
    emojiArray.forEach(emoji => {
      const btn = document.createElement('button');
      btn.className = 'drawer-emoji-item';
      btn.textContent = emoji;
      btn.setAttribute('data-emoji', emoji);
      btn.title = emoji;

      btn.addEventListener('click', (e) => {
        // If a message was focused for reaction, react to it
        if (state.focusedMessageForReaction) {
          handleEmojiReaction(state.focusedMessageForReaction, emoji, btn);
        } else {
          // If text input exists, append emoji
          const input = document.getElementById('chatMessageInput');
          if (input) {
            input.value += emoji;
            input.focus();
          }
          triggerWhimsicalEmojiBurst(btn, emoji);
        }
      });

      container.appendChild(btn);
    });
  }

  function toggleEmojiDrawer(forceOpen) {
    if (typeof forceOpen === 'boolean') {
      state.emojiDrawerOpen = forceOpen;
    } else {
      state.emojiDrawerOpen = !state.emojiDrawerOpen;
    }

    if (state.emojiDrawerOpen) {
      dom.emojiDrawer.classList.remove('closed');
    } else {
      dom.emojiDrawer.classList.add('closed');
    }
  }

  // Filter emojis in drawer search
  dom.emojiSearchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.drawer-emoji-item').forEach(btn => {
      if (!term || btn.textContent.includes(term)) {
        btn.style.display = 'flex';
      } else {
        btn.style.display = 'none';
      }
    });
  });

  // ---------------------------------------------------------------------------
  // CONTEXT MENU (TELEGRAM STYLE)
  // ---------------------------------------------------------------------------
  function openContextMenu(x, y, messageId) {
    state.activeContextMessageId = messageId;
    dom.contextMenu.style.display = 'flex';

    // Boundary check so context menu stays inside viewport
    const menuWidth = 190;
    const menuHeight = 220;
    const posX = (x + menuWidth > window.innerWidth) ? (x - menuWidth) : x;
    const posY = (y + menuHeight > window.innerHeight) ? (y - menuHeight) : y;

    dom.contextMenu.style.left = `${posX}px`;
    dom.contextMenu.style.top = `${posY}px`;
  }

  function closeContextMenu() {
    dom.contextMenu.style.display = 'none';
    state.activeContextMessageId = null;
  }

  // ---------------------------------------------------------------------------
  // GLOBAL EVENT LISTENERS
  // ---------------------------------------------------------------------------
  function setupEventListeners() {
    // Channel List selection
    dom.channelList.addEventListener('click', (e) => {
      const item = e.target.closest('.channel-item');
      if (!item) return;

      const channelKey = item.getAttribute('data-channel');
      if (channelKey === 'hng-premium-plus') {
        showToast('🔒 This channel requires HNG Premium Plus access');
        return;
      }

      renderChannel(channelKey);

      // Close mobile sidebar if open
      if (window.innerWidth <= 720) {
        dom.channelsSidebar.classList.remove('mobile-open');
      }
    });

    // Mobile menu toggle
    dom.mobileMenuBtn.addEventListener('click', () => {
      dom.channelsSidebar.classList.toggle('mobile-open');
    });

    // Drawer toggle button in topbar
    dom.toggleEmojiPanelBtn.addEventListener('click', () => {
      toggleEmojiDrawer();
    });

    dom.drawerCloseBtn.addEventListener('click', () => {
      toggleEmojiDrawer(false);
    });

    // Message click delegation: Quick Emoji, Reaction Pill, Add Reaction, More Actions
    dom.messagesFeed.addEventListener('click', (e) => {
      // 1. Quick reaction from floating bar on hover
      const quickBtn = e.target.closest('.quick-emoji-btn');
      if (quickBtn) {
        const msgId = quickBtn.getAttribute('data-msg-id');
        const emoji = quickBtn.getAttribute('data-emoji');
        handleEmojiReaction(msgId, emoji, quickBtn);
        return;
      }

      // 2. Existing reaction pill click (toggle count)
      const reactionPill = e.target.closest('.reaction-pill');
      if (reactionPill) {
        const msgId = reactionPill.getAttribute('data-msg-id');
        const emoji = reactionPill.getAttribute('data-emoji');
        handleEmojiReaction(msgId, emoji, reactionPill);
        return;
      }

      // 3. Add reaction button ("☺")
      const addReactionBtn = e.target.closest('.btn-add-reaction');
      if (addReactionBtn) {
        const msgId = addReactionBtn.getAttribute('data-msg-id');
        state.focusedMessageForReaction = msgId;
        toggleEmojiDrawer(true);
        showToast(`Select an emoji from the right drawer to react to message!`);
        return;
      }

      // 4. Quick Action trigger (three dots in floating bar)
      const actionTrigger = e.target.closest('.quick-action-trigger');
      if (actionTrigger) {
        const msgId = actionTrigger.getAttribute('data-msg-id');
        const rect = actionTrigger.getBoundingClientRect();
        openContextMenu(rect.left, rect.bottom + 4, msgId);
        return;
      }
    });

    // Right-Click Context Menu on Message Rows
    dom.messagesFeed.addEventListener('contextmenu', (e) => {
      const msgRow = e.target.closest('.message-row');
      if (msgRow) {
        e.preventDefault();
        openContextMenu(e.clientX, e.clientY, msgRow.id);
      }
    });

    // Context menu quick reaction click
    dom.contextReactionsRow.addEventListener('click', (e) => {
      const reactBtn = e.target.closest('.quick-react-item');
      if (reactBtn && state.activeContextMessageId) {
        const emoji = reactBtn.getAttribute('data-emoji');
        handleEmojiReaction(state.activeContextMessageId, emoji, reactBtn);
        closeContextMenu();
      }
    });

    // Context menu actions
    dom.contextMenu.addEventListener('click', (e) => {
      const actionItem = e.target.closest('.context-menu-item');
      if (!actionItem) return;

      const action = actionItem.getAttribute('data-action');
      if (action === 'copy') {
        showToast('📋 Message text copied to clipboard!');
      } else if (action === 'reply') {
        showToast('↩️ Replying to message...');
        const input = document.getElementById('chatMessageInput');
        if (input) input.focus();
      } else if (action === 'pin') {
        showToast('📌 Message pinned to channel!');
      } else if (action === 'link') {
        showToast('🔗 Message link copied to clipboard!');
      } else if (action === 'forward') {
        showToast('↗️ Forward dialog opened');
      }

      closeContextMenu();
    });

    // Close context menu on outside click or Esc
    window.addEventListener('click', (e) => {
      if (!dom.contextMenu.contains(e.target) && !e.target.closest('.quick-action-trigger')) {
        closeContextMenu();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeContextMenu();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        dom.globalSearchInput.focus();
      }
    });

    // Start Buzz button demo
    const btnStartBuzz = document.getElementById('btnStartBuzz');
    if (btnStartBuzz) {
      btnStartBuzz.addEventListener('click', () => {
        showToast('🎧 Buzz call started for ' + state.currentChannel);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------
  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add('show');
    clearTimeout(dom.toast._timeout);
    dom.toast._timeout = setTimeout(() => {
      dom.toast.classList.remove('show');
    }, 2800);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  // Start app on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
