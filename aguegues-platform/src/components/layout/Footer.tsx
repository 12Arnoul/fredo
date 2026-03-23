'use client'

import Link from 'next/link'
import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react'

const liens = {
    navigation: [
        { label: '🏛️ Mot du Maire', href: '/mot-du-maire' },
        { label: '📖 Présentation', href: '/a-propos' },
        { label: '📢 Doléances citoyennes', href: '/doleances' },
        { label: '📰 Actualités', href: '/actualites' },
        { label: '🎓 Espace Cadres', href: '/espace-cadres' },
        { label: '✉️ Contact', href: '/contact' },
    ],
    plateforme: [
        { label: 'S\'inscrire', href: '/inscription' },
        { label: 'Se connecter', href: '/connexion' },
        { label: 'Mon tableau de bord', href: '/dashboard' },
    ],
}

const socials = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer style={{
            background: 'linear-gradient(180deg, #0d1f12 0%, #090f0b 100%)',
            color: '#9ca3af',
            paddingTop: '3rem',
            paddingBottom: '1.25rem',
            marginTop: 'auto',
        }}>
            <div style={{
                maxWidth: '1100px', margin: '0 auto',
                padding: '0 clamp(1rem, 4vw, 2.5rem)',
            }}>
                {/* Grille principale */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2.5rem',
                    marginBottom: '2.5rem',
                }}>

                    {/* Colonne 1 — Identité */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '42px', height: '42px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #1a5c2a, #1e3a5f)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(26,92,42,0.35)',
                            }}>
                                <Globe size={20} color="white" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white', lineHeight: 1 }}>
                                    Portail des Aguégués
                                </div>
                                <div style={{ fontSize: '0.6875rem', color: '#6b7280', marginTop: '2px' }}>
                                    Portail numérique officiel · Bénin
                                </div>
                            </div>
                        </div>

                        <p style={{ fontSize: '0.8125rem', lineHeight: 1.7, color: '#6b7280', marginBottom: '1.25rem' }}>
                            Plateforme officielle de recensement des compétences,
                            d&apos;écoute citoyenne et de développement de la commune des Aguégués.
                        </p>

                        {/* Slogan */}
                        <p style={{
                            fontSize: '0.8125rem', color: '#6ee7a0',
                            fontStyle: 'italic', marginBottom: '1.25rem',
                            borderLeft: '2px solid rgba(110,231,160,0.35)',
                            paddingLeft: '0.625rem',
                        }}>
                            &ldquo;Unir les compétences, écouter les citoyens,<br />construire ensemble.&rdquo;
                        </p>

                        {/* Réseaux sociaux */}
                        <div style={{ display: 'flex', gap: '0.625rem' }}>
                            {socials.map(({ icon: Icon, href, label }) => (
                                <a key={label} href={href} aria-label={label} style={{
                                    width: '34px', height: '34px', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#6b7280', textDecoration: 'none',
                                    transition: 'all 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#1a5c2a'; e.currentTarget.style.color = 'white' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#6b7280' }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Colonne 2 — Navigation */}
                    <div>
                        <h3 style={{
                            color: 'white', fontWeight: 700, fontSize: '0.875rem',
                            marginBottom: '1rem', textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                        }}>Navigation</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {liens.navigation.map(({ label, href }) => (
                                <li key={href}>
                                    <Link href={href} style={{
                                        color: '#6b7280', textDecoration: 'none',
                                        fontSize: '0.875rem', transition: 'color 0.15s',
                                        display: 'block', lineHeight: 1.5,
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#6ee7a0'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 3 — Espace citoyen */}
                    <div>
                        <h3 style={{
                            color: 'white', fontWeight: 700, fontSize: '0.875rem',
                            marginBottom: '1rem', textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                        }}>Espace citoyen</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {liens.plateforme.map(({ label, href }) => (
                                <li key={href}>
                                    <Link href={href} style={{
                                        color: '#6b7280', textDecoration: 'none',
                                        fontSize: '0.875rem', transition: 'color 0.15s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#6ee7a0'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* CTA Doléance */}
                        <div style={{
                            marginTop: '1.5rem', padding: '1rem',
                            background: 'rgba(110,231,160,0.06)',
                            border: '1px solid rgba(110,231,160,0.15)',
                            borderRadius: '12px',
                        }}>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'white', marginBottom: '0.375rem' }}>
                                📢 Vous avez une doléance ?
                            </div>
                            <Link href="/doleances" style={{
                                fontSize: '0.8125rem', color: '#6ee7a0', textDecoration: 'none',
                                fontWeight: 600,
                            }}>
                                Déposez-la ici →
                            </Link>
                        </div>
                    </div>

                    {/* Colonne 4 — Contact */}
                    <div>
                        <h3 style={{
                            color: 'white', fontWeight: 700, fontSize: '0.875rem',
                            marginBottom: '1rem', textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                        }}>Contact</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            <li style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                                <MapPin size={15} color="#6ee7a0" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>
                                    Mairie des Aguégués,<br />Commune des Aguégués, Bénin
                                </span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                                <Mail size={15} color="#6ee7a0" style={{ flexShrink: 0 }} />
                                <a href="mailto:contact@aguegues.bj" style={{ fontSize: '0.8125rem', color: '#6b7280', textDecoration: 'none', transition: 'color 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#6ee7a0'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                                    contact@aguegues.bj
                                </a>
                            </li>
                            <li style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                                <Phone size={15} color="#6ee7a0" style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>+229 XX XX XX XX</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Barre de bas */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    paddingTop: '1.25rem',
                    display: 'flex', flexWrap: 'wrap',
                    justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem',
                }}>
                    <p style={{ fontSize: '0.8rem', color: '#4b5563', margin: 0 }}>
                        © {year} Portail officiel des Aguégués — Mairie × ONG AGANER. Tous droits réservés.
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#374151', margin: 0 }}>
                        🇧🇯 Bénin · Conforme APDP · Loi n°2009-09
                    </p>
                </div>
            </div>
        </footer>
    )
}
