import { useState, useEffect, useRef, type CSSProperties, type MouseEvent as RMouseEvent } from 'react'

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const PROJECTS = [
  {
    id: 'forgex',
    name: 'ForgeX',
    shortName: 'ForgeX',
    category: 'Digital Forensics · Security · Open Source',
    description:
      'A forensic investigation toolkit built for evidence analysis, terminal-driven workflows, and open-source security research.',
    role: 'Developer',
    year: '2024',
    type: 'Open Source Tool',
    tech: ['Security', 'CLI', 'Forensics', 'Open Source'],
    liveUrl: 'https://landing749.github.io/ForgeX/',
    sourceUrl: 'https://github.com/Landing749/ForgeX',
    accent: '#3d6fa8',
    accentLight: '#ddeaf8',
    cardBg: ['#1e2535', '#131825'],
    textLight: true,
    size: 'large',
    // Organic constellation position (top-right area)
    pos: { top: '4%', right: '5%' },
    rotation: '-2deg',
    depth: 3,
    center: { x: 80.8, y: 27.8 },
  },
  {
    id: 'athstudios',
    name: 'ATHStudios',
    shortName: 'ATHStudios',
    category: 'Architecture · Engineering · Digital Studio',
    description:
      'A digital studio platform built with architectural precision — blueprints, systems thinking, and spatial design intelligence.',
    role: 'Designer & Developer',
    year: '2024',
    type: 'Studio Platform',
    tech: ['Architecture', 'Design Systems', 'Studio'],
    liveUrl: 'https://athstudios.dpdns.org',
    sourceUrl: 'https://github.com/Landing749/ATHStudios',
    accent: '#8b7355',
    accentLight: '#f0e8da',
    cardBg: ['#f8f4ee', '#ede7dd'],
    textLight: false,
    size: 'medium',
    pos: { top: '38%', left: '2%' },
    rotation: '1.5deg',
    depth: 2,
    center: { x: 13.7, y: 58.2 },
  },
  {
    id: 'dapres',
    name: 'Dr. Alfredo Pio De Roda',
    shortName: 'Dr. Alfredo',
    category: 'Education · Institution · Community Portal',
    description:
      'An institutional web portal serving the Dr. Alfredo Pio De Roda Elementary School — connecting educators, students, and community.',
    role: 'Full-Stack Developer',
    year: '2024',
    type: 'Institutional Portal',
    tech: ['Education', 'Portal', 'Community', 'Web'],
    liveUrl: 'https://dapres.dpdns.org',
    sourceUrl: 'https://github.com/Landing749/Dr-Alfredo-Pio-De-Roda',
    accent: '#2d8a6b',
    accentLight: '#d8f0e9',
    cardBg: ['#f0faf5', '#e2f4ec'],
    textLight: false,
    size: 'medium',
    pos: { bottom: '6%', left: '18%' },
    rotation: '-1deg',
    depth: 2,
    center: { x: 29.7, y: 73.8 },
  },
  {
    id: 'acadex',
    name: 'Acadex',
    shortName: 'Acadex',
    category: 'Academic · Platform · Learning Management',
    description:
      'A modern academic platform streamlining learning, coursework submission, and institutional administrative workflows.',
    role: 'Developer',
    year: '2024',
    type: 'EdTech Platform',
    tech: ['EdTech', 'Platform', 'LMS', 'SaaS'],
    liveUrl: 'https://acadex.dpdns.org',
    sourceUrl: 'https://github.com/Landing749/Acadex',
    accent: '#6b5ba8',
    accentLight: '#ede8f8',
    cardBg: ['#f5f2fc', '#ece6f8'],
    textLight: false,
    size: 'small',
    pos: { top: '8%', left: '6%' },
    rotation: '2deg',
    depth: 1,
    center: { x: 16, y: 25.9 },
  },
  {
    id: 'lane-academy',
    name: 'Lane Academy',
    shortName: 'Lane Academy',
    category: 'Education · Courses · Online Learning',
    description:
      'A course platform and learning environment crafted for modern, structured educational delivery and student engagement.',
    role: 'Developer & Designer',
    year: '2024',
    type: 'Learning Platform',
    tech: ['Courses', 'Academy', 'E-Learning', 'Web'],
    liveUrl: 'https://landing749.github.io/Lane-Academy/',
    sourceUrl: 'https://github.com/Landing749/Lane-Academy',
    accent: '#c4623f',
    accentLight: '#faeae2',
    cardBg: ['#fef6f2', '#f8ece4'],
    textLight: false,
    size: 'medium',
    pos: { bottom: '4%', right: '4%' },
    rotation: '-2.5deg',
    depth: 2,
    center: { x: 84.3, y: 75.8 },
  },
]

const TOOLS = [
  { name: 'React', color: '#61dafb', bg: '#e8f9fd' },
  { name: 'TypeScript', color: '#3178c6', bg: '#e6eefa' },
  { name: 'Vite', color: '#646cff', bg: '#eaebff' },
  { name: 'Tailwind CSS', color: '#06b6d4', bg: '#e0f8fc' },
  { name: 'Node.js', color: '#339933', bg: '#e0f5e0' },
  { name: 'Git', color: '#f05032', bg: '#fde8e4' },
  { name: 'GitHub', color: '#24292e', bg: '#e8e8e8' },
  { name: 'CSS', color: '#264de4', bg: '#e5eafd' },
  { name: 'HTML', color: '#e34f26', bg: '#fde8e2' },
  { name: 'Python', color: '#3572A5', bg: '#e5edf8' },
  { name: 'JavaScript', color: '#f7df1e', bg: '#fefbe5' },
]

