import { useState } from 'react'
import './App.css'

const Logo = ({ width = 116 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', lineHeight: 1 }}>
    <span style={{
      fontFamily: "'JetBrains Mono'",
      fontWeight: 700,
      fontSize: '14px',
      letterSpacing: '0.05em',
      color: '#F2F2F0'
    }}>DESERT DIGITAL</span>
    <svg viewBox="0 0 240 20" width={width} height={width * 9 / 116} aria-hidden="true">
      <path d="M0 18 L60 18 L76 6 L120 6 L134 15 L176 15 L192 3 L240 3" fill="none" stroke="#F2F2F0" strokeWidth="3" />
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
      background: 'rgba(13, 13, 15, 0.82)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #26262b'
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
        <a href="#work" style={{ color: '#8A8A93' }}>Projects</a>
        <a href="#services" style={{ color: '#8A8A93' }}>Services</a>
        <a href="#pricing" style={{ color: '#8A8A93' }}>Pricing</a>
        <a href="#contact" style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '8px 16px',
          background: '#C9F04B',
          color: '#0D0D0F',
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F2F2F0" strokeWidth="2">
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
          borderBottom: '1px solid #26262b',
          padding: '16px clamp(20px, 5vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          fontFamily: "'JetBrains Mono'",
          fontSize: '14px',
          zIndex: 40
        }}>
          <a href="#work" onClick={closeMenu} style={{
            color: '#C9F04B',
            padding: '12px 0',
            borderBottom: '1px solid #26262b'
          }}>Projects</a>
          <a href="#services" onClick={closeMenu} style={{
            color: '#C9F04B',
            padding: '12px 0',
            borderBottom: '1px solid #26262b'
          }}>Services</a>
          <a href="#pricing" onClick={closeMenu} style={{
            color: '#C9F04B',
            padding: '12px 0',
            borderBottom: '1px solid #26262b'
          }}>Pricing</a>
          <a href="#contact" onClick={closeMenu} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            background: '#C9F04B',
            color: '#0D0D0F',
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

const Hero = () => (
  <header style={{
    position: 'relative',
    minHeight: '86vh',
    display: 'flex',
    alignItems: 'center',
    padding: 'clamp(40px, 7vh, 80px) clamp(20px, 5vw, 64px)',
    overflow: 'hidden',
    borderBottom: '1px solid #26262b'
  }}>
    <img src="/assets/neon-night.jpg" alt="Neon-lit night street" style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: 0.42
    }} />
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, #0D0D0F 28%, rgba(13,13,15,0.45) 72%, rgba(13,13,15,0.15))'
    }}></div>

    {/* Lightning flash */}
    <div className="dd-flash" style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(60% 80% at 78% 20%, rgba(201,240,75,0.5), transparent 60%)',
      pointerEvents: 'none',
      animation: 'ddFlash 2.4s ease-out 0.3s 1 both'
    }}></div>

    {/* Lightning bolt */}
    <svg viewBox="0 0 500 900" preserveAspectRatio="xMidYMin slice" style={{
      position: 'absolute',
      right: 0,
      top: 0,
      height: '100%',
      width: '44%',
      pointerEvents: 'none'
    }} aria-hidden="true">
      <path className="dd-bolt" d="M330,20 L250,300 L340,320 L200,640 L280,600 L150,880" fill="none" stroke="#C9F04B" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1200" style={{
        animation: 'ddStrike 2.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s 1 both',
        filter: 'drop-shadow(0 0 6px rgba(201,240,75,0.7))'
      }} />
    </svg>

    <div style={{ position: 'relative', maxWidth: '820px', zIndex: 2 }}>
      <div style={{
        fontFamily: "'JetBrains Mono'",
        fontSize: '12.5px',
        letterSpacing: '0.12em',
        color: '#C9F04B',
        marginBottom: '24px'
      }}>// Phoenix, AZ — web development studio</div>

      <h1 style={{ marginBottom: '24px' }}>Real websites for real local businesses.</h1>

      <p style={{
        fontSize: 'clamp(16px, 2vw, 20px)',
        color: '#8A8A93',
        maxWidth: '540px',
        marginBottom: '34px'
      }}>Custom-built web apps for small service businesses — booking, reviews, galleries, and an admin panel you actually control. Shipped in weeks, not months.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '52px' }}>
        <a href="#contact" style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '14px 26px',
          background: '#C9F04B',
          color: '#0D0D0F',
          fontWeight: 700,
          borderRadius: '5px',
          fontFamily: "'JetBrains Mono'",
          fontSize: '14px'
        }}>Start a project</a>
        <a href="#work" style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '14px 26px',
          background: 'transparent',
          color: '#F2F2F0',
          fontWeight: 600,
          borderRadius: '5px',
          border: '1px solid #3a3a41',
          fontFamily: "'JetBrains Mono'",
          fontSize: '14px'
        }}>View work</a>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px, 4vw, 52px)' }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono'",
            fontWeight: 700,
            fontSize: 'clamp(26px, 3vw, 38px)',
            color: '#C9F04B'
          }}>2–4 wks</div>
          <div style={{
            fontSize: '12.5px',
            color: '#8A8A93',
            fontFamily: "'JetBrains Mono'",
            marginTop: '4px'
          }}>typical turnaround</div>
        </div>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono'",
            fontWeight: 700,
            fontSize: 'clamp(26px, 3vw, 38px)',
            color: '#C9F04B'
          }}>&lt;1s</div>
          <div style={{
            fontSize: '12.5px',
            color: '#8A8A93',
            fontFamily: "'JetBrains Mono'",
            marginTop: '4px'
          }}>first-load target</div>
        </div>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono'",
            fontWeight: 700,
            fontSize: 'clamp(26px, 3vw, 38px)',
            color: '#C9F04B'
          }}>100%</div>
          <div style={{
            fontSize: '12.5px',
            color: '#8A8A93',
            fontFamily: "'JetBrains Mono'",
            marginTop: '4px'
          }}>client-managed</div>
        </div>
      </div>
    </div>
  </header>
)

