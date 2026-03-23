'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    Newspaper, ChevronRight, Calendar, Tag,
    ArrowRight, Search, BookOpen, Briefcase, Star, Bell
} from 'lucide-react'

// ========================
// DONNÉES DE DÉMONSTRATION
// ========================
type Categorie = 'actualite' | 'opportunite' | 'nomination' | 'evenement'

const articles = [
    {
        slug: 'lancement-plateforme-aganer-2025',
        titre: 'Lancement officiel de la plateforme AGANER',
        extrait: 'L\'ONG AGANER et la Mairie des Aguégués lancent officiellement la plateforme numérique de recensement des cadres et jeunes talents de la commune.',
        contenu: '',
        categorie: 'actualite' as Categorie,
        date: '2025-03-01',
        image_couleur: '#1a6b3c',
        emoji: '🚀',
        temps_lecture: '3 min',
    },
    {
        slug: 'programme-emploi-jeunes-2025',
        titre: 'Programme Emploi Jeunes — Appel à candidatures',
        extrait: 'La Mairie des Aguégués lance un programme de soutien à l\'emploi des jeunes. 50 jeunes seront accompagnés et subventionnés pour créer leur activité.',
        contenu: '',
        categorie: 'opportunite' as Categorie,
        date: '2025-02-20',
        image_couleur: '#c4940a',
        emoji: '💼',
        temps_lecture: '4 min',
    },
    {
        slug: 'nomination-chef-service-education',
        titre: 'Nomination au poste de Chef du Service Éducation',
        extrait: 'La Mairie des Aguégués annonce la nomination de M. Clément Kpossou à la tête du service éducation de la commune, fort de 12 ans d\'expérience.',
        contenu: '',
        categorie: 'nomination' as Categorie,
        date: '2025-02-14',
        image_couleur: '#7c3aed',
        emoji: '🏆',
        temps_lecture: '2 min',
    },
    {
        slug: 'journee-recensement-mars-2025',
        titre: 'Grande journée de recensement numérique — 15 mars',
        extrait: 'Une journée spéciale d\'inscription sur la plateforme AGANER est organisée dans les quartiers de la commune le 15 mars 2025. Des agents seront sur place.',
        contenu: '',
        categorie: 'evenement' as Categorie,
        date: '2025-02-10',
        image_couleur: '#0d9488',
        emoji: '📋',
        temps_lecture: '3 min',
    },
    {
        slug: 'bourse-etude-france-2025',
        titre: 'Bourses d\'études en France — Campus France Bénin',
        extrait: 'Campus France Bénin ouvre les candidatures pour les bourses d\'excellence 2025. Les jeunes des Aguégués sont fortement encouragés à postuler.',
        contenu: '',
        categorie: 'opportunite' as Categorie,
        date: '2025-01-28',
        image_couleur: '#2563eb',
        emoji: '🎓',
        temps_lecture: '5 min',
    },
    {
        slug: 'inauguration-mairie-renovee',
        titre: 'Inauguration de la Mairie rénovée des Aguégués',
        extrait: 'Le Maire des Aguégués inaugurera les nouveaux locaux rénovés de la Mairie le 5 avril 2025. Une cérémonie officielle est prévue avec les autorités départementales.',
        contenu: '',
        categorie: 'evenement' as Categorie,
        date: '2025-01-15',
        image_couleur: '#c4940a',
        emoji: '🏛️',
        temps_lecture: '2 min',
    },
]

