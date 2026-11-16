/**
 * Romantic Date Invitation - Interactive Logic
 * Features:
 * - Floating background heart/sparkle particle system
 * - Web Audio API synthesized romantic lullaby & celebration fanfare
 * - Typing effect for romantic subheading
 * - Evasive "NO" button with shrink, flee, and quote popup mechanics
 * - Expanding "YES" button & progressive Love Meter
 * - Full-screen fireworks & confetti celebration overlay
 */

(function () {
  'use strict';

  // =========================================================================
  // DOM Elements
  // =========================================================================
  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;

  const celebrationOverlay = document.getElementById('celebration-overlay');
  const celebrationCanvas = document.getElementById('celebration-canvas');
  const celebCtx = celebrationCanvas ? celebrationCanvas.getContext('2d') : null;

  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const buttonsArea = document.getElementById('buttons-area');

  const teaseBubble = document.getElementById('tease-bubble');
  const teaseText = document.getElementById('tease-text');

  const meterFill = document.getElementById('meter-fill');
  const meterPercentage = document.getElementById('meter-percentage');
  const meterHint = document.getElementById('meter-hint');

  const typingTextEl = document.getElementById('typing-text');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicStatus = document.getElementById('music-status');

  const replayCelebrationBtn = document.getElementById('replay-celebration-btn');
  const shareNoteBtn = document.getElementById('share-note-btn');
  const copyToast = document.getElementById('copy-toast');

  // =========================================================================
  // State Variables
  // =========================================================================
  let noAttempts = 0;
  let noScale = 1.0;
  let yesScale = 1.0;
  let loveLevel = 15; // Starting love meter %

  const cuteQuotes = [
    { text: "Are you sure? 🥺", icon: "🥺" },
    { text: "Think again ❤️", icon: "🤔" },
    { text: "Pretty please? 💕", icon: "🌸" },
    { text: "I'll bring snacks 🍫", icon: "🍩" },
    { text: "You know you want to 😘", icon: "😉" },
    { text: "Look how big YES is! ✨", icon: "👀" },
    { text: "Free hugs included forever 🧸", icon: "🥰" },
    { text: "There is no escape from love! 💖", icon: "🪄" }
  ];

  const loveHints = [
    "Every time you resist, my love only grows stronger!",
    "Love level rising rapidly! 🚀",
    "Resistance is futile, sweetie! 🥰",
    "Destiny is pulling you towards YES! ✨",
    "99.9% Soulmate synchronization! 💖",
    "MAXIMUM LOVE OVERLOAD REACHED! 💘"
  ];

  // =========================================================================
  // 1. Typing Animation for Subheading
  // =========================================================================
  const romanticQuote = "You make every day special, and I'd love to spend one more with you.";
  let quoteIndex = 0;

  function typeWriter() {
    if (!typingTextEl) return;
    if (quoteIndex < romanticQuote.length) {
      typingTextEl.textContent += romanticQuote.charAt(quoteIndex);
      quoteIndex++;
      setTimeout(typeWriter, 38 + Math.random() * 20);
    }
  }

  // =========================================================================
  // 2. Web Audio API - Synthesized Music Box & Fanfare (Offline & Seamless)
  // =========================================================================
  let audioCtx = null;
  let isPlayingMusic = false;
  let melodyTimer = null;
  let noteIndex = 0;

  // Romantic Pentatonic Music Box Notes (Frequencies in Hz)
  const lullabyNotes = [
    523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
    880.00, 783.99, 659.25, 523.25, // A5, G5, E5, C5
    587.33, 659.25, 783.99, 880.00, // D5, E5, G5, A5
    659.25, 523.25, 587.33, 523.25  // E5, C5, D5, C5
  ];

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Play a gentle music box bell chime
  function playMusicBoxNote(freq, duration = 1.2, volume = 0.08) {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sine wave with soft harmonic
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Envelope: gentle bell strike with decaying ring
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio playback safety catch
    }
  }

  function startMelodyLoop() {
    if (!isPlayingMusic) return;
    const currentNote = lullabyNotes[noteIndex % lullabyNotes.length];
    playMusicBoxNote(currentNote, 1.4, 0.07);
    noteIndex++;
    melodyTimer = setTimeout(startMelodyLoop, 580);
  }

  function toggleMusic() {
    getAudioContext();
    isPlayingMusic = !isPlayingMusic;

    if (isPlayingMusic) {
      musicStatus.textContent = 'ON';
      musicToggleBtn.classList.add('music-playing');
      startMelodyLoop();
    } else {
      musicStatus.textContent = 'OFF';
      musicToggleBtn.classList.remove('music-playing');
      clearTimeout(melodyTimer);
    }
  }

  // Sweet celebratory fanfare chime when YES is clicked
  function playCelebrationFanfare() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const fanfareNotes = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.18 },
      { f: 1046.50, d: 0.5 },
      { f: 1318.51, d: 0.8 }
    ];

    let delay = 0;
    fanfareNotes.forEach((n) => {
      setTimeout(() => {
        playMusicBoxNote(n.f, n.d + 0.6, 0.15);
      }, delay * 1000);
      delay += n.d;
    });
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', toggleMusic);
  }

  // =========================================================================
  // 3. Floating Ambient Particles (Hearts & Sparkles)
  // =========================================================================
  let bgParticles = [];
  const MAX_BG_PARTICLES = 36;

  function resizeBgCanvas() {
    if (!bgCanvas) return;
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeBgCanvas);
  resizeBgCanvas();

  class AmbientParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * (bgCanvas ? bgCanvas.width : window.innerWidth);
      this.y = initial
        ? Math.random() * (bgCanvas ? bgCanvas.height : window.innerHeight)
        : (bgCanvas ? bgCanvas.height : window.innerHeight) + 20;
      this.size = 10 + Math.random() * 16;
      this.speedY = 0.5 + Math.random() * 1.2;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = 0.2 + Math.random() * 0.5;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.type = Math.random() > 0.35 ? 'heart' : 'sparkle';
      this.color = Math.random() > 0.5 ? '#ff4d6d' : '#ff758f';
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.02) * 0.7 + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'heart') {
        ctx.fillStyle = this.color;
        drawHeartPath(ctx, 0, 0, this.size);
      } else {
        // Draw cute 4-point sparkle star
        ctx.fillStyle = '#ffb703';
        drawSparklePath(ctx, 0, 0, this.size * 0.65);
      }
      ctx.restore();
    }
  }

  function drawHeartPath(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // Left half
    ctx.bezierCurveTo(
      x, y,
      x - size / 2, y,
      x - size / 2, y + topCurveHeight
    );
    ctx.bezierCurveTo(
      x - size / 2, y + (size + topCurveHeight) / 2,
      x, y + (size + topCurveHeight) / 1.3,
      x, y + size
    );
    // Right half
    ctx.bezierCurveTo(
      x, y + (size + topCurveHeight) / 1.3,
      x + size / 2, y + (size + topCurveHeight) / 2,
      x + size / 2, y + topCurveHeight
    );
    ctx.bezierCurveTo(
      x + size / 2, y,
      x, y,
      x, y + topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
  }

  function drawSparklePath(ctx, x, y, radius) {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      const innerAngle = angle + Math.PI / 4;
      ctx.lineTo(x + Math.cos(innerAngle) * (radius * 0.35), y + Math.sin(innerAngle) * (radius * 0.35));
    }
    ctx.closePath();
    ctx.fill();
  }

  // Populate ambient particles
  for (let i = 0; i < MAX_BG_PARTICLES; i++) {
    bgParticles.push(new AmbientParticle());
  }

  function renderBg() {
    if (bgCtx && bgCanvas) {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      for (let i = 0; i < bgParticles.length; i++) {
        bgParticles[i].update();
        bgParticles[i].draw(bgCtx);
      }
    }
    requestAnimationFrame(renderBg);
  }
  renderBg();

  // =========================================================================
  // 4. "NO" Button Behavior: Shrink, Flee, Increase YES & Update Love Meter
  // =========================================================================
  let isMoving = false;

  function moveNoButton() {
    if (!noBtn || isMoving) return;
    isMoving = true;

    noAttempts++;

    // 1. Shrink NO button by 15% each time
    noScale = Math.max(0, noScale * 0.85);

    // 2. Increase YES button size slightly
    yesScale += 0.09;
    if (yesBtn) {
      yesBtn.style.transform = `scale(${yesScale})`;
      // Add extra glow as it gets bigger
      const extraGlow = Math.min(40, (yesScale - 1) * 35);
      yesBtn.style.boxShadow = `0 10px ${30 + extraGlow}px rgba(255, 77, 109, ${0.45 + extraGlow * 0.01}), 0 0 ${extraGlow}px rgba(255, 77, 109, 0.7)`;
    }

    // 3. Love Meter Fill Up
    loveLevel = Math.min(100, loveLevel + Math.floor(12 + Math.random() * 8));
    if (meterFill && meterPercentage && meterHint) {
      meterFill.style.width = `${loveLevel}%`;
      meterPercentage.textContent = `${loveLevel}%`;

      const hintIdx = Math.min(loveHints.length - 1, Math.floor((loveLevel / 100) * loveHints.length));
      meterHint.textContent = loveHints[hintIdx];
    }

    // 4. Display Cute Teasing Speech Bubble
    const quote = cuteQuotes[(noAttempts - 1) % cuteQuotes.length];
    if (teaseBubble && teaseText) {
      const bubbleIcon = teaseBubble.querySelector('.bubble-icon');
      if (bubbleIcon) bubbleIcon.textContent = quote.icon;
      teaseText.textContent = quote.text;
      teaseBubble.classList.add('active');

      clearTimeout(teaseBubble._timer);
      teaseBubble._timer = setTimeout(() => {
        teaseBubble.classList.remove('active');
      }, 2600);
    }

    // 5. Calculate Random Nearby Position (Keeping on-screen and responsive)
    const cardRect = document.getElementById('invite-card')?.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Use window bounds with safe margin
    const margin = 20;
    const maxW = window.innerWidth - btnRect.width - margin;
    const maxH = window.innerHeight - btnRect.height - margin;

    // Determine target location: nearby but far enough from cursor
    let targetX, targetY;
    if (noAttempts === 1) {
      // First move switch to fixed positioning so it freely moves across viewport
      noBtn.style.position = 'fixed';
    }

    // Generate random coordinate with bias toward card vicinity
    if (cardRect && Math.random() > 0.3) {
      const offsetX = (Math.random() - 0.5) * (cardRect.width * 1.1);
      const offsetY = (Math.random() - 0.5) * (cardRect.height * 0.8);
      targetX = cardRect.left + cardRect.width / 2 + offsetX - btnRect.width / 2;
      targetY = cardRect.top + cardRect.height / 2 + offsetY - btnRect.height / 2;
    } else {
      targetX = margin + Math.random() * (maxW - margin);
      targetY = margin + Math.random() * (maxH - margin);
    }

    // Clamp inside viewport
    targetX = Math.max(margin, Math.min(maxW, targetX));
    targetY = Math.max(margin, Math.min(maxH, targetY));

    noBtn.style.left = `${targetX}px`;
    noBtn.style.top = `${targetY}px`;
    noBtn.style.transform = `scale(${noScale})`;

    // Play a gentle playful high 'bloop' sound
    playMusicBoxNote(880 + noAttempts * 40, 0.2, 0.04);

    // 6. After several attempts, make NO nearly invisible or vanish
    if (noAttempts >= 7 || noScale < 0.22) {
      noBtn.style.opacity = '0';
      noBtn.style.pointerEvents = 'none';
      if (teaseBubble) {
        teaseBubble.classList.remove('active');
      }
    }

    setTimeout(() => {
      isMoving = false;
    }, 180);
  }

  // Bind multiple evasive listeners (Desktop Hover & Mobile Touch)
  if (noBtn) {
    // Desktop hover & click attempt
    noBtn.addEventListener('mouseenter', moveNoButton);
    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      moveNoButton();
    });

    // Mobile / Touch handling (triggers before tap registers)
    noBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      moveNoButton();
    }, { passive: false });

    noBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      moveNoButton();
    });
  }

  // =========================================================================
  // 5. Celebration Fireworks & Confetti System
  // =========================================================================
  let celebParticles = [];
  let isCelebrating = false;

  function resizeCelebCanvas() {
    if (!celebrationCanvas) return;
    celebrationCanvas.width = window.innerWidth;
    celebrationCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCelebCanvas);

  class CelebrationParticle {
    constructor(x, y, isHeart = false) {
      this.x = x;
      this.y = y;
      this.isHeart = isHeart;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 2.5; // slight upward burst
      this.gravity = 0.15;
      this.friction = 0.96;
      this.size = isHeart ? 14 + Math.random() * 12 : 6 + Math.random() * 6;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.1;
      this.opacity = 1;
      this.decay = 0.008 + Math.random() * 0.012;

      const colors = ['#ff4d6d', '#ff758f', '#ffccd5', '#ffb703', '#ffffff', '#c9184a'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.opacity -= this.decay;
    }

    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      if (this.isHeart) {
        drawHeartPath(ctx, 0, 0, this.size);
      } else {
        // Confetti Ribbon / Square
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      }
      ctx.restore();
    }
  }

  function launchExplosion(originX, originY, count = 55) {
    for (let i = 0; i < count; i++) {
      const isHeart = Math.random() > 0.45;
      celebParticles.push(new CelebrationParticle(originX, originY, isHeart));
    }
  }

  function launchCelebrationStream() {
    if (!isCelebrating) return;

    // Random firework bursts across screen
    if (Math.random() < 0.28) {
      const burstX = 0.15 * window.innerWidth + Math.random() * 0.7 * window.innerWidth;
      const burstY = 0.15 * window.innerHeight + Math.random() * 0.45 * window.innerHeight;
      launchExplosion(burstX, burstY, 40);
    }

    // Side confetti cannons
    if (Math.random() < 0.2) {
      launchExplosion(50, window.innerHeight * 0.7, 30);
      launchExplosion(window.innerWidth - 50, window.innerHeight * 0.7, 30);
    }
  }

  function renderCelebration() {
    if (celebCtx && celebrationCanvas) {
      celebCtx.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);

      for (let i = celebParticles.length - 1; i >= 0; i--) {
        const p = celebParticles[i];
        p.update();
        p.draw(celebCtx);
        if (p.opacity <= 0) {
          celebParticles.splice(i, 1);
        }
      }
    }

    if (isCelebrating) {
      launchCelebrationStream();
      requestAnimationFrame(renderCelebration);
    }
  }

  // =========================================================================
  // 6. "YES" Button Trigger - Full Screen Celebration
  // =========================================================================
  function celebrateYes() {
    isCelebrating = true;
    resizeCelebCanvas();

    // Trigger celebration modal overlay
    if (celebrationOverlay) {
      celebrationOverlay.classList.add('active');
      celebrationOverlay.setAttribute('aria-hidden', 'false');
    }

    // Play fanfare chime
    playCelebrationFanfare();

    // Ensure music is playing if it wasn't already
    if (!isPlayingMusic) {
      toggleMusic();
    }

    // Spawn massive heart explosion at center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    launchExplosion(centerX, centerY, 90);
    launchExplosion(centerX - 150, centerY - 60, 50);
    launchExplosion(centerX + 150, centerY - 60, 50);

    renderCelebration();
  }

  if (yesBtn) {
    yesBtn.addEventListener('click', celebrateYes);
  }

  // Replay celebration confetti button inside modal
  if (replayCelebrationBtn) {
    replayCelebrationBtn.addEventListener('click', () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      launchExplosion(centerX, centerY, 80);
      playCelebrationFanfare();
    });
  }

  // Copy romantic text message for her to send back
  if (shareNoteBtn && copyToast) {
    shareNoteBtn.addEventListener('click', () => {
      const sweetNote = "YAY! I said YES to our date! ❤️ Lock it in! 💍 Can't wait for delicious food & cute moments with you! 🥰";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(sweetNote).then(() => {
          showCopyToast();
        }).catch(() => {
          fallbackCopyText(sweetNote);
        });
      } else {
        fallbackCopyText(sweetNote);
      }
    });
  }

  function showCopyToast() {
    copyToast.classList.add('show');
    setTimeout(() => {
      copyToast.classList.remove('show');
    }, 2800);
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showCopyToast();
    } catch (err) {
      // ignore
    }
    document.body.removeChild(tempInput);
  }

  // =========================================================================
  // Initialize
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    // Start typing effect with a slight initial delay
    setTimeout(typeWriter, 400);
  });

})();