/* ─── Clay shadow helpers ─────────────────────────────────────────────────────
   Centralized shadow "recipes" so every clay surface shares the same warm,
   tinted-ink shadows + soft highlight instead of flat black drop-shadows —
   and can optionally pick up a subtle color-glow from a project's accent. */

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`
}

function claySoft(elevation: 'sm' | 'md' | 'lg' | 'xl' = 'md', glow?: string) {
  const e = {
    sm: { y: 8, b: 22, y2: 3, b2: 7 },
    md: { y: 16, b: 44, y2: 5, b2: 14 },
    lg: { y: 26, b: 72, y2: 8, b2: 22 },
    xl: { y: 40, b: 100, y2: 12, b2: 32 },
  }[elevation]
  const glowLayer = glow ? `, 0 ${e.y * 0.8}px ${e.b * 1.4}px -${e.b * 0.3}px rgba(${hexToRgb(glow)}, 0.35)` : ''
  return (
    `0 ${e.y}px ${e.b}px -${Math.round(e.b * 0.2)}px rgba(58,46,36,0.24), ` +
    `0 ${e.y2}px ${e.b2}px rgba(58,46,36,0.12), ` +
    `inset 0 2px 0 rgba(255,255,255,0.9), ` +
    `inset 0 1px 3px rgba(255,255,255,0.5), ` +
    `inset 0 -4px 9px rgba(58,46,36,0.06)` + glowLayer
  )
}

function clayPressed() {
  return '0 3px 10px rgba(58,46,36,0.18), inset 0 3px 6px rgba(58,46,36,0.16), inset 0 -1px 2px rgba(255,255,255,0.55)'
}

/* ─── Hooks ─────────────────────────────────────────────────────────────────── */

function useMouse() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  useEffect(() => {
    const h = (e: globalThis.MouseEvent) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [])
  return mouse
}

/* ─── Floating Nav ───────────────────────────────────────────────────────────── */

function FloatingNav({ onNav: _onNav }: { onNav: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const links = ['HOME', 'WORK', 'ABOUT', 'TOOLKIT', 'GITHUB', 'CONTACT']
  const ids = ['hero', 'work', 'about', 'toolkit', 'vault', 'contact']

  return (
    <nav
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '10px 18px',
        background: scrolled
          ? 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(245,240,235,0.94))'
          : 'linear-gradient(160deg, rgba(255,255,255,0.88), rgba(245,240,235,0.84))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '100px',
        boxShadow: scrolled ? claySoft('md') : claySoft('sm'),
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {links.map((label, i) => (
        <NavItem key={label} label={label} onClick={() => {
          const el = document.getElementById(ids[i])
          el?.scrollIntoView({ behavior: 'smooth' })
        }} />
      ))}
    </nav>
  )
}

function NavItem({ label, onClick }: { label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: hov ? '#1a1714' : '#6b6460',
        padding: '6px 14px',
        borderRadius: '100px',
        border: 'none',
        cursor: 'pointer',
        background: hov ? 'linear-gradient(160deg, #fff, #ede8e0)' : 'transparent',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? claySoft('sm') : 'none',
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {label}
    </button>
  )
}

/* ─── Floating Shape ─────────────────────────────────────────────────────────── */

function ClayBlob({
  size,
  color,
  style,
  animClass,
}: {
  size: number
  color: string
  style?: CSSProperties
  animClass?: string
}) {
  return (
    <div
      className={animClass}
      style={{
        width: size,
        height: size,
        borderRadius: '60% 40% 55% 45% / 50% 60% 40% 55%',
        background: color,
        boxShadow: `0 ${size * 0.15}px ${size * 0.4}px rgba(58,46,36,0.10), 0 ${size * 0.04}px ${size * 0.1}px rgba(58,46,36,0.06), inset 0 ${size * 0.04}px 0 rgba(255,255,255,0.75), inset 0 -${size * 0.05}px ${size * 0.08}px rgba(58,46,36,0.05)`,
        flexShrink: 0,
        ...style,
      }}
    />
  )
}

function ClayTag({ label }: { label: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 18px',
        borderRadius: '100px',
        background: 'linear-gradient(160deg, #fff, #ede8e0)',
        boxShadow: hov ? claySoft('md') : claySoft('sm'),
        transform: hov ? 'translateY(-4px) scale(1.04)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'default',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.06em',
        color: '#1a1714',
      }}
    >
      {label}
    </div>
  )
}

/* ─── Hero Section ───────────────────────────────────────────────────────────── */

function HeroSection() {
  const mouse = useMouse()
  const px = (mouse.x - 0.5)
  const py = (mouse.y - 0.5)

  const parallaxFar = { transform: `translate(${px * -12}px, ${py * -8}px)` }
  const parallaxMid = { transform: `translate(${px * -24}px, ${py * -16}px)` }
  const parallaxNear = { transform: `translate(${px * -36}px, ${py * -24}px)` }

  const dotsBg: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(circle, rgba(155,142,196,0.25) 1.2px, transparent 1.4px)',
    backgroundSize: '22px 22px',
    pointerEvents: 'none',
  }

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #f7f3ee 0%, #f0ece5 50%, #eae5dc 100%)',
      }}
    >
      <div style={dotsBg} />

      {/* Background blobs — far layer */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...parallaxFar }}>
        <ClayBlob
          size={320}
          color="linear-gradient(135deg, rgba(155,142,196,0.25), rgba(94,142,196,0.18))"
          style={{ position: 'absolute', top: '-80px', right: '-60px', animation: 'floatA 9s ease-in-out infinite' }}
          animClass=""
        />
        <ClayBlob
          size={200}
          color="linear-gradient(135deg, rgba(196,123,107,0.2), rgba(196,123,107,0.12))"
          style={{ position: 'absolute', bottom: '80px', left: '-40px', animation: 'floatC 12s ease-in-out infinite' }}
          animClass=""
        />
        <ClayBlob
          size={140}
          color="linear-gradient(135deg, rgba(94,168,152,0.22), rgba(94,168,152,0.14))"
          style={{ position: 'absolute', top: '40%', right: '15%', animation: 'floatB 8s ease-in-out infinite' }}
          animClass=""
        />
      </div>

      {/* Middle layer — floating clay tags */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...parallaxMid }}>
        {[
          { label: 'BUILD', pos: { top: '20%', left: '12%' }, delay: '0s' },
          { label: 'DESIGN', pos: { top: '14%', right: '22%' }, delay: '1.2s' },
          { label: 'SYSTEMS', pos: { bottom: '28%', right: '16%' }, delay: '0.6s' },
          { label: 'CREATE', pos: { bottom: '22%', left: '20%' }, delay: '2s' },
          { label: 'EXPERIMENT', pos: { top: '50%', left: '6%' }, delay: '0.4s' },
          { label: 'LEARN', pos: { top: '60%', right: '10%' }, delay: '1.8s' },
        ].map(({ label, pos, delay }) => (
          <div
            key={label}
            style={{
              position: 'absolute',
              ...pos,
              animation: `floatB 7s ease-in-out infinite`,
              animationDelay: delay,
              pointerEvents: 'none',
            }}
          >
            <ClayTag label={label} />
          </div>
        ))}
      </div>

      {/* Main hero content — near layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '120px 48px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          alignItems: 'center',
        }}
      >
        {/* Left: text */}
        <div style={{ ...parallaxNear, transition: 'transform 0.1s ease-out' }}>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#9b8ec4',
              marginBottom: '24px',
              textTransform: 'uppercase',
            }}
          >
            ROOM 01 — THE STUDIO
          </div>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(42px, 6vw, 76px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#1a1714',
              margin: '0 0 8px',
            }}
          >
            I BUILD
          </h1>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(42px, 6vw, 76px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#1a1714',
              margin: '0 0 8px',
            }}
          >
            DIGITAL
          </h1>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(42px, 6vw, 76px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #9b8ec4, #5e8fc4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0 0 28px',
            }}
          >
            EXPERIENCES
          </h1>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#1a1714',
              margin: '0 0 32px',
            }}
          >
            THAT FEEL ALIVE.
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '17px',
              lineHeight: 1.7,
              color: '#6b6460',
              fontWeight: 400,
              maxWidth: '440px',
              margin: '0 0 48px',
            }}
          >
            Developer × Designer × Systems Builder.
            <br />
            I create spatial interfaces, build real products, and make the source available.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <ClayButton
              primary
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            >
              EXPLORE MY WORK
            </ClayButton>
            <ClayButton href="https://github.com/Landing749">
              <GithubIcon size={16} /> VIEW GITHUB
            </ClayButton>
          </div>
        </div>

        {/* Right: main hero object */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            height: '480px',
          }}
        >
          {/* Central identity card */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '220px',
              height: '260px',
              background: 'linear-gradient(145deg, #ffffff, #ede8e0)',
              borderRadius: '32px',
              boxShadow:
                '0 40px 80px rgba(0,0,0,0.18), 0 16px 40px rgba(0,0,0,0.10), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -4px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              zIndex: 5,
              animation: 'floatA 7s ease-in-out infinite',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #9b8ec4, #5e8fc4)',
                boxShadow: '0 8px 24px rgba(155,142,196,0.4), inset 0 2px 0 rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>⚡</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '22px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#1a1714',
                }}
              >
                Athan Meir Obrero
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '12px',
                  color: '#9b9490',
                  marginTop: '4px',
                }}
              >
                Digital Studio
              </div>
            </div>
          </div>

          {/* Orbiting small objects */}
          {[
            { label: 'GITHUB', top: '8%', left: '12%', color: '#e8e8e8', delay: '0s', icon: '⬡' },
            { label: 'WORK', top: '36%', left: '-4%', color: '#ddeaf8', delay: '1s', icon: '◈' },
            { label: 'ABOUT', top: '36%', right: '-4%', color: '#f0e8da', delay: '2s', icon: '○' },
            { label: 'TOOLKIT', bottom: '8%', right: '14%', color: '#ede8f8', delay: '1.5s', icon: '◇' },
          ].map(({ label, color, delay, icon, ...pos }) => (
            <div
              key={label}
              style={{
                position: 'absolute',
                ...pos,
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: `linear-gradient(145deg, ${color}, ${color}cc)`,
                boxShadow:
                  '0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `floatB 6s ease-in-out infinite`,
                animationDelay: delay,
                zIndex: 4,
              }}
            >
              <span style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</span>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#6b6460',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          animation: 'floatD 2.5s ease-in-out infinite',
        }}
      >
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#b0a9a2',
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, #b0a9a2, transparent)',
          }}
        />
      </div>
    </section>
  )
}

/* ─── Clay Button ────────────────────────────────────────────────────────────── */

function ClayButton({
  children,
  onClick,
  href,
  primary,
  small,
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  primary?: boolean
  small?: boolean
}) {
  const [pressed, setPressed] = useState(false)
  const pad = small ? '8px 18px' : '14px 28px'
  const fontSize = small ? '11px' : '13px'

  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: pad,
    borderRadius: '100px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textDecoration: 'none',
    transition: 'all 0.18s ease',
    userSelect: 'none',
  }

  const style: CSSProperties = primary
    ? {
        ...base,
        background: pressed
          ? 'linear-gradient(160deg, #111, #1a1714)'
          : 'linear-gradient(160deg, #2a2420, #1a1714)',
        color: '#f5f0eb',
        boxShadow: pressed
          ? clayPressed()
          : '0 14px 34px -8px rgba(26,23,20,0.5), 0 4px 10px rgba(26,23,20,0.24), inset 0 1.5px 0 rgba(255,255,255,0.14), inset 0 -3px 6px rgba(0,0,0,0.3)',
        transform: pressed ? 'translateY(2px) scale(0.97)' : 'none',
      }
    : {
        ...base,
        background: pressed
          ? 'linear-gradient(160deg, #e8e2d8, #ddd8ce)'
          : 'linear-gradient(160deg, #ffffff, #ede8e0)',
        color: '#1a1714',
        boxShadow: pressed ? clayPressed() : claySoft('md'),
        transform: pressed ? 'translateY(2px) scale(0.97)' : 'none',
      }

  const handlers = {
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style} {...handlers}>
        {children}
      </a>
    )
  }
  return (
    <button onClick={onClick} style={style} {...handlers}>
      {children}
    </button>
  )
}

/* ─── Icons ──────────────────────────────────────────────────────────────────── */

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function ExternalLinkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

/* ─── Project Card ───────────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  onOpen,
}: {
  project: typeof PROJECTS[0]
  onOpen: (p: typeof PROJECTS[0]) => void
}) {
  const [hov, setHov] = useState(false)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const sizeMap = { large: 340, medium: 280, small: 240 }
  const w = sizeMap[project.size as keyof typeof sizeMap]
  const h = project.size === 'large' ? 400 : project.size === 'small' ? 300 : 340

  const handleMouseMove = (e: RMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setRot({ x: dy * -8, y: dx * 8 })
  }

  const [bg1, bg2] = project.cardBg

  return (
    <div style={{ width: w, height: h, position: 'relative', perspective: '1400px' }}>
      {/* Ground contact shadow — shrinks + softens as the card lifts, so the
          hover state reads as genuine elevation off the canvas rather than
          just a scale/skew */}
      <div
        style={{
          position: 'absolute',
          left: '8%',
          right: '8%',
          bottom: hov ? '-22px' : '-10px',
          height: '28px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, rgba(${hexToRgb(project.accent)}, ${hov ? 0.28 : 0.16}) 0%, transparent 72%)`,
          filter: hov ? 'blur(14px)' : 'blur(7px)',
          opacity: hov ? 0.9 : 0.6,
          transform: hov ? 'scale(0.86)' : 'scale(1)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none',
        }}
      />
      <div
        ref={cardRef}
        onMouseEnter={() => setHov(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setHov(false); setRot({ x: 0, y: 0 }) }}
        onClick={() => onOpen(project)}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '32px',
          background: `linear-gradient(145deg, ${bg1}, ${bg2})`,
          boxShadow: hov ? claySoft('xl', project.accent) : claySoft('lg'),
          transform: hov
            ? `translateY(-20px) translateZ(60px) scale(1.03) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`
            : `rotate(${project.rotation}) translateY(0) translateZ(0)`,
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
          transition: hov
            ? 'box-shadow 0.3s ease, transform 0.08s ease'
            : 'box-shadow 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '32px',
        }}
      >
      {/* Accent color bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '32px',
          right: '32px',
          height: '3px',
          borderRadius: '0 0 4px 4px',
          background: project.accent,
          opacity: hov ? 1 : 0.5,
          transition: 'opacity 0.3s',
        }}
      />

      {/* Category chip */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '5px 12px',
          borderRadius: '100px',
          background: project.accentLight,
          marginBottom: '24px',
          width: 'fit-content',
        }}
      >
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: project.accent,
          }}
        >
          {project.tech[0].toUpperCase()}
        </span>
      </div>

      {/* Project name */}
      <h3
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: project.size === 'large' ? '34px' : '26px',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: project.textLight ? '#f5f0eb' : '#1a1714',
          margin: '0 0 12px',
        }}
      >
        {project.name}
      </h3>

      {/* Category */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '12px',
          color: project.textLight ? 'rgba(245,240,235,0.6)' : '#9b9490',
          margin: '0 0 16px',
          letterSpacing: '0.02em',
        }}
      >
        {project.category}
      </p>

      {/* Description — fades in on hover */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          lineHeight: 1.6,
          color: project.textLight ? 'rgba(245,240,235,0.8)' : '#6b6460',
          margin: '0',
          opacity: hov ? 1 : 0,
          transform: hov ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          flex: 1,
        }}
      >
        {project.description}
      </p>

      {/* Action buttons — emerge on hover */}
      <div
        style={{
          marginTop: '24px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          opacity: hov ? 1 : 0,
          transform: hov ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Live Demo */}
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '9px 18px',
            borderRadius: '100px',
            background: project.textLight
              ? 'linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.10))'
              : 'linear-gradient(160deg, #1a1714, #2a2420)',
            color: project.textLight ? '#f5f0eb' : '#f5f0eb',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textDecoration: 'none',
            boxShadow: project.textLight
              ? '0 4px 14px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
              : '0 6px 20px rgba(26,23,20,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: project.textLight ? '1px solid rgba(255,255,255,0.2)' : 'none',
            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = ''
          }}
        >
          <ExternalLinkIcon size={13} />
          LIVE DEMO
        </a>

        {/* View Source */}
        <a
          href={project.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '9px 18px',
            borderRadius: '100px',
            background: 'linear-gradient(160deg, #ffffff, #ede8e0)',
            color: '#1a1714',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textDecoration: 'none',
            boxShadow:
              '0 4px 14px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -2px 3px rgba(0,0,0,0.04)',
            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'
            e.currentTarget.style.boxShadow =
              '0 8px 24px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.98)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow =
              '0 4px 14px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -2px 3px rgba(0,0,0,0.04)'
          }}
        >
          <GithubIcon size={13} />
          VIEW SOURCE
        </a>
      </div>

      {/* Bottom label shown when not hovered */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '28px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: project.textLight ? 'rgba(245,240,235,0.35)' : 'rgba(26,23,20,0.25)',
          opacity: hov ? 0 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        HOVER ↗
      </div>
      </div>
    </div>
  )
}

