/**
 * ZEDU CHAT - ULTRA-WHIMSICAL EMOJI & INTERACTIVE ENGINE
 * Features:
 * 1. 60FPS Canvas Physics Engine (Confetti, Hearts, Embers, Sparkles, Shockwaves)
 * 2. Animated Vector SVG Emojis (Telegram Style from whimzzzy.mp4)
 * 3. Web Audio API Synthesized Sound FX (Disabled by default, toggle in Settings -> Preferences)
 * 4. Whimsical Mouse Lamp Spotlight (Disabled by default, toggle in Settings -> Preferences)
 * 5. Giant Whimsical Reaction Stalker & Pop Banners
 * 6. Settings Modal with Preferences
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT (DISABLED BY DEFAULT AS REQUESTED)
  // ---------------------------------------------------------------------------
  const state = {
    currentChannel: 'announcement',
    activeTab: 'messages',
    lampEnabled: false,   // Disabled by default
    soundEnabled: false,  // Disabled by default
    particlesEnabled: false, // Disabled by default
    emojiDrawerOpen: true,
    activeContextMessageId: null,
    focusedMessageForReaction: null,
    userReactions: {}, // { messageId_emoji: boolean }
  };

  // ---------------------------------------------------------------------------
  // ANIMATED SVG VECTOR EMOJI DEFINITIONS (TELEGRAM STYLE)
  // ---------------------------------------------------------------------------
  const animatedSvgDefs = {
    '❤️': {
      label: 'Love',
      burstTitle: '❤️ ALL THE LOVE!',
      svg: `
        <svg class="anim-emoji-svg anim-heart" viewBox="0 0 36 36" width="22" height="22">
          <defs>
            <linearGradient id="heartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ff4b4b"/>
              <stop offset="100%" stop-color="#dc2626"/>
            </linearGradient>
            <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#ef4444" flood-opacity="0.6"/>
            </filter>
          </defs>
          <path fill="url(#heartGrad)" filter="url(#heartGlow)" d="M35.885 11.833c0-5.45-4.418-9.868-9.867-9.868-3.308 0-6.227 1.633-8.018 4.129-1.791-2.496-4.71-4.129-8.017-4.129-5.45 0-9.868 4.417-9.868 9.868 0 .772.098 1.52.266 2.241C1.751 22.587 11.216 31.047 18 34.035c6.783-2.988 16.249-11.448 17.617-19.96.17-.721.268-1.469.268-2.242z"/>
          <path fill="#ffffff" opacity="0.4" d="M11 7c-3 0-5 2-5 5 0 .5.4 1 1 1s1-.5 1-1c0-1.8 1.2-3 3-3 .5 0 1-.4 1-1s-.5-1-1-1z"/>
        </svg>
      `
    },
    '🔥': {
      label: 'Fire',
      burstTitle: '🔥 HOT STUFF!',
      svg: `
        <svg class="anim-emoji-svg anim-fire" viewBox="0 0 36 36" width="22" height="22">
          <defs>
            <linearGradient id="fireGradOuter" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="#ea580c"/>
              <stop offset="100%" stop-color="#f97316"/>
            </linearGradient>
            <linearGradient id="fireGradInner" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="#facc15"/>
              <stop offset="100%" stop-color="#fef08a"/>
            </linearGradient>
          </defs>
          <path fill="url(#fireGradOuter)" d="M22.5 1.5C21.9 4 19 6 17 8c-3.5 3.5-5 7.5-3 12 0-3 1.5-5.5 3-7 0 5 3 9 7 11 4.5-2.2 7.5-7 7.5-12.5C31.5 6 27 2 22.5 1.5z"/>
          <path fill="url(#fireGradOuter)" d="M19 12c-4 2-8 7-8 12.5 0 2.5 1 4.8 2.5 6.6C8 28.5 5 23 5 17c0-2.5.8-5 2-7-1.5 2.5-2.5 5.5-2.5 9 0 9.4 7.6 17 17 17s17-7.6 17-17c0-3.5-1-6.5-2.5-9 1.2 2 2 4.5 2 7 0 8.3-6.7 15-15 15-5.5 0-10.4-3-13-7.5 1.5 0 3-.5 4.5-1.5 2-1.5 3-3.5 3-6 0-3.5-2-6.5-1-10z"/>
          <path fill="url(#fireGradInner)" d="M20 18c-1.5 1.5-3 3.5-3 6 0 4 3 7 7 7 2.5 0 4.8-1.2 6.2-3.2-1.2.2-2.5 0-3.5-.8-2-1.5-2.5-4-1.5-6.5.5-1.2.5-2.5 0-3.5-1.5 1.5-3.5 2.5-5.2 4z"/>
        </svg>
      `
    },
    '👍': {
      label: 'Like',
      burstTitle: '👍 APPROVED!',
      svg: `
        <svg class="anim-emoji-svg anim-thumb" viewBox="0 0 36 36" width="22" height="22">
          <defs>
            <linearGradient id="thumbGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fcd34d"/>
              <stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
          </defs>
          <path fill="url(#thumbGrad)" d="M33.4 14.2c-1.2-.4-2.5-.2-3.6.4-.3-1.4-1.3-2.6-2.7-3.1-1.3-.4-2.7-.2-3.8.6-.5-1.1-1.5-2-2.8-2.3-1.1-.3-2.3-.1-3.2.5V8.5c0-4-3-7.5-7-7.5-1 0-1.8.8-1.8 1.8 0 4.2-2.5 8-6.4 9.6L1 13v20h22.6c3.2 0 6-2.1 6.8-5.2l2.6-9.8c.8-2.2-.4-3.5.4-3.8z"/>
          <rect fill="#3b82f6" x="1" y="13" width="7" height="20" rx="2"/>
          <circle fill="#60a5fa" cx="4.5" cy="23" r="1.5"/>
        </svg>
      `
    },
    '👏': {
      label: 'Clap',
      burstTitle: '👏 BRAVO!',
      svg: `
        <svg class="anim-emoji-svg anim-clap" viewBox="0 0 36 36" width="22" height="22">
          <defs>
            <linearGradient id="clapGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fde047"/>
              <stop offset="100%" stop-color="#eab308"/>
            </linearGradient>
          </defs>
          <path fill="url(#clapGrad)" d="M28.5 7.2c-.8-.8-2-.8-2.8 0l-5.6 5.6-2.8-2.8c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8l4.2 4.2-4.2 4.2c-.8.8-.8 2 0 2.8.4.4.9.6 1.4.6s1-.2 1.4-.6l5.6-5.6 2.8 2.8c.4.4.9.6 1.4.6s1-.2 1.4-.6c.8-.8.8-2 0-2.8l-4.2-4.2 4.2-4.2c.8-.8.8-2 0-2.8z"/>
          <path fill="#f59e0b" d="M12.4 18.6L6.8 13c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8l4.2 4.2-4.2 4.2c-.8.8-.8 2 0 2.8.4.4.9.6 1.4.6s1-.2 1.4-.6l5.6-5.6 2.8 2.8c.4.4.9.6 1.4.6s1-.2 1.4-.6c.8-.8.8-2 0-2.8l-4.2-4.2 4.2-4.2c.8-.8.8-2 0-2.8-.8-.8-2-.8-2.8 0l-1.4 1.4z"/>
        </svg>
      `
    },
    '🎉': {
      label: 'Party',
      burstTitle: '🎉 CELEBRATION!',
      svg: `
        <svg class="anim-emoji-svg anim-party" viewBox="0 0 36 36" width="22" height="22">
          <defs>
            <linearGradient id="popperGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ec4899"/>
              <stop offset="50%" stop-color="#8b5cf6"/>
              <stop offset="100%" stop-color="#3b82f6"/>
            </linearGradient>
          </defs>
          <path fill="url(#popperGrad)" d="M2.5 33.5l8-23 15 15-23 8z"/>
          <circle fill="#fbbf24" cx="19" cy="8" r="2.5"/>
          <circle fill="#ef4444" cx="27" cy="14" r="2"/>
          <circle fill="#10b981" cx="24" cy="5" r="2"/>
          <path stroke="#f59e0b" stroke-width="2" stroke-linecap="round" fill="none" d="M15 4c2-2 5-1 7 1M26 9c3-1 5 1 6 4M12 9c0-3 2-5 5-5"/>
        </svg>
      `
    },
    '🤩': {
      label: 'Starstruck',
      burstTitle: '🤩 WOW AMAZING!',
      svg: `
        <svg class="anim-emoji-svg anim-starstruck" viewBox="0 0 36 36" width="22" height="22">
          <circle fill="#ffcc4d" cx="18" cy="18" r="17"/>
          <path fill="#664500" d="M18 29c-5 0-8.5-3-9-4 0 0 2-2 9-2s9 2 9 2c-.5 1-4 4-9 4z"/>
          <path fill="#dd2e44" d="M18 25c-3 0-5 1-6 2 1.5 2 4 3 6 3s4.5-1 6-3c-1-1-3-2-6-2z"/>
          <polygon fill="#ffac33" points="11,7 12.8,11.5 17.5,12 13.8,15 15,19.5 11,17 7,19.5 8.2,15 4.5,12 9.2,11.5"/>
          <polygon fill="#ffac33" points="25,7 26.8,11.5 31.5,12 27.8,15 29,19.5 25,17 21,19.5 22.2,15 18.5,12 23.2,11.5"/>
        </svg>
      `
    },
    '🚀': {
      label: 'Rocket',
      burstTitle: '🚀 TO THE MOON!',
      svg: `
        <svg class="anim-emoji-svg anim-rocket" viewBox="0 0 36 36" width="22" height="22">
          <path fill="#e2e8f0" d="M33 3c-8.5 0-18 6.5-22 13.5l8.5 8.5C26.5 21 33 11.5 33 3z"/>
          <path fill="#ef4444" d="M33 3c-4 0-9 2-12 5l7 7c3-3 5-8 5-12z"/>
          <circle fill="#38bdf8" cx="22" cy="14" r="3"/>
          <circle fill="#ffffff" cx="21" cy="13" r="1"/>
          <path fill="#ea580c" d="M6 30c1.5-1.5 3-2 5-2l-3-3c0-2-.5-3.5-2-5-1.5 3-4 6-6 10 4-2 7-4.5 10-6l-4 6z"/>
          <path fill="#facc15" d="M5 31c1-1 2-1.5 3.5-1.5l-2-2c0-1.5-.5-2.5-1.5-3.5-1 2-2.5 4-4 7 3-1.5 5-3 7-4l-3 4z"/>
        </svg>
      `
    },
    '🤯': {
      label: 'Mindblown',
      burstTitle: '🤯 MIND BLOWN!',
      svg: `
        <svg class="anim-emoji-svg anim-mindblown" viewBox="0 0 36 36" width="22" height="22">
          <circle fill="#ffcc4d" cx="18" cy="20" r="15"/>
          <path fill="#664500" d="M18 31c-3 0-5.5-2-6-3 0 0 1.5-1.5 6-1.5s6 1.5 6 1.5c-.5 1-3 3-6 3z"/>
          <circle fill="#664500" cx="12" cy="20" r="2.5"/>
          <circle fill="#664500" cx="24" cy="20" r="2.5"/>
          <path fill="#f97316" d="M7 14c-1-3 1-6 4-7 1-2 4-3 6-2 2-2 5-2 7 0 2-1 5 0 6 2 3 1 5 4 4 7-3 2-6 3-9 2-3 1-7 1-10 0-4 0-6-1-8-2z"/>
          <circle fill="#fbbf24" cx="11" cy="7" r="1.5"/>
          <circle fill="#ec4899" cx="25" cy="6" r="1.8"/>
          <circle fill="#8b5cf6" cx="18" cy="3" r="2"/>
        </svg>
      `
    }
  };

  function getEmojiSvg(emoji) {
    if (animatedSvgDefs[emoji]) {
      return animatedSvgDefs[emoji].svg;
    }
    return `<span class="emoji-char">${emoji}</span>`;
  }

  // ---------------------------------------------------------------------------
  // WEB AUDIO API SYNTHESIZER
  // ---------------------------------------------------------------------------
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;

      if (type === 'pop') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'chime' || type === 'celebrate') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.18, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.25);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.25);
        });
      } else if (type === 'fire') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {
      // Audio fallback
    }
  }

  // ---------------------------------------------------------------------------
  // REALISTIC CHANNEL DATA
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
    'whimsical-feed': {
      name: 'whimsical-reactions',
      prefix: '✨',
      isLocked: false,
      membersCount: 3820,
      searchTag: '#whimsical-reactions',
      messages: [
        {
          id: 'msg-whim-1',
          author: 'WA Litex Official 📌',
          avatarText: 'WL',
          avatarColor: '#10b981',
          timestamp: '11:47 PM',
          date: 'Today',
          content: [
            { type: 'text', text: '🎉 WA Litex Official v4.0.6 is OUT! Here is what’s new:\n- You can now block calls by country code in Settings\n- New responsive whimsical reactions & physics particle bursts\n- Improved error detection and instant notifications\n- Fixed crash when playing audio on some devices' },
            { type: 'text', text: '\n\n📥 Download: ' },
            { type: 'link', text: 'https://walitex.app/download', url: '#' },
            { type: 'text', text: '\n\n✨ Test all reactions below (matches whimzzzy.mp4!):' }
          ],
          reactions: [
            { emoji: '👏', count: 231 },
            { emoji: '👍', count: 157 },
            { emoji: '❤️', count: 185 },
            { emoji: '🔥', count: 281 },
            { emoji: '🤩', count: 103 },
            { emoji: '🎉', count: 83 },
            { emoji: '🚀', count: 42 },
            { emoji: '🤯', count: 29 }
          ]
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
            { type: 'text', text: 'Welcome everyone! For the whimsical design task, you can enable the Mouse Lamp and FX Sound under Settings -> Preferences anytime.' }
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

  const quickReactionsList = ['❤️', '🔥', '👍', '👏', '🎉', '🤩', '🚀', '🤯'];

  const standardEmojiCategories = {
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
      '☝️', '✋', '🤚', '🖐', '🖖', '👋', '🤙', '💪', '🦾', '🙏'
    ],
    symbols: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '✨', '⭐', '🌟', '💫', '⚡', '💥', '🔥', '🎉', '🎊', '🚀',
      '💡', '🎈', '🏆', '🥇', '🥈', '🥉', '🎯', '🔮', '💯', '🌈'
    ]
  };

  // ---------------------------------------------------------------------------
  // CANVAS 60FPS PHYSICS ENGINE
  // ---------------------------------------------------------------------------
  const canvas = document.getElementById('reactionCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let isCanvasAnimating = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(x, y, emoji) {
      this.x = x;
      this.y = y;
      this.emoji = emoji;
      this.life = 1.0;
      this.decay = 0.012 + Math.random() * 0.016;

      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 11;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 6;
      this.gravity = 0.28;
      this.drag = 0.96;

      this.rotation = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.25;

      this.size = 20 + Math.random() * 18;
      this.swaySpeed = 0.05 + Math.random() * 0.05;
      this.swayAmp = 2 + Math.random() * 3;
      this.time = Math.random() * 100;

      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#facc15'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.isRibbon = Math.random() > 0.45;
    }

    update() {
      this.time += 1;
      this.vx *= this.drag;
      this.vy = (this.vy + this.gravity) * this.drag;
      this.x += this.vx + Math.sin(this.time * this.swaySpeed) * this.swayAmp;
      this.y += this.vy;
      this.rotation += this.vRot;
      this.life -= this.decay;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.life);

      if (this.isRibbon) {
        const flip = Math.sin(this.time * 0.15);
        ctx.scale(1, flip);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.font = `${Math.floor(this.size)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, 0, 0);
      }

      ctx.restore();
    }
  }

  class Shockwave {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.radius = 10;
      this.maxRadius = 140;
      this.color = color || 'rgba(139, 92, 246, 0.7)';
      this.life = 1.0;
    }
    update() {
      this.radius += 6;
      this.life = 1 - (this.radius / this.maxRadius);
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 4 * this.life;
      ctx.globalAlpha = this.life * 0.8;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();
    }
  }

  function launchWhimsicalPhysicsBurst(x, y, emoji) {
    const burstCount = 42;
    for (let i = 0; i < burstCount; i++) {
      particles.push(new Particle(x, y, emoji));
    }

    const shockwaveColor = (emoji === '❤️') ? 'rgba(239, 68, 68, 0.8)' :
                           (emoji === '🔥') ? 'rgba(249, 115, 22, 0.8)' :
                           (emoji === '🎉') ? 'rgba(236, 72, 153, 0.8)' :
                           'rgba(139, 92, 246, 0.8)';
    particles.push(new Shockwave(x, y, shockwaveColor));

    if (!isCanvasAnimating) {
      isCanvasAnimating = true;
      requestAnimationFrame(runCanvasLoop);
    }
  }

  function runCanvasLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      requestAnimationFrame(runCanvasLoop);
    } else {
      isCanvasAnimating = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ---------------------------------------------------------------------------
  // DOM REFERENCES
  // ---------------------------------------------------------------------------
  const dom = {
    lamp: document.getElementById('whimsical-lamp'),
    channelList: document.getElementById('channelList'),
    currentChannelName: document.getElementById('currentChannelName'),
    currentSearchChannelTag: document.getElementById('currentSearchChannelTag'),
    globalSearchInput: document.getElementById('globalSearchInput'),
    messagesFeed: document.getElementById('messagesFeed'),
    chatFooterContainer: document.getElementById('chatFooterContainer'),
    emojiDrawer: document.getElementById('emojiDrawer'),
    toggleEmojiPanelBtn: document.getElementById('toggleEmojiPanelBtn'),
    drawerCloseBtn: document.getElementById('drawerCloseBtn'),
    emojiSearchInput: document.getElementById('emojiSearchInput'),
    animatedEmojiHighlightGrid: document.getElementById('animatedEmojiHighlightGrid'),
    smileysGrid: document.getElementById('smileysGrid'),
    gesturesGrid: document.getElementById('gesturesGrid'),
    symbolsGrid: document.getElementById('symbolsGrid'),
    contextMenu: document.getElementById('messageContextMenu'),
    contextReactionsRow: document.getElementById('contextReactionsRow'),
    burstBanner: document.getElementById('whimsicalBurstBanner'),
    toast: document.getElementById('toastNotification'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    channelsSidebar: document.getElementById('channelsSidebar'),
    // Settings & Preferences Modal
    settingsModalBackdrop: document.getElementById('settingsModalBackdrop'),
    settingsCloseBtn: document.getElementById('settingsCloseBtn'),
    railSettingsBtn: document.getElementById('railSettingsBtn'),
    topSettingsBtn: document.getElementById('topSettingsBtn'),
    prefMouseLampToggle: document.getElementById('prefMouseLampToggle'),
    prefSoundFxToggle: document.getElementById('prefSoundFxToggle'),
    prefParticlesToggle: document.getElementById('prefParticlesToggle'),
  };

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------
  function init() {
    setupWhimsicalLamp();
    setupSettingsAndPreferences();
    populateEmojiDrawer();
    populateContextReactions();
    setupEventListeners();
    renderChannel(state.currentChannel);
  }

  // ---------------------------------------------------------------------------
  // WHIMSICAL LAMP (FOLLOWS MOUSE)
  // ---------------------------------------------------------------------------
  function setupWhimsicalLamp() {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let animationFrameId = null;

    window.addEventListener('mousemove', (e) => {
      if (!state.lampEnabled) return;
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateLampPosition);
      }
    });

    function updateLampPosition() {
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
  }

  // ---------------------------------------------------------------------------
  // SETTINGS & PREFERENCES MODAL
  // ---------------------------------------------------------------------------
  function setupSettingsAndPreferences() {
    // Sync initial state (disabled by default)
    dom.prefMouseLampToggle.checked = state.lampEnabled;
    dom.prefSoundFxToggle.checked = state.soundEnabled;
    dom.prefParticlesToggle.checked = state.particlesEnabled;

    if (state.lampEnabled) {
      dom.lamp.classList.remove('disabled');
    } else {
      dom.lamp.classList.add('disabled');
    }

    // Open Modal
    function openSettingsModal() {
      dom.settingsModalBackdrop.classList.add('open');
      dom.settingsModalBackdrop.setAttribute('aria-hidden', 'false');
    }

    // Close Modal
    function closeSettingsModal() {
      dom.settingsModalBackdrop.classList.remove('open');
      dom.settingsModalBackdrop.setAttribute('aria-hidden', 'true');
    }

    if (dom.railSettingsBtn) {
      dom.railSettingsBtn.addEventListener('click', openSettingsModal);
    }
    if (dom.topSettingsBtn) {
      dom.topSettingsBtn.addEventListener('click', openSettingsModal);
    }
    if (dom.settingsCloseBtn) {
      dom.settingsCloseBtn.addEventListener('click', closeSettingsModal);
    }

    // Close on backdrop click
    dom.settingsModalBackdrop.addEventListener('click', (e) => {
      if (e.target === dom.settingsModalBackdrop) {
        closeSettingsModal();
      }
    });

    // Preferences Toggle 1: Mouse Lamp
    dom.prefMouseLampToggle.addEventListener('change', (e) => {
      state.lampEnabled = e.target.checked;
      if (state.lampEnabled) {
        dom.lamp.classList.remove('disabled');
        showToast('💡 Mouse Lamp enabled (following cursor)');
      } else {
        dom.lamp.classList.add('disabled');
        showToast('💡 Mouse Lamp disabled');
      }
    });

    // Preferences Toggle 2: FX Sound
    dom.prefSoundFxToggle.addEventListener('change', (e) => {
      state.soundEnabled = e.target.checked;
      if (state.soundEnabled) {
        showToast('🔔 Reaction FX Sounds enabled');
        playSound('celebrate');
      } else {
        showToast('🔕 Reaction FX Sounds disabled');
      }
    });

    // Preferences Toggle 3: Whimsical Physics Particles
    dom.prefParticlesToggle.addEventListener('change', (e) => {
      state.particlesEnabled = e.target.checked;
      if (state.particlesEnabled) {
        showToast('🎆 Whimsical Physics Particles enabled');
        launchWhimsicalPhysicsBurst(window.innerWidth / 2, window.innerHeight / 2, '🎉');
      } else {
        showToast('Whimsical Physics Particles disabled');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // CHANNEL RENDERING
  // ---------------------------------------------------------------------------
  function renderChannel(channelKey) {
    const data = channelsData[channelKey] || channelsData['announcement'];
    state.currentChannel = channelKey;

    dom.currentChannelName.textContent = data.name;
    dom.currentSearchChannelTag.textContent = data.prefix + data.name;
    dom.globalSearchInput.placeholder = `Search in ${data.prefix}${data.name}...`;

    document.querySelectorAll('.channel-item').forEach(item => {
      if (item.getAttribute('data-channel') === channelKey) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    renderMessages(data.messages);
    renderFooter(data.isLocked);
  }

  function renderMessages(messages) {
    dom.messagesFeed.innerHTML = '';

    messages.forEach((msg) => {
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

      let avatarHtml = '';
      if (msg.avatarUrl) {
        avatarHtml = `<img src="${msg.avatarUrl}" alt="${msg.author}" class="message-avatar" loading="lazy" />`;
      } else {
        avatarHtml = `<div class="message-avatar-fallback" style="background-color: ${msg.avatarColor || '#475569'}">${msg.avatarText}</div>`;
      }

      const bodyHtml = msg.content.map(part => {
        if (part.type === 'mention') {
          return `<span class="mention-pill">${part.text}</span>`;
        } else if (part.type === 'link') {
          return `<a href="${part.url}" class="message-link" target="_blank" rel="noopener">${part.text}</a>`;
        } else {
          return escapeHtml(part.text);
        }
      }).join('');

      const reactionsHtml = (msg.reactions || []).map(r => {
        const isUserReacted = state.userReactions[`${msg.id}_${r.emoji}`] || false;
        return `
          <button class="reaction-pill ${isUserReacted ? 'active' : ''}" data-msg-id="${msg.id}" data-emoji="${r.emoji}">
            <span class="emoji-wrap">${getEmojiSvg(r.emoji)}</span>
            <span class="reaction-count">${r.count}</span>
          </button>
        `;
      }).join('');

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

      const quickEmojiButtons = quickReactionsList.map(emoji => {
        const meta = animatedSvgDefs[emoji] || { label: 'React' };
        return `
          <button class="quick-emoji-btn" data-msg-id="${msg.id}" data-emoji="${emoji}" data-label="${meta.label}" title="${meta.label}">
            ${getEmojiSvg(emoji)}
          </button>
        `;
      }).join('');

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
              +
            </button>
          </div>
          ${repliesHtml}
        </div>

        <div class="floating-reaction-bar" aria-label="Quick reactions">
          ${quickEmojiButtons}
          <button class="quick-action-trigger" data-msg-id="${msg.id}" title="More actions">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>
      `;

      dom.messagesFeed.appendChild(row);
    });

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
          <p class="restricted-subtitle">Posting in #announcement is restricted. You can still test all reactions and emojis here, or switch to #whimsical-reactions or #team-vulcon-2.0 to post messages.</p>
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
      reactions: [
        { emoji: '🔥', count: 1 }
      ]
    };

    currentData.messages.push(newMsg);
    renderMessages(currentData.messages);
    playSound('pop');
    showToast('Message sent! Hover over it to test whimsical reactions ✨');
  }

  // ---------------------------------------------------------------------------
  // SHOW GIANT WHIMSICAL BURST BANNER
  // ---------------------------------------------------------------------------
  function showWhimsicalBurstBanner(emoji) {
    const meta = animatedSvgDefs[emoji] || { burstTitle: `${emoji} AWESOME!` };
    dom.burstBanner.innerHTML = `
      <div class="whimsical-banner-emoji">${getEmojiSvg(emoji)}</div>
      <div class="whimsical-banner-text">${meta.burstTitle}</div>
    `;

    dom.burstBanner.classList.remove('animate');
    void dom.burstBanner.offsetWidth;
    dom.burstBanner.classList.add('animate');
  }

  // ---------------------------------------------------------------------------
  // REACTION ENGINE (TOGGLE / INCREMENT / SOUND / PARTICLES)
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

    const rect = triggerElement ? triggerElement.getBoundingClientRect() : {
      left: window.innerWidth / 2,
      top: window.innerHeight / 2,
      width: 0,
      height: 0
    };
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (alreadyReacted) {
      state.userReactions[reactionKey] = false;
      if (reactionObj) {
        reactionObj.count -= 1;
        if (reactionObj.count <= 0) {
          msg.reactions = msg.reactions.filter(r => r.emoji !== emoji);
        }
      }
      playSound('pop');
    } else {
      state.userReactions[reactionKey] = true;
      if (reactionObj) {
        reactionObj.count += 1;
      } else {
        msg.reactions.push({ emoji, count: 1 });
      }

      if (emoji === '🔥') {
        playSound('fire');
      } else if (emoji === '🎉' || emoji === '🚀' || emoji === '🤩') {
        playSound('celebrate');
      } else {
        playSound('chime');
      }

      if (state.particlesEnabled) {
        launchWhimsicalPhysicsBurst(centerX, centerY, emoji);
        showWhimsicalBurstBanner(emoji);
      }
    }

    updateReactionsUI(msg, emoji);
  }

  function updateReactionsUI(msg, lastEmoji) {
    const wrapper = document.getElementById(`reactions-${msg.id}`);
    if (!wrapper) return;

    const reactionsHtml = msg.reactions.map(r => {
      const isUserReacted = state.userReactions[`${msg.id}_${r.emoji}`] || false;
      const justReactedClass = (r.emoji === lastEmoji) ? 'just-reacted' : '';
      return `
        <button class="reaction-pill ${isUserReacted ? 'active' : ''} ${justReactedClass}" data-msg-id="${msg.id}" data-emoji="${r.emoji}">
          <span class="emoji-wrap">${getEmojiSvg(r.emoji)}</span>
          <span class="reaction-count">${r.count}</span>
        </button>
      `;
    }).join('');

    wrapper.innerHTML = `
      ${reactionsHtml}
      <button class="btn-add-reaction" data-msg-id="${msg.id}" title="Add reaction">+</button>
    `;
  }

  // ---------------------------------------------------------------------------
  // DRAWER SETUP
  // ---------------------------------------------------------------------------
  function populateEmojiDrawer() {
    dom.animatedEmojiHighlightGrid.innerHTML = '';
    quickReactionsList.forEach(emoji => {
      const meta = animatedSvgDefs[emoji];
      const btn = document.createElement('button');
      btn.className = 'anim-highlight-btn';
      btn.title = `React with ${meta.label}`;
      btn.innerHTML = `
        <div style="width: 28px; height: 28px; display:flex; align-items:center; justify-content:center;">
          ${meta.svg}
        </div>
        <span class="anim-highlight-label">${meta.label}</span>
      `;

      btn.addEventListener('click', () => {
        const targetMsg = state.focusedMessageForReaction || (channelsData[state.currentChannel].messages[0] || {}).id;
        if (targetMsg) {
          handleEmojiReaction(targetMsg, emoji, btn);
        }
      });

      dom.animatedEmojiHighlightGrid.appendChild(btn);
    });

    renderGrid(dom.smileysGrid, standardEmojiCategories.smileys);
    renderGrid(dom.gesturesGrid, standardEmojiCategories.gestures);
    renderGrid(dom.symbolsGrid, standardEmojiCategories.symbols);
  }

  function renderGrid(container, emojiArray) {
    container.innerHTML = '';
    emojiArray.forEach(emoji => {
      const btn = document.createElement('button');
      btn.className = 'drawer-emoji-item';
      btn.textContent = emoji;
      btn.setAttribute('data-emoji', emoji);
      btn.title = emoji;

      btn.addEventListener('click', () => {
        if (state.focusedMessageForReaction) {
          handleEmojiReaction(state.focusedMessageForReaction, emoji, btn);
        } else {
          const input = document.getElementById('chatMessageInput');
          if (input) {
            input.value += emoji;
            input.focus();
          }
          if (state.particlesEnabled) {
            const rect = btn.getBoundingClientRect();
            launchWhimsicalPhysicsBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, emoji);
          }
          playSound('pop');
        }
      });

      container.appendChild(btn);
    });
  }

  function populateContextReactions() {
    dom.contextReactionsRow.innerHTML = '';
    quickReactionsList.slice(0, 6).forEach(emoji => {
      const btn = document.createElement('button');
      btn.className = 'quick-react-item';
      btn.setAttribute('data-emoji', emoji);
      btn.title = emoji;
      btn.innerHTML = getEmojiSvg(emoji);
      dom.contextReactionsRow.appendChild(btn);
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
  // CONTEXT MENU
  // ---------------------------------------------------------------------------
  function openContextMenu(x, y, messageId) {
    state.activeContextMessageId = messageId;
    dom.contextMenu.style.display = 'flex';

    const menuWidth = 210;
    const menuHeight = 240;
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
  // GLOBAL LISTENERS
  // ---------------------------------------------------------------------------
  function setupEventListeners() {
    dom.channelList.addEventListener('click', (e) => {
      const item = e.target.closest('.channel-item');
      if (!item) return;

      const channelKey = item.getAttribute('data-channel');
      if (channelKey === 'hng-premium-plus') {
        showToast('🔒 This channel requires HNG Premium Plus access');
        return;
      }

      renderChannel(channelKey);

      if (window.innerWidth <= 720) {
        dom.channelsSidebar.classList.remove('mobile-open');
      }
    });

    dom.mobileMenuBtn.addEventListener('click', () => {
      dom.channelsSidebar.classList.toggle('mobile-open');
    });

    dom.toggleEmojiPanelBtn.addEventListener('click', () => {
      toggleEmojiDrawer();
    });

    dom.drawerCloseBtn.addEventListener('click', () => {
      toggleEmojiDrawer(false);
    });

    dom.messagesFeed.addEventListener('click', (e) => {
      const quickBtn = e.target.closest('.quick-emoji-btn');
      if (quickBtn) {
        const msgId = quickBtn.getAttribute('data-msg-id');
        const emoji = quickBtn.getAttribute('data-emoji');
        handleEmojiReaction(msgId, emoji, quickBtn);
        return;
      }

      const reactionPill = e.target.closest('.reaction-pill');
      if (reactionPill) {
        const msgId = reactionPill.getAttribute('data-msg-id');
        const emoji = reactionPill.getAttribute('data-emoji');
        handleEmojiReaction(msgId, emoji, reactionPill);
        return;
      }

      const addReactionBtn = e.target.closest('.btn-add-reaction');
      if (addReactionBtn) {
        const msgId = addReactionBtn.getAttribute('data-msg-id');
        state.focusedMessageForReaction = msgId;
        toggleEmojiDrawer(true);
        showToast('Choose any animated emoji or sticker to react!');
        return;
      }

      const actionTrigger = e.target.closest('.quick-action-trigger');
      if (actionTrigger) {
        const msgId = actionTrigger.getAttribute('data-msg-id');
        const rect = actionTrigger.getBoundingClientRect();
        openContextMenu(rect.left, rect.bottom + 4, msgId);
        return;
      }
    });

    dom.messagesFeed.addEventListener('contextmenu', (e) => {
      const msgRow = e.target.closest('.message-row');
      if (msgRow) {
        e.preventDefault();
        openContextMenu(e.clientX, e.clientY, msgRow.id);
      }
    });

    dom.contextReactionsRow.addEventListener('click', (e) => {
      const reactBtn = e.target.closest('.quick-react-item');
      if (reactBtn && state.activeContextMessageId) {
        const emoji = reactBtn.getAttribute('data-emoji');
        handleEmojiReaction(state.activeContextMessageId, emoji, reactBtn);
        closeContextMenu();
      }
    });

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

    window.addEventListener('click', (e) => {
      if (!dom.contextMenu.contains(e.target) && !e.target.closest('.quick-action-trigger')) {
        closeContextMenu();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeContextMenu();
        if (dom.settingsModalBackdrop.classList.contains('open')) {
          dom.settingsModalBackdrop.classList.remove('open');
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        dom.globalSearchInput.focus();
      }
    });

    const btnStartBuzz = document.getElementById('btnStartBuzz');
    if (btnStartBuzz) {
      btnStartBuzz.addEventListener('click', () => {
        playSound('celebrate');
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
