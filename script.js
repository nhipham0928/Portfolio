// ==================== QUẢN LÝ THEME ====================
const themeToggle = document.getElementById("theme-toggle");

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    if (themeToggle) themeToggle.textContent = "🌙";
} else {
    if (themeToggle) themeToggle.textContent = "☀️";
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        const isLight = document.body.classList.contains("light-mode");
        localStorage.setItem("theme", isLight ? "light" : "dark");
        themeToggle.textContent = isLight ? "🌙" : "☀️";
    });
}

// ==================== MOBILE MENU ====================
const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
        siteNav.classList.toggle("active");
        const isOpen = siteNav.classList.contains("active");
        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    document.querySelectorAll(".site-nav a").forEach(link => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });
}

// ==================== XỬ LÝ ÂM THANH NỀN & TAB MUSIC ====================
const soundToggle = document.getElementById("sound-toggle");
const backgroundMusic = document.getElementById("background-music");
const hobbyButtons = document.querySelectorAll(".hobby-tabs button");
const hobbyDisplay = document.getElementById("hobby-content");
const hobbiesBlock = document.querySelector(".hobby-tabs")?.parentElement; // Khung chứa Hobbies

// Hàm hỗ trợ bật nhạc và đồng bộ nút loa trên Header
function startMusic() {
    if (!backgroundMusic) return;
    backgroundMusic.volume = 0.3; // Âm lượng vừa phải
    backgroundMusic.play()
        .then(() => {
            if (soundToggle) {
                soundToggle.textContent = "🔊";
                soundToggle.classList.add("playing");
            }
        })
        .catch(err => console.log("Trình duyệt chặn phát âm thanh:", err));
}

// Hàm hỗ trợ dừng nhạc và đồng bộ nút loa
function stopMusic() {
    if (!backgroundMusic) return;
    backgroundMusic.pause();
    if (soundToggle) {
        soundToggle.textContent = "🔇";
        soundToggle.classList.remove("playing");
    }
}

// Nút bấm loa trên Header (bấm thủ công)
if (soundToggle && backgroundMusic) {
    soundToggle.addEventListener("click", () => {
        if (backgroundMusic.paused) {
            startMusic();
        } else {
            stopMusic();
        }
    });
}

// ==================== NỘI DUNG & SỰ KIỆN TAB HOBBIES ====================
const hobbyDescriptions = {
    music: `
        <div class="music-intro">
            <strong>🎵 Favorite Track:</strong>
            <p>A gentle melody I keep on repeat while coding and running experiments. Hope you enjoy it too! ✨</p>
        </div>
    `,
    art: "🎨 Astronomy-inspired visuals, celestial palettes, and creative web design.",
    books: "📚 Forensic science, criminal psychology, and books that unravel the hidden mechanics of the human mind.",
    meme: "🫠 A curated collection of chaotic memes to keep the bugs from breaking my spirit."
};

hobbyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        hobbyButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const key = btn.getAttribute("data-hobby");

        if (hobbyDisplay && hobbyDescriptions[key]) {
            hobbyDisplay.innerHTML = hobbyDescriptions[key];
        }

        // Nếu bấm tab Music -> Phát nhạc
        if (key === "music") {
            startMusic();
        } else {
            // Bấm qua tab khác (Art, Books, Meme) -> Tắt nhạc
            stopMusic();
        }
    });
});

// ==================== TỰ ĐỘNG TẮT NHẠC KHI LƯỚT ĐI NƠI KHÁC ====================
// Sử dụng IntersectionObserver theo dõi khu vực Hobbies
if (hobbiesBlock) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Khi khu vực Hobbies bị cuộn khuất khỏi tầm nhìn màn hình (isIntersecting = false)
            if (!entry.isIntersecting) {
                if (backgroundMusic && !backgroundMusic.paused) {
                    stopMusic();
                }
            }
        });
    }, {
        threshold: 0.1 // Chỉ cần lướt khỏi vùng hiển thị là ngắt nhạc
    });

    observer.observe(hobbiesBlock);
}

