// ==========================================
// BLOCK BLAST - LUXURY NATURE EDITION
// ==========================================

// --- BACKGROUND DATA ---
const BACKGROUNDS = [
  {
    name: "Cảnh 1: Ngọn núi và Hồ nước",
    url: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysized&w=1920",
    weather: "clear",
    dayCycle: "day",
  },
  {
    name: "Cảnh 2: Thung lũng mờ sương",
    url: "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysized&w=1920",
    weather: "clear",
    dayCycle: "sunset",
  },
  {
    name: "Cảnh 3: Rừng cây mùa thu đỏ",
    url: "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysized&w=1920",
    weather: "leaves",
    dayCycle: "sunset",
  },
  {
    name: "Cảnh 4: Bãi biển nhiệt đới",
    url: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysized&w=1920",
    weather: "clear",
    dayCycle: "day",
  },
  {
    name: "Cảnh 5: Thác nước trong rừng sâu",
    url: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysized&w=1920",
    weather: "rain",
    dayCycle: "sunrise",
  },
  {
    name: "Cảnh 6: Cánh đồng hoa Lavender tím",
    url: "https://images.pexels.com/photos/1166644/pexels-photo-1166644.jpeg?auto=compress&cs=tinysized&w=1920",
    weather: "lavender",
    dayCycle: "sunset",
  },
  {
    name: "Cảnh 7: Rặng núi tuyết hùng vĩ",
    url: "https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysized&w=1920",
    weather: "snow",
    dayCycle: "day",
  },
  {
    name: "Cảnh 8: Sóng biển vỗ bờ đá",
    url: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysized&w=1920",
    weather: "rain",
    dayCycle: "sunset",
  },
  {
    name: "Cảnh 9: Sông núi vùng Bắc Âu",
    url: "https://images.pexels.com/photos/355288/pexels-photo-355288.jpeg?auto=compress&cs=tinysized&w=1920",
    weather: "clear",
    dayCycle: "sunrise",
  },
  {
    name: "Cảnh 10: Trời đêm Aurora huyền ảo",
    url: "https://images.pexels.com/photos/1938348/pexels-photo-1938348.jpeg?auto=compress&cs=tinysized&w=1920",
    weather: "sparks",
    dayCycle: "night",
  },
  {
    name: "Cảnh 11: Sa mạc hoàng hôn",
    url: "https://images.pexels.com/photos/1001435/pexels-photo-1001435.jpeg?auto=compress&cs=tinysized&w=1920",
    weather: "sand",
    dayCycle: "sunset",
  },
];

// --- GAME STATE ---
let gameState = {
  score: 0,
  highscore: 0,
  gems: 20,
  gold: 0, // VIP Currency 1
  crystal: 0, // VIP Currency 2
  level: 1,
  xp: 0,
  gamesPlayed: 0,
  totalGemsEarned: 20,
  totalHammersUsed: 0,
  totalBossesKilled: 0,
  maxCombo: 0,
  totalBlocksPlaced: 0,
  totalLinesCleared: 0,
  activeSkin: "default",
  unlockedSkins: ["default"],
  soundEnabled: true,
  musicEnabled: true,
  lastSpinTime: 0,
  currentMissions: [],
  unlockedAchievements: [],
};

// --- CORE GAMEPLAY CONSTANTS & VARIABLES ---
const BOARD_SIZE_STANDARD = 8;
const BOARD_SIZE_HARDCORE = 9;
let BOARD_SIZE = BOARD_SIZE_STANDARD;

let boardState = [];
let gemState = [];

let activePiece = null;
let isDraggingAction = false;
let streakCount = 0;
let isHammerActive = false;
let isBombActive = false;
let pointerOffset = { x: 0, y: 0 };
let originalSlot = null;

let currentGameMode = "classic"; // classic, time-attack, zen, hardcore
let timeAttackTimer = null;
let timeAttackSeconds = 120; // 2 minutes start

// Boss state
let bossActive = false;
let bossHP = 5;
let bossRow = -1;
let bossCol = -1;
let bossMovesSinceDmg = 0;

// Undo stack (stores previous move's state)
let undoHistory = [];

const COLORS = [
  "#ff0055", // Red
  "#00ffcc", // Teal
  "#ffcc00", // Yellow
  "#2a82fe", // Blue
  "#ff5eeb", // Pink
  "#9043ff", // Purple
  "#ff6a00", // Orange
];

const SHAPES = [
  [[1]],
  [[1, 1]],
  [[1], [1]],
  [[1, 1, 1]],
  [[1], [1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 0],
    [1, 1],
  ],
  [
    [0, 1],
    [1, 1],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1, 1],
    [1, 0, 0],
  ],
  [[1, 1, 1, 1]],
];

// Achievements list definition
const ACHIEVEMENTS_DEF = [
  {
    id: "first_blood",
    title: "First Blood 🩸",
    desc: "Đạt 100 điểm",
    condition: (s) => s.score >= 100,
    icon: "🩸",
  },
  {
    id: "combo_master",
    title: "Combo Master ⚡",
    desc: "Đạt Combo x5",
    condition: (s) => s.maxCombo >= 5,
    icon: "⚡",
  },
  {
    id: "destroyer",
    title: "Destroyer 💥",
    desc: "Đặt 500 khối",
    condition: (s) => s.totalBlocksPlaced >= 500,
    icon: "💥",
  },
  {
    id: "millionaire",
    title: "Millionaire 💎",
    desc: "Sở hữu 200 Gems",
    condition: (s) => s.gems >= 200,
    icon: "💎",
  },
  {
    id: "boss_slayer",
    title: "Boss Slayer 👿",
    desc: "Tiêu diệt 1 Boss",
    condition: (s) => s.totalBossesKilled >= 1,
    icon: "👿",
  },
  {
    id: "golden_royalty",
    title: "Royal Crown 👑",
    desc: "Sở hữu 20 Gold",
    condition: (s) => s.gold >= 20,
    icon: "👑",
  },
];

// Skins definition
const SKINS_DEF = [
  { id: "default", name: "Mặc định 🟩", price: 0, currency: "gems", class: "" },
  {
    id: "ice",
    name: "Băng tuyết 🧊",
    price: 50,
    currency: "gems",
    class: "skin-ice",
  },
  {
    id: "sakura",
    name: "Hoa anh đào 🌸",
    price: 80,
    currency: "gems",
    class: "skin-sakura",
  },
  {
    id: "galaxy",
    name: "Vũ trụ 🌌",
    price: 120,
    currency: "gems",
    class: "skin-galaxy",
  },
  {
    id: "gold",
    name: "Hoàng gia 🟨",
    price: 10,
    currency: "gold",
    class: "skin-gold",
  },
  {
    id: "crystal",
    name: "Thần thoại 💎",
    price: 15,
    currency: "crystal",
    class: "skin-crystal",
  },
];

// --- DOM ELEMENTS ---
const lobbyScreen = document.getElementById("lobby-screen");
const gameScreen = document.getElementById("game-screen");
const boardEl = document.getElementById("board");
const slots = document.querySelectorAll(".rack-slot");
const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const gemsEl = document.getElementById("gems");
const streakBanner = document.getElementById("streak-banner");
const gameOverScreen = document.getElementById("game-over-screen");
const hammerBtn = document.getElementById("hammer-btn");
const bombBtn = document.getElementById("bomb-btn");
const undoBtn = document.getElementById("undo-btn");
const shuffleBtn = document.getElementById("shuffle-btn");

const lobbyGoldEl = document.getElementById("lobby-gold");
const lobbyCrystalEl = document.getElementById("lobby-crystal");
const lobbyGemsEl = document.getElementById("lobby-gems");
const lobbyLevelEl = document.getElementById("lobby-level");
const lobbyXpLabel = document.getElementById("lobby-xp-label");
const lobbyXpFill = document.getElementById("lobby-xp-fill");

const timerContainer = document.getElementById("timer-container");
const timerBar = document.getElementById("timer-bar");

const bossHud = document.getElementById("boss-hud");
const bossHudHp = document.getElementById("boss-hud-hp");

let currentBgIndex = 0;

// --- 1. WEB AUDIO SYNTHESIZER ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (!gameState.soundEnabled) return;
  if (audioCtx.state === "suspended") audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === "click") {
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.04);
    gain.gain.setValueAtTime(0.04, now);
    osc.start();
    osc.stop(now + 0.04);
  } else if (type === "place") {
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.08);
    gain.gain.setValueAtTime(0.1, now);
    osc.start();
    osc.stop(now + 0.08);
  } else if (type === "blast") {
    // Noise/Boom blast sound effect
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.3);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
    osc.start();
    osc.stop(now + 0.3);
  } else if (type === "hammer") {
    // Metal clang
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
    gain.gain.setValueAtTime(0.12, now);
    osc.start();
    osc.stop(now + 0.15);
  } else if (type === "bomb") {
    // Explosion sound
    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.45);
    osc.start();
    osc.stop(now + 0.45);
  } else if (type === "levelup") {
    // Triumphant chord arpeggio
    const notes = [261.63, 329.63, 392.0, 523.25]; // C E G C
    notes.forEach((freq, idx) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g);
      g.connect(audioCtx.destination);
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, now + idx * 0.08);
      g.gain.linearRampToValueAtTime(0.06, now + idx * 0.08 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);
      o.start(now + idx * 0.08);
      o.stop(now + idx * 0.08 + 0.4);
    });
  } else if (type === "spin") {
    // Click tick wheel spin
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.03, now);
    osc.start();
    osc.stop(now + 0.015);
  }
}

const bgAudio = document.getElementById("bg-audio");

