'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Quote, ChevronRight } from 'lucide-react'

const paragraphes = [
    "Notre commune, riche de ses valeurs, de ses talents et de son potentiel, entre aujourd'hui dans une nouvelle dynamique : celle de l'écoute, de l'organisation et de l'action collective.",
    "Avec la mise en place de cette plateforme, nous faisons le choix d'un outil moderne au service du développement de notre territoire. Elle vise à identifier, rassembler et valoriser l'ensemble des compétences issues des Aguégués, où qu'elles se trouvent, afin de bâtir ensemble une commune plus forte, plus solidaire et résolument tournée vers l'avenir.",
    "Cette plateforme est également un espace d'expression citoyenne. Chaque habitant peut y faire entendre sa voix, signaler les difficultés de son milieu et proposer des solutions concrètes. Car le développement de notre commune ne peut se faire sans l'implication active de tous.",
    "En tant que Maire, je prends l'engagement de faire de cet outil un véritable levier de gouvernance participative, fondée sur la transparence, la responsabilité et l'efficacité.",
    "J'invite donc chaque cadre à s'y inscrire, chaque citoyen à s'exprimer et chaque acteur à contribuer, selon ses moyens, à la transformation positive de notre commune.",
    "Ensemble, faisons des Aguégués un modèle de développement local, basé sur l'unité, la compétence et l'engagement citoyen.",
]

const valeurs = [
    { icon: '🤝', label: 'Unité' },
    { icon: '🎓', label: 'Compétence' },
    { icon: '🗳️', label: 'Engagement citoyen' },
    { icon: '🔍', label: 'Transparence' },
]

export default function MotDuMairePage() {
    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: '#f9fafb' }}>

                {/* ── HERO ─────────────────────────────────── */}
                <div style={{
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Overlay sombre */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(160deg, rgba(10,25,15,0.88) 0%, rgba(15,45,74,0.80) 50%, rgba(10,35,18,0.75) 100%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Fil d'Ariane */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8125rem' }}>Accueil</Link>
                        <ChevronRight size={13} color="rgba(255,255,255,0.4)" />
                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8125rem', fontWeight: 600 }}>Mot du Maire</span>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.3rem 0.875rem',
                            background: 'rgba(110,231,160,0.12)',
                            border: '1px solid rgba(110,231,160,0.25)',
                            borderRadius: '999px',
                            fontSize: '0.75rem', fontWeight: 600,
                            color: '#6ee7a0', marginBottom: '1rem',
                        }}>
                            🏛️ Message officiel
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                            fontWeight: 900, color: 'white',
                            lineHeight: 1.2, margin: '0 0 0.75rem',
                            maxWidth: '700px',
                        }}>
                            Mot du Maire
                        </h1>
                        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                            Ernest A. AGBOKOUMISSI — Maire de la Commune des Aguégués
                        </p>
                    </div>
                </div>

                {/* ── CONTENU ──────────────────────────────── */}
                <div style={{
                    maxWidth: '860px',
                    margin: '0 auto',
                    padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.5rem)',
                }}>

                    {/* Citation d'ouverture */}
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                        marginBottom: '2rem',
                        position: 'relative',
                        borderLeft: '5px solid #1a5c2a',
                    }}>
                        <Quote size={36} color="#1a5c2a" style={{ opacity: 0.15, position: 'absolute', top: '1.5rem', right: '1.5rem' }} />

                        {/* Salutations */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <p style={{
                                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                                fontWeight: 700, color: '#1a5c2a',
                                margin: '0 0 0.375rem',
                                fontStyle: 'italic',
                            }}>
                                Chères filles et chers fils des Aguégués,
                            </p>
                            <p style={{
                                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                                fontWeight: 700, color: '#1a5c2a',
                                margin: 0, fontStyle: 'italic',
                            }}>
                                Chers cadres, chers partenaires, chers concitoyens,
                            </p>
                        </div>

                        {/* Corps du message */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {paragraphes.map((para, i) => (
                                <p key={i} style={{
                                    fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                                    color: '#374151',
                                    lineHeight: 1.85,
                                    margin: 0,
                                    textAlign: 'justify',
                                }}>
                                    {para}
                                </p>
                            ))}
                        </div>

                        {/* Conclusion + Signature fusionnées */}
                        <div style={{
                            display: 'flex', alignItems: 'flex-end',
                            justifyContent: 'space-between', gap: '1.5rem',
                            marginTop: '2rem', flexWrap: 'wrap',
                        }}>
                            {/* Texte à gauche */}
                            <div>
                                <p style={{
                                    fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                                    fontWeight: 700, color: '#111827',
                                    margin: '0 0 1rem', fontStyle: 'italic',
                                }}>
                                    Je vous remercie.
                                </p>
                                <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: '#111827', marginBottom: '0.2rem' }}>
                                    Ernest A. AGBOKOUMISSI
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
                                    Maire de la Commune des Aguégués
                                </div>
                            </div>

                            {/* Photo du maire à droite */}
                            <div style={{ flexShrink: 0, position: 'relative' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/commune/maire.jpg"
                                    alt="Ernest A. AGBOKOUMISSI"
                                    style={{
                                        width: '96px', height: '96px',
                                        borderRadius: '50%',
                                        objectFit: 'fill', objectPosition: 'top',
                                        border: '3px solid #1a5c2a',
                                        boxShadow: '0 4px 16px rgba(26,92,42,0.25)',
                                        display: 'block',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Valeurs clés */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{
                            fontSize: '0.8125rem', fontWeight: 700, color: '#374151',
                            marginBottom: '1rem', textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                        }}>
                            Les piliers de notre engagement
                        </h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {valeurs.map(({ icon, label }) => (
                                <div key={label} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.625rem 1.125rem',
                                    background: 'white',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb',
                                    fontSize: '0.9rem', fontWeight: 600, color: '#1a5c2a',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                }}>
                                    <span style={{ fontSize: '1.2rem' }}>{icon}</span> {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0f2d4a, #1a5c2a)',
                        borderRadius: '20px', padding: '2rem 2.5rem',
                        display: 'flex', flexWrap: 'wrap', gap: '1.25rem',
                        alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
                                Répondez à l&apos;appel du Maire
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' }}>
                                Inscrivez-vous ou déposez une doléance dès aujourd&apos;hui.
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <Link href="/inscription" style={{
                                padding: '0.7rem 1.5rem', background: 'white', color: '#1a5c2a',
                                borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem',
                                textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            }}>
                                S&apos;inscrire →
                            </Link>
                            <Link href="/doleances" style={{
                                padding: '0.7rem 1.375rem',
                                background: 'rgba(255,255,255,0.12)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                color: 'white', borderRadius: '10px',
                                fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
                            }}>
                                📝 Doléances
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
