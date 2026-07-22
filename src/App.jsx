import { useState, useRef, useEffect } from 'react'
import './App.css'

const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    // Safety net: never leave content permanently invisible if the
    // observer fails to fire for any reason.
    const fallback = setTimeout(() => setVisible(true), 2000)
    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`dd-reveal${visible ? ' is-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const Typewriter = ({ text, startDelay = 400, speed = 36 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setCount(text.length)
      return
    }
    let i = 0
    let interval
    const timer = setTimeout(() => {
      interval = setInterval(() => {
        i++
        setCount(i)
        if (i >= text.length) clearInterval(interval)
      }, speed)
    }, startDelay)
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [text, startDelay, speed])

  return (
    <span aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span className="dd-cursor" aria-hidden="true"></span>
    </span>
  )
}

const SCRAMBLE_GLYPHS = '!<>-_\\/[]{}=+*^?#'

const Scramble = ({ text }) => {
  const ref = useRef(null)
  const [display, setDisplay] = useState(text)
  const started = useRef(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return

    const run = () => {
      if (started.current) return
      started.current = true
      let frame = 0
      const total = Math.max(text.length * 2, 18)
      intervalRef.current = setInterval(() => {
        frame++
        const progress = frame / total
        setDisplay(
          text.split('').map((ch, idx) => {
            if (ch === ' ' || ch === '/') return ch
            if (idx < progress * text.length) return ch
            return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]
          }).join('')
        )
        if (frame >= total) {
          setDisplay(text)
          clearInterval(intervalRef.current)
        }
      }, 28)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      clearInterval(intervalRef.current)
    }
  }, [text])

  return <span ref={ref} aria-label={text}><span aria-hidden="true">{display}</span></span>
}

const MARQUEE_ITEMS = [
  'Custom web apps', 'Admin dashboards', 'Booking systems', 'Client reviews',
  'Photo galleries', 'Online payments', 'Built in Phoenix', 'Shipped in weeks'
]

const Marquee = () => (
  <div className="dd-marquee" aria-hidden="true">
    <div className="dd-marquee-track">
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
        <span key={i} className="dd-marquee-item">
          {item}
          <span style={{ color: 'var(--accent)', margin: '0 22px' }}>//</span>
        </span>
      ))}
    </div>
  </div>
)

const RAIN_DROPS = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 5.3 + (i % 3) * 1.7) % 100}%`,
  delay: `${(i * 0.41) % 2.6}s`,
  duration: `${1.5 + (i % 5) * 0.28}s`,
  opacity: 0.14 + (i % 4) * 0.06
}))

const Rain = () => (
  <div className="dd-rain" aria-hidden="true">
    {RAIN_DROPS.map((d, i) => (
      <span key={i} style={{
        left: d.left,
        animationDelay: d.delay,
        animationDuration: d.duration,
        opacity: d.opacity
      }} />
    ))}
  </div>
)

const ScrollProgress = () => {
  const barRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const progress = doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1)
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={barRef} aria-hidden="true" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: 'var(--accent)',
      transformOrigin: 'left',
      transform: 'scaleX(0)',
      zIndex: 100,
      pointerEvents: 'none'
    }} />
  )
}