function initCustomMusicUploader() {
  const localInput = document.getElementById("local-audio-input");
  if (localInput) {
    localInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          bgAudio.src = evt.target.result;
          document.getElementById("music-status-text").innerText =
            `Đã tải nhạc: ${file.name}`;
          if (gameState.musicEnabled) {
            bgAudio
              .play()
              .catch((err) => console.log("Không tự phát được nhạc:", err));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

function loadMusicFromUrl() {
  const urlInput = document.getElementById("audio-url-input");
  if (urlInput && urlInput.value) {
    bgAudio.src = urlInput.value;
    document.getElementById("music-status-text").innerText =
      `Đã liên kết nhạc URL`;
    if (gameState.musicEnabled) {
      bgAudio.play().catch((err) => {
        alert("Lỗi tải nhạc từ URL! Vui lòng kiểm tra lại đường dẫn.");
        console.log(err);
      });
    }
  }
}

function toggleMusic() {
  gameState.musicEnabled = !gameState.musicEnabled;
  document.getElementById("music-btn").innerText = gameState.musicEnabled
    ? "🔊"
    : "🔇";
  playSound("click");
  saveState();

  if (gameState.musicEnabled) {
    if (bgAudio.src) {
      bgAudio.play().catch((err) => console.log("Lỗi phát nhạc:", err));
    }
  } else {
    bgAudio.pause();
  }
}

function toggleSound() {
  gameState.soundEnabled = !gameState.soundEnabled;
  document.getElementById("sound-btn").innerText = gameState.soundEnabled
    ? "🎵"
    : "🔇";
  playSound("click");
  saveState();
}

// --- 2. WEATHER PARTICLES CANVAS ENGINE ---
const weatherCanvas = document.getElementById("weather-canvas");
const ctx = weatherCanvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  weatherCanvas.width = window.innerWidth;
  weatherCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
  constructor(type) {
    this.type = type; // rain, snow, leaves, lavender, sparks, sand, default
    this.reset();
    this.y = Math.random() * weatherCanvas.height; // Spread initially
  }

  reset() {
    this.x = Math.random() * weatherCanvas.width;
    this.y = -10;
    this.size = Math.random() * 4 + 1;
    this.speedY = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;

    if (this.type === "rain") {
      this.size = Math.random() * 2 + 1;
      this.speedY = Math.random() * 8 + 6;
      this.speedX = -1;
      this.length = Math.random() * 15 + 10;
    } else if (this.type === "leaves") {
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 1.5 + 0.8;
      this.speedX = Math.random() * 2 - 0.5;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = Math.random() * 0.02 - 0.01;
      this.color = Math.random() < 0.5 ? "#f97316" : "#ef4444"; // Orange / Red
    } else if (this.type === "lavender") {
      this.size = Math.random() * 6 + 3;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.random() * 1.5 - 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = Math.random() * 0.03 - 0.015;
      this.color = "#c084fc"; // Lavender purple
    } else if (this.type === "sparks") {
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * -0.5 - 0.2; // float up
      this.speedX = Math.random() * 1 - 0.5;
      this.color = `hsl(${Math.random() * 60 + 120}, 100%, 70%)`; // green/aurora cyan
      this.y = weatherCanvas.height + 10;
    } else if (this.type === "sand") {
      this.size = Math.random() * 2 + 1;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.speedX = Math.random() * 3 + 2; // blow right
      this.color = "#f59e0b";
      this.x = -10;
      this.y = Math.random() * weatherCanvas.height;
    } else {
      // default: slow floating sun motes
      this.size = Math.random() * 4 + 2;
      this.speedY = Math.random() * 0.3 + 0.1;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.2 + 0.1;
      this.color = "#ffffff";
    }
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;

    if (this.type === "leaves" || this.type === "lavender") {
      this.rotation += this.rotationSpeed;
      this.x += Math.sin(this.y / 30) * 0.5; // swing sway
    }

    // Boundary check
    if (
      this.y > weatherCanvas.height + 20 ||
      this.x < -20 ||
      this.x > weatherCanvas.width + 20 ||
      (this.type === "sparks" && this.y < -20)
    ) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;

    if (this.type === "rain") {
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.speedX, this.y + this.length);
      ctx.stroke();
    } else if (this.type === "snow") {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === "leaves" || this.type === "lavender") {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      // Draw simple leaf shape
      ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === "sparks") {
      // glowing aura spark
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function initWeather(weatherType) {
  particles = [];
  const count = weatherType === "clear" ? 40 : 100;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(weatherType));
  }
}

function animateWeather() {
  ctx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateWeather);
}

// Start weather loop
initWeather("clear");
animateWeather();

// --- 3. AUTH SYSTEM & STATE SAVING / LOADING ---

// Auth state
let currentUser = null; // null = not logged in yet

const DEFAULT_GAME_STATE = () => ({
  score: 0,
  highscore: 0,
  gems: 20,
  gold: 0,
  crystal: 0,
  level: 1,
  xp: 0,
  gamesPlayed: 0,
  totalGemsEarned: 20,
  totalHammersUsed: 0,
  totalBossesKilled: 0,
  maxCombo: 0,
  totalBlocksPlaced: 0,
  totalLinesCleared: 0,
  activeSkin: "default",
  unlockedSkins: ["default"],
  soundEnabled: true,
  musicEnabled: true,
  lastSpinTime: 0,
  currentMissions: [],
  unlockedAchievements: [],
});

// Get all registered accounts from localStorage
function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem("bb_accounts") || "{}");
  } catch (e) {
    return {};
  }
}

function saveAccounts(accounts) {
  localStorage.setItem("bb_accounts", JSON.stringify(accounts));
}

// Save current gameState to the logged-in user's slot
function saveState() {
  // Tài khoản admin không lưu vào localStorage (luôn full đồ khi đăng nhập lại)
  if (currentUser === ADMIN_CREDENTIALS.username) return;

  if (currentUser) {
    const accounts = getAccounts();
    if (accounts[currentUser]) {
      accounts[currentUser].gameState = gameState;
      saveAccounts(accounts);
    }
  } else {
    // Guest: save to generic slot
    localStorage.setItem("bb_luxury_save_guest", JSON.stringify(gameState));
  }
}

// Load gameState from the logged-in user's slot
function loadState() {
  if (currentUser) {
    const accounts = getAccounts();
    const userSave = accounts[currentUser] && accounts[currentUser].gameState;
    if (userSave) {
      try {
        gameState = { ...DEFAULT_GAME_STATE(), ...userSave };
      } catch (e) {
        gameState = DEFAULT_GAME_STATE();
      }
    } else {
      gameState = DEFAULT_GAME_STATE();
    }
  } else {
    // Guest
    const guestSave = localStorage.getItem("bb_luxury_save_guest");
    if (guestSave) {
      try {
        gameState = { ...DEFAULT_GAME_STATE(), ...JSON.parse(guestSave) };
      } catch (e) {
        gameState = DEFAULT_GAME_STATE();
      }
    } else {
      gameState = DEFAULT_GAME_STATE();
    }
    function loadState() {
      if (currentUser) {
        // ... (đoạn code xử lý currentAccount của bạn)

        // THÊM DÒNG NÀY VÀO ĐÂY:
        showWelcomeNotification();
      } else {
        // Guest
        // ... (đoạn code xử lý guest của bạn)
      }
      syncLobbyUI();
    }
  }
}

// --- ADMIN ACCOUNT (Hardcoded, không lưu vào localStorage) ---
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

function getAdminGameState() {
  return {
    score: 0,
    highscore: 999999,
    gems: 99999,
    gold: 99999,
    crystal: 99999,
    level: 99,
    xp: 0,
    gamesPlayed: 999,
    totalGemsEarned: 99999,
    totalHammersUsed: 999,
    totalBossesKilled: 99,
    maxCombo: 99,
    totalBlocksPlaced: 99999,
    totalLinesCleared: 9999,
    activeSkin: "crystal",
    // Mở khóa TẤT CẢ skin
    unlockedSkins: SKINS_DEF.map((s) => s.id),
    soundEnabled: true,
    musicEnabled: true,
    lastSpinTime: 0,
    currentMissions: [],
    // Đạt được TẤT CẢ thành tựu
    unlockedAchievements: ACHIEVEMENTS_DEF.map((a) => a.id),
  };
}

function switchAuthTab(tab) {
  document.getElementById("auth-login-section").style.display =
    tab === "login" ? "flex" : "none";
  document.getElementById("auth-register-section").style.display =
    tab === "register" ? "flex" : "none";
  document
    .getElementById("auth-tab-login")
    .classList.toggle("active", tab === "login");
  document
    .getElementById("auth-tab-register")
    .classList.toggle("active", tab === "register");
}

function submitLogin() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const errMsg = document.getElementById("login-error-msg");
  errMsg.style.display = "none";

  if (!username || !password) {
    errMsg.innerText = "Vui lòng nhập tên đăng nhập và mật khẩu!";
    errMsg.style.display = "block";
    return;
  }

  // --- Kiểm tra tài khoản Admin cố định ---
  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    currentUser = "admin";
    gameState = getAdminGameState();
    enterLobby();
    playSound("levelup");
    // Hiện banner chào mừng admin
    setTimeout(() => {
      const banner = document.createElement("div");
      banner.style.cssText = `
        position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
        background:linear-gradient(135deg,#ff0055,#ffcc00);
        color:#000; padding:20px 35px; border-radius:20px;
        font-size:18px; font-weight:900; z-index:9999;
        box-shadow:0 0 40px rgba(255,204,0,0.8); text-align:center;
        animation: levelPopAnim 0.5s ease;
      `;
      banner.innerHTML =
        "👑 CHÀO MỪNG ADMIN! 👑<br><span style='font-size:13px;font-weight:700;'>Full vàng · Full ngọc · Full đồ</span>";
      document.body.appendChild(banner);
      setTimeout(() => banner.remove(), 3000);
    }, 400);
    return;
  }

  const accounts = getAccounts();
  if (!accounts[username]) {
    errMsg.innerText = "Tài khoản không tồn tại!";
    errMsg.style.display = "block";
    return;
  }
  if (accounts[username].password !== password) {
    errMsg.innerText = "Mật khẩu không đúng!";
    errMsg.style.display = "block";
    return;
  }

  // Login success
  currentUser = username;
  loadState();
  enterLobby();
  playSound("levelup");
}

