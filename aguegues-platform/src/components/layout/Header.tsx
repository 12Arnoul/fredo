'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogIn, UserPlus, ChevronRight } from 'lucide-react'

const navLinks = [
    { label: 'Mot du Maire', href: '/mot-du-maire', emoji: '🏛️' },
    { label: 'Présentation', href: '/a-propos', emoji: '📖' },
    { label: 'Doléances', href: '/doleances', emoji: '📝' },
    { label: 'Actualités', href: '/actualites', emoji: '📰' },
    { label: 'Espace Cadres', href: '/espace-cadres', emoji: '🎓' },
    { label: 'Projets à Soutenir', href: '/projets', emoji: '💡' },
    { label: 'Contact', href: '/contact', emoji: '✉️' },
]

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            {/* ═══════════════════════════════════════
                SIDEBAR DESKTOP (fixée à gauche)
            ═══════════════════════════════════════ */}
            <aside className="sidebar-desktop" style={{
                position: 'fixed',
                top: 0, left: 0, bottom: 0,
                width: '240px',
                background: 'white',
                borderRight: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 50,
                boxShadow: '2px 0 12px rgba(0,0,0,0.06)',
                overflowY: 'auto',
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1.25rem 1rem 1rem',
                    borderBottom: '1px solid #f3f4f6',
                    textDecoration: 'none',
                    flexShrink: 0,
                }}>
                    <img
                        src="/logo.png"
                        alt="Portail officiel des Aguégués"
                        style={{ width: '120px', height: 'auto', objectFit: 'contain', display: 'block' }}
                    />
                </Link>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.7rem 0.875rem',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    marginBottom: '2px',
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: '0.9rem',
                                    color: isActive ? '#1a5c2a' : '#374151',
                                    background: isActive ? '#dcf0e4' : 'transparent',
                                    borderLeft: isActive ? '3px solid #1a5c2a' : '3px solid transparent',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = '#f9fafb'
                                        e.currentTarget.style.color = '#1a5c2a'
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent'
                                        e.currentTarget.style.color = '#374151'
                                    }
                                }}
                            >
                                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{link.emoji}</span>
                                <span style={{ flex: 1 }}>{link.label}</span>
                                {isActive && <ChevronRight size={14} style={{ flexShrink: 0, color: '#1a5c2a' }} />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Boutons connexion en bas */}
                <div style={{
                    padding: '1rem 0.875rem 1.25rem',
                    borderTop: '1px solid #f3f4f6',
                    display: 'flex', flexDirection: 'column', gap: '0.625rem',
                    flexShrink: 0,
                }}>
                    <Link href="/connexion" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        padding: '0.625rem 1rem', borderRadius: '10px',
                        border: '1.5px solid #1a5c2a', color: '#1a5c2a',
                        fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
                        transition: 'all 0.15s',
                    }}>
                        <LogIn size={16} /> Connexion
                    </Link>
                    <Link href="/inscription" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        padding: '0.625rem 1rem', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #1a5c2a, #22c55e)',
                        color: 'white', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
                    }}>
                        <UserPlus size={16} /> S&apos;inscrire
                    </Link>
                </div>
            </aside>

            {/* ═══════════════════════════════════════
                TOPBAR MOBILE (visible uniquement mobile)
            ═══════════════════════════════════════ */}
            <div className="topbar-mobile" style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: 'white',
                borderBottom: '1px solid #e5e7eb',
                padding: '0.75rem 1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <img src="/logo.png" alt="Portail officiel des Aguégués" style={{ height: '52px', width: 'auto' }} />
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{
                        width: '42px', height: '42px', borderRadius: '10px',
                        border: '1.5px solid #e5e7eb', background: 'white',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#374151',
                    }}
                    aria-label="Menu"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Drawer mobile */}
            {mobileOpen && (
                <div className="topbar-mobile" style={{
                    position: 'fixed', inset: 0, zIndex: 60,
                    display: 'flex',
                }}>
                    {/* Overlay */}
                    <div onClick={() => setMobileOpen(false)} style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                    }} />
                    {/* Panneau */}
                    <div style={{
                        position: 'relative', width: '260px', background: 'white',
                        height: '100%', overflowY: 'auto', zIndex: 1,
                        display: 'flex', flexDirection: 'column',
                        animation: 'slideInLeft 0.22s ease',
                    }}>
                        {/* Logo */}
                        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <img src="/logo.png" alt="Logo" style={{ width: '170px', height: 'auto' }} />
                        </div>
                        {/* Links */}
                        <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.75rem 0.875rem', borderRadius: '10px',
                                        textDecoration: 'none', fontWeight: 600,
                                        fontSize: '0.9375rem', color: '#1a5c2a',
                                        marginBottom: '4px',
                                    }}>
                                    <span>{link.emoji}</span> {link.label}
                                </Link>
                            ))}
                        </nav>
                        {/* Boutons */}
                        <div style={{ padding: '1rem', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link href="/connexion" onClick={() => setMobileOpen(false)} style={{ display: 'block', textAlign: 'center', padding: '0.75rem', borderRadius: '10px', border: '1.5px solid #1a5c2a', color: '#1a5c2a', fontWeight: 600, textDecoration: 'none' }}>Connexion</Link>
                            <Link href="/inscription" onClick={() => setMobileOpen(false)} style={{ display: 'block', textAlign: 'center', padding: '0.75rem', borderRadius: '10px', background: 'linear-gradient(135deg,#1a5c2a,#22c55e)', color: 'white', fontWeight: 700, textDecoration: 'none' }}>S&apos;inscrire</Link>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @media (min-width: 768px) {
          .sidebar-desktop { display: flex !important; }
          .topbar-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .sidebar-desktop { display: none !important; }
          .topbar-mobile { display: flex !important; }
        }
      `}</style>
        </>
    )
}