const PhxClock = () => {
  const [time, setTime] = useState('--:--:--')

  useEffect(() => {
    const update = () => setTime(
      new Date().toLocaleTimeString('en-US', { timeZone: 'America/Phoenix', hour12: false })
    )
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span style={{
      fontFamily: "'JetBrains Mono'",
      fontSize: '12.5px',
      letterSpacing: '0.08em',
      color: 'var(--accent)'
    }}>PHX {time} MST</span>
  )
}

const DesertHorizon = () => (
  <div aria-hidden="true" style={{ background: 'var(--bg-primary)', lineHeight: 0 }}>
    <svg viewBox="0 0 1440 110" preserveAspectRatio="none" style={{ width: '100%', height: 'clamp(60px, 8vw, 110px)', display: 'block' }}>
      {/* Back ridge */}
      <path d="M0 88 L150 88 L235 44 L390 44 L460 76 L620 76 L745 26 L890 26 L975 62 L1130 62 L1225 38 L1440 38"
        fill="none" stroke="#26262b" strokeWidth="2" />
      {/* Front ridge — echoes the logo mark */}
      <path d="M0 100 L210 100 L295 64 L455 64 L535 90 L715 90 L830 48 L995 48 L1075 80 L1255 80 L1330 60 L1440 60"
        fill="none" stroke="#F2F2F0" strokeWidth="2.5" />
      {/* Saguaros */}
      <g stroke="#C9F04B" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M330 100 L330 52 M330 76 L318 76 L318 62 M330 84 L342 84 L342 68" />
        <path d="M1160 80 L1160 40 M1160 60 L1149 60 L1149 48 M1160 68 L1171 68 L1171 55" />
        <path d="M620 90 L620 62 M620 76 L611 76 L611 67" />
      </g>
    </svg>
  </div>
)

const Logo = ({ width = 116 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', lineHeight: 1 }}>
    <span style={{
      fontFamily: "'JetBrains Mono'",
      fontWeight: 700,
      fontSize: '14px',
      letterSpacing: '0.05em',
      color: 'var(--text-primary)'
    }}>DESERT DIGITAL</span>
    <svg viewBox="0 0 240 20" width={width} height={width * 9 / 116} aria-hidden="true">
      <path d="M0 18 L60 18 L76 6 L120 6 L134 15 L176 15 L192 3 L240 3" fill="none" stroke="var(--text-primary)" strokeWidth="3" />
    </svg>
  </div>
)

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px clamp(20px, 5vw, 64px)',
      background: 'var(--blur-bg)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)'
    }}>
      <Logo />

      {/* Desktop Nav */}
      <div data-nav-desktop style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(14px, 3vw, 32px)',
        fontFamily: "'JetBrains Mono'",
        fontSize: '13px'
      }}>
        <a href="#work" className="dd-nav-link" style={{ color: 'var(--text-secondary)' }}>Projects</a>
        <a href="#services" className="dd-nav-link" style={{ color: 'var(--text-secondary)' }}>Services</a>
        <a href="#pricing" className="dd-nav-link" style={{ color: 'var(--text-secondary)' }}>Pricing</a>
        <a href="#faq" className="dd-nav-link" style={{ color: 'var(--text-secondary)' }}>FAQ</a>
        <a href="#contact" className="dd-btn dd-btn-fill" style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '8px 16px',
          background: 'var(--accent)',
          color: 'var(--accent-dark)',
          fontWeight: 700,
          borderRadius: '4px'
        }}>Start a project</a>
      </div>

      {/* Mobile Hamburger */}
      <button
        data-nav-toggle
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'flex',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(13, 13, 15, 0.95)',
          borderBottom: '1px solid var(--border)',
          padding: '16px clamp(20px, 5vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          fontFamily: "'JetBrains Mono'",
          fontSize: '14px',
          zIndex: 40
        }}>
          <a href="#work" onClick={closeMenu} style={{
            color: 'var(--accent)',
            padding: '12px 0',
            borderBottom: '1px solid var(--border)'
          }}>Projects</a>
          <a href="#services" onClick={closeMenu} style={{
            color: 'var(--accent)',
            padding: '12px 0',
            borderBottom: '1px solid var(--border)'
          }}>Services</a>
          <a href="#pricing" onClick={closeMenu} style={{
            color: 'var(--accent)',
            padding: '12px 0',
            borderBottom: '1px solid var(--border)'
          }}>Pricing</a>
          <a href="#faq" onClick={closeMenu} style={{
            color: 'var(--accent)',
            padding: '12px 0',
            borderBottom: '1px solid var(--border)'
          }}>FAQ</a>
          <a href="#contact" onClick={closeMenu} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'var(--accent)',
            color: 'var(--accent-dark)',
            fontWeight: 700,
            borderRadius: '4px',
            marginTop: '8px',
            justifyContent: 'center'
          }}>Start a project</a>
        </div>
      )}
    </nav>
  )
}