function submitRegister() {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value;
  const confirm = document.getElementById("register-password-confirm").value;
  const errMsg = document.getElementById("register-error-msg");
  errMsg.style.display = "none";

  if (!username || username.length < 3) {
    errMsg.innerText = "Tên đăng nhập phải từ 3 ký tự trở lên!";
    errMsg.style.display = "block";
    return;
  }
  if (!password || password.length < 4) {
    errMsg.innerText = "Mật khẩu phải từ 4 ký tự trở lên!";
    errMsg.style.display = "block";
    return;
  }
  if (password !== confirm) {
    errMsg.innerText = "Mật khẩu xác nhận không khớp!";
    errMsg.style.display = "block";
    return;
  }

  const accounts = getAccounts();
  if (accounts[username]) {
    errMsg.innerText = "Tên đăng nhập này đã tồn tại!";
    errMsg.style.display = "block";
    return;
  }

  // Register success: create new account with fresh game state
  accounts[username] = {
    password: password,
    createdAt: Date.now(),
    gameState: DEFAULT_GAME_STATE(),
  };
  saveAccounts(accounts);

  // Auto-login after register
  currentUser = username;
  loadState();
  enterLobby();
  playSound("levelup");
}

function continueAsGuest() {
  currentUser = null;
  loadState();
  enterLobby();
  playSound("click");
}

function logoutAccount() {
  if (!confirm("Bạn có muốn đăng xuất không?")) return;
  // Save before logout
  saveState();
  currentUser = null;
  gameState = DEFAULT_GAME_STATE();

  // Go back to auth screen
  lobbyScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  document.getElementById("auth-screen").classList.add("active");
  // Clear inputs
  document.getElementById("login-username").value = "";
  document.getElementById("login-password").value = "";
  document.getElementById("login-error-msg").style.display = "none";
  document.getElementById("register-error-msg").style.display = "none";
  switchAuthTab("login");
  playSound("click");
}

function enterLobby() {
  document.getElementById("auth-screen").classList.remove("active");
  gameScreen.classList.remove("active");
  lobbyScreen.classList.add("active");
  syncLobbyUI();

  // Update profile name to logged-in username
  const nameEl = document.getElementById("lobby-profile-name");
  if (nameEl) {
    nameEl.innerText = currentUser ? `👤 ${currentUser}` : "👤 Khách";
  }
}

// Init auth on page load
function initAuth() {
  // Ensure auth screen is showing by default
  document.getElementById("auth-screen").classList.add("active");
  lobbyScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  switchAuthTab("login");

  // Support pressing Enter to login
  ["login-username", "login-password"].forEach((id) => {
    const el = document.getElementById(id);
    if (el)
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submitLogin();
      });
  });
  [
    "register-username",
    "register-password",
    "register-password-confirm",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el)
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submitRegister();
      });
  });
}

function syncLobbyUI() {
  lobbyGoldEl.innerText = gameState.gold;
  lobbyCrystalEl.innerText = gameState.crystal;
  lobbyGemsEl.innerText = gameState.gems;
  lobbyLevelEl.innerText = `Cấp độ ${gameState.level}`;

  const xpNeeded = getXpNeededForLevel(gameState.level);
  lobbyXpLabel.innerText = `${gameState.xp} / ${xpNeeded} XP`;
  lobbyXpFill.style.width = `${Math.min(100, (gameState.xp / xpNeeded) * 100)}%`;

  // Set in-game stats labels correctly
  scoreEl.innerText = 0;
  highscoreEl.innerText = gameState.highscore;
  gemsEl.innerText = gameState.gems;

  // Show logged-in user profile name
  const nameEl = document.getElementById("lobby-profile-name");
  if (nameEl) {
    nameEl.innerText = currentUser ? `👤 ${currentUser}` : "👤 Khách";
  }
}

function getXpNeededForLevel(lv) {
  return lv * 150 + 100;
}

function earnXp(amount) {
  gameState.xp += amount;
  const xpNeeded = getXpNeededForLevel(gameState.level);
  if (gameState.xp >= xpNeeded) {
    gameState.xp -= xpNeeded;
    gameState.level++;

    // Level Up Reward!
    gameState.gems += 20;
    gameState.gold += 2;
    playSound("levelup");

    // Show level up modal
    document.getElementById("levelup-details").innerText =
      `Bạn đã đạt Cấp độ ${gameState.level}`;
    openModal("levelup-modal");
  }
  saveState();
  syncLobbyUI();
}

// --- 4. GAME MODES & NAV TRANSITIONS ---
function startGame(mode) {
  playSound("click");
  currentGameMode = mode;
  gameState.gamesPlayed++;
  saveState();

  // Mode tags and Board sizing
  const modeTag = document.getElementById("game-mode-tag");
  const logoText = document.getElementById("game-logo-text");

  if (mode === "classic") {
    BOARD_SIZE = BOARD_SIZE_STANDARD;
    modeTag.innerText = "Classic";
    timerContainer.style.display = "none";
    logoText.innerText = "BLOCK BLAST";
    boardEl.classList.remove("hardcore-mode");
  } else if (mode === "time-attack") {
    BOARD_SIZE = BOARD_SIZE_STANDARD;
    modeTag.innerText = "Time Attack";
    timerContainer.style.display = "block";
    logoText.innerText = "TIME ATTACK";
    timeAttackSeconds = 120;
    updateTimerBar();
    boardEl.classList.remove("hardcore-mode");
    startTimerLoop();
  } else if (mode === "zen") {
    BOARD_SIZE = BOARD_SIZE_STANDARD;
    modeTag.innerText = "Zen Mode";
    timerContainer.style.display = "none";
    logoText.innerText = "ZEN CALM";
    boardEl.classList.remove("hardcore-mode");
  } else if (mode === "hardcore") {
    BOARD_SIZE = BOARD_SIZE_HARDCORE;
    modeTag.innerText = "Hardcore";
    timerContainer.style.display = "none";
    logoText.innerText = "HARDCORE";
    boardEl.classList.add("hardcore-mode");
  }

  // Deactivate powerups styling/limits
  deactivateHammer();
  deactivateBomb();
  undoHistory = [];
  bossActive = false;
  bossHud.style.display = "none";

  // Toggle button visibility
  document.getElementById("home-btn").style.display = "flex";

  lobbyScreen.classList.remove("active");
  gameScreen.classList.add("active");

  initBoard();
  resetGameVars();
  spawnPieces();
}

function goHome() {
  playSound("click");
  if (timeAttackTimer) clearInterval(timeAttackTimer);

  document.getElementById("home-btn").style.display = "none";
  gameScreen.classList.remove("active");
  lobbyScreen.classList.add("active");

  syncLobbyUI();

  // check gift box activation (if gamesPlayed modulo 5 is 0)
  if (gameState.gamesPlayed > 0 && gameState.gamesPlayed % 5 === 0) {
    document.getElementById("gift-box-element").classList.remove("open");
    document.getElementById("gift-box-element").style.transform = "scale(1)";
    document.getElementById("gift-box-element").style.opacity = "1";
    document.getElementById("gift-reward-reveal").style.display = "none";
    document.getElementById("gift-close-btn").style.display = "none";
    openModal("gift-modal");
  }
}

// Timer Logic for Time Attack
function startTimerLoop() {
  if (timeAttackTimer) clearInterval(timeAttackTimer);
  timeAttackTimer = setInterval(() => {
    timeAttackSeconds--;
    updateTimerBar();
    if (timeAttackSeconds <= 0) {
      clearInterval(timeAttackTimer);
      triggerGameOver("Hết thời gian quy định!");
    }
  }, 1000);
}

function updateTimerBar() {
  const percent = Math.max(0, (timeAttackSeconds / 120) * 100);
  timerBar.style.width = `${percent}%`;
}

// --- 5. CORE GAMEBOARD LOGIC ---
function initBoard() {
  boardEl.innerHTML = '<div id="perfect-notice">PERFECT!!</div>';

  // Adjust CSS grid column repeat based on board size
  boardEl.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
  boardEl.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;

  boardState = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
  gemState = Array(BOARD_SIZE)
    .fill(false)
    .map(() => Array(BOARD_SIZE).fill(false));

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", handleCellClick);
      boardEl.appendChild(cell);
    }
  }
}

function resetGameVars() {
  score = 0;
  streakCount = 0;
  scoreEl.innerText = 0;
  gemsEl.innerText = gameState.gems;
  streakBanner.classList.remove("active");
  gameOverScreen.style.display = "none";
}

function handleCellClick(e) {
  const r = parseInt(e.currentTarget.dataset.row);
  const c = parseInt(e.currentTarget.dataset.col);

  if (isHammerActive) {
    if (boardState[r][c] !== null) {
      saveUndoState();

      const color = boardState[r][c];

      // If it is the Boss block
      if (bossActive && r === bossRow && c === bossCol) {
        damageBoss(2); // Hammer does 2 dmg
      } else {
        boardState[r][c] = null;
        gemState[r][c] = false;
        createParticles(r, c, color);
        playSound("hammer");
      }

      gameState.gems -= 10;
      gameState.totalHammersUsed++;
      updateDailyMissions("use_hammer", 1);
      saveState();
      updateBoardUI();
      deactivateHammer();

      // check board state for game over refresh
      if (!checkGameOver()) gameOverScreen.style.display = "none";
    }
  } else if (isBombActive) {
    // Bomb power-up: Clears a 3x3 grid around target
    saveUndoState();
    playSound("bomb");

    // Collect coordinates in range
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const targetR = r + i;
        const targetC = c + j;
        if (
          targetR >= 0 &&
          targetR < BOARD_SIZE &&
          targetC >= 0 &&
          targetC < BOARD_SIZE
        ) {
          if (boardState[targetR][targetC] !== null) {
            const blockColor = boardState[targetR][targetC];
            if (bossActive && targetR === bossRow && targetC === bossCol) {
              damageBoss(3); // Bomb does 3 dmg to Boss
            } else {
              boardState[targetR][targetC] = null;
              gemState[targetR][targetC] = false;
              createParticles(targetR, targetC, blockColor);
            }
          }
        }
      }
    }

    // Spawn custom central shockwave animation
    const rect = e.currentTarget.getBoundingClientRect();
    spawnShockwave(rect.left + rect.width / 2, rect.top + rect.height / 2);

    gameState.gems -= 25;
    saveState();
    updateBoardUI();
    deactivateBomb();

    if (!checkGameOver()) gameOverScreen.style.display = "none";
  } else {
    // Standard rotation on cell touch (not dragging)
    // Clicking pieces rotate them, managed inside createPieceDOM
  }
}