const Services = () => (
  <section id="services" style={{
    padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
    borderBottom: '1px solid #26262b'
  }}>
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <span style={{
        fontFamily: "'JetBrains Mono'",
        fontSize: '12.5px',
        letterSpacing: '0.1em',
        color: '#C9F04B'
      }}>01 / services</span>

      <h2 style={{ margin: '14px 0 44px', maxWidth: '620px' }}>Everything your site needs to run itself.</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1px',
        background: '#26262b',
        border: '1px solid #26262b',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {['Custom web app builds', 'Admin dashboards', 'Maintenance & retainers', 'Add-ons on demand'].map((title, i) => (
          <div key={i} style={{
            background: '#161619',
            padding: '30px'
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: '12px',
              color: '#C9F04B',
              marginBottom: '14px'
            }}>[{String(i + 1).padStart(2, '0')}]</div>
            <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{title}</div>
            <p style={{ fontSize: '14px', color: '#8A8A93' }}>
              {i === 0 && 'A site built around how your business actually works — not squeezed into a template.'}
              {i === 1 && 'Change prices, hours, reviews, and photos yourself. No developer required.'}
              {i === 2 && 'We keep it fast, secure, and up to date so you can forget it exists.'}
              {i === 3 && 'AI chat, automation, online ordering, payments — added when it earns its place.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const CaseStudy = () => (
  <section id="work" style={{
    padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
    borderBottom: '1px solid #26262b'
  }}>
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <span style={{
        fontFamily: "'JetBrains Mono'",
        fontSize: '12.5px',
        letterSpacing: '0.1em',
        color: '#C9F04B'
      }}>02 / projects</span>

      <h2 style={{ margin: '14px 0 44px' }}>Sadie's Pet Care</h2>

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
          color: '#8A8A93',
          fontFamily: "'JetBrains Mono'",
          fontSize: '14px'
        }}>
          Screenshot placeholder
        </div>

        {/* Features */}
        <div style={{ background: '#161619', padding: '30px' }}>
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
              <span style={{
                background: '#C9F04B',
                color: '#0D0D0F',
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
    </div>
  </section>
)

const Pricing = () => (
  <section id="pricing" style={{
    padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
    borderBottom: '1px solid #26262b'
  }}>
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <span style={{
        fontFamily: "'JetBrains Mono'",
        fontSize: '12.5px',
        letterSpacing: '0.1em',
        color: '#C9F04B'
      }}>03 / pricing</span>

      <h2 style={{ margin: '14px 0 44px' }}>Transparent, flat pricing.</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1px',
        background: '#26262b',
        border: '1px solid #26262b',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {[
          { name: 'Starter build', price: '$2,500+', desc: 'one-time', tag: null },
          { name: 'Full app build', price: '$6,000+', desc: 'one-time', tag: 'MOST BUILDS', highlight: true },
          { name: 'Maintenance', price: '$150/mo+', desc: 'ongoing', tag: null }
        ].map((tier, i) => (
          <div key={i} style={{
            background: '#161619',
            padding: '30px',
            border: tier.highlight ? '1px solid #C9F04B' : 'none',
            boxShadow: tier.highlight ? 'inset 0 0 0 1px #C9F04B' : 'none',
            position: 'relative'
          }}>
            {tier.tag && (
              <div style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
                background: '#0D0D0F',
                padding: '4px 12px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: "'JetBrains Mono'",
                color: '#C9F04B',
                border: '1px solid #C9F04B'
              }}>{tier.tag}</div>
            )}
            <div style={{ marginTop: tier.tag ? '16px' : '0' }}>
              <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{tier.name}</div>
              <div style={{
                fontFamily: "'JetBrains Mono'",
                fontSize: '36px',
                fontWeight: 700,
                color: '#C9F04B',
                marginBottom: '8px'
              }}>{tier.price}</div>
              <p style={{ fontSize: '14px', color: '#8A8A93' }}>{tier.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const Process = () => (
  <section style={{
    padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
    borderBottom: '1px solid #26262b'
  }}>
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <span style={{
        fontFamily: "'JetBrains Mono'",
        fontSize: '12.5px',
        letterSpacing: '0.1em',
        color: '#C9F04B'
      }}>04 / process</span>

      <h2 style={{ margin: '14px 0 44px' }}>How we work together.</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1px',
        background: '#26262b',
        border: '1px solid #26262b',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {['We talk', 'Design', 'Build', 'Launch & hand off'].map((step, i) => (
          <div key={i} style={{
            background: '#161619',
            padding: '30px',
            textAlign: 'left'
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: '12px',
              color: '#C9F04B',
              marginBottom: '14px'
            }}>Step {String(i + 1).padStart(2, '0')}</div>
            <div style={{ fontWeight: 700, fontSize: '18px' }}>{step}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

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
        borderBottom: '1px solid #26262b'
      }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <span style={{
            fontFamily: "'JetBrains Mono'",
            fontSize: '12.5px',
            letterSpacing: '0.1em',
            color: '#C9F04B'
          }}>05 / contact</span>

          <div style={{
            maxWidth: '760px',
            margin: '44px auto 0',
            background: '#161619',
            border: '1px solid #26262b',
            borderRadius: '6px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '24px'
            }}>✓</div>
            <h2>Received, {submittedName}.</h2>
            <p style={{ color: '#8A8A93', marginTop: '16px' }}>We'll be in touch within a day.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" style={{
      padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
      borderBottom: '1px solid #26262b',
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

      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <span style={{
          fontFamily: "'JetBrains Mono'",
          fontSize: '12.5px',
          letterSpacing: '0.1em',
          color: '#C9F04B'
        }}>05 / contact</span>

        <h2 style={{ margin: '14px 0 44px', maxWidth: '620px' }}>Let's talk about your project.</h2>

        <form onSubmit={handleSubmit} name="contact" style={{
          maxWidth: '760px',
          background: '#161619',
          border: '1px solid #26262b',
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
              color: errors.name ? '#C9F04B' : '#F2F2F0'
            }}>Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} style={{
              width: '100%',
              background: '#0D0D0F',
              border: errors.name ? '1px solid #C9F04B' : '1px solid #26262b',
              borderRadius: '4px',
              padding: '12px',
              color: '#F2F2F0',
              fontFamily: 'Inter'
            }} />
            {errors.name && (
              <div style={{
                color: '#C9F04B',
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
              background: '#0D0D0F',
              border: '1px solid #26262b',
              borderRadius: '4px',
              padding: '12px',
              color: '#F2F2F0',
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
              color: errors.email ? '#C9F04B' : '#F2F2F0'
            }}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={{
              width: '100%',
              background: '#0D0D0F',
              border: errors.email ? '1px solid #C9F04B' : '1px solid #26262b',
              borderRadius: '4px',
              padding: '12px',
              color: '#F2F2F0',
              fontFamily: 'Inter'
            }} />
            {errors.email && (
              <div style={{
                color: '#C9F04B',
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
              background: '#0D0D0F',
              border: '1px solid #26262b',
              borderRadius: '4px',
              padding: '12px',
              color: '#F2F2F0',
              fontFamily: 'Inter',
              minHeight: '120px',
              resize: 'vertical'
            }} />
          </div>

          <button type="submit" style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '14px 26px',
            background: '#C9F04B',
            color: '#0D0D0F',
            fontWeight: 700,
            borderRadius: '5px',
            fontFamily: "'JetBrains Mono'",
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer'
          }}>Send message →</button>
        </form>
      </div>
    </section>
  )
}

const Footer = () => (
  <footer style={{
    padding: 'clamp(56px, 9vh, 110px) clamp(20px, 5vw, 64px)',
    background: '#0D0D0F',
    borderTop: '1px solid #26262b'
  }}>
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', marginBottom: '48px' }}>
        <div>
          <Logo width={100} />
          <p style={{ color: '#8A8A93', fontSize: '14px', marginTop: '16px' }}>Phoenix, AZ — built local, built to last.</p>
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: '12px', color: '#8A8A93', marginBottom: '12px' }}>EMAIL</div>
          <a href="mailto:hello@desertdigital.dev" style={{ fontSize: '14px' }}>hello@desertdigital.dev</a>
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: '12px', color: '#8A8A93', marginBottom: '12px' }}>PHONE</div>
          <a href="tel:+16025550142" style={{ fontSize: '14px' }}>(602) 555-0142</a>
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: '12px', color: '#8A8A93', marginBottom: '12px' }}>FOLLOW</div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
            <a href="https://instagram.com">Instagram</a>
            <a href="https://linkedin.com">LinkedIn</a>
          </div>
        </div>
      </div>
      <div style={{
        borderTop: '1px solid #26262b',
        paddingTop: '24px',
        fontSize: '12px',
        color: '#5a5a61',
        textAlign: 'center'
      }}>
        © 2026 Desert Digital. All rights reserved.
      </div>
    </div>
  </footer>
)

export default function App() {
  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', background: '#0D0D0F' }}>
      <Nav />
      <Hero />
      <Services />
      <CaseStudy />
      <Pricing />
      <Process />
      <Contact />
      <Footer />
    </div>
  )
}
