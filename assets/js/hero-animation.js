// Hero Particle Animation using tsParticles

let particlesInstance = null;

function initHeroParticles() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log('パーティクルアニメーション：簡略化モード');
        return;
    }

    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Get device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    // Configure particles
    const particlesConfig = {
        particles: {
            number: {
                value: window.innerWidth < 768 ? 60 : 120, // Reduce particles on mobile
                density: {
                    enable: true,
                    area: 800
                }
            },
            color: {
                value: ["#64b4ff", "#8ab4d4", "#ffffff"]
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.6,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#64b4ff",
                opacity: 0.3,
                width: 1
            },
            move: {
                enable: true,
                speed: 0.3,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: false,
                    mode: "grab"
                },
                onclick: {
                    enable: false,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true,
        fps_limit: 60,
        background: {
            color: "transparent"
        }
    };

    // Load particles
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("hero-canvas", particlesConfig).then(container => {
            particlesInstance = container;
            console.log('ヒーローパーティクルアニメーション開始');
        }).catch(error => {
            console.error('パーティクル初期化エラー:', error);
        });
    } else {
        console.warn('tsParticlesライブラリが読み込まれていません');
    }
}

// Handle window resize
let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (particlesInstance) {
            particlesInstance.destroy();
            initHeroParticles();
        }
    }, 250);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure tsParticles is loaded
    setTimeout(() => {
        initHeroParticles();
    }, 100);
    
    window.addEventListener('resize', handleResize);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (particlesInstance) {
        particlesInstance.destroy();
    }
});

// Alternative simple animation if tsParticles fails
function initSimpleParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 60;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 180, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // 接続線を描画しない（背景の線が動く機能を除去）
        // Draw connections - REMOVED

        requestAnimationFrame(animate);
    }

    animate();
    console.log('シンプルパーティクルアニメーション開始');
}