// Powerups Activation
function activateHammer() {
  if (currentGameMode === "hardcore") {
    alert("Không được dùng vật phẩm ở chế độ Hardcore!");
    return;
  }
  if (gameState.gems < 10) {
    alert("Bạn không đủ💎!");
    return;
  }
  if (isHammerActive) {
    deactivateHammer();
    return;
  }
  deactivateBomb();
  isHammerActive = true;
  hammerBtn.classList.add("active");
  boardEl.classList.add("hammer-mode");
}

function deactivateHammer() {
  isHammerActive = false;
  hammerBtn.classList.remove("active");
  boardEl.classList.remove("hammer-mode");
}

function activateBomb() {
  if (currentGameMode === "hardcore") {
    alert("Không được dùng vật phẩm ở chế độ Hardcore!");
    return;
  }
  if (gameState.gems < 25) {
    alert("Bạn không đủ💎!");
    return;
  }
  if (isBombActive) {
    deactivateBomb();
    return;
  }
  deactivateHammer();
  isBombActive = true;
  bombBtn.classList.add("active");
  boardEl.classList.add("bomb-mode");
}

function deactivateBomb() {
  isBombActive = false;
  bombBtn.classList.remove("active");
  boardEl.classList.remove("bomb-mode");
}

// --- Undo Functionality ---
function saveUndoState() {
  // Push deep copies to stack, limit to size 3
  const stateCopy = {
    boardState: JSON.parse(JSON.stringify(boardState)),
    gemState: JSON.parse(JSON.stringify(gemState)),
    score: score,
    gems: gameState.gems,
    bossActive: bossActive,
    bossHP: bossHP,
    bossRow: bossRow,
    bossCol: bossCol,
    slotsHtml: Array.from(slots).map((s) => s.innerHTML),
  };
  undoHistory.push(stateCopy);
  if (undoHistory.length > 3) undoHistory.shift();
}

function performUndo() {
  if (currentGameMode === "hardcore") {
    alert("Không được hoàn tác ở chế độ Hardcore!");
    return;
  }
  if (gameState.gems < 20) {
    alert("Bạn không đủ💎!");
    return;
  }
  if (undoHistory.length === 0) {
    alert("Không có nước đi nào để hoàn tác!");
    return;
  }

  const prevState = undoHistory.pop();

  boardState = prevState.boardState;
  gemState = prevState.gemState;
  score = prevState.score;
  bossActive = prevState.bossActive;
  bossHP = prevState.bossHP;
  bossRow = prevState.bossRow;
  bossCol = prevState.bossCol;

  // Restore rack slots
  slots.forEach((s, idx) => {
    s.innerHTML = prevState.slotsHtml[idx];
    // Re-bind events to recreated pieces
    const piece = s.querySelector(".piece");
    if (piece) {
      piece.addEventListener("mousedown", startDrag);
      piece.addEventListener("touchstart", startDrag, { passive: false });
      piece.addEventListener("click", () => {
        if (!isDraggingAction) rotatePiece(piece);
      });
    }
  });

  gameState.gems -= 20; // Charge gems
  saveState();

  scoreEl.innerText = score;
  gemsEl.innerText = gameState.gems;
  updateBoardUI();
  playSound("click");

  if (bossActive) {
    bossHud.style.display = "flex";
    bossHudHp.innerText = `HP: ${bossHP}/5`;
  } else {
    bossHud.style.display = "none";
  }
}

// Reroll pieces in rack
function rerollRack() {
  if (currentGameMode === "hardcore") {
    alert("Không được thay đổi vật phẩm ở chế độ Hardcore!");
    return;
  }
  if (gameState.gems < 15) {
    alert("Bạn không đủ💎!");
    return;
  }
  saveUndoState();
  gameState.gems -= 15;
  saveState();
  playSound("hammer");
  slots.forEach((s) => (s.innerHTML = ""));
  spawnPieces();
  if (!checkGameOver()) gameOverScreen.style.display = "none";
}

// --- CREATE PIECE IN RACK ---
function createPieceDOM(shape, color) {
  const pieceEl = document.createElement("div");
  pieceEl.classList.add("piece");
  let hasGem = Math.random() < 0.25;
  let gemPlaced = false;

  pieceEl.style.gridTemplateRows = `repeat(${shape.length}, 1fr)`;
  pieceEl.style.gridTemplateColumns = `repeat(${shape[0].length}, 1fr)`;

  const cellEl = document.querySelector(".cell");
  const cellSize = cellEl ? cellEl.clientWidth : 45;
  pieceEl.style.width = `${shape[0].length * (cellSize + 5) - 5}px`;
  pieceEl.style.height = `${shape.length * (cellSize + 5) - 5}px`;

  shape.forEach((row) => {
    row.forEach((val) => {
      const b = document.createElement("div");
      b.classList.add("block");

      // Apply Active Skin to newly spawned pieces
      const activeSkinData = SKINS_DEF.find(
        (s) => s.id === gameState.activeSkin,
      );
      if (activeSkinData && activeSkinData.class) {
        b.classList.add(activeSkinData.class);
      }

      if (val === 1) {
        b.style.backgroundColor = color;
        if (hasGem && !gemPlaced) {
          const gemDiv = document.createElement("div");
          gemDiv.classList.add("gem-inside");
          b.appendChild(gemDiv);
          b.dataset.containsGem = "true";
          gemPlaced = true;
        }
      } else {
        b.classList.add("empty-block");
      }
      pieceEl.appendChild(b);
    });
  });

  pieceEl.dataset.shape = JSON.stringify(shape);
  pieceEl.dataset.color = color;
  pieceEl.dataset.hasGem = gemPlaced ? "true" : "false";

  pieceEl.addEventListener("mousedown", startDrag);
  pieceEl.addEventListener("touchstart", startDrag, { passive: false });
  pieceEl.addEventListener("click", () => {
    if (!isDraggingAction) rotatePiece(pieceEl);
  });
  return pieceEl;
}

function rotatePiece(pieceEl) {
  let shape = JSON.parse(pieceEl.dataset.shape);
  const color = pieceEl.dataset.color;
  const hasGem = pieceEl.dataset.hasGem === "true";
  const r = shape.length,
    c = shape[0].length;

  let newShape = Array(c)
    .fill(null)
    .map(() => Array(r).fill(0));
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      newShape[j][r - 1 - i] = shape[i][j];
    }
  }

  renderRotatedStructure(pieceEl, newShape, color, hasGem);
  playSound("click");
}

function renderRotatedStructure(pieceEl, shape, color, hasGem) {
  pieceEl.innerHTML = "";
  pieceEl.style.gridTemplateRows = `repeat(${shape.length}, 1fr)`;
  pieceEl.style.gridTemplateColumns = `repeat(${shape[0].length}, 1fr)`;
  let gemPlaced = false;

  shape.forEach((row) => {
    row.forEach((val) => {
      const b = document.createElement("div");
      b.classList.add("block");

      const activeSkinData = SKINS_DEF.find(
        (s) => s.id === gameState.activeSkin,
      );
      if (activeSkinData && activeSkinData.class) {
        b.classList.add(activeSkinData.class);
      }

      if (val === 1) {
        b.style.backgroundColor = color;
        if (hasGem && !gemPlaced) {
          const gemDiv = document.createElement("div");
          gemDiv.classList.add("gem-inside");
          b.appendChild(gemDiv);
          b.dataset.containsGem = "true";
          gemPlaced = true;
        }
      } else {
        b.classList.add("empty-block");
      }
      pieceEl.appendChild(b);
    });
  });
  pieceEl.dataset.shape = JSON.stringify(shape);
}

function spawnPieces() {
  slots.forEach((slot) => {
    if (slot.children.length === 0) {
      // Spawn larger pieces if hardcore mode is active
      const shapesPool = SHAPES;
      const shape = shapesPool[Math.floor(Math.random() * shapesPool.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      slot.appendChild(createPieceDOM(shape, color));
    }
  });
}

// Drag & Drop event bindings
function startDrag(e) {
  if (isHammerActive || isBombActive) return;
  e.preventDefault();
  isDraggingAction = false;
  activePiece = e.currentTarget;

  originalSlot = activePiece.parentElement;

  const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
  const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
  const rect = activePiece.getBoundingClientRect();

  pointerOffset.x = clientX - rect.left;
  pointerOffset.y = clientY - rect.top;

  activePiece.classList.add("dragging");
  activePiece.style.left = `${rect.left}px`;
  activePiece.style.top = `${rect.top}px`;

  document.body.appendChild(activePiece);

  document.addEventListener("mousemove", drag);
  document.addEventListener("touchmove", drag, { passive: false });
  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchend", endDrag);
}

function drag(e) {
  if (!activePiece) return;
  isDraggingAction = true;

  const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
  const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

  const targetX = clientX - pointerOffset.x;
  const targetY = clientY - pointerOffset.y;

  activePiece.style.left = `${targetX}px`;
  activePiece.style.top = `${targetY}px`;

  updateHighlight(clientX, clientY);
}

function updateHighlight(clientX, clientY) {
  clearHighlights();
  const shape = JSON.parse(activePiece.dataset.shape);

  activePiece.style.opacity = "0";
  const elBelow = document.elementFromPoint(clientX, clientY);
  activePiece.style.opacity = "1";

  if (elBelow && elBelow.classList.contains("cell")) {
    const r = parseInt(elBelow.dataset.row);
    const c = parseInt(elBelow.dataset.col);

    if (canPlace(shape, r, c)) {
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
          if (shape[i][j] === 1) {
            const targetCell = boardEl.querySelector(
              `[data-row='${r + i}'][data-col='${c + j}']`,
            );
            if (targetCell) targetCell.classList.add("highlight");
          }
        }
      }
    }
  }
}