const Hero = () => {
  const [strikeKey, setStrikeKey] = useState(0)
  const bgRef = useRef(null)
  const boltRef = useRef(null)

  // Re-strike the lightning every ~10s
  useEffect(() => {
    if (prefersReducedMotion()) return
    const interval = setInterval(() => setStrikeKey(k => k + 1), 10000)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e) => {
    if (prefersReducedMotion()) return
    const rect = e.currentTarget.getBoundingClientRect()
    const dx = (e.clientX - rect.left) / rect.width - 0.5
    const dy = (e.clientY - rect.top) / rect.height - 0.5
    if (bgRef.current) {
      bgRef.current.style.transform = `translate(${dx * -14}px, ${dy * -10}px) scale(1.05)`
    }
    if (boltRef.current) {
      boltRef.current.style.transform = `translate(${dx * 16}px, ${dy * 12}px)`
    }
  }

  return (
  <header onMouseMove={handleMouseMove} style={{
    position: 'relative',
    minHeight: '86vh',
    display: 'flex',
    alignItems: 'center',
    padding: 'clamp(40px, 7vh, 80px) clamp(20px, 5vw, 64px)',
    overflow: 'hidden',
    borderBottom: '1px solid var(--border)'
  }}>
    <img ref={bgRef} src="/assets/neon-night.jpg" alt="Neon-lit night street" style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: 0.42,
      transform: 'scale(1.05)',
      transition: 'transform 0.4s ease-out',
      willChange: 'transform'
    }} />
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, #0D0D0F 28%, rgba(13,13,15,0.45) 72%, rgba(13,13,15,0.15))'
    }}></div>

    {/* Lightning flash */}
    <div key={`flash-${strikeKey}`} className="dd-flash" style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(60% 80% at 78% 20%, var(--accent), transparent 60%)',
      pointerEvents: 'none',
      animation: 'ddFlash 2.4s ease-out 0.3s 1 both'
    }}></div>

    {/* Lightning bolt */}
    <svg key={`bolt-${strikeKey}`} ref={boltRef} viewBox="0 0 500 900" preserveAspectRatio="xMidYMin slice" style={{
      position: 'absolute',
      right: 0,
      top: 0,
      height: '100%',
      width: '44%',
      pointerEvents: 'none',
      transition: 'transform 0.4s ease-out',
      willChange: 'transform'
    }} aria-hidden="true">
      <path className="dd-bolt" d="M330,20 L250,300 L340,320 L200,640 L280,600 L150,880" fill="none" stroke="#C9F04B" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1200" style={{
        animation: 'ddStrike 2.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s 1 both',
        filter: 'drop-shadow(0 0 6px rgba(201,240,75,0.7))'
      }} />
    </svg>

    <Rain />

    <div style={{ position: 'relative', maxWidth: '820px', zIndex: 2 }}>
      <div style={{
        fontFamily: "'JetBrains Mono'",
        fontSize: '12.5px',
        letterSpacing: '0.12em',
        color: 'var(--accent)',
        marginBottom: '24px',
        minHeight: '1.2em'
      }}><Typewriter text="// Phoenix, AZ — web development studio" /></div>

      <h1 className="dd-fade-up" style={{ marginBottom: '24px', animationDelay: '200ms' }}>Real websites for real local businesses.</h1>

      <p className="dd-fade-up" style={{
        fontSize: 'clamp(16px, 2vw, 20px)',
        color: 'var(--text-secondary)',
        maxWidth: '540px',
        marginBottom: '34px',
        animationDelay: '320ms'
      }}>Custom-built web apps for small service businesses — booking, reviews, galleries, and an admin panel you actually control. Shipped in weeks, not months.</p>

      <div className="dd-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '52px', animationDelay: '440ms' }}>
        <a href="#contact" className="dd-btn dd-btn-fill" style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '14px 26px',
          background: 'var(--accent)',
          color: 'var(--accent-dark)',
          fontWeight: 700,
          borderRadius: '5px',
          fontFamily: "'JetBrains Mono'",
          fontSize: '14px'
        }}>Start a project</a>
        <a href="#work" className="dd-btn dd-btn-ghost" style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '14px 26px',
          background: 'transparent',
          color: 'var(--text-primary)',
          fontWeight: 600,
          borderRadius: '5px',
          border: '1px solid var(--border-light)',
          fontFamily: "'JetBrains Mono'",
          fontSize: '14px'
        }}>View work</a>
      </div>

      <div className="dd-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px, 4vw, 52px)', animationDelay: '560ms' }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono'",
            fontWeight: 700,
            fontSize: 'clamp(26px, 3vw, 38px)',
            color: 'var(--accent)'
          }}>2–4 wks</div>
          <div style={{
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            fontFamily: "'JetBrains Mono'",
            marginTop: '4px'
          }}>typical turnaround</div>
        </div>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono'",
            fontWeight: 700,
            fontSize: 'clamp(26px, 3vw, 38px)',
            color: 'var(--accent)'
          }}>&lt;1s</div>
          <div style={{
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            fontFamily: "'JetBrains Mono'",
            marginTop: '4px'
          }}>first-load target</div>
        </div>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono'",
            fontWeight: 700,
            fontSize: 'clamp(26px, 3vw, 38px)',
            color: 'var(--accent)'
          }}>100%</div>
          <div style={{
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            fontFamily: "'JetBrains Mono'",
            marginTop: '4px'
          }}>client-managed</div>
        </div>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono'",
            fontWeight: 700,
            fontSize: 'clamp(26px, 3vw, 38px)',
            color: 'var(--accent)'
          }}>&lt;2 hrs</div>
          <div style={{
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            fontFamily: "'JetBrains Mono'",
            marginTop: '4px'
          }}>avg. response time</div>
        </div>
      </div>
    </div>
  </header>
  )
}

