'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/layout/Header'

// Images carousel — placez vos images dans /public/commune/
const carouselImages = [
    { src: '/commune/photo1.jpeg', legende: 'Vue du lac Nokoué' },
    { src: '/commune/photo2.jpeg', legende: 'Village sur pilotis' },
    { src: '/commune/photo3.jpeg', legende: 'Marché local' },
    { src: '/commune/photo4.jpeg', legende: 'Fête culturelle' },
    { src: '/commune/photo5.jpeg', legende: 'Bord du fleuve' },
    { src: '/commune/photo6.jpeg', legende: 'École primaire' },
    { src: '/commune/photo7.jpeg', legende: 'Village sur pilotis' },
    { src: '/commune/photo8.jpeg', legende: 'Marché local' },
    { src: '/commune/photo9.jpeg', legende: 'Fête culturelle' },
    { src: '/commune/photo10.jpeg', legende: 'Bord du fleuve' },
]

// ─── Fond réseau : nœuds connectés + attraction vers curseur ─────────────────
type Node = { x: number; y: number; vx: number; vy: number; baseX: number; baseY: number }

function HeroCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouse = useRef({ x: -999, y: -999 })
    const nodes = useRef<Node[]>([])
    const raf = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const COLS = 12, ROWS = 5
        const CONNECT_DIST = 110
        const ATTRACT_RADIUS = 140
        const ATTRACT_FORCE = 0.06

        const buildGrid = () => {
            const W = canvas.offsetWidth, H = canvas.offsetHeight
            canvas.width = W; canvas.height = H
            const colStep = W / (COLS - 1)
            const rowStep = H / (ROWS - 1)
            nodes.current = []
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const bx = c * colStep + (Math.random() - 0.5) * 20
                    const by = r * rowStep + (Math.random() - 0.5) * 20
                    nodes.current.push({
                        x: bx, y: by, baseX: bx, baseY: by,
                        vx: (Math.random() - 0.5) * 0.4,
                        vy: (Math.random() - 0.5) * 0.4,
                    })
                }
            }
        }
        buildGrid()
        window.addEventListener('resize', buildGrid)

        const onMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
            } else {
                mouse.current = { x: -999, y: -999 }
            }
        }
        window.addEventListener('mousemove', onMove)

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const mx = mouse.current.x, my = mouse.current.y
            const ns = nodes.current

            // Mettre à jour les nœuds
            for (const n of ns) {
                // Attraction vers le curseur
                if (mx > 0) {
                    const dx = mx - n.x, dy = my - n.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < ATTRACT_RADIUS) {
                        const force = (1 - dist / ATTRACT_RADIUS) * ATTRACT_FORCE
                        n.vx += dx * force * 0.1
                        n.vy += dy * force * 0.1
                    }
                }
                // Retour à la position de base (ressort)
                n.vx += (n.baseX - n.x) * 0.012
                n.vy += (n.baseY - n.y) * 0.012
                // Amortissement
                n.vx *= 0.88; n.vy *= 0.88
                n.x += n.vx; n.y += n.vy
            }

            // Dessiner connexions
            for (let i = 0; i < ns.length; i++) {
                for (let j = i + 1; j < ns.length; j++) {
                    const dx = ns[i].x - ns[j].x
                    const dy = ns[i].y - ns[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < CONNECT_DIST) {
                        const opacity = (1 - dist / CONNECT_DIST) * 0.35
                        ctx.beginPath()
                        ctx.moveTo(ns[i].x, ns[i].y)
                        ctx.lineTo(ns[j].x, ns[j].y)
                        ctx.strokeStyle = `rgba(110, 231, 160, ${opacity})`
                        ctx.lineWidth = 0.8
                        ctx.stroke()
                    }
                }
            }

            // Dessiner nœuds
            for (const n of ns) {
                const dxM = mx > 0 ? mx - n.x : 9999
                const dyM = my > 0 ? my - n.y : 9999
                const distM = Math.sqrt(dxM * dxM + dyM * dyM)
                const glow = distM < ATTRACT_RADIUS ? (1 - distM / ATTRACT_RADIUS) : 0

                // Halo si proche du curseur
                if (glow > 0.1) {
                    ctx.beginPath()
                    ctx.arc(n.x, n.y, 6 + glow * 8, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(110, 231, 160, ${glow * 0.12})`
                    ctx.fill()
                }
                // Point
                ctx.beginPath()
                ctx.arc(n.x, n.y, 2 + glow * 2, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(110, 231, 160, ${0.5 + glow * 0.5})`
                ctx.fill()
            }

            raf.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(raf.current)
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('resize', buildGrid)
        }
    }, [])

    return (
        <canvas ref={canvasRef} style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 1, display: 'block',
        }} />
    )
}