function clearHighlights() {
  document
    .querySelectorAll(".cell.highlight")
    .forEach((c) => c.classList.remove("highlight"));
}

function endDrag(e) {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("mouseup", endDrag);
  document.removeEventListener("touchend", endDrag);
  clearHighlights();

  if (!activePiece) return;

  if (isDraggingAction) {
    const shape = JSON.parse(activePiece.dataset.shape);
    const color = activePiece.dataset.color;

    const clientX = e.type.includes("touch")
      ? e.changedTouches[0].clientX
      : e.clientX;
    const clientY = e.type.includes("touch")
      ? e.changedTouches[0].clientY
      : e.clientY;

    activePiece.style.opacity = "0";
    const elBelow = document.elementFromPoint(clientX, clientY);
    activePiece.style.opacity = "1";

    if (elBelow && elBelow.classList.contains("cell")) {
      const r = parseInt(elBelow.dataset.row);
      const c = parseInt(elBelow.dataset.col);

      if (canPlace(shape, r, c)) {
        saveUndoState(); // Store history before mutating

        let blockGemLayout = [];
        activePiece.querySelectorAll(".block").forEach((b) => {
          blockGemLayout.push(b.dataset.containsGem === "true");
        });

        placePiece(shape, color, r, c, blockGemLayout);
        activePiece.remove();

        if (document.querySelectorAll(".piece").length === 0) {
          spawnPieces();
        }

        activePiece = null;
        return;
      }
    }
  }
  returnToRack();
}

function returnToRack() {
  if (!activePiece) return;
  activePiece.classList.remove("dragging");
  activePiece.style.left = "auto";
  activePiece.style.top = "auto";
  if (originalSlot) {
    originalSlot.appendChild(activePiece);
  }
  activePiece = null;
}

function canPlace(shape, sR, sC) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        const tR = sR + r,
          tC = sC + c;
        if (
          tR >= BOARD_SIZE ||
          tC >= BOARD_SIZE ||
          boardState[tR][tC] !== null
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function placePiece(shape, color, sR, sC, gemLayout) {
  let placed = 0;
  let layoutIdx = 0;
  let mainCellX = 0,
    mainCellY = 0;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        boardState[sR + r][sC + c] = color;
        if (gemLayout[layoutIdx]) gemState[sR + r][sC + c] = true;
        placed++;

        if (placed === 1) {
          const firstCell = boardEl.querySelector(
            `[data-row='${sR + r}'][data-col='${sC + c}']`,
          );
          const rect = firstCell.getBoundingClientRect();
          mainCellX = rect.left;
          mainCellY = rect.top;
        }
      }
      layoutIdx++;
    }
  }

  score += placed;
  gameState.totalBlocksPlaced += placed;
  updateDailyMissions("place_blocks", placed);

  // Earn Level XP
  earnXp(placed * 2);

  spawnFloatingScore(mainCellX, mainCellY, `+${placed}`);
  playSound("place");

  // If Boss exists, tick boss moves count
  if (bossActive) {
    bossMovesSinceDmg++;
    if (bossMovesSinceDmg >= 3) {
      spreadBossInfection();
    }
  }

  updateBoardUI();
  checkLineClears(mainCellX, mainCellY);

  // Chance to spawn Boss if score is high and boss not active
  if (score >= 5000 && !bossActive && Math.random() < 0.15) {
    spawnBossBlock();
  }
}

function updateBoardUI() {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = boardEl.querySelector(`[data-row='${r}'][data-col='${c}']`);
      if (!cell || cell.classList.contains("glow-clear")) continue;

      cell.innerHTML = "";
      cell.style.color = "";
      cell.style.boxShadow = "";
      cell.className = "cell"; // clear previous skin classes

      // Check if it is the Boss cell
      if (bossActive && r === bossRow && c === bossCol) {
        cell.classList.add("occupied", "boss-block");
        const hpLabel = document.createElement("div");
        hpLabel.classList.add("boss-hp");
        hpLabel.innerText = `❤️${bossHP}`;
        cell.appendChild(hpLabel);
        continue;
      }

      if (boardState[r][c]) {
        cell.style.backgroundColor = boardState[r][c];
        cell.style.color = boardState[r][c];
        cell.classList.add("occupied");

        // Add active skin details inside occupied cells
        const activeSkinData = SKINS_DEF.find(
          (s) => s.id === gameState.activeSkin,
        );
        if (activeSkinData && activeSkinData.class) {
          cell.classList.add(activeSkinData.class);
        }

        if (gemState[r][c]) {
          const gemDiv = document.createElement("div");
          gemDiv.classList.add("gem-inside");
          cell.appendChild(gemDiv);
        }
      } else {
        cell.style.backgroundColor = "#1e293b";
      }
    }
  }

  // Disable buttons if not enough gems
  hammerBtn.disabled = gameState.gems < 10;
  bombBtn.disabled = gameState.gems < 25;
  undoBtn.disabled = gameState.gems < 20 || undoHistory.length === 0;
  shuffleBtn.disabled = gameState.gems < 15;
}

// --- LINE CLEAR CALCULATOR ---
function checkLineClears(fX, fY) {
  let rToClear = [],
    cToClear = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    if (boardState[r].every((x) => x !== null)) rToClear.push(r);
  }

  for (let c = 0; c < BOARD_SIZE; c++) {
    let full = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (boardState[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) cToClear.push(c);
  }

  const cleared = rToClear.length + cToClear.length;

  if (cleared > 0) {
    streakCount++;
    playSound("blast");
    triggerScreenShake();

    // Check if Boss lies in any of the cleared lines
    if (bossActive) {
      let hitBoss = false;
      rToClear.forEach((r) => {
        if (r === bossRow) hitBoss = true;
      });
      cToClear.forEach((c) => {
        if (c === bossCol) hitBoss = true;
      });
      if (hitBoss) {
        damageBoss(1);
      }
    }

    // Set glow colors
    rToClear.forEach((r) => {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const cell = boardEl.querySelector(
          `[data-row='${r}'][data-col='${c}']`,
        );
        if (cell) {
          cell.style.color = boardState[r][c];
          cell.classList.add("glow-clear");
        }
      }
    });

    cToClear.forEach((c) => {
      for (let r = 0; r < BOARD_SIZE; r++) {
        const cell = boardEl.querySelector(
          `[data-row='${r}'][data-col='${c}']`,
        );
        if (cell) {
          cell.style.color = boardState[r][c];
          cell.classList.add("glow-clear");
        }
      }
    });

    let earnedGems = 0;
    rToClear.forEach((r) => {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (gemState[r][c]) earnedGems++;
      }
    });
    cToClear.forEach((c) => {
      for (let r = 0; r < BOARD_SIZE; r++) {
        if (gemState[r][c]) earnedGems++;
      }
    });

    if (earnedGems > 0) {
      gameState.gems += earnedGems;
      gameState.totalGemsEarned += earnedGems;
      gemsEl.innerText = gameState.gems;
    }

    // Advanced Combo multiplier calculator
    // Original: cleared * 10 * cleared * streakCount
    // Premium Combo:
    let bonusScore = cleared * 15 * cleared * streakCount;
    score += bonusScore;

    // Time Attack bonus time
    if (currentGameMode === "time-attack") {
      timeAttackSeconds = Math.min(120, timeAttackSeconds + cleared * 10);
      updateTimerBar();
    }

    // Stats update
    gameState.totalLinesCleared += cleared;
    updateDailyMissions("clear_lines", cleared);

    if (streakCount > gameState.maxCombo) {
      gameState.maxCombo = streakCount;
    }

    earnXp(cleared * 25 * streakCount);

    rToClear.forEach((r) => {
      for (let c = 0; c < BOARD_SIZE; c++) {
        createParticles(r, c, boardState[r][c]);
      }
    });
    cToClear.forEach((c) => {
      for (let r = 0; r < BOARD_SIZE; r++) {
        createParticles(r, c, boardState[r][c]);
      }
    });

    // Clear board states
    rToClear.forEach((r) => {
      boardState[r].fill(null);
      for (let i = 0; i < BOARD_SIZE; i++) gemState[r][i] = false;
    });
    cToClear.forEach((c) => {
      for (let r = 0; r < BOARD_SIZE; r++) {
        boardState[r][c] = null;
        gemState[r][c] = false;
      }
    });

    updateBoardUI();

    // Floating Combo Score animation text
    let comboEmoji = "🔥";
    if (streakCount === 3) comboEmoji = "⚡";
    if (streakCount >= 4) comboEmoji = "💥";

    spawnFloatingScore(
      fX,
      fY - 25,
      `+${bonusScore} COMBO x${streakCount} ${comboEmoji}`,
      streakCount >= 3 ? "#ffcc00" : "#00ffcc",
    );

    if (streakCount > 1) {
      streakBanner.innerText = `STREAK COMBO x${streakCount} ${comboEmoji}`;
      streakBanner.classList.add("active");
    }

    // Check PERFECT board state (entire board is cleared)
    let isPerfect = true;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (boardState[i][j] !== null) isPerfect = false;
      }
    }
    if (isPerfect && !bossActive) {
      score += 500;
      earnXp(100);
      document.getElementById("perfect-notice").style.display = "block";
      setTimeout(() => {
        const notice = document.getElementById("perfect-notice");
        if (notice) notice.style.display = "none";
      }, 1200);
    }

    // Wait for animations before validating game over
    setTimeout(() => {
      document.querySelectorAll(".cell.glow-clear").forEach((cell) => {
        cell.className = "cell";
        cell.style.backgroundColor = "#1e293b";
        cell.style.color = "";
        cell.style.boxShadow = "";
      });

      // If Zen mode, board cleans itself on full blocks, else triggers gameover
      if (checkGameOver()) {
        if (currentGameMode === "zen") {
          zenClearBoard();
        } else {
          triggerGameOver();
        }
      }
    }, 500);
  } else {
    streakCount = 0;
    streakBanner.classList.remove("active");

    if (checkGameOver()) {
      if (currentGameMode === "zen") {
        zenClearBoard();
      } else {
        triggerGameOver();
      }
    }
  }

  if (score > gameState.highscore) {
    gameState.highscore = score;
    highscoreEl.innerText = gameState.highscore;
  }
  scoreEl.innerText = score;
  saveState();
  checkAchievements();
}