// ==================== BẦU TRỜI SAO (TỐI) & HOA / TUYẾT RƠI (SÁNG) ====================
const celestialCanvas = document.getElementById("celestial-canvas");

// 👉 BẠN CHỌN HIỆU ỨNG CHO CHẾ ĐỘ SÁNG TẠI ĐÂY:
// Đổi thành "petal" (cánh hoa bay) hoặc "snowflake" (bông tuyết rơi)
const LIGHT_EFFECT = "petal"; // "petal" hoặc "snowflake"

if (celestialCanvas) {
    const ctx = celestialCanvas.getContext("2d");
    let width, height;
    
    // Biến cho Dark Mode
    let stars = [];
    let crossStars = [];
    let shootingStars = [];

    // Biến cho Light Mode
    let lightParticles = [];

    function resizeCanvas() {
        width = celestialCanvas.width = window.innerWidth;
        height = celestialCanvas.height = window.innerHeight;
        initStarfield();
        initLightParticles();
    }

    // 1. KHỞI TẠO SAO ĐÊM (DARK MODE)
    function initStarfield() {
        stars = [];
        crossStars = [];
        const starCount = Math.floor((width * height) / 7500);
        const starColors = ["#E2E8F0", "#CBD5E1", "#F6D68E", "#94A3B8"];

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.1 + 0.3,
                alpha: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.005,
                color: starColors[Math.floor(Math.random() * starColors.length)]
            });
        }

        const crossCount = Math.max(4, Math.floor(width / 220));
        for (let i = 0; i < crossCount; i++) {
            crossStars.push({
                x: Math.random() * width,
                y: Math.random() * (height * 0.8),
                size: Math.random() * 5 + 5,
                alpha: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.015 + 0.005,
                color: "#E5BE6C"
            });
        }
    }

    // 2. KHỞI TẠO CÁNH HOA / BÔNG TUYẾT (LIGHT MODE)
    function initLightParticles() {
        lightParticles = [];
        // Số lượng hạt vừa phải (khoảng 35 - 45 hạt) để không che khuất chữ
        const particleCount = Math.max(30, Math.floor(width / 35));

        for (let i = 0; i < particleCount; i++) {
            lightParticles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 6 + 6,          // Kích thước
                speedY: Math.random() * 1.2 + 0.8,     // Tốc độ rơi xuống
                speedX: Math.random() * 0.8 + 0.4,     // Tốc độ dạt ngang theo gió
                wobble: Math.random() * Math.PI * 2,   // Độ chao đảo
                wobbleSpeed: Math.random() * 0.03 + 0.015,
                rotation: Math.random() * Math.PI * 2, // Góc xoay cánh hoa
                rotationSpeed: (Math.random() - 0.5) * 0.03,
                opacity: Math.random() * 0.35 + 0.35   // Độ trong suốt dịu nhẹ
            });
        }
    }

    // Vẽ sao 4 cánh (Dark Mode)
    function drawCrossStar(x, y, size, alpha, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.2);
        glow.addColorStop(0, color);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(0, 0, size * 0.16, 0);
        ctx.quadraticCurveTo(0, 0, 0, size);
        ctx.quadraticCurveTo(0, 0, -size * 0.16, 0);
        ctx.quadraticCurveTo(0, 0, 0, -size);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-size * 0.7, 0);
        ctx.quadraticCurveTo(0, 0, 0, size * 0.12);
        ctx.quadraticCurveTo(0, 0, size * 0.7, 0);
        ctx.quadraticCurveTo(0, 0, 0, -size * 0.12);
        ctx.quadraticCurveTo(0, 0, -size * 0.7, 0);
        ctx.fill();

        ctx.restore();
    }

    // Vẽ 1 cánh hoa lượn sóng (Tone xanh ngọc / xanh pastel êm dịu)
    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        // Co bóp trục Y theo hàm sin để tạo cảm giác cánh hoa đang lật trong không gian 3D
        ctx.scale(1, Math.sin(p.wobble)); 
        ctx.globalAlpha = p.opacity;

        // Gradient chuyển màu cho cánh hoa
        const grad = ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
        grad.addColorStop(0, "rgba(255, 214, 246, 0.9)");
        grad.addColorStop(0.6, "rgba(251, 178, 234, 0.75)"); 
        grad.addColorStop(1, "rgba(180, 212, 252, 0.6)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        // Vẽ hình dáng cánh hoa mềm mại
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size * 0.9, -p.size * 0.3, 0, p.size);
        ctx.quadraticCurveTo(-p.size * 0.9, -p.size * 0.3, 0, -p.size);
        ctx.fill();

        ctx.restore();
    }

    // Vẽ 1 bông tuyết tròn mờ ảo
    function drawSnowflake(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.globalAlpha = p.opacity;

        const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 0.65);
        radGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        radGrad.addColorStop(0.4, "rgba(186, 230, 253, 0.75)");
        radGrad.addColorStop(1, "rgba(186, 230, 253, 0)");

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.65, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // VÒNG LẶP RENDER CHÍNH
    function renderSky() {
        ctx.clearRect(0, 0, width, height);
        const isLightMode = document.body.classList.contains("light-mode");

        if (isLightMode) {
            // ==================== XỬ LÝ CHẾ ĐỘ SÁNG ====================
            for (let p of lightParticles) {
                // Di chuyển vị trí
                p.y += p.speedY;
                p.x += Math.sin(p.wobble) * 1.1 + p.speedX;
                p.wobble += p.wobbleSpeed;
                p.rotation += p.rotationSpeed;

                // Khi rơi quá đáy màn hình hoặc trôi quá lề phải -> hồi sinh lên đỉnh
                if (p.y > height + 20) {
                    p.y = -20;
                    p.x = Math.random() * width;
                }
                if (p.x > width + 20) {
                    p.x = -20;
                }

                // Vẽ theo kiểu đã chọn
                if (LIGHT_EFFECT === "snowflake") {
                    drawSnowflake(p);
                } else {
                    drawPetal(p);
                }
            }
        } else {
            // ==================== XỬ LÝ CHẾ ĐỘ TỐI (STARRY NIGHT) ====================
            for (let star of stars) {
                star.alpha += star.speed;
                const currentAlpha = 0.08 + 0.28 * Math.abs(Math.sin(star.alpha));
                ctx.fillStyle = star.color;
                ctx.globalAlpha = currentAlpha;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            for (let cs of crossStars) {
                cs.alpha += cs.speed;
                const currentAlpha = 0.12 + 0.22 * Math.abs(Math.sin(cs.alpha));
                drawCrossStar(cs.x, cs.y, cs.size, currentAlpha, cs.color);
            }

            // Sao băng
            if (Math.random() < 0.007 && shootingStars.length < 2) {
                shootingStars.push({
                    x: Math.random() * width,
                    y: Math.random() * (height * 0.35),
                    length: Math.random() * 80 + 60,
                    speed: Math.random() * 9 + 7,
                    angle: Math.PI / 4,
                    opacity: 1,
                    decay: 0.015
                });
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const ss = shootingStars[i];
                ctx.save();
                ctx.globalAlpha = ss.opacity;
                const endX = ss.x - Math.cos(ss.angle) * ss.length;
                const endY = ss.y - Math.sin(ss.angle) * ss.length;

                const trail = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
                trail.addColorStop(0, "#FFFFFF");
                trail.addColorStop(0.3, "#F6D68E");
                trail.addColorStop(1, "transparent");

                ctx.strokeStyle = trail;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(ss.x, ss.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                ctx.restore();

                ss.x += Math.cos(ss.angle) * ss.speed;
                ss.y += Math.sin(ss.angle) * ss.speed;
                ss.opacity -= ss.decay;

                if (ss.opacity <= 0 || ss.x > width + 100 || ss.y > height + 100) {
                    shootingStars.splice(i, 1);
                }
            }
        }

        requestAnimationFrame(renderSky);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    renderSky();
}