// __GAME_SOURCE_INJECTION_MARKER__
// 游戏源码缓存（用于离线版下载，避免 file:// 协议下的 XHR 跨域限制）
const __GAME_SOURCE__ = (
  '// ============================================================' + '\n' +
  '// 共生与同行 — 双人合作解谜游戏' + '\n' +
  '// 零单人可能性 · 纯合作向' + '\n' +
  '// ============================================================' + '\n' +
  '' + '\n' +
  '(function() {' + '\n' +
  '  \'use strict\';' + '\n' +
  '' + '\n' +
  '  const canvas = document.getElementById(\'game\');' + '\n' +
  '  const ctx = canvas.getContext(\'2d\');' + '\n' +
  '  const W = canvas.width;   // 1280' + '\n' +
  '  const H = canvas.height;  // 720' + '\n' +
  '' + '\n' +
  '  // --- 自适应缩放 ---' + '\n' +
  '  function resize() {' + '\n' +
  '    const scale = Math.min(window.innerWidth / W, window.innerHeight / H) * 0.95;' + '\n' +
  '    canvas.style.width = (W * scale) + \'px\';' + '\n' +
  '    canvas.style.height = (H * scale) + \'px\';' + '\n' +
  '  }' + '\n' +
  '  window.addEventListener(\'resize\', resize);' + '\n' +
  '  resize();' + '\n' +
  '' + '\n' +
  '  // --- 物理常量 ---' + '\n' +
  '  const GRAVITY = 0.55;' + '\n' +
  '  const MOVE_SPEED = 4;' + '\n' +
  '  const JUMP_FORCE = -12.5;' + '\n' +
  '  const PLAYER_W = 28;' + '\n' +
  '  const PLAYER_H = 44;' + '\n' +
  '  const HEAD_R = 14;' + '\n' +
  '' + '\n' +
  '  // --- 彩蛋关星空穹顶 --- ' + '\n' +
  '  const stars = [];' + '\n' +
  '  function initStars() {' + '\n' +
  '    stars.length = 0;' + '\n' +
  '    // 约180颗星星，不同大小、亮度' + '\n' +
  '    for (let i = 0; i < 180; i++) {' + '\n' +
  '      stars.push({' + '\n' +
  '        x: Math.random() * W,' + '\n' +
  '        y: Math.random() * H * 0.75, // 主要在上半部分天空' + '\n' +
  '        size: Math.random() < 0.7 ? 1 : (Math.random() < 0.9 ? 1.8 : 2.6),' + '\n' +
  '        baseAlpha: 0.3 + Math.random() * 0.7,' + '\n' +
  '        twinkleSpeed: 0.01 + Math.random() * 0.025,' + '\n' +
  '        twinklePhase: Math.random() * Math.PI * 2,' + '\n' +
  '      });' + '\n' +
  '    }' + '\n' +
  '    // 几颗特别亮的"流星级"大星' + '\n' +
  '    for (let i = 0; i < 5; i++) {' + '\n' +
  '      stars.push({' + '\n' +
  '        x: Math.random() * W,' + '\n' +
  '        y: Math.random() * H * 0.6,' + '\n' +
  '        size: 3 + Math.random() * 2,' + '\n' +
  '        baseAlpha: 0.8 + Math.random() * 0.2,' + '\n' +
  '        twinkleSpeed: 0.015 + Math.random() * 0.02,' + '\n' +
  '        twinklePhase: Math.random() * Math.PI * 2,' + '\n' +
  '        isBright: true,' + '\n' +
  '      });' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '  initStars();' + '\n' +
  '' + '\n' +
  '  function drawStarryBackground(ctx, time) {' + '\n' +
  '    // 深蓝色夜空渐变' + '\n' +
  '    const g = ctx.createLinearGradient(0, 0, 0, H);' + '\n' +
  '    g.addColorStop(0, \'#0a0e2a\');  // 顶部：深靛蓝' + '\n' +
  '    g.addColorStop(0.5, \'#0f1438\'); // 中部：藏青色' + '\n' +
  '    g.addColorStop(1, \'#1a1f4a\');  // 底部：略浅的深蓝' + '\n' +
  '    ctx.fillStyle = g;' + '\n' +
  '    ctx.fillRect(0, 0, W, H);' + '\n' +
  '' + '\n' +
  '    // 星星闪烁' + '\n' +
  '    for (const s of stars) {' + '\n' +
  '      const twinkle = 0.7 + 0.3 * Math.sin(time * s.twinkleSpeed + s.twinklePhase);' + '\n' +
  '      const alpha = s.baseAlpha * twinkle;' + '\n' +
  '      if (s.isBright) {' + '\n' +
  '        // 亮星加发光光晕' + '\n' +
  '        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.3})`;' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);' + '\n' +
  '        ctx.fill();' + '\n' +
  '        ctx.fillStyle = `rgba(200,220,255,${alpha * 0.5})`;' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.arc(s.x, s.y, s.size * 1.5, 0, Math.PI * 2);' + '\n' +
  '        ctx.fill();' + '\n' +
  '      }' + '\n' +
  '      ctx.fillStyle = s.isBright' + '\n' +
  '        ? `rgba(255,255,255,${alpha})`' + '\n' +
  '        : `rgba(230,235,255,${alpha})`;' + '\n' +
  '      ctx.beginPath();' + '\n' +
  '      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);' + '\n' +
  '      ctx.fill();' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 右上角一轮弯月（淡淡的）' + '\n' +
  '    const moonX = W - 140;' + '\n' +
  '    const moonY = 120;' + '\n' +
  '    const moonR = 36;' + '\n' +
  '    // 月亮本体' + '\n' +
  '    const moonGrad = ctx.createRadialGradient(moonX - 8, moonY - 8, 4, moonX, moonY, moonR);' + '\n' +
  '    moonGrad.addColorStop(0, \'#fffdf0\');' + '\n' +
  '    moonGrad.addColorStop(0.5, \'#f7efd0\');' + '\n' +
  '    moonGrad.addColorStop(1, \'#e8dfb8\');' + '\n' +
  '    ctx.fillStyle = moonGrad;' + '\n' +
  '    ctx.beginPath();' + '\n' +
  '    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);' + '\n' +
  '    ctx.fill();' + '\n' +
  '    // 弯月阴影（用背景色叠出月牙形）' + '\n' +
  '    ctx.fillStyle = \'rgba(15,20,56,0.85)\';' + '\n' +
  '    ctx.beginPath();' + '\n' +
  '    ctx.arc(moonX + 14, moonY - 6, moonR * 0.92, 0, Math.PI * 2);' + '\n' +
  '    ctx.fill();' + '\n' +
  '    // 月亮柔光' + '\n' +
  '    ctx.fillStyle = \'rgba(255,248,200,0.08)\';' + '\n' +
  '    ctx.beginPath();' + '\n' +
  '    ctx.arc(moonX, moonY, moonR * 2.2, 0, Math.PI * 2);' + '\n' +
  '    ctx.fill();' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // --- 渐变配色（每关一套清新低饱和渐变，从上到下）---' + '\n' +
  '  const BG_GRADIENTS = [' + '\n' +
  '    [\'#e8f1f8\', \'#d6ece8\'], // 1 淡蓝→浅青' + '\n' +
  '    [\'#fbe9e7\', \'#fff0d6\'], // 2 淡粉→浅橙' + '\n' +
  '    [\'#e6f1df\', \'#fff8d6\'], // 3 淡绿→浅黄' + '\n' +
  '    [\'#efe4f0\', \'#fbe5ec\'], // 4 淡紫→浅粉' + '\n' +
  '    [\'#d9ecec\', \'#dde9f4\'], // 5 淡青→浅蓝' + '\n' +
  '    [\'#fdf3d6\', \'#e6efd8\'], // 6 淡黄→浅绿' + '\n' +
  '    [\'#fbe0e8\', \'#ece0f4\'], // 7 淡粉→浅紫' + '\n' +
  '    [\'#e0e9f2\', \'#e5e7e9\'], // 8 淡蓝→浅灰' + '\n' +
  '    [\'#e0ede0\', \'#d9ecec\'], // 9 淡绿→浅青' + '\n' +
  '    [\'#ffe9d6\', \'#fff6cc\'], // 10 淡橙→浅黄' + '\n' +
  '    [\'#e4dff0\', \'#dce6f3\'], // 11 淡紫→浅蓝' + '\n' +
  '    [\'#d5ece4\', \'#dcecd6\'], // 12 淡青→浅绿' + '\n' +
  '    [\'#f8ded8\', \'#ffe3cc\'], // 13 淡粉→浅橙' + '\n' +
  '    [\'#fff0d6\', \'#fbe0e8\'], // 14 淡黄→浅粉' + '\n' +
  '    [\'#dce8f5\', \'#e6dff0\', \'#fbe0ec\'], // 15 淡蓝→淡紫→淡粉（三色）' + '\n' +
  '  ];' + '\n' +
  '  const MENU_GRADIENT = [\'#f0eef7\', \'#e5eef5\', \'#e7f1ea\']; // 菜单背景（柔和三色）' + '\n' +
  '' + '\n' +
  '  function buildGradient(stops) {' + '\n' +
  '    const g = ctx.createLinearGradient(0, 0, 0, H);' + '\n' +
  '    for (let i = 0; i < stops.length; i++) {' + '\n' +
  '      g.addColorStop(i / (stops.length - 1), stops[i]);' + '\n' +
  '    }' + '\n' +
  '    return g;' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // --- 游戏状态 ---' + '\n' +
  '  const STATE = {' + '\n' +
  '    MENU: \'menu\',' + '\n' +
  '    LEVEL_SELECT: \'level_select\',' + '\n' +
  '    LEVEL_INTRO: \'level_intro\',' + '\n' +
  '    PLAYING: \'playing\',' + '\n' +
  '    FAILED: \'failed\',' + '\n' +
  '    LEVEL_CLEAR: \'level_clear\',' + '\n' +
  '    WIN: \'win\',' + '\n' +
  '    EGG_REVEAL: \'egg_reveal\'' + '\n' +
  '  };' + '\n' +
  '  let gameState = STATE.MENU;' + '\n' +
  '  let currentLevel = 0;' + '\n' +
  '  let introTimer = 0;' + '\n' +
  '  let clearTimer = 0;' + '\n' +
  '  let winHoldTime = 0;' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 音效系统（Web Audio API 程序化生成，无外部文件）' + '\n' +
  '  // ============================================================' + '\n' +
  '  const SFX = {' + '\n' +
  '    audioCtx: null,' + '\n' +
  '    muted: false,' + '\n' +
  '    masterGain: null,' + '\n' +
  '    bgmGain: null,' + '\n' +
  '    bgmTimer: null,' + '\n' +
  '    bgmStep: 0,' + '\n' +
  '' + '\n' +
  '    init() {' + '\n' +
  '      if (this.audioCtx) return;' + '\n' +
  '      try {' + '\n' +
  '        const Ctx = window.AudioContext || window.webkitAudioContext;' + '\n' +
  '        this.audioCtx = new Ctx();' + '\n' +
  '        this.masterGain = this.audioCtx.createGain();' + '\n' +
  '        this.masterGain.gain.value = 0.5;' + '\n' +
  '        this.masterGain.connect(this.audioCtx.destination);' + '\n' +
  '        this.bgmGain = this.audioCtx.createGain();' + '\n' +
  '        this.bgmGain.gain.value = 0.08;' + '\n' +
  '        this.bgmGain.connect(this.masterGain);' + '\n' +
  '      } catch (e) {' + '\n' +
  '        this.audioCtx = null;' + '\n' +
  '      }' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    toggleMute() {' + '\n' +
  '      this.muted = !this.muted;' + '\n' +
  '      if (this.masterGain) {' + '\n' +
  '        this.masterGain.gain.value = this.muted ? 0 : 0.5;' + '\n' +
  '      }' + '\n' +
  '      const btn = document.getElementById(\'muteBtn\');' + '\n' +
  '      if (btn) btn.textContent = this.muted ? \'🔇 静音\' : \'🔊 音效\';' + '\n' +
  '      return this.muted;' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // 短促"啵"声（跳跃）' + '\n' +
  '    playJump() {' + '\n' +
  '      try {' + '\n' +
  '        if (!this.audioCtx || this.muted) return;' + '\n' +
  '        const t = this.audioCtx.currentTime;' + '\n' +
  '        const osc = this.audioCtx.createOscillator();' + '\n' +
  '        const g = this.audioCtx.createGain();' + '\n' +
  '        osc.type = \'sine\';' + '\n' +
  '        osc.frequency.setValueAtTime(420, t);' + '\n' +
  '        osc.frequency.exponentialRampToValueAtTime(720, t + 0.12);' + '\n' +
  '        g.gain.setValueAtTime(0.001, t);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.25, t + 0.01);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);' + '\n' +
  '        osc.connect(g).connect(this.masterGain);' + '\n' +
  '        osc.start(t);' + '\n' +
  '        osc.stop(t + 0.17);' + '\n' +
  '      } catch (e) { /* 静默失败，不影响游戏 */ }' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // 清脆"叮"声（按钮/压力板按下）' + '\n' +
  '    playDing() {' + '\n' +
  '      try {' + '\n' +
  '        if (!this.audioCtx || this.muted) return;' + '\n' +
  '        const t = this.audioCtx.currentTime;' + '\n' +
  '        const osc = this.audioCtx.createOscillator();' + '\n' +
  '        const g = this.audioCtx.createGain();' + '\n' +
  '        osc.type = \'triangle\';' + '\n' +
  '        osc.frequency.setValueAtTime(880, t);' + '\n' +
  '        osc.frequency.exponentialRampToValueAtTime(1320, t + 0.08);' + '\n' +
  '        g.gain.setValueAtTime(0.001, t);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.2, t + 0.01);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);' + '\n' +
  '        osc.connect(g).connect(this.masterGain);' + '\n' +
  '        osc.start(t);' + '\n' +
  '        osc.stop(t + 0.32);' + '\n' +
  '      } catch (e) { /* 静默失败 */ }' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // 低沉滑动声（门开启）' + '\n' +
  '    playDoor() {' + '\n' +
  '      try {' + '\n' +
  '        if (!this.audioCtx || this.muted) return;' + '\n' +
  '        const t = this.audioCtx.currentTime;' + '\n' +
  '        const osc = this.audioCtx.createOscillator();' + '\n' +
  '        const g = this.audioCtx.createGain();' + '\n' +
  '        osc.type = \'sawtooth\';' + '\n' +
  '        osc.frequency.setValueAtTime(180, t);' + '\n' +
  '        osc.frequency.exponentialRampToValueAtTime(80, t + 0.4);' + '\n' +
  '        g.gain.setValueAtTime(0.001, t);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.12, t + 0.03);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);' + '\n' +
  '        osc.connect(g).connect(this.masterGain);' + '\n' +
  '        osc.start(t);' + '\n' +
  '        osc.stop(t + 0.47);' + '\n' +
  '      } catch (e) { /* 静默失败 */ }' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // 欢快上升音阶（通关每一关）' + '\n' +
  '    playClear() {' + '\n' +
  '      try {' + '\n' +
  '        if (!this.audioCtx || this.muted) return;' + '\n' +
  '        const t = this.audioCtx.currentTime;' + '\n' +
  '        const notes = [523, 659, 784, 1046]; // C5 E5 G5 C6' + '\n' +
  '        for (let i = 0; i < notes.length; i++) {' + '\n' +
  '          const osc = this.audioCtx.createOscillator();' + '\n' +
  '          const g = this.audioCtx.createGain();' + '\n' +
  '          osc.type = \'triangle\';' + '\n' +
  '          osc.frequency.setValueAtTime(notes[i], t + i * 0.09);' + '\n' +
  '          g.gain.setValueAtTime(0.001, t + i * 0.09);' + '\n' +
  '          g.gain.exponentialRampToValueAtTime(0.2, t + i * 0.09 + 0.02);' + '\n' +
  '          g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.25);' + '\n' +
  '          osc.connect(g).connect(this.masterGain);' + '\n' +
  '          osc.start(t + i * 0.09);' + '\n' +
  '          osc.stop(t + i * 0.09 + 0.27);' + '\n' +
  '        }' + '\n' +
  '      } catch (e) { /* 静默失败 */ }' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // 烟花发射"咻"声' + '\n' +
  '    playFireworkLaunch() {' + '\n' +
  '      try {' + '\n' +
  '        if (!this.audioCtx || this.muted) return;' + '\n' +
  '        const t = this.audioCtx.currentTime;' + '\n' +
  '        const osc = this.audioCtx.createOscillator();' + '\n' +
  '        const g = this.audioCtx.createGain();' + '\n' +
  '        osc.type = \'sine\';' + '\n' +
  '        osc.frequency.setValueAtTime(200, t);' + '\n' +
  '        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.6);' + '\n' +
  '        g.gain.setValueAtTime(0.001, t);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.15, t + 0.05);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);' + '\n' +
  '        osc.connect(g).connect(this.masterGain);' + '\n' +
  '        osc.start(t);' + '\n' +
  '        osc.stop(t + 0.67);' + '\n' +
  '      } catch (e) { /* 静默失败 */ }' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // 烟花爆炸"嘭"声' + '\n' +
  '    playFireworkBoom() {' + '\n' +
  '      try {' + '\n' +
  '        if (!this.audioCtx || this.muted) return;' + '\n' +
  '        const t = this.audioCtx.currentTime;' + '\n' +
  '        // 噪声爆炸' + '\n' +
  '        const bufferSize = this.audioCtx.sampleRate * 0.5;' + '\n' +
  '        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);' + '\n' +
  '        const data = buffer.getChannelData(0);' + '\n' +
  '        for (let i = 0; i < bufferSize; i++) {' + '\n' +
  '          data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);' + '\n' +
  '        }' + '\n' +
  '        const src = this.audioCtx.createBufferSource();' + '\n' +
  '        src.buffer = buffer;' + '\n' +
  '        const g = this.audioCtx.createGain();' + '\n' +
  '        g.gain.setValueAtTime(0.4, t);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);' + '\n' +
  '        const bp = this.audioCtx.createBiquadFilter();' + '\n' +
  '        bp.type = \'lowpass\';' + '\n' +
  '        bp.frequency.value = 800;' + '\n' +
  '        src.connect(bp).connect(g).connect(this.masterGain);' + '\n' +
  '        src.start(t);' + '\n' +
  '      } catch (e) { /* 静默失败 */ }' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // 引线火花嘶嘶声' + '\n' +
  '    playFuseSpark() {' + '\n' +
  '      try {' + '\n' +
  '        if (!this.audioCtx || this.muted) return;' + '\n' +
  '        const t = this.audioCtx.currentTime;' + '\n' +
  '        const duration = 2.0;' + '\n' +
  '        const bufferSize = this.audioCtx.sampleRate * duration;' + '\n' +
  '        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);' + '\n' +
  '        const data = buffer.getChannelData(0);' + '\n' +
  '        for (let i = 0; i < bufferSize; i++) {' + '\n' +
  '          // 嘶嘶声：白噪声 + 高频带通 + 随机爆点' + '\n' +
  '          data[i] = (Math.random() * 2 - 1) * 0.3;' + '\n' +
  '          if (Math.random() < 0.002) data[i] += (Math.random() * 2 - 1) * 0.8;' + '\n' +
  '        }' + '\n' +
  '        const src = this.audioCtx.createBufferSource();' + '\n' +
  '        src.buffer = buffer;' + '\n' +
  '        const g = this.audioCtx.createGain();' + '\n' +
  '        g.gain.setValueAtTime(0.001, t);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.12, t + 0.1);' + '\n' +
  '        g.gain.setValueAtTime(0.12, t + duration - 0.1);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.001, t + duration);' + '\n' +
  '        const hp = this.audioCtx.createBiquadFilter();' + '\n' +
  '        hp.type = \'highpass\';' + '\n' +
  '        hp.frequency.value = 2000;' + '\n' +
  '        src.connect(hp).connect(g).connect(this.masterGain);' + '\n' +
  '        src.start(t);' + '\n' +
  '        src.stop(t + duration + 0.1);' + '\n' +
  '      } catch (e) { /* 静默失败 */ }' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // 背景音乐：简单循环琶音' + '\n' +
  '    startBGM() {' + '\n' +
  '      if (!this.audioCtx || this.muted) return;' + '\n' +
  '      if (this.bgmTimer) return;' + '\n' +
  '      // C大调五声音阶式旋律' + '\n' +
  '      const melody = [' + '\n' +
  '        523, 659, 784, 659, 523, 659, 784, 1046,' + '\n' +
  '        880, 784, 659, 523, 587, 659, 587, 523,' + '\n' +
  '      ];' + '\n' +
  '      const bass = [262, 262, 196, 196, 220, 220, 262, 262];' + '\n' +
  '      this.bgmStep = 0;' + '\n' +
  '      const stepTime = 0.3;' + '\n' +
  '      const playNote = () => {' + '\n' +
  '        try {' + '\n' +
  '        if (!this.bgmTimer) return;' + '\n' +
  '        const t = this.audioCtx.currentTime;' + '\n' +
  '        // 主旋律' + '\n' +
  '        const idx = this.bgmStep % melody.length;' + '\n' +
  '        const osc = this.audioCtx.createOscillator();' + '\n' +
  '        const g = this.audioCtx.createGain();' + '\n' +
  '        osc.type = \'sine\';' + '\n' +
  '        osc.frequency.value = melody[idx];' + '\n' +
  '        g.gain.setValueAtTime(0.001, t);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);' + '\n' +
  '        g.gain.exponentialRampToValueAtTime(0.001, t + stepTime * 0.9);' + '\n' +
  '        osc.connect(g).connect(this.bgmGain);' + '\n' +
  '        osc.start(t);' + '\n' +
  '        osc.stop(t + stepTime);' + '\n' +
  '        // 低音（每两拍一个）' + '\n' +
  '        if (this.bgmStep % 2 === 0) {' + '\n' +
  '          const bIdx = (this.bgmStep / 2) % bass.length;' + '\n' +
  '          const bosc = this.audioCtx.createOscillator();' + '\n' +
  '          const bg = this.audioCtx.createGain();' + '\n' +
  '          bosc.type = \'triangle\';' + '\n' +
  '          bosc.frequency.value = bass[bIdx];' + '\n' +
  '          bg.gain.setValueAtTime(0.001, t);' + '\n' +
  '          bg.gain.exponentialRampToValueAtTime(0.15, t + 0.03);' + '\n' +
  '          bg.gain.exponentialRampToValueAtTime(0.001, t + stepTime * 1.8);' + '\n' +
  '          bosc.connect(bg).connect(this.bgmGain);' + '\n' +
  '          bosc.start(t);' + '\n' +
  '          bosc.stop(t + stepTime * 2);' + '\n' +
  '        }' + '\n' +
  '        this.bgmStep++;' + '\n' +
  '        } catch (e) { /* 静默失败 */ }' + '\n' +
  '      };' + '\n' +
  '      this.bgmTimer = setInterval(playNote, stepTime * 1000);' + '\n' +
  '      playNote();' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    stopBGM() {' + '\n' +
  '      if (this.bgmTimer) {' + '\n' +
  '        clearInterval(this.bgmTimer);' + '\n' +
  '        this.bgmTimer = null;' + '\n' +
  '      }' + '\n' +
  '    },' + '\n' +
  '  };' + '\n' +
  '' + '\n' +
  '  // 记录按钮/门的上次状态，避免重复播放' + '\n' +
  '  let _lastBtnStates = {};' + '\n' +
  '  let _lastDoorStates = {};' + '\n' +
  '  let _lastPlateStates = {};' + '\n' +
  '' + '\n' +
  '  function playSfxIfChanged(map, id, nowActive, sfxFn) {' + '\n' +
  '    const prev = map[id];' + '\n' +
  '    if (nowActive && !prev) sfxFn();' + '\n' +
  '    map[id] = nowActive;' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // --- 存档 ---' + '\n' +
  '  const STORAGE_KEY = \'symbiosis_progress\';' + '\n' +
  '  function getUnlockedLevel() {' + '\n' +
  '    try {' + '\n' +
  '      const v = parseInt(localStorage.getItem(STORAGE_KEY) || \'0\', 10);' + '\n' +
  '      return Math.max(0, Math.min(LEVELS.length - 1, v));' + '\n' +
  '    } catch (e) { return 0; }' + '\n' +
  '  }' + '\n' +
  '  function saveProgress(levelIdx) {' + '\n' +
  '    try {' + '\n' +
  '      const cur = getUnlockedLevel();' + '\n' +
  '      if (levelIdx > cur) localStorage.setItem(STORAGE_KEY, String(levelIdx));' + '\n' +
  '    } catch (e) {}' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // --- 输入 ---' + '\n' +
  '  const keys = {};' + '\n' +
  '  // 键名规范化：同时支持 e.code 和 e.key，兼容不同键盘布局和输入法' + '\n' +
  '  // 统一映射到标准 code 名' + '\n' +
  '  const KEY_MAP = {' + '\n' +
  '    // W / 上' + '\n' +
  '    \'KeyW\': \'KeyW\', \'w\': \'KeyW\', \'W\': \'KeyW\', \'ArrowUp\': \'ArrowUp\', \'Up\': \'ArrowUp\',' + '\n' +
  '    // A / 左' + '\n' +
  '    \'KeyA\': \'KeyA\', \'a\': \'KeyA\', \'A\': \'KeyA\', \'ArrowLeft\': \'ArrowLeft\', \'Left\': \'ArrowLeft\',' + '\n' +
  '    // S / 下' + '\n' +
  '    \'KeyS\': \'KeyS\', \'s\': \'KeyS\', \'S\': \'KeyS\', \'ArrowDown\': \'ArrowDown\', \'Down\': \'ArrowDown\',' + '\n' +
  '    // D / 右' + '\n' +
  '    \'KeyD\': \'KeyD\', \'d\': \'KeyD\', \'D\': \'KeyD\', \'ArrowRight\': \'ArrowRight\', \'Right\': \'ArrowRight\',' + '\n' +
  '    // 空格' + '\n' +
  '    \'Space\': \'Space\', \' \': \'Space\',' + '\n' +
  '    // R / 重置' + '\n' +
  '    \'KeyR\': \'KeyR\', \'r\': \'KeyR\', \'R\': \'KeyR\',' + '\n' +
  '    // ESC' + '\n' +
  '    \'Escape\': \'Escape\', \'Esc\': \'Escape\',' + '\n' +
  '  };' + '\n' +
  '  function normalizeKey(e) {' + '\n' +
  '    // 优先用 e.code，其次用 e.key 映射，最后用 keyCode 推断' + '\n' +
  '    if (e.code && KEY_MAP[e.code]) return KEY_MAP[e.code];' + '\n' +
  '    if (e.key && KEY_MAP[e.key]) return KEY_MAP[e.key];' + '\n' +
  '    // 兜底：用 keyCode 推断 (W=87, A=65, S=83, D=68, 上=38, 左=37, 下=40, 右=39, 空格=32, R=82, ESC=27)' + '\n' +
  '    const kc = e.keyCode || e.which;' + '\n' +
  '    if (kc === 87) return \'KeyW\';' + '\n' +
  '    if (kc === 65) return \'KeyA\';' + '\n' +
  '    if (kc === 83) return \'KeyS\';' + '\n' +
  '    if (kc === 68) return \'KeyD\';' + '\n' +
  '    if (kc === 38) return \'ArrowUp\';' + '\n' +
  '    if (kc === 37) return \'ArrowLeft\';' + '\n' +
  '    if (kc === 40) return \'ArrowDown\';' + '\n' +
  '    if (kc === 39) return \'ArrowRight\';' + '\n' +
  '    if (kc === 32) return \'Space\';' + '\n' +
  '    if (kc === 82) return \'KeyR\';' + '\n' +
  '    if (kc === 27) return \'Escape\';' + '\n' +
  '    return e.code || e.key || (\'key_\' + kc);' + '\n' +
  '  }' + '\n' +
  '  // 使用捕获阶段，确保即使按钮/UI元素获取焦点也能收到按键' + '\n' +
  '  window.addEventListener(\'keydown\', e => {' + '\n' +
  '    const k = normalizeKey(e);' + '\n' +
  '    keys[k] = true;' + '\n' +
  '    if (k === \'KeyR\' && (gameState === STATE.PLAYING || gameState === STATE.FAILED)) {' + '\n' +
  '      loadLevel(currentLevel);' + '\n' +
  '      gameState = STATE.PLAYING;' + '\n' +
  '      document.getElementById(\'failScreen\').classList.add(\'hidden\');' + '\n' +
  '    }' + '\n' +
  '    if (k === \'Escape\' && gameState === STATE.PLAYING) {' + '\n' +
  '      showFailed();' + '\n' +
  '    }' + '\n' +
  '    if ([\'Space\',\'ArrowUp\',\'ArrowDown\',\'ArrowLeft\',\'ArrowRight\',\'KeyW\',\'KeyA\',\'KeyS\',\'KeyD\'].includes(k)) {' + '\n' +
  '      e.preventDefault();' + '\n' +
  '    }' + '\n' +
  '  }, true);' + '\n' +
  '  window.addEventListener(\'keyup\', e => {' + '\n' +
  '    const k = normalizeKey(e);' + '\n' +
  '    keys[k] = false;' + '\n' +
  '  }, true);' + '\n' +
  '  // 窗口失焦时清空所有按键状态，避免按键粘滞' + '\n' +
  '  window.addEventListener(\'blur\', () => {' + '\n' +
  '    for (const k in keys) keys[k] = false;' + '\n' +
  '  });' + '\n' +
  '' + '\n' +
  '  // --- 工具：矩形碰撞 ---' + '\n' +
  '  function rectCollide(a, b) {' + '\n' +
  '    return a.x < b.x + b.w && a.x + a.w > b.x &&' + '\n' +
  '           a.y < b.y + b.h && a.y + a.h > b.y;' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 玩家类' + '\n' +
  '  // ============================================================' + '\n' +
  '  class Player {' + '\n' +
  '    constructor(x, y, color, controls) {' + '\n' +
  '      this.x = x;' + '\n' +
  '      this.y = y;' + '\n' +
  '      this.vx = 0;' + '\n' +
  '      this.vy = 0;' + '\n' +
  '      this.w = PLAYER_W;' + '\n' +
  '      this.h = PLAYER_H;' + '\n' +
  '      this.color = color;' + '\n' +
  '      this.controls = controls;' + '\n' +
  '      this.onGround = false;' + '\n' +
  '      this.facing = 1;' + '\n' +
  '      this.wasOnGround = false;' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    update(solids, boxes, allPlayers) {' + '\n' +
  '      // 水平输入' + '\n' +
  '      let moveDir = 0;' + '\n' +
  '      const leftPressed = !!keys[this.controls.left];' + '\n' +
  '      const rightPressed = !!keys[this.controls.right];' + '\n' +
  '      const jumpPressed = !!keys[this.controls.jump];' + '\n' +
  '      if (leftPressed) moveDir -= 1;' + '\n' +
  '      if (rightPressed) moveDir += 1;' + '\n' +
  '      this.vx = moveDir * MOVE_SPEED;' + '\n' +
  '      if (moveDir !== 0) this.facing = moveDir;' + '\n' +
  '' + '\n' +
  '      // 跳跃' + '\n' +
  '      if (jumpPressed && this.onGround) {' + '\n' +
  '        this.vy = JUMP_FORCE;' + '\n' +
  '        this.onGround = false;' + '\n' +
  '        SFX.playJump();' + '\n' +
  '      }' + '\n' +
  '' + '\n' +
  '      // 重力' + '\n' +
  '      this.vy += GRAVITY;' + '\n' +
  '      if (this.vy > 18) this.vy = 18;' + '\n' +
  '' + '\n' +
  '      this.wasOnGround = this.onGround;' + '\n' +
  '' + '\n' +
  '      // 水平移动 + 碰撞' + '\n' +
  '      this.x += this.vx;' + '\n' +
  '      this.resolveH(solids, boxes, allPlayers);' + '\n' +
  '' + '\n' +
  '      // 垂直移动 + 碰撞' + '\n' +
  '      this.y += this.vy;' + '\n' +
  '      this.onGround = false;' + '\n' +
  '      this.resolveV(solids, boxes);' + '\n' +
  '' + '\n' +
  '      // 边界' + '\n' +
  '      if (this.x < 0) { this.x = 0; this.vx = 0; }' + '\n' +
  '      if (this.x + this.w > W) { this.x = W - this.w; this.vx = 0; }' + '\n' +
  '' + '\n' +
  '      // 掉出屏幕' + '\n' +
  '      if (this.y > H + 200) return true;' + '\n' +
  '      return false;' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    resolveH(solids, boxes, allPlayers) {' + '\n' +
  '      for (const s of solids) {' + '\n' +
  '        if (rectCollide(this, s)) {' + '\n' +
  '          if (this.vx > 0) this.x = s.x - this.w;' + '\n' +
  '          else if (this.vx < 0) this.x = s.x + s.w;' + '\n' +
  '          this.vx = 0;' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '      // 推箱子' + '\n' +
  '      for (const b of boxes) {' + '\n' +
  '        if (rectCollide(this, b)) {' + '\n' +
  '          const pushDir = this.vx > 0 ? 1 : (this.vx < 0 ? -1 : 0);' + '\n' +
  '          if (pushDir !== 0) {' + '\n' +
  '            const pushed = b.tryPush(pushDir, solids, boxes, this, allPlayers);' + '\n' +
  '            if (!pushed) {' + '\n' +
  '              if (pushDir > 0) this.x = b.x - this.w;' + '\n' +
  '              else this.x = b.x + b.w;' + '\n' +
  '              this.vx = 0;' + '\n' +
  '            } else {' + '\n' +
  '              // 推动了，重新对齐' + '\n' +
  '              if (pushDir > 0 && this.x + this.w > b.x) this.x = b.x - this.w;' + '\n' +
  '              if (pushDir < 0 && this.x < b.x + b.w) this.x = b.x + b.w;' + '\n' +
  '            }' + '\n' +
  '          }' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    resolveV(solids, boxes) {' + '\n' +
  '      for (const s of solids) {' + '\n' +
  '        if (rectCollide(this, s)) {' + '\n' +
  '          if (this.vy > 0) {' + '\n' +
  '            this.y = s.y - this.h;' + '\n' +
  '            this.onGround = true;' + '\n' +
  '          } else if (this.vy < 0) {' + '\n' +
  '            this.y = s.y + s.h;' + '\n' +
  '          }' + '\n' +
  '          this.vy = 0;' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '      // 站在箱子上' + '\n' +
  '      for (const b of boxes) {' + '\n' +
  '        if (rectCollide(this, b)) {' + '\n' +
  '          if (this.vy > 0) {' + '\n' +
  '            this.y = b.y - this.h;' + '\n' +
  '            this.onGround = true;' + '\n' +
  '          } else if (this.vy < 0) {' + '\n' +
  '            this.y = b.y + b.h;' + '\n' +
  '          }' + '\n' +
  '          this.vy = 0;' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    collidesRect(r) {' + '\n' +
  '      return rectCollide(this, r);' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    draw(ctx) {' + '\n' +
  '      ctx.save();' + '\n' +
  '      const cx = this.x + this.w / 2;' + '\n' +
  '      const headY = this.y + HEAD_R;' + '\n' +
  '      const bodyY = this.y + HEAD_R * 2 - 2;' + '\n' +
  '      const bodyH = this.h - HEAD_R * 2 + 2;' + '\n' +
  '      const bw = this.w - 6;' + '\n' +
  '      const bx = this.x + 3;' + '\n' +
  '' + '\n' +
  '      if (this.color === \'black\') {' + '\n' +
  '        ctx.fillStyle = \'#0a0a0a\';' + '\n' +
  '        // 头' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.arc(cx, headY, HEAD_R, 0, Math.PI * 2);' + '\n' +
  '        ctx.fill();' + '\n' +
  '        // 身体' + '\n' +
  '        ctx.fillRect(bx, bodyY, bw, bodyH);' + '\n' +
  '      } else {' + '\n' +
  '        ctx.fillStyle = \'#ffffff\';' + '\n' +
  '        ctx.strokeStyle = \'#1a1a1a\';' + '\n' +
  '        ctx.lineWidth = 1.5;' + '\n' +
  '        // 头' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.arc(cx, headY, HEAD_R, 0, Math.PI * 2);' + '\n' +
  '        ctx.fill();' + '\n' +
  '        ctx.stroke();' + '\n' +
  '        // 身体' + '\n' +
  '        ctx.fillRect(bx, bodyY, bw, bodyH);' + '\n' +
  '        ctx.strokeRect(bx + 0.5, bodyY + 0.5, bw - 1, bodyH - 1);' + '\n' +
  '      }' + '\n' +
  '      ctx.restore();' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 箱子' + '\n' +
  '  // ============================================================' + '\n' +
  '  class Box {' + '\n' +
  '    constructor(x, y, w, h, id = null, heavy = false) {' + '\n' +
  '      this.x = x; this.y = y;' + '\n' +
  '      this.w = w; this.h = h;' + '\n' +
  '      this.vy = 0;' + '\n' +
  '      this.onGround = false;' + '\n' +
  '      this.id = id;' + '\n' +
  '      this.heavy = heavy; // 重箱：需要两人同时推才动' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    update(solids, boxes, players) {' + '\n' +
  '      this.vy += GRAVITY * 0.8;' + '\n' +
  '      if (this.vy > 15) this.vy = 15;' + '\n' +
  '      this.y += this.vy;' + '\n' +
  '      this.onGround = false;' + '\n' +
  '' + '\n' +
  '      const allSolids = solids.slice();' + '\n' +
  '      for (const b of boxes) if (b !== this) allSolids.push(b);' + '\n' +
  '' + '\n' +
  '      for (const s of allSolids) {' + '\n' +
  '        if (rectCollide(this, s)) {' + '\n' +
  '          if (this.vy > 0) {' + '\n' +
  '            this.y = s.y - this.h;' + '\n' +
  '            this.onGround = true;' + '\n' +
  '          } else if (this.vy < 0) {' + '\n' +
  '            this.y = s.y + s.h;' + '\n' +
  '          }' + '\n' +
  '          this.vy = 0;' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '      if (this.y > H + 200) return true;' + '\n' +
  '      return false;' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    tryPush(dir, solids, boxes, pusher, allPlayers = null) {' + '\n' +
  '      if (!this.onGround) return false;' + '\n' +
  '      // 重箱子：需要两个玩家在同一侧同时推才动' + '\n' +
  '      if (this.heavy && allPlayers) {' + '\n' +
  '        let pushCount = 0;' + '\n' +
  '        for (const p of allPlayers) {' + '\n' +
  '          if (p === pusher) { pushCount++; continue; }' + '\n' +
  '          // 检查另一个玩家是否也在同方向推这个箱子' + '\n' +
  '          if (p.vx === 0) continue;' + '\n' +
  '          const otherDir = p.vx > 0 ? 1 : -1;' + '\n' +
  '          if (otherDir !== dir) continue;' + '\n' +
  '          // 检查是否与箱子相邻（水平方向）' + '\n' +
  '          if (dir > 0 && Math.abs((p.x + p.w) - this.x) < 3 && p.y + p.h > this.y && p.y < this.y + this.h) {' + '\n' +
  '            pushCount++;' + '\n' +
  '          } else if (dir < 0 && Math.abs(p.x - (this.x + this.w)) < 3 && p.y + p.h > this.y && p.y < this.y + this.h) {' + '\n' +
  '            pushCount++;' + '\n' +
  '          }' + '\n' +
  '        }' + '\n' +
  '        if (pushCount < 2) return false;' + '\n' +
  '      }' + '\n' +
  '      const step = 2;' + '\n' +
  '      const oldX = this.x;' + '\n' +
  '      this.x += dir * step;' + '\n' +
  '' + '\n' +
  '      const allSolids = solids.slice();' + '\n' +
  '      for (const b of boxes) if (b !== this) allSolids.push(b);' + '\n' +
  '      for (const s of allSolids) {' + '\n' +
  '        if (rectCollide(this, s)) {' + '\n' +
  '          this.x = oldX;' + '\n' +
  '          return false;' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '      // 边界' + '\n' +
  '      if (this.x < 0 || this.x + this.w > W) {' + '\n' +
  '        this.x = oldX;' + '\n' +
  '        return false;' + '\n' +
  '      }' + '\n' +
  '      return true;' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    draw(ctx) {' + '\n' +
  '      ctx.fillStyle = \'#777\';' + '\n' +
  '      ctx.fillRect(this.x, this.y, this.w, this.h);' + '\n' +
  '      ctx.strokeStyle = \'#444\';' + '\n' +
  '      ctx.lineWidth = 2;' + '\n' +
  '      ctx.strokeRect(this.x + 1, this.y + 1, this.w - 2, this.h - 2);' + '\n' +
  '      ctx.strokeStyle = \'rgba(0,0,0,0.15)\';' + '\n' +
  '      ctx.lineWidth = 1;' + '\n' +
  '      ctx.beginPath();' + '\n' +
  '      ctx.moveTo(this.x + this.w / 2, this.y + 5);' + '\n' +
  '      ctx.lineTo(this.x + this.w / 2, this.y + this.h - 5);' + '\n' +
  '      ctx.moveTo(this.x + 5, this.y + this.h / 2);' + '\n' +
  '      ctx.lineTo(this.x + this.w - 5, this.y + this.h / 2);' + '\n' +
  '      ctx.stroke();' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 压力板（持续踩住才生效）' + '\n' +
  '  // ============================================================' + '\n' +
  '  class PressurePlate {' + '\n' +
  '    constructor(x, y, w, id, targetId) {' + '\n' +
  '      this.x = x; this.y = y;' + '\n' +
  '      this.w = w; this.h = 8;' + '\n' +
  '      this.id = id;' + '\n' +
  '      this.targetId = targetId;' + '\n' +
  '      this.pressed = false;' + '\n' +
  '    }' + '\n' +
  '    check(players, boxes) {' + '\n' +
  '      let pressed = false;' + '\n' +
  '      // 压力板检测：玩家脚底位置落在「板顶上方 12px 到 板下方 12px」范围内' + '\n' +
  '      // 由于压力板不是固体，玩家会穿过它落到下方平台上，所以检测范围需足够包容' + '\n' +
  '      const top = this.y - 12;' + '\n' +
  '      const bottom = this.y + this.h + 12;' + '\n' +
  '      for (const p of players) {' + '\n' +
  '        if (p.x + p.w > this.x + 2 && p.x < this.x + this.w - 2 &&' + '\n' +
  '            p.y + p.h >= top && p.y + p.h <= bottom && p.onGround) {' + '\n' +
  '          pressed = true; break;' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '      if (!pressed) {' + '\n' +
  '        for (const b of boxes) {' + '\n' +
  '          if (b.x + b.w > this.x + 2 && b.x < this.x + this.w - 2 &&' + '\n' +
  '              b.y + b.h >= top && b.y + b.h <= bottom) {' + '\n' +
  '            pressed = true; break;' + '\n' +
  '          }' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '      this.pressed = pressed;' + '\n' +
  '      return pressed;' + '\n' +
  '    }' + '\n' +
  '    draw(ctx) {' + '\n' +
  '      const h = this.pressed ? 4 : 8;' + '\n' +
  '      const y = this.pressed ? this.y + 4 : this.y;' + '\n' +
  '      ctx.fillStyle = this.pressed ? \'#444\' : \'#888\';' + '\n' +
  '      ctx.fillRect(this.x, y, this.w, h);' + '\n' +
  '      ctx.fillStyle = \'rgba(0,0,0,0.25)\';' + '\n' +
  '      ctx.fillRect(this.x, y + h - 2, this.w, 2);' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 按钮（踩一次即永久激活）' + '\n' +
  '  // ============================================================' + '\n' +
  '  class Button {' + '\n' +
  '    constructor(x, y, id, targetId, opts) {' + '\n' +
  '      this.x = x; this.y = y;' + '\n' +
  '      this.w = 32; this.h = 10;' + '\n' +
  '      this.id = id;' + '\n' +
  '      this.targetId = targetId;' + '\n' +
  '      this.momentary = !!(opts && opts.momentary); // 瞬动：松开即复位（用于时序门）' + '\n' +
  '      this.activated = false; // 已永久激活（仅非瞬动模式）' + '\n' +
  '      this.pressed = false;   // 当前是否被踩着（用于视觉）' + '\n' +
  '    }' + '\n' +
  '    check(players) {' + '\n' +
  '      let onIt = false;' + '\n' +
  '      const top = this.y - 12;' + '\n' +
  '      const bottom = this.y + this.h + 12;' + '\n' +
  '      for (const p of players) {' + '\n' +
  '        if (p.x + p.w > this.x + 2 && p.x < this.x + this.w - 2 &&' + '\n' +
  '            p.y + p.h >= top && p.y + p.h <= bottom && p.onGround) {' + '\n' +
  '          onIt = true;' + '\n' +
  '          if (!this.momentary && !this.activated) this.activated = true;' + '\n' +
  '          break;' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '      this.pressed = this.momentary ? onIt : (this.activated || onIt);' + '\n' +
  '      return this.momentary ? onIt : this.activated;' + '\n' +
  '    }' + '\n' +
  '    draw(ctx) {' + '\n' +
  '      const active = this.momentary ? this.pressed : this.activated;' + '\n' +
  '      const h = active ? 4 : 10;' + '\n' +
  '      const y = active ? this.y + 6 : this.y;' + '\n' +
  '      ctx.fillStyle = active ? \'#222\' : \'#777\';' + '\n' +
  '      ctx.fillRect(this.x, y, this.w, h);' + '\n' +
  '      ctx.fillStyle = \'rgba(0,0,0,0.35)\';' + '\n' +
  '      ctx.fillRect(this.x - 3, this.y + 8, this.w + 6, 2);' + '\n' +
  '      // 激活后显示一个小光点' + '\n' +
  '      if (active) {' + '\n' +
  '        ctx.fillStyle = \'#fff\';' + '\n' +
  '        ctx.fillRect(this.x + this.w / 2 - 1, y + 1, 2, 2);' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 门' + '\n' +
  '  // ============================================================' + '\n' +
  '  class Door {' + '\n' +
  '    constructor(x, y, w, h, id, mode = \'any\', options = {}) {' + '\n' +
  '      this.x = x; this.y = y;' + '\n' +
  '      this.w = w; this.h = h;' + '\n' +
  '      this.id = id;' + '\n' +
  '      this.mode = mode; // \'any\' | \'all\' | \'timed\'' + '\n' +
  '      this.open = false;' + '\n' +
  '      this.openAmount = 0;' + '\n' +
  '      this.timer = 0;' + '\n' +
  '      this.timedDuration = options.duration || 180; // 时序门开启持续帧数（默认3秒）' + '\n' +
  '      this._prevTriggered = false;' + '\n' +
  '    }' + '\n' +
  '    update(triggered) {' + '\n' +
  '      if (this.mode === \'timed\') {' + '\n' +
  '        // 时序模式：触发源从false变true时开启计时，持续时间后关闭' + '\n' +
  '        if (triggered && !this._prevTriggered) {' + '\n' +
  '          this.timer = this.timedDuration;' + '\n' +
  '        }' + '\n' +
  '        this.timer--;' + '\n' +
  '        this.open = this.timer > 0;' + '\n' +
  '      } else {' + '\n' +
  '        this.open = triggered;' + '\n' +
  '      }' + '\n' +
  '      this._prevTriggered = triggered;' + '\n' +
  '      const target = this.open ? 1 : 0;' + '\n' +
  '      this.openAmount += (target - this.openAmount) * 0.2;' + '\n' +
  '    }' + '\n' +
  '    get collideRect() {' + '\n' +
  '      const openH = this.h * (1 - this.openAmount);' + '\n' +
  '      return { x: this.x, y: this.y + (this.h - openH), w: this.w, h: openH };' + '\n' +
  '    }' + '\n' +
  '    isSolid() {' + '\n' +
  '      // 门洞开启超过一半时即可通过（玩家身高约为门高的一半）' + '\n' +
  '      return this.openAmount < 0.5;' + '\n' +
  '    }' + '\n' +
  '    draw(ctx) {' + '\n' +
  '      const openH = this.h * (1 - this.openAmount);' + '\n' +
  '      const oy = this.y + (this.h - openH);' + '\n' +
  '' + '\n' +
  '      // 门框' + '\n' +
  '      ctx.strokeStyle = \'rgba(0,0,0,0.35)\';' + '\n' +
  '      ctx.lineWidth = 2;' + '\n' +
  '      ctx.strokeRect(this.x, this.y, this.w, this.h);' + '\n' +
  '' + '\n' +
  '      // 门扇' + '\n' +
  '      if (openH > 2) {' + '\n' +
  '        ctx.fillStyle = \'#2a2a2a\';' + '\n' +
  '        ctx.fillRect(this.x, oy, this.w, openH);' + '\n' +
  '        ctx.fillStyle = \'rgba(255,255,255,0.06)\';' + '\n' +
  '        ctx.fillRect(this.x + 2, oy + 2, this.w - 4, openH - 4);' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 移动平台' + '\n' +
  '  // ============================================================' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 切换平台（踩开关切换显隐状态）' + '\n' +
  '  // ============================================================' + '\n' +
  '  class TogglePlatform {' + '\n' +
  '    constructor(x, y, w, h, id, triggerId = null, group = \'A\', initialVisible = true) {' + '\n' +
  '      this.x = x; this.y = y;' + '\n' +
  '      this.w = w; this.h = h;' + '\n' +
  '      this.id = id;' + '\n' +
  '      this.triggerId = triggerId; // 控制它的开关id' + '\n' +
  '      this.group = group; // 同一组的切换平台共享开关' + '\n' +
  '      this.visible = initialVisible;' + '\n' +
  '      this.visibleAmount = initialVisible ? 1 : 0; // 用于渐显渐隐动画' + '\n' +
  '    }' + '\n' +
  '    update(show) {' + '\n' +
  '      this.visible = show;' + '\n' +
  '      const target = show ? 1 : 0;' + '\n' +
  '      this.visibleAmount += (target - this.visibleAmount) * 0.2;' + '\n' +
  '    }' + '\n' +
  '    get isSolid() {' + '\n' +
  '      // 显示超过50%时才是固体' + '\n' +
  '      return this.visibleAmount > 0.5;' + '\n' +
  '    }' + '\n' +
  '    draw(ctx) {' + '\n' +
  '      ctx.save();' + '\n' +
  '      ctx.globalAlpha = 0.2 + this.visibleAmount * 0.65;' + '\n' +
  '      ctx.fillStyle = \'#444\';' + '\n' +
  '      ctx.fillRect(this.x, this.y, this.w, this.h);' + '\n' +
  '      if (this.visibleAmount > 0.3) {' + '\n' +
  '        ctx.fillStyle = \'rgba(255,255,255,0.12)\';' + '\n' +
  '        ctx.fillRect(this.x, this.y, this.w, 2);' + '\n' +
  '      }' + '\n' +
  '      // 虚线轮廓表示组身份' + '\n' +
  '      ctx.strokeStyle = this.group === \'A\' ? \'rgba(255,255,255,0.3)\' : \'rgba(0,0,0,0.3)\';' + '\n' +
  '      ctx.setLineDash([4, 4]);' + '\n' +
  '      ctx.lineWidth = 1;' + '\n' +
  '      ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.w - 1, this.h - 1);' + '\n' +
  '      ctx.setLineDash([]);' + '\n' +
  '      ctx.restore();' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 移动尖刺（碰到即重置）' + '\n' +
  '  // ============================================================' + '\n' +
  '  class Spike {' + '\n' +
  '    constructor(x, y, w, h, x2, y2, speed, triggerId = null, mode = \'any\', initiallyActive = true) {' + '\n' +
  '      this.startX = x; this.startY = y;' + '\n' +
  '      this.endX = x2; this.endY = y2;' + '\n' +
  '      this.x = x; this.y = y;' + '\n' +
  '      this.w = w; this.h = h;' + '\n' +
  '      this.speed = speed;' + '\n' +
  '      this.progress = 0;' + '\n' +
  '      this.dir = 1;' + '\n' +
  '      this.triggerId = triggerId; // 如果有triggerId，则触发时暂停移动' + '\n' +
  '      this.mode = mode; // \'any\' 或 \'all\'' + '\n' +
  '      this.active = initiallyActive;' + '\n' +
  '      this.frozen = false;' + '\n' +
  '    }' + '\n' +
  '    update(frozen) {' + '\n' +
  '      this.frozen = frozen;' + '\n' +
  '      if (frozen) return;' + '\n' +
  '      if (this.speed <= 0) return; // 静态尖刺，不移动' + '\n' +
  '      const dx = this.endX - this.startX;' + '\n' +
  '      const dy = this.endY - this.startY;' + '\n' +
  '      const dist = Math.sqrt(dx * dx + dy * dy) || 1;' + '\n' +
  '      const step = this.speed / dist;' + '\n' +
  '      this.progress += step * this.dir;' + '\n' +
  '      if (this.progress >= 1) { this.progress = 1; this.dir = -1; }' + '\n' +
  '      if (this.progress <= 0) { this.progress = 0; this.dir = 1; }' + '\n' +
  '      this.x = this.startX + dx * this.progress;' + '\n' +
  '      this.y = this.startY + dy * this.progress;' + '\n' +
  '    }' + '\n' +
  '    collidesPlayer(p) {' + '\n' +
  '      return rectCollide(this, p);' + '\n' +
  '    }' + '\n' +
  '    draw(ctx) {' + '\n' +
  '      ctx.save();' + '\n' +
  '      ctx.fillStyle = this.frozen ? \'#555\' : \'#2a2a2a\';' + '\n' +
  '      // 尖刺是向上的三角形阵列' + '\n' +
  '      const spikeCount = Math.max(1, Math.floor(this.w / 10));' + '\n' +
  '      const sw = this.w / spikeCount;' + '\n' +
  '      for (let i = 0; i < spikeCount; i++) {' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.moveTo(this.x + i * sw, this.y + this.h);' + '\n' +
  '        ctx.lineTo(this.x + i * sw + sw / 2, this.y);' + '\n' +
  '        ctx.lineTo(this.x + (i + 1) * sw, this.y + this.h);' + '\n' +
  '        ctx.closePath();' + '\n' +
  '        ctx.fill();' + '\n' +
  '      }' + '\n' +
  '      // 底座' + '\n' +
  '      ctx.fillStyle = this.frozen ? \'#777\' : \'#444\';' + '\n' +
  '      ctx.fillRect(this.x, this.y + this.h - 4, this.w, 4);' + '\n' +
  '      ctx.restore();' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 移动平台' + '\n' +
  '  // ============================================================' + '\n' +
  '  class MovingPlatform {' + '\n' +
  '    constructor(x, y, w, h, x2, y2, speed, triggerId = null, mode = \'hold\') {' + '\n' +
  '      this.startX = x; this.startY = y;' + '\n' +
  '      this.endX = x2; this.endY = y2;' + '\n' +
  '      this.x = x; this.y = y;' + '\n' +
  '      this.w = w; this.h = h;' + '\n' +
  '      this.speed = speed;' + '\n' +
  '      this.progress = 0;' + '\n' +
  '      this.dir = 1;' + '\n' +
  '      this.triggerId = triggerId;' + '\n' +
  '      this.mode = mode; // \'hold\' = 触发时向末端移动并停住，松开则返回起点；\'pingpong\' = 触发后来回' + '\n' +
  '      this.active = triggerId === null;' + '\n' +
  '      this.prevX = x; this.prevY = y;' + '\n' +
  '    }' + '\n' +
  '    update(triggered) {' + '\n' +
  '      this.prevX = this.x;' + '\n' +
  '      this.prevY = this.y;' + '\n' +
  '      this.active = triggered || this.triggerId === null;' + '\n' +
  '' + '\n' +
  '      const dx = this.endX - this.startX;' + '\n' +
  '      const dy = this.endY - this.startY;' + '\n' +
  '      const dist = Math.sqrt(dx * dx + dy * dy) || 1;' + '\n' +
  '      const step = this.speed / dist;' + '\n' +
  '' + '\n' +
  '      if (this.mode === \'hold\') {' + '\n' +
  '        // hold模式：触发时向末端前进，未触发时退回起点' + '\n' +
  '        if (this.active) {' + '\n' +
  '          this.progress = Math.min(1, this.progress + step);' + '\n' +
  '        } else {' + '\n' +
  '          this.progress = Math.max(0, this.progress - step);' + '\n' +
  '        }' + '\n' +
  '      } else {' + '\n' +
  '        // pingpong模式：触发后来回移动' + '\n' +
  '        if (!this.active) return;' + '\n' +
  '        this.progress += step * this.dir;' + '\n' +
  '        if (this.progress >= 1) { this.progress = 1; this.dir = -1; }' + '\n' +
  '        if (this.progress <= 0) { this.progress = 0; this.dir = 1; }' + '\n' +
  '      }' + '\n' +
  '' + '\n' +
  '      this.x = this.startX + dx * this.progress;' + '\n' +
  '      this.y = this.startY + dy * this.progress;' + '\n' +
  '    }' + '\n' +
  '    get dx() { return this.x - this.prevX; }' + '\n' +
  '    get dy() { return this.y - this.prevY; }' + '\n' +
  '' + '\n' +
  '    draw(ctx) {' + '\n' +
  '      ctx.fillStyle = this.active ? \'#5a5a5a\' : \'#3a3a3a\';' + '\n' +
  '      ctx.fillRect(this.x, this.y, this.w, this.h);' + '\n' +
  '      ctx.fillStyle = \'rgba(255,255,255,0.12)\';' + '\n' +
  '      ctx.fillRect(this.x, this.y, this.w, 2);' + '\n' +
  '      ctx.fillStyle = \'rgba(0,0,0,0.2)\';' + '\n' +
  '      ctx.fillRect(this.x, this.y + this.h - 2, this.w, 2);' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 同步开关（两个触发源同时激活才生效）' + '\n' +
  '  // ============================================================' + '\n' +
  '  class SyncSwitch {' + '\n' +
  '    constructor(id1, id2, targetId, once = true) {' + '\n' +
  '      this.id1 = id1;' + '\n' +
  '      this.id2 = id2;' + '\n' +
  '      this.targetId = targetId;' + '\n' +
  '      this.once = once;' + '\n' +
  '      this.triggered = false; // once模式下永久触发' + '\n' +
  '      this.active = false;' + '\n' +
  '    }' + '\n' +
  '    check(triggerMap) {' + '\n' +
  '      const t1 = triggerMap[this.id1] || false;' + '\n' +
  '      const t2 = triggerMap[this.id2] || false;' + '\n' +
  '      const both = t1 && t2;' + '\n' +
  '      if (this.once && both) this.triggered = true;' + '\n' +
  '      this.active = this.once ? this.triggered : both;' + '\n' +
  '      return this.active;' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 通关判定区' + '\n' +
  '  // ============================================================' + '\n' +
  '  class GoalZone {' + '\n' +
  '    constructor(x, y, w, h, color) {' + '\n' +
  '      this.x = x; this.y = y; this.w = w; this.h = h;' + '\n' +
  '      this.color = color;' + '\n' +
  '    }' + '\n' +
  '    contains(player) {' + '\n' +
  '      return player.x + player.w > this.x + 4 && player.x < this.x + this.w - 4 &&' + '\n' +
  '             player.y + player.h > this.y && player.y < this.y + this.h;' + '\n' +
  '    }' + '\n' +
  '    draw(ctx, active) {' + '\n' +
  '      ctx.save();' + '\n' +
  '      const alpha = active ? 0.4 : 0.12;' + '\n' +
  '      const fill = this.color === \'black\'' + '\n' +
  '        ? `rgba(0,0,0,${alpha})`' + '\n' +
  '        : `rgba(255,255,255,${alpha})`;' + '\n' +
  '      ctx.fillStyle = fill;' + '\n' +
  '      ctx.fillRect(this.x, this.y, this.w, this.h);' + '\n' +
  '' + '\n' +
  '      // 边框' + '\n' +
  '      const sAlpha = active ? 0.9 : 0.35;' + '\n' +
  '      const stroke = this.color === \'black\'' + '\n' +
  '        ? `rgba(0,0,0,${sAlpha})`' + '\n' +
  '        : `rgba(255,255,255,${sAlpha})`;' + '\n' +
  '      ctx.strokeStyle = stroke;' + '\n' +
  '      ctx.lineWidth = active ? 2 : 1;' + '\n' +
  '      if (active) {' + '\n' +
  '        ctx.setLineDash([8, 4]);' + '\n' +
  '        const offset = (Date.now() / 50) % 12;' + '\n' +
  '        ctx.lineDashOffset = -offset;' + '\n' +
  '      } else {' + '\n' +
  '        ctx.setLineDash([4, 4]);' + '\n' +
  '      }' + '\n' +
  '      ctx.strokeRect(this.x + 2, this.y + 2, this.w - 4, this.h - 4);' + '\n' +
  '      ctx.setLineDash([]);' + '\n' +
  '' + '\n' +
  '      // 颜色标记' + '\n' +
  '      ctx.fillStyle = this.color === \'black\' ? \'rgba(0,0,0,0.5)\' : \'rgba(255,255,255,0.65)\';' + '\n' +
  '      ctx.font = \'300 14px sans-serif\';' + '\n' +
  '      ctx.textAlign = \'center\';' + '\n' +
  '      ctx.fillText(this.color === \'black\' ? \'黑\' : \'白\', this.x + this.w / 2, this.y + this.h / 2 + 5);' + '\n' +
  '' + '\n' +
  '      ctx.restore();' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 关卡定义' + '\n' +
  '  // 设计原则：零单人可能性 · 纯合作' + '\n' +
  '  // ============================================================' + '\n' +
  '  const LEVELS = [' + '\n' +
  '    // -------- 第 1 关：初遇 --------' + '\n' +
  '    // 机制：一扇门 + 两侧各一个压力板' + '\n' +
  '    // 配合：一人踩住开门，另一人通过后踩住另一侧压力板，第一人再过' + '\n' +
  '    {' + '\n' +
  '      name: \'初遇\',' + '\n' +
  '      desc: \'两个人，一段路。\\n你帮我开门，我也为你留门。\',' + '\n' +
  '      bg: \'#d9e2ec\',' + '\n' +
  '      spawnBlack: { x: 180, y: 560 },' + '\n' +
  '      spawnWhite: { x: 280, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '      ],' + '\n' +
  '      walls: [' + '\n' +
  '        { x: 600, y: 0, w: 30, h: 540 }, // 中间隔墙（门洞以上部分，门洞在y=540~640）' + '\n' +
  '      ],' + '\n' +
  '      doors: [' + '\n' +
  '        { x: 600, y: 540, w: 30, h: 100, id: \'d1\', mode: \'any\' },' + '\n' +
  '      ],' + '\n' +
  '      plates: [' + '\n' +
  '        { x: 420, y: 632, w: 80, id: \'p1a\', targetId: \'d1\' }, // 左侧压力板' + '\n' +
  '        { x: 730, y: 632, w: 80, id: \'p1b\', targetId: \'d1\' }, // 右侧压力板' + '\n' +
  '      ],' + '\n' +
  '      buttons: [],' + '\n' +
  '      boxes: [],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      syncSwitches: [],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 左右往返移动的尖刺：左右两侧各一组，节奏不同' + '\n' +
  '        // 左侧尖刺起点右移，远离出生点（x=180/280），保证开局安全' + '\n' +
  '        { x: 360, y: 616, w: 40, h: 24, x2: 500, y2: 616, speed: 1.2, triggerId: null },' + '\n' +
  '        { x: 1140, y: 616, w: 40, h: 24, x2: 1240, y2: 616, speed: 1.5, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        { x: 1130, y: 570, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 1050, y: 570, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 2 关：守望 --------' + '\n' +
  '    // 机制：压力板→升降平台，按钮→终点门' + '\n' +
  '    // 配合：黑踩压力板送白上高台；白在高台按按钮开终点门，黑从地面通过' + '\n' +
  '    {' + '\n' +
  '      name: \'守望\',' + '\n' +
  '      desc: \'你守在这里，我去去就回。\\n你托我向上，我为你开路。\',' + '\n' +
  '      bg: \'#e8ddd4\',' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 130, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '        // 左侧起跳台' + '\n' +
  '        { x: 260, y: 560, w: 80, h: 20 },' + '\n' +
  '        // 上层高台（白色走的路）' + '\n' +
  '        { x: 500, y: 380, w: 200, h: 20 },' + '\n' +
  '        { x: 760, y: 320, w: 180, h: 20 },' + '\n' +
  '        // 终点高台上层（白色终点）——右侧立柱仅到 y=380，留出门后地面通道' + '\n' +
  '        { x: 1000, y: 280, w: 280, h: 20 },' + '\n' +
  '        { x: 1000, y: 300, w: 280, h: 80 },' + '\n' +
  '        // 右侧地面边界矮墙（视觉提示，不挡路）' + '\n' +
  '      ],' + '\n' +
  '      walls: [],' + '\n' +
  '      doors: [' + '\n' +
  '        // 地面路径上的终点门（黑色通过用）' + '\n' +
  '        { x: 940, y: 540, w: 28, h: 100, id: \'d2\', mode: \'any\' },' + '\n' +
  '      ],' + '\n' +
  '      plates: [' + '\n' +
  '        // 地面压力板 → 控制升降平台' + '\n' +
  '        { x: 120, y: 632, w: 80, id: \'p2\', targetId: \'mp2\' },' + '\n' +
  '      ],' + '\n' +
  '      buttons: [' + '\n' +
  '        // 高台上的一次性按钮 → 控制终点门' + '\n' +
  '        { x: 820, y: 310, id: \'b2\', targetId: \'d2\' },' + '\n' +
  '      ],' + '\n' +
  '      boxes: [],' + '\n' +
  '      movingPlatforms: [' + '\n' +
  '        // 升降平台（垂直），把白色送上高台' + '\n' +
  '        { x: 380, y: 580, w: 90, h: 16, x2: 380, y2: 380, speed: 1.8, triggerId: \'mp2\' },' + '\n' +
  '      ],' + '\n' +
  '      syncSwitches: [],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 左右往返移动的尖刺：地面中段来回巡逻' + '\n' +
  '        { x: 520, y: 616, w: 80, h: 24, x2: 720, y2: 616, speed: 1.5, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        { x: 1200, y: 210, w: 60, h: 70, color: \'white\' }, // 白色在上层终点' + '\n' +
  '        { x: 1120, y: 570, w: 60, h: 70, color: \'black\' }, // 黑色在地面终点' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 3 关：同频 --------' + '\n' +
  '    // 机制：两个压力板 + 同步开关（同时踩下才开门，且一次触发永久开启）' + '\n' +
  '    // 配合：两人跳上各自的高台，同时踩下压力板，门永久开启' + '\n' +
  '    {' + '\n' +
  '      name: \'同频\',' + '\n' +
  '      desc: \'心有同频，门自开启。\\n同时落步，共赴前程。\',' + '\n' +
  '      bg: \'#d4e0d2\',' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 130, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '        // 左侧两个高台（黑色上左，白色上右）' + '\n' +
  '        { x: 180, y: 520, w: 100, h: 20 },' + '\n' +
  '        { x: 360, y: 440, w: 100, h: 20 },' + '\n' +
  '        // 右侧两个高台' + '\n' +
  '        { x: 820, y: 440, w: 100, h: 20 },' + '\n' +
  '        { x: 1000, y: 520, w: 100, h: 20 },' + '\n' +
  '        // 中间高台上的压力板平台' + '\n' +
  '        { x: 420, y: 340, w: 120, h: 20 }, // 左压力板台' + '\n' +
  '        { x: 740, y: 340, w: 120, h: 20 }, // 右压力板台' + '\n' +
  '      ],' + '\n' +
  '      walls: [],' + '\n' +
  '      doors: [' + '\n' +
  '        // 中间大门，同步开关控制' + '\n' +
  '        { x: 625, y: 440, w: 30, h: 200, id: \'d3\', mode: \'any\' },' + '\n' +
  '      ],' + '\n' +
  '      plates: [' + '\n' +
  '        { x: 450, y: 332, w: 60, id: \'p3a\', targetId: null },' + '\n' +
  '        { x: 770, y: 332, w: 60, id: \'p3b\', targetId: null },' + '\n' +
  '      ],' + '\n' +
  '      buttons: [],' + '\n' +
  '      boxes: [],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      syncSwitches: [' + '\n' +
  '        { id1: \'p3a\', id2: \'p3b\', targetId: \'d3\', once: true },' + '\n' +
  '      ],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 左右往返移动的尖刺：大门两侧各一组，向外侧退避' + '\n' +
  '        { x: 480, y: 616, w: 60, h: 24, x2: 580, y2: 616, speed: 1.3, triggerId: null },' + '\n' +
  '        { x: 640, y: 616, w: 60, h: 24, x2: 740, y2: 616, speed: 1.3, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        { x: 1180, y: 570, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 1100, y: 570, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 4 关：共济 --------' + '\n' +
  '    // 机制：两个箱子 + 两个地面压力板 + 地面大门（mode: all）' + '\n' +
  '    // 配合：两人各推一个箱子到各自压力板，双板同压大门开启，两人同行通过' + '\n' +
  '    {' + '\n' +
  '      name: \'共济\',' + '\n' +
  '      desc: \'各负其责，合力开门。\\n一物归一位，两人共一心。\',' + '\n' +
  '      bg: \'#e0d4e0\',' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 130, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '      ],' + '\n' +
  '      walls: [' + '\n' +
  '        // 中间隔墙（上下两段，中间留门洞）' + '\n' +
  '        { x: 900, y: 0, w: 28, h: 460 },  // 上半段：y=0~460' + '\n' +
  '        { x: 900, y: 560, w: 28, h: 80 }, // 下半段：y=560~640' + '\n' +
  '      ],' + '\n' +
  '      doors: [' + '\n' +
  '        // 大门位于中间：y=460~560，高100px，mode: all 需双板同压' + '\n' +
  '        { x: 900, y: 460, w: 28, h: 100, id: \'d4\', mode: \'all\' },' + '\n' +
  '      ],' + '\n' +
  '      plates: [' + '\n' +
  '        // 两个地面压力板（100px宽，放44px箱子后两侧各留28px过人）' + '\n' +
  '        { x: 290, y: 632, w: 100, id: \'p4a\', targetId: \'d4\' },' + '\n' +
  '        { x: 640, y: 632, w: 100, id: \'p4b\', targetId: \'d4\' },' + '\n' +
  '      ],' + '\n' +
  '      buttons: [],' + '\n' +
  '      boxes: [' + '\n' +
  '        { x: 120, y: 596, w: 44, h: 44, id: \'box4a\' }, // 黑方箱子（近起点）' + '\n' +
  '        { x: 480, y: 596, w: 44, h: 44, id: \'box4b\' }, // 白方箱子' + '\n' +
  '      ],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      syncSwitches: [],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 左右往返移动的尖刺：门两侧地面各一组，节奏一快一慢' + '\n' +
  '        { x: 300, y: 616, w: 60, h: 24, x2: 480, y2: 616, speed: 1.5, triggerId: null },' + '\n' +
  '        { x: 720, y: 616, w: 60, h: 24, x2: 900, y2: 616, speed: 1.2, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        // 两个终点都在门右侧的地面层，两人都能走到' + '\n' +
  '        { x: 1150, y: 570, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 1050, y: 570, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 5 关：接力 --------' + '\n' +
  '    // 机制：白色小人沿左侧阶梯登上墙顶，踩按钮打开下层的门，黑色小人再从地面门通过到达终点' + '\n' +
  '    // 流程：白走到左边缘 → 沿阶梯跳到墙顶 → 踩顶按钮 → 下层门打开 → 黑通过地面门 → 两人到各自终点' + '\n' +
  '    {' + '\n' +
  '      name: \'接力\',' + '\n' +
  '      desc: \'登高者按下机关，\\n下地的人再出发。\\n你托我上去，我为你开路。\',' + '\n' +
  '      bg: \'#dde3d0\',' + '\n' +
  '      spawnBlack: { x: 60, y: 596 },' + '\n' +
  '      spawnWhite: { x: 160, y: 596 },' + '\n' +
  '      platforms: [' + '\n' +
  '        // 地面（y=640顶面）' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '        // ===== 左侧阶梯（白上顶路径，每级高差≤80px，轻松跳跃）=====' + '\n' +
  '        // 第1阶：地面 640 → 567（高差 73）' + '\n' +
  '        { x: 40, y: 567, w: 80, h: 20 },' + '\n' +
  '        // 第2阶：567 → 494（高差 73）' + '\n' +
  '        { x: 100, y: 494, w: 80, h: 20 },' + '\n' +
  '        // 第3阶：494 → 421（高差 73）' + '\n' +
  '        { x: 40, y: 421, w: 80, h: 20 },' + '\n' +
  '        // 第4阶：421 → 348（高差 73）' + '\n' +
  '        { x: 100, y: 348, w: 80, h: 20 },' + '\n' +
  '        // 第5阶：348 → 275（高差 73）' + '\n' +
  '        { x: 40, y: 275, w: 80, h: 20 },' + '\n' +
  '        // 第6阶（墙顶前最后一级）：275 → 202（高差 73）' + '\n' +
  '        { x: 100, y: 202, w: 100, h: 20 },' + '\n' +
  '        // ===== 墙顶平台（y=200顶面，宽 320，x:280-600）=====' + '\n' +
  '        { x: 280, y: 200, w: 320, h: 20 },' + '\n' +
  '        // ===== 右侧高台（白终点所在，y=240顶面），从墙顶跳下' + '\n' +
  '        { x: 700, y: 240, w: 580, h: 20 },' + '\n' +
  '      ],' + '\n' +
  '      walls: [' + '\n' +
  '        // 中间厚墙（x:440-520，宽 80）' + '\n' +
  '        // 墙顶平台以下为实体墙，中间有下层门洞' + '\n' +
  '        // 实墙部分 y=220~500，门 y=500~640' + '\n' +
  '        { x: 440, y: 220, w: 80, h: 280 },' + '\n' +
  '      ],' + '\n' +
  '      doors: [' + '\n' +
  '        // 下层门（黑通过）：白踩墙顶按钮打开' + '\n' +
  '        // 门洞高 140，足够玩家（高 44）通过' + '\n' +
  '        { x: 440, y: 500, w: 80, h: 140, id: \'d5b\', mode: \'any\' },' + '\n' +
  '      ],' + '\n' +
  '      plates: [],' + '\n' +
  '      buttons: [' + '\n' +
  '        // 墙顶按钮（白踩）→ 开下层门' + '\n' +
  '        // y=190：按钮顶面在墙顶平台（y=200）上方 -10 位置' + '\n' +
  '        // 按钮 w=32，放在墙顶中央偏左' + '\n' +
  '        { x: 400, y: 190, id: \'b5w\', targetId: \'d5b\' },' + '\n' +
  '      ],' + '\n' +
  '      boxes: [],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      syncSwitches: [],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 左右往返移动的尖刺：右侧地面来回巡逻，注意节奏再冲终点' + '\n' +
  '        { x: 900, y: 616, w: 80, h: 24, x2: 1080, y2: 616, speed: 1.8, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        // 黑终点：右侧地面' + '\n' +
  '        { x: 1150, y: 570, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        // 白终点：右侧高台上' + '\n' +
  '        { x: 1150, y: 170, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 6 关：时限 --------' + '\n' +
  '    // 机制：时序门（按钮触发后只开4秒）' + '\n' +
  '    // 配合：黑踩按钮，白快速通过；白到对面后踩按钮，黑再快速通过' + '\n' +
  '    {' + '\n' +
  '      name: \'时限\',' + '\n' +
  '      desc: \'门不会一直开着。\\n一人踩住按钮，\\n另一人快跑过去。\',' + '\n' +
  '      bg: \'#e8d4d4\',' + '\n' +
  '      spawnBlack: { x: 60, y: 596 },' + '\n' +
  '      spawnWhite: { x: 140, y: 596 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '      ],' + '\n' +
  '      walls: [' + '\n' +
  '        // 中间墙，门洞在地面层（墙高 540，不可能跳过）' + '\n' +
  '        { x: 640, y: 0, w: 20, h: 540 },' + '\n' +
  '      ],' + '\n' +
  '      doors: [' + '\n' +
  '        // 时序门：触发后开 4 秒（240 帧），足够切换角色 + 跑过去' + '\n' +
  '        { x: 640, y: 540, w: 20, h: 100, id: \'d6\', mode: \'timed\', duration: 240 },' + '\n' +
  '      ],' + '\n' +
  '      plates: [],' + '\n' +
  '      buttons: [' + '\n' +
  '        // 左侧按钮（瞬动：松开即复位）→ 踩一下开时序门，给白过去用' + '\n' +
  '        { x: 400, y: 630, id: \'b6a\', targetId: \'d6\', momentary: true },' + '\n' +
  '        // 右侧按钮（瞬动）→ 踩一下再开一次时序门，给黑过去用' + '\n' +
  '        { x: 880, y: 630, id: \'b6b\', targetId: \'d6\', momentary: true },' + '\n' +
  '      ],' + '\n' +
  '      boxes: [],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      syncSwitches: [],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 左右往返移动的尖刺：两侧各一组，节奏不同，增加限时通过难度' + '\n' +
  '        // 左侧尖刺起点右移，远离白色出生点（x=140），保证开局安全' + '\n' +
  '        { x: 240, y: 616, w: 80, h: 24, x2: 500, y2: 616, speed: 1.5, triggerId: null },' + '\n' +
  '        { x: 900, y: 616, w: 80, h: 24, x2: 1100, y2: 616, speed: 1.8, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        { x: 1180, y: 570, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 1080, y: 570, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 7 关：垫脚 --------' + '\n' +
  '    // 机制：箱子作为垫脚 + 高台按钮' + '\n' +
  '    // 配合：两人合作推箱子到墙下，白踩箱子上高台按按钮开终点门，黑走地面' + '\n' +
  '    {' + '\n' +
  '      name: \'垫脚\',' + '\n' +
  '      desc: \'托你上去，\\n剩下的路，一起走。\',' + '\n' +
  '      bg: \'#d0dbe8\',' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 130, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '        // 白走的上层路' + '\n' +
  '        // 第一个高台（从箱子跳上去，箱子顶y=596→y=520，高差76px，轻松）' + '\n' +
  '        { x: 380, y: 520, w: 140, h: 20 },' + '\n' +
  '        // 第二个高台（按钮所在，y=520→y=440，高差80px）' + '\n' +
  '        { x: 600, y: 440, w: 160, h: 20 },' + '\n' +
  '        // 下降台（y=440→y=500，下跳60px）' + '\n' +
  '        { x: 820, y: 500, w: 140, h: 20 },' + '\n' +
  '        // 右侧终点高台（白的终点，y=500→y=420，高差80px）' + '\n' +
  '        { x: 1040, y: 420, w: 240, h: 20 },' + '\n' +
  '        // 高台侧面实体（只到y=540，下方留出地面通道给黑通过）' + '\n' +
  '        { x: 1040, y: 440, w: 240, h: 100 },' + '\n' +
  '      ],' + '\n' +
  '       walls: [' + '\n' +
  '        // 终点区隔墙 x=980：' + '\n' +
  '        //   y=0~420   上实体墙' + '\n' +
  '        //   y=420~520 上层门洞（白从 y=500 平台跳到 y=420 终点平台时通过）' + '\n' +
  '        //   y=520~540 中间实体段（完全分隔上下两层）' + '\n' +
  '        //   y=540~640 地面门洞（门 d7，黑通过）' + '\n' +
  '        { x: 980, y: 0, w: 20, h: 420 },' + '\n' +
  '        { x: 980, y: 520, w: 20, h: 20 },' + '\n' +
  '      ],' + '\n' +
  '       doors: [' + '\n' +
  '        // 地面门（黑通过用）：白踩高台按钮后永久开启' + '\n' +
  '        { x: 980, y: 540, w: 20, h: 100, id: \'d7\', mode: \'any\' },' + '\n' +
  '      ],' + '\n' +
  '      plates: [],' + '\n' +
  '      buttons: [' + '\n' +
  '        // 高台上的按钮 → 开黑色终点门' + '\n' +
  '        { x: 640, y: 430, id: \'b7\', targetId: \'d7\' },' + '\n' +
  '      ],' + '\n' +
  '      boxes: [' + '\n' +
  '        // 一个公共箱子：两人一起推到墙下，白踩着跳上高台' + '\n' +
  '        { x: 200, y: 596, w: 44, h: 44, id: \'box7\' },' + '\n' +
  '      ],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      syncSwitches: [],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 上下往返移动的尖刺：墙下方向上探出，需要把握时机' + '\n' +
  '        { x: 700, y: 616, w: 80, h: 24, x2: 700, y2: 560, speed: 1.2, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        { x: 1180, y: 570, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 1110, y: 350, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 8 关：双升 --------' + '\n' +
  '    // 机制：两个升降平台 + 地面压力板 + 高台按钮' + '\n' +
  '    // 配合：黑踩压力板送白乘右电梯上高台 → 白到高台后按按钮开门 + 启动左电梯 → 黑乘左电梯上来穿过门洞 → 两人同达终点' + '\n' +
  '    {' + '\n' +
  '      name: \'双升\',' + '\n' +
  '      desc: \'你托我一把，我拉你一下。\\n一步一步，一同向上。\',' + '\n' +
  '      bg: \'#e0d8cc\',' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 1170, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '        // 中间辅助跳台（黑到压力板的垫脚）' + '\n' +
  '        { x: 280, y: 560, w: 80, h: 20 },' + '\n' +
  '        // 压力板所在的小台（靠近左电梯，黑踩完直接可以跳上电梯）' + '\n' +
  '        { x: 440, y: 520, w: 100, h: 20 },' + '\n' +
  '        // 右侧上层大平台（两人共用的终点平台）' + '\n' +
  '        { x: 700, y: 280, w: 400, h: 20 },' + '\n' +
  '        { x: 700, y: 300, w: 400, h: 340 },' + '\n' +
  '      ],' + '\n' +
  '      walls: [' + '\n' +
  '        // 左墙（分割左右两侧），在y=180~280处留出门洞（门d8嵌在此处）' + '\n' +
  '        //   上墙上段 y=0~180（门洞上方的墙）' + '\n' +
  '        //   门洞 y=180~280（门d8占据，门打开时可通行）' + '\n' +
  '        //   上墙下段 y=280~460（门洞下方的墙，阻挡从低处跳过）' + '\n' +
  '        //   中间间隙 y=460~500（高40px < 玩家身高44px，玩家跳不过去）' + '\n' +
  '        //   下墙 y=500~640（阻挡地面通行）' + '\n' +
  '        //   电梯通道在墙左侧(x<700)，电梯贴墙上升，只有门洞高度能过去' + '\n' +
  '        { x: 700, y: 0, w: 20, h: 180 },' + '\n' +
  '        { x: 700, y: 280, w: 20, h: 180 },' + '\n' +
  '        { x: 700, y: 500, w: 20, h: 140 },' + '\n' +
  '      ],' + '\n' +
  '      doors: [' + '\n' +
  '        // 上层大门（黑从左电梯上来后通过，门同时也是左电梯的触发信号）' + '\n' +
  '        { x: 700, y: 180, w: 20, h: 100, id: \'d8\', mode: \'any\' },' + '\n' +
  '      ],' + '\n' +
  '      plates: [' + '\n' +
  '        // 地面压力板（黑踩）→ 控制右升降平台（送白上去）' + '\n' +
  '        { x: 460, y: 512, w: 60, id: \'p8b\', targetId: \'mp8r\' },' + '\n' +
  '      ],' + '\n' +
  '      buttons: [' + '\n' +
  '        // 上层按钮（白到达后踩）→ 开大门 d8 + 同时启动左升降平台（共用d8信号）' + '\n' +
  '        // 放在右电梯出口处，白一上来就会踩到' + '\n' +
  '        { x: 1000, y: 270, id: \'b8w\', targetId: \'d8\' },' + '\n' +
  '      ],' + '\n' +
  '      boxes: [],' + '\n' +
  '      movingPlatforms: [' + '\n' +
  '        // 右升降平台（白用，黑踩板控制）：从y=620升到y=280，贴在上层平台右边缘' + '\n' +
  '        { x: 1100, y: 620, w: 90, h: 14, x2: 1100, y2: 280, speed: 2.2, triggerId: \'mp8r\' },' + '\n' +
  '        // 左升降平台（黑用，白按按钮控制，与门共用d8信号）：从y=620升到y=280，贴在墙左侧' + '\n' +
  '        { x: 610, y: 620, w: 90, h: 14, x2: 610, y2: 280, speed: 2.2, triggerId: \'d8\' },' + '\n' +
  '      ],' + '\n' +
  '      syncSwitches: [],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 左右往返移动的尖刺：地面中段巡逻' + '\n' +
  '        { x: 260, y: 616, w: 60, h: 24, x2: 440, y2: 616, speed: 1.4, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        { x: 950, y: 210, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 850, y: 210, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 9 关：镜像 --------' + '\n' +
  '    // 机制：同步开关 + 镜像阶梯布局' + '\n' +
  '    // 配合：两人沿两侧对称阶梯向上，必须同时到达顶部压力板才能开门' + '\n' +
  '    {' + '\n' +
  '      name: \'镜像\',' + '\n' +
  '      desc: \'你的脚步，是我的节拍。\\n同步向上，一同开门。\',' + '\n' +
  '      bg: \'#d4dae0\',' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 1180, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '        // 左侧阶梯（黑）' + '\n' +
  '        { x: 120, y: 560, w: 80, h: 20 },' + '\n' +
  '        { x: 200, y: 480, w: 80, h: 20 },' + '\n' +
  '        { x: 280, y: 400, w: 80, h: 20 },' + '\n' +
  '        { x: 360, y: 320, w: 100, h: 20 }, // 左顶平台（压力板）' + '\n' +
  '        // 右侧阶梯（白）——镜像对称' + '\n' +
  '        { x: 1080, y: 560, w: 80, h: 20 },' + '\n' +
  '        { x: 1000, y: 480, w: 80, h: 20 },' + '\n' +
  '        { x: 920, y: 400, w: 80, h: 20 },' + '\n' +
  '        { x: 820, y: 320, w: 100, h: 20 }, // 右顶平台（压力板）' + '\n' +
  '        // 中间顶部：终点平台' + '\n' +
  '        { x: 500, y: 220, w: 280, h: 20 },' + '\n' +
  '        { x: 500, y: 240, w: 280, h: 400 },' + '\n' +
  '      ],' + '\n' +
  '      walls: [' + '\n' +
  '        // 中间高墙，上部有门洞 y=120~220' + '\n' +
  '        { x: 630, y: 0, w: 20, h: 120 },' + '\n' +
  '        { x: 630, y: 220, w: 20, h: 420 },' + '\n' +
  '      ],' + '\n' +
  '      doors: [' + '\n' +
  '        // 顶部大门，同步开关触发（两人同时踩顶部压力板）' + '\n' +
  '        { x: 630, y: 120, w: 20, h: 100, id: \'d9\', mode: \'any\' },' + '\n' +
  '      ],' + '\n' +
  '      plates: [' + '\n' +
  '        { x: 380, y: 312, w: 60, id: \'p9a\', targetId: null },' + '\n' +
  '        { x: 840, y: 312, w: 60, id: \'p9b\', targetId: null },' + '\n' +
  '      ],' + '\n' +
  '      buttons: [],' + '\n' +
  '      boxes: [],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      syncSwitches: [' + '\n' +
  '        { id1: \'p9a\', id2: \'p9b\', targetId: \'d9\', once: true },' + '\n' +
  '      ],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 左右往返移动的尖刺：中央下方地面大范围巡逻' + '\n' +
  '        { x: 480, y: 616, w: 120, h: 24, x2: 720, y2: 616, speed: 1.6, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        { x: 540, y: 150, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 680, y: 150, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 10 关：搬运 --------' + '\n' +
  '    // 机制：重箱子（heavy=true）+ 压力板开门' + '\n' +
  '    // 配合：大箱子太重，单人推不动，必须两人在同一侧合力推到压力板上才能开门' + '\n' +
  '    {' + '\n' +
  '      name: \'搬运\',' + '\n' +
  '      desc: \'一个人推不动的，\\n两个人一起扛。\',' + '\n' +
  '      bg: \'#d8d0c4\',' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 130, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '      ],' + '\n' +
  '      walls: [' + '\n' +
  '        // 中间墙，地面门洞' + '\n' +
  '        { x: 900, y: 0, w: 20, h: 540 },' + '\n' +
  '      ],' + '\n' +
  '      doors: [' + '\n' +
  '        { x: 900, y: 540, w: 20, h: 100, id: \'d10\', mode: \'all\' },' + '\n' +
  '      ],' + '\n' +
  '      plates: [' + '\n' +
  '        // 两个压力板并排，需要长方形箱子同时压住才能开门' + '\n' +
  '        { x: 640, y: 632, w: 80, id: \'p10\', targetId: \'d10\' },' + '\n' +
  '        { x: 760, y: 632, w: 80, id: \'p10b\', targetId: \'d10\' },' + '\n' +
  '      ],' + '\n' +
  '      buttons: [],' + '\n' +
  '      boxes: [' + '\n' +
  '        // 重箱子（长方形）：必须两人同时推才动，推到位后同时压住两个压力板开门' + '\n' +
  '        { x: 200, y: 580, w: 220, h: 60, id: \'bigbox\', heavy: true },' + '\n' +
  '      ],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      syncSwitches: [],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 左右往返移动的尖刺：地面中段来回巡逻，小心躲避' + '\n' +
  '        { x: 300, y: 616, w: 80, h: 24, x2: 500, y2: 616, speed: 1.4, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        { x: 1150, y: 570, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 1050, y: 570, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 11 关：切换 --------' + '\n' +
  '    // 机制：两组切换平台 + 两侧压力板' + '\n' +
  '    // 配合：黑踩左板A组显（白走A组平台到右侧），白到后踩右板B组显（黑走B组平台过去）' + '\n' +
  '    {' + '\n' +
  '      name: \'切换\',' + '\n' +
  '      desc: \'你走你的路，我搭我的桥。\\n一步一换，交替向前。\',' + '\n' +
  '      bg: \'#c8d8d4\',' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 130, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '        // 左侧踩板台' + '\n' +
  '        { x: 60, y: 560, w: 100, h: 20 },' + '\n' +
  '        // 右侧踩板台 + 终点平台' + '\n' +
  '        { x: 1100, y: 480, w: 180, h: 20 },' + '\n' +
  '        { x: 1100, y: 500, w: 180, h: 140 },' + '\n' +
  '      ],' + '\n' +
  '      walls: [' + '\n' +
  '        // 终点区左墙：门洞 y=380~480' + '\n' +
  '        { x: 1100, y: 0, w: 20, h: 380 },' + '\n' +
  '        { x: 1100, y: 480, w: 20, h: 160 },' + '\n' +
  '      ],' + '\n' +
  '      doors: [' + '\n' +
  '        // 终点门 + B组平台切换共用信号：白按右侧按钮同时触发两者' + '\n' +
  '        { x: 1100, y: 380, w: 20, h: 100, id: \'d11\', mode: \'any\' },' + '\n' +
  '      ],' + '\n' +
  '      plates: [],' + '\n' +
  '      buttons: [' + '\n' +
  '        // 左侧按钮（黑踩）→ 永久显示A组平台（白走A组到右侧）' + '\n' +
  '        { x: 94, y: 550, id: \'b11l\', targetId: \'togA\' },' + '\n' +
  '        // 右侧按钮（白到达A组末端后踩，在门左侧，不需要过门）→ 开终点门 + 显示B组平台' + '\n' +
  '        { x: 1024, y: 460, id: \'b11r\', targetId: \'d11\' },' + '\n' +
  '      ],' + '\n' +
  '      boxes: [],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      togglePlatforms: [' + '\n' +
  '        // A组（白用，黑踩板时显示）：从起点侧到右侧，上升后下降' + '\n' +
  '        { x: 260, y: 540, w: 90, h: 16, id: \'tp11a1\', triggerId: \'togA\', group: \'A\', visible: false },' + '\n' +
  '        { x: 450, y: 480, w: 90, h: 16, id: \'tp11a2\', triggerId: \'togA\', group: \'A\', visible: false },' + '\n' +
  '        { x: 650, y: 420, w: 90, h: 16, id: \'tp11a3\', triggerId: \'togA\', group: \'A\', visible: false },' + '\n' +
  '        { x: 850, y: 480, w: 90, h: 16, id: \'tp11a4\', triggerId: \'togA\', group: \'A\', visible: false },' + '\n' +
  '        { x: 1000, y: 470, w: 80, h: 16, id: \'tp11a5\', triggerId: \'togA\', group: \'A\', visible: false },' + '\n' +
  '        // B组（黑用，白按右侧按钮后显示）：不同的路径' + '\n' +
  '        { x: 240, y: 510, w: 90, h: 16, id: \'tp11b1\', triggerId: \'d11\', group: \'A\', visible: false },' + '\n' +
  '        { x: 420, y: 440, w: 90, h: 16, id: \'tp11b2\', triggerId: \'d11\', group: \'A\', visible: false },' + '\n' +
  '        { x: 620, y: 380, w: 90, h: 16, id: \'tp11b3\', triggerId: \'d11\', group: \'A\', visible: false },' + '\n' +
  '        { x: 820, y: 440, w: 90, h: 16, id: \'tp11b4\', triggerId: \'d11\', group: \'A\', visible: false },' + '\n' +
  '        { x: 980, y: 460, w: 80, h: 16, id: \'tp11b5\', triggerId: \'d11\', group: \'A\', visible: false },' + '\n' +
  '      ],' + '\n' +
  '      syncSwitches: [],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 左右往返移动的尖刺：下方地面大范围巡逻，跳台时把握节奏' + '\n' +
  '        { x: 420, y: 616, w: 200, h: 24, x2: 720, y2: 616, speed: 2, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        { x: 1180, y: 410, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 1120, y: 410, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 12 关：迷宫 --------' + '\n' +
  '    // 机制：上下两层分路 + 三道门 + 三个按钮的连锁' + '\n' +
  '    // 配合：黑走地面，沿路踩两个按钮为白开两道上层门；白走上层，踩一个按钮为黑开地面终点门' + '\n' +
  '    // 流程：黑踩按钮1 → 白开第一道门进入中段 → 黑踩按钮2 → 白开第二道门进入终区 → 白踩按钮 → 黑开地面终点门 → 汇合' + '\n' +
  '    {' + '\n' +
  '      name: \'迷宫\',' + '\n' +
  '      desc: \'你在墙那边，我在墙这边。\\n各自寻路，终点相见。\',' + '\n' +
  '      bg: \'#d8d0d8\',' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 60, y: 280 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 }, // 地面（黑走，全程畅通）' + '\n' +
  '        // 上层走道（白走）——分三段，由三道门分隔' + '\n' +
  '        { x: 0, y: 340, w: 300, h: 20 },    // 左段：白起点 (x=0~300)' + '\n' +
  '        { x: 320, y: 340, w: 380, h: 20 },  // 中段：白踩按钮的地方 (x=320~700)' + '\n' +
  '        { x: 720, y: 340, w: 280, h: 20 },  // 右段：白到终点前 (x=720~1000)' + '\n' +
  '        // 终区平台（右侧，白终点在上、黑终点在下）' + '\n' +
  '        { x: 1000, y: 340, w: 280, h: 20 }, // 右终区上层地板（白站这里）' + '\n' +
  '      ],' + '\n' +
  '      walls: [' + '\n' +
  '        // 终区左墙 x=1000：' + '\n' +
  '        //   y=0~240     上实体墙' + '\n' +
  '        //   y=240~340   上层门洞（门 d12w2，白通过到终区）' + '\n' +
  '        //   y=340~540   中间实体段（分隔上下层）' + '\n' +
  '        //   y=540~640   地面门洞（门 d12b，黑通过到终区）' + '\n' +
  '        { x: 1000, y: 0, w: 20, h: 240 },' + '\n' +
  '        { x: 1000, y: 340, w: 20, h: 200 },' + '\n' +
  '        // 上层第一道墙 x=300（仅上层有，分隔白的起点和中段）：' + '\n' +
  '        //   y=0~240     上实体墙' + '\n' +
  '        //   y=240~340   上层门洞（门 d12w1）' + '\n' +
  '        //   y=340~640   悬空（地面层黑不受影响）' + '\n' +
  '        { x: 300, y: 0, w: 20, h: 240 },' + '\n' +
  '        // 上层第二道墙 x=700（仅上层有，分隔中段和右段）：' + '\n' +
  '        { x: 700, y: 0, w: 20, h: 240 },' + '\n' +
  '      ],' + '\n' +
  '      doors: [' + '\n' +
  '        // 上层左门（白从起点到中段）：黑踩按钮1开' + '\n' +
  '        { x: 300, y: 240, w: 20, h: 100, id: \'d12w1\', mode: \'any\' },' + '\n' +
  '        // 上层中门（白从中段到右段）：黑踩按钮2开' + '\n' +
  '        { x: 700, y: 240, w: 20, h: 100, id: \'d12w2\', mode: \'any\' },' + '\n' +
  '        // 上层终门（白从右段到终区）：与按钮2同步，和d12w2一起开' + '\n' +
  '        { x: 1000, y: 240, w: 20, h: 100, id: \'d12w2\', mode: \'any\' },' + '\n' +
  '        // 地面终门（黑通过到终点）：白踩中段按钮开' + '\n' +
  '        { x: 1000, y: 540, w: 20, h: 100, id: \'d12b\', mode: \'any\' },' + '\n' +
  '      ],' + '\n' +
  '      plates: [],' + '\n' +
  '      buttons: [' + '\n' +
  '        // 黑地面按钮1 → 开白的上层左门' + '\n' +
  '        { x: 150, y: 630, id: \'b12b1\', targetId: \'d12w1\' },' + '\n' +
  '        // 黑地面按钮2 → 开白的上层中门和终门' + '\n' +
  '        { x: 500, y: 630, id: \'b12b2\', targetId: \'d12w2\' },' + '\n' +
  '        // 白上层中段按钮 → 开黑的地面终门' + '\n' +
  '        { x: 480, y: 330, id: \'b12w\', targetId: \'d12b\' },' + '\n' +
  '      ],' + '\n' +
  '      boxes: [],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 左右往返移动的尖刺：地面路径中段两侧各一组' + '\n' +
  '        { x: 260, y: 616, w: 60, h: 24, x2: 420, y2: 616, speed: 1.5, triggerId: null },' + '\n' +
  '        { x: 740, y: 616, w: 60, h: 24, x2: 900, y2: 616, speed: 1.3, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      syncSwitches: [],' + '\n' +
  '      goals: [' + '\n' +
  '        { x: 1180, y: 570, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 1120, y: 270, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 13 关：尖刺 --------' + '\n' +
  '    // 机制：双人同步按钮 + 双横杆门 + 跑酷跳跃平台 + 移动尖刺' + '\n' +
  '    // 配合：两人各踩一个按钮合力开启两道横杆门，一起跳跃通过尖刺区到达终点' + '\n' +
  '    {' + '\n' +
  '      name: \'尖刺\',' + '\n' +
  '      desc: \'双闸齐开，\\n一跃而过。\',' + '\n' +
  '      bg: \'#d0c4c4\',' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 130, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 }, // 地面' + '\n' +
  '        // 左侧两个按钮台（一人一个）' + '\n' +
  '        { x: 40, y: 580, w: 80, h: 20 },' + '\n' +
  '        { x: 160, y: 580, w: 80, h: 20 },' + '\n' +
  '        // 中间跑酷跳台' + '\n' +
  '        { x: 350, y: 560, w: 80, h: 16 },' + '\n' +
  '        { x: 500, y: 500, w: 80, h: 16 },' + '\n' +
  '        { x: 650, y: 560, w: 80, h: 16 },' + '\n' +
  '        { x: 800, y: 500, w: 80, h: 16 },' + '\n' +
  '      ],' + '\n' +
  '      walls: [],' + '\n' +
  '      doors: [' + '\n' +
  '        // 第一道横杆门（左），从地面往上135px，单人跳不过去' + '\n' +
  '        { x: 280, y: 505, w: 20, h: 135, id: \'gate13\', mode: \'any\' },' + '\n' +
  '        // 第二道横杆门（右）' + '\n' +
  '        { x: 920, y: 505, w: 20, h: 135, id: \'gate13\', mode: \'any\' },' + '\n' +
  '      ],' + '\n' +
  '      plates: [],' + '\n' +
  '      buttons: [' + '\n' +
  '        // 黑按钮（左按钮台）' + '\n' +
  '        { x: 64, y: 570, id: \'b13b\', targetId: \'b13b\' },' + '\n' +
  '        // 白按钮（右按钮台）' + '\n' +
  '        { x: 184, y: 570, id: \'b13w\', targetId: \'b13w\' },' + '\n' +
  '      ],' + '\n' +
  '      boxes: [],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 移动尖刺在中间通道地面上来回巡逻，增加跑酷挑战性' + '\n' +
  '        { x: 370, y: 616, w: 80, h: 24, x2: 850, y2: 616, speed: 3, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      syncSwitches: [' + '\n' +
  '        // 两人同时踩下各自按钮 → 两道横杆门永久开启' + '\n' +
  '        { id1: \'b13b\', id2: \'b13w\', targetId: \'gate13\', once: true },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        { x: 1180, y: 570, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 1080, y: 570, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 14 关：综合 --------' + '\n' +
  '    // 机制：同步开关 + 时序门 + 箱子 + 升降平台 综合' + '\n' +
  '    // 配合：精密配合，两人各司其职' + '\n' +
  '    {' + '\n' +
  '      name: \'综合\',' + '\n' +
  '      desc: \'所学的一切，\\n都在这里了。\',' + '\n' +
  '      bg: \'#c0ccd4\',' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 160, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '        // 同步开关的两个压力板台' + '\n' +
  '        { x: 80, y: 540, w: 100, h: 20 },' + '\n' +
  '        { x: 200, y: 540, w: 100, h: 20 },' + '\n' +
  '        // 中段台阶' + '\n' +
  '        { x: 400, y: 480, w: 100, h: 20 },' + '\n' +
  '        { x: 560, y: 460, w: 120, h: 20 }, // 白按钮台' + '\n' +
  '        // 黑上升降平台的两级台阶（同步开关触发后升降平台停在顶端y=380，黑逐级跳上去）' + '\n' +
  '        { x: 520, y: 540, w: 100, h: 20 },' + '\n' +
  '        { x: 620, y: 460, w: 80, h: 20 },' + '\n' +
  '        // 上层通道（黑走的路）' + '\n' +
  '        { x: 760, y: 380, w: 120, h: 20 },' + '\n' +
  '        { x: 940, y: 320, w: 120, h: 20 },' + '\n' +
  '        // 终点平台（黑在上，白在下）' + '\n' +
  '        { x: 1080, y: 260, w: 200, h: 20 },' + '\n' +
  '      ],' + '\n' +
  '       walls: [' + '\n' +
  '        // 终区墙 x=1080：' + '\n' +
  '        //   y=0~160    上实体墙' + '\n' +
  '        //   y=160~260  上层门洞（门 d14a，黑通过到上层终点）' + '\n' +
  '        //   y=260~460  中实体段' + '\n' +
  '        //   y=460~540  中间门洞（白上下/返回通行用，无门）' + '\n' +
  '        //   y=540~640  下层门洞（门 d14b，白通过到地面终点）' + '\n' +
  '        { x: 1080, y: 0, w: 20, h: 160 },' + '\n' +
  '        { x: 1080, y: 260, w: 20, h: 200 },' + '\n' +
  '      ],' + '\n' +
  '      doors: [' + '\n' +
  '        // 上层终点门（黑用）：同步开关触发（永久）' + '\n' +
  '        { x: 1080, y: 160, w: 20, h: 100, id: \'d14a\', mode: \'any\' },' + '\n' +
  '        // 下层终点门（白用）：白按钮触发时序门' + '\n' +
  '        { x: 1080, y: 540, w: 20, h: 100, id: \'d14b\', mode: \'timed\', duration: 180 },' + '\n' +
  '      ],' + '\n' +
  '      plates: [' + '\n' +
  '        { x: 100, y: 532, w: 60, id: \'p14a\', targetId: null },' + '\n' +
  '        { x: 220, y: 532, w: 60, id: \'p14b\', targetId: null },' + '\n' +
  '      ],' + '\n' +
  '      buttons: [' + '\n' +
  '        // 中段高台上的按钮 → 开下层时序门（白自己按，自己冲过去）' + '\n' +
  '        { x: 600, y: 450, id: \'b14\', targetId: \'d14b\' },' + '\n' +
  '      ],' + '\n' +
  '      boxes: [' + '\n' +
  '        // 一个箱子作为垫脚，帮助白跳上中段高台' + '\n' +
  '        { x: 340, y: 596, w: 44, h: 44, id: \'box14\' },' + '\n' +
  '      ],' + '\n' +
  '      movingPlatforms: [' + '\n' +
  '        // 升降平台：同步开关激活后升起，送黑到上层通道' + '\n' +
  '        { x: 700, y: 560, w: 80, h: 14, x2: 700, y2: 380, speed: 2, triggerId: \'d14a\' },' + '\n' +
  '      ],' + '\n' +
  '      syncSwitches: [' + '\n' +
  '        // 两板同踩 → 永久开上层终点门 + 激活升降平台' + '\n' +
  '        { id1: \'p14a\', id2: \'p14b\', targetId: \'d14a\', once: true },' + '\n' +
  '      ],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 固定尖刺：地面中段警示' + '\n' +
  '        { x: 660, y: 616, w: 80, h: 24, x2: 860, y2: 616, speed: 1.6, triggerId: null },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        { x: 1180, y: 190, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 1120, y: 570, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 15 关：共生 --------' + '\n' +
  '    // 终极挑战：同步开关 + 双箱压板 + 移动尖刺 + 双时序门 + 共同终点' + '\n' +
  '    // 流程：两人同踩同步板开门 → 两人分走尖刺区两侧，各推一个箱子到各自压力板 → 双板同压尖刺暂停 → 穿过尖刺区 → 分左右路上高台 → 分别踩时序门按钮 → 冲入中央共生终点' + '\n' +
  '    {' + '\n' +
  '      name: \'共生\',' + '\n' +
  '      desc: \'穿越险阻，并肩到底。\\n你即我，我即你。\',' + '\n' +
  '      bg: \'#b8c0c8\',' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 130, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '        // 同步开关双台（入门处）' + '\n' +
  '        { x: 80, y: 560, w: 80, h: 20 },' + '\n' +
  '        { x: 200, y: 560, w: 80, h: 20 },' + '\n' +
  '        // 左侧跳跃阶梯（黑路上高台）' + '\n' +
  '        { x: 380, y: 540, w: 80, h: 20 },' + '\n' +
  '        { x: 480, y: 460, w: 80, h: 20 },' + '\n' +
  '        { x: 400, y: 360, w: 100, h: 20 }, // 左按钮台（左移留出起跳空间）' + '\n' +
  '        // 右侧跳跃阶梯（白路上高台）' + '\n' +
  '        { x: 820, y: 540, w: 80, h: 20 },' + '\n' +
  '        { x: 720, y: 460, w: 80, h: 20 },' + '\n' +
  '        { x: 780, y: 360, w: 100, h: 20 }, // 右按钮台（右移留出起跳空间）' + '\n' +
  '        // 中央共同终点平台（两人都要到达）' + '\n' +
  '        { x: 540, y: 260, w: 200, h: 20 },' + '\n' +
  '        { x: 540, y: 280, w: 200, h: 360 },' + '\n' +
  '      ],' + '\n' +
  '      walls: [' + '\n' +
  '        // 第一堵墙（同步门位置）：门洞 y=440~540' + '\n' +
  '        { x: 320, y: 0, w: 20, h: 440 },' + '\n' +
  '        { x: 320, y: 540, w: 20, h: 100 },' + '\n' +
  '        // 中央高台左墙：门洞 y=160~260' + '\n' +
  '        { x: 540, y: 0, w: 20, h: 160 },' + '\n' +
  '        { x: 540, y: 260, w: 20, h: 380 },' + '\n' +
  '        // 中央高台右墙：门洞 y=160~260' + '\n' +
  '        { x: 720, y: 0, w: 20, h: 160 },' + '\n' +
  '        { x: 720, y: 260, w: 20, h: 380 },' + '\n' +
  '      ],' + '\n' +
  '      doors: [' + '\n' +
  '        // 同步门（两人同时踩板才开，永久）' + '\n' +
  '        { x: 320, y: 440, w: 20, h: 100, id: \'d15sync\', mode: \'any\' },' + '\n' +
  '        // 左时序门（进中央高台左侧门）' + '\n' +
  '        { x: 540, y: 160, w: 20, h: 100, id: \'d15l\', mode: \'timed\', duration: 200 },' + '\n' +
  '        // 右时序门（进中央高台右侧门）' + '\n' +
  '        { x: 720, y: 160, w: 20, h: 100, id: \'d15r\', mode: \'timed\', duration: 200 },' + '\n' +
  '      ],' + '\n' +
  '      plates: [' + '\n' +
  '        // 同步开关两板（同时踩才开门）' + '\n' +
  '        { x: 90, y: 552, w: 60, id: \'p15a\', targetId: null },' + '\n' +
  '        { x: 210, y: 552, w: 60, id: \'p15b\', targetId: null },' + '\n' +
  '        // 两个箱子压力板 → 都压住才暂停尖刺' + '\n' +
  '        { x: 380, y: 632, w: 70, id: \'p15c\', targetId: \'sp15\' },' + '\n' +
  '        { x: 860, y: 632, w: 70, id: \'p15d\', targetId: \'sp15\' },' + '\n' +
  '      ],' + '\n' +
  '      buttons: [' + '\n' +
  '        // 左高台按钮（黑踩）→ 开左时序门' + '\n' +
  '        { x: 434, y: 350, id: \'b15l\', targetId: \'d15l\' },' + '\n' +
  '        // 右高台按钮（白踩）→ 开右时序门' + '\n' +
  '        { x: 814, y: 350, id: \'b15r\', targetId: \'d15r\' },' + '\n' +
  '      ],' + '\n' +
  '      boxes: [' + '\n' +
  '        // 左箱子（黑推）→ 推到左压力板 p15c 上' + '\n' +
  '        { x: 200, y: 596, w: 44, h: 44, id: \'box15a\' },' + '\n' +
  '        // 右箱子（白推）→ 推到右压力板 p15d 上' + '\n' +
  '        { x: 980, y: 596, w: 44, h: 44, id: \'box15b\' },' + '\n' +
  '      ],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      spikes: [' + '\n' +
  '        // 地面来回移动尖刺：两个箱子压力板都压住才暂停' + '\n' +
  '        { x: 500, y: 616, w: 60, h: 24, x2: 760, y2: 616, speed: 2.5, triggerId: \'sp15\', mode: \'all\' },' + '\n' +
  '      ],' + '\n' +
  '      syncSwitches: [' + '\n' +
  '        // 同步开关：两板同踩 → 永久开同步门' + '\n' +
  '        { id1: \'p15a\', id2: \'p15b\', targetId: \'d15sync\', once: true },' + '\n' +
  '      ],' + '\n' +
  '      goals: [' + '\n' +
  '        // 共同终点：同一处位置，象征共生' + '\n' +
  '        { x: 590, y: 190, w: 60, h: 70, color: \'black\' },' + '\n' +
  '        { x: 630, y: 190, w: 60, h: 70, color: \'white\' },' + '\n' +
  '      ]' + '\n' +
  '    },' + '\n' +
  '' + '\n' +
  '    // -------- 第 16 关：尾声（彩蛋） --------' + '\n' +
  '    // 机制：空旷场景，两人同行走到终点，一起点燃烟花，观看盛大表演与制作人员名单' + '\n' +
  '    {' + '\n' +
  '      name: \'尾声\',' + '\n' +
  '      desc: \'一路同行，至此不散。\\n烟花为你们而放。\',' + '\n' +
  '      bg: \'#0a0a14\',' + '\n' +
  '      isEasterEgg: true,' + '\n' +
  '      spawnBlack: { x: 60, y: 560 },' + '\n' +
  '      spawnWhite: { x: 140, y: 560 },' + '\n' +
  '      platforms: [' + '\n' +
  '        { x: 0, y: 640, w: 1280, h: 80 },' + '\n' +
  '      ],' + '\n' +
  '      walls: [' + '\n' +
  '        // 终点右侧阻挡墙，防止玩家走出判定区（玩家宽28，1232<1260，留28px空间）' + '\n' +
  '        { x: 1260, y: 0, w: 10, h: 640 },' + '\n' +
  '      ],' + '\n' +
  '      doors: [],' + '\n' +
  '      plates: [],' + '\n' +
  '      buttons: [],' + '\n' +
  '      boxes: [],' + '\n' +
  '      movingPlatforms: [],' + '\n' +
  '      spikes: [],' + '\n' +
  '      syncSwitches: [],' + '\n' +
  '      // 彩蛋关专用：终点判定区（两人同时站上 → 点燃烟花）' + '\n' +
  '      // 两个判定区重叠，贴右侧墙放置，确保两人走到最右都在判定区内' + '\n' +
  '      eggGoals: [' + '\n' +
  '        { x: 1120, y: 570, w: 140, h: 70, color: \'black\' },' + '\n' +
  '        { x: 1120, y: 570, w: 140, h: 70, color: \'white\' },' + '\n' +
  '      ],' + '\n' +
  '      // 烟花装置（小火箭）位置：放在地面上，引线连到火箭底部' + '\n' +
  '      fireworkDevice: { x: 620, y: 596, w: 40, h: 44 },' + '\n' +
  '      goals: []' + '\n' +
  '    },' + '\n' +
  '  ];' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 当前关卡状态' + '\n' +
  '  // ============================================================' + '\n' +
  '  let level = null;' + '\n' +
  '  let players = [];' + '\n' +
  '  let platforms = [];' + '\n' +
  '  let walls = [];' + '\n' +
  '  let doors = [];' + '\n' +
  '  let plates = [];' + '\n' +
  '  let buttons = [];' + '\n' +
  '  let boxes = [];' + '\n' +
  '  let movingPlatforms = [];' + '\n' +
  '  let togglePlatforms = [];' + '\n' +
  '  let spikes = [];' + '\n' +
  '  let goals = [];' + '\n' +
  '  let eggGoals = [];' + '\n' +
  '  let fireworkDevice = null;' + '\n' +
  '  let eggFuseProgress = 0;     // 引线燃烧进度 0-1' + '\n' +
  '  let eggFuseBurning = false;  // 引线是否在燃烧' + '\n' +
  '  let eggFireworkStarted = false; // 烟花是否已点燃' + '\n' +
  '  let eggIgniteTimer = 0;      // 点火延迟计时（引线烧到后，火箭喷焰预热后再起飞）' + '\n' +
  '  let eggPhase = \'idle\';       // idle / fuse / ignite / fireworks / credits' + '\n' +
  '  let syncSwitches = [];' + '\n' +
  '  let particles = [];' + '\n' +
  '  // 烟花专用：发射体 + 爆炸粒子' + '\n' +
  '  let fireworks = [];' + '\n' +
  '  let fireworkTimer = 0; // 烟花表演计时' + '\n' +
  '  let fireworkPhase = \'idle\'; // idle / show / done' + '\n' +
  '' + '\n' +
  '  function loadLevel(idx) {' + '\n' +
  '    const data = LEVELS[idx];' + '\n' +
  '    level = data;' + '\n' +
  '' + '\n' +
  '    players = [' + '\n' +
  '      new Player(data.spawnBlack.x, data.spawnBlack.y, \'black\',' + '\n' +
  '        { left: \'KeyA\', right: \'KeyD\', jump: \'KeyW\' }),' + '\n' +
  '      new Player(data.spawnWhite.x, data.spawnWhite.y, \'white\',' + '\n' +
  '        { left: \'ArrowLeft\', right: \'ArrowRight\', jump: \'ArrowUp\' }),' + '\n' +
  '    ];' + '\n' +
  '' + '\n' +
  '    platforms = data.platforms.map(p => ({ ...p }));' + '\n' +
  '    walls = (data.walls || []).map(w => ({ ...w }));' + '\n' +
  '    doors = data.doors.map(d => new Door(d.x, d.y, d.w, d.h, d.id, d.mode || \'any\', { duration: d.duration }));' + '\n' +
  '    plates = data.plates.map(p => new PressurePlate(p.x, p.y, p.w, p.id, p.targetId));' + '\n' +
  '    buttons = data.buttons.map(b => new Button(b.x, b.y, b.id, b.targetId, { momentary: b.momentary }));' + '\n' +
  '    boxes = data.boxes.map(b => new Box(b.x, b.y, b.w, b.h, b.id || null, b.heavy || false));' + '\n' +
  '    movingPlatforms = data.movingPlatforms.map(m =>' + '\n' +
  '      new MovingPlatform(m.x, m.y, m.w, m.h, m.x2, m.y2, m.speed, m.triggerId, m.mode || \'hold\'));' + '\n' +
  '    togglePlatforms = (data.togglePlatforms || []).map(t =>' + '\n' +
  '      new TogglePlatform(t.x, t.y, t.w, t.h, t.id, t.triggerId || null, t.group || \'A\', t.visible !== false));' + '\n' +
  '    spikes = (data.spikes || []).map(s =>' + '\n' +
  '      new Spike(s.x, s.y, s.w, s.h, s.x2, s.y2, s.speed, s.triggerId, s.mode || \'any\', s.active !== false));' + '\n' +
  '    goals = data.goals.map(g => new GoalZone(g.x, g.y, g.w, g.h, g.color));' + '\n' +
  '    eggGoals = (data.eggGoals || []).map(g => new GoalZone(g.x, g.y, g.w, g.h, g.color));' + '\n' +
  '    fireworkDevice = data.fireworkDevice || null;' + '\n' +
  '    syncSwitches = data.syncSwitches.map(s =>' + '\n' +
  '      new SyncSwitch(s.id1, s.id2, s.targetId, s.once !== false));' + '\n' +
  '' + '\n' +
  '    winHoldTime = 0;' + '\n' +
  '    particles = [];' + '\n' +
  '    // 彩蛋关状态重置' + '\n' +
  '    eggFuseProgress = 0;' + '\n' +
  '    eggFuseBurning = false;' + '\n' +
  '    eggFireworkStarted = false;' + '\n' +
  '    eggIgniteTimer = 0;' + '\n' +
  '    eggPhase = \'idle\';' + '\n' +
  '' + '\n' +
  '    const hud = document.getElementById(\'hud\');' + '\n' +
  '    hud.textContent = `第 ${idx + 1} 关  ·  ${data.name}`;' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 触发映射：根据开关状态计算各门是否应该打开' + '\n' +
  '  // ============================================================' + '\n' +
  '  function computeTriggers() {' + '\n' +
  '    // 收集所有触发源的状态' + '\n' +
  '    const triggerMap = {};' + '\n' +
  '' + '\n' +
  '    // 压力板 → 目标' + '\n' +
  '    for (const pl of plates) {' + '\n' +
  '      if (pl.targetId) {' + '\n' +
  '        if (!triggerMap[pl.targetId]) triggerMap[pl.targetId] = [];' + '\n' +
  '        triggerMap[pl.targetId].push(pl.pressed);' + '\n' +
  '      }' + '\n' +
  '      // 同时记录自身id状态（供syncSwitch用）' + '\n' +
  '      triggerMap[\'_plate_\' + pl.id] = pl.pressed;' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 按钮 → 目标' + '\n' +
  '    for (const b of buttons) {' + '\n' +
  '      if (b.targetId) {' + '\n' +
  '        if (!triggerMap[b.targetId]) triggerMap[b.targetId] = [];' + '\n' +
  '        triggerMap[b.targetId].push(b.momentary ? b.pressed : b.activated);' + '\n' +
  '      }' + '\n' +
  '      triggerMap[\'_btn_\' + b.id] = b.momentary ? b.pressed : b.activated;' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 同步开关 → 目标' + '\n' +
  '    for (const ss of syncSwitches) {' + '\n' +
  '      // 同步开关的输入是压力板或按钮的id' + '\n' +
  '      const s1 = getTriggerStatus(ss.id1);' + '\n' +
  '      const s2 = getTriggerStatus(ss.id2);' + '\n' +
  '      let active;' + '\n' +
  '      if (ss.once) {' + '\n' +
  '        if (s1 && s2) ss.triggered = true;' + '\n' +
  '        active = ss.triggered;' + '\n' +
  '      } else {' + '\n' +
  '        active = s1 && s2;' + '\n' +
  '      }' + '\n' +
  '      ss.active = active;' + '\n' +
  '      if (ss.targetId) {' + '\n' +
  '        if (!triggerMap[ss.targetId]) triggerMap[ss.targetId] = [];' + '\n' +
  '        triggerMap[ss.targetId].push(active);' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    function getTriggerStatus(id) {' + '\n' +
  '      // 先查压力板' + '\n' +
  '      for (const pl of plates) if (pl.id === id) return pl.pressed;' + '\n' +
  '      // 再查按钮' + '\n' +
  '      for (const b of buttons) if (b.id === id) return b.activated;' + '\n' +
  '      return false;' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 计算每扇门的触发状态' + '\n' +
  '    for (const d of doors) {' + '\n' +
  '      const triggers = triggerMap[d.id] || [];' + '\n' +
  '      if (d.mode === \'all\') {' + '\n' +
  '        d._shouldOpen = triggers.length > 0 && triggers.every(t => t);' + '\n' +
  '      } else {' + '\n' +
  '        // \'any\' 模式' + '\n' +
  '        d._shouldOpen = triggers.some(t => t);' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 计算每个移动平台的触发状态' + '\n' +
  '    for (const mp of movingPlatforms) {' + '\n' +
  '      if (mp.triggerId === null) {' + '\n' +
  '        mp._shouldRun = true;' + '\n' +
  '      } else {' + '\n' +
  '        const triggers = triggerMap[mp.triggerId] || [];' + '\n' +
  '        mp._shouldRun = triggers.some(t => t);' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 计算切换平台的显示状态（按组）' + '\n' +
  '    // 规则：A组显示时B组隐藏，反之亦然。开关控制哪组显示。' + '\n' +
  '    // 每个切换平台的triggerId决定它属于哪组以及由谁控制' + '\n' +
  '    for (const tp of togglePlatforms) {' + '\n' +
  '      if (tp.triggerId === null) {' + '\n' +
  '        tp._shouldShow = tp.visible;' + '\n' +
  '      } else {' + '\n' +
  '        const triggers = triggerMap[tp.triggerId] || [];' + '\n' +
  '        const active = triggers.some(t => t);' + '\n' +
  '        // group A: active=true时显示; group B: active=false时显示（反转）' + '\n' +
  '        tp._shouldShow = tp.group === \'A\' ? active : !active;' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 计算尖刺的冻结状态' + '\n' +
  '    for (const sp of spikes) {' + '\n' +
  '      if (sp.triggerId === null) {' + '\n' +
  '        sp._shouldFreeze = false;' + '\n' +
  '      } else {' + '\n' +
  '        const triggers = triggerMap[sp.triggerId] || [];' + '\n' +
  '        if (sp.mode === \'all\') {' + '\n' +
  '          sp._shouldFreeze = triggers.length > 0 && triggers.every(t => t);' + '\n' +
  '        } else {' + '\n' +
  '          sp._shouldFreeze = triggers.some(t => t);' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 更新逻辑' + '\n' +
  '  // ============================================================' + '\n' +
  '  function update() {' + '\n' +
  '    if (gameState === STATE.PLAYING) {' + '\n' +
  '      updateGame();' + '\n' +
  '    } else if (gameState === STATE.FAILED) {' + '\n' +
  '      // 失败态：暂停游戏循环，显示失败面板' + '\n' +
  '      updateParticles();' + '\n' +
  '    } else if (gameState === STATE.LEVEL_INTRO) {' + '\n' +
  '      introTimer--;' + '\n' +
  '      if (introTimer <= 0) {' + '\n' +
  '        gameState = STATE.PLAYING;' + '\n' +
  '        document.getElementById(\'levelBanner\').classList.add(\'hidden\');' + '\n' +
  '      }' + '\n' +
  '    } else if (gameState === STATE.LEVEL_CLEAR) {' + '\n' +
  '      clearTimer--;' + '\n' +
  '      updateParticles();' + '\n' +
  '      updateFireworks();' + '\n' +
  '      if (clearTimer <= 0) {' + '\n' +
  '        currentLevel++;' + '\n' +
  '        if (currentLevel >= LEVELS.length) {' + '\n' +
  '          // 最后一关走烟花大礼花表演' + '\n' +
  '          startFireworkShow();' + '\n' +
  '          gameState = STATE.WIN;' + '\n' +
  '          // winScreen 延迟到烟花演完再显示' + '\n' +
  '        } else if (LEVELS[currentLevel] && LEVELS[currentLevel].isEasterEgg) {' + '\n' +
  '          // 下一关是彩蛋关：显示"恭喜发现彩蛋"界面，提供进入按钮' + '\n' +
  '          gameState = STATE.EGG_REVEAL;' + '\n' +
  '          showEggReveal();' + '\n' +
  '        } else {' + '\n' +
  '          showLevelIntro(currentLevel);' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '    } else if (gameState === STATE.WIN) {' + '\n' +
  '      updateParticles();' + '\n' +
  '      updateFireworks();' + '\n' +
  '    } else if (gameState === STATE.EGG_REVEAL) {' + '\n' +
  '      // 彩蛋揭示界面：静态，不更新游戏' + '\n' +
  '      updateParticles();' + '\n' +
  '    } else if (gameState === STATE.PLAYING && level && level.isEasterEgg && eggPhase === \'fireworks\') {' + '\n' +
  '      // 彩蛋关烟花表演期间：继续更新粒子和烟花' + '\n' +
  '      updateParticles();' + '\n' +
  '      updateFireworks();' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function updateGame() {' + '\n' +
  '    try {' + '\n' +
  '    // 1. 先检测压力板和按钮（基于上一帧位置）' + '\n' +
  '    for (const pl of plates) {' + '\n' +
  '      const wasPressed = pl.pressed;' + '\n' +
  '      pl.check(players, boxes);' + '\n' +
  '      if (pl.pressed && !wasPressed) SFX.playDing();' + '\n' +
  '    }' + '\n' +
  '    for (const b of buttons) {' + '\n' +
  '      const wasActive = b.activated || b.pressed;' + '\n' +
  '      b.check(players);' + '\n' +
  '      const nowActive = b.activated || b.pressed;' + '\n' +
  '      if (nowActive && !wasActive) SFX.playDing();' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 2. 计算触发映射' + '\n' +
  '    computeTriggers();' + '\n' +
  '' + '\n' +
  '    // 3. 更新门' + '\n' +
  '    for (const d of doors) {' + '\n' +
  '      const wasOpen = d.open;' + '\n' +
  '      d.update(d._shouldOpen);' + '\n' +
  '      if (d.open && !wasOpen) SFX.playDoor();' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 4. 更新移动平台' + '\n' +
  '    for (const mp of movingPlatforms) mp.update(mp._shouldRun);' + '\n' +
  '' + '\n' +
  '    // 4b. 更新切换平台' + '\n' +
  '    for (const tp of togglePlatforms) tp.update(tp._shouldShow);' + '\n' +
  '' + '\n' +
  '    // 4c. 更新尖刺' + '\n' +
  '    for (const sp of spikes) sp.update(sp._shouldFreeze);' + '\n' +
  '' + '\n' +
  '    // 5. 构建 solids 列表' + '\n' +
  '    const staticSolids = platforms.concat(walls);' + '\n' +
  '    const doorSolids = doors.filter(d => d.isSolid()).map(d => d.collideRect);' + '\n' +
  '    const mpSolids = movingPlatforms.map(mp => ({ x: mp.x, y: mp.y, w: mp.w, h: mp.h }));' + '\n' +
  '    const tpSolids = togglePlatforms.filter(tp => tp.isSolid).map(tp => ({ x: tp.x, y: tp.y, w: tp.w, h: tp.h }));' + '\n' +
  '    const solids = staticSolids.concat(doorSolids).concat(mpSolids).concat(tpSolids);' + '\n' +
  '' + '\n' +
  '    // 6. 更新箱子' + '\n' +
  '    let needReset = false;' + '\n' +
  '    for (const b of boxes) {' + '\n' +
  '      if (b.update(solids, boxes, players)) {' + '\n' +
  '        needReset = true;' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 7. 更新玩家' + '\n' +
  '    for (const p of players) {' + '\n' +
  '      try {' + '\n' +
  '        if (p.update(solids, boxes, players)) {' + '\n' +
  '          needReset = true;' + '\n' +
  '        }' + '\n' +
  '      } catch (e) {' + '\n' +
  '        console.error(\'Player update error (\' + p.color + \'):\', e);' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 7b. 尖刺碰撞检测（碰到即重置）' + '\n' +
  '    for (const sp of spikes) {' + '\n' +
  '      for (const p of players) {' + '\n' +
  '        if (sp.collidesPlayer(p)) {' + '\n' +
  '          needReset = true;' + '\n' +
  '          break;' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 移动平台上的玩家跟随移动（简化处理：如果站在移动平台上，随平台移动）' + '\n' +
  '    for (const p of players) {' + '\n' +
  '      for (const mp of movingPlatforms) {' + '\n' +
  '        if (p.onGround &&' + '\n' +
  '            p.x + p.w > mp.x + 2 && p.x < mp.x + mp.w - 2 &&' + '\n' +
  '            Math.abs((p.y + p.h) - mp.y) < 4) {' + '\n' +
  '          p.x += mp.dx;' + '\n' +
  '          // 垂直方向由碰撞处理' + '\n' +
  '          if (mp.dy < 0) {' + '\n' +
  '            p.y += mp.dy; // 平台上升，跟着升' + '\n' +
  '          }' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    if (needReset) {' + '\n' +
  '      showFailed();' + '\n' +
  '      return;' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 8. 通关判定' + '\n' +
  '    const blackInGoal = isPlayerInGoal(\'black\');' + '\n' +
  '    const whiteInGoal = isPlayerInGoal(\'white\');' + '\n' +
  '    const allIn = blackInGoal && whiteInGoal;' + '\n' +
  '' + '\n' +
  '    if (allIn) {' + '\n' +
  '      winHoldTime++;' + '\n' +
  '      if (winHoldTime > 60) {' + '\n' +
  '        triggerLevelClear();' + '\n' +
  '      }' + '\n' +
  '    } else {' + '\n' +
  '      winHoldTime = 0;' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 彩蛋关特殊逻辑' + '\n' +
  '    if (level.isEasterEgg && eggGoals.length > 0) {' + '\n' +
  '      const blackInEgg = isPlayerInEggGoal(\'black\');' + '\n' +
  '      const whiteInEgg = isPlayerInEggGoal(\'white\');' + '\n' +
  '      const bothIn = blackInEgg && whiteInEgg;' + '\n' +
  '' + '\n' +
  '      if (bothIn && !eggFireworkStarted && eggPhase !== \'ignite\') {' + '\n' +
  '        // 两人同时站上，开始燃烧引线' + '\n' +
  '        if (!eggFuseBurning) {' + '\n' +
  '          eggFuseBurning = true;' + '\n' +
  '          eggPhase = \'fuse\';' + '\n' +
  '          SFX.playFuseSpark();' + '\n' +
  '        }' + '\n' +
  '        eggFuseProgress += 1 / 120; // 约2秒烧完' + '\n' +
  '        if (eggFuseProgress >= 1) {' + '\n' +
  '          eggFuseProgress = 1;' + '\n' +
  '          eggPhase = \'ignite\';     // 进入点火预热阶段' + '\n' +
  '          eggIgniteTimer = 36;      // 约0.6秒喷焰预热后起飞' + '\n' +
  '        }' + '\n' +
  '      } else if (!bothIn && eggFuseBurning && !eggFireworkStarted && eggPhase !== \'ignite\') {' + '\n' +
  '        // 离开判定区，引线逐渐熄灭' + '\n' +
  '        eggFuseProgress -= 1 / 180;' + '\n' +
  '        if (eggFuseProgress <= 0) {' + '\n' +
  '          eggFuseProgress = 0;' + '\n' +
  '          eggFuseBurning = false;' + '\n' +
  '          eggPhase = \'idle\';' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 点火预热阶段：火箭喷焰但还没起飞' + '\n' +
  '    if (level.isEasterEgg && eggPhase === \'ignite\') {' + '\n' +
  '      eggIgniteTimer--;' + '\n' +
  '      if (eggIgniteTimer <= 0) {' + '\n' +
  '        eggFireworkStarted = true;' + '\n' +
  '        eggPhase = \'fireworks\';' + '\n' +
  '        startEasterFireworkShow();' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 彩蛋关烟花表演期间：更新烟花（火箭上升、爆炸、粒子由updateParticles处理）' + '\n' +
  '    if (level.isEasterEgg && eggPhase === \'fireworks\') {' + '\n' +
  '      updateFireworks();' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    updateParticles();' + '\n' +
  '    } catch (e) {' + '\n' +
  '      console.error(\'updateGame error:\', e);' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function isPlayerInGoal(color) {' + '\n' +
  '    for (const g of goals) {' + '\n' +
  '      if (g.color !== color) continue;' + '\n' +
  '      for (const p of players) {' + '\n' +
  '        if (p.color === color && g.contains(p) && p.onGround) return true;' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '    return false;' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function isPlayerInEggGoal(color) {' + '\n' +
  '    for (const g of eggGoals) {' + '\n' +
  '      if (g.color !== color) continue;' + '\n' +
  '      for (const p of players) {' + '\n' +
  '        if (p.color === color && g.contains(p)) return true;' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '    return false;' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function showFailed() {' + '\n' +
  '    gameState = STATE.FAILED;' + '\n' +
  '    document.getElementById(\'failScreen\').classList.remove(\'hidden\');' + '\n' +
  '    document.getElementById(\'failLevel\').textContent =' + '\n' +
  '      `第 ${currentLevel + 1} 关 · ${LEVELS[currentLevel].name}`;' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function retryLevel() {' + '\n' +
  '    document.getElementById(\'failScreen\').classList.add(\'hidden\');' + '\n' +
  '    loadLevel(currentLevel);' + '\n' +
  '    gameState = STATE.PLAYING;' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function backToMenu() {' + '\n' +
  '    document.getElementById(\'failScreen\').classList.add(\'hidden\');' + '\n' +
  '    document.getElementById(\'winScreen\').classList.add(\'hidden\');' + '\n' +
  '    document.getElementById(\'levelSelect\').classList.add(\'hidden\');' + '\n' +
  '    document.getElementById(\'creditsScreen\').classList.add(\'hidden\');' + '\n' +
  '    document.getElementById(\'startScreen\').classList.remove(\'hidden\');' + '\n' +
  '    SFX.stopBGM();' + '\n' +
  '    gameState = STATE.MENU;' + '\n' +
  '    updateMenuButtons();' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function triggerLevelClear() {' + '\n' +
  '    // 通关后解锁下一关' + '\n' +
  '    if (currentLevel + 1 < LEVELS.length) {' + '\n' +
  '      saveProgress(currentLevel + 1);' + '\n' +
  '    }' + '\n' +
  '    SFX.playClear();' + '\n' +
  '    gameState = STATE.LEVEL_CLEAR;' + '\n' +
  '    clearTimer = 120;' + '\n' +
  '    for (const g of goals) {' + '\n' +
  '      for (let i = 0; i < 25; i++) {' + '\n' +
  '        const angle = Math.random() * Math.PI * 2;' + '\n' +
  '        const speed = 2 + Math.random() * 5;' + '\n' +
  '        particles.push({' + '\n' +
  '          x: g.x + g.w / 2,' + '\n' +
  '          y: g.y + g.h / 2,' + '\n' +
  '          vx: Math.cos(angle) * speed,' + '\n' +
  '          vy: Math.sin(angle) * speed - 2,' + '\n' +
  '          life: 50 + Math.random() * 30,' + '\n' +
  '          maxLife: 80,' + '\n' +
  '          color: g.color === \'black\' ? \'#000\' : \'#fff\',' + '\n' +
  '          size: 2 + Math.random() * 3' + '\n' +
  '        });' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function updateParticles() {' + '\n' +
  '    for (let i = particles.length - 1; i >= 0; i--) {' + '\n' +
  '      const p = particles[i];' + '\n' +
  '      if (p.isFlash) {' + '\n' +
  '        p.life--;' + '\n' +
  '        if (p.life <= 0) particles.splice(i, 1);' + '\n' +
  '        continue;' + '\n' +
  '      }' + '\n' +
  '      // 拖尾记录' + '\n' +
  '      if (p.trail) {' + '\n' +
  '        p.trail.push({ x: p.x, y: p.y });' + '\n' +
  '        if (p.trail.length > 6) p.trail.shift();' + '\n' +
  '      }' + '\n' +
  '      p.x += p.vx;' + '\n' +
  '      p.y += p.vy;' + '\n' +
  '      p.vy += (p.gravity != null ? p.gravity : 0.15);' + '\n' +
  '      // 空气阻力，让扩散更自然' + '\n' +
  '      p.vx *= 0.99;' + '\n' +
  '      p.life--;' + '\n' +
  '      if (p.life <= 0) particles.splice(i, 1);' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 烟花大礼花（最后一关通关后播放）' + '\n' +
  '  // ============================================================' + '\n' +
  '  const FW_COLORS = [\'#ff6b6b\', \'#ffd93d\', \'#6bcB77\', \'#4d96ff\', \'#c56bff\', \'#ff8fb1\', \'#ff9f43\', \'#00d2d3\', \'#feca57\', \'#ff6b81\'];' + '\n' +
  '' + '\n' +
  '  function startFireworkShow() {' + '\n' +
  '    fireworkPhase = \'show\';' + '\n' +
  '    fireworkTimer = 240; // 约4秒' + '\n' +
  '    fireworks = [];' + '\n' +
  '    // 先发射三枚' + '\n' +
  '    for (let i = 0; i < 3; i++) {' + '\n' +
  '      setTimeout(() => launchFirework(), i * 300);' + '\n' +
  '    }' + '\n' +
  '    // 后续继续补发' + '\n' +
  '    let t = 900;' + '\n' +
  '    for (let i = 0; i < 12; i++) {' + '\n' +
  '      t += 180 + Math.random() * 200;' + '\n' +
  '      setTimeout(() => {' + '\n' +
  '        if (fireworkPhase === \'show\') launchFirework();' + '\n' +
  '      }, t);' + '\n' +
  '    }' + '\n' +
  '    // 压轴齐射' + '\n' +
  '    setTimeout(() => {' + '\n' +
  '      if (fireworkPhase === \'show\') {' + '\n' +
  '        for (let i = 0; i < 5; i++) launchFirework();' + '\n' +
  '      }' + '\n' +
  '    }, t + 200);' + '\n' +
  '    // 结束显示胜利界面' + '\n' +
  '    setTimeout(() => {' + '\n' +
  '      fireworkPhase = \'done\';' + '\n' +
  '      document.getElementById(\'winScreen\').classList.remove(\'hidden\');' + '\n' +
  '    }, t + 1200);' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // 彩蛋关盛大烟花表演（约10秒）' + '\n' +
  '  function startEasterFireworkShow() {' + '\n' +
  '    fireworkPhase = \'show\';' + '\n' +
  '    fireworks = [];' + '\n' +
  '    const grandColors = [\'#ff3b3b\', \'#ff7b3b\', \'#ffb83b\', \'#ffe23b\', \'#8aff3b\', \'#3bff9d\', \'#3bf0ff\', \'#3b8bff\', \'#7b3bff\', \'#d13bff\', \'#ff3bd1\', \'#ff3b7b\', \'#ffd700\', \'#ff6b81\'];' + '\n' +
  '    const originalColors = FW_COLORS.slice();' + '\n' +
  '    FW_COLORS.splice(0, FW_COLORS.length, ...grandColors);' + '\n' +
  '' + '\n' +
  '    // 发射一枚指定的火箭' + '\n' +
  '    const launchAt = (x, targetY, color, vyMul = 1) => {' + '\n' +
  '      const vy = -(9 + Math.random() * 3) * vyMul;' + '\n' +
  '      fireworks.push({' + '\n' +
  '        type: \'rocket\',' + '\n' +
  '        x: x,' + '\n' +
  '        y: H - 20,' + '\n' +
  '        vy: vy,' + '\n' +
  '        targetY: targetY,' + '\n' +
  '        color: color || grandColors[Math.floor(Math.random() * grandColors.length)],' + '\n' +
  '        trail: []' + '\n' +
  '      });' + '\n' +
  '      SFX.playFireworkLaunch();' + '\n' +
  '    };' + '\n' +
  '' + '\n' +
  '    // 批量随机发射' + '\n' +
  '    const playBurst = (count, delayStart, delaySpread = 150) => {' + '\n' +
  '      for (let i = 0; i < count; i++) {' + '\n' +
  '        setTimeout(() => {' + '\n' +
  '          if (fireworkPhase === \'show\') {' + '\n' +
  '            launchAt(' + '\n' +
  '              60 + Math.random() * (W - 120),' + '\n' +
  '              60 + Math.random() * 280,' + '\n' +
  '              grandColors[Math.floor(Math.random() * grandColors.length)]' + '\n' +
  '            );' + '\n' +
  '          }' + '\n' +
  '        }, delayStart + i * delaySpread);' + '\n' +
  '      }' + '\n' +
  '    };' + '\n' +
  '' + '\n' +
  '    // ---- 开场：2枚预热，一左一右 ----' + '\n' +
  '    setTimeout(() => { if (fireworkPhase === \'show\') launchAt(250, 180, grandColors[0]); }, 200);' + '\n' +
  '    setTimeout(() => { if (fireworkPhase === \'show\') launchAt(W - 250, 160, grandColors[5]); }, 800);' + '\n' +
  '' + '\n' +
  '    // ---- 第一轮：6枚快速连发（1.2s起） ----' + '\n' +
  '    playBurst(6, 1200, 220);' + '\n' +
  '' + '\n' +
  '    // ---- 第二轮：不同高度错落（3s起，10枚分布在不同高度） ----' + '\n' +
  '    setTimeout(() => {' + '\n' +
  '      if (fireworkPhase !== \'show\') return;' + '\n' +
  '      for (let i = 0; i < 10; i++) {' + '\n' +
  '        setTimeout(() => {' + '\n' +
  '          if (fireworkPhase !== \'show\') return;' + '\n' +
  '          const x = 80 + Math.random() * (W - 160);' + '\n' +
  '          const ty = 50 + Math.random() * 300;' + '\n' +
  '          const c = grandColors[Math.floor(Math.random() * grandColors.length)];' + '\n' +
  '          launchAt(x, ty, c);' + '\n' +
  '        }, i * 160);' + '\n' +
  '      }' + '\n' +
  '    }, 3000);' + '\n' +
  '' + '\n' +
  '    // ---- 第三轮：两侧扇形对射（4.8s起） ----' + '\n' +
  '    setTimeout(() => {' + '\n' +
  '      if (fireworkPhase !== \'show\') return;' + '\n' +
  '      for (let i = 0; i < 7; i++) {' + '\n' +
  '        setTimeout(() => {' + '\n' +
  '          if (fireworkPhase !== \'show\') return;' + '\n' +
  '          // 左排' + '\n' +
  '          launchAt(120 + i * 40, 100 + Math.random() * 100, grandColors[i % grandColors.length], 1.05);' + '\n' +
  '          // 右排' + '\n' +
  '          launchAt(W - 120 - i * 40, 90 + Math.random() * 110, grandColors[(i + 5) % grandColors.length], 1.05);' + '\n' +
  '        }, i * 110);' + '\n' +
  '      }' + '\n' +
  '    }, 4800);' + '\n' +
  '' + '\n' +
  '    // ---- 第四轮：环形包围式齐射（6.5s起，8枚分布在屏幕各处同时爆炸） ----' + '\n' +
  '    setTimeout(() => {' + '\n' +
  '      if (fireworkPhase !== \'show\') return;' + '\n' +
  '      const ring = [' + '\n' +
  '        { x: 150, ty: 200 }, { x: 350, ty: 100 }, { x: 550, ty: 140 },' + '\n' +
  '        { x: W/2, ty: 70 },' + '\n' +
  '        { x: W - 550, ty: 140 }, { x: W - 350, ty: 100 }, { x: W - 150, ty: 200 },' + '\n' +
  '        { x: 250, ty: 300 }, { x: W - 250, ty: 300 },' + '\n' +
  '      ];' + '\n' +
  '      for (let i = 0; i < ring.length; i++) {' + '\n' +
  '        const r = ring[i];' + '\n' +
  '        // 不同速度让它们差不多同时到达目标高度' + '\n' +
  '        const travel = H - 20 - r.ty;' + '\n' +
  '        const vy = -(travel / 55 + Math.random() * 1); // 约55帧到达' + '\n' +
  '        const c = grandColors[i % grandColors.length];' + '\n' +
  '        fireworks.push({' + '\n' +
  '          type: \'rocket\', x: r.x, y: H - 20,' + '\n' +
  '          vy: vy, targetY: r.ty, color: c, trail: []' + '\n' +
  '        });' + '\n' +
  '        SFX.playFireworkLaunch();' + '\n' +
  '      }' + '\n' +
  '    }, 6500);' + '\n' +
  '' + '\n' +
  '    // ---- 压轴第一波：15枚全屏齐射（8s） ----' + '\n' +
  '    setTimeout(() => {' + '\n' +
  '      if (fireworkPhase !== \'show\') return;' + '\n' +
  '      for (let i = 0; i < 15; i++) {' + '\n' +
  '        const x = 50 + (i / 14) * (W - 100) + (Math.random() - 0.5) * 30;' + '\n' +
  '        const ty = 50 + Math.random() * 280;' + '\n' +
  '        const travel = H - 20 - ty;' + '\n' +
  '        const vy = -(travel / 50 + Math.random() * 1);' + '\n' +
  '        const c = grandColors[Math.floor(Math.random() * grandColors.length)];' + '\n' +
  '        fireworks.push({' + '\n' +
  '          type: \'rocket\', x: x, y: H - 20,' + '\n' +
  '          vy: vy, targetY: ty, color: c, trail: []' + '\n' +
  '        });' + '\n' +
  '        SFX.playFireworkLaunch();' + '\n' +
  '      }' + '\n' +
  '    }, 8000);' + '\n' +
  '' + '\n' +
  '    // ---- 压轴第二波：20枚超大全屏绽放（9s，最大的一波） ----' + '\n' +
  '    setTimeout(() => {' + '\n' +
  '      if (fireworkPhase !== \'show\') return;' + '\n' +
  '      for (let i = 0; i < 20; i++) {' + '\n' +
  '        const x = 40 + Math.random() * (W - 80);' + '\n' +
  '        const ty = 40 + Math.random() * 320;' + '\n' +
  '        const c = grandColors[Math.floor(Math.random() * grandColors.length)];' + '\n' +
  '        // 延迟一小段时间错开爆炸，更有节奏感' + '\n' +
  '        setTimeout(() => {' + '\n' +
  '          if (fireworkPhase !== \'show\') return;' + '\n' +
  '          launchAt(x, ty, c, 1.1);' + '\n' +
  '        }, i * 40);' + '\n' +
  '      }' + '\n' +
  '    }, 9000);' + '\n' +
  '' + '\n' +
  '    // 结束：显示制作人员名单' + '\n' +
  '    setTimeout(() => {' + '\n' +
  '      fireworkPhase = \'done\';' + '\n' +
  '      eggPhase = \'credits\';' + '\n' +
  '      showCredits();' + '\n' +
  '      FW_COLORS.splice(0, FW_COLORS.length, ...originalColors);' + '\n' +
  '    }, 12000);' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // 显示彩蛋揭示界面' + '\n' +
  '  function showEggReveal() {' + '\n' +
  '    gameState = STATE.EGG_REVEAL;' + '\n' +
  '    // 先保存彩蛋关解锁进度' + '\n' +
  '    saveProgress(LEVELS.length - 1);' + '\n' +
  '    document.getElementById(\'eggRevealScreen\').classList.remove(\'hidden\');' + '\n' +
  '    SFX.playClear();' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // 显示制作人员名单（滚动动画）' + '\n' +
  '  function showCredits() {' + '\n' +
  '    const screen = document.getElementById(\'creditsScreen\');' + '\n' +
  '    const content = document.getElementById(\'creditsContent\');' + '\n' +
  '    const bottomArea = document.getElementById(\'creditsBottomArea\');' + '\n' +
  '    screen.classList.remove(\'hidden\');' + '\n' +
  '    // 重置位置' + '\n' +
  '    content.style.top = \'100%\';' + '\n' +
  '    bottomArea.style.opacity = \'0\';' + '\n' +
  '    // 2秒后开始滚动，总滚动约12秒' + '\n' +
  '    setTimeout(() => {' + '\n' +
  '      content.style.transition = \'top 14s linear\';' + '\n' +
  '      // 计算需要滚到的位置：让内容底部停在屏幕中间偏上' + '\n' +
  '      const containerHeight = screen.clientHeight;' + '\n' +
  '      const contentHeight = content.scrollHeight;' + '\n' +
  '      const targetTop = containerHeight / 2 - contentHeight + 100;' + '\n' +
  '      content.style.top = targetTop + \'px\';' + '\n' +
  '      // 滚动结束后显示返回按钮' + '\n' +
  '      setTimeout(() => {' + '\n' +
  '        bottomArea.style.opacity = \'1\';' + '\n' +
  '      }, 13500);' + '\n' +
  '    }, 1500);' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function launchFirework() {' + '\n' +
  '    SFX.playFireworkLaunch();' + '\n' +
  '    const startX = 80 + Math.random() * (W - 160);' + '\n' +
  '    const targetY = 100 + Math.random() * 200;' + '\n' +
  '    const color = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];' + '\n' +
  '    fireworks.push({' + '\n' +
  '      type: \'rocket\',' + '\n' +
  '      x: startX,' + '\n' +
  '      y: H - 20,' + '\n' +
  '      vy: -(9 + Math.random() * 3),' + '\n' +
  '      targetY: targetY,' + '\n' +
  '      color: color,' + '\n' +
  '      trail: []' + '\n' +
  '    });' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function explodeFirework(fw) {' + '\n' +
  '    SFX.playFireworkBoom();' + '\n' +
  '    const count = 100 + Math.floor(Math.random() * 80);' + '\n' +
  '    const baseColor = fw.color;' + '\n' +
  '    // 搭配色：同一色系的亮色 + 白色高光' + '\n' +
  '    const accentColors = [baseColor, \'#ffffff\', \'#fff3a0\', \'#ffd080\'];' + '\n' +
  '    for (let i = 0; i < count; i++) {' + '\n' +
  '      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;' + '\n' +
  '      const speed = 3 + Math.random() * 5; // 更大扩散速度' + '\n' +
  '      const col = i % 7 === 0 ? \'#ffffff\' : (i % 5 === 0 ? accentColors[2 + (i % 2)] : baseColor);' + '\n' +
  '      particles.push({' + '\n' +
  '        x: fw.x,' + '\n' +
  '        y: fw.y,' + '\n' +
  '        vx: Math.cos(angle) * speed,' + '\n' +
  '        vy: Math.sin(angle) * speed,' + '\n' +
  '        life: 55 + Math.random() * 35,' + '\n' +
  '        maxLife: 90,' + '\n' +
  '        color: col,' + '\n' +
  '        size: 3 + Math.random() * 3.5, // 更大粒子' + '\n' +
  '        gravity: 0.06,' + '\n' +
  '        trail: [] // 粒子拖尾' + '\n' +
  '      });' + '\n' +
  '    }' + '\n' +
  '    // 爆炸闪光：生成一个短暂的大光点' + '\n' +
  '    particles.push({' + '\n' +
  '      x: fw.x,' + '\n' +
  '      y: fw.y,' + '\n' +
  '      vx: 0, vy: 0,' + '\n' +
  '      life: 10,' + '\n' +
  '      maxLife: 10,' + '\n' +
  '      color: \'#ffffff\',' + '\n' +
  '      size: 60,' + '\n' +
  '      gravity: 0,' + '\n' +
  '      isFlash: true' + '\n' +
  '    });' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function updateFireworks() {' + '\n' +
  '    for (let i = fireworks.length - 1; i >= 0; i--) {' + '\n' +
  '      const f = fireworks[i];' + '\n' +
  '      if (f.type === \'rocket\') {' + '\n' +
  '        f.y += f.vy;' + '\n' +
  '        f.vy += 0.06;' + '\n' +
  '        // 尾迹' + '\n' +
  '        f.trail.push({ x: f.x, y: f.y, life: 12 });' + '\n' +
  '        if (f.trail.length > 8) f.trail.shift();' + '\n' +
  '        if (f.y <= f.targetY || f.vy >= 0) {' + '\n' +
  '          explodeFirework(f);' + '\n' +
  '          fireworks.splice(i, 1);' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '    // 尾迹life递减（这里不画，仅维护）' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function drawFireworks(ctx) {' + '\n' +
  '    for (const f of fireworks) {' + '\n' +
  '      if (f.type === \'rocket\') {' + '\n' +
  '        // ---- 火箭喷焰尾迹（明亮渐变拖尾） ----' + '\n' +
  '        for (let i = 0; i < f.trail.length; i++) {' + '\n' +
  '          const t = f.trail[i];' + '\n' +
  '          const progress = (i + 1) / f.trail.length;' + '\n' +
  '          const a = progress * 0.7;' + '\n' +
  '          const w = 3 + progress * 4;' + '\n' +
  '          const grad = ctx.createLinearGradient(t.x - w, 0, t.x + w, 0);' + '\n' +
  '          grad.addColorStop(0, `rgba(255,180,50,0)`);' + '\n' +
  '          grad.addColorStop(0.5, `rgba(255,220,120,${a})`);' + '\n' +
  '          grad.addColorStop(1, `rgba(255,180,50,0)`);' + '\n' +
  '          ctx.fillStyle = grad;' + '\n' +
  '          ctx.fillRect(t.x - w, t.y, w * 2, 3 + progress * 3);' + '\n' +
  '        }' + '\n' +
  '        // ---- 火箭本体（尖头朝上的小火箭） ----' + '\n' +
  '        const bw = 5;   // body half width' + '\n' +
  '        const bl = 14;  // body length' + '\n' +
  '        const noseL = 7; // 尖头长度' + '\n' +
  '        ctx.save();' + '\n' +
  '        ctx.translate(f.x, f.y);' + '\n' +
  '        // 尾翼' + '\n' +
  '        ctx.fillStyle = \'#c0392b\';' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.moveTo(-bw, bl - 4);' + '\n' +
  '        ctx.lineTo(-bw - 4, bl + 2);' + '\n' +
  '        ctx.lineTo(-bw, bl + 2);' + '\n' +
  '        ctx.closePath();' + '\n' +
  '        ctx.fill();' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.moveTo(bw, bl - 4);' + '\n' +
  '        ctx.lineTo(bw + 4, bl + 2);' + '\n' +
  '        ctx.lineTo(bw, bl + 2);' + '\n' +
  '        ctx.closePath();' + '\n' +
  '        ctx.fill();' + '\n' +
  '        // 身体' + '\n' +
  '        ctx.fillStyle = f.color;' + '\n' +
  '        ctx.fillRect(-bw, -noseL, bw * 2, bl + noseL);' + '\n' +
  '        // 身体金色环' + '\n' +
  '        ctx.fillStyle = \'#ffd93d\';' + '\n' +
  '        ctx.fillRect(-bw, -noseL + 4, bw * 2, 1.5);' + '\n' +
  '        ctx.fillRect(-bw, bl - 4, bw * 2, 1.5);' + '\n' +
  '        // 尖头（锥形）' + '\n' +
  '        ctx.fillStyle = f.color;' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.moveTo(0, -noseL - 4);' + '\n' +
  '        ctx.lineTo(bw, -noseL);' + '\n' +
  '        ctx.lineTo(-bw, -noseL);' + '\n' +
  '        ctx.closePath();' + '\n' +
  '        ctx.fill();' + '\n' +
  '        // 尖头高光' + '\n' +
  '        ctx.fillStyle = \'rgba(255,255,255,0.6)\';' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.moveTo(0, -noseL - 4);' + '\n' +
  '        ctx.lineTo(1.5, -noseL + 1);' + '\n' +
  '        ctx.lineTo(-1.5, -noseL + 1);' + '\n' +
  '        ctx.closePath();' + '\n' +
  '        ctx.fill();' + '\n' +
  '        ctx.restore();' + '\n' +
  '        // 底部喷焰（动态闪烁）' + '\n' +
  '        const flicker = 0.8 + Math.random() * 0.4;' + '\n' +
  '        const flameLen = 14 * flicker;' + '\n' +
  '        const flameGrad = ctx.createLinearGradient(f.x, f.y + bl, f.x, f.y + bl + flameLen);' + '\n' +
  '        flameGrad.addColorStop(0, \'rgba(255,255,200,0.95)\');' + '\n' +
  '        flameGrad.addColorStop(0.4, \'rgba(255,180,60,0.85)\');' + '\n' +
  '        flameGrad.addColorStop(1, \'rgba(255,80,20,0)\');' + '\n' +
  '        ctx.fillStyle = flameGrad;' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.moveTo(f.x - 4, f.y + bl);' + '\n' +
  '        ctx.quadraticCurveTo(f.x, f.y + bl + flameLen, f.x + 4, f.y + bl);' + '\n' +
  '        ctx.closePath();' + '\n' +
  '        ctx.fill();' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // 彩蛋关元素绘制' + '\n' +
  '  function drawEasterEggElements(ctx) {' + '\n' +
  '    // 1. 绘制eggGoals（传送门判定区）' + '\n' +
  '    for (const g of eggGoals) {' + '\n' +
  '      const active = g.color === \'black\' ? isPlayerInEggGoal(\'black\') : isPlayerInEggGoal(\'white\');' + '\n' +
  '      ctx.save();' + '\n' +
  '      const alpha = active ? 0.5 : 0.15;' + '\n' +
  '      const fill = g.color === \'black\'' + '\n' +
  '        ? `rgba(40,40,60,${alpha})`' + '\n' +
  '        : `rgba(220,220,255,${alpha})`;' + '\n' +
  '      ctx.fillStyle = fill;' + '\n' +
  '      // 画传送门效果：圆角矩形 + 发光' + '\n' +
  '      ctx.beginPath();' + '\n' +
  '      const r = 12;' + '\n' +
  '      ctx.moveTo(g.x + r, g.y);' + '\n' +
  '      ctx.lineTo(g.x + g.w - r, g.y);' + '\n' +
  '      ctx.quadraticCurveTo(g.x + g.w, g.y, g.x + g.w, g.y + r);' + '\n' +
  '      ctx.lineTo(g.x + g.w, g.y + g.h - r);' + '\n' +
  '      ctx.quadraticCurveTo(g.x + g.w, g.y + g.h, g.x + g.w - r, g.y + g.h);' + '\n' +
  '      ctx.lineTo(g.x + r, g.y + g.h);' + '\n' +
  '      ctx.quadraticCurveTo(g.x, g.y + g.h, g.x, g.y + g.h - r);' + '\n' +
  '      ctx.lineTo(g.x, g.y + r);' + '\n' +
  '      ctx.quadraticCurveTo(g.x, g.y, g.x + r, g.y);' + '\n' +
  '      ctx.closePath();' + '\n' +
  '      ctx.fill();' + '\n' +
  '      if (active) {' + '\n' +
  '        ctx.strokeStyle = g.color === \'black\' ? \'#a0a0ff\' : \'#ffffff\';' + '\n' +
  '        ctx.lineWidth = 2;' + '\n' +
  '        ctx.stroke();' + '\n' +
  '        // 光芒' + '\n' +
  '        ctx.shadowColor = g.color === \'black\' ? \'#8080ff\' : \'#ffffff\';' + '\n' +
  '        ctx.shadowBlur = 20;' + '\n' +
  '        ctx.stroke();' + '\n' +
  '      }' + '\n' +
  '      ctx.restore();' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 2. 绘制烟花火箭装置（地上的小火箭，尖头朝上）' + '\n' +
  '    if (fireworkDevice) {' + '\n' +
  '      const fw = fireworkDevice;' + '\n' +
  '      const cx = fw.x + fw.w / 2;' + '\n' +
  '      const topY = fw.y;          // 火箭顶端（尖头）' + '\n' +
  '      const bottomY = fw.y + fw.h; // 火箭底部' + '\n' +
  '      const bodyTop = fw.y + fw.h * 0.35; // 尖头底部 = 身体顶部' + '\n' +
  '      const bodyW = fw.w * 0.55;' + '\n' +
  '      const bodyLeft = cx - bodyW / 2;' + '\n' +
  '      const bodyRight = cx + bodyW / 2;' + '\n' +
  '' + '\n' +
  '      ctx.save();' + '\n' +
  '' + '\n' +
  '      // ---- 发射台（小矮座） ----' + '\n' +
  '      ctx.fillStyle = \'#3a2a15\';' + '\n' +
  '      ctx.fillRect(fw.x - 8, bottomY - 6, fw.w + 16, 6);' + '\n' +
  '      ctx.fillStyle = \'#5a3a1a\';' + '\n' +
  '      ctx.fillRect(fw.x - 4, bottomY - 10, fw.w + 8, 4);' + '\n' +
  '' + '\n' +
  '      // ---- 火箭尾翼（底部两侧三角形） ----' + '\n' +
  '      const finH = fw.h * 0.28;' + '\n' +
  '      const finTop = bottomY - finH;' + '\n' +
  '      ctx.fillStyle = \'#c0392b\';' + '\n' +
  '      // 左尾翼' + '\n' +
  '      ctx.beginPath();' + '\n' +
  '      ctx.moveTo(bodyLeft, finTop + 2);' + '\n' +
  '      ctx.lineTo(bodyLeft - fw.w * 0.32, bottomY - 4);' + '\n' +
  '      ctx.lineTo(bodyLeft, bottomY - 4);' + '\n' +
  '      ctx.closePath();' + '\n' +
  '      ctx.fill();' + '\n' +
  '      // 右尾翼' + '\n' +
  '      ctx.beginPath();' + '\n' +
  '      ctx.moveTo(bodyRight, finTop + 2);' + '\n' +
  '      ctx.lineTo(bodyRight + fw.w * 0.32, bottomY - 4);' + '\n' +
  '      ctx.lineTo(bodyRight, bottomY - 4);' + '\n' +
  '      ctx.closePath();' + '\n' +
  '      ctx.fill();' + '\n' +
  '      // 尾翼金边' + '\n' +
  '      ctx.strokeStyle = \'#f1c40f\';' + '\n' +
  '      ctx.lineWidth = 1;' + '\n' +
  '      ctx.beginPath();' + '\n' +
  '      ctx.moveTo(bodyLeft, finTop + 2);' + '\n' +
  '      ctx.lineTo(bodyLeft - fw.w * 0.32, bottomY - 4);' + '\n' +
  '      ctx.moveTo(bodyRight, finTop + 2);' + '\n' +
  '      ctx.lineTo(bodyRight + fw.w * 0.32, bottomY - 4);' + '\n' +
  '      ctx.stroke();' + '\n' +
  '' + '\n' +
  '      // ---- 火箭身体（圆柱体，红底金纹） ----' + '\n' +
  '      const bodyGrad = ctx.createLinearGradient(bodyLeft, 0, bodyRight, 0);' + '\n' +
  '      bodyGrad.addColorStop(0, \'#a93226\');' + '\n' +
  '      bodyGrad.addColorStop(0.5, \'#e74c3c\');' + '\n' +
  '      bodyGrad.addColorStop(1, \'#a93226\');' + '\n' +
  '      ctx.fillStyle = bodyGrad;' + '\n' +
  '      ctx.fillRect(bodyLeft, bodyTop, bodyW, bottomY - bodyTop - 4);' + '\n' +
  '' + '\n' +
  '      // 身体金色装饰环（上下各一条）' + '\n' +
  '      ctx.fillStyle = \'#f1c40f\';' + '\n' +
  '      ctx.fillRect(bodyLeft, bodyTop + 3, bodyW, 2);' + '\n' +
  '      ctx.fillRect(bodyLeft, bottomY - 12, bodyW, 2);' + '\n' +
  '' + '\n' +
  '      // 身体中间星形/圆形装饰' + '\n' +
  '      ctx.fillStyle = \'#f1c40f\';' + '\n' +
  '      ctx.beginPath();' + '\n' +
  '      ctx.arc(cx, bodyTop + (bottomY - bodyTop) / 2 - 2, 3, 0, Math.PI * 2);' + '\n' +
  '      ctx.fill();' + '\n' +
  '' + '\n' +
  '      // ---- 火箭尖头（弹头，锥形，红金渐变） ----' + '\n' +
  '      const noseGrad = ctx.createLinearGradient(bodyLeft, topY, bodyRight, topY);' + '\n' +
  '      noseGrad.addColorStop(0, \'#c0392b\');' + '\n' +
  '      noseGrad.addColorStop(0.5, \'#ff6b5a\');' + '\n' +
  '      noseGrad.addColorStop(1, \'#c0392b\');' + '\n' +
  '      ctx.fillStyle = noseGrad;' + '\n' +
  '      ctx.beginPath();' + '\n' +
  '      ctx.moveTo(cx, topY);' + '\n' +
  '      ctx.lineTo(bodyRight, bodyTop);' + '\n' +
  '      ctx.lineTo(bodyLeft, bodyTop);' + '\n' +
  '      ctx.closePath();' + '\n' +
  '      ctx.fill();' + '\n' +
  '' + '\n' +
  '      // 尖头金色尖端高光' + '\n' +
  '      ctx.fillStyle = \'#f39c12\';' + '\n' +
  '      ctx.beginPath();' + '\n' +
  '      ctx.moveTo(cx, topY);' + '\n' +
  '      ctx.lineTo(cx + 2, bodyTop - 8);' + '\n' +
  '      ctx.lineTo(cx - 2, bodyTop - 8);' + '\n' +
  '      ctx.closePath();' + '\n' +
  '      ctx.fill();' + '\n' +
  '' + '\n' +
  '      // ---- 底部喷焰口（深色） ----' + '\n' +
  '      ctx.fillStyle = \'#1a0a00\';' + '\n' +
  '      ctx.fillRect(bodyLeft + 2, bottomY - 6, bodyW - 4, 4);' + '\n' +
  '' + '\n' +
  '      // ---- 点燃后 / 发射前喷焰效果 ----' + '\n' +
  '      if (eggFireworkStarted || eggFuseBurning || eggPhase === \'ignite\') {' + '\n' +
  '        const isIgnite = eggPhase === \'ignite\';' + '\n' +
  '        const flicker = isIgnite ? 0.9 + Math.random() * 0.3 : 0.7 + Math.random() * 0.5;' + '\n' +
  '        const flameH = isIgnite ? 22 * flicker : 12 * flicker;' + '\n' +
  '        // 外焰（橙红）' + '\n' +
  '        const flameGrad = ctx.createLinearGradient(cx, bottomY, cx, bottomY + flameH);' + '\n' +
  '        flameGrad.addColorStop(0, \'rgba(255,230,130,0.95)\');' + '\n' +
  '        flameGrad.addColorStop(0.4, \'rgba(255,150,40,0.85)\');' + '\n' +
  '        flameGrad.addColorStop(1, \'rgba(255,60,20,0)\');' + '\n' +
  '        ctx.fillStyle = flameGrad;' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.moveTo(bodyLeft + 1, bottomY - 2);' + '\n' +
  '        ctx.quadraticCurveTo(cx, bottomY + flameH, bodyRight - 1, bottomY - 2);' + '\n' +
  '        ctx.closePath();' + '\n' +
  '        ctx.fill();' + '\n' +
  '        // 内焰（亮白）' + '\n' +
  '        ctx.fillStyle = `rgba(255,255,230,${isIgnite ? 0.95 * flicker : 0.85 * flicker})`;' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.moveTo(bodyLeft + 5, bottomY - 2);' + '\n' +
  '        ctx.quadraticCurveTo(cx, bottomY + flameH * (isIgnite ? 0.6 : 0.55), bodyRight - 5, bottomY - 2);' + '\n' +
  '        ctx.closePath();' + '\n' +
  '        ctx.fill();' + '\n' +
  '        // 火星粒子（发射前/点火时效果更明显）' + '\n' +
  '        const sparkCount = isIgnite ? 8 : (eggFuseProgress > 0.85 ? 4 : 2);' + '\n' +
  '        for (let i = 0; i < sparkCount; i++) {' + '\n' +
  '          const sx = cx + (Math.random() - 0.5) * (isIgnite ? 18 : 12);' + '\n' +
  '          const sy = bottomY + 2 + Math.random() * (isIgnite ? 28 : 16);' + '\n' +
  '          const sa = 0.4 + Math.random() * 0.5;' + '\n' +
  '          const isSpark = Math.random() > 0.5;' + '\n' +
  '          ctx.fillStyle = isSpark' + '\n' +
  '            ? `rgba(255,230,100,${sa})`' + '\n' +
  '            : `rgba(200,200,200,${sa * 0.7})`;' + '\n' +
  '          ctx.beginPath();' + '\n' +
  '          ctx.arc(sx, sy, isSpark ? 1.5 : 2 + Math.random() * 2, 0, Math.PI * 2);' + '\n' +
  '          ctx.fill();' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '' + '\n' +
  '      ctx.restore();' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 3. 绘制引线（从判定区连到烟花装置）' + '\n' +
  '    if (fireworkDevice && eggGoals.length >= 2) {' + '\n' +
  '      const g0 = eggGoals[0];' + '\n' +
  '      const g1 = eggGoals[1];' + '\n' +
  '      // 起点：两个判定区中间上方' + '\n' +
  '      const startX = (g0.x + g0.w + g1.x) / 2;' + '\n' +
  '      const startY = g0.y + 10;' + '\n' +
  '      // 终点：火箭底部（引线接入点）' + '\n' +
  '      const endX = fireworkDevice.x + fireworkDevice.w / 2;' + '\n' +
  '      const endY = fireworkDevice.y + fireworkDevice.h - 4;' + '\n' +
  '' + '\n' +
  '      // 引线路径：先向上弯曲，再水平到烟花' + '\n' +
  '      const midY = Math.min(startY, endY) - 30;' + '\n' +
  '' + '\n' +
  '      ctx.save();' + '\n' +
  '      // 引线本身' + '\n' +
  '      ctx.strokeStyle = \'#8b6914\';' + '\n' +
  '      ctx.lineWidth = 2;' + '\n' +
  '      ctx.setLineDash([4, 3]);' + '\n' +
  '      ctx.beginPath();' + '\n' +
  '      ctx.moveTo(startX, startY);' + '\n' +
  '      ctx.quadraticCurveTo((startX + endX) / 2, midY, endX, endY);' + '\n' +
  '      ctx.stroke();' + '\n' +
  '      ctx.setLineDash([]);' + '\n' +
  '' + '\n' +
  '      // 燃烧中的火花' + '\n' +
  '      if (eggFuseBurning && eggFuseProgress > 0) {' + '\n' +
  '        // 计算火花位置：从起点沿路径向终点推进' + '\n' +
  '        const t = Math.min(1, eggFuseProgress);' + '\n' +
  '        // 二次贝塞尔曲线点公式' + '\n' +
  '        const sparkX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ((startX + endX) / 2) + t * t * endX;' + '\n' +
  '        const sparkY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;' + '\n' +
  '' + '\n' +
  '        // 火花本体' + '\n' +
  '        ctx.fillStyle = \'#ffcc00\';' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2);' + '\n' +
  '        ctx.fill();' + '\n' +
  '        ctx.fillStyle = \'#ffffff\';' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);' + '\n' +
  '        ctx.fill();' + '\n' +
  '' + '\n' +
  '        // 发光' + '\n' +
  '        ctx.shadowColor = \'#ffaa00\';' + '\n' +
  '        ctx.shadowBlur = 15;' + '\n' +
  '        ctx.fillStyle = \'rgba(255,200,0,0.6)\';' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.arc(sparkX, sparkY, 6, 0, Math.PI * 2);' + '\n' +
  '        ctx.fill();' + '\n' +
  '' + '\n' +
  '        // 已燃部分（亮色）' + '\n' +
  '        ctx.strokeStyle = \'rgba(255,200,100,0.8)\';' + '\n' +
  '        ctx.lineWidth = 2.5;' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.moveTo(startX, startY);' + '\n' +
  '        // 用分段近似绘制已燃部分' + '\n' +
  '        const steps = 20;' + '\n' +
  '        for (let i = 1; i <= Math.floor(steps * t); i++) {' + '\n' +
  '          const st = i / steps;' + '\n' +
  '          const sx = (1 - st) * (1 - st) * startX + 2 * (1 - st) * st * ((startX + endX) / 2) + st * st * endX;' + '\n' +
  '          const sy = (1 - st) * (1 - st) * startY + 2 * (1 - st) * st * midY + st * st * endY;' + '\n' +
  '          ctx.lineTo(sx, sy);' + '\n' +
  '        }' + '\n' +
  '        ctx.stroke();' + '\n' +
  '      }' + '\n' +
  '      ctx.restore();' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 渲染' + '\n' +
  '  // ============================================================' + '\n' +
  '  function render() {' + '\n' +
  '    const isEgg = level && level.isEasterEgg;' + '\n' +
  '    if (isEgg) {' + '\n' +
  '      drawStarryBackground(ctx, performance.now());' + '\n' +
  '    } else {' + '\n' +
  '      const stops = level ? BG_GRADIENTS[currentLevel] || BG_GRADIENTS[0] : MENU_GRADIENT;' + '\n' +
  '      ctx.fillStyle = buildGradient(stops);' + '\n' +
  '      ctx.fillRect(0, 0, W, H);' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    if (!level) return;' + '\n' +
  '' + '\n' +
  '    // 背景装饰：极简水平线，暗示地平线（彩蛋关星空背景不需要）' + '\n' +
  '    if (!isEgg) {' + '\n' +
  '      ctx.fillStyle = \'rgba(0,0,0,0.03)\';' + '\n' +
  '      ctx.fillRect(0, H / 2, W, 1);' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 墙' + '\n' +
  '    ctx.fillStyle = \'rgba(0,0,0,0.85)\';' + '\n' +
  '    for (const w of walls) {' + '\n' +
  '      ctx.fillRect(w.x, w.y, w.w, w.h);' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 平台' + '\n' +
  '    ctx.fillStyle = \'rgba(0,0,0,0.85)\';' + '\n' +
  '    for (const p of platforms) {' + '\n' +
  '      ctx.fillRect(p.x, p.y, p.w, p.h);' + '\n' +
  '    }' + '\n' +
  '    // 平台顶部高光' + '\n' +
  '    ctx.fillStyle = \'rgba(255,255,255,0.1)\';' + '\n' +
  '    for (const p of platforms) {' + '\n' +
  '      ctx.fillRect(p.x, p.y, p.w, 2);' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 移动平台' + '\n' +
  '    for (const mp of movingPlatforms) mp.draw(ctx);' + '\n' +
  '' + '\n' +
  '    // 切换平台' + '\n' +
  '    for (const tp of togglePlatforms) tp.draw(ctx);' + '\n' +
  '' + '\n' +
  '    // 压力板' + '\n' +
  '    for (const pl of plates) pl.draw(ctx);' + '\n' +
  '' + '\n' +
  '    // 按钮' + '\n' +
  '    for (const b of buttons) b.draw(ctx);' + '\n' +
  '' + '\n' +
  '    // 门' + '\n' +
  '    for (const d of doors) d.draw(ctx);' + '\n' +
  '' + '\n' +
  '    // 箱子' + '\n' +
  '    for (const b of boxes) b.draw(ctx);' + '\n' +
  '' + '\n' +
  '    // 尖刺' + '\n' +
  '    for (const sp of spikes) sp.draw(ctx);' + '\n' +
  '' + '\n' +
  '    // 通关判定区' + '\n' +
  '    for (const g of goals) {' + '\n' +
  '      const active = g.color === \'black\' ? isPlayerInGoal(\'black\') : isPlayerInGoal(\'white\');' + '\n' +
  '      g.draw(ctx, active);' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 彩蛋关：绘制引线、烟花装置、eggGoals' + '\n' +
  '    if (level.isEasterEgg) {' + '\n' +
  '      drawEasterEggElements(ctx);' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 玩家' + '\n' +
  '    for (const p of players) p.draw(ctx);' + '\n' +
  '' + '\n' +
  '    // 粒子' + '\n' +
  '    for (const p of particles) {' + '\n' +
  '      const alpha = Math.max(0, p.life / p.maxLife);' + '\n' +
  '      if (p.isFlash) {' + '\n' +
  '        // 爆炸闪光：径向渐变的大光球' + '\n' +
  '        const r = p.size * (1 + (1 - alpha) * 0.5);' + '\n' +
  '        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);' + '\n' +
  '        grad.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);' + '\n' +
  '        grad.addColorStop(0.3, `rgba(255,240,180,${alpha * 0.5})`);' + '\n' +
  '        grad.addColorStop(1, \'rgba(255,200,80,0)\');' + '\n' +
  '        ctx.fillStyle = grad;' + '\n' +
  '        ctx.beginPath();' + '\n' +
  '        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);' + '\n' +
  '        ctx.fill();' + '\n' +
  '        continue;' + '\n' +
  '      }' + '\n' +
  '      // 普通粒子拖尾' + '\n' +
  '      if (p.trail && p.trail.length > 1) {' + '\n' +
  '        for (let ti = 0; ti < p.trail.length; ti++) {' + '\n' +
  '          const t = p.trail[ti];' + '\n' +
  '          const ta = alpha * (ti / p.trail.length) * 0.6;' + '\n' +
  '          const ts = p.size * (0.3 + ti / p.trail.length * 0.7);' + '\n' +
  '          ctx.fillStyle = p.color;' + '\n' +
  '          ctx.globalAlpha = ta;' + '\n' +
  '          ctx.beginPath();' + '\n' +
  '          ctx.arc(t.x, t.y, ts / 2, 0, Math.PI * 2);' + '\n' +
  '          ctx.fill();' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '      // 粒子本体（圆形 + 发光）' + '\n' +
  '      ctx.globalAlpha = alpha;' + '\n' +
  '      ctx.fillStyle = p.color;' + '\n' +
  '      ctx.shadowColor = p.color;' + '\n' +
  '      ctx.shadowBlur = 8;' + '\n' +
  '      ctx.beginPath();' + '\n' +
  '      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);' + '\n' +
  '      ctx.fill();' + '\n' +
  '      ctx.shadowBlur = 0;' + '\n' +
  '    }' + '\n' +
  '    ctx.globalAlpha = 1;' + '\n' +
  '' + '\n' +
  '    // 烟花（最后一关大礼花）' + '\n' +
  '    drawFireworks(ctx);' + '\n' +
  '' + '\n' +
  '    // 通关进度条' + '\n' +
  '    if (winHoldTime > 0 && gameState === STATE.PLAYING) {' + '\n' +
  '      const barW = 160;' + '\n' +
  '      const barH = 3;' + '\n' +
  '      const x = W / 2 - barW / 2;' + '\n' +
  '      const y = 70;' + '\n' +
  '      ctx.fillStyle = \'rgba(0,0,0,0.15)\';' + '\n' +
  '      ctx.fillRect(x, y, barW, barH);' + '\n' +
  '      const progress = Math.min(1, winHoldTime / 60);' + '\n' +
  '      const grad = ctx.createLinearGradient(x, y, x + barW, y);' + '\n' +
  '      grad.addColorStop(0, \'#000\');' + '\n' +
  '      grad.addColorStop(1, \'#fff\');' + '\n' +
  '      ctx.fillStyle = grad;' + '\n' +
  '      ctx.fillRect(x, y, barW * progress, barH);' + '\n' +
  '    }' + '\n' +
  '' + '\n' +
  '    // 关卡通关动画' + '\n' +
  '    if (gameState === STATE.LEVEL_CLEAR) {' + '\n' +
  '      const t = 1 - clearTimer / 120;' + '\n' +
  '      const fadeIn = Math.min(1, t * 3);' + '\n' +
  '      ctx.fillStyle = `rgba(255,255,255,${0.25 * fadeIn})`;' + '\n' +
  '      ctx.fillRect(0, 0, W, H);' + '\n' +
  '      ctx.fillStyle = `rgba(0,0,0,${fadeIn})`;' + '\n' +
  '      ctx.font = \'200 56px sans-serif\';' + '\n' +
  '      ctx.textAlign = \'center\';' + '\n' +
  '      ctx.fillText(\'通关\', W / 2, H / 2 - 10);' + '\n' +
  '      ctx.font = \'300 18px sans-serif\';' + '\n' +
  '      ctx.fillStyle = `rgba(0,0,0,${fadeIn * 0.6})`;' + '\n' +
  '      ctx.fillText(level.name, W / 2, H / 2 + 30);' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 主循环' + '\n' +
  '  // ============================================================' + '\n' +
  '  let running = false;' + '\n' +
  '  let rafId = null;' + '\n' +
  '' + '\n' +
  '  function loop() {' + '\n' +
  '    if (!running) return;' + '\n' +
  '    update();' + '\n' +
  '    render();' + '\n' +
  '    rafId = requestAnimationFrame(loop);' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  document.addEventListener(\'visibilitychange\', () => {' + '\n' +
  '    if (document.hidden) {' + '\n' +
  '      running = false;' + '\n' +
  '      if (rafId) cancelAnimationFrame(rafId);' + '\n' +
  '    } else {' + '\n' +
  '      if (gameState === STATE.PLAYING || gameState === STATE.LEVEL_CLEAR || gameState === STATE.LEVEL_INTRO) {' + '\n' +
  '        running = true;' + '\n' +
  '        loop();' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '  });' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 关卡过渡' + '\n' +
  '  // ============================================================' + '\n' +
  '  function showLevelIntro(idx) {' + '\n' +
  '    loadLevel(idx);' + '\n' +
  '    // 让按钮失去焦点，避免按键被焦点元素拦截' + '\n' +
  '    if (document.activeElement && document.activeElement.blur) {' + '\n' +
  '      document.activeElement.blur();' + '\n' +
  '    }' + '\n' +
  '    gameState = STATE.LEVEL_INTRO;' + '\n' +
  '    introTimer = 160;' + '\n' +
  '    const banner = document.getElementById(\'levelBanner\');' + '\n' +
  '    document.getElementById(\'bannerNum\').textContent = `第 ${idx + 1} 关`;' + '\n' +
  '    document.getElementById(\'bannerName\').textContent = LEVELS[idx].name;' + '\n' +
  '    document.getElementById(\'bannerDesc\').textContent = LEVELS[idx].desc;' + '\n' +
  '    banner.classList.remove(\'hidden\');' + '\n' +
  '' + '\n' +
  '    if (!running) {' + '\n' +
  '      running = true;' + '\n' +
  '      loop();' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // ============================================================' + '\n' +
  '  // 启动' + '\n' +
  '  // ============================================================' + '\n' +
  '  const isThumbnail = new URLSearchParams(window.location.search).has(\'thumbnail\');' + '\n' +
  '' + '\n' +
  '  document.getElementById(\'startBtn\').addEventListener(\'click\', startGame);' + '\n' +
  '  document.getElementById(\'continueBtn\').addEventListener(\'click\', () => {' + '\n' +
  '    const unlocked = getUnlockedLevel();' + '\n' +
  '    document.getElementById(\'startScreen\').classList.add(\'hidden\');' + '\n' +
  '    currentLevel = unlocked;' + '\n' +
  '    SFX.init();' + '\n' +
  '    SFX.startBGM();' + '\n' +
  '    showLevelIntro(currentLevel);' + '\n' +
  '  });' + '\n' +
  '  document.getElementById(\'selectBtn\').addEventListener(\'click\', showLevelSelect);' + '\n' +
  '  document.getElementById(\'backBtn\').addEventListener(\'click\', () => {' + '\n' +
  '    document.getElementById(\'levelSelect\').classList.add(\'hidden\');' + '\n' +
  '    document.getElementById(\'startScreen\').classList.remove(\'hidden\');' + '\n' +
  '    updateMenuButtons();' + '\n' +
  '  });' + '\n' +
  '  document.getElementById(\'replayBtn\').addEventListener(\'click\', () => {' + '\n' +
  '    document.getElementById(\'winScreen\').classList.add(\'hidden\');' + '\n' +
  '    currentLevel = 0;' + '\n' +
  '    SFX.init();' + '\n' +
  '    SFX.startBGM();' + '\n' +
  '    showLevelIntro(0);' + '\n' +
  '  });' + '\n' +
  '  document.getElementById(\'retryBtn2\').addEventListener(\'click\', retryLevel);' + '\n' +
  '  document.getElementById(\'backMenuBtn\').addEventListener(\'click\', backToMenu);' + '\n' +
  '  document.getElementById(\'creditsMenuBtn\').addEventListener(\'click\', () => {' + '\n' +
  '    document.getElementById(\'creditsScreen\').classList.add(\'hidden\');' + '\n' +
  '    backToMenu();' + '\n' +
  '  });' + '\n' +
  '  document.getElementById(\'enterEggBtn\').addEventListener(\'click\', () => {' + '\n' +
  '    document.getElementById(\'eggRevealScreen\').classList.add(\'hidden\');' + '\n' +
  '    currentLevel = LEVELS.length - 1; // 彩蛋关是最后一关' + '\n' +
  '    saveProgress(currentLevel);' + '\n' +
  '    SFX.init();' + '\n' +
  '    SFX.startBGM();' + '\n' +
  '    showLevelIntro(currentLevel);' + '\n' +
  '  });' + '\n' +
  '  document.getElementById(\'eggMenuBtn\').addEventListener(\'click\', () => {' + '\n' +
  '    document.getElementById(\'eggRevealScreen\').classList.add(\'hidden\');' + '\n' +
  '    // 彩蛋关标记为已解锁' + '\n' +
  '    saveProgress(LEVELS.length - 1);' + '\n' +
  '    backToMenu();' + '\n' +
  '  });' + '\n' +
  '  document.getElementById(\'muteBtn\').addEventListener(\'click\', () => {' + '\n' +
  '    SFX.init();' + '\n' +
  '    SFX.toggleMute();' + '\n' +
  '  });' + '\n' +
  '' + '\n' +
  '  function startGame() {' + '\n' +
  '    document.getElementById(\'startScreen\').classList.add(\'hidden\');' + '\n' +
  '    currentLevel = 0;' + '\n' +
  '    saveProgress(0);' + '\n' +
  '    SFX.init();' + '\n' +
  '    SFX.startBGM();' + '\n' +
  '    showLevelIntro(0);' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function updateMenuButtons() {' + '\n' +
  '    const unlocked = getUnlockedLevel();' + '\n' +
  '    const continueBtn = document.getElementById(\'continueBtn\');' + '\n' +
  '    if (unlocked > 0) {' + '\n' +
  '      continueBtn.style.display = \'\';' + '\n' +
  '      continueBtn.textContent = `继续游戏（第 ${unlocked + 1} 关）`;' + '\n' +
  '    } else {' + '\n' +
  '      continueBtn.style.display = \'none\';' + '\n' +
  '    }' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function showLevelSelect() {' + '\n' +
  '    document.getElementById(\'startScreen\').classList.add(\'hidden\');' + '\n' +
  '    const grid = document.getElementById(\'levelGrid\');' + '\n' +
  '    const unlocked = getUnlockedLevel();' + '\n' +
  '    grid.innerHTML = \'\';' + '\n' +
  '    for (let i = 0; i < LEVELS.length; i++) {' + '\n' +
  '      const cell = document.createElement(\'div\');' + '\n' +
  '      const isUnlocked = i <= unlocked;' + '\n' +
  '      cell.style.cssText = `' + '\n' +
  '        width: 120px; height: 120px;' + '\n' +
  '        background: ${isUnlocked ? \'#fff\' : \'#333\'};' + '\n' +
  '        color: ${isUnlocked ? \'#000\' : \'#666\'};' + '\n' +
  '        cursor: ${isUnlocked ? \'pointer\' : \'not-allowed\'};' + '\n' +
  '        display: flex; flex-direction: column;' + '\n' +
  '        align-items: center; justify-content: center;' + '\n' +
  '        transition: all 0.2s ease;' + '\n' +
  '        border: 1px solid ${isUnlocked ? \'transparent\' : \'#444\'};' + '\n' +
  '      `;' + '\n' +
  '      cell.innerHTML = `' + '\n' +
  '        <div style="font-size:28px;font-weight:200;letter-spacing:2px;">${isUnlocked ? i + 1 : \'·\'}</div>' + '\n' +
  '        <div style="font-size:11px;margin-top:8px;letter-spacing:2px;opacity:0.6;">${LEVELS[i].name}</div>' + '\n' +
  '        ${!isUnlocked ? \'<div style="font-size:10px;margin-top:6px;opacity:0.4;letter-spacing:1px;">未解锁</div>\' : \'\'}' + '\n' +
  '      `;' + '\n' +
  '      if (isUnlocked) {' + '\n' +
  '        cell.addEventListener(\'mouseenter\', () => {' + '\n' +
  '          cell.style.transform = \'translateY(-3px)\';' + '\n' +
  '          cell.style.boxShadow = \'0 8px 20px rgba(0,0,0,0.3)\';' + '\n' +
  '        });' + '\n' +
  '        cell.addEventListener(\'mouseleave\', () => {' + '\n' +
  '          cell.style.transform = \'translateY(0)\';' + '\n' +
  '          cell.style.boxShadow = \'none\';' + '\n' +
  '        });' + '\n' +
  '        cell.addEventListener(\'click\', () => {' + '\n' +
  '          document.getElementById(\'levelSelect\').classList.add(\'hidden\');' + '\n' +
  '          currentLevel = i;' + '\n' +
  '          SFX.init();' + '\n' +
  '          SFX.startBGM();' + '\n' +
  '          showLevelIntro(i);' + '\n' +
  '        });' + '\n' +
  '      }' + '\n' +
  '      grid.appendChild(cell);' + '\n' +
  '    }' + '\n' +
  '    document.getElementById(\'levelSelect\').classList.remove(\'hidden\');' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // 初始状态：渲染菜单背景 + 更新按钮' + '\n' +
  '  loadLevel(0);' + '\n' +
  '  render();' + '\n' +
  '  updateMenuButtons();' + '\n' +
  '  if (isThumbnail) {' + '\n' +
  '    running = false;' + '\n' +
  '  }' + '\n' +
  '  // ==========================================' + '\n' +
  '  // 下载离线版：把整页代码内联成单文件 HTML' + '\n' +
  '  // ==========================================' + '\n' +
  '  function buildStandaloneHTML() {' + '\n' +
  '    // 1. 收集所有样式（<style> 标签）' + '\n' +
  '    let stylesHTML = \'\';' + '\n' +
  '    document.querySelectorAll(\'style\').forEach(s => {' + '\n' +
  '      stylesHTML += \'<style>\\n\' + s.textContent + \'\\n</style>\\n\';' + '\n' +
  '    });' + '\n' +
  '' + '\n' +
  '    // 2. 收集所有内联脚本' + '\n' +
  '    let inlineScriptsHTML = \'\';' + '\n' +
  '    document.querySelectorAll(\'script\').forEach(s => {' + '\n' +
  '      if (!s.src && s.textContent && s.textContent.trim().length > 0) {' + '\n' +
  '        inlineScriptsHTML += \'<script>\\n\' + s.textContent + \'\\n</\' + \'script>\\n\';' + '\n' +
  '      }' + '\n' +
  '    });' + '\n' +
  '' + '\n' +
  '    // 3. 外部脚本（game.js）：优先用内嵌的源码缓存，避免 file:// 下 XHR 跨域失败' + '\n' +
  '    //    兼容线上环境：缓存为空时再尝试 XHR' + '\n' +
  '    let gameSource = \'\';' + '\n' +
  '    if (typeof __GAME_SOURCE__ !== \'undefined\' && __GAME_SOURCE__) {' + '\n' +
  '      gameSource = __GAME_SOURCE__;' + '\n' +
  '    } else {' + '\n' +
  '      const scripts = Array.from(document.querySelectorAll(\'script\')).filter(s => s.src && s.src.length > 0);' + '\n' +
  '      for (const s of scripts) {' + '\n' +
  '        try {' + '\n' +
  '          const xhr = new XMLHttpRequest();' + '\n' +
  '          xhr.open(\'GET\', s.src, false);' + '\n' +
  '          xhr.send(null);' + '\n' +
  '          if (xhr.status === 200 || xhr.status === 0) {' + '\n' +
  '            gameSource += xhr.responseText + \'\\n\';' + '\n' +
  '          }' + '\n' +
  '        } catch(e) {' + '\n' +
  '          console.warn(\'下载离线版：脚本拉取失败\', s.src, e);' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '    }' + '\n' +
  '    const gameScriptHTML = \'<script>\\n\' + gameSource + \'\\n</\' + \'script>\\n\';' + '\n' +
  '' + '\n' +
  '    // 4. 组装完整 HTML' + '\n' +
  '    // doctype + html + head(meta,title,styles) + body(所有DOM元素) + scripts' + '\n' +
  '    const headMeta = `<!DOCTYPE html>' + '\n' +
  '<html lang="zh-CN">' + '\n' +
  '<head>' + '\n' +
  '<meta charset="UTF-8" />' + '\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' + '\n' +
  '<meta name="creative-medium" content="mini-game" />' + '\n' +
  '<title>双生同行 — 双人合作解谜</title>' + '\n' +
  '<link rel="icon" href="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'><rect width=\'32\' height=\'32\' rx=\'6\' fill=\'%23111\'/><circle cx=\'11\' cy=\'16\' r=\'5\' fill=\'%23fff\'/><circle cx=\'21\' cy=\'16\' r=\'5\' fill=\'%23222\' stroke=\'%23fff\' stroke-width=\'1.5\'/></svg>">' + '\n' +
  '`;' + '\n' +
  '' + '\n' +
  '    // body 内容：复制 game-wrap 里的所有 DOM' + '\n' +
  '    const bodyInner = document.getElementById(\'game-wrap\').outerHTML;' + '\n' +
  '' + '\n' +
  '    const fullHTML = headMeta + stylesHTML + \'</head>\\n<body>\\n\' + bodyInner + \'\\n\' + gameScriptHTML + inlineScriptsHTML + \'</body>\\n</html>\';' + '\n' +
  '    return fullHTML;' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  function triggerDownload(filename, content) {' + '\n' +
  '    const blob = new Blob([content], { type: \'text/html;charset=utf-8\' });' + '\n' +
  '    const url = URL.createObjectURL(blob);' + '\n' +
  '    const a = document.createElement(\'a\');' + '\n' +
  '    a.href = url;' + '\n' +
  '    a.download = filename;' + '\n' +
  '    document.body.appendChild(a);' + '\n' +
  '    a.click();' + '\n' +
  '    document.body.removeChild(a);' + '\n' +
  '    setTimeout(() => URL.revokeObjectURL(url), 1000);' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  const downloadBtn = document.getElementById(\'downloadBtn\');' + '\n' +
  '  if (downloadBtn) {' + '\n' +
  '    downloadBtn.addEventListener(\'click\', () => {' + '\n' +
  '      const originalText = downloadBtn.textContent;' + '\n' +
  '      downloadBtn.textContent = \'打包中...\';' + '\n' +
  '      downloadBtn.disabled = true;' + '\n' +
  '      // 给UI一帧喘息时间' + '\n' +
  '      requestAnimationFrame(() => {' + '\n' +
  '        setTimeout(() => {' + '\n' +
  '          try {' + '\n' +
  '            const html = buildStandaloneHTML();' + '\n' +
  '            triggerDownload(\'双生同行-双人合作解谜.html\', html);' + '\n' +
  '            downloadBtn.textContent = \'✓ 下载成功！\';' + '\n' +
  '            setTimeout(() => {' + '\n' +
  '              downloadBtn.textContent = originalText;' + '\n' +
  '              downloadBtn.disabled = false;' + '\n' +
  '            }, 1500);' + '\n' +
  '          } catch(e) {' + '\n' +
  '            console.error(\'下载离线版失败:\', e);' + '\n' +
  '            downloadBtn.textContent = \'下载失败，请重试\';' + '\n' +
  '            setTimeout(() => {' + '\n' +
  '              downloadBtn.textContent = originalText;' + '\n' +
  '              downloadBtn.disabled = false;' + '\n' +
  '            }, 2000);' + '\n' +
  '          }' + '\n' +
  '        }, 100);' + '\n' +
  '      });' + '\n' +
  '    });' + '\n' +
  '  }' + '\n' +
  '' + '\n' +
  '  // 主循环在 startGame / showLevelIntro 中启动' + '\n' +
  '' + '\n' +
  '})();' + '\n' +
  ''
);
// __GAME_SOURCE_INJECTION_END__

// ============================================================
// 共生与同行 — 双人合作解谜游戏
// 零单人可能性 · 纯合作向
// ============================================================

(function() {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;   // 1280
  const H = canvas.height;  // 720

  // --- 自适应缩放 ---
  function resize() {
    const scale = Math.min(window.innerWidth / W, window.innerHeight / H) * 0.95;
    canvas.style.width = (W * scale) + 'px';
    canvas.style.height = (H * scale) + 'px';
  }
  window.addEventListener('resize', resize);
  resize();

  // --- 物理常量 ---
  const GRAVITY = 0.55;
  const MOVE_SPEED = 4;
  const JUMP_FORCE = -12.5;
  const PLAYER_W = 28;
  const PLAYER_H = 44;
  const HEAD_R = 14;

  // --- 彩蛋关星空穹顶 --- 
  const stars = [];
  function initStars() {
    stars.length = 0;
    // 约180颗星星，不同大小、亮度
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.75, // 主要在上半部分天空
        size: Math.random() < 0.7 ? 1 : (Math.random() < 0.9 ? 1.8 : 2.6),
        baseAlpha: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.01 + Math.random() * 0.025,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
    // 几颗特别亮的"流星级"大星
    for (let i = 0; i < 5; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.6,
        size: 3 + Math.random() * 2,
        baseAlpha: 0.8 + Math.random() * 0.2,
        twinkleSpeed: 0.015 + Math.random() * 0.02,
        twinklePhase: Math.random() * Math.PI * 2,
        isBright: true,
      });
    }
  }
  initStars();

  function drawStarryBackground(ctx, time) {
    // 深蓝色夜空渐变
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0a0e2a');  // 顶部：深靛蓝
    g.addColorStop(0.5, '#0f1438'); // 中部：藏青色
    g.addColorStop(1, '#1a1f4a');  // 底部：略浅的深蓝
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // 星星闪烁
    for (const s of stars) {
      const twinkle = 0.7 + 0.3 * Math.sin(time * s.twinkleSpeed + s.twinklePhase);
      const alpha = s.baseAlpha * twinkle;
      if (s.isBright) {
        // 亮星加发光光晕
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(200,220,255,${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = s.isBright
        ? `rgba(255,255,255,${alpha})`
        : `rgba(230,235,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 右上角一轮弯月（淡淡的）
    const moonX = W - 140;
    const moonY = 120;
    const moonR = 36;
    // 月亮本体
    const moonGrad = ctx.createRadialGradient(moonX - 8, moonY - 8, 4, moonX, moonY, moonR);
    moonGrad.addColorStop(0, '#fffdf0');
    moonGrad.addColorStop(0.5, '#f7efd0');
    moonGrad.addColorStop(1, '#e8dfb8');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fill();
    // 弯月阴影（用背景色叠出月牙形）
    ctx.fillStyle = 'rgba(15,20,56,0.85)';
    ctx.beginPath();
    ctx.arc(moonX + 14, moonY - 6, moonR * 0.92, 0, Math.PI * 2);
    ctx.fill();
    // 月亮柔光
    ctx.fillStyle = 'rgba(255,248,200,0.08)';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- 渐变配色（每关一套清新低饱和渐变，从上到下）---
  const BG_GRADIENTS = [
    ['#e8f1f8', '#d6ece8'], // 1 淡蓝→浅青
    ['#fbe9e7', '#fff0d6'], // 2 淡粉→浅橙
    ['#e6f1df', '#fff8d6'], // 3 淡绿→浅黄
    ['#efe4f0', '#fbe5ec'], // 4 淡紫→浅粉
    ['#d9ecec', '#dde9f4'], // 5 淡青→浅蓝
    ['#fdf3d6', '#e6efd8'], // 6 淡黄→浅绿
    ['#fbe0e8', '#ece0f4'], // 7 淡粉→浅紫
    ['#e0e9f2', '#e5e7e9'], // 8 淡蓝→浅灰
    ['#e0ede0', '#d9ecec'], // 9 淡绿→浅青
    ['#ffe9d6', '#fff6cc'], // 10 淡橙→浅黄
    ['#e4dff0', '#dce6f3'], // 11 淡紫→浅蓝
    ['#d5ece4', '#dcecd6'], // 12 淡青→浅绿
    ['#f8ded8', '#ffe3cc'], // 13 淡粉→浅橙
    ['#fff0d6', '#fbe0e8'], // 14 淡黄→浅粉
    ['#dce8f5', '#e6dff0', '#fbe0ec'], // 15 淡蓝→淡紫→淡粉（三色）
  ];
  const MENU_GRADIENT = ['#f0eef7', '#e5eef5', '#e7f1ea']; // 菜单背景（柔和三色）

  function buildGradient(stops) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    for (let i = 0; i < stops.length; i++) {
      g.addColorStop(i / (stops.length - 1), stops[i]);
    }
    return g;
  }

  // --- 游戏状态 ---
  const STATE = {
    MENU: 'menu',
    LEVEL_SELECT: 'level_select',
    LEVEL_INTRO: 'level_intro',
    PLAYING: 'playing',
    FAILED: 'failed',
    LEVEL_CLEAR: 'level_clear',
    WIN: 'win',
    EGG_REVEAL: 'egg_reveal'
  };
  let gameState = STATE.MENU;
  let currentLevel = 0;
  let introTimer = 0;
  let clearTimer = 0;
  let winHoldTime = 0;

  // ============================================================
  // 音效系统（Web Audio API 程序化生成，无外部文件）
  // ============================================================
  const SFX = {
    audioCtx: null,
    muted: false,
    masterGain: null,
    bgmGain: null,
    bgmTimer: null,
    bgmStep: 0,

    init() {
      if (this.audioCtx) return;
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new Ctx();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.audioCtx.destination);
        this.bgmGain = this.audioCtx.createGain();
        this.bgmGain.gain.value = 0.08;
        this.bgmGain.connect(this.masterGain);
      } catch (e) {
        this.audioCtx = null;
      }
    },

    toggleMute() {
      this.muted = !this.muted;
      if (this.masterGain) {
        this.masterGain.gain.value = this.muted ? 0 : 0.5;
      }
      const btn = document.getElementById('muteBtn');
      if (btn) btn.textContent = this.muted ? '🔇 静音' : '🔊 音效';
      return this.muted;
    },

    // 短促"啵"声（跳跃）
    playJump() {
      try {
        if (!this.audioCtx || this.muted) return;
        const t = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, t);
        osc.frequency.exponentialRampToValueAtTime(720, t + 0.12);
        g.gain.setValueAtTime(0.001, t);
        g.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(g).connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.17);
      } catch (e) { /* 静默失败，不影响游戏 */ }
    },

    // 清脆"叮"声（按钮/压力板按下）
    playDing() {
      try {
        if (!this.audioCtx || this.muted) return;
        const t = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(1320, t + 0.08);
        g.gain.setValueAtTime(0.001, t);
        g.gain.exponentialRampToValueAtTime(0.2, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(g).connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.32);
      } catch (e) { /* 静默失败 */ }
    },

    // 低沉滑动声（门开启）
    playDoor() {
      try {
        if (!this.audioCtx || this.muted) return;
        const t = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.4);
        g.gain.setValueAtTime(0.001, t);
        g.gain.exponentialRampToValueAtTime(0.12, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc.connect(g).connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.47);
      } catch (e) { /* 静默失败 */ }
    },

    // 欢快上升音阶（通关每一关）
    playClear() {
      try {
        if (!this.audioCtx || this.muted) return;
        const t = this.audioCtx.currentTime;
        const notes = [523, 659, 784, 1046]; // C5 E5 G5 C6
        for (let i = 0; i < notes.length; i++) {
          const osc = this.audioCtx.createOscillator();
          const g = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(notes[i], t + i * 0.09);
          g.gain.setValueAtTime(0.001, t + i * 0.09);
          g.gain.exponentialRampToValueAtTime(0.2, t + i * 0.09 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.25);
          osc.connect(g).connect(this.masterGain);
          osc.start(t + i * 0.09);
          osc.stop(t + i * 0.09 + 0.27);
        }
      } catch (e) { /* 静默失败 */ }
    },

    // 烟花发射"咻"声
    playFireworkLaunch() {
      try {
        if (!this.audioCtx || this.muted) return;
        const t = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.6);
        g.gain.setValueAtTime(0.001, t);
        g.gain.exponentialRampToValueAtTime(0.15, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
        osc.connect(g).connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.67);
      } catch (e) { /* 静默失败 */ }
    },

    // 烟花爆炸"嘭"声
    playFireworkBoom() {
      try {
        if (!this.audioCtx || this.muted) return;
        const t = this.audioCtx.currentTime;
        // 噪声爆炸
        const bufferSize = this.audioCtx.sampleRate * 0.5;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const src = this.audioCtx.createBufferSource();
        src.buffer = buffer;
        const g = this.audioCtx.createGain();
        g.gain.setValueAtTime(0.4, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        const bp = this.audioCtx.createBiquadFilter();
        bp.type = 'lowpass';
        bp.frequency.value = 800;
        src.connect(bp).connect(g).connect(this.masterGain);
        src.start(t);
      } catch (e) { /* 静默失败 */ }
    },

    // 引线火花嘶嘶声
    playFuseSpark() {
      try {
        if (!this.audioCtx || this.muted) return;
        const t = this.audioCtx.currentTime;
        const duration = 2.0;
        const bufferSize = this.audioCtx.sampleRate * duration;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          // 嘶嘶声：白噪声 + 高频带通 + 随机爆点
          data[i] = (Math.random() * 2 - 1) * 0.3;
          if (Math.random() < 0.002) data[i] += (Math.random() * 2 - 1) * 0.8;
        }
        const src = this.audioCtx.createBufferSource();
        src.buffer = buffer;
        const g = this.audioCtx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.exponentialRampToValueAtTime(0.12, t + 0.1);
        g.gain.setValueAtTime(0.12, t + duration - 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + duration);
        const hp = this.audioCtx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 2000;
        src.connect(hp).connect(g).connect(this.masterGain);
        src.start(t);
        src.stop(t + duration + 0.1);
      } catch (e) { /* 静默失败 */ }
    },

    // 背景音乐：简单循环琶音
    startBGM() {
      if (!this.audioCtx || this.muted) return;
      if (this.bgmTimer) return;
      // C大调五声音阶式旋律
      const melody = [
        523, 659, 784, 659, 523, 659, 784, 1046,
        880, 784, 659, 523, 587, 659, 587, 523,
      ];
      const bass = [262, 262, 196, 196, 220, 220, 262, 262];
      this.bgmStep = 0;
      const stepTime = 0.3;
      const playNote = () => {
        try {
        if (!this.bgmTimer) return;
        const t = this.audioCtx.currentTime;
        // 主旋律
        const idx = this.bgmStep % melody.length;
        const osc = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = melody[idx];
        g.gain.setValueAtTime(0.001, t);
        g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + stepTime * 0.9);
        osc.connect(g).connect(this.bgmGain);
        osc.start(t);
        osc.stop(t + stepTime);
        // 低音（每两拍一个）
        if (this.bgmStep % 2 === 0) {
          const bIdx = (this.bgmStep / 2) % bass.length;
          const bosc = this.audioCtx.createOscillator();
          const bg = this.audioCtx.createGain();
          bosc.type = 'triangle';
          bosc.frequency.value = bass[bIdx];
          bg.gain.setValueAtTime(0.001, t);
          bg.gain.exponentialRampToValueAtTime(0.15, t + 0.03);
          bg.gain.exponentialRampToValueAtTime(0.001, t + stepTime * 1.8);
          bosc.connect(bg).connect(this.bgmGain);
          bosc.start(t);
          bosc.stop(t + stepTime * 2);
        }
        this.bgmStep++;
        } catch (e) { /* 静默失败 */ }
      };
      this.bgmTimer = setInterval(playNote, stepTime * 1000);
      playNote();
    },

    stopBGM() {
      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
    },
  };

  // 记录按钮/门的上次状态，避免重复播放
  let _lastBtnStates = {};
  let _lastDoorStates = {};
  let _lastPlateStates = {};

  function playSfxIfChanged(map, id, nowActive, sfxFn) {
    const prev = map[id];
    if (nowActive && !prev) sfxFn();
    map[id] = nowActive;
  }

  // --- 存档 ---
  const STORAGE_KEY = 'symbiosis_progress';
  function getUnlockedLevel() {
    try {
      const v = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
      return Math.max(0, Math.min(LEVELS.length - 1, v));
    } catch (e) { return 0; }
  }
  function saveProgress(levelIdx) {
    try {
      const cur = getUnlockedLevel();
      if (levelIdx > cur) localStorage.setItem(STORAGE_KEY, String(levelIdx));
    } catch (e) {}
  }

  // --- 输入 ---
  const keys = {};
  // 键名规范化：同时支持 e.code 和 e.key，兼容不同键盘布局和输入法
  // 统一映射到标准 code 名
  const KEY_MAP = {
    // W / 上
    'KeyW': 'KeyW', 'w': 'KeyW', 'W': 'KeyW', 'ArrowUp': 'ArrowUp', 'Up': 'ArrowUp',
    // A / 左
    'KeyA': 'KeyA', 'a': 'KeyA', 'A': 'KeyA', 'ArrowLeft': 'ArrowLeft', 'Left': 'ArrowLeft',
    // S / 下
    'KeyS': 'KeyS', 's': 'KeyS', 'S': 'KeyS', 'ArrowDown': 'ArrowDown', 'Down': 'ArrowDown',
    // D / 右
    'KeyD': 'KeyD', 'd': 'KeyD', 'D': 'KeyD', 'ArrowRight': 'ArrowRight', 'Right': 'ArrowRight',
    // 空格
    'Space': 'Space', ' ': 'Space',
    // R / 重置
    'KeyR': 'KeyR', 'r': 'KeyR', 'R': 'KeyR',
    // ESC
    'Escape': 'Escape', 'Esc': 'Escape',
  };
  function normalizeKey(e) {
    // 优先用 e.code，其次用 e.key 映射，最后用 keyCode 推断
    if (e.code && KEY_MAP[e.code]) return KEY_MAP[e.code];
    if (e.key && KEY_MAP[e.key]) return KEY_MAP[e.key];
    // 兜底：用 keyCode 推断 (W=87, A=65, S=83, D=68, 上=38, 左=37, 下=40, 右=39, 空格=32, R=82, ESC=27)
    const kc = e.keyCode || e.which;
    if (kc === 87) return 'KeyW';
    if (kc === 65) return 'KeyA';
    if (kc === 83) return 'KeyS';
    if (kc === 68) return 'KeyD';
    if (kc === 38) return 'ArrowUp';
    if (kc === 37) return 'ArrowLeft';
    if (kc === 40) return 'ArrowDown';
    if (kc === 39) return 'ArrowRight';
    if (kc === 32) return 'Space';
    if (kc === 82) return 'KeyR';
    if (kc === 27) return 'Escape';
    return e.code || e.key || ('key_' + kc);
  }
  // 使用捕获阶段，确保即使按钮/UI元素获取焦点也能收到按键
  window.addEventListener('keydown', e => {
    const k = normalizeKey(e);
    keys[k] = true;
    if (k === 'KeyR' && (gameState === STATE.PLAYING || gameState === STATE.FAILED)) {
      loadLevel(currentLevel);
      gameState = STATE.PLAYING;
      document.getElementById('failScreen').classList.add('hidden');
    }
    if (k === 'Escape' && gameState === STATE.PLAYING) {
      showFailed();
    }
    if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'].includes(k)) {
      e.preventDefault();
    }
  }, true);
  window.addEventListener('keyup', e => {
    const k = normalizeKey(e);
    keys[k] = false;
  }, true);
  // 窗口失焦时清空所有按键状态，避免按键粘滞
  window.addEventListener('blur', () => {
    for (const k in keys) keys[k] = false;
  });

  // --- 工具：矩形碰撞 ---
  function rectCollide(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
  }

  // ============================================================
  // 玩家类
  // ============================================================
  class Player {
    constructor(x, y, color, controls) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.w = PLAYER_W;
      this.h = PLAYER_H;
      this.color = color;
      this.controls = controls;
      this.onGround = false;
      this.facing = 1;
      this.wasOnGround = false;
    }

    update(solids, boxes, allPlayers) {
      // 水平输入
      let moveDir = 0;
      const leftPressed = !!keys[this.controls.left];
      const rightPressed = !!keys[this.controls.right];
      const jumpPressed = !!keys[this.controls.jump];
      if (leftPressed) moveDir -= 1;
      if (rightPressed) moveDir += 1;
      this.vx = moveDir * MOVE_SPEED;
      if (moveDir !== 0) this.facing = moveDir;

      // 跳跃
      if (jumpPressed && this.onGround) {
        this.vy = JUMP_FORCE;
        this.onGround = false;
        SFX.playJump();
      }

      // 重力
      this.vy += GRAVITY;
      if (this.vy > 18) this.vy = 18;

      this.wasOnGround = this.onGround;

      // 水平移动 + 碰撞
      this.x += this.vx;
      this.resolveH(solids, boxes, allPlayers);

      // 垂直移动 + 碰撞
      this.y += this.vy;
      this.onGround = false;
      this.resolveV(solids, boxes);

      // 边界
      if (this.x < 0) { this.x = 0; this.vx = 0; }
      if (this.x + this.w > W) { this.x = W - this.w; this.vx = 0; }

      // 掉出屏幕
      if (this.y > H + 200) return true;
      return false;
    }

    resolveH(solids, boxes, allPlayers) {
      for (const s of solids) {
        if (rectCollide(this, s)) {
          if (this.vx > 0) this.x = s.x - this.w;
          else if (this.vx < 0) this.x = s.x + s.w;
          this.vx = 0;
        }
      }
      // 推箱子
      for (const b of boxes) {
        if (rectCollide(this, b)) {
          const pushDir = this.vx > 0 ? 1 : (this.vx < 0 ? -1 : 0);
          if (pushDir !== 0) {
            const pushed = b.tryPush(pushDir, solids, boxes, this, allPlayers);
            if (!pushed) {
              if (pushDir > 0) this.x = b.x - this.w;
              else this.x = b.x + b.w;
              this.vx = 0;
            } else {
              // 推动了，重新对齐
              if (pushDir > 0 && this.x + this.w > b.x) this.x = b.x - this.w;
              if (pushDir < 0 && this.x < b.x + b.w) this.x = b.x + b.w;
            }
          }
        }
      }
    }

    resolveV(solids, boxes) {
      for (const s of solids) {
        if (rectCollide(this, s)) {
          if (this.vy > 0) {
            this.y = s.y - this.h;
            this.onGround = true;
          } else if (this.vy < 0) {
            this.y = s.y + s.h;
          }
          this.vy = 0;
        }
      }
      // 站在箱子上
      for (const b of boxes) {
        if (rectCollide(this, b)) {
          if (this.vy > 0) {
            this.y = b.y - this.h;
            this.onGround = true;
          } else if (this.vy < 0) {
            this.y = b.y + b.h;
          }
          this.vy = 0;
        }
      }
    }

    collidesRect(r) {
      return rectCollide(this, r);
    }

    draw(ctx) {
      ctx.save();
      const cx = this.x + this.w / 2;
      const headY = this.y + HEAD_R;
      const bodyY = this.y + HEAD_R * 2 - 2;
      const bodyH = this.h - HEAD_R * 2 + 2;
      const bw = this.w - 6;
      const bx = this.x + 3;

      if (this.color === 'black') {
        ctx.fillStyle = '#0a0a0a';
        // 头
        ctx.beginPath();
        ctx.arc(cx, headY, HEAD_R, 0, Math.PI * 2);
        ctx.fill();
        // 身体
        ctx.fillRect(bx, bodyY, bw, bodyH);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1.5;
        // 头
        ctx.beginPath();
        ctx.arc(cx, headY, HEAD_R, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 身体
        ctx.fillRect(bx, bodyY, bw, bodyH);
        ctx.strokeRect(bx + 0.5, bodyY + 0.5, bw - 1, bodyH - 1);
      }
      ctx.restore();
    }
  }

  // ============================================================
  // 箱子
  // ============================================================
  class Box {
    constructor(x, y, w, h, id = null, heavy = false) {
      this.x = x; this.y = y;
      this.w = w; this.h = h;
      this.vy = 0;
      this.onGround = false;
      this.id = id;
      this.heavy = heavy; // 重箱：需要两人同时推才动
    }

    update(solids, boxes, players) {
      this.vy += GRAVITY * 0.8;
      if (this.vy > 15) this.vy = 15;
      this.y += this.vy;
      this.onGround = false;

      const allSolids = solids.slice();
      for (const b of boxes) if (b !== this) allSolids.push(b);

      for (const s of allSolids) {
        if (rectCollide(this, s)) {
          if (this.vy > 0) {
            this.y = s.y - this.h;
            this.onGround = true;
          } else if (this.vy < 0) {
            this.y = s.y + s.h;
          }
          this.vy = 0;
        }
      }
      if (this.y > H + 200) return true;
      return false;
    }

    tryPush(dir, solids, boxes, pusher, allPlayers = null) {
      if (!this.onGround) return false;
      // 重箱子：需要两个玩家在同一侧同时推才动
      if (this.heavy && allPlayers) {
        let pushCount = 0;
        for (const p of allPlayers) {
          if (p === pusher) { pushCount++; continue; }
          // 检查另一个玩家是否也在同方向推这个箱子
          if (p.vx === 0) continue;
          const otherDir = p.vx > 0 ? 1 : -1;
          if (otherDir !== dir) continue;
          // 检查是否与箱子相邻（水平方向）
          if (dir > 0 && Math.abs((p.x + p.w) - this.x) < 3 && p.y + p.h > this.y && p.y < this.y + this.h) {
            pushCount++;
          } else if (dir < 0 && Math.abs(p.x - (this.x + this.w)) < 3 && p.y + p.h > this.y && p.y < this.y + this.h) {
            pushCount++;
          }
        }
        if (pushCount < 2) return false;
      }
      const step = 2;
      const oldX = this.x;
      this.x += dir * step;

      const allSolids = solids.slice();
      for (const b of boxes) if (b !== this) allSolids.push(b);
      for (const s of allSolids) {
        if (rectCollide(this, s)) {
          this.x = oldX;
          return false;
        }
      }
      // 边界
      if (this.x < 0 || this.x + this.w > W) {
        this.x = oldX;
        return false;
      }
      return true;
    }

    draw(ctx) {
      ctx.fillStyle = '#777';
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x + 1, this.y + 1, this.w - 2, this.h - 2);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x + this.w / 2, this.y + 5);
      ctx.lineTo(this.x + this.w / 2, this.y + this.h - 5);
      ctx.moveTo(this.x + 5, this.y + this.h / 2);
      ctx.lineTo(this.x + this.w - 5, this.y + this.h / 2);
      ctx.stroke();
    }
  }

  // ============================================================
  // 压力板（持续踩住才生效）
  // ============================================================
  class PressurePlate {
    constructor(x, y, w, id, targetId) {
      this.x = x; this.y = y;
      this.w = w; this.h = 8;
      this.id = id;
      this.targetId = targetId;
      this.pressed = false;
    }
    check(players, boxes) {
      let pressed = false;
      // 压力板检测：玩家脚底位置落在「板顶上方 12px 到 板下方 12px」范围内
      // 由于压力板不是固体，玩家会穿过它落到下方平台上，所以检测范围需足够包容
      const top = this.y - 12;
      const bottom = this.y + this.h + 12;
      for (const p of players) {
        if (p.x + p.w > this.x + 2 && p.x < this.x + this.w - 2 &&
            p.y + p.h >= top && p.y + p.h <= bottom && p.onGround) {
          pressed = true; break;
        }
      }
      if (!pressed) {
        for (const b of boxes) {
          if (b.x + b.w > this.x + 2 && b.x < this.x + this.w - 2 &&
              b.y + b.h >= top && b.y + b.h <= bottom) {
            pressed = true; break;
          }
        }
      }
      this.pressed = pressed;
      return pressed;
    }
    draw(ctx) {
      const h = this.pressed ? 4 : 8;
      const y = this.pressed ? this.y + 4 : this.y;
      ctx.fillStyle = this.pressed ? '#444' : '#888';
      ctx.fillRect(this.x, y, this.w, h);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(this.x, y + h - 2, this.w, 2);
    }
  }

  // ============================================================
  // 按钮（踩一次即永久激活）
  // ============================================================
  class Button {
    constructor(x, y, id, targetId, opts) {
      this.x = x; this.y = y;
      this.w = 32; this.h = 10;
      this.id = id;
      this.targetId = targetId;
      this.momentary = !!(opts && opts.momentary); // 瞬动：松开即复位（用于时序门）
      this.activated = false; // 已永久激活（仅非瞬动模式）
      this.pressed = false;   // 当前是否被踩着（用于视觉）
    }
    check(players) {
      let onIt = false;
      const top = this.y - 12;
      const bottom = this.y + this.h + 12;
      for (const p of players) {
        if (p.x + p.w > this.x + 2 && p.x < this.x + this.w - 2 &&
            p.y + p.h >= top && p.y + p.h <= bottom && p.onGround) {
          onIt = true;
          if (!this.momentary && !this.activated) this.activated = true;
          break;
        }
      }
      this.pressed = this.momentary ? onIt : (this.activated || onIt);
      return this.momentary ? onIt : this.activated;
    }
    draw(ctx) {
      const active = this.momentary ? this.pressed : this.activated;
      const h = active ? 4 : 10;
      const y = active ? this.y + 6 : this.y;
      ctx.fillStyle = active ? '#222' : '#777';
      ctx.fillRect(this.x, y, this.w, h);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(this.x - 3, this.y + 8, this.w + 6, 2);
      // 激活后显示一个小光点
      if (active) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + this.w / 2 - 1, y + 1, 2, 2);
      }
    }
  }

  // ============================================================
  // 门
  // ============================================================
  class Door {
    constructor(x, y, w, h, id, mode = 'any', options = {}) {
      this.x = x; this.y = y;
      this.w = w; this.h = h;
      this.id = id;
      this.mode = mode; // 'any' | 'all' | 'timed'
      this.open = false;
      this.openAmount = 0;
      this.timer = 0;
      this.timedDuration = options.duration || 180; // 时序门开启持续帧数（默认3秒）
      this._prevTriggered = false;
    }
    update(triggered) {
      if (this.mode === 'timed') {
        // 时序模式：触发源从false变true时开启计时，持续时间后关闭
        if (triggered && !this._prevTriggered) {
          this.timer = this.timedDuration;
        }
        this.timer--;
        this.open = this.timer > 0;
      } else {
        this.open = triggered;
      }
      this._prevTriggered = triggered;
      const target = this.open ? 1 : 0;
      this.openAmount += (target - this.openAmount) * 0.2;
    }
    get collideRect() {
      const openH = this.h * (1 - this.openAmount);
      return { x: this.x, y: this.y + (this.h - openH), w: this.w, h: openH };
    }
    isSolid() {
      // 门洞开启超过一半时即可通过（玩家身高约为门高的一半）
      return this.openAmount < 0.5;
    }
    draw(ctx) {
      const openH = this.h * (1 - this.openAmount);
      const oy = this.y + (this.h - openH);

      // 门框
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.w, this.h);

      // 门扇
      if (openH > 2) {
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(this.x, oy, this.w, openH);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(this.x + 2, oy + 2, this.w - 4, openH - 4);
      }
    }
  }

  // ============================================================
  // 移动平台
  // ============================================================
  // ============================================================
  // 切换平台（踩开关切换显隐状态）
  // ============================================================
  class TogglePlatform {
    constructor(x, y, w, h, id, triggerId = null, group = 'A', initialVisible = true) {
      this.x = x; this.y = y;
      this.w = w; this.h = h;
      this.id = id;
      this.triggerId = triggerId; // 控制它的开关id
      this.group = group; // 同一组的切换平台共享开关
      this.visible = initialVisible;
      this.visibleAmount = initialVisible ? 1 : 0; // 用于渐显渐隐动画
    }
    update(show) {
      this.visible = show;
      const target = show ? 1 : 0;
      this.visibleAmount += (target - this.visibleAmount) * 0.2;
    }
    get isSolid() {
      // 显示超过50%时才是固体
      return this.visibleAmount > 0.5;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = 0.2 + this.visibleAmount * 0.65;
      ctx.fillStyle = '#444';
      ctx.fillRect(this.x, this.y, this.w, this.h);
      if (this.visibleAmount > 0.3) {
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(this.x, this.y, this.w, 2);
      }
      // 虚线轮廓表示组身份
      ctx.strokeStyle = this.group === 'A' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.w - 1, this.h - 1);
      ctx.setLineDash([]);
      ctx.restore();
    }
  }

  // ============================================================
  // 移动尖刺（碰到即重置）
  // ============================================================
  class Spike {
    constructor(x, y, w, h, x2, y2, speed, triggerId = null, mode = 'any', initiallyActive = true) {
      this.startX = x; this.startY = y;
      this.endX = x2; this.endY = y2;
      this.x = x; this.y = y;
      this.w = w; this.h = h;
      this.speed = speed;
      this.progress = 0;
      this.dir = 1;
      this.triggerId = triggerId; // 如果有triggerId，则触发时暂停移动
      this.mode = mode; // 'any' 或 'all'
      this.active = initiallyActive;
      this.frozen = false;
    }
    update(frozen) {
      this.frozen = frozen;
      if (frozen) return;
      if (this.speed <= 0) return; // 静态尖刺，不移动
      const dx = this.endX - this.startX;
      const dy = this.endY - this.startY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const step = this.speed / dist;
      this.progress += step * this.dir;
      if (this.progress >= 1) { this.progress = 1; this.dir = -1; }
      if (this.progress <= 0) { this.progress = 0; this.dir = 1; }
      this.x = this.startX + dx * this.progress;
      this.y = this.startY + dy * this.progress;
    }
    collidesPlayer(p) {
      return rectCollide(this, p);
    }
    draw(ctx) {
      ctx.save();
      ctx.fillStyle = this.frozen ? '#555' : '#2a2a2a';
      // 尖刺是向上的三角形阵列
      const spikeCount = Math.max(1, Math.floor(this.w / 10));
      const sw = this.w / spikeCount;
      for (let i = 0; i < spikeCount; i++) {
        ctx.beginPath();
        ctx.moveTo(this.x + i * sw, this.y + this.h);
        ctx.lineTo(this.x + i * sw + sw / 2, this.y);
        ctx.lineTo(this.x + (i + 1) * sw, this.y + this.h);
        ctx.closePath();
        ctx.fill();
      }
      // 底座
      ctx.fillStyle = this.frozen ? '#777' : '#444';
      ctx.fillRect(this.x, this.y + this.h - 4, this.w, 4);
      ctx.restore();
    }
  }

  // ============================================================
  // 移动平台
  // ============================================================
  class MovingPlatform {
    constructor(x, y, w, h, x2, y2, speed, triggerId = null, mode = 'hold') {
      this.startX = x; this.startY = y;
      this.endX = x2; this.endY = y2;
      this.x = x; this.y = y;
      this.w = w; this.h = h;
      this.speed = speed;
      this.progress = 0;
      this.dir = 1;
      this.triggerId = triggerId;
      this.mode = mode; // 'hold' = 触发时向末端移动并停住，松开则返回起点；'pingpong' = 触发后来回
      this.active = triggerId === null;
      this.prevX = x; this.prevY = y;
    }
    update(triggered) {
      this.prevX = this.x;
      this.prevY = this.y;
      this.active = triggered || this.triggerId === null;

      const dx = this.endX - this.startX;
      const dy = this.endY - this.startY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const step = this.speed / dist;

      if (this.mode === 'hold') {
        // hold模式：触发时向末端前进，未触发时退回起点
        if (this.active) {
          this.progress = Math.min(1, this.progress + step);
        } else {
          this.progress = Math.max(0, this.progress - step);
        }
      } else {
        // pingpong模式：触发后来回移动
        if (!this.active) return;
        this.progress += step * this.dir;
        if (this.progress >= 1) { this.progress = 1; this.dir = -1; }
        if (this.progress <= 0) { this.progress = 0; this.dir = 1; }
      }

      this.x = this.startX + dx * this.progress;
      this.y = this.startY + dy * this.progress;
    }
    get dx() { return this.x - this.prevX; }
    get dy() { return this.y - this.prevY; }

    draw(ctx) {
      ctx.fillStyle = this.active ? '#5a5a5a' : '#3a3a3a';
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(this.x, this.y, this.w, 2);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(this.x, this.y + this.h - 2, this.w, 2);
    }
  }

  // ============================================================
  // 同步开关（两个触发源同时激活才生效）
  // ============================================================
  class SyncSwitch {
    constructor(id1, id2, targetId, once = true) {
      this.id1 = id1;
      this.id2 = id2;
      this.targetId = targetId;
      this.once = once;
      this.triggered = false; // once模式下永久触发
      this.active = false;
    }
    check(triggerMap) {
      const t1 = triggerMap[this.id1] || false;
      const t2 = triggerMap[this.id2] || false;
      const both = t1 && t2;
      if (this.once && both) this.triggered = true;
      this.active = this.once ? this.triggered : both;
      return this.active;
    }
  }

  // ============================================================
  // 通关判定区
  // ============================================================
  class GoalZone {
    constructor(x, y, w, h, color) {
      this.x = x; this.y = y; this.w = w; this.h = h;
      this.color = color;
    }
    contains(player) {
      return player.x + player.w > this.x + 4 && player.x < this.x + this.w - 4 &&
             player.y + player.h > this.y && player.y < this.y + this.h;
    }
    draw(ctx, active) {
      ctx.save();
      const alpha = active ? 0.4 : 0.12;
      const fill = this.color === 'black'
        ? `rgba(0,0,0,${alpha})`
        : `rgba(255,255,255,${alpha})`;
      ctx.fillStyle = fill;
      ctx.fillRect(this.x, this.y, this.w, this.h);

      // 边框
      const sAlpha = active ? 0.9 : 0.35;
      const stroke = this.color === 'black'
        ? `rgba(0,0,0,${sAlpha})`
        : `rgba(255,255,255,${sAlpha})`;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = active ? 2 : 1;
      if (active) {
        ctx.setLineDash([8, 4]);
        const offset = (Date.now() / 50) % 12;
        ctx.lineDashOffset = -offset;
      } else {
        ctx.setLineDash([4, 4]);
      }
      ctx.strokeRect(this.x + 2, this.y + 2, this.w - 4, this.h - 4);
      ctx.setLineDash([]);

      // 颜色标记
      ctx.fillStyle = this.color === 'black' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.65)';
      ctx.font = '300 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.color === 'black' ? '黑' : '白', this.x + this.w / 2, this.y + this.h / 2 + 5);

      ctx.restore();
    }
  }

  // ============================================================
  // 关卡定义
  // 设计原则：零单人可能性 · 纯合作
  // ============================================================
  const LEVELS = [
    // -------- 第 1 关：初遇 --------
    // 机制：一扇门 + 两侧各一个压力板
    // 配合：一人踩住开门，另一人通过后踩住另一侧压力板，第一人再过
    {
      name: '初遇',
      desc: '两个人，一段路。\n你帮我开门，我也为你留门。',
      bg: '#d9e2ec',
      spawnBlack: { x: 180, y: 560 },
      spawnWhite: { x: 280, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
      ],
      walls: [
        { x: 600, y: 0, w: 30, h: 540 }, // 中间隔墙（门洞以上部分，门洞在y=540~640）
      ],
      doors: [
        { x: 600, y: 540, w: 30, h: 100, id: 'd1', mode: 'any' },
      ],
      plates: [
        { x: 420, y: 632, w: 80, id: 'p1a', targetId: 'd1' }, // 左侧压力板
        { x: 730, y: 632, w: 80, id: 'p1b', targetId: 'd1' }, // 右侧压力板
      ],
      buttons: [],
      boxes: [],
      movingPlatforms: [],
      syncSwitches: [],
      spikes: [
        // 左右往返移动的尖刺：左右两侧各一组，节奏不同
        // 左侧尖刺起点右移，远离出生点（x=180/280），保证开局安全
        { x: 360, y: 616, w: 40, h: 24, x2: 500, y2: 616, speed: 1.2, triggerId: null },
        { x: 1140, y: 616, w: 40, h: 24, x2: 1240, y2: 616, speed: 1.5, triggerId: null },
      ],
      goals: [
        { x: 1130, y: 570, w: 60, h: 70, color: 'black' },
        { x: 1050, y: 570, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 2 关：守望 --------
    // 机制：压力板→升降平台，按钮→终点门
    // 配合：黑踩压力板送白上高台；白在高台按按钮开终点门，黑从地面通过
    {
      name: '守望',
      desc: '你守在这里，我去去就回。\n你托我向上，我为你开路。',
      bg: '#e8ddd4',
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 130, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
        // 左侧起跳台
        { x: 260, y: 560, w: 80, h: 20 },
        // 上层高台（白色走的路）
        { x: 500, y: 380, w: 200, h: 20 },
        { x: 760, y: 320, w: 180, h: 20 },
        // 终点高台上层（白色终点）——右侧立柱仅到 y=380，留出门后地面通道
        { x: 1000, y: 280, w: 280, h: 20 },
        { x: 1000, y: 300, w: 280, h: 80 },
        // 右侧地面边界矮墙（视觉提示，不挡路）
      ],
      walls: [],
      doors: [
        // 地面路径上的终点门（黑色通过用）
        { x: 940, y: 540, w: 28, h: 100, id: 'd2', mode: 'any' },
      ],
      plates: [
        // 地面压力板 → 控制升降平台
        { x: 120, y: 632, w: 80, id: 'p2', targetId: 'mp2' },
      ],
      buttons: [
        // 高台上的一次性按钮 → 控制终点门
        { x: 820, y: 310, id: 'b2', targetId: 'd2' },
      ],
      boxes: [],
      movingPlatforms: [
        // 升降平台（垂直），把白色送上高台
        { x: 380, y: 580, w: 90, h: 16, x2: 380, y2: 380, speed: 1.8, triggerId: 'mp2' },
      ],
      syncSwitches: [],
      spikes: [
        // 左右往返移动的尖刺：地面中段来回巡逻
        { x: 520, y: 616, w: 80, h: 24, x2: 720, y2: 616, speed: 1.5, triggerId: null },
      ],
      goals: [
        { x: 1200, y: 210, w: 60, h: 70, color: 'white' }, // 白色在上层终点
        { x: 1120, y: 570, w: 60, h: 70, color: 'black' }, // 黑色在地面终点
      ]
    },

    // -------- 第 3 关：同频 --------
    // 机制：两个压力板 + 同步开关（同时踩下才开门，且一次触发永久开启）
    // 配合：两人跳上各自的高台，同时踩下压力板，门永久开启
    {
      name: '同频',
      desc: '心有同频，门自开启。\n同时落步，共赴前程。',
      bg: '#d4e0d2',
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 130, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
        // 左侧两个高台（黑色上左，白色上右）
        { x: 180, y: 520, w: 100, h: 20 },
        { x: 360, y: 440, w: 100, h: 20 },
        // 右侧两个高台
        { x: 820, y: 440, w: 100, h: 20 },
        { x: 1000, y: 520, w: 100, h: 20 },
        // 中间高台上的压力板平台
        { x: 420, y: 340, w: 120, h: 20 }, // 左压力板台
        { x: 740, y: 340, w: 120, h: 20 }, // 右压力板台
      ],
      walls: [],
      doors: [
        // 中间大门，同步开关控制
        { x: 625, y: 440, w: 30, h: 200, id: 'd3', mode: 'any' },
      ],
      plates: [
        { x: 450, y: 332, w: 60, id: 'p3a', targetId: null },
        { x: 770, y: 332, w: 60, id: 'p3b', targetId: null },
      ],
      buttons: [],
      boxes: [],
      movingPlatforms: [],
      syncSwitches: [
        { id1: 'p3a', id2: 'p3b', targetId: 'd3', once: true },
      ],
      spikes: [
        // 左右往返移动的尖刺：大门两侧各一组，向外侧退避
        { x: 480, y: 616, w: 60, h: 24, x2: 580, y2: 616, speed: 1.3, triggerId: null },
        { x: 640, y: 616, w: 60, h: 24, x2: 740, y2: 616, speed: 1.3, triggerId: null },
      ],
      goals: [
        { x: 1180, y: 570, w: 60, h: 70, color: 'black' },
        { x: 1100, y: 570, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 4 关：共济 --------
    // 机制：两个箱子 + 两个地面压力板 + 地面大门（mode: all）
    // 配合：两人各推一个箱子到各自压力板，双板同压大门开启，两人同行通过
    {
      name: '共济',
      desc: '各负其责，合力开门。\n一物归一位，两人共一心。',
      bg: '#e0d4e0',
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 130, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
      ],
      walls: [
        // 中间隔墙（上下两段，中间留门洞）
        { x: 900, y: 0, w: 28, h: 460 },  // 上半段：y=0~460
        { x: 900, y: 560, w: 28, h: 80 }, // 下半段：y=560~640
      ],
      doors: [
        // 大门位于中间：y=460~560，高100px，mode: all 需双板同压
        { x: 900, y: 460, w: 28, h: 100, id: 'd4', mode: 'all' },
      ],
      plates: [
        // 两个地面压力板（100px宽，放44px箱子后两侧各留28px过人）
        { x: 290, y: 632, w: 100, id: 'p4a', targetId: 'd4' },
        { x: 640, y: 632, w: 100, id: 'p4b', targetId: 'd4' },
      ],
      buttons: [],
      boxes: [
        { x: 120, y: 596, w: 44, h: 44, id: 'box4a' }, // 黑方箱子（近起点）
        { x: 480, y: 596, w: 44, h: 44, id: 'box4b' }, // 白方箱子
      ],
      movingPlatforms: [],
      syncSwitches: [],
      spikes: [
        // 左右往返移动的尖刺：门两侧地面各一组，节奏一快一慢
        { x: 300, y: 616, w: 60, h: 24, x2: 480, y2: 616, speed: 1.5, triggerId: null },
        { x: 720, y: 616, w: 60, h: 24, x2: 900, y2: 616, speed: 1.2, triggerId: null },
      ],
      goals: [
        // 两个终点都在门右侧的地面层，两人都能走到
        { x: 1150, y: 570, w: 60, h: 70, color: 'black' },
        { x: 1050, y: 570, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 5 关：接力 --------
    // 机制：白色小人沿左侧阶梯登上墙顶，踩按钮打开下层的门，黑色小人再从地面门通过到达终点
    // 流程：白走到左边缘 → 沿阶梯跳到墙顶 → 踩顶按钮 → 下层门打开 → 黑通过地面门 → 两人到各自终点
    {
      name: '接力',
      desc: '登高者按下机关，\n下地的人再出发。\n你托我上去，我为你开路。',
      bg: '#dde3d0',
      spawnBlack: { x: 60, y: 596 },
      spawnWhite: { x: 160, y: 596 },
      platforms: [
        // 地面（y=640顶面）
        { x: 0, y: 640, w: 1280, h: 80 },
        // ===== 左侧阶梯（白上顶路径，每级高差≤80px，轻松跳跃）=====
        // 第1阶：地面 640 → 567（高差 73）
        { x: 40, y: 567, w: 80, h: 20 },
        // 第2阶：567 → 494（高差 73）
        { x: 100, y: 494, w: 80, h: 20 },
        // 第3阶：494 → 421（高差 73）
        { x: 40, y: 421, w: 80, h: 20 },
        // 第4阶：421 → 348（高差 73）
        { x: 100, y: 348, w: 80, h: 20 },
        // 第5阶：348 → 275（高差 73）
        { x: 40, y: 275, w: 80, h: 20 },
        // 第6阶（墙顶前最后一级）：275 → 202（高差 73）
        { x: 100, y: 202, w: 100, h: 20 },
        // ===== 墙顶平台（y=200顶面，宽 320，x:280-600）=====
        { x: 280, y: 200, w: 320, h: 20 },
        // ===== 右侧高台（白终点所在，y=240顶面），从墙顶跳下
        { x: 700, y: 240, w: 580, h: 20 },
      ],
      walls: [
        // 中间厚墙（x:440-520，宽 80）
        // 墙顶平台以下为实体墙，中间有下层门洞
        // 实墙部分 y=220~500，门 y=500~640
        { x: 440, y: 220, w: 80, h: 280 },
      ],
      doors: [
        // 下层门（黑通过）：白踩墙顶按钮打开
        // 门洞高 140，足够玩家（高 44）通过
        { x: 440, y: 500, w: 80, h: 140, id: 'd5b', mode: 'any' },
      ],
      plates: [],
      buttons: [
        // 墙顶按钮（白踩）→ 开下层门
        // y=190：按钮顶面在墙顶平台（y=200）上方 -10 位置
        // 按钮 w=32，放在墙顶中央偏左
        { x: 400, y: 190, id: 'b5w', targetId: 'd5b' },
      ],
      boxes: [],
      movingPlatforms: [],
      syncSwitches: [],
      spikes: [
        // 左右往返移动的尖刺：右侧地面来回巡逻，注意节奏再冲终点
        { x: 900, y: 616, w: 80, h: 24, x2: 1080, y2: 616, speed: 1.8, triggerId: null },
      ],
      goals: [
        // 黑终点：右侧地面
        { x: 1150, y: 570, w: 60, h: 70, color: 'black' },
        // 白终点：右侧高台上
        { x: 1150, y: 170, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 6 关：时限 --------
    // 机制：时序门（按钮触发后只开4秒）
    // 配合：黑踩按钮，白快速通过；白到对面后踩按钮，黑再快速通过
    {
      name: '时限',
      desc: '门不会一直开着。\n一人踩住按钮，\n另一人快跑过去。',
      bg: '#e8d4d4',
      spawnBlack: { x: 60, y: 596 },
      spawnWhite: { x: 140, y: 596 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
      ],
      walls: [
        // 中间墙，门洞在地面层（墙高 540，不可能跳过）
        { x: 640, y: 0, w: 20, h: 540 },
      ],
      doors: [
        // 时序门：触发后开 4 秒（240 帧），足够切换角色 + 跑过去
        { x: 640, y: 540, w: 20, h: 100, id: 'd6', mode: 'timed', duration: 240 },
      ],
      plates: [],
      buttons: [
        // 左侧按钮（瞬动：松开即复位）→ 踩一下开时序门，给白过去用
        { x: 400, y: 630, id: 'b6a', targetId: 'd6', momentary: true },
        // 右侧按钮（瞬动）→ 踩一下再开一次时序门，给黑过去用
        { x: 880, y: 630, id: 'b6b', targetId: 'd6', momentary: true },
      ],
      boxes: [],
      movingPlatforms: [],
      syncSwitches: [],
      spikes: [
        // 左右往返移动的尖刺：两侧各一组，节奏不同，增加限时通过难度
        // 左侧尖刺起点右移，远离白色出生点（x=140），保证开局安全
        { x: 240, y: 616, w: 80, h: 24, x2: 500, y2: 616, speed: 1.5, triggerId: null },
        { x: 900, y: 616, w: 80, h: 24, x2: 1100, y2: 616, speed: 1.8, triggerId: null },
      ],
      goals: [
        { x: 1180, y: 570, w: 60, h: 70, color: 'black' },
        { x: 1080, y: 570, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 7 关：垫脚 --------
    // 机制：箱子作为垫脚 + 高台按钮
    // 配合：两人合作推箱子到墙下，白踩箱子上高台按按钮开终点门，黑走地面
    {
      name: '垫脚',
      desc: '托你上去，\n剩下的路，一起走。',
      bg: '#d0dbe8',
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 130, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
        // 白走的上层路
        // 第一个高台（从箱子跳上去，箱子顶y=596→y=520，高差76px，轻松）
        { x: 380, y: 520, w: 140, h: 20 },
        // 第二个高台（按钮所在，y=520→y=440，高差80px）
        { x: 600, y: 440, w: 160, h: 20 },
        // 下降台（y=440→y=500，下跳60px）
        { x: 820, y: 500, w: 140, h: 20 },
        // 右侧终点高台（白的终点，y=500→y=420，高差80px）
        { x: 1040, y: 420, w: 240, h: 20 },
        // 高台侧面实体（只到y=540，下方留出地面通道给黑通过）
        { x: 1040, y: 440, w: 240, h: 100 },
      ],
       walls: [
        // 终点区隔墙 x=980：
        //   y=0~420   上实体墙
        //   y=420~520 上层门洞（白从 y=500 平台跳到 y=420 终点平台时通过）
        //   y=520~540 中间实体段（完全分隔上下两层）
        //   y=540~640 地面门洞（门 d7，黑通过）
        { x: 980, y: 0, w: 20, h: 420 },
        { x: 980, y: 520, w: 20, h: 20 },
      ],
       doors: [
        // 地面门（黑通过用）：白踩高台按钮后永久开启
        { x: 980, y: 540, w: 20, h: 100, id: 'd7', mode: 'any' },
      ],
      plates: [],
      buttons: [
        // 高台上的按钮 → 开黑色终点门
        { x: 640, y: 430, id: 'b7', targetId: 'd7' },
      ],
      boxes: [
        // 一个公共箱子：两人一起推到墙下，白踩着跳上高台
        { x: 200, y: 596, w: 44, h: 44, id: 'box7' },
      ],
      movingPlatforms: [],
      syncSwitches: [],
      spikes: [
        // 上下往返移动的尖刺：墙下方向上探出，需要把握时机
        { x: 700, y: 616, w: 80, h: 24, x2: 700, y2: 560, speed: 1.2, triggerId: null },
      ],
      goals: [
        { x: 1180, y: 570, w: 60, h: 70, color: 'black' },
        { x: 1110, y: 350, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 8 关：双升 --------
    // 机制：两个升降平台 + 地面压力板 + 高台按钮
    // 配合：黑踩压力板送白乘右电梯上高台 → 白到高台后按按钮开门 + 启动左电梯 → 黑乘左电梯上来穿过门洞 → 两人同达终点
    {
      name: '双升',
      desc: '你托我一把，我拉你一下。\n一步一步，一同向上。',
      bg: '#e0d8cc',
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 1170, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
        // 中间辅助跳台（黑到压力板的垫脚）
        { x: 280, y: 560, w: 80, h: 20 },
        // 压力板所在的小台（靠近左电梯，黑踩完直接可以跳上电梯）
        { x: 440, y: 520, w: 100, h: 20 },
        // 右侧上层大平台（两人共用的终点平台）
        { x: 700, y: 280, w: 400, h: 20 },
        { x: 700, y: 300, w: 400, h: 340 },
      ],
      walls: [
        // 左墙（分割左右两侧），在y=180~280处留出门洞（门d8嵌在此处）
        //   上墙上段 y=0~180（门洞上方的墙）
        //   门洞 y=180~280（门d8占据，门打开时可通行）
        //   上墙下段 y=280~460（门洞下方的墙，阻挡从低处跳过）
        //   中间间隙 y=460~500（高40px < 玩家身高44px，玩家跳不过去）
        //   下墙 y=500~640（阻挡地面通行）
        //   电梯通道在墙左侧(x<700)，电梯贴墙上升，只有门洞高度能过去
        { x: 700, y: 0, w: 20, h: 180 },
        { x: 700, y: 280, w: 20, h: 180 },
        { x: 700, y: 500, w: 20, h: 140 },
      ],
      doors: [
        // 上层大门（黑从左电梯上来后通过，门同时也是左电梯的触发信号）
        { x: 700, y: 180, w: 20, h: 100, id: 'd8', mode: 'any' },
      ],
      plates: [
        // 地面压力板（黑踩）→ 控制右升降平台（送白上去）
        { x: 460, y: 512, w: 60, id: 'p8b', targetId: 'mp8r' },
      ],
      buttons: [
        // 上层按钮（白到达后踩）→ 开大门 d8 + 同时启动左升降平台（共用d8信号）
        // 放在右电梯出口处，白一上来就会踩到
        { x: 1000, y: 270, id: 'b8w', targetId: 'd8' },
      ],
      boxes: [],
      movingPlatforms: [
        // 右升降平台（白用，黑踩板控制）：从y=620升到y=280，贴在上层平台右边缘
        { x: 1100, y: 620, w: 90, h: 14, x2: 1100, y2: 280, speed: 2.2, triggerId: 'mp8r' },
        // 左升降平台（黑用，白按按钮控制，与门共用d8信号）：从y=620升到y=280，贴在墙左侧
        { x: 610, y: 620, w: 90, h: 14, x2: 610, y2: 280, speed: 2.2, triggerId: 'd8' },
      ],
      syncSwitches: [],
      spikes: [
        // 左右往返移动的尖刺：地面中段巡逻
        { x: 260, y: 616, w: 60, h: 24, x2: 440, y2: 616, speed: 1.4, triggerId: null },
      ],
      goals: [
        { x: 950, y: 210, w: 60, h: 70, color: 'black' },
        { x: 850, y: 210, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 9 关：镜像 --------
    // 机制：同步开关 + 镜像阶梯布局
    // 配合：两人沿两侧对称阶梯向上，必须同时到达顶部压力板才能开门
    {
      name: '镜像',
      desc: '你的脚步，是我的节拍。\n同步向上，一同开门。',
      bg: '#d4dae0',
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 1180, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
        // 左侧阶梯（黑）
        { x: 120, y: 560, w: 80, h: 20 },
        { x: 200, y: 480, w: 80, h: 20 },
        { x: 280, y: 400, w: 80, h: 20 },
        { x: 360, y: 320, w: 100, h: 20 }, // 左顶平台（压力板）
        // 右侧阶梯（白）——镜像对称
        { x: 1080, y: 560, w: 80, h: 20 },
        { x: 1000, y: 480, w: 80, h: 20 },
        { x: 920, y: 400, w: 80, h: 20 },
        { x: 820, y: 320, w: 100, h: 20 }, // 右顶平台（压力板）
        // 中间顶部：终点平台
        { x: 500, y: 220, w: 280, h: 20 },
        { x: 500, y: 240, w: 280, h: 400 },
      ],
      walls: [
        // 中间高墙，上部有门洞 y=120~220
        { x: 630, y: 0, w: 20, h: 120 },
        { x: 630, y: 220, w: 20, h: 420 },
      ],
      doors: [
        // 顶部大门，同步开关触发（两人同时踩顶部压力板）
        { x: 630, y: 120, w: 20, h: 100, id: 'd9', mode: 'any' },
      ],
      plates: [
        { x: 380, y: 312, w: 60, id: 'p9a', targetId: null },
        { x: 840, y: 312, w: 60, id: 'p9b', targetId: null },
      ],
      buttons: [],
      boxes: [],
      movingPlatforms: [],
      syncSwitches: [
        { id1: 'p9a', id2: 'p9b', targetId: 'd9', once: true },
      ],
      spikes: [
        // 左右往返移动的尖刺：中央下方地面大范围巡逻
        { x: 480, y: 616, w: 120, h: 24, x2: 720, y2: 616, speed: 1.6, triggerId: null },
      ],
      goals: [
        { x: 540, y: 150, w: 60, h: 70, color: 'black' },
        { x: 680, y: 150, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 10 关：搬运 --------
    // 机制：重箱子（heavy=true）+ 压力板开门
    // 配合：大箱子太重，单人推不动，必须两人在同一侧合力推到压力板上才能开门
    {
      name: '搬运',
      desc: '一个人推不动的，\n两个人一起扛。',
      bg: '#d8d0c4',
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 130, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
      ],
      walls: [
        // 中间墙，地面门洞
        { x: 900, y: 0, w: 20, h: 540 },
      ],
      doors: [
        { x: 900, y: 540, w: 20, h: 100, id: 'd10', mode: 'all' },
      ],
      plates: [
        // 两个压力板并排，需要长方形箱子同时压住才能开门
        { x: 640, y: 632, w: 80, id: 'p10', targetId: 'd10' },
        { x: 760, y: 632, w: 80, id: 'p10b', targetId: 'd10' },
      ],
      buttons: [],
      boxes: [
        // 重箱子（长方形）：必须两人同时推才动，推到位后同时压住两个压力板开门
        { x: 200, y: 580, w: 220, h: 60, id: 'bigbox', heavy: true },
      ],
      movingPlatforms: [],
      syncSwitches: [],
      spikes: [
        // 左右往返移动的尖刺：地面中段来回巡逻，小心躲避
        { x: 300, y: 616, w: 80, h: 24, x2: 500, y2: 616, speed: 1.4, triggerId: null },
      ],
      goals: [
        { x: 1150, y: 570, w: 60, h: 70, color: 'black' },
        { x: 1050, y: 570, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 11 关：切换 --------
    // 机制：两组切换平台 + 两侧压力板
    // 配合：黑踩左板A组显（白走A组平台到右侧），白到后踩右板B组显（黑走B组平台过去）
    {
      name: '切换',
      desc: '你走你的路，我搭我的桥。\n一步一换，交替向前。',
      bg: '#c8d8d4',
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 130, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
        // 左侧踩板台
        { x: 60, y: 560, w: 100, h: 20 },
        // 右侧踩板台 + 终点平台
        { x: 1100, y: 480, w: 180, h: 20 },
        { x: 1100, y: 500, w: 180, h: 140 },
      ],
      walls: [
        // 终点区左墙：门洞 y=380~480
        { x: 1100, y: 0, w: 20, h: 380 },
        { x: 1100, y: 480, w: 20, h: 160 },
      ],
      doors: [
        // 终点门 + B组平台切换共用信号：白按右侧按钮同时触发两者
        { x: 1100, y: 380, w: 20, h: 100, id: 'd11', mode: 'any' },
      ],
      plates: [],
      buttons: [
        // 左侧按钮（黑踩）→ 永久显示A组平台（白走A组到右侧）
        { x: 94, y: 550, id: 'b11l', targetId: 'togA' },
        // 右侧按钮（白到达A组末端后踩，在门左侧，不需要过门）→ 开终点门 + 显示B组平台
        { x: 1024, y: 460, id: 'b11r', targetId: 'd11' },
      ],
      boxes: [],
      movingPlatforms: [],
      togglePlatforms: [
        // A组（白用，黑踩板时显示）：从起点侧到右侧，上升后下降
        { x: 260, y: 540, w: 90, h: 16, id: 'tp11a1', triggerId: 'togA', group: 'A', visible: false },
        { x: 450, y: 480, w: 90, h: 16, id: 'tp11a2', triggerId: 'togA', group: 'A', visible: false },
        { x: 650, y: 420, w: 90, h: 16, id: 'tp11a3', triggerId: 'togA', group: 'A', visible: false },
        { x: 850, y: 480, w: 90, h: 16, id: 'tp11a4', triggerId: 'togA', group: 'A', visible: false },
        { x: 1000, y: 470, w: 80, h: 16, id: 'tp11a5', triggerId: 'togA', group: 'A', visible: false },
        // B组（黑用，白按右侧按钮后显示）：不同的路径
        { x: 240, y: 510, w: 90, h: 16, id: 'tp11b1', triggerId: 'd11', group: 'A', visible: false },
        { x: 420, y: 440, w: 90, h: 16, id: 'tp11b2', triggerId: 'd11', group: 'A', visible: false },
        { x: 620, y: 380, w: 90, h: 16, id: 'tp11b3', triggerId: 'd11', group: 'A', visible: false },
        { x: 820, y: 440, w: 90, h: 16, id: 'tp11b4', triggerId: 'd11', group: 'A', visible: false },
        { x: 980, y: 460, w: 80, h: 16, id: 'tp11b5', triggerId: 'd11', group: 'A', visible: false },
      ],
      syncSwitches: [],
      spikes: [
        // 左右往返移动的尖刺：下方地面大范围巡逻，跳台时把握节奏
        { x: 420, y: 616, w: 200, h: 24, x2: 720, y2: 616, speed: 2, triggerId: null },
      ],
      goals: [
        { x: 1180, y: 410, w: 60, h: 70, color: 'black' },
        { x: 1120, y: 410, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 12 关：迷宫 --------
    // 机制：上下两层分路 + 三道门 + 三个按钮的连锁
    // 配合：黑走地面，沿路踩两个按钮为白开两道上层门；白走上层，踩一个按钮为黑开地面终点门
    // 流程：黑踩按钮1 → 白开第一道门进入中段 → 黑踩按钮2 → 白开第二道门进入终区 → 白踩按钮 → 黑开地面终点门 → 汇合
    {
      name: '迷宫',
      desc: '你在墙那边，我在墙这边。\n各自寻路，终点相见。',
      bg: '#d8d0d8',
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 60, y: 280 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 }, // 地面（黑走，全程畅通）
        // 上层走道（白走）——分三段，由三道门分隔
        { x: 0, y: 340, w: 300, h: 20 },    // 左段：白起点 (x=0~300)
        { x: 320, y: 340, w: 380, h: 20 },  // 中段：白踩按钮的地方 (x=320~700)
        { x: 720, y: 340, w: 280, h: 20 },  // 右段：白到终点前 (x=720~1000)
        // 终区平台（右侧，白终点在上、黑终点在下）
        { x: 1000, y: 340, w: 280, h: 20 }, // 右终区上层地板（白站这里）
      ],
      walls: [
        // 终区左墙 x=1000：
        //   y=0~240     上实体墙
        //   y=240~340   上层门洞（门 d12w2，白通过到终区）
        //   y=340~540   中间实体段（分隔上下层）
        //   y=540~640   地面门洞（门 d12b，黑通过到终区）
        { x: 1000, y: 0, w: 20, h: 240 },
        { x: 1000, y: 340, w: 20, h: 200 },
        // 上层第一道墙 x=300（仅上层有，分隔白的起点和中段）：
        //   y=0~240     上实体墙
        //   y=240~340   上层门洞（门 d12w1）
        //   y=340~640   悬空（地面层黑不受影响）
        { x: 300, y: 0, w: 20, h: 240 },
        // 上层第二道墙 x=700（仅上层有，分隔中段和右段）：
        { x: 700, y: 0, w: 20, h: 240 },
      ],
      doors: [
        // 上层左门（白从起点到中段）：黑踩按钮1开
        { x: 300, y: 240, w: 20, h: 100, id: 'd12w1', mode: 'any' },
        // 上层中门（白从中段到右段）：黑踩按钮2开
        { x: 700, y: 240, w: 20, h: 100, id: 'd12w2', mode: 'any' },
        // 上层终门（白从右段到终区）：与按钮2同步，和d12w2一起开
        { x: 1000, y: 240, w: 20, h: 100, id: 'd12w2', mode: 'any' },
        // 地面终门（黑通过到终点）：白踩中段按钮开
        { x: 1000, y: 540, w: 20, h: 100, id: 'd12b', mode: 'any' },
      ],
      plates: [],
      buttons: [
        // 黑地面按钮1 → 开白的上层左门
        { x: 150, y: 630, id: 'b12b1', targetId: 'd12w1' },
        // 黑地面按钮2 → 开白的上层中门和终门
        { x: 500, y: 630, id: 'b12b2', targetId: 'd12w2' },
        // 白上层中段按钮 → 开黑的地面终门
        { x: 480, y: 330, id: 'b12w', targetId: 'd12b' },
      ],
      boxes: [],
      movingPlatforms: [],
      spikes: [
        // 左右往返移动的尖刺：地面路径中段两侧各一组
        { x: 260, y: 616, w: 60, h: 24, x2: 420, y2: 616, speed: 1.5, triggerId: null },
        { x: 740, y: 616, w: 60, h: 24, x2: 900, y2: 616, speed: 1.3, triggerId: null },
      ],
      syncSwitches: [],
      goals: [
        { x: 1180, y: 570, w: 60, h: 70, color: 'black' },
        { x: 1120, y: 270, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 13 关：尖刺 --------
    // 机制：双人同步按钮 + 双横杆门 + 跑酷跳跃平台 + 移动尖刺
    // 配合：两人各踩一个按钮合力开启两道横杆门，一起跳跃通过尖刺区到达终点
    {
      name: '尖刺',
      desc: '双闸齐开，\n一跃而过。',
      bg: '#d0c4c4',
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 130, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 }, // 地面
        // 左侧两个按钮台（一人一个）
        { x: 40, y: 580, w: 80, h: 20 },
        { x: 160, y: 580, w: 80, h: 20 },
        // 中间跑酷跳台
        { x: 350, y: 560, w: 80, h: 16 },
        { x: 500, y: 500, w: 80, h: 16 },
        { x: 650, y: 560, w: 80, h: 16 },
        { x: 800, y: 500, w: 80, h: 16 },
      ],
      walls: [],
      doors: [
        // 第一道横杆门（左），从地面往上135px，单人跳不过去
        { x: 280, y: 505, w: 20, h: 135, id: 'gate13', mode: 'any' },
        // 第二道横杆门（右）
        { x: 920, y: 505, w: 20, h: 135, id: 'gate13', mode: 'any' },
      ],
      plates: [],
      buttons: [
        // 黑按钮（左按钮台）
        { x: 64, y: 570, id: 'b13b', targetId: 'b13b' },
        // 白按钮（右按钮台）
        { x: 184, y: 570, id: 'b13w', targetId: 'b13w' },
      ],
      boxes: [],
      movingPlatforms: [],
      spikes: [
        // 移动尖刺在中间通道地面上来回巡逻，增加跑酷挑战性
        { x: 370, y: 616, w: 80, h: 24, x2: 850, y2: 616, speed: 3, triggerId: null },
      ],
      syncSwitches: [
        // 两人同时踩下各自按钮 → 两道横杆门永久开启
        { id1: 'b13b', id2: 'b13w', targetId: 'gate13', once: true },
      ],
      goals: [
        { x: 1180, y: 570, w: 60, h: 70, color: 'black' },
        { x: 1080, y: 570, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 14 关：综合 --------
    // 机制：同步开关 + 时序门 + 箱子 + 升降平台 综合
    // 配合：精密配合，两人各司其职
    {
      name: '综合',
      desc: '所学的一切，\n都在这里了。',
      bg: '#c0ccd4',
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 160, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
        // 同步开关的两个压力板台
        { x: 80, y: 540, w: 100, h: 20 },
        { x: 200, y: 540, w: 100, h: 20 },
        // 中段台阶
        { x: 400, y: 480, w: 100, h: 20 },
        { x: 560, y: 460, w: 120, h: 20 }, // 白按钮台
        // 黑上升降平台的两级台阶（同步开关触发后升降平台停在顶端y=380，黑逐级跳上去）
        { x: 520, y: 540, w: 100, h: 20 },
        { x: 620, y: 460, w: 80, h: 20 },
        // 上层通道（黑走的路）
        { x: 760, y: 380, w: 120, h: 20 },
        { x: 940, y: 320, w: 120, h: 20 },
        // 终点平台（黑在上，白在下）
        { x: 1080, y: 260, w: 200, h: 20 },
      ],
       walls: [
        // 终区墙 x=1080：
        //   y=0~160    上实体墙
        //   y=160~260  上层门洞（门 d14a，黑通过到上层终点）
        //   y=260~460  中实体段
        //   y=460~540  中间门洞（白上下/返回通行用，无门）
        //   y=540~640  下层门洞（门 d14b，白通过到地面终点）
        { x: 1080, y: 0, w: 20, h: 160 },
        { x: 1080, y: 260, w: 20, h: 200 },
      ],
      doors: [
        // 上层终点门（黑用）：同步开关触发（永久）
        { x: 1080, y: 160, w: 20, h: 100, id: 'd14a', mode: 'any' },
        // 下层终点门（白用）：白按钮触发时序门
        { x: 1080, y: 540, w: 20, h: 100, id: 'd14b', mode: 'timed', duration: 180 },
      ],
      plates: [
        { x: 100, y: 532, w: 60, id: 'p14a', targetId: null },
        { x: 220, y: 532, w: 60, id: 'p14b', targetId: null },
      ],
      buttons: [
        // 中段高台上的按钮 → 开下层时序门（白自己按，自己冲过去）
        { x: 600, y: 450, id: 'b14', targetId: 'd14b' },
      ],
      boxes: [
        // 一个箱子作为垫脚，帮助白跳上中段高台
        { x: 340, y: 596, w: 44, h: 44, id: 'box14' },
      ],
      movingPlatforms: [
        // 升降平台：同步开关激活后升起，送黑到上层通道
        { x: 700, y: 560, w: 80, h: 14, x2: 700, y2: 380, speed: 2, triggerId: 'd14a' },
      ],
      syncSwitches: [
        // 两板同踩 → 永久开上层终点门 + 激活升降平台
        { id1: 'p14a', id2: 'p14b', targetId: 'd14a', once: true },
      ],
      spikes: [
        // 固定尖刺：地面中段警示
        { x: 660, y: 616, w: 80, h: 24, x2: 860, y2: 616, speed: 1.6, triggerId: null },
      ],
      goals: [
        { x: 1180, y: 190, w: 60, h: 70, color: 'black' },
        { x: 1120, y: 570, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 15 关：共生 --------
    // 终极挑战：同步开关 + 双箱压板 + 移动尖刺 + 双时序门 + 共同终点
    // 流程：两人同踩同步板开门 → 两人分走尖刺区两侧，各推一个箱子到各自压力板 → 双板同压尖刺暂停 → 穿过尖刺区 → 分左右路上高台 → 分别踩时序门按钮 → 冲入中央共生终点
    {
      name: '共生',
      desc: '穿越险阻，并肩到底。\n你即我，我即你。',
      bg: '#b8c0c8',
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 130, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
        // 同步开关双台（入门处）
        { x: 80, y: 560, w: 80, h: 20 },
        { x: 200, y: 560, w: 80, h: 20 },
        // 左侧跳跃阶梯（黑路上高台）
        { x: 380, y: 540, w: 80, h: 20 },
        { x: 480, y: 460, w: 80, h: 20 },
        { x: 400, y: 360, w: 100, h: 20 }, // 左按钮台（左移留出起跳空间）
        // 右侧跳跃阶梯（白路上高台）
        { x: 820, y: 540, w: 80, h: 20 },
        { x: 720, y: 460, w: 80, h: 20 },
        { x: 780, y: 360, w: 100, h: 20 }, // 右按钮台（右移留出起跳空间）
        // 中央共同终点平台（两人都要到达）
        { x: 540, y: 260, w: 200, h: 20 },
        { x: 540, y: 280, w: 200, h: 360 },
      ],
      walls: [
        // 第一堵墙（同步门位置）：门洞 y=440~540
        { x: 320, y: 0, w: 20, h: 440 },
        { x: 320, y: 540, w: 20, h: 100 },
        // 中央高台左墙：门洞 y=160~260
        { x: 540, y: 0, w: 20, h: 160 },
        { x: 540, y: 260, w: 20, h: 380 },
        // 中央高台右墙：门洞 y=160~260
        { x: 720, y: 0, w: 20, h: 160 },
        { x: 720, y: 260, w: 20, h: 380 },
      ],
      doors: [
        // 同步门（两人同时踩板才开，永久）
        { x: 320, y: 440, w: 20, h: 100, id: 'd15sync', mode: 'any' },
        // 左时序门（进中央高台左侧门）
        { x: 540, y: 160, w: 20, h: 100, id: 'd15l', mode: 'timed', duration: 200 },
        // 右时序门（进中央高台右侧门）
        { x: 720, y: 160, w: 20, h: 100, id: 'd15r', mode: 'timed', duration: 200 },
      ],
      plates: [
        // 同步开关两板（同时踩才开门）
        { x: 90, y: 552, w: 60, id: 'p15a', targetId: null },
        { x: 210, y: 552, w: 60, id: 'p15b', targetId: null },
        // 两个箱子压力板 → 都压住才暂停尖刺
        { x: 380, y: 632, w: 70, id: 'p15c', targetId: 'sp15' },
        { x: 860, y: 632, w: 70, id: 'p15d', targetId: 'sp15' },
      ],
      buttons: [
        // 左高台按钮（黑踩）→ 开左时序门
        { x: 434, y: 350, id: 'b15l', targetId: 'd15l' },
        // 右高台按钮（白踩）→ 开右时序门
        { x: 814, y: 350, id: 'b15r', targetId: 'd15r' },
      ],
      boxes: [
        // 左箱子（黑推）→ 推到左压力板 p15c 上
        { x: 200, y: 596, w: 44, h: 44, id: 'box15a' },
        // 右箱子（白推）→ 推到右压力板 p15d 上
        { x: 980, y: 596, w: 44, h: 44, id: 'box15b' },
      ],
      movingPlatforms: [],
      spikes: [
        // 地面来回移动尖刺：两个箱子压力板都压住才暂停
        { x: 500, y: 616, w: 60, h: 24, x2: 760, y2: 616, speed: 2.5, triggerId: 'sp15', mode: 'all' },
      ],
      syncSwitches: [
        // 同步开关：两板同踩 → 永久开同步门
        { id1: 'p15a', id2: 'p15b', targetId: 'd15sync', once: true },
      ],
      goals: [
        // 共同终点：同一处位置，象征共生
        { x: 590, y: 190, w: 60, h: 70, color: 'black' },
        { x: 630, y: 190, w: 60, h: 70, color: 'white' },
      ]
    },

    // -------- 第 16 关：尾声（彩蛋） --------
    // 机制：空旷场景，两人同行走到终点，一起点燃烟花，观看盛大表演与制作人员名单
    {
      name: '尾声',
      desc: '一路同行，至此不散。\n烟花为你们而放。',
      bg: '#0a0a14',
      isEasterEgg: true,
      spawnBlack: { x: 60, y: 560 },
      spawnWhite: { x: 140, y: 560 },
      platforms: [
        { x: 0, y: 640, w: 1280, h: 80 },
      ],
      walls: [
        // 终点右侧阻挡墙，防止玩家走出判定区（玩家宽28，1232<1260，留28px空间）
        { x: 1260, y: 0, w: 10, h: 640 },
      ],
      doors: [],
      plates: [],
      buttons: [],
      boxes: [],
      movingPlatforms: [],
      spikes: [],
      syncSwitches: [],
      // 彩蛋关专用：终点判定区（两人同时站上 → 点燃烟花）
      // 两个判定区重叠，贴右侧墙放置，确保两人走到最右都在判定区内
      eggGoals: [
        { x: 1120, y: 570, w: 140, h: 70, color: 'black' },
        { x: 1120, y: 570, w: 140, h: 70, color: 'white' },
      ],
      // 烟花装置（小火箭）位置：放在地面上，引线连到火箭底部
      fireworkDevice: { x: 620, y: 596, w: 40, h: 44 },
      goals: []
    },
  ];

  // ============================================================
  // 当前关卡状态
  // ============================================================
  let level = null;
  let players = [];
  let platforms = [];
  let walls = [];
  let doors = [];
  let plates = [];
  let buttons = [];
  let boxes = [];
  let movingPlatforms = [];
  let togglePlatforms = [];
  let spikes = [];
  let goals = [];
  let eggGoals = [];
  let fireworkDevice = null;
  let eggFuseProgress = 0;     // 引线燃烧进度 0-1
  let eggFuseBurning = false;  // 引线是否在燃烧
  let eggFireworkStarted = false; // 烟花是否已点燃
  let eggIgniteTimer = 0;      // 点火延迟计时（引线烧到后，火箭喷焰预热后再起飞）
  let eggPhase = 'idle';       // idle / fuse / ignite / fireworks / credits
  let syncSwitches = [];
  let particles = [];
  // 烟花专用：发射体 + 爆炸粒子
  let fireworks = [];
  let fireworkTimer = 0; // 烟花表演计时
  let fireworkPhase = 'idle'; // idle / show / done

  function loadLevel(idx) {
    const data = LEVELS[idx];
    level = data;

    players = [
      new Player(data.spawnBlack.x, data.spawnBlack.y, 'black',
        { left: 'KeyA', right: 'KeyD', jump: 'KeyW' }),
      new Player(data.spawnWhite.x, data.spawnWhite.y, 'white',
        { left: 'ArrowLeft', right: 'ArrowRight', jump: 'ArrowUp' }),
    ];

    platforms = data.platforms.map(p => ({ ...p }));
    walls = (data.walls || []).map(w => ({ ...w }));
    doors = data.doors.map(d => new Door(d.x, d.y, d.w, d.h, d.id, d.mode || 'any', { duration: d.duration }));
    plates = data.plates.map(p => new PressurePlate(p.x, p.y, p.w, p.id, p.targetId));
    buttons = data.buttons.map(b => new Button(b.x, b.y, b.id, b.targetId, { momentary: b.momentary }));
    boxes = data.boxes.map(b => new Box(b.x, b.y, b.w, b.h, b.id || null, b.heavy || false));
    movingPlatforms = data.movingPlatforms.map(m =>
      new MovingPlatform(m.x, m.y, m.w, m.h, m.x2, m.y2, m.speed, m.triggerId, m.mode || 'hold'));
    togglePlatforms = (data.togglePlatforms || []).map(t =>
      new TogglePlatform(t.x, t.y, t.w, t.h, t.id, t.triggerId || null, t.group || 'A', t.visible !== false));
    spikes = (data.spikes || []).map(s =>
      new Spike(s.x, s.y, s.w, s.h, s.x2, s.y2, s.speed, s.triggerId, s.mode || 'any', s.active !== false));
    goals = data.goals.map(g => new GoalZone(g.x, g.y, g.w, g.h, g.color));
    eggGoals = (data.eggGoals || []).map(g => new GoalZone(g.x, g.y, g.w, g.h, g.color));
    fireworkDevice = data.fireworkDevice || null;
    syncSwitches = data.syncSwitches.map(s =>
      new SyncSwitch(s.id1, s.id2, s.targetId, s.once !== false));

    winHoldTime = 0;
    particles = [];
    // 彩蛋关状态重置
    eggFuseProgress = 0;
    eggFuseBurning = false;
    eggFireworkStarted = false;
    eggIgniteTimer = 0;
    eggPhase = 'idle';

    const hud = document.getElementById('hud');
    hud.textContent = `第 ${idx + 1} 关  ·  ${data.name}`;
  }

  // ============================================================
  // 触发映射：根据开关状态计算各门是否应该打开
  // ============================================================
  function computeTriggers() {
    // 收集所有触发源的状态
    const triggerMap = {};

    // 压力板 → 目标
    for (const pl of plates) {
      if (pl.targetId) {
        if (!triggerMap[pl.targetId]) triggerMap[pl.targetId] = [];
        triggerMap[pl.targetId].push(pl.pressed);
      }
      // 同时记录自身id状态（供syncSwitch用）
      triggerMap['_plate_' + pl.id] = pl.pressed;
    }

    // 按钮 → 目标
    for (const b of buttons) {
      if (b.targetId) {
        if (!triggerMap[b.targetId]) triggerMap[b.targetId] = [];
        triggerMap[b.targetId].push(b.momentary ? b.pressed : b.activated);
      }
      triggerMap['_btn_' + b.id] = b.momentary ? b.pressed : b.activated;
    }

    // 同步开关 → 目标
    for (const ss of syncSwitches) {
      // 同步开关的输入是压力板或按钮的id
      const s1 = getTriggerStatus(ss.id1);
      const s2 = getTriggerStatus(ss.id2);
      let active;
      if (ss.once) {
        if (s1 && s2) ss.triggered = true;
        active = ss.triggered;
      } else {
        active = s1 && s2;
      }
      ss.active = active;
      if (ss.targetId) {
        if (!triggerMap[ss.targetId]) triggerMap[ss.targetId] = [];
        triggerMap[ss.targetId].push(active);
      }
    }

    function getTriggerStatus(id) {
      // 先查压力板
      for (const pl of plates) if (pl.id === id) return pl.pressed;
      // 再查按钮
      for (const b of buttons) if (b.id === id) return b.activated;
      return false;
    }

    // 计算每扇门的触发状态
    for (const d of doors) {
      const triggers = triggerMap[d.id] || [];
      if (d.mode === 'all') {
        d._shouldOpen = triggers.length > 0 && triggers.every(t => t);
      } else {
        // 'any' 模式
        d._shouldOpen = triggers.some(t => t);
      }
    }

    // 计算每个移动平台的触发状态
    for (const mp of movingPlatforms) {
      if (mp.triggerId === null) {
        mp._shouldRun = true;
      } else {
        const triggers = triggerMap[mp.triggerId] || [];
        mp._shouldRun = triggers.some(t => t);
      }
    }

    // 计算切换平台的显示状态（按组）
    // 规则：A组显示时B组隐藏，反之亦然。开关控制哪组显示。
    // 每个切换平台的triggerId决定它属于哪组以及由谁控制
    for (const tp of togglePlatforms) {
      if (tp.triggerId === null) {
        tp._shouldShow = tp.visible;
      } else {
        const triggers = triggerMap[tp.triggerId] || [];
        const active = triggers.some(t => t);
        // group A: active=true时显示; group B: active=false时显示（反转）
        tp._shouldShow = tp.group === 'A' ? active : !active;
      }
    }

    // 计算尖刺的冻结状态
    for (const sp of spikes) {
      if (sp.triggerId === null) {
        sp._shouldFreeze = false;
      } else {
        const triggers = triggerMap[sp.triggerId] || [];
        if (sp.mode === 'all') {
          sp._shouldFreeze = triggers.length > 0 && triggers.every(t => t);
        } else {
          sp._shouldFreeze = triggers.some(t => t);
        }
      }
    }
  }

  // ============================================================
  // 更新逻辑
  // ============================================================
  function update() {
    if (gameState === STATE.PLAYING) {
      updateGame();
    } else if (gameState === STATE.FAILED) {
      // 失败态：暂停游戏循环，显示失败面板
      updateParticles();
    } else if (gameState === STATE.LEVEL_INTRO) {
      introTimer--;
      if (introTimer <= 0) {
        gameState = STATE.PLAYING;
        document.getElementById('levelBanner').classList.add('hidden');
      }
    } else if (gameState === STATE.LEVEL_CLEAR) {
      clearTimer--;
      updateParticles();
      updateFireworks();
      if (clearTimer <= 0) {
        currentLevel++;
        if (currentLevel >= LEVELS.length) {
          // 最后一关走烟花大礼花表演
          startFireworkShow();
          gameState = STATE.WIN;
          // winScreen 延迟到烟花演完再显示
        } else if (LEVELS[currentLevel] && LEVELS[currentLevel].isEasterEgg) {
          // 下一关是彩蛋关：显示"恭喜发现彩蛋"界面，提供进入按钮
          gameState = STATE.EGG_REVEAL;
          showEggReveal();
        } else {
          showLevelIntro(currentLevel);
        }
      }
    } else if (gameState === STATE.WIN) {
      updateParticles();
      updateFireworks();
    } else if (gameState === STATE.EGG_REVEAL) {
      // 彩蛋揭示界面：静态，不更新游戏
      updateParticles();
    } else if (gameState === STATE.PLAYING && level && level.isEasterEgg && eggPhase === 'fireworks') {
      // 彩蛋关烟花表演期间：继续更新粒子和烟花
      updateParticles();
      updateFireworks();
    }
  }

  function updateGame() {
    try {
    // 1. 先检测压力板和按钮（基于上一帧位置）
    for (const pl of plates) {
      const wasPressed = pl.pressed;
      pl.check(players, boxes);
      if (pl.pressed && !wasPressed) SFX.playDing();
    }
    for (const b of buttons) {
      const wasActive = b.activated || b.pressed;
      b.check(players);
      const nowActive = b.activated || b.pressed;
      if (nowActive && !wasActive) SFX.playDing();
    }

    // 2. 计算触发映射
    computeTriggers();

    // 3. 更新门
    for (const d of doors) {
      const wasOpen = d.open;
      d.update(d._shouldOpen);
      if (d.open && !wasOpen) SFX.playDoor();
    }

    // 4. 更新移动平台
    for (const mp of movingPlatforms) mp.update(mp._shouldRun);

    // 4b. 更新切换平台
    for (const tp of togglePlatforms) tp.update(tp._shouldShow);

    // 4c. 更新尖刺
    for (const sp of spikes) sp.update(sp._shouldFreeze);

    // 5. 构建 solids 列表
    const staticSolids = platforms.concat(walls);
    const doorSolids = doors.filter(d => d.isSolid()).map(d => d.collideRect);
    const mpSolids = movingPlatforms.map(mp => ({ x: mp.x, y: mp.y, w: mp.w, h: mp.h }));
    const tpSolids = togglePlatforms.filter(tp => tp.isSolid).map(tp => ({ x: tp.x, y: tp.y, w: tp.w, h: tp.h }));
    const solids = staticSolids.concat(doorSolids).concat(mpSolids).concat(tpSolids);

    // 6. 更新箱子
    let needReset = false;
    for (const b of boxes) {
      if (b.update(solids, boxes, players)) {
        needReset = true;
      }
    }

    // 7. 更新玩家
    for (const p of players) {
      try {
        if (p.update(solids, boxes, players)) {
          needReset = true;
        }
      } catch (e) {
        console.error('Player update error (' + p.color + '):', e);
      }
    }

    // 7b. 尖刺碰撞检测（碰到即重置）
    for (const sp of spikes) {
      for (const p of players) {
        if (sp.collidesPlayer(p)) {
          needReset = true;
          break;
        }
      }
    }

    // 移动平台上的玩家跟随移动（简化处理：如果站在移动平台上，随平台移动）
    for (const p of players) {
      for (const mp of movingPlatforms) {
        if (p.onGround &&
            p.x + p.w > mp.x + 2 && p.x < mp.x + mp.w - 2 &&
            Math.abs((p.y + p.h) - mp.y) < 4) {
          p.x += mp.dx;
          // 垂直方向由碰撞处理
          if (mp.dy < 0) {
            p.y += mp.dy; // 平台上升，跟着升
          }
        }
      }
    }

    if (needReset) {
      showFailed();
      return;
    }

    // 8. 通关判定
    const blackInGoal = isPlayerInGoal('black');
    const whiteInGoal = isPlayerInGoal('white');
    const allIn = blackInGoal && whiteInGoal;

    if (allIn) {
      winHoldTime++;
      if (winHoldTime > 60) {
        triggerLevelClear();
      }
    } else {
      winHoldTime = 0;
    }

    // 彩蛋关特殊逻辑
    if (level.isEasterEgg && eggGoals.length > 0) {
      const blackInEgg = isPlayerInEggGoal('black');
      const whiteInEgg = isPlayerInEggGoal('white');
      const bothIn = blackInEgg && whiteInEgg;

      if (bothIn && !eggFireworkStarted && eggPhase !== 'ignite') {
        // 两人同时站上，开始燃烧引线
        if (!eggFuseBurning) {
          eggFuseBurning = true;
          eggPhase = 'fuse';
          SFX.playFuseSpark();
        }
        eggFuseProgress += 1 / 120; // 约2秒烧完
        if (eggFuseProgress >= 1) {
          eggFuseProgress = 1;
          eggPhase = 'ignite';     // 进入点火预热阶段
          eggIgniteTimer = 36;      // 约0.6秒喷焰预热后起飞
        }
      } else if (!bothIn && eggFuseBurning && !eggFireworkStarted && eggPhase !== 'ignite') {
        // 离开判定区，引线逐渐熄灭
        eggFuseProgress -= 1 / 180;
        if (eggFuseProgress <= 0) {
          eggFuseProgress = 0;
          eggFuseBurning = false;
          eggPhase = 'idle';
        }
      }
    }

    // 点火预热阶段：火箭喷焰但还没起飞
    if (level.isEasterEgg && eggPhase === 'ignite') {
      eggIgniteTimer--;
      if (eggIgniteTimer <= 0) {
        eggFireworkStarted = true;
        eggPhase = 'fireworks';
        startEasterFireworkShow();
      }
    }

    // 彩蛋关烟花表演期间：更新烟花（火箭上升、爆炸、粒子由updateParticles处理）
    if (level.isEasterEgg && eggPhase === 'fireworks') {
      updateFireworks();
    }

    updateParticles();
    } catch (e) {
      console.error('updateGame error:', e);
    }
  }

  function isPlayerInGoal(color) {
    for (const g of goals) {
      if (g.color !== color) continue;
      for (const p of players) {
        if (p.color === color && g.contains(p) && p.onGround) return true;
      }
    }
    return false;
  }

  function isPlayerInEggGoal(color) {
    for (const g of eggGoals) {
      if (g.color !== color) continue;
      for (const p of players) {
        if (p.color === color && g.contains(p)) return true;
      }
    }
    return false;
  }

  function showFailed() {
    gameState = STATE.FAILED;
    document.getElementById('failScreen').classList.remove('hidden');
    document.getElementById('failLevel').textContent =
      `第 ${currentLevel + 1} 关 · ${LEVELS[currentLevel].name}`;
  }

  function retryLevel() {
    document.getElementById('failScreen').classList.add('hidden');
    loadLevel(currentLevel);
    gameState = STATE.PLAYING;
  }

  function backToMenu() {
    document.getElementById('failScreen').classList.add('hidden');
    document.getElementById('winScreen').classList.add('hidden');
    document.getElementById('levelSelect').classList.add('hidden');
    document.getElementById('creditsScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
    SFX.stopBGM();
    gameState = STATE.MENU;
    updateMenuButtons();
  }

  function triggerLevelClear() {
    // 通关后解锁下一关
    if (currentLevel + 1 < LEVELS.length) {
      saveProgress(currentLevel + 1);
    }
    SFX.playClear();
    gameState = STATE.LEVEL_CLEAR;
    clearTimer = 120;
    for (const g of goals) {
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        particles.push({
          x: g.x + g.w / 2,
          y: g.y + g.h / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          life: 50 + Math.random() * 30,
          maxLife: 80,
          color: g.color === 'black' ? '#000' : '#fff',
          size: 2 + Math.random() * 3
        });
      }
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p.isFlash) {
        p.life--;
        if (p.life <= 0) particles.splice(i, 1);
        continue;
      }
      // 拖尾记录
      if (p.trail) {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();
      }
      p.x += p.vx;
      p.y += p.vy;
      p.vy += (p.gravity != null ? p.gravity : 0.15);
      // 空气阻力，让扩散更自然
      p.vx *= 0.99;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  // ============================================================
  // 烟花大礼花（最后一关通关后播放）
  // ============================================================
  const FW_COLORS = ['#ff6b6b', '#ffd93d', '#6bcB77', '#4d96ff', '#c56bff', '#ff8fb1', '#ff9f43', '#00d2d3', '#feca57', '#ff6b81'];

  function startFireworkShow() {
    fireworkPhase = 'show';
    fireworkTimer = 240; // 约4秒
    fireworks = [];
    // 先发射三枚
    for (let i = 0; i < 3; i++) {
      setTimeout(() => launchFirework(), i * 300);
    }
    // 后续继续补发
    let t = 900;
    for (let i = 0; i < 12; i++) {
      t += 180 + Math.random() * 200;
      setTimeout(() => {
        if (fireworkPhase === 'show') launchFirework();
      }, t);
    }
    // 压轴齐射
    setTimeout(() => {
      if (fireworkPhase === 'show') {
        for (let i = 0; i < 5; i++) launchFirework();
      }
    }, t + 200);
    // 结束显示胜利界面
    setTimeout(() => {
      fireworkPhase = 'done';
      document.getElementById('winScreen').classList.remove('hidden');
    }, t + 1200);
  }

  // 彩蛋关盛大烟花表演（约10秒）
  function startEasterFireworkShow() {
    fireworkPhase = 'show';
    fireworks = [];
    const grandColors = ['#ff3b3b', '#ff7b3b', '#ffb83b', '#ffe23b', '#8aff3b', '#3bff9d', '#3bf0ff', '#3b8bff', '#7b3bff', '#d13bff', '#ff3bd1', '#ff3b7b', '#ffd700', '#ff6b81'];
    const originalColors = FW_COLORS.slice();
    FW_COLORS.splice(0, FW_COLORS.length, ...grandColors);

    // 发射一枚指定的火箭
    const launchAt = (x, targetY, color, vyMul = 1) => {
      const vy = -(9 + Math.random() * 3) * vyMul;
      fireworks.push({
        type: 'rocket',
        x: x,
        y: H - 20,
        vy: vy,
        targetY: targetY,
        color: color || grandColors[Math.floor(Math.random() * grandColors.length)],
        trail: []
      });
      SFX.playFireworkLaunch();
    };

    // 批量随机发射
    const playBurst = (count, delayStart, delaySpread = 150) => {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          if (fireworkPhase === 'show') {
            launchAt(
              60 + Math.random() * (W - 120),
              60 + Math.random() * 280,
              grandColors[Math.floor(Math.random() * grandColors.length)]
            );
          }
        }, delayStart + i * delaySpread);
      }
    };

    // ---- 开场：2枚预热，一左一右 ----
    setTimeout(() => { if (fireworkPhase === 'show') launchAt(250, 180, grandColors[0]); }, 200);
    setTimeout(() => { if (fireworkPhase === 'show') launchAt(W - 250, 160, grandColors[5]); }, 800);

    // ---- 第一轮：6枚快速连发（1.2s起） ----
    playBurst(6, 1200, 220);

    // ---- 第二轮：不同高度错落（3s起，10枚分布在不同高度） ----
    setTimeout(() => {
      if (fireworkPhase !== 'show') return;
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          if (fireworkPhase !== 'show') return;
          const x = 80 + Math.random() * (W - 160);
          const ty = 50 + Math.random() * 300;
          const c = grandColors[Math.floor(Math.random() * grandColors.length)];
          launchAt(x, ty, c);
        }, i * 160);
      }
    }, 3000);

    // ---- 第三轮：两侧扇形对射（4.8s起） ----
    setTimeout(() => {
      if (fireworkPhase !== 'show') return;
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          if (fireworkPhase !== 'show') return;
          // 左排
          launchAt(120 + i * 40, 100 + Math.random() * 100, grandColors[i % grandColors.length], 1.05);
          // 右排
          launchAt(W - 120 - i * 40, 90 + Math.random() * 110, grandColors[(i + 5) % grandColors.length], 1.05);
        }, i * 110);
      }
    }, 4800);

    // ---- 第四轮：环形包围式齐射（6.5s起，8枚分布在屏幕各处同时爆炸） ----
    setTimeout(() => {
      if (fireworkPhase !== 'show') return;
      const ring = [
        { x: 150, ty: 200 }, { x: 350, ty: 100 }, { x: 550, ty: 140 },
        { x: W/2, ty: 70 },
        { x: W - 550, ty: 140 }, { x: W - 350, ty: 100 }, { x: W - 150, ty: 200 },
        { x: 250, ty: 300 }, { x: W - 250, ty: 300 },
      ];
      for (let i = 0; i < ring.length; i++) {
        const r = ring[i];
        // 不同速度让它们差不多同时到达目标高度
        const travel = H - 20 - r.ty;
        const vy = -(travel / 55 + Math.random() * 1); // 约55帧到达
        const c = grandColors[i % grandColors.length];
        fireworks.push({
          type: 'rocket', x: r.x, y: H - 20,
          vy: vy, targetY: r.ty, color: c, trail: []
        });
        SFX.playFireworkLaunch();
      }
    }, 6500);

    // ---- 压轴第一波：15枚全屏齐射（8s） ----
    setTimeout(() => {
      if (fireworkPhase !== 'show') return;
      for (let i = 0; i < 15; i++) {
        const x = 50 + (i / 14) * (W - 100) + (Math.random() - 0.5) * 30;
        const ty = 50 + Math.random() * 280;
        const travel = H - 20 - ty;
        const vy = -(travel / 50 + Math.random() * 1);
        const c = grandColors[Math.floor(Math.random() * grandColors.length)];
        fireworks.push({
          type: 'rocket', x: x, y: H - 20,
          vy: vy, targetY: ty, color: c, trail: []
        });
        SFX.playFireworkLaunch();
      }
    }, 8000);

    // ---- 压轴第二波：20枚超大全屏绽放（9s，最大的一波） ----
    setTimeout(() => {
      if (fireworkPhase !== 'show') return;
      for (let i = 0; i < 20; i++) {
        const x = 40 + Math.random() * (W - 80);
        const ty = 40 + Math.random() * 320;
        const c = grandColors[Math.floor(Math.random() * grandColors.length)];
        // 延迟一小段时间错开爆炸，更有节奏感
        setTimeout(() => {
          if (fireworkPhase !== 'show') return;
          launchAt(x, ty, c, 1.1);
        }, i * 40);
      }
    }, 9000);

    // 结束：显示制作人员名单
    setTimeout(() => {
      fireworkPhase = 'done';
      eggPhase = 'credits';
      showCredits();
      FW_COLORS.splice(0, FW_COLORS.length, ...originalColors);
    }, 12000);
  }

  // 显示彩蛋揭示界面
  function showEggReveal() {
    gameState = STATE.EGG_REVEAL;
    // 先保存彩蛋关解锁进度
    saveProgress(LEVELS.length - 1);
    document.getElementById('eggRevealScreen').classList.remove('hidden');
    SFX.playClear();
  }

  // 显示制作人员名单（滚动动画）
  function showCredits() {
    const screen = document.getElementById('creditsScreen');
    const content = document.getElementById('creditsContent');
    const bottomArea = document.getElementById('creditsBottomArea');
    screen.classList.remove('hidden');
    // 重置位置
    content.style.top = '100%';
    bottomArea.style.opacity = '0';
    // 2秒后开始滚动，总滚动约12秒
    setTimeout(() => {
      content.style.transition = 'top 14s linear';
      // 计算需要滚到的位置：让内容底部停在屏幕中间偏上
      const containerHeight = screen.clientHeight;
      const contentHeight = content.scrollHeight;
      const targetTop = containerHeight / 2 - contentHeight + 100;
      content.style.top = targetTop + 'px';
      // 滚动结束后显示返回按钮
      setTimeout(() => {
        bottomArea.style.opacity = '1';
      }, 13500);
    }, 1500);
  }

  function launchFirework() {
    SFX.playFireworkLaunch();
    const startX = 80 + Math.random() * (W - 160);
    const targetY = 100 + Math.random() * 200;
    const color = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];
    fireworks.push({
      type: 'rocket',
      x: startX,
      y: H - 20,
      vy: -(9 + Math.random() * 3),
      targetY: targetY,
      color: color,
      trail: []
    });
  }

  function explodeFirework(fw) {
    SFX.playFireworkBoom();
    const count = 100 + Math.floor(Math.random() * 80);
    const baseColor = fw.color;
    // 搭配色：同一色系的亮色 + 白色高光
    const accentColors = [baseColor, '#ffffff', '#fff3a0', '#ffd080'];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 3 + Math.random() * 5; // 更大扩散速度
      const col = i % 7 === 0 ? '#ffffff' : (i % 5 === 0 ? accentColors[2 + (i % 2)] : baseColor);
      particles.push({
        x: fw.x,
        y: fw.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 55 + Math.random() * 35,
        maxLife: 90,
        color: col,
        size: 3 + Math.random() * 3.5, // 更大粒子
        gravity: 0.06,
        trail: [] // 粒子拖尾
      });
    }
    // 爆炸闪光：生成一个短暂的大光点
    particles.push({
      x: fw.x,
      y: fw.y,
      vx: 0, vy: 0,
      life: 10,
      maxLife: 10,
      color: '#ffffff',
      size: 60,
      gravity: 0,
      isFlash: true
    });
  }

  function updateFireworks() {
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const f = fireworks[i];
      if (f.type === 'rocket') {
        f.y += f.vy;
        f.vy += 0.06;
        // 尾迹
        f.trail.push({ x: f.x, y: f.y, life: 12 });
        if (f.trail.length > 8) f.trail.shift();
        if (f.y <= f.targetY || f.vy >= 0) {
          explodeFirework(f);
          fireworks.splice(i, 1);
        }
      }
    }
    // 尾迹life递减（这里不画，仅维护）
  }

  function drawFireworks(ctx) {
    for (const f of fireworks) {
      if (f.type === 'rocket') {
        // ---- 火箭喷焰尾迹（明亮渐变拖尾） ----
        for (let i = 0; i < f.trail.length; i++) {
          const t = f.trail[i];
          const progress = (i + 1) / f.trail.length;
          const a = progress * 0.7;
          const w = 3 + progress * 4;
          const grad = ctx.createLinearGradient(t.x - w, 0, t.x + w, 0);
          grad.addColorStop(0, `rgba(255,180,50,0)`);
          grad.addColorStop(0.5, `rgba(255,220,120,${a})`);
          grad.addColorStop(1, `rgba(255,180,50,0)`);
          ctx.fillStyle = grad;
          ctx.fillRect(t.x - w, t.y, w * 2, 3 + progress * 3);
        }
        // ---- 火箭本体（尖头朝上的小火箭） ----
        const bw = 5;   // body half width
        const bl = 14;  // body length
        const noseL = 7; // 尖头长度
        ctx.save();
        ctx.translate(f.x, f.y);
        // 尾翼
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.moveTo(-bw, bl - 4);
        ctx.lineTo(-bw - 4, bl + 2);
        ctx.lineTo(-bw, bl + 2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(bw, bl - 4);
        ctx.lineTo(bw + 4, bl + 2);
        ctx.lineTo(bw, bl + 2);
        ctx.closePath();
        ctx.fill();
        // 身体
        ctx.fillStyle = f.color;
        ctx.fillRect(-bw, -noseL, bw * 2, bl + noseL);
        // 身体金色环
        ctx.fillStyle = '#ffd93d';
        ctx.fillRect(-bw, -noseL + 4, bw * 2, 1.5);
        ctx.fillRect(-bw, bl - 4, bw * 2, 1.5);
        // 尖头（锥形）
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.moveTo(0, -noseL - 4);
        ctx.lineTo(bw, -noseL);
        ctx.lineTo(-bw, -noseL);
        ctx.closePath();
        ctx.fill();
        // 尖头高光
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.moveTo(0, -noseL - 4);
        ctx.lineTo(1.5, -noseL + 1);
        ctx.lineTo(-1.5, -noseL + 1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        // 底部喷焰（动态闪烁）
        const flicker = 0.8 + Math.random() * 0.4;
        const flameLen = 14 * flicker;
        const flameGrad = ctx.createLinearGradient(f.x, f.y + bl, f.x, f.y + bl + flameLen);
        flameGrad.addColorStop(0, 'rgba(255,255,200,0.95)');
        flameGrad.addColorStop(0.4, 'rgba(255,180,60,0.85)');
        flameGrad.addColorStop(1, 'rgba(255,80,20,0)');
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(f.x - 4, f.y + bl);
        ctx.quadraticCurveTo(f.x, f.y + bl + flameLen, f.x + 4, f.y + bl);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  // 彩蛋关元素绘制
  function drawEasterEggElements(ctx) {
    // 1. 绘制eggGoals（传送门判定区）
    for (const g of eggGoals) {
      const active = g.color === 'black' ? isPlayerInEggGoal('black') : isPlayerInEggGoal('white');
      ctx.save();
      const alpha = active ? 0.5 : 0.15;
      const fill = g.color === 'black'
        ? `rgba(40,40,60,${alpha})`
        : `rgba(220,220,255,${alpha})`;
      ctx.fillStyle = fill;
      // 画传送门效果：圆角矩形 + 发光
      ctx.beginPath();
      const r = 12;
      ctx.moveTo(g.x + r, g.y);
      ctx.lineTo(g.x + g.w - r, g.y);
      ctx.quadraticCurveTo(g.x + g.w, g.y, g.x + g.w, g.y + r);
      ctx.lineTo(g.x + g.w, g.y + g.h - r);
      ctx.quadraticCurveTo(g.x + g.w, g.y + g.h, g.x + g.w - r, g.y + g.h);
      ctx.lineTo(g.x + r, g.y + g.h);
      ctx.quadraticCurveTo(g.x, g.y + g.h, g.x, g.y + g.h - r);
      ctx.lineTo(g.x, g.y + r);
      ctx.quadraticCurveTo(g.x, g.y, g.x + r, g.y);
      ctx.closePath();
      ctx.fill();
      if (active) {
        ctx.strokeStyle = g.color === 'black' ? '#a0a0ff' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        // 光芒
        ctx.shadowColor = g.color === 'black' ? '#8080ff' : '#ffffff';
        ctx.shadowBlur = 20;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. 绘制烟花火箭装置（地上的小火箭，尖头朝上）
    if (fireworkDevice) {
      const fw = fireworkDevice;
      const cx = fw.x + fw.w / 2;
      const topY = fw.y;          // 火箭顶端（尖头）
      const bottomY = fw.y + fw.h; // 火箭底部
      const bodyTop = fw.y + fw.h * 0.35; // 尖头底部 = 身体顶部
      const bodyW = fw.w * 0.55;
      const bodyLeft = cx - bodyW / 2;
      const bodyRight = cx + bodyW / 2;

      ctx.save();

      // ---- 发射台（小矮座） ----
      ctx.fillStyle = '#3a2a15';
      ctx.fillRect(fw.x - 8, bottomY - 6, fw.w + 16, 6);
      ctx.fillStyle = '#5a3a1a';
      ctx.fillRect(fw.x - 4, bottomY - 10, fw.w + 8, 4);

      // ---- 火箭尾翼（底部两侧三角形） ----
      const finH = fw.h * 0.28;
      const finTop = bottomY - finH;
      ctx.fillStyle = '#c0392b';
      // 左尾翼
      ctx.beginPath();
      ctx.moveTo(bodyLeft, finTop + 2);
      ctx.lineTo(bodyLeft - fw.w * 0.32, bottomY - 4);
      ctx.lineTo(bodyLeft, bottomY - 4);
      ctx.closePath();
      ctx.fill();
      // 右尾翼
      ctx.beginPath();
      ctx.moveTo(bodyRight, finTop + 2);
      ctx.lineTo(bodyRight + fw.w * 0.32, bottomY - 4);
      ctx.lineTo(bodyRight, bottomY - 4);
      ctx.closePath();
      ctx.fill();
      // 尾翼金边
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bodyLeft, finTop + 2);
      ctx.lineTo(bodyLeft - fw.w * 0.32, bottomY - 4);
      ctx.moveTo(bodyRight, finTop + 2);
      ctx.lineTo(bodyRight + fw.w * 0.32, bottomY - 4);
      ctx.stroke();

      // ---- 火箭身体（圆柱体，红底金纹） ----
      const bodyGrad = ctx.createLinearGradient(bodyLeft, 0, bodyRight, 0);
      bodyGrad.addColorStop(0, '#a93226');
      bodyGrad.addColorStop(0.5, '#e74c3c');
      bodyGrad.addColorStop(1, '#a93226');
      ctx.fillStyle = bodyGrad;
      ctx.fillRect(bodyLeft, bodyTop, bodyW, bottomY - bodyTop - 4);

      // 身体金色装饰环（上下各一条）
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(bodyLeft, bodyTop + 3, bodyW, 2);
      ctx.fillRect(bodyLeft, bottomY - 12, bodyW, 2);

      // 身体中间星形/圆形装饰
      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.arc(cx, bodyTop + (bottomY - bodyTop) / 2 - 2, 3, 0, Math.PI * 2);
      ctx.fill();

      // ---- 火箭尖头（弹头，锥形，红金渐变） ----
      const noseGrad = ctx.createLinearGradient(bodyLeft, topY, bodyRight, topY);
      noseGrad.addColorStop(0, '#c0392b');
      noseGrad.addColorStop(0.5, '#ff6b5a');
      noseGrad.addColorStop(1, '#c0392b');
      ctx.fillStyle = noseGrad;
      ctx.beginPath();
      ctx.moveTo(cx, topY);
      ctx.lineTo(bodyRight, bodyTop);
      ctx.lineTo(bodyLeft, bodyTop);
      ctx.closePath();
      ctx.fill();

      // 尖头金色尖端高光
      ctx.fillStyle = '#f39c12';
      ctx.beginPath();
      ctx.moveTo(cx, topY);
      ctx.lineTo(cx + 2, bodyTop - 8);
      ctx.lineTo(cx - 2, bodyTop - 8);
      ctx.closePath();
      ctx.fill();

      // ---- 底部喷焰口（深色） ----
      ctx.fillStyle = '#1a0a00';
      ctx.fillRect(bodyLeft + 2, bottomY - 6, bodyW - 4, 4);

      // ---- 点燃后 / 发射前喷焰效果 ----
      if (eggFireworkStarted || eggFuseBurning || eggPhase === 'ignite') {
        const isIgnite = eggPhase === 'ignite';
        const flicker = isIgnite ? 0.9 + Math.random() * 0.3 : 0.7 + Math.random() * 0.5;
        const flameH = isIgnite ? 22 * flicker : 12 * flicker;
        // 外焰（橙红）
        const flameGrad = ctx.createLinearGradient(cx, bottomY, cx, bottomY + flameH);
        flameGrad.addColorStop(0, 'rgba(255,230,130,0.95)');
        flameGrad.addColorStop(0.4, 'rgba(255,150,40,0.85)');
        flameGrad.addColorStop(1, 'rgba(255,60,20,0)');
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(bodyLeft + 1, bottomY - 2);
        ctx.quadraticCurveTo(cx, bottomY + flameH, bodyRight - 1, bottomY - 2);
        ctx.closePath();
        ctx.fill();
        // 内焰（亮白）
        ctx.fillStyle = `rgba(255,255,230,${isIgnite ? 0.95 * flicker : 0.85 * flicker})`;
        ctx.beginPath();
        ctx.moveTo(bodyLeft + 5, bottomY - 2);
        ctx.quadraticCurveTo(cx, bottomY + flameH * (isIgnite ? 0.6 : 0.55), bodyRight - 5, bottomY - 2);
        ctx.closePath();
        ctx.fill();
        // 火星粒子（发射前/点火时效果更明显）
        const sparkCount = isIgnite ? 8 : (eggFuseProgress > 0.85 ? 4 : 2);
        for (let i = 0; i < sparkCount; i++) {
          const sx = cx + (Math.random() - 0.5) * (isIgnite ? 18 : 12);
          const sy = bottomY + 2 + Math.random() * (isIgnite ? 28 : 16);
          const sa = 0.4 + Math.random() * 0.5;
          const isSpark = Math.random() > 0.5;
          ctx.fillStyle = isSpark
            ? `rgba(255,230,100,${sa})`
            : `rgba(200,200,200,${sa * 0.7})`;
          ctx.beginPath();
          ctx.arc(sx, sy, isSpark ? 1.5 : 2 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    // 3. 绘制引线（从判定区连到烟花装置）
    if (fireworkDevice && eggGoals.length >= 2) {
      const g0 = eggGoals[0];
      const g1 = eggGoals[1];
      // 起点：两个判定区中间上方
      const startX = (g0.x + g0.w + g1.x) / 2;
      const startY = g0.y + 10;
      // 终点：火箭底部（引线接入点）
      const endX = fireworkDevice.x + fireworkDevice.w / 2;
      const endY = fireworkDevice.y + fireworkDevice.h - 4;

      // 引线路径：先向上弯曲，再水平到烟花
      const midY = Math.min(startY, endY) - 30;

      ctx.save();
      // 引线本身
      ctx.strokeStyle = '#8b6914';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo((startX + endX) / 2, midY, endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 燃烧中的火花
      if (eggFuseBurning && eggFuseProgress > 0) {
        // 计算火花位置：从起点沿路径向终点推进
        const t = Math.min(1, eggFuseProgress);
        // 二次贝塞尔曲线点公式
        const sparkX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ((startX + endX) / 2) + t * t * endX;
        const sparkY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;

        // 火花本体
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
        ctx.fill();

        // 发光
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(255,200,0,0.6)';
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 6, 0, Math.PI * 2);
        ctx.fill();

        // 已燃部分（亮色）
        ctx.strokeStyle = 'rgba(255,200,100,0.8)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        // 用分段近似绘制已燃部分
        const steps = 20;
        for (let i = 1; i <= Math.floor(steps * t); i++) {
          const st = i / steps;
          const sx = (1 - st) * (1 - st) * startX + 2 * (1 - st) * st * ((startX + endX) / 2) + st * st * endX;
          const sy = (1 - st) * (1 - st) * startY + 2 * (1 - st) * st * midY + st * st * endY;
          ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // ============================================================
  // 渲染
  // ============================================================
  function render() {
    const isEgg = level && level.isEasterEgg;
    if (isEgg) {
      drawStarryBackground(ctx, performance.now());
    } else {
      const stops = level ? BG_GRADIENTS[currentLevel] || BG_GRADIENTS[0] : MENU_GRADIENT;
      ctx.fillStyle = buildGradient(stops);
      ctx.fillRect(0, 0, W, H);
    }

    if (!level) return;

    // 背景装饰：极简水平线，暗示地平线（彩蛋关星空背景不需要）
    if (!isEgg) {
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      ctx.fillRect(0, H / 2, W, 1);
    }

    // 墙
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    for (const w of walls) {
      ctx.fillRect(w.x, w.y, w.w, w.h);
    }

    // 平台
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    for (const p of platforms) {
      ctx.fillRect(p.x, p.y, p.w, p.h);
    }
    // 平台顶部高光
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for (const p of platforms) {
      ctx.fillRect(p.x, p.y, p.w, 2);
    }

    // 移动平台
    for (const mp of movingPlatforms) mp.draw(ctx);

    // 切换平台
    for (const tp of togglePlatforms) tp.draw(ctx);

    // 压力板
    for (const pl of plates) pl.draw(ctx);

    // 按钮
    for (const b of buttons) b.draw(ctx);

    // 门
    for (const d of doors) d.draw(ctx);

    // 箱子
    for (const b of boxes) b.draw(ctx);

    // 尖刺
    for (const sp of spikes) sp.draw(ctx);

    // 通关判定区
    for (const g of goals) {
      const active = g.color === 'black' ? isPlayerInGoal('black') : isPlayerInGoal('white');
      g.draw(ctx, active);
    }

    // 彩蛋关：绘制引线、烟花装置、eggGoals
    if (level.isEasterEgg) {
      drawEasterEggElements(ctx);
    }

    // 玩家
    for (const p of players) p.draw(ctx);

    // 粒子
    for (const p of particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      if (p.isFlash) {
        // 爆炸闪光：径向渐变的大光球
        const r = p.size * (1 + (1 - alpha) * 0.5);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);
        grad.addColorStop(0.3, `rgba(255,240,180,${alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(255,200,80,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      // 普通粒子拖尾
      if (p.trail && p.trail.length > 1) {
        for (let ti = 0; ti < p.trail.length; ti++) {
          const t = p.trail[ti];
          const ta = alpha * (ti / p.trail.length) * 0.6;
          const ts = p.size * (0.3 + ti / p.trail.length * 0.7);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = ta;
          ctx.beginPath();
          ctx.arc(t.x, t.y, ts / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 粒子本体（圆形 + 发光）
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;

    // 烟花（最后一关大礼花）
    drawFireworks(ctx);

    // 通关进度条
    if (winHoldTime > 0 && gameState === STATE.PLAYING) {
      const barW = 160;
      const barH = 3;
      const x = W / 2 - barW / 2;
      const y = 70;
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(x, y, barW, barH);
      const progress = Math.min(1, winHoldTime / 60);
      const grad = ctx.createLinearGradient(x, y, x + barW, y);
      grad.addColorStop(0, '#000');
      grad.addColorStop(1, '#fff');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barW * progress, barH);
    }

    // 关卡通关动画
    if (gameState === STATE.LEVEL_CLEAR) {
      const t = 1 - clearTimer / 120;
      const fadeIn = Math.min(1, t * 3);
      ctx.fillStyle = `rgba(255,255,255,${0.25 * fadeIn})`;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = `rgba(0,0,0,${fadeIn})`;
      ctx.font = '200 56px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('通关', W / 2, H / 2 - 10);
      ctx.font = '300 18px sans-serif';
      ctx.fillStyle = `rgba(0,0,0,${fadeIn * 0.6})`;
      ctx.fillText(level.name, W / 2, H / 2 + 30);
    }
  }

  // ============================================================
  // 主循环
  // ============================================================
  let running = false;
  let rafId = null;

  function loop() {
    if (!running) return;
    update();
    render();
    rafId = requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    } else {
      if (gameState === STATE.PLAYING || gameState === STATE.LEVEL_CLEAR || gameState === STATE.LEVEL_INTRO) {
        running = true;
        loop();
      }
    }
  });

  // ============================================================
  // 关卡过渡
  // ============================================================
  function showLevelIntro(idx) {
    loadLevel(idx);
    // 让按钮失去焦点，避免按键被焦点元素拦截
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    gameState = STATE.LEVEL_INTRO;
    introTimer = 160;
    const banner = document.getElementById('levelBanner');
    document.getElementById('bannerNum').textContent = `第 ${idx + 1} 关`;
    document.getElementById('bannerName').textContent = LEVELS[idx].name;
    document.getElementById('bannerDesc').textContent = LEVELS[idx].desc;
    banner.classList.remove('hidden');

    if (!running) {
      running = true;
      loop();
    }
  }

  // ============================================================
  // 启动
  // ============================================================
  const isThumbnail = new URLSearchParams(window.location.search).has('thumbnail');

  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('continueBtn').addEventListener('click', () => {
    const unlocked = getUnlockedLevel();
    document.getElementById('startScreen').classList.add('hidden');
    currentLevel = unlocked;
    SFX.init();
    SFX.startBGM();
    showLevelIntro(currentLevel);
  });
  document.getElementById('selectBtn').addEventListener('click', showLevelSelect);
  document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('levelSelect').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
    updateMenuButtons();
  });
  document.getElementById('replayBtn').addEventListener('click', () => {
    document.getElementById('winScreen').classList.add('hidden');
    currentLevel = 0;
    SFX.init();
    SFX.startBGM();
    showLevelIntro(0);
  });
  document.getElementById('retryBtn2').addEventListener('click', retryLevel);
  document.getElementById('backMenuBtn').addEventListener('click', backToMenu);
  document.getElementById('creditsMenuBtn').addEventListener('click', () => {
    document.getElementById('creditsScreen').classList.add('hidden');
    backToMenu();
  });
  document.getElementById('enterEggBtn').addEventListener('click', () => {
    document.getElementById('eggRevealScreen').classList.add('hidden');
    currentLevel = LEVELS.length - 1; // 彩蛋关是最后一关
    saveProgress(currentLevel);
    SFX.init();
    SFX.startBGM();
    showLevelIntro(currentLevel);
  });
  document.getElementById('eggMenuBtn').addEventListener('click', () => {
    document.getElementById('eggRevealScreen').classList.add('hidden');
    // 彩蛋关标记为已解锁
    saveProgress(LEVELS.length - 1);
    backToMenu();
  });
  document.getElementById('muteBtn').addEventListener('click', () => {
    SFX.init();
    SFX.toggleMute();
  });

  function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    currentLevel = 0;
    saveProgress(0);
    SFX.init();
    SFX.startBGM();
    showLevelIntro(0);
  }

  function updateMenuButtons() {
    const unlocked = getUnlockedLevel();
    const continueBtn = document.getElementById('continueBtn');
    if (unlocked > 0) {
      continueBtn.style.display = '';
      continueBtn.textContent = `继续游戏（第 ${unlocked + 1} 关）`;
    } else {
      continueBtn.style.display = 'none';
    }
  }

  function showLevelSelect() {
    document.getElementById('startScreen').classList.add('hidden');
    const grid = document.getElementById('levelGrid');
    const unlocked = getUnlockedLevel();
    grid.innerHTML = '';
    for (let i = 0; i < LEVELS.length; i++) {
      const cell = document.createElement('div');
      const isUnlocked = i <= unlocked;
      cell.style.cssText = `
        width: 120px; height: 120px;
        background: ${isUnlocked ? '#fff' : '#333'};
        color: ${isUnlocked ? '#000' : '#666'};
        cursor: ${isUnlocked ? 'pointer' : 'not-allowed'};
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        transition: all 0.2s ease;
        border: 1px solid ${isUnlocked ? 'transparent' : '#444'};
      `;
      cell.innerHTML = `
        <div style="font-size:28px;font-weight:200;letter-spacing:2px;">${isUnlocked ? i + 1 : '·'}</div>
        <div style="font-size:11px;margin-top:8px;letter-spacing:2px;opacity:0.6;">${LEVELS[i].name}</div>
        ${!isUnlocked ? '<div style="font-size:10px;margin-top:6px;opacity:0.4;letter-spacing:1px;">未解锁</div>' : ''}
      `;
      if (isUnlocked) {
        cell.addEventListener('mouseenter', () => {
          cell.style.transform = 'translateY(-3px)';
          cell.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
        });
        cell.addEventListener('mouseleave', () => {
          cell.style.transform = 'translateY(0)';
          cell.style.boxShadow = 'none';
        });
        cell.addEventListener('click', () => {
          document.getElementById('levelSelect').classList.add('hidden');
          currentLevel = i;
          SFX.init();
          SFX.startBGM();
          showLevelIntro(i);
        });
      }
      grid.appendChild(cell);
    }
    document.getElementById('levelSelect').classList.remove('hidden');
  }

  // 初始状态：渲染菜单背景 + 更新按钮
  loadLevel(0);
  render();
  updateMenuButtons();
  if (isThumbnail) {
    running = false;
  }
  // ==========================================
  // 下载离线版：把整页代码内联成单文件 HTML
  // ==========================================
  function buildStandaloneHTML() {
    // 1. 收集所有样式（<style> 标签）
    let stylesHTML = '';
    document.querySelectorAll('style').forEach(s => {
      stylesHTML += '<style>\n' + s.textContent + '\n</style>\n';
    });

    // 2. 收集所有内联脚本
    let inlineScriptsHTML = '';
    document.querySelectorAll('script').forEach(s => {
      if (!s.src && s.textContent && s.textContent.trim().length > 0) {
        inlineScriptsHTML += '<script>\n' + s.textContent + '\n</' + 'script>\n';
      }
    });

    // 3. 外部脚本（game.js）：优先用内嵌的源码缓存，避免 file:// 下 XHR 跨域失败
    //    兼容线上环境：缓存为空时再尝试 XHR
    let gameSource = '';
    if (typeof __GAME_SOURCE__ !== 'undefined' && __GAME_SOURCE__) {
      gameSource = __GAME_SOURCE__;
    } else {
      const scripts = Array.from(document.querySelectorAll('script')).filter(s => s.src && s.src.length > 0);
      for (const s of scripts) {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', s.src, false);
          xhr.send(null);
          if (xhr.status === 200 || xhr.status === 0) {
            gameSource += xhr.responseText + '\n';
          }
        } catch(e) {
          console.warn('下载离线版：脚本拉取失败', s.src, e);
        }
      }
    }
    const gameScriptHTML = '<script>\n' + gameSource + '\n</' + 'script>\n';

    // 4. 组装完整 HTML
    // doctype + html + head(meta,title,styles) + body(所有DOM元素) + scripts
    const headMeta = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="creative-medium" content="mini-game" />
<title>双生同行 — 双人合作解谜</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23111'/><circle cx='11' cy='16' r='5' fill='%23fff'/><circle cx='21' cy='16' r='5' fill='%23222' stroke='%23fff' stroke-width='1.5'/></svg>">
`;

    // body 内容：复制 game-wrap 里的所有 DOM
    const bodyInner = document.getElementById('game-wrap').outerHTML;

    const fullHTML = headMeta + stylesHTML + '</head>\n<body>\n' + bodyInner + '\n' + gameScriptHTML + inlineScriptsHTML + '</body>\n</html>';
    return fullHTML;
  }

  function triggerDownload(filename, content) {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const originalText = downloadBtn.textContent;
      downloadBtn.textContent = '打包中...';
      downloadBtn.disabled = true;
      // 给UI一帧喘息时间
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            const html = buildStandaloneHTML();
            triggerDownload('双生同行-双人合作解谜.html', html);
            downloadBtn.textContent = '✓ 下载成功！';
            setTimeout(() => {
              downloadBtn.textContent = originalText;
              downloadBtn.disabled = false;
            }, 1500);
          } catch(e) {
            console.error('下载离线版失败:', e);
            downloadBtn.textContent = '下载失败，请重试';
            setTimeout(() => {
              downloadBtn.textContent = originalText;
              downloadBtn.disabled = false;
            }, 2000);
          }
        }, 100);
      });
    });
  }

  // 主循环在 startGame / showLevelIntro 中启动

})();