function zenClearBoard() {
  playSound("blast");
  // Clears center 4x4 blocks to let player continue
  const midStart = Math.floor(BOARD_SIZE / 2) - 2;
  for (let r = midStart; r < midStart + 4; r++) {
    for (let c = midStart; c < midStart + 4; c++) {
      if (boardState[r][c] !== null) {
        createParticles(r, c, boardState[r][c]);
        boardState[r][c] = null;
        gemState[r][c] = false;
      }
    }
  }
  updateBoardUI();
  spawnFloatingScore(
    window.innerWidth / 2,
    window.innerHeight / 2,
    "Zen Clear! 🌸",
    "#00ffcc",
  );
}

function triggerGameOver(reason = "Không còn nước đi hợp lệ!") {
  if (timeAttackTimer) clearInterval(timeAttackTimer);

  document.getElementById("game-over-reason").innerText = reason;
  document.getElementById("final-score-text").innerText =
    `Điểm số đạt được: ${score}`;
  gameOverScreen.style.display = "flex";

  // Check if player reaches daily missions goal on game end
  updateDailyMissions("earn_score", score);

  // Sync to local scores leaderboard
  saveToLeaderboard(gameState.lobbyProfileName || "Nature Player", score);
}

// Particle explosion
function createParticles(r, c, color) {
  const cell = boardEl.querySelector(`[data-row='${r}'][data-col='${c}']`);
  if (!cell) return;
  const rect = cell.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");
    p.style.backgroundColor = color || "#00ffcc";

    // Random luxury dust sparkles details
    const size = Math.random() * 6 + 4;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${rect.left + rect.width / 2}px`;
    p.style.top = `${rect.top + rect.height / 2}px`;
    p.style.boxShadow = `0 0 10px ${color || "#00ffcc"}`;

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 80 + 30;
    p.style.setProperty("--mx", `${Math.cos(angle) * distance}px`);
    p.style.setProperty("--my", `${Math.sin(angle) * distance}px`);
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 500);
  }
}

// Shockwave Ring Explosion helper
function spawnShockwave(x, y) {
  const wave = document.createElement("div");
  wave.classList.add("shockwave");
  wave.style.left = `${x - 100}px`;
  wave.style.top = `${y - 100}px`;
  document.body.appendChild(wave);
  setTimeout(() => wave.remove(), 500);
}

function spawnFloatingScore(x, y, text, color = "#00ffcc") {
  const span = document.createElement("div");
  span.classList.add("floating-score");
  span.innerText = text;
  span.style.left = `${x}px`;
  span.style.top = `${y}px`;
  span.style.color = color;
  document.body.appendChild(span);
  setTimeout(() => span.remove(), 750);
}

function triggerScreenShake() {
  const container = document.getElementById("game-container");
  if (container) {
    container.classList.add("shake");
    setTimeout(() => container.classList.remove("shake"), 150);
  }
}

function checkGameOver() {
  const pieces = document.querySelectorAll(".piece");
  if (pieces.length === 0) return false;
  let valid = false;
  pieces.forEach((p) => {
    const shape = JSON.parse(p.dataset.shape);
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (canPlace(shape, r, c)) valid = true;
      }
    }
  });
  return !valid;
}

function resetGame() {
  gameOverScreen.style.display = "none";
  deactivateHammer();
  deactivateBomb();

  bossActive = false;
  bossHud.style.display = "none";

  initBoard();
  resetGameVars();
  slots.forEach((s) => (s.innerHTML = ""));
  spawnPieces();

  if (currentGameMode === "time-attack") {
    timeAttackSeconds = 120;
    updateTimerBar();
    startTimerLoop();
  }
}

// --- 6. BOSS EVENT DETAILED LOGIC ---
function spawnBossBlock() {
  // Find a suitable position on board
  let candidates = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (boardState[r][c] !== null) candidates.push({ r, c });
    }
  }

  // If board is empty, spawn anywhere
  if (candidates.length === 0) {
    bossRow = Math.floor(Math.random() * BOARD_SIZE);
    bossCol = Math.floor(Math.random() * BOARD_SIZE);
  } else {
    const choice = candidates[Math.floor(Math.random() * candidates.length)];
    bossRow = choice.r;
    bossCol = choice.c;
  }

  bossActive = true;
  bossHP = 5;
  bossMovesSinceDmg = 0;

  boardState[bossRow][bossCol] = "#ff0055"; // Boss color
  gemState[bossRow][bossCol] = false;

  bossHud.style.display = "flex";
  bossHudHp.innerText = `HP: ${bossHP}/5`;
  playSound("bomb");

  spawnFloatingScore(
    window.innerWidth / 2,
    window.innerHeight / 2,
    "😈 BOSS EXTREME WARNING!",
    "#ff0055",
  );
  updateBoardUI();
}

function damageBoss(dmg) {
  if (!bossActive) return;
  bossHP -= dmg;
  bossMovesSinceDmg = 0; // reset counter on damage

  if (bossHP <= 0) {
    // Boss defeated!
    bossActive = false;
    boardState[bossRow][bossCol] = null;
    gemState[bossRow][bossCol] = false;

    gameState.totalBossesKilled++;
    gameState.gems += 30; // bonus gems
    gameState.gold += 1; // bonus royal crowns
    earnXp(500); // Massive XP

    // explosion animations
    playSound("blast");
    createParticles(bossRow, bossCol, "#ff0055");

    bossHud.style.display = "none";
    spawnFloatingScore(
      window.innerWidth / 2,
      window.innerHeight / 2,
      "🎉 BOSS DEFEATED! +30💎 +1👑",
      "#ffd700",
    );
  } else {
    bossHudHp.innerText = `HP: ${bossHP}/5`;
    playSound("hammer");
    spawnFloatingScore(
      window.innerWidth / 2,
      window.innerHeight / 2,
      `BOSS HIT! HP: ${bossHP} 👿`,
      "#ff0055",
    );
  }
  updateBoardUI();
}

function spreadBossInfection() {
  bossMovesSinceDmg = 0; // reset tick

  // Spread normal blocks to 1 random adjacent empty cell
  const dirs = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 },
  ];
  let emptyCells = [];

  dirs.forEach((d) => {
    const nr = bossRow + d.r;
    const nc = bossCol + d.c;
    if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
      if (boardState[nr][nc] === null) emptyCells.push({ r: nr, c: nc });
    }
  });

  if (emptyCells.length > 0) {
    const choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    boardState[choice.r][choice.c] = "#550011"; // dark infected block color
    gemState[choice.r][choice.c] = false;

    createParticles(choice.r, choice.c, "#ff0055");
    playSound("place");

    spawnFloatingScore(
      window.innerWidth / 2,
      window.innerHeight / 2,
      "☣️ Boss Infection Spreading!",
      "#ff0055",
    );
    updateBoardUI();
  }
}

// --- 7. BACKGROUND ROTATOR & TRANSITIONS ---
function changeBackground() {
  currentBgIndex = (currentBgIndex + 1) % BACKGROUNDS.length;
  const nextBg = BACKGROUNDS[currentBgIndex];

  // Preload image
  const imgPreload = new Image();
  imgPreload.src = nextBg.url;
  imgPreload.onload = function () {
    document.body.style.backgroundImage = `url('${nextBg.url}')`;
    document.getElementById("theme-name").innerText = nextBg.name;

    // Change day-night style cycle on body
    document.body.className = ""; // reset
    document.body.classList.add(`${nextBg.dayCycle}-mode`);

    // Update weather canvas particle systems
    initWeather(nextBg.weather);
  };
  playSound("click");
}

// --- 8. UI OVERLAYS MODALS LOGIC ---
function openModal(id) {
  playSound("click");
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("active");
    if (id === "shop-modal") {
      renderShopGrid();
    } else if (id === "missions-modal") {
      renderMissionsList();
    } else if (id === "leaderboard-modal") {
      renderLeaderboard();
    } else if (id === "stats-modal") {
      renderStatsModal();
    } else if (id === "spin-modal") {
      drawLuckySpinWheel();
    }
  }
}

function closeModal(id) {
  playSound("click");
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("active");
    syncLobbyUI();
  }
}

// --- LEADERBOARD & STATS STORES ---
function saveToLeaderboard(name, sc) {
  let leaderboard = JSON.parse(localStorage.getItem("bb_leaderboard")) || [
    { name: "Admin 👑", score: 99999 },
  ];

  leaderboard.push({ name, score: sc });
  // Sort descending
  leaderboard.sort((a, b) => b.score - a.score);
  // Keep top 5
  leaderboard = leaderboard.slice(0, 5);

  localStorage.setItem("bb_leaderboard", JSON.stringify(leaderboard));
}

function renderLeaderboard() {
  const container = document.getElementById("leaderboard-container");
  const leaderboard = JSON.parse(localStorage.getItem("bb_leaderboard")) || [
    { name: "Admin 👑", score: 99999 },
  ];

  container.innerHTML = "";
  leaderboard.forEach((item, idx) => {
    const el = document.createElement("div");
    el.classList.add("leaderboard-item");
    el.innerHTML = `
      <span class="leaderboard-rank">#${idx + 1}</span>
      <span class="leaderboard-name">${item.name}</span>
      <span class="leaderboard-score">${item.score}</span>
    `;
    container.appendChild(el);
  });
}

function renderStatsModal() {
  document.getElementById("stats-games-played").innerText =
    gameState.gamesPlayed;
  document.getElementById("stats-highscore").innerText = gameState.highscore;
  document.getElementById("stats-max-combo").innerText = gameState.maxCombo;
  document.getElementById("stats-blocks-placed").innerText =
    gameState.totalBlocksPlaced;
  document.getElementById("stats-lines-cleared").innerText =
    gameState.totalLinesCleared;
  document.getElementById("stats-gems-earned").innerText =
    gameState.totalGemsEarned;
  document.getElementById("stats-hammers-used").innerText =
    gameState.totalHammersUsed;
  document.getElementById("stats-bosses-killed").innerText =
    gameState.totalBossesKilled;
}

function resetAllStats() {
  if (
    confirm(
      "Bạn có chắc chắn muốn xóa trắng toàn bộ dữ liệu game? Điểm số, ngọc và thành tựu sẽ mất hết!",
    )
  ) {
    localStorage.removeItem("bb_luxury_save");
    gameState = {
      score: 0,
      highscore: 0,
      gems: 20,
      gold: 0,
      crystal: 0,
      level: 1,
      xp: 0,
      gamesPlayed: 0,
      totalGemsEarned: 20,
      totalHammersUsed: 0,
      totalBossesKilled: 0,
      maxCombo: 0,
      totalBlocksPlaced: 0,
      totalLinesCleared: 0,
      activeSkin: "default",
      unlockedSkins: ["default"],
      soundEnabled: true,
      musicEnabled: true,
      lastSpinTime: 0,
      currentMissions: [],
      unlockedAchievements: [],
    };
    saveState();
    syncLobbyUI();
    closeModal("stats-modal");
  }
}

// --- PREMIUM SHOP CODE ---
let activeShopTab = "skins";
function switchShopTab(tab) {
  playSound("click");
  activeShopTab = tab;
  document
    .getElementById("tab-btn-skins")
    .classList.toggle("active", tab === "skins");
  document
    .getElementById("tab-btn-powerups")
    .classList.toggle("active", tab === "powerups");
  document
    .getElementById("tab-btn-exchange")
    .classList.toggle("active", tab === "exchange");

  document.getElementById("shop-skins-tab").style.display =
    tab === "skins" ? "grid" : "none";
  document.getElementById("shop-powerups-tab").style.display =
    tab === "powerups" ? "grid" : "none";
  document.getElementById("shop-exchange-tab").style.display =
    tab === "exchange" ? "grid" : "none";

  renderShopGrid();
}

function renderShopGrid() {
  const skinsContainer = document.getElementById("shop-skins-tab");
  const powerupsContainer = document.getElementById("shop-powerups-tab");

  if (activeShopTab === "skins") {
    skinsContainer.innerHTML = "";
    SKINS_DEF.forEach((skin) => {
      const box = document.createElement("div");
      box.classList.add("shop-item-box");

      const isUnlocked = gameState.unlockedSkins.includes(skin.id);
      const isActive = gameState.activeSkin === skin.id;

      let priceLabel = "";
      let buttonHtml = "";

      if (isActive) {
        buttonHtml = `<button class="shop-buy-btn equipped">Đang Dùng</button>`;
      } else if (isUnlocked) {
        buttonHtml = `<button class="shop-buy-btn equip" onclick="equipSkin('${skin.id}')">Trang bị</button>`;
      } else {
        const icon =
          skin.currency === "gold"
            ? "👑"
            : skin.currency === "crystal"
              ? "💠"
              : "💎";
        priceLabel = `${skin.price} ${icon}`;
        buttonHtml = `<button class="shop-buy-btn buy" onclick="buySkin('${skin.id}', ${skin.price}, '${skin.currency}')">Mua</button>`;
      }

      // visual preview representation
      const previewClass = skin.class
        ? `class="block ${skin.class}"`
        : `class="block" style="background:#00ffcc;"`;

      box.innerHTML = `
        <div class="shop-item-preview">
          <div ${previewClass} style="width:30px; height:30px;"></div>
        </div>
        <div class="shop-item-name">${skin.name}</div>
        <div class="shop-item-price">${priceLabel}</div>
        ${buttonHtml}
      `;
      skinsContainer.appendChild(box);
    });
  } else if (activeShopTab === "powerups") {
    powerupsContainer.innerHTML = "";
    const items = [
      {
        id: "hammer",
        name: "🔨 Búa tạ",
        desc: "Đập phá 1 ô bất kỳ",
        price: 10,
        countKey: "gems",
      },
      {
        id: "bomb",
        name: "💣 Bom phá",
        desc: "Xóa sổ ô cờ 3x3",
        price: 25,
        countKey: "gems",
      },
      {
        id: "undo",
        name: "↩️ Hoàn tác",
        desc: "Quay lại 1 nước đi",
        price: 20,
        countKey: "gems",
      },
      {
        id: "shuffle",
        name: "🔄 Đổi mảnh",
        desc: "Thay đổi rack xếp",
        price: 15,
        countKey: "gems",
      },
    ];

    items.forEach((item) => {
      const box = document.createElement("div");
      box.classList.add("shop-item-box");
      box.innerHTML = `
        <div class="shop-item-preview">${item.name.split(" ")[0]}</div>
        <div class="shop-item-name">${item.name}</div>
        <p style="font-size:9.5px; color:#cbd5e1; height:20px; overflow:hidden;">${item.desc}</p>
        <div class="shop-item-price">${item.price} 💎</div>
        <button class="shop-buy-btn buy" onclick="buyPowerupDirect('${item.id}', ${item.price})">Mua liền</button>
      `;
      powerupsContainer.appendChild(box);
    });
  }
}

function buySkin(id, price, currency) {
  if (gameState[currency] < price) {
    alert("Bạn không có đủ số lượng tiền tệ VIP này!");
    return;
  }

  gameState[currency] -= price;
  gameState.unlockedSkins.push(id);
  playSound("levelup");
  saveState();
  renderShopGrid();
  syncLobbyUI();
}

function equipSkin(id) {
  gameState.activeSkin = id;
  playSound("click");
  saveState();
  renderShopGrid();
}

function buyPowerupDirect(id, price) {
  if (gameState.gems < price) {
    alert("Bạn không đủ ngọc 💎!");
    return;
  }
  gameState.gems -= price;
  // Increase current game currency parameters
  alert(`Đã thanh toán ${price}💎 vật phẩm ${id} để sử dụng khi chơi!`);
  playSound("levelup");
  saveState();
  syncLobbyUI();
  renderShopGrid();
}

function exchangeCurrency(type) {
  if (type === "gems-to-gold") {
    if (gameState.gems < 500) {
      alert("Bạn không đủ 500 💎!");
      return;
    }
    gameState.gems -= 500;
    gameState.gold += 10;
  } else if (type === "gems-to-crystal") {
    if (gameState.gems < 1000) {
      alert("Bạn không đủ 1000 💎!");
      return;
    }
    gameState.gems -= 1000;
    gameState.crystal += 15;
  }
  playSound("levelup");
  saveState();
  syncLobbyUI();
  alert("Quy đổi tiền tệ VIP thành công!");
}

// --- LUCKY SPIN WHEEL SYSTEM ---
const SPIN_PRIZES = [
  {
    text: "15 Gems 💎",
    gift: () => {
      gameState.gems += 15;
      return "15 Gems 💎";
    },
  },
  {
    text: "30 Gems 💎",
    gift: () => {
      gameState.gems += 30;
      return "30 Gems 💎";
    },
  },
  {
    text: "50 Gems 💎",
    gift: () => {
      gameState.gems += 50;
      return "50 Gems 💎";
    },
  },
  {
    text: "1 Crown 👑",
    gift: () => {
      gameState.gold += 1;
      return "1 Gold Crown 👑";
    },
  },
  {
    text: "2 Crystals 💠",
    gift: () => {
      gameState.crystal += 2;
      return "2 Crystal 💠";
    },
  },
  {
    text: "Free Hammer 🔨",
    gift: () => {
      gameState.gems += 10;
      return "1 Free Hammer 🔨 (quy đổi 10💎)";
    },
  },
  {
    text: "Free Bomb 💣",
    gift: () => {
      gameState.gems += 25;
      return "1 Free Bomb 💣 (quy đổi 25💎)";
    },
  },
  {
    text: "Try Again 🍀",
    gift: () => {
      return "May mắn lần sau! Chúc bạn vui vẻ";
    },
  },
];

function drawLuckySpinWheel() {
  const container = document.getElementById("spin-wheel-canvas");
  container.innerHTML = "";

  // Make SVG element
  const size = 200;
  let paths = "";

  const arcSize = 360 / SPIN_PRIZES.length;
  for (let i = 0; i < SPIN_PRIZES.length; i++) {
    const angleStart = i * arcSize;
    const angleEnd = (i + 1) * arcSize;

    // Coordinates calculation
    const radStart = ((angleStart - 90) * Math.PI) / 180;
    const radEnd = ((angleEnd - 90) * Math.PI) / 180;

    const x1 = 100 + 100 * Math.cos(radStart);
    const y1 = 100 + 100 * Math.sin(radStart);
    const x2 = 100 + 100 * Math.cos(radEnd);
    const y2 = 100 + 100 * Math.sin(radEnd);

    const color =
      i % 2 === 0 ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 255, 204, 0.15)";

    paths += `<path d="M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z" fill="${color}" stroke="rgba(255,255,255,0.2)"/>`;

    // Label
    const textAngle = angleStart + arcSize / 2 - 90;
    const textRad = (textAngle * Math.PI) / 180;
    const tx = 100 + 60 * Math.cos(textRad);
    const ty = 100 + 60 * Math.sin(textRad);

    // Shorten text
    const label =
      SPIN_PRIZES[i].text.split(" ")[0] +
      (SPIN_PRIZES[i].text.includes("💎")
        ? "💎"
        : SPIN_PRIZES[i].text.includes("👑")
          ? "👑"
          : SPIN_PRIZES[i].text.includes("💠")
            ? "💠"
            : "");

    paths += `<text x="${tx}" y="${ty}" transform="rotate(${textAngle + 90}, ${tx}, ${ty})" fill="#fff" font-size="8" font-weight="800" text-anchor="middle">${label}</text>`;
  }

  container.innerHTML = `<svg width="200" height="200" viewBox="0 0 200 200">${paths}</svg>`;

  // Set spin button label correctly
  const now = Date.now();
  const timeDiff = now - gameState.lastSpinTime;
  const isFree = timeDiff >= 24 * 60 * 60 * 1000;

  const spinBtn = document.getElementById("spin-start-btn");
  if (isFree) {
    spinBtn.innerText = "QUAY NGAY! (Miễn phí)";
  } else {
    spinBtn.innerText = "QUAY LẠI (30 💎)";
  }
}

let isSpinning = false;
function triggerSpin() {
  if (isSpinning) return;

  const now = Date.now();
  const timeDiff = now - gameState.lastSpinTime;
  const isFree = timeDiff >= 24 * 60 * 60 * 1000;

  if (!isFree && gameState.gems < 30) {
    alert("Bạn không đủ ngọc 💎 để tiếp tục quay!");
    return;
  }

  if (!isFree) {
    gameState.gems -= 30;
  }

  isSpinning = true;
  gameState.lastSpinTime = now;
  saveState();

  // Random degrees spin arithmetics
  const index = Math.floor(Math.random() * SPIN_PRIZES.length);
  const degreeBase = 3600; // 10 spins minimum
  const sliceDegrees = 360 / SPIN_PRIZES.length;
  // center rotation correction
  const rotateTo = degreeBase + (360 - index * sliceDegrees - sliceDegrees / 2);

  const wheel = document.getElementById("spin-wheel-canvas");
  wheel.style.transform = `rotate(${rotateTo}deg)`;

  // Play click ticking sounds
  let ticks = 0;
  const tickTimer = setInterval(() => {
    ticks++;
    playSound("spin");
    if (ticks >= 40) clearInterval(tickTimer);
  }, 100);

  setTimeout(() => {
    isSpinning = false;
    clearInterval(tickTimer);

    const rewardText = SPIN_PRIZES[index].gift();
    alert(`Chúc mừng! Bạn đã quay trúng: ${rewardText}`);
    playSound("levelup");

    // reset rotation visually back
    wheel.style.transition = "none";
    wheel.style.transform = `rotate(${rotateTo % 360}deg)`;
    setTimeout(() => {
      wheel.style.transition = "transform 4s cubic-bezier(0.15, 0.85, 0.25, 1)";
    }, 50);

    saveState();
    syncLobbyUI();
    closeModal("spin-modal");
  }, 4200);
}

// --- CLAIM GIFT BOX INTERACTIVE POP ---
function claimGiftBox() {
  const giftBox = document.getElementById("gift-box-element");
  if (giftBox.classList.contains("open")) return;

  giftBox.classList.add("open");
  playSound("bomb");

  setTimeout(() => {
    giftBox.style.opacity = "0";
    giftBox.style.transform = "scale(0)";

    // Random Gift Box rewards generator
    const rewards = [
      { text: "50 Gems 💎", claim: () => (gameState.gems += 50) },
      { text: "100 Gems 💎", claim: () => (gameState.gems += 100) },
      { text: "3 Gold Crowns 👑", claim: () => (gameState.gold += 3) },
      {
        text: "Free Ice Skin 🧊",
        claim: () => {
          if (!gameState.unlockedSkins.includes("ice"))
            gameState.unlockedSkins.push("ice");
          else gameState.gems += 40; // compensation
        },
      },
    ];

    const prize = rewards[Math.floor(Math.random() * rewards.length)];
    prize.claim();
    playSound("levelup");

    document.getElementById("gift-reward-text").innerText = prize.text;
    document.getElementById("gift-reward-reveal").style.display = "block";
    document.getElementById("gift-close-btn").style.display = "inline-block";

    saveState();
    syncLobbyUI();
  }, 800);
}

// --- 9. DAILY MISSIONS COMPONENT ---
function generateDailyMissions() {
  const list = [
    {
      type: "earn_score",
      title: "Đạt 3000 điểm cờ",
      target: 3000,
      current: 0,
      reward: 20,
      done: false,
    },
    {
      type: "clear_lines",
      title: "Xóa 15 hàng ngang/dọc",
      target: 15,
      current: 0,
      reward: 20,
      done: false,
    },
    {
      type: "use_hammer",
      title: "Sử dụng 3 búa tạ phá gạch",
      target: 3,
      current: 0,
      reward: 20,
      done: false,
    },
    {
      type: "place_blocks",
      title: "Đặt 150 khối gạch lên cờ",
      target: 150,
      current: 0,
      reward: 20,
      done: false,
    },
  ];

  // pick 3 random missions
  list.sort(() => 0.5 - Math.random());
  gameState.currentMissions = list.slice(0, 3);
  saveState();
}

function updateDailyMissions(type, val) {
  let updated = false;
  gameState.currentMissions.forEach((m) => {
    if (m.type === type && !m.done) {
      m.current = Math.min(m.target, m.current + val);
      if (m.current >= m.target) {
        m.done = true;
        // give gems reward immediately
        gameState.gems += m.reward;
        gameState.totalGemsEarned += m.reward;
        alert(
          `Chúc mừng! Đã hoàn thành nhiệm vụ ngày: [${m.title}] nhận thưởng 💎${m.reward}`,
        );
        playSound("levelup");
      }
      updated = true;
    }
  });
  if (updated) saveState();
}

function renderMissionsList() {
  const container = document.getElementById("mission-list-container");
  container.innerHTML = "";

  if (gameState.currentMissions.length === 0) {
    generateDailyMissions();
  }

  gameState.currentMissions.forEach((m) => {
    const el = document.createElement("div");
    el.classList.add("mission-item");

    const pct = (m.current / m.target) * 100;
    const checkIcon = m.done ? "✅" : "☐";

    el.innerHTML = `
      <div class="mission-check">${checkIcon}</div>
      <div class="mission-info">
        <div class="mission-title">${m.title}</div>
        <div class="mission-progress-bar">
          <div class="mission-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <div style="font-size:9.5px; color:#cbd5e1; margin-top:2px;">Tiến trình: ${m.current} / ${m.target}</div>
      </div>
      <div class="mission-reward">💎${m.reward}</div>
    `;
    container.appendChild(el);
  });
}

// --- 10. ACHIEVEMENTS CONTROLLER ---
function checkAchievements() {
  ACHIEVEMENTS_DEF.forEach((ach) => {
    if (!gameState.unlockedAchievements.includes(ach.id)) {
      if (ach.condition(gameState)) {
        gameState.unlockedAchievements.push(ach.id);
        // Reward 15 Gems!
        gameState.gems += 15;
        saveState();

        spawnFloatingScore(
          window.innerWidth / 2,
          window.innerHeight / 2,
          `🏆 ĐÃ ĐẠT THÀNH TỰU: ${ach.title}`,
          "#ffd700",
        );
        playSound("levelup");
      }
    }
  });
}

// Draw achievements popup list
// In achievements-modal
const modalOverlays = document.querySelectorAll(".modal-overlay");
modalOverlays.forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal(overlay.id);
    }
  });
});

// Mock sync cloud save function
function syncCloud() {
  playSound("click");
  const cloudBtn = document.getElementById("cloud-btn");
  cloudBtn.innerText = "⏳";

  setTimeout(() => {
    cloudBtn.innerText = "☁️";
    alert(
      "Đồng bộ dữ liệu đám mây thành công! Trạng thái điểm số, cấp độ và skin của bạn đã được sao lưu.",
    );
    playSound("levelup");
  }, 1000);
}

// Register close key handler for modal
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const activeModal = document.querySelector(".modal-overlay.active");
    if (activeModal) closeModal(activeModal.id);
  }
});

// --- 11. INITIALIZATION ON READY ---
initCustomMusicUploader();
initAuth();
generateDailyMissions();

// Render achievements grid layout directly inside index.html placeholder on demand
document.querySelector(".lobby-nav-grid").addEventListener("click", () => {
  // Populate achievements dynamically
  const container = document.getElementById("achievements-modal");
  if (container) {
    let content = container.querySelector(".achievements-list");
    if (!content) {
      content = document.createElement("div");
      content.classList.add("achievements-list");
      container.querySelector(".modal-content").appendChild(content);
    }
    content.innerHTML = "";
    ACHIEVEMENTS_DEF.forEach((ach) => {
      const isUnlocked = gameState.unlockedAchievements.includes(ach.id);
      const item = document.createElement("div");
      item.classList.add("achievement-item");
      if (isUnlocked) item.classList.add("unlocked");

      item.innerHTML = `
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-details">
          <div class="achievement-title">${ach.title}</div>
          <div class="achievement-desc">${ach.desc}</div>
        </div>
        <div style="font-size:12px; font-weight:800; color:#ffcc00;">${isUnlocked ? "ĐÃ ĐẠT" : "CHƯA"}</div>
      `;
      content.appendChild(item);
    });
  }
});

// Add achievements modal structure fallback
(function createAchievementsModal() {
  if (!document.getElementById("achievements-modal")) {
    const modal = document.createElement("div");
    modal.id = "achievements-modal";
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">DANH HIỆU THÀNH TỰU</h2>
          <button class="close-btn" onclick="closeModal('achievements-modal')">×</button>
        </div>
        <div class="achievements-list"></div>
      </div>
    `;
    document.body.appendChild(modal);

    // Add close click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal("achievements-modal");
    });
  }
})();
// Thêm thông báo chào mừng vào khi trang vừa tải xong
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("Đang khởi chạy thông báo chào mừng...");

  const banner = document.createElement("div");
  banner.style.cssText = `
        position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
        background:linear-gradient(135deg,#00d2ff,#3a7bd5);
        color:#fff; padding:20px 35px; border-radius:20px;
        font-size:18px; font-weight:900; z-index:999999;
        box-shadow:0 0 40px rgba(0, 210, 255, 0.5); text-align:center;
        animation: levelPopAnim 0.5s ease;
    `;
  banner.innerHTML =
    "👋 CHÀO MỪNG BẠN ĐÃ ĐẾN VỚI BÌNH DZ! <br><span style='font-size:13px;font-weight:700;'>Chúc bạn chơi vui vẻ!</span>";
  document.body.appendChild(banner);

  // Xóa sau 3 giây
  setTimeout(() => banner.remove(), 3000);
});
