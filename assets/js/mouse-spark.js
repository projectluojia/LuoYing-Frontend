(function () {
    class MouseSpark {
        constructor(canvas, options = {}) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext("2d");

            this.color = options.color || "74,169,255";
            this.scale = options.scale || 1.5;
            this.opacity = options.opacity || 1.0;
            this.speed = options.speed || 1.0;
            this.maxTrail = options.maxTrail || 16;

            this.sparkPool = [];
            this.wavePool = [];

            this.waves = [];
            this.sparks = [];
            this.trail = [];
            this.isDown = false;
            this.lastPos = null;
            this.baseFrameMs = 1000 / 60;
            this.maxDeltaMs = 100;
            this.lastFrameTime = performance.now();

            this.resize();
            window.addEventListener("resize", () => this.resize());
            this.bindEvents();
            requestAnimationFrame((time) => this.loop(time));
        }

        alpha(value) {
            return Math.max(0, Math.min(1, value * this.opacity));
        }

        resize() {
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = window.innerWidth * dpr;
            this.canvas.height = window.innerHeight * dpr;
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        bindEvents() {
            const getPosition = (event) => ({ x: event.clientX, y: event.clientY });
            const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

            window.addEventListener("mousedown", (event) => {
                this.isDown = true;
                this.lastPos = getPosition(event);
                this.createBurst(this.lastPos.x, this.lastPos.y);
            });

            window.addEventListener("mousemove", (event) => {
                const position = getPosition(event);
                if (!this.lastPos) {
                    this.lastPos = position;
                }

                if (distance(position, this.lastPos) > 2) {
                    this.trail.push({ x: position.x, y: position.y, life: 1 });
                    this.lastPos = position;

                    if (this.trail.length > this.maxTrail) {
                        this.trail.shift();
                    }

                    if (Math.random() < 0.3) {
                        const angle = Math.random() * Math.PI * 2;
                        const speedScale = this.scale / 1.5;
                        this.sparks.push({
                            x: position.x + Math.cos(angle) * 10 * this.scale,
                            y: position.y + Math.sin(angle) * 10 * this.scale,
                            vx: Math.cos(angle) * 1.3 * speedScale,
                            vy: Math.sin(angle) * 1.3 * speedScale,
                            rot: Math.random() * Math.PI * 2,
                            rs: 0.16,
                            s: 9 * this.scale,
                            a: 0.7,
                            f: 0.95,
                        });
                    }
                }
            });

            window.addEventListener("mouseup", () => {
                this.isDown = false;
            });
        }

        createBurst(x, y) {
            let wave;
            if (this.wavePool.length > 0) {
                wave = this.wavePool.pop();
                wave.x = x;
                wave.y = y;
                wave.life = 0;
                wave.max = 18;
                wave.r = 0;
                wave.ring.ang = Math.random() * Math.PI * 2;
                wave.ring.life = 0;
            } else {
                wave = {
                    x,
                    y,
                    life: 0,
                    max: 18,
                    r: 0,
                    ring: {
                        ang: Math.random() * Math.PI * 2,
                        segs: [
                            { off: -0.25 * Math.PI, len: 1.15 * Math.PI },
                            { off: 0.0 * Math.PI, len: 1.15 * Math.PI },
                            { off: 0.25 * Math.PI, len: 1.15 * Math.PI },
                        ],
                        life: 0,
                        maxLife: 30,
                        rs: 0.08,
                    },
                };
            }
            this.waves.push(wave);

            const particleCount = 4;
            const speedScale = this.scale / 1.5;
            for (let i = 0; i < particleCount; i += 1) {
                const angle = Math.random() * Math.PI * 2;
                const speed = (4.8 + Math.random() * 2) * speedScale;

                let spark;
                if (this.sparkPool.length > 0) {
                    spark = this.sparkPool.pop();
                    spark.x = x;
                    spark.y = y;
                    spark.vx = Math.cos(angle) * speed;
                    spark.vy = Math.sin(angle) * speed;
                    spark.rot = Math.random() * Math.PI * 2;
                    spark.rs = (Math.random() - 0.5) * 0.28;
                    spark.s = (4 + Math.random() * 3) * this.scale;
                    spark.a = 1;
                    spark.f = 0.9;
                } else {
                    spark = {
                        x,
                        y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        rot: Math.random() * Math.PI * 2,
                        rs: (Math.random() - 0.5) * 0.28,
                        s: (4 + Math.random() * 3) * this.scale,
                        a: 1,
                        f: 0.9,
                    };
                }
                this.sparks.push(spark);
            }
        }

        loop(now) {
            const deltaMs = Math.min(now - this.lastFrameTime, this.maxDeltaMs);
            this.lastFrameTime = now;
            const frameScale = (deltaMs / this.baseFrameMs) * this.speed;

            if (this.waves.length > 0 || this.sparks.length > 0 || this.trail.length > 0) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.globalCompositeOperation = "lighter";

                for (let i = this.trail.length - 1; i >= 0; i -= 1) {
                    const trailPoint = this.trail[i];
                    trailPoint.life -= 0.12 * frameScale;
                    if (trailPoint.life <= 0) {
                        this.trail.splice(i, 1);
                    }
                }

                if (this.trail.length > 1) {
                    this.ctx.lineWidth = 5.0;
                    this.ctx.shadowColor = `rgba(${this.color}, 0.6)`;
                    this.ctx.shadowBlur = 3;

                    const lastIndex = this.trail.length - 1;
                    for (let i = 0; i < lastIndex; i += 1) {
                        const alphaStart = i / lastIndex;
                        const alphaEnd = (i + 1) / lastIndex;
                        const from = this.trail[i];
                        const to = this.trail[i + 1];

                        const gradient = this.ctx.createLinearGradient(from.x, from.y, to.x, to.y);
                        gradient.addColorStop(0, `rgba(${this.color}, ${alphaStart})`);
                        gradient.addColorStop(1, `rgba(${this.color}, ${alphaEnd})`);

                        this.ctx.beginPath();
                        this.ctx.moveTo(from.x, from.y);
                        this.ctx.lineTo(to.x, to.y);
                        this.ctx.strokeStyle = gradient;
                        this.ctx.stroke();
                    }
                    this.ctx.shadowColor = "transparent";
                }

                for (let i = this.waves.length - 1; i >= 0; i -= 1) {
                    const wave = this.waves[i];
                    wave.life += frameScale;
                    const progress = wave.life / wave.max;
                    const ease = 1 - Math.pow(1 - Math.min(progress, 1), 3);
                    wave.r = 26 * this.scale * ease;
                    const alpha = Math.max(0, 1 - progress);

                    if (alpha > 0) {
                        this.ctx.beginPath();
                        this.ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
                        this.ctx.fillStyle = `rgba(${this.color},${this.alpha(alpha)})`;
                        this.ctx.fill();
                    }

                    const ring = wave.ring;
                    ring.life += frameScale;
                    const ringProgress = Math.min(ring.life / ring.maxLife, 1);
                    ring.ang -= ring.rs * frameScale;
                    ring.segs.forEach((segment) => {
                        const shrink = Math.max(0, 1 - ringProgress);
                        const length = segment.len * shrink;
                        const start = ring.ang + segment.off;
                        this.ctx.beginPath();
                        this.ctx.arc(wave.x, wave.y, wave.r + 3 * this.scale, start, start + length);
                        this.ctx.lineWidth = 3.7;
                        this.ctx.strokeStyle = `rgba(245,248,252,${this.alpha(1 - ringProgress)})`;
                        this.ctx.stroke();
                    });

                    if (progress >= 1 && ringProgress >= 1) {
                        this.wavePool.push(this.waves[i]);
                        this.waves.splice(i, 1);
                    }
                }

                for (let i = this.sparks.length - 1; i >= 0; i -= 1) {
                    const spark = this.sparks[i];
                    spark.x += spark.vx * frameScale;
                    spark.y += spark.vy * frameScale;
                    spark.vx *= Math.pow(spark.f, frameScale);
                    spark.vy *= Math.pow(spark.f, frameScale);
                    spark.rot += spark.rs * frameScale;
                    spark.a -= 0.032 * frameScale;
                    if (spark.a <= 0) {
                        this.sparkPool.push(this.sparks[i]);
                        this.sparks.splice(i, 1);
                        continue;
                    }

                    this.ctx.save();
                    this.ctx.translate(spark.x, spark.y);
                    this.ctx.rotate(spark.rot);
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -spark.s);
                    this.ctx.lineTo(spark.s * 0.6, spark.s * 0.6);
                    this.ctx.lineTo(-spark.s * 0.6, spark.s * 0.6);
                    this.ctx.fillStyle = `rgba(255,255,255,${this.alpha(spark.a)})`;
                    this.ctx.fill();
                    this.ctx.restore();
                }

                this.ctx.globalCompositeOperation = "source-over";
            }

            requestAnimationFrame((nextNow) => this.loop(nextNow));
        }
    }

    function createOverlayCanvas() {
        const canvas = document.createElement("canvas");
        canvas.id = "mouseSparkCanvas";
        Object.assign(canvas.style, {
            position: "fixed",
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: "2147483647",
            background: "transparent",
        });

        return canvas;
    }

    function initMouseSparkEffect(options = {}) {
        const canvas = createOverlayCanvas();
        document.body.appendChild(canvas);
        window.mouseSparkEffect = new MouseSpark(canvas, options);
    }

    window.initMouseSparkEffect = initMouseSparkEffect;
})();