const Services = () => (
  <section id="services" style={{
    padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
    borderBottom: '1px solid var(--border)'
  }}>
    <Reveal>
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <span style={{
        fontFamily: "'JetBrains Mono'",
        fontSize: '12.5px',
        letterSpacing: '0.1em',
        color: 'var(--accent)'
      }}><Scramble text="01 / services" /></span>

      <h2 style={{ margin: '14px 0 44px', maxWidth: '620px' }}>Everything your site needs to run itself.</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1px',
        background: '#26262b',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {['Custom web app builds', 'Admin dashboards', 'Maintenance & retainers', 'Add-ons on demand'].map((title, i) => (
          <Reveal key={i} delay={i * 90}>
          <div className="dd-card" style={{
            background: 'var(--bg-secondary)',
            padding: '30px',
            height: '100%'
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: '12px',
              color: 'var(--accent)',
              marginBottom: '14px'
            }}>[{String(i + 1).padStart(2, '0')}]</div>
            <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{title}</div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {i === 0 && 'A site built around how your business actually works — not squeezed into a template.'}
              {i === 1 && 'Change prices, hours, reviews, and photos yourself. No developer required.'}
              {i === 2 && 'We keep it fast, secure, and up to date so you can forget it exists.'}
              {i === 3 && 'AI chat, automation, online ordering, payments — added when it earns its place.'}
            </p>
          </div>
          </Reveal>
        ))}
      </div>
    </div>
    </Reveal>
  </section>
)

const StarterKits = () => (
  <section id="kits" style={{
    padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
    borderBottom: '1px solid var(--border)'
  }}>
    <Reveal>
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <span style={{
        fontFamily: "'JetBrains Mono'",
        fontSize: '12.5px',
        letterSpacing: '0.1em',
        color: 'var(--accent)'
      }}><Scramble text="02 / starter kits" /></span>

      <h2 style={{ margin: '14px 0 44px', maxWidth: '620px' }}>Built for your trade, not a generic template.</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1px',
        background: '#26262b',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {[
          { name: 'Pet Care Kit', features: ['Booking calendar', 'Client reviews', 'Photo gallery'] },
          { name: 'Cleaning Kit', features: ['Instant quote calculator', 'Recurring booking', 'Before/after gallery'] },
          { name: 'Contractor Kit', features: ['Project gallery', 'Quote request form', 'Service area map'] },
          { name: 'Handyman Kit', features: ['Instant quote form', 'Service list & pricing', 'Review widget'] }
        ].map((kit, i) => (
          <Reveal key={i} delay={i * 90}>
          <div className="dd-card" style={{
            background: 'var(--bg-secondary)',
            padding: '30px',
            height: '100%'
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: '12px',
              color: 'var(--accent)',
              marginBottom: '14px'
            }}>[{String(i + 1).padStart(2, '0')}]</div>
            <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '14px' }}>{kit.name}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {kit.features.map((f, j) => (
                <li key={j} style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ color: 'var(--accent)', fontFamily: "'JetBrains Mono'" }}>·</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          </Reveal>
        ))}
      </div>
    </div>
    </Reveal>
  </section>
)