/* ─── Project Detail Overlay ─────────────────────────────────────────────────── */

function ProjectDetail({
  project,
  onClose,
}: {
  project: typeof PROJECTS[0]
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  const [btnHov, setBtnHov] = useState<string | null>(null)
  const [bg1, bg2] = project.cardBg

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => { cancelAnimationFrame(t); window.removeEventListener('keydown', handleKey) }
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: `rgba(26, 23, 20, ${mounted ? 0.72 : 0})`,
        backdropFilter: `blur(${mounted ? 20 : 0}px)`,
        WebkitBackdropFilter: `blur(${mounted ? 20 : 0}px)`,
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '40px',
          background: `linear-gradient(145deg, ${bg1}, ${bg2})`,
          boxShadow:
            '0 60px 120px rgba(0,0,0,0.35), 0 24px 60px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.85)',
          transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(30px)',
          opacity: mounted ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '28px',
            right: '28px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(160deg, #fff, #ede8e0)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            color: '#6b6460',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
            zIndex: 10,
            transition: 'transform 0.18s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
        >
          ✕
        </button>

        <div style={{ padding: '56px' }}>
          {/* Room label */}
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: project.accent,
              marginBottom: '16px',
              textTransform: 'uppercase',
            }}
          >
            SELECTED WORK — CASE STUDY
          </div>

          {/* Title + primary actions */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', marginBottom: '12px' }}>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(40px, 5vw, 64px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
                color: project.textLight ? '#f5f0eb' : '#1a1714',
                margin: 0,
              }}
            >
              {project.name}
            </h2>

            {/* Top action buttons */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setBtnHov('live')}
                onMouseLeave={() => setBtnHov(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '100px',
                  background: 'linear-gradient(160deg, #2a2420, #1a1714)',
                  color: '#f5f0eb',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textDecoration: 'none',
                  boxShadow: btnHov === 'live'
                    ? '0 16px 40px rgba(26,23,20,0.5), inset 0 1px 0 rgba(255,255,255,0.12)'
                    : '0 8px 24px rgba(26,23,20,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                  transform: btnHov === 'live' ? 'translateY(-4px) scale(1.04)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <ExternalLinkIcon size={14} />
                LIVE DEMO ↗
              </a>
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setBtnHov('src')}
                onMouseLeave={() => setBtnHov(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '100px',
                  background: 'linear-gradient(160deg, #ffffff, #ede8e0)',
                  color: '#1a1714',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textDecoration: 'none',
                  boxShadow: btnHov === 'src'
                    ? '0 14px 36px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.98)'
                    : '0 6px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.95)',
                  transform: btnHov === 'src' ? 'translateY(-4px) scale(1.04)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <GithubIcon size={14} />
                VIEW SOURCE ◇
              </a>
            </div>
          </div>

          {/* Category */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: project.textLight ? 'rgba(245,240,235,0.55)' : '#9b9490',
              margin: '0 0 40px',
            }}
          >
            {project.category}
          </p>

          {/* Main content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '48px' }}>
            {/* Left: description */}
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '16px',
                  lineHeight: 1.75,
                  color: project.textLight ? 'rgba(245,240,235,0.8)' : '#4a4540',
                  margin: '0 0 32px',
                }}
              >
                {project.description}
              </p>

              {/* Tech tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.tech.map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '100px',
                      background: project.accentLight,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: project.accent,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: metadata floating objects */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'ROLE', value: project.role },
                { label: 'TYPE', value: project.type },
                { label: 'YEAR', value: project.year },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '20px',
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.7), rgba(245,240,235,0.5))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: project.textLight ? 'rgba(245,240,235,0.45)' : '#b0a9a2',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '14px',
                      fontWeight: 500,
                      color: project.textLight ? '#f5f0eb' : '#1a1714',
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}

              {/* URL preview */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '20px',
                  background: 'linear-gradient(160deg, rgba(255,255,255,0.7), rgba(245,240,235,0.5))',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#b0a9a2',
                    marginBottom: '6px',
                  }}
                >
                  LINKS
                </div>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '12px',
                    color: project.accent,
                    textDecoration: 'none',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ↗ {project.liveUrl}
                </a>
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '12px',
                    color: project.accent,
                    textDecoration: 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ◇ {project.sourceUrl}
                </a>
              </div>
            </div>
          </div>

          {/* Footer CTA — "Explore the Project" */}
          <div
            style={{
              padding: '48px',
              borderRadius: '32px',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(240,235,228,0.4))',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.16em',
                color: '#b0a9a2',
                marginBottom: '16px',
                textTransform: 'uppercase',
              }}
            >
              EXPLORE THE PROJECT
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <FooterCTABtn
                href={project.liveUrl}
                icon={<ExternalLinkIcon size={16} />}
                label="OPEN LIVE DEMO ↗"
                dark
              />
              <FooterCTABtn
                href={project.sourceUrl}
                icon={<GithubIcon size={16} />}
                label="VIEW SOURCE ON GITHUB ◇"
                dark={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FooterCTABtn({
  href,
  icon,
  label,
  dark,
}: {
  href: string
  icon: React.ReactNode
  label: string
  dark: boolean
}) {
  const [hov, setHov] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '18px 36px',
        borderRadius: '100px',
        textDecoration: 'none',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '13px',
        fontWeight: 700,
        letterSpacing: '0.06em',
        transition: 'all 0.2s ease',
        ...(dark
          ? {
              background: pressed
                ? 'linear-gradient(160deg, #111, #1a1714)'
                : hov
                ? 'linear-gradient(160deg, #2e2824, #1e1a16)'
                : 'linear-gradient(160deg, #2a2420, #1a1714)',
              color: '#f5f0eb',
              boxShadow: pressed
                ? '0 4px 12px rgba(26,23,20,0.3), inset 0 2px 4px rgba(0,0,0,0.3)'
                : hov
                ? '0 20px 50px rgba(26,23,20,0.5), 0 8px 20px rgba(26,23,20,0.3), inset 0 1px 0 rgba(255,255,255,0.12)'
                : '0 12px 36px rgba(26,23,20,0.4), 0 5px 14px rgba(26,23,20,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
              transform: pressed ? 'translateY(2px) scale(0.97)' : hov ? 'translateY(-5px) scale(1.04)' : 'none',
            }
          : {
              background: pressed
                ? 'linear-gradient(160deg, #e8e2d8, #ddd8ce)'
                : hov
                ? 'linear-gradient(160deg, #fff, #f5f0eb)'
                : 'linear-gradient(160deg, #ffffff, #ede8e0)',
              color: '#1a1714',
              boxShadow: pressed
                ? '0 2px 6px rgba(0,0,0,0.10), inset 0 2px 4px rgba(0,0,0,0.08)'
                : hov
                ? '0 18px 48px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.98)'
                : '0 8px 28px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95)',
              transform: pressed ? 'translateY(2px) scale(0.97)' : hov ? 'translateY(-5px) scale(1.04)' : 'none',
            }),
      }}
    >
      {icon}
      {label}
    </a>
  )
}