// Données visuelles du carousel avec placeholders riches
const placeholderData = [
    { emoji: '🌊', title: 'Lac Nokoué', desc: 'Eaux calmes et reflets dorés', bg: 'linear-gradient(160deg,#0a3d62,#1a6b3c,#0e5640)' },
    { emoji: '🏘️', title: 'Village sur Pilotis', desc: 'Architecture lacustre unique en Afrique', bg: 'linear-gradient(160deg,#1a5c2a,#2d6a4f,#40916c)' },
    { emoji: '🛒', title: 'Marché Local', desc: 'Commerce et vie quotidienne', bg: 'linear-gradient(160deg,#7f4f24,#b5651d,#8b4513)' },
    { emoji: '🥁', title: 'Fête Culturelle', desc: 'Traditions et patrimoine vivant', bg: 'linear-gradient(160deg,#501f6c,#7b2d8b,#9b2c9b)' },
    { emoji: '🚣', title: 'Bord du Fleuve', desc: 'Pêche traditionnelle au crépuscule', bg: 'linear-gradient(160deg,#1e3a5f,#1a5c2a,#0a3d62)' },
    { emoji: '🏫', title: 'École Primaire', desc: 'Avenir et jeunesse des Aguégués', bg: 'linear-gradient(160deg,#004d40,#00695c,#00897b)' },
    { emoji: '🏘️', title: 'Village sur Pilotis', desc: 'Architecture lacustre unique en Afrique', bg: 'linear-gradient(160deg,#1a5c2a,#2d6a4f,#40916c)' },
    { emoji: '🛒', title: 'Marché Local', desc: 'Commerce et vie quotidienne', bg: 'linear-gradient(160deg,#7f4f24,#b5651d,#8b4513)' },
    { emoji: '🥁', title: 'Fête Culturelle', desc: 'Traditions et patrimoine vivant', bg: 'linear-gradient(160deg,#501f6c,#7b2d8b,#9b2c9b)' },
    { emoji: '🚣', title: 'Bord du Fleuve', desc: 'Pêche traditionnelle au crépuscule', bg: 'linear-gradient(160deg,#1e3a5f,#1a5c2a,#0a3d62)' },
    { emoji: '🏫', title: 'École Primaire', desc: 'Avenir et jeunesse des Aguégués', bg: 'linear-gradient(160deg,#004d40,#00695c,#00897b)' },
]