const CaseStudy = () => (
  <section id="work" style={{
    padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
    borderBottom: '1px solid var(--border)'
  }}>
    <Reveal>
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <span style={{
        fontFamily: "'JetBrains Mono'",
        fontSize: '12.5px',
        letterSpacing: '0.1em',
        color: 'var(--accent)'
      }}><Scramble text="03 / projects" /></span>

      <h2 style={{ margin: '14px 0 20px' }}>Sadie's Pet Care</h2>

      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '10px',
        marginBottom: '44px'
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono'",
          fontWeight: 700,
          fontSize: 'clamp(22px, 2.4vw, 30px)',
          color: 'var(--accent)'
        }}>+40% booking conversion</span>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>in the first 60 days *</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '1px',
        background: '#26262b',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {/* Image slot */}
        <div style={{
          minHeight: '440px',
          background: 'linear-gradient(135deg, #1a1a1f 0%, #262630 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontFamily: "'JetBrains Mono'",
          fontSize: '14px'
        }}>
          Screenshot placeholder
        </div>

        {/* Features */}
        <div style={{ background: 'var(--bg-secondary)', padding: '30px' }}>
          <div style={{ marginBottom: '24px' }}>
            <a href="https://example.com" style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: '13px',
              fontWeight: 700
            }}>sadiespetcare.org ↗</a>
          </div>

          {['Reviews system', 'Admin dashboard', 'Booking calendar', 'Gallery uploads'].map((feature, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: i < 3 ? '1px solid #26262b' : 'none'
            }}>
              <span>{feature}</span>
              <span className="dd-live-tag" style={{
                background: 'var(--accent)',
                color: 'var(--accent-dark)',
                fontFamily: "'JetBrains Mono'",
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '3px'
              }}>live</span>
            </div>
          ))}
        </div>
      </div>

      <blockquote style={{
        marginTop: '28px',
        padding: '28px 32px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: '10px',
        maxWidth: '780px'
      }}>
        <p style={{ fontSize: '16px', lineHeight: 1.6 }}>
          "People find us and book without ever calling. I update prices and photos
          myself in the morning before we open — no waiting on anyone."
        </p>
        <footer style={{
          marginTop: '14px',
          fontFamily: "'JetBrains Mono'",
          fontSize: '12.5px',
          letterSpacing: '0.08em',
          color: 'var(--text-secondary)'
        }}>— Sadie R. · <span style={{ color: 'var(--accent)' }}>Sadie's Pet Care</span> *</footer>
      </blockquote>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>
        * Illustrative — pending confirmed numbers and quote approval from the client.
      </p>
    </div>
    </Reveal>
  </section>
)