/* ─── Projects Section ───────────────────────────────────────────────────────── */

function ProjectsSection({ onOpen }: { onOpen: (p: typeof PROJECTS[0]) => void }) {
  const mouse = useMouse()
  const px = mouse.x - 0.5
  const py = mouse.y - 0.5

  // Connector order — a hand-picked path through the constellation so the
  // dotted line reads as a deliberate route between nodes, not noise.
  const order = ['acadex', 'forgex', 'athstudios', 'dapres', 'lane-academy']
  const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]))
  const links = order.slice(0, -1).map((id, i) => [byId[id], byId[order[i + 1]]] as const)

  return (
    <section
      id="work"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '120px 48px',
        background: 'linear-gradient(180deg, #eae5dc 0%, #e4ddd4 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <ClayBlob
          size={400}
          color="linear-gradient(135deg, rgba(155,142,196,0.15), rgba(94,142,196,0.10))"
          style={{ position: 'absolute', top: '-100px', right: '-100px', animation: 'floatA 14s ease-in-out infinite' }}
        />
        <ClayBlob
          size={280}
          color="linear-gradient(135deg, rgba(94,168,152,0.14), rgba(94,168,152,0.08))"
          style={{ position: 'absolute', bottom: '100px', left: '-80px', animation: 'floatC 11s ease-in-out infinite' }}
        />
      </div>

      {/* Section header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 80px', position: 'relative' }}>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#9b8ec4',
            marginBottom: '16px',
          }}
        >
          ROOM 02 — THE PROJECT CONSTELLATION
        </div>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#1a1714',
            margin: 0,
          }}
        >
          SELECTED
          <br />
          WORK
        </h2>
      </div>

      {/* Constellation — organic layout with true depth: connector lines +
          per-card parallax (cards closer to the viewer, higher `depth`,
          drift further with the cursor than cards further back) */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          minHeight: '840px',
        }}
      >
        {/* Dotted constellation lines threading the nodes together, drawn
            behind every card, scaled in % so it always lines up with the
            percentage-positioned cards regardless of viewport width */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
        >
          {links.map(([a, b], i) => (
            <line
              key={i}
              x1={a.center.x}
              y1={a.center.y}
              x2={b.center.x}
              y2={b.center.y}
              stroke="rgba(58,46,36,0.16)"
              strokeWidth={0.12}
              strokeDasharray="0.6 1.4"
              strokeLinecap="round"
            />
          ))}
          {PROJECTS.map((p) => (
            <circle key={p.id} cx={p.center.x} cy={p.center.y} r={0.45} fill="rgba(58,46,36,0.22)" />
          ))}
        </svg>

        {PROJECTS.map((p) => {
          // Foreground (higher depth) cards drift more with the cursor;
          // background cards barely move — the classic parallax depth cue.
          const drift = p.depth * 6
          return (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                ...p.pos,
                zIndex: p.depth,
                transform: `translate(${px * drift}px, ${py * drift}px)`,
                transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <ProjectCard project={p} onOpen={onOpen} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ─── About Section ──────────────────────────────────────────────────────────── */

function AboutSection() {
  return (
    <section
      id="about"
      style={{
        minHeight: '100vh',
        padding: '120px 48px',
        background: 'linear-gradient(160deg, #f0ece5 0%, #ede7df 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        {/* Label */}
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#c47b6b',
            marginBottom: '20px',
          }}
        >
          ROOM 03 — THE WORKSPACE
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          {/* Text */}
          <div>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(36px, 5vw, 60px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#1a1714',
                margin: '0 0 28px',
              }}
            >
              BEHIND
              <br />
              THE STUDIO
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '17px',
                lineHeight: 1.75,
                color: '#6b6460',
                margin: '0 0 24px',
              }}
            >
              I&apos;m Athan Meir E. Obrero — a developer and designer who builds real, deployed products. Every project I create is live, open-source, and available for anyone to inspect.
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '17px',
                lineHeight: 1.75,
                color: '#6b6460',
                margin: '0 0 40px',
              }}
            >
              I work at the intersection of design systems, educational technology, and spatial interfaces. My studio is the code.
            </p>
            <ClayButton href="https://github.com/Landing749">
              <GithubIcon size={16} /> EXPLORE GITHUB
            </ClayButton>
          </div>

          {/* Workspace visual */}
          <div style={{ position: 'relative', height: '420px' }}>
            {/* Main workspace card */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '280px',
                height: '320px',
                background: 'linear-gradient(145deg, #ffffff, #ede8e0)',
                borderRadius: '36px',
                boxShadow:
                  '0 32px 80px rgba(0,0,0,0.18), 0 12px 32px rgba(0,0,0,0.10), inset 0 2px 0 rgba(255,255,255,0.95)',
                padding: '32px',
                animation: 'floatA 8s ease-in-out infinite',
              }}
            >
              {/* Mock code window */}
              <div
                style={{
                  background: '#1e2535',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '16px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                  {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                    <div key={c} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />
                  ))}
                </div>
                {['const studio = {', '  name: "Athan Obrero",', '  builds: "real things",', '}'].map((line, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '10px',
                      color: i === 0 ? '#9b8ec4' : i === 3 ? '#9b8ec4' : '#a8b4c8',
                      lineHeight: 1.8,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1a1714',
                  marginBottom: '8px',
                }}
              >
                Currently building
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '12px',
                  color: '#9b9490',
                  lineHeight: 1.5,
                }}
              >
                Spatial interfaces &<br />educational platforms
              </div>
            </div>

            {/* Floating objects */}
            {[
              { label: 'Deploy', bg: '#d8f0e9', color: '#2d8a6b', pos: { top: '10%', right: '0%' }, delay: '1s' },
              { label: 'Design', bg: '#ede8f8', color: '#6b5ba8', pos: { top: '14%', left: '0%' }, delay: '0.4s' },
              { label: 'Iterate', bg: '#ddeaf8', color: '#3d6fa8', pos: { bottom: '16%', right: '4%' }, delay: '2s' },
            ].map(({ label, bg, color, pos, delay }) => (
              <div
                key={label}
                style={{
                  position: 'absolute',
                  ...pos,
                  padding: '10px 18px',
                  borderRadius: '100px',
                  background: `linear-gradient(145deg, ${bg}, ${bg}cc)`,
                  boxShadow: '0 6px 16px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8)',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12px',
                  fontWeight: 700,
                  color,
                  animation: `floatB 7s ease-in-out infinite`,
                  animationDelay: delay,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Toolkit Section ────────────────────────────────────────────────────────── */

function ToolkitSection() {
  return (
    <section
      id="toolkit"
      style={{
        minHeight: '80vh',
        padding: '120px 48px',
        background: 'linear-gradient(160deg, #ede7df 0%, #e8e2d8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#5e8fc4',
            marginBottom: '20px',
          }}
        >
          ROOM 04 — THE TOOL WALL
        </div>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#1a1714',
            margin: '0 0 60px',
          }}
        >
          MY DIGITAL
          <br />
          TOOLS
        </h2>

        {/* Tool wall grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {TOOLS.map((tool, i) => (
            <ToolObject key={tool.name} tool={tool} delay={`${i * 0.06}s`} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolObject({ tool, delay }: { tool: typeof TOOLS[0]; delay: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: hov ? '18px 28px' : '14px 24px',
        borderRadius: '20px',
        background: `linear-gradient(145deg, ${tool.bg}, ${tool.bg}bb)`,
        boxShadow: hov
          ? `0 16px 40px rgba(0,0,0,0.16), 0 6px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)`
          : `0 6px 18px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.7)`,
        transform: hov ? 'translateY(-8px) scale(1.06)' : 'none',
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        animationDelay: delay,
        cursor: 'default',
      }}
    >
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '14px',
          fontWeight: 700,
          color: tool.color,
          letterSpacing: '0.02em',
        }}
      >
        {tool.name}
      </span>
    </div>
  )
}

/* ─── GitHub / Code Vault Section ────────────────────────────────────────────── */

function VaultSection() {
  return (
    <section
      id="vault"
      style={{
        minHeight: '80vh',
        padding: '120px 48px',
        background: 'linear-gradient(160deg, #1a1f2e 0%, #131825 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Ambient blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <ClayBlob
          size={360}
          color="linear-gradient(135deg, rgba(94,143,196,0.15), rgba(155,142,196,0.08))"
          style={{ position: 'absolute', top: '-80px', right: '-80px', animation: 'floatA 12s ease-in-out infinite' }}
        />
        <ClayBlob
          size={240}
          color="linear-gradient(135deg, rgba(155,142,196,0.12), rgba(94,168,152,0.07))"
          style={{ position: 'absolute', bottom: '40px', left: '-60px', animation: 'floatC 10s ease-in-out infinite' }}
        />
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', width: '100%' }}>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#4a9eff',
            marginBottom: '20px',
          }}
        >
          ROOM 05 — THE CODE VAULT
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(36px, 5vw, 60px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#f5f0eb',
                margin: '0 0 24px',
              }}
            >
              THE CODE
              <br />
              VAULT
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '16px',
                lineHeight: 1.75,
                color: 'rgba(245,240,235,0.6)',
                margin: '0 0 40px',
              }}
            >
              Every project I build is real, deployed, and open. The source code is available — inspect it, fork it, learn from it.
            </p>
            <ClayButton href="https://github.com/Landing749">
              <GithubIcon size={16} /> EXPLORE GITHUB
            </ClayButton>
          </div>

          {/* Terminal window */}
          <div
            style={{
              background: 'linear-gradient(145deg, #0d1117, #161b22)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow:
                '0 32px 80px rgba(0,0,0,0.5), 0 12px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* Title bar */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '20px' }}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
              ))}
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: 'rgba(245,240,235,0.3)',
                  marginLeft: '8px',
                }}
              >
                github.com/Landing749
              </span>
            </div>

            {/* Repo list */}
            {PROJECTS.map((p, i) => (
              <a
                key={p.id}
                href={p.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: i < PROJECTS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = '8px' }}
                onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = '0' }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    color: '#4a9eff',
                  }}
                >
                  ◇ {p.shortName}
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: 'rgba(245,240,235,0.3)',
                  }}
                >
                  {p.tech[0]}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Contact Section ────────────────────────────────────────────────────────── */

