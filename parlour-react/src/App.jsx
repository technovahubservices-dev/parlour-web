import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { Menu, X, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [activeService, setActiveService] = useState('hero'); // Default bg
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroImgRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const marqueeRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Initialize Lenis and Global Animations
  // Initialize Lenis and Global Animations
  useEffect(() => {
    // Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });

    // Sync with GSAP
    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // GSAP Context
    const ctx = gsap.context(() => {
      // Preloader & Entrance
      const tl = gsap.timeline();
      tl.to('.loader-line', { width: '100%', duration: 1.2, ease: 'power2.inOut' })
        .to('.loader-text', { y: -50, opacity: 0, duration: 0.8, ease: 'power3.in', delay: 0.2 })
        .to('.preloader', { y: '-100%', duration: 1, ease: 'power4.inOut' }, "-=0.4")
        .to('body', { opacity: 1, duration: 0.5 }, "-=0.8")
        .from('.hero-bg img', {
          scale: 1.2,
          filter: 'blur(10px)',
          duration: 2,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to('.hero-bg img', {
              scale: 1.1,
              duration: 20,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          }
        }, "-=1")
        .from('.subtitle', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, "-=1.5")
        .from('.hero h1', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, "-=1.3")
        .from('.hero p', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, "-=1.1")
        .from('.cta-wrapper', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, "-=0.9");

      // Scroll Indicator
      gsap.to('.scroll-indicator .line', {
        height: '100%',
        y: '100%',
        duration: 1.5,
        repeat: -1,
        ease: "power2.inOut"
      });

      gsap.to('.scroll-indicator', {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '100px top',
          scrub: true
        },
        opacity: 0
      });

      // Marquee Velocity
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          repeat: -1,
          duration: 30,
          ease: "linear"
        }).totalProgress(0.5);


      }

      // Editorial Parallax
      gsap.to('.editorial-image img', {
        scrollTrigger: {
          trigger: '.experience-editorial',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: 100,
        scale: 1.1,
        ease: 'none'
      });

      // Navbar Scroll
      gsap.to('.navbar', {
        scrollTrigger: {
          start: 'top -50',
          end: 99999,
          toggleClass: { className: 'nav-scrolled', targets: '.navbar' }
        }
      });

      // Reveal Animations
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
    });

    document.body.classList.remove('loading');
    document.body.classList.add('loaded');

    return () => {
      gsap.ticker.remove(tickerFn);
      ctx.revert(); // Auto cleanups all GSAP animations created in context
      lenis.destroy();
    };

  }, []);

  // Cursor Logic
  useEffect(() => {
    const onMouseMove = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${posX}px`;
        cursorDotRef.current.style.top = `${posY}px`;
      }
      if (cursorOutlineRef.current) {
        gsap.to(cursorOutlineRef.current, {
          x: posX,
          y: posY,
          duration: 0.15,
          ease: 'power2.out'
        });
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Magnetic Button Logic helper
  const handleMagnetMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
    gsap.to(btn.querySelector('.btn-text, button'), { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
  };

  const handleMagnetLeave = (e) => {
    const btn = e.currentTarget;
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    gsap.to(btn.querySelector('.btn-text, button'), { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  const handleServiceHover = (target) => {
    const bg = document.querySelector(`.service-bg[data-bg="${target}"]`);
    const otherBgs = document.querySelectorAll('.service-bg');

    otherBgs.forEach(b => {
      if (b !== bg) gsap.to(b, { opacity: 0, duration: 0.5 });
    })

    if (bg) {
      gsap.to(bg, { opacity: 1, duration: 0.5, scale: 1.05 });
    } else {
      // Fallback default
      gsap.to(document.querySelector('.service-bg.active-default'), { opacity: 1, duration: 0.5 });
    }
    setActiveService(target);
  };

  const handleServiceLeave = () => {
    const bg = document.querySelector(`.service-bg[data-bg="${activeService}"]`);
    if (bg) gsap.to(bg, { scale: 1, duration: 0.5 });
    // reset to default if desired, or keep last
  };


  return (
    <>
      <div className="preloader">
        <div className="loader-content">
          <span className="loader-text">LUMIÈRE</span>
          <div className="loader-line"></div>
        </div>
      </div>

      <div className="noise-overlay"></div>
      <div className="cursor-dot" ref={cursorDotRef}></div>
      <div className="cursor-outline" ref={cursorOutlineRef}></div>

      <nav className={`navbar ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="logo">LUMIÈRE</div>
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#experience" onClick={() => setIsMenuOpen(false)}>The Experience</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Book Now</a>
        </div>
        <button className="menu-btn" aria-label="Menu" onClick={toggleMenu}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <header id="home" className="hero">
        <div className="hero-bg">
          <img src="/images/hero.png" alt="Luxury Salon Interior" />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="subtitle">Une Expérience Unique</span>
          <h1>The Art of <br /> <em>Timeless Beauty</em></h1>
          <p>A sanctuary where precision meets luxury. Elevating your essence.</p>
          <div className="cta-wrapper">
            <a href="#booking" className="magnetic-btn" onMouseMove={handleMagnetMove} onMouseLeave={handleMagnetLeave}>
              <span className="btn-text">Reserve Your Spot</span>
            </a>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="line"></div>
        </div>
      </header>

      <section id="services" className="services-list-section">
        <div className="service-bg-container">
          {/* Backgrounds */}
          <div className="service-bg active-default" style={{ backgroundImage: "url('/images/hero.png')", opacity: 1 }}></div>
          <div className="service-bg" data-bg="hair" style={{ backgroundImage: "url('/images/hair.png')" }}></div>
          <div className="service-bg" data-bg="facial" style={{ backgroundImage: "url('/images/facial.png')" }}></div>
          <div className="service-bg" data-bg="spa" style={{ backgroundImage: "url('/images/spa.png')" }}></div>
          <div className="service-bg" data-bg="makeup" style={{ backgroundImage: "url('/images/makeup.png')" }}></div>
        </div>

        <div className="services-content">
          <div className="section-label">Our Service Collection</div>
          <ul className="service-list" onMouseLeave={() => {
            // Optional reset
            const bgs = document.querySelectorAll('.service-bg');
            bgs.forEach(b => gsap.to(b, { opacity: 0, duration: 0.5 }));
            gsap.to(document.querySelector('.service-bg.active-default'), { opacity: 1, duration: 0.5 });
          }}>
            {[
              { id: 'hair', num: '01', name: 'Couture Styling' },
              { id: 'facial', num: '02', name: 'Radiance Facials' },
              { id: 'spa', num: '03', name: 'Holistic Spa' },
              { id: 'makeup', num: '04', name: 'Bridal Artistry' }
            ].map((item, i) => (
              <li key={item.id} className="service-item"
                data-target={item.id}
                onMouseEnter={() => handleServiceHover(item.id)}
                onMouseLeave={handleServiceLeave}
              >
                <span className="service-num">{item.num}</span>
                <a href="#" className="service-link">
                  <span className="service-name">{item.name}</span>
                  <span className="service-arrow"><ArrowRight /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="experience" className="experience-editorial">
        <div className="editorial-content">
          <span className="editorial-subtitle">The Philosophy</span>
          <h2>We believe beauty is an architectural feat.</h2>
          <p>Every cut, every contour, every treatment is designed with the precision of high art. Step into a space
            where time slows down, and the focus is entirely on your restoration.</p>
        </div>
        <div className="editorial-image">
          <img src="/images/hero.png" alt="Interior Detail" />
        </div>
      </section>

      <div className="marquee-container">
        <div className="marquee-content" ref={marqueeRef}>
          {[1, 2, 3, 4].map((i) => (
            <span key={i}>
              <span>Elegance</span> <span className="separator">✦</span>
              <span>Sophistication</span> <span className="separator">✦</span>
              <span>Radiance</span> <span className="separator">✦</span>
              <span>Lumière</span> <span className="separator">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section id="contact" className="booking-minimal">
        <div className="booking-wrapper">
          <h2>Begin Your <br /><em>Transformation</em></h2>
          <form className="booking-form-minimal">
            <div className="form-row">
              <input type="text" placeholder="Name" required />
              <input type="email" placeholder="Email" required />
            </div>
            <div className="form-row">
              <select className="minimal-select" defaultValue="">
                <option value="" disabled>Select Service</option>
                <option value="hair">Hair Styling</option>
                <option value="facial">Facial Treatment</option>
                <option value="spa">Full Body Spa</option>
                <option value="makeup">Bridal Artistry</option>
              </select>
              <input type="text" placeholder="Preferred Date" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} />
            </div>
            <button type="submit" className="magnetic-btn-submit" onMouseMove={handleMagnetMove} onMouseLeave={handleMagnetLeave}>Request Appointment</button>
          </form>
        </div>
      </section>

      <footer>
        <div className="footer-container">
          <div className="footer-col brand-col">
            <h3 className="footer-logo">LUMIÈRE</h3>
          </div>
          <div className="footer-col">
            <h4>Address</h4>
            <p>123 Luxury Avenue<br />Fashion District<br />New York, NY 10001</p>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>+1 (212) 555-0199<br />concierge@lumiere.com</p>
          </div>
          <div className="footer-col social-col">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
          </div>
        </div>
        <div className="footer-bar">
          <p>&copy; 2026 Lumière Parlour.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
