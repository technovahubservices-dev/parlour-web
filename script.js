// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for Smooth Scrolling
// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

// Sync Lenis with GSAP Ticker for zero-lag scrolling
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Preloader Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.to('.loader-line', {
        width: '100%',
        duration: 1.2,
        ease: 'power2.inOut'
    })
        .to('.loader-text', {
            y: -50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.in',
            delay: 0.2
        })
        .to('.preloader', {
            y: '-100%',
            duration: 1,
            ease: 'power4.inOut'
        }, "-=0.4")
        .to('body', {
            opacity: 1,
            duration: 0.5
        }, "-=0.8")
        // Hero Entrance
        .from('.hero-bg img', {
            scale: 1.2,
            filter: 'blur(10px)',
            duration: 2,
            ease: 'power2.out',
            onComplete: () => {
                // Start Idle Animation after entrance
                gsap.to('.hero-bg img', {
                    scale: 1.1,
                    duration: 20,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        }, "-=1")
        .from('.subtitle', {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, "-=1.5")
        .from('.hero h1', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, "-=1.3")
        .from('.hero p', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, "-=1.1")
        .from('.cta-wrapper', {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, "-=0.9");

    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
});

// Scroll Indicator Animation (Bounce)
gsap.to('.scroll-indicator .line', {
    height: '100%',
    y: '100%',
    duration: 1.5,
    repeat: -1,
    ease: "power2.inOut"
});
// Also fade it out on scroll
gsap.to('.scroll-indicator', {
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: '100px top',
        scrub: true
    },
    opacity: 0
});

// Cursor Logic (Enhanced)
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Instant follow for dot
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Smooth follow for outline using GSAP
    gsap.to(cursorOutline, {
        x: posX,
        y: posY,
        duration: 0.15,
        ease: 'power2.out'
    });
});

// Magnetic Buttons
document.querySelectorAll('.magnetic-btn, .magnetic-btn-submit').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        });

        gsap.to(btn.querySelector('.btn-text, button'), {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        gsap.to(btn.querySelector('.btn-text, button'), { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
});

// Marquee - Complete GSAP Lock
// We must duplicate the content to ensure seamless loop if using xPercent
const marqueeContent = document.querySelector('.marquee-content');
// Ensure pure JS control
// First, clone the text to make it long enough
const marqueeText = marqueeContent.innerHTML;
marqueeContent.innerHTML = marqueeText + marqueeText + marqueeText;

let tween = gsap.to(".marquee-content", {
    xPercent: -50,
    repeat: -1,
    duration: 30,
    ease: "linear"
}).totalProgress(0.5);

gsap.set(".marquee-content", { xPercent: -50 });

// Services Reveal
const serviceItems = document.querySelectorAll('.service-item');
serviceItems.forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out"
    });
});

// Hover Effect for Services Background (Vanilla JS + GSAP transition)
const serviceBgs = document.querySelectorAll('.service-bg');
serviceItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const target = item.getAttribute('data-target');
        // Reset others
        serviceBgs.forEach(bg => {
            if (bg.dataset.bg !== target) {
                gsap.to(bg, { opacity: 0, duration: 0.5 });
            }
        });

        // Show target
        const activeBg = document.querySelector(`.service-bg[data-bg="${target}"]`);
        if (activeBg) {
            gsap.to(activeBg, { opacity: 1, duration: 0.5, scale: 1.05 });
        } else {
            // Fallback to default
            gsap.to(document.querySelector('.service-bg.active'), { opacity: 1, duration: 0.5 });
        }
    });

    item.addEventListener('mouseleave', () => {
        // Optional: revert scale?
        const target = item.getAttribute('data-target');
        const activeBg = document.querySelector(`.service-bg[data-bg="${target}"]`);
        if (activeBg) gsap.to(activeBg, { scale: 1, duration: 0.5 });
    });
});

// Editorial/Philosophy Section Parallax
gsap.to('.editorial-image img', {
    scrollTrigger: {
        trigger: '.experience-editorial',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    },
    y: 100, // Move image down slightly while scrolling
    scale: 1.1,
    ease: 'none'
});

// Reveal Text in Editorial
gsap.from('.experience-editorial h2, .experience-editorial p', {
    scrollTrigger: {
        trigger: '.experience-editorial',
        start: 'top 75%'
    },
    y: 50,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out"
});

// Footer Reveal
gsap.from('.footer-col', {
    scrollTrigger: {
        trigger: 'footer',
        start: 'top 90%'
    },
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "power2.out"
});

// Navbar background change
const navbar = document.querySelector('.navbar');
gsap.to(navbar, {
    scrollTrigger: {
        start: 'top -50',
        end: 99999,
        toggleClass: { className: 'nav-scrolled', targets: navbar }
    }
});