const categorieConfig: Record<Categorie | 'tous', { label: string; icon: React.ReactNode; couleur: string; bg: string }> = {
    tous: { label: 'Toutes', icon: <Newspaper size={15} />, couleur: 'var(--color-gray-600)', bg: 'var(--color-gray-100)' },
    actualite: { label: 'Actualités', icon: <Bell size={15} />, couleur: '#1a6b3c', bg: '#dcf0e4' },
    opportunite: { label: 'Opportunités', icon: <Briefcase size={15} />, couleur: '#92400e', bg: '#fef3c7' },
    nomination: { label: 'Nominations', icon: <Star size={15} />, couleur: '#4c1d95', bg: '#ede9fe' },
    evenement: { label: 'Événements', icon: <Bell size={15} />, couleur: '#0d7f78', bg: '#ccfbf1' },
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ActualitesPage() {
    const [filtre, setFiltre] = useState<Categorie | 'tous'>('tous')
    const [recherche, setRecherche] = useState('')

    const resultats = articles.filter((a) => {
        const matchCat = filtre === 'tous' || a.categorie === filtre
        const matchSearch = recherche === '' ||
            a.titre.toLowerCase().includes(recherche.toLowerCase()) ||
            a.extrait.toLowerCase().includes(recherche.toLowerCase())
        return matchCat && matchSearch
    })

    const vedette = articles[0]

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>

                {/* ---- EN-TÊTE ---- */}
                <div style={{
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    padding: '3rem 0 2rem',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,25,15,0.88) 0%, rgba(15,45,74,0.80) 100%)', pointerEvents: 'none' }} />
                    <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem' }}>Accueil</Link>
                            <ChevronRight size={14} color="rgba(255,255,255,0.5)" />
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }}>Actualités</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Newspaper size={28} color="white" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: 'white', margin: 0 }}>
                                    Actualités & Annonces
                                </h1>
                                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', margin: '0.25rem 0 0' }}>
                                    Toutes les nouvelles de la commune des Aguégués
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-main" style={{ padding: '2rem 1rem 4rem' }}>

                    {/* ---- ARTICLE À LA UNE ---- */}
                    <Link href={`/actualites/${vedette.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>
                        <div style={{
                            background: `linear-gradient(135deg, ${vedette.image_couleur}ee 0%, ${vedette.image_couleur}cc 100%)`,
                            borderRadius: '20px', padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden', cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.2)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                        >
                            {/* Décor */}
                            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', bottom: '-30px', right: '60px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

                            <div style={{ position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '2rem' }}>{vedette.emoji}</span>
                                    <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', borderRadius: '999px', padding: '0.25rem 0.75rem', fontSize: '0.8125rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.3)' }}>
                                        À la une
                                    </span>
                                </div>
                                <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: 'white', margin: '0 0 0.75rem', maxWidth: '600px', lineHeight: 1.3 }}>
                                    {vedette.titre}
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.9375rem', lineHeight: 1.7, margin: '0 0 1.25rem', maxWidth: '580px' }}>
                                    {vedette.extrait}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                        <Calendar size={14} /> {formatDate(vedette.date)}
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                        <BookOpen size={14} /> {vedette.temps_lecture} de lecture
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '0.875rem' }}>
                                        Lire l&apos;article <ArrowRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* ---- RECHERCHE ---- */}
                    <div style={{ background: 'white', borderRadius: '14px', boxShadow: 'var(--shadow-card)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ flex: '1 1 220px', position: 'relative' }}>
                                <Search size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un article…"
                                    value={recherche}
                                    onChange={e => setRecherche(e.target.value)}
                                    className="form-input"
                                    style={{ paddingLeft: '2.75rem' }}
                                />
                            </div>

                            {/* Filtres par catégorie */}
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {(Object.keys(categorieConfig) as Array<Categorie | 'tous'>).map((cat) => {
                                    const { label, couleur, bg } = categorieConfig[cat]
                                    const actif = filtre === cat
                                    return (
                                        <button key={cat} onClick={() => setFiltre(cat)} style={{
                                            padding: '0.4rem 0.875rem', borderRadius: '999px', cursor: 'pointer',
                                            fontWeight: 600, fontSize: '0.8125rem', fontFamily: 'inherit',
                                            background: actif ? couleur : bg,
                                            color: actif ? 'white' : couleur,
                                            border: `2px solid ${actif ? couleur : 'transparent'}`,
                                            transition: 'all 0.2s', minHeight: '36px',
                                        }}>
                                            {label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ---- LISTE DES ARTICLES ---- */}
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9375rem' }}>
                            <strong style={{ color: 'var(--color-gray-800)' }}>{resultats.length}</strong> article{resultats.length > 1 ? 's' : ''}
                        </p>
                    </div>

                    {resultats.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', background: 'white', borderRadius: '16px' }}>
                            <Newspaper size={48} color="var(--color-gray-300)" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--color-gray-500)', fontWeight: 500 }}>Aucun article trouvé.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                            {resultats.slice(1).map((article) => {
                                const cat = categorieConfig[article.categorie]
                                return (
                                    <Link key={article.slug} href={`/actualites/${article.slug}`} style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                                            {/* Miniature colorée */}
                                            <div style={{
                                                height: '130px',
                                                background: `linear-gradient(135deg, ${article.image_couleur}ee 0%, ${article.image_couleur}99 100%)`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <span style={{ fontSize: '3.5rem' }}>{article.emoji}</span>
                                            </div>

                                            <div style={{ padding: '1.25rem' }}>
                                                {/* Badge catégorie */}
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                                    padding: '0.25rem 0.625rem', borderRadius: '999px',
                                                    background: cat.bg, color: cat.couleur,
                                                    fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem',
                                                }}>
                                                    {cat.label}
                                                </span>

                                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-900)', margin: '0 0 0.5rem', lineHeight: 1.35 }}>
                                                    {article.titre}
                                                </h3>
                                                <p style={{
                                                    fontSize: '0.875rem', color: 'var(--color-gray-500)', lineHeight: 1.6, margin: '0 0 1rem',
                                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                }}>
                                                    {article.extrait}
                                                </p>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                        <Calendar size={13} /> {formatDate(article.date)}
                                                    </span>
                                                    <span style={{ fontSize: '0.8125rem', color: article.image_couleur, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        Lire <ArrowRight size={14} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