function ContactSection() {
  return (
    <section
      id="contact"
      style={{
        minHeight: '80vh',
        padding: '120px 48px',
        background: 'linear-gradient(160deg, #e8e2d8 0%, #f0ece5 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#5ea898',
            marginBottom: '20px',
          }}
        >
          ROOM 06 — THE FINAL ROOM
        </div>

        {/* Giant contact sculpture */}
        <div
          style={{
            padding: '80px 60px',
            borderRadius: '48px',
            background: 'linear-gradient(145deg, #ffffff, #ede8e0)',
            boxShadow:
              '0 60px 120px rgba(0,0,0,0.16), 0 24px 60px rgba(0,0,0,0.10), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -6px 12px rgba(0,0,0,0.04)',
            position: 'relative',
            animation: 'floatD 10s ease-in-out infinite',
          }}
        >
          {/* Decorative blobs inside */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', pointerEvents: 'none' }}>
            <ClayBlob
              size={80}
              color="linear-gradient(135deg, rgba(94,168,152,0.4), rgba(94,168,152,0.2))"
              style={{ animation: 'floatB 6s ease-in-out infinite' }}
            />
          </div>
          <div style={{ position: 'absolute', bottom: '-16px', left: '-16px', pointerEvents: 'none' }}>
            <ClayBlob
              size={60}
              color="linear-gradient(135deg, rgba(155,142,196,0.4), rgba(155,142,196,0.2))"
              style={{ animation: 'floatA 8s ease-in-out infinite' }}
            />
          </div>

          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#1a1714',
              margin: '0 0 16px',
            }}
          >
            LET&apos;S BUILD
            <br />
            SOMETHING.
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '17px',
              color: '#9b9490',
              margin: '0 0 48px',
            }}
          >
            START A CONVERSATION
          </p>

          {/* Contact links */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <ClayButton href="https://github.com/Landing749" primary>
              <GithubIcon size={16} /> GITHUB
            </ClayButton>
            <ClayButton href="https://github.com/Landing749">
              <ExternalLinkIcon size={16} /> VIEW WORK
            </ClayButton>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── App ────────────────────────────────────────────────────────────────────── */

export default function App() {
  const [activeProject, setActiveProject] = useState<typeof PROJECTS[0] | null>(null)

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [activeProject])

  return (
    <>
      <FloatingNav onNav={() => {}} />
      <HeroSection />
      <ProjectsSection onOpen={setActiveProject} />
      <AboutSection />
      <ToolkitSection />
      <VaultSection />
      <ContactSection />
      {activeProject && (
        <ProjectDetail project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </>
  )
}