const Pricing = () => (
  <section id="pricing" style={{
    padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
    borderBottom: '1px solid var(--border)'
  }}>
    <Reveal>
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <span style={{
        fontFamily: "'JetBrains Mono'",
        fontSize: '12.5px',
        letterSpacing: '0.1em',
        color: 'var(--accent)'
      }}><Scramble text="04 / pricing" /></span>

      <h2 style={{ margin: '14px 0 44px' }}>Transparent, flat pricing.</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1px',
        background: '#26262b',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {[
          { name: 'Starter build', price: '$1,800+', desc: 'one-time', tag: null },
          { name: 'Full app build', price: '$4,200+', desc: 'one-time', tag: 'MOST BUILDS', highlight: true },
          { name: 'Maintenance', price: '$95/mo+', desc: 'ongoing', tag: null }
        ].map((tier, i) => (
          <Reveal key={i} delay={i * 90}>
          <div className={`dd-card${tier.highlight ? ' dd-tier-glow' : ''}`} style={{
            background: 'var(--bg-secondary)',
            padding: '30px',
            border: tier.highlight ? '1px solid var(--accent)' : 'none',
            position: 'relative',
            height: '100%'
          }}>
            {tier.tag && (
              <div style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
                background: 'var(--bg-primary)',
                padding: '4px 12px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: "'JetBrains Mono'",
                color: 'var(--accent)',
                border: '1px solid #C9F04B'
              }}>{tier.tag}</div>
            )}
            <div style={{ marginTop: tier.tag ? '16px' : '0' }}>
              <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{tier.name}</div>
              <div style={{
                fontFamily: "'JetBrains Mono'",
                fontSize: '36px',
                fontWeight: 700,
                color: 'var(--accent)',
                marginBottom: '8px'
              }}>{tier.price}</div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{tier.desc}</p>
            </div>
          </div>
          </Reveal>
        ))}
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginTop: '32px'
      }}>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Prefer to talk it through first?
        </p>
        <a href="#contact" className="dd-btn dd-btn-ghost" style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '12px 22px',
          background: 'transparent',
          color: 'var(--text-primary)',
          fontWeight: 600,
          borderRadius: '5px',
          border: '1px solid var(--border-light)',
          fontFamily: "'JetBrains Mono'",
          fontSize: '13px'
        }}>Book a free 15-min call →</a>
      </div>

      <div style={{
        marginTop: '28px',
        padding: '20px 24px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <p style={{ fontSize: '14px' }}>
          <span style={{ color: 'var(--accent)', fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>Know another local business?</span>{' '}
          <span style={{ color: 'var(--text-secondary)' }}>Refer them and get a free month of maintenance.</span>
        </p>
        <a href="mailto:hello@desertdigital.dev?subject=Referral" style={{
          fontFamily: "'JetBrains Mono'",
          fontSize: '13px',
          fontWeight: 700,
          whiteSpace: 'nowrap'
        }}>Refer a business →</a>
      </div>
    </div>
    </Reveal>
  </section>
)

const Process = () => (
  <section style={{
    padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
    borderBottom: '1px solid var(--border)'
  }}>
    <Reveal>
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <span style={{
        fontFamily: "'JetBrains Mono'",
        fontSize: '12.5px',
        letterSpacing: '0.1em',
        color: 'var(--accent)'
      }}><Scramble text="05 / process" /></span>

      <h2 style={{ margin: '14px 0 44px' }}>How we work together.</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1px',
        background: '#26262b',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {['We talk', 'Design', 'Build', 'Launch & hand off'].map((step, i) => (
          <Reveal key={i} delay={i * 90}>
          <div className="dd-card" style={{
            background: 'var(--bg-secondary)',
            padding: '30px',
            textAlign: 'left',
            height: '100%'
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: '12px',
              color: 'var(--accent)',
              marginBottom: '14px'
            }}>Step {String(i + 1).padStart(2, '0')}</div>
            <div style={{ fontWeight: 700, fontSize: '18px' }}>{step}</div>
          </div>
          </Reveal>
        ))}
      </div>
    </div>
    </Reveal>
  </section>
)

const SiteAudit = () => {
  const [form, setForm] = useState({ url: '', email: '' })
  const [errors, setErrors] = useState({ url: false, email: false })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }))
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validateUrl = (url) => url.trim().length > 3 && /\./.test(url)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!validateUrl(form.url)) newErrors.url = true
    if (!validateEmail(form.email)) newErrors.email = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'audit',
          url: form.url,
          email: form.email
        })
      })

      if (response.ok) setSubmitted(true)
    } catch (err) {
      console.error('Audit form submission error:', err)
      setSubmitted(true)
    }
  }

  return (
    <section id="audit" style={{
      padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
      borderBottom: '1px solid var(--border)'
    }}>
      <Reveal>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <span style={{
          fontFamily: "'JetBrains Mono'",
          fontSize: '12.5px',
          letterSpacing: '0.1em',
          color: 'var(--accent)'
        }}><Scramble text="06 / free audit" /></span>

        <h2 style={{ margin: '14px 0 14px', maxWidth: '620px' }}>See what your current site is costing you.</h2>

        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '540px', marginBottom: '32px' }}>
          Drop your URL below — we'll send a free teardown covering load speed, mobile experience, and missing booking/lead capture, within one business day.
        </p>

        {submitted ? (
          <div style={{
            maxWidth: '620px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              fontSize: '28px',
              color: 'var(--accent)',
              flexShrink: 0
            }}>✓</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Audit requested.</div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>We'll email your teardown within one business day.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} name="audit" style={{
            maxWidth: '620px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <div style={{ flex: '1 1 220px' }}>
              <input
                type="text"
                name="url"
                placeholder="yourbusiness.com"
                value={form.url}
                onChange={handleChange}
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: errors.url ? '1px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '14px',
                  color: 'var(--text-primary)',
                  fontFamily: 'Inter'
                }}
              />
              {errors.url && (
                <div style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '4px', fontFamily: "'JetBrains Mono'" }}>a valid site URL is required</div>
              )}
            </div>
            <div style={{ flex: '1 1 220px' }}>
              <input
                type="email"
                name="email"
                placeholder="you@business.com"
                value={form.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: errors.email ? '1px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '14px',
                  color: 'var(--text-primary)',
                  fontFamily: 'Inter'
                }}
              />
              {errors.email && (
                <div style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '4px', fontFamily: "'JetBrains Mono'" }}>a valid email is required</div>
              )}
            </div>
            <button type="submit" className="dd-btn dd-btn-fill" style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '14px 24px',
              background: 'var(--accent)',
              color: 'var(--accent-dark)',
              fontWeight: 700,
              borderRadius: '5px',
              fontFamily: "'JetBrains Mono'",
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>Send my audit</button>
          </form>
        )}
      </div>
      </Reveal>
    </section>
  )
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      q: 'Why not just use Wix or Squarespace?',
      a: "Template builders are fine for a digital business card. They fall apart once you need real logic — a booking calendar that checks availability, an admin panel only you can access, reviews pulled from your actual customers. That's custom app work, not a theme."
    },
    {
      q: 'Do I own my website?',
      a: "Yes — always. You own the code, the domain, and the login. If you ever want to leave, you take everything with you. No lock-in, no hostage situations."
    },
    {
      q: 'What if I want to switch developers later?',
      a: "You can, any time. Everything is handed off cleanly — hosting, domain, and admin access all stay in your name from day one."
    },
    {
      q: 'How fast do you respond?',
      a: "Within 2 hours during business hours, typically much faster. If something's broken, you're not waiting a week to hear back."
    },
    {
      q: 'What happens if my site goes down?',
      a: "Maintenance plans include monitoring — we know before you do, and it gets fixed fast. No maintenance plan still means a fast fix, just billed hourly."
    }
  ]

  return (
    <section id="faq" style={{
      padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
      borderBottom: '1px solid var(--border)'
    }}>
      <Reveal>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <span style={{
          fontFamily: "'JetBrains Mono'",
          fontSize: '12.5px',
          letterSpacing: '0.1em',
          color: 'var(--accent)'
        }}><Scramble text="07 / faq" /></span>

        <h2 style={{ margin: '14px 0 44px', maxWidth: '620px' }}>Questions worth asking before you hire anyone.</h2>

        <div style={{ maxWidth: '780px' }}>
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '22px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '16px' }}>{item.q}</span>
                  <span className={`dd-faq-icon${isOpen ? ' is-open' : ''}`} style={{
                    fontFamily: "'JetBrains Mono'",
                    fontSize: '18px',
                    color: 'var(--accent)',
                    flexShrink: 0
                  }}>+</span>
                </button>
                <div className={`dd-faq-answer-wrap${isOpen ? ' is-open' : ''}`}>
                  <div className="dd-faq-answer-inner">
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      paddingBottom: '22px',
                      maxWidth: '640px'
                    }}>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      </Reveal>
    </section>
  )
}