function Carousel2() {
    const [images, setImages] = useState(carouselImages)
    const total = images.length
    const [index, setIndex] = useState(0)
    const [imgOk, setImgOk] = useState<Record<number, boolean>>({})
    const timer = useRef<ReturnType<typeof setInterval> | null>(null)
    const maxIndex = Math.ceil(total / 2) - 1

    useEffect(() => {
        fetch('http://localhost:8000/api/carousel')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setImages(data)
                }
            })
            .catch(err => console.error("Erreur chargement carousel", err))
    }, [])

    const next = () => setIndex(i => (i >= maxIndex ? 0 : i + 1))
    const prev = () => setIndex(i => (i <= 0 ? maxIndex : i - 1))

    const reset = () => {
        if (timer.current) clearInterval(timer.current)
        timer.current = setInterval(next, 4000)
    }

    useEffect(() => {
        timer.current = setInterval(next, 4000)
        return () => { if (timer.current) clearInterval(timer.current) }
    }, [])

    const handlePrev = () => { prev(); reset() }
    const handleNext = () => { next(); reset() }

    return (
        <div style={{ position: 'relative', overflow: 'hidden', background: '#0a1a0f', height: '100%' }}>
            {/* Slides */}
            <div style={{
                display: 'flex',
                transform: `translateX(-${index * 100}%)`,
                transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
                height: '100%',
            }}>
                {Array.from({ length: Math.ceil(total / 2) }, (_, gi) => (
                    <div key={gi} style={{ display: 'flex', minWidth: '100%', height: '100%', gap: '2px' }}>
                        {[0, 1].map(offset => {
                            const imgIdx = gi * 2 + offset
                            const img = images[imgIdx]
                            const ph = placeholderData[imgIdx] || placeholderData[0]
                            const hasRealImg = imgOk[imgIdx]

                            if (!img) return (
                                <div key={offset} style={{ flex: 1, background: '#111' }} />
                            )
                            return (
                                <div key={offset} style={{
                                    flex: 1, position: 'relative', overflow: 'hidden',
                                    background: ph.bg,
                                }}>
                                    {/* Image réelle (si fournie) */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={img.src} alt={img.legende}
                                        onLoad={() => setImgOk(s => ({ ...s, [imgIdx]: true }))}
                                        onError={e => { e.currentTarget.style.display = 'none' }}
                                        style={{
                                            position: 'absolute', inset: 0,
                                            width: '100%', height: '100%', objectFit: 'cover',
                                            display: 'block', transition: 'opacity 0.5s',
                                            opacity: hasRealImg ? 1 : 0,
                                            zIndex: hasRealImg ? 2 : 0,
                                        }}
                                    />

                                    {/* Placeholder visuel riche (toujours affiché dessous) */}
                                    <div style={{
                                        position: 'absolute', inset: 0, zIndex: 1,
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center',
                                        opacity: hasRealImg ? 0 : 1, transition: 'opacity 0.5s',
                                        padding: '1.5rem',
                                    }}>
                                        {/* Motif points décoratifs */}
                                        <div style={{
                                            position: 'absolute', inset: 0, opacity: 0.08,
                                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                            backgroundSize: '24px 24px',
                                        }} />
                                        {/* Cercle icône */}
                                        <div style={{
                                            width: '72px', height: '72px', borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.15)',
                                            backdropFilter: 'blur(4px)',
                                            border: '2px solid rgba(255,255,255,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '2rem', marginBottom: '1rem',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                        }}>
                                            {ph.emoji}
                                        </div>
                                        <div style={{
                                            fontSize: '1rem', fontWeight: 700, color: 'white',
                                            textAlign: 'center', marginBottom: '0.375rem',
                                            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                        }}>{ph.title}</div>
                                        <div style={{
                                            fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)',
                                            textAlign: 'center', lineHeight: 1.4,
                                            maxWidth: '160px',
                                        }}>{ph.desc}</div>
                                        <div style={{
                                            marginTop: '1rem', padding: '0.3rem 0.75rem',
                                            background: 'rgba(255,255,255,0.12)',
                                            borderRadius: '999px',
                                            fontSize: '0.6875rem', color: 'rgba(255,255,255,0.7)',
                                            fontWeight: 500,
                                            border: '1px solid rgba(255,255,255,0.15)',
                                        }}>📸 Image à venir</div>
                                    </div>

                                    {/* Overlay + légende bas (sur vraie image) */}
                                    {hasRealImg && (
                                        <>
                                            <div style={{
                                                position: 'absolute', inset: 0, zIndex: 3,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                                            }} />
                                            <span style={{
                                                position: 'absolute', bottom: '0.875rem', left: '0.875rem',
                                                zIndex: 4, display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                                                padding: '0.3rem 0.75rem',
                                                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)',
                                                fontWeight: 500, border: '1px solid rgba(255,255,255,0.15)',
                                            }}>📍 {img.legende}</span>
                                        </>
                                    )}

                                    {/* Numéro */}
                                    <span style={{
                                        position: 'absolute', top: '0.625rem', right: '0.75rem',
                                        zIndex: 5, fontSize: '0.6875rem',
                                        color: 'rgba(255,255,255,0.45)', fontWeight: 600,
                                    }}>{imgIdx + 1}/{total}</span>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>

            {/* Bouton Précédent */}
            <button onClick={handlePrev} style={{
                position: 'absolute', top: '50%', left: '0.875rem',
                transform: 'translateY(-50%)',
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', fontSize: '1.25rem', fontWeight: 300,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 5, transition: 'all 0.2s', lineHeight: 1,
            }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,92,42,0.7)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
            >‹</button>

            {/* Bouton Suivant */}
            <button onClick={handleNext} style={{
                position: 'absolute', top: '50%', right: '0.875rem',
                transform: 'translateY(-50%)',
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', fontSize: '1.25rem', fontWeight: 300,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 5, transition: 'all 0.2s', lineHeight: 1,
            }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,92,42,0.7)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
            >›</button>

            {/* Points */}
            <div style={{
                position: 'absolute', bottom: '0.75rem', left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', gap: '6px', zIndex: 5,
            }}>
                {Array.from({ length: maxIndex + 1 }, (_, i) => (
                    <button key={i} onClick={() => { setIndex(i); reset() }} style={{
                        width: i === index ? '22px' : '7px',
                        height: '7px', borderRadius: '3.5px',
                        background: i === index ? '#6ee7a0' : 'rgba(255,255,255,0.4)',
                        border: 'none', cursor: 'pointer', padding: 0,
                        transition: 'all 0.35s ease',
                    }} />
                ))}
            </div>
        </div>
    )
}

export default function HomePage() {
    return (
        <>
            <Header />
            <main style={{
                height: '100dvh',
                display: 'grid',
                gridTemplateRows: 'auto 1fr',
                overflow: 'hidden',
            }}>

                {/* ── HERO avec fond image ─────────────────── */}
                <section style={{
                    position: 'relative', overflow: 'hidden',
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    padding: 'clamp(1rem, 2.5vw, 1.75rem) clamp(1.5rem, 4vw, 3rem)',
                    minHeight: '0',
                }}>
                    {/* Overlay sombre */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,25,15,0.88) 0%, rgba(15,45,74,0.80) 45%, rgba(10,35,18,0.75) 100%)', pointerEvents: 'none' }} />
                    {/* Canvas particules par-dessus l'overlay */}
                    <HeroCanvas />

                    {/* Contenu par-dessus le canvas */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        {/* Badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                            padding: '0.25rem 0.75rem',
                            background: 'rgba(110,231,160,0.1)',
                            border: '1px solid rgba(110,231,160,0.2)',
                            borderRadius: '999px',
                            fontSize: '0.7rem', fontWeight: 600,
                            color: '#6ee7a0', marginBottom: '0.75rem',
                        }}>
                            🇧🇯 Portail officiel · Commune des Aguégués
                        </div>

                        {/* Titre — max 2 lignes */}
                        <h1 style={{
                            fontSize: 'clamp(1.25rem, 2.8vw, 1.875rem)',
                            fontWeight: 800, color: 'white',
                            lineHeight: 1.25, margin: '0 0 0.625rem',
                            letterSpacing: '-0.015em',
                            maxWidth: '680px',
                        }}>
                            Unir les Compétences, Écouter les Citoyens,{' '}
                            <span style={{
                                background: 'linear-gradient(90deg, #6ee7a0, #34d399)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>Construire Ensemble</span>
                        </h1>

                    </div>
                </section>


                {/* ── CAROUSEL ──────────────────────────────── */}
                <section style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a1a0f' }}>
                    {/* En-tête carousel */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.5rem 1.25rem 0.5rem',
                        background: 'rgba(255,255,255,0.04)',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        flexShrink: 0,
                    }}>
                        <span style={{
                            fontSize: '0.8125rem', fontWeight: 700,
                            color: '#6ee7a0', display: 'flex', alignItems: 'center', gap: '0.375rem',
                        }}>
                            📸 La Commune en Images
                        </span>
                    </div>
                    {/* Carousel */}
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <Carousel2 />
                    </div>
                </section>

            </main>

            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
        </>
    )
}