const Contact = () => {
  const [form, setForm] = useState({ name: '', biz: '', email: '', msg: '' })
  const [errors, setErrors] = useState({ name: false, email: false })
  const [submitted, setSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }))
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!form.name.trim()) newErrors.name = true
    if (!validateEmail(form.email)) newErrors.email = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Send to Netlify
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          name: form.name,
          email: form.email,
          business: form.biz,
          message: form.msg
        })
      })

      if (response.ok) {
        setSubmittedName(form.name.split(' ')[0])
        setSubmitted(true)
      }
    } catch (err) {
      console.error('Form submission error:', err)
      setSubmittedName(form.name.split(' ')[0])
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <section id="contact" style={{
        padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <span style={{
            fontFamily: "'JetBrains Mono'",
            fontSize: '12.5px',
            letterSpacing: '0.1em',
            color: 'var(--accent)'
          }}><Scramble text="08 / contact" /></span>

          <div className="dd-fade-up" style={{
            maxWidth: '760px',
            margin: '44px auto 0',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '24px'
            }}>✓</div>
            <h2>Received, {submittedName}.</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>We'll be in touch within a day.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" style={{
      padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
      borderBottom: '1px solid var(--border)',
      position: 'relative'
    }}>
      <img src="/assets/prism.jpg" alt="" style={{
        position: 'absolute',
        right: '-100px',
        top: 0,
        height: '100%',
        opacity: 0.16,
        objectFit: 'cover',
        pointerEvents: 'none'
      }} />

      <Reveal>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <span style={{
          fontFamily: "'JetBrains Mono'",
          fontSize: '12.5px',
          letterSpacing: '0.1em',
          color: 'var(--accent)'
        }}><Scramble text="08 / contact" /></span>

        <h2 style={{ margin: '14px 0 44px', maxWidth: '620px' }}>Let's talk about your project.</h2>

        <form onSubmit={handleSubmit} name="contact" style={{
          maxWidth: '760px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '40px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontFamily: "'JetBrains Mono'",
              fontSize: '12.5px',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              color: errors.name ? 'var(--accent)' : 'var(--text-primary)'
            }}>Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} style={{
              width: '100%',
              background: 'var(--bg-primary)',
              border: errors.name ? '1px solid var(--accent)' : '1px solid var(--border)',
              borderRadius: '4px',
              padding: '12px',
              color: 'var(--text-primary)',
              fontFamily: 'Inter'
            }} />
            {errors.name && (
              <div style={{
                color: 'var(--accent)',
                fontSize: '12px',
                marginTop: '4px',
                fontFamily: "'JetBrains Mono'"
              }}>name is required</div>
            )}
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontFamily: "'JetBrains Mono'",
              fontSize: '12.5px',
              letterSpacing: '0.1em',
              marginBottom: '8px'
            }}>Business type</label>
            <input type="text" name="biz" value={form.biz} onChange={handleChange} style={{
              width: '100%',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '12px',
              color: 'var(--text-primary)',
              fontFamily: 'Inter'
            }} />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontFamily: "'JetBrains Mono'",
              fontSize: '12.5px',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              color: errors.email ? 'var(--accent)' : 'var(--text-primary)'
            }}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={{
              width: '100%',
              background: 'var(--bg-primary)',
              border: errors.email ? '1px solid var(--accent)' : '1px solid var(--border)',
              borderRadius: '4px',
              padding: '12px',
              color: 'var(--text-primary)',
              fontFamily: 'Inter'
            }} />
            {errors.email && (
              <div style={{
                color: 'var(--accent)',
                fontSize: '12px',
                marginTop: '4px',
                fontFamily: "'JetBrains Mono'"
              }}>a valid email is required</div>
            )}
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontFamily: "'JetBrains Mono'",
              fontSize: '12.5px',
              letterSpacing: '0.1em',
              marginBottom: '8px'
            }}>What do you need?</label>
            <textarea name="msg" value={form.msg} onChange={handleChange} style={{
              width: '100%',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '12px',
              color: 'var(--text-primary)',
              fontFamily: 'Inter',
              minHeight: '120px',
              resize: 'vertical'
            }} />
          </div>

          <button type="submit" className="dd-btn dd-btn-fill" style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '14px 26px',
            background: 'var(--accent)',
            color: 'var(--accent-dark)',
            fontWeight: 700,
            borderRadius: '5px',
            fontFamily: "'JetBrains Mono'",
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer'
          }}>Send message →</button>
        </form>
      </div>
      </Reveal>
    </section>
  )
}

const Footer = () => (
  <footer style={{
    padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
    background: 'var(--bg-primary)',
    borderTop: '1px solid var(--border)'
  }}>
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', marginBottom: '48px' }}>
        <div>
          <Logo width={100} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '16px' }}>Phoenix, AZ — built local, built to last.</p>
          <div style={{ marginTop: '12px' }}><PhxClock /></div>
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>EMAIL</div>
          <a href="mailto:hello@desertdigital.dev" style={{ fontSize: '14px' }}>hello@desertdigital.dev</a>
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>PHONE</div>
          <a href="tel:+16025550142" style={{ fontSize: '14px' }}>(602) 555-0142</a>
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>FOLLOW</div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
            <a href="https://instagram.com" className="dd-nav-link">Instagram</a>
            <a href="https://linkedin.com" className="dd-nav-link">LinkedIn</a>
          </div>
        </div>
      </div>
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '24px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        © 2026 Desert Digital. All rights reserved.
      </div>
    </div>
  </footer>
)

export default function App() {
  // Track cursor position over cards for the spotlight effect
  useEffect(() => {
    if (prefersReducedMotion()) return
    const onMove = (e) => {
      const card = e.target.closest?.('.dd-card')
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      card.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="dd-site" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', background: 'var(--bg-primary)' }}>
      <ScrollProgress />
      <Nav />
      <Hero />
      <Marquee />
      <Services />
      <StarterKits />
      <CaseStudy />
      <Pricing />
      <Process />
      <SiteAudit />
      <FAQ />
      <Contact />
      <DesertHorizon />
      <Footer />
    </div>
  )
}
