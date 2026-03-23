'use client'

import { use } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    Calendar, Clock, ArrowLeft, ChevronRight,
    Share2, Bookmark, Tag
} from 'lucide-react'

type Categorie = 'actualite' | 'opportunite' | 'nomination' | 'evenement'

const articles: Record<string, {
    slug: string; titre: string; contenu: string; categorie: Categorie;
    date: string; emoji: string; image_couleur: string; temps_lecture: string; auteur: string;
}> = {
    'lancement-plateforme-aganer-2025': {
        slug: 'lancement-plateforme-aganer-2025',
        titre: 'Lancement officiel de la plateforme AGANER',
        categorie: 'actualite',
        date: '2025-03-01',
        emoji: '🚀',
        image_couleur: '#1a6b3c',
        temps_lecture: '3 min',
        auteur: 'Rédaction AGANER',
        contenu: `L'ONG AGANER et la Mairie des Aguégués ont le plaisir d'annoncer le lancement officiel de la **plateforme numérique de recensement** des cadres et jeunes talents de la commune.

Cette initiative historique vise à créer un annuaire numérique exhaustif de toutes les compétences présentes dans notre commune, qu'elles soient sur le territoire national ou dans la diaspora.

## Pourquoi cette plateforme ?

Les Aguégués regorgent de talents remarquables trop souvent méconnus. Cette plateforme permettra de :
- Recenser tous les cadres et jeunes diplômés originaires de la commune
- Créer des liens entre les talents et les opportunités locales
- Faciliter le développement économique de la commune
- Valoriser les compétences de notre jeunesse

## Comment s'inscrire ?

L'inscription est entièrement **gratuite** et accessible depuis n'importe quel smartphone. Il vous suffit de :
1. Cliquer sur "S'inscrire" en haut de cette page
2. Choisir votre profil (Haut Cadre ou Jeune Talent)
3. Remplir votre formulaire en quelques minutes
4. Attendre la validation par l'équipe AGANER

## La confidentialité garantie

Toutes les données collectées respectent la législation béninoise sur la protection des données personnelles (APDP). Vous contrôlez entièrement les informations visibles publiquement sur votre profil.

Rejoignez-nous et contribuez au développement des Aguégués !`,
    },
    'programme-emploi-jeunes-2025': {
        slug: 'programme-emploi-jeunes-2025',
        titre: 'Programme Emploi Jeunes — Appel à candidatures',
        categorie: 'opportunite',
        date: '2025-02-20',
        emoji: '💼',
        image_couleur: '#c4940a',
        temps_lecture: '4 min',
        auteur: 'Mairie des Aguégués',
        contenu: `La Mairie des Aguégués lance avec l'appui de partenaires techniques un **Programme d'Appui à l'Emploi des Jeunes** pour l'année 2025.

## Qui peut postuler ?

- Jeunes de 18 à 35 ans originaires de la commune des Aguégués
- Titulaires d'un diplôme (BEPC minimum)
- Résidant au Bénin
- Sans emploi ou en reconversion professionnelle

## Ce que comprend le programme

✅ **Accompagnement entrepreneurial** pendant 6 mois par des mentors qualifiés
✅ **Formation** en compétences professionnelles et gestion d'entreprise
✅ **Subvention** de démarrage (montant selon le projet, entre 200 000 et 500 000 FCFA)
✅ **Accès aux réseaux** de partenaires économiques de la commune

## Comment postuler ?

Rendez-vous à la Mairie des Aguégués avec :
- Une pièce d'identité en cours de validité
- Votre diplôme ou attestation de niveau
- Un document décrivant votre projet (1 à 2 pages)
- Un extrait de naissance

**Date limite de dépôt : 30 mars 2025**

Pour toute information complémentaire, contactez le service jeunesse de la Mairie au +229 XX XX XX XX.`,
    },
    'journee-recensement-mars-2025': {
        slug: 'journee-recensement-mars-2025',
        titre: 'Grande journée de recensement numérique — 15 mars',
        categorie: 'evenement',
        date: '2025-02-10',
        emoji: '📋',
        image_couleur: '#0d9488',
        temps_lecture: '3 min',
        auteur: 'ONG AGANER',
        contenu: `L'ONG AGANER organise une **Grande Journée de Recensement Numérique** le **samedi 15 mars 2025** dans tous les quartiers de la commune des Aguégués.

## Programme de la journée

**8h00 – 10h00** : Déploiement des équipes dans les quartiers
**10h00 – 17h00** : Sessions d'inscription assistée par des agents AGANER
**17h00 – 18h00** : Clôture et remise de certificats aux inscrits

## Points d'inscription

Des tables seront installées aux endroits suivants :
- Devant la Mairie des Aguégués
- Place du marché principal
- Groupe scolaire du quartier centre
- Centre de santé communautaire

## Que faut-il apporter ?

- Une pièce d'identité ou acte de naissance
- Les informations sur votre formation et expérience professionnelle
- (Optionnel) Un CV si vous en avez un

L'inscription est **100% gratuite** et dure moins de 10 minutes avec l'aide de nos agents.

Venez nombreux ! Ensemble, construisons l'annuaire des talents des Aguégués.`,
    },
}

const categorieConfig: Record<Categorie, { label: string; couleur: string; bg: string }> = {
    actualite: { label: 'Actualité', couleur: '#1a6b3c', bg: '#dcf0e4' },
    opportunite: { label: 'Opportunité', couleur: '#92400e', bg: '#fef3c7' },
    nomination: { label: 'Nomination', couleur: '#4c1d95', bg: '#ede9fe' },
    evenement: { label: 'Événement', couleur: '#0d7f78', bg: '#ccfbf1' },
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Rendu Markdown simplifié
function renderContent(text: string) {
    return text.split('\n').map((line, i) => {
        if (line.startsWith('## ')) {
            return <h2 key={i} style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-gray-900)', margin: '2rem 0 0.75rem' }}>{line.slice(3)}</h2>
        }
        if (line.startsWith('**') && line.endsWith('**')) {
            return <strong key={i}>{line.slice(2, -2)}</strong>
        }
        if (line.startsWith('✅') || line.startsWith('-') || line.startsWith('*')) {
            return <li key={i} style={{ color: 'var(--color-gray-700)', lineHeight: 1.7, marginBottom: '0.375rem' }}>{line.replace(/^[-✅\*]\s*/, '')}</li>
        }
        if (/^\d+\./.test(line)) {
            return <li key={i} style={{ color: 'var(--color-gray-700)', lineHeight: 1.7, marginBottom: '0.375rem' }}>{line.replace(/^\d+\.\s*/, '')}</li>
        }
        if (line.trim() === '') return <br key={i} />
        // Inline bold
        const parts = line.split(/\*\*(.*?)\*\*/g)
        if (parts.length > 1) {
            return (
                <p key={i} style={{ color: 'var(--color-gray-700)', lineHeight: 1.8, marginBottom: '0.75rem', fontSize: '1rem' }}>
                    {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
                </p>
            )
        }
        return <p key={i} style={{ color: 'var(--color-gray-700)', lineHeight: 1.8, marginBottom: '0.75rem', fontSize: '1rem' }}>{line}</p>
    })
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const article = articles[slug]

    if (!article) {
        return (
            <>
                <Header />
                <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
                    <p style={{ fontSize: '1.25rem', color: 'var(--color-gray-500)' }}>Article introuvable.</p>
                    <Link href="/actualites" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Retour aux actualités
                    </Link>
                </div>
                <Footer />
            </>
        )
    }

    const cat = categorieConfig[article.categorie]

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>
                {/* Bannière colorée */}
                <div style={{
                    background: `linear-gradient(135deg, ${article.image_couleur}ee 0%, ${article.image_couleur}99 100%)`,
                    padding: '3rem 0 2rem', position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                    <div className="container-main" style={{ position: 'relative' }}>
                        {/* Breadcrumb */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <Link href="/actualites" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                                <ArrowLeft size={15} /> Actualités
                            </Link>
                            <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
                            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                {article.titre}
                            </span>
                        </div>

                        <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.22)', color: 'white', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.3)', marginBottom: '1rem' }}>
                            {cat.label}
                        </span>
                        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{article.emoji}</div>
                        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, color: 'white', margin: '0 0 1.25rem', lineHeight: 1.2, maxWidth: '700px' }}>
                            {article.titre}
                        </h1>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <Calendar size={14} /> {formatDate(article.date)}
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <Clock size={14} /> {article.temps_lecture} de lecture
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
                                Par {article.auteur}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="container-main" style={{ padding: '2.5rem 1rem 4rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="article-grid">
                        {/* Contenu */}
                        <div style={{ background: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-card)', padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                            <div style={{ maxWidth: '680px' }}>
                                <div style={{ listStylePosition: 'inside' }}>
                                    {renderContent(article.contenu)}
                                </div>
                            </div>

                            {/* Footer article */}
                            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-gray-100)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'var(--color-gray-100)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-gray-700)', fontFamily: 'inherit' }}>
                                    <Share2 size={16} /> Partager
                                </button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'var(--color-gray-100)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-gray-700)', fontFamily: 'inherit' }}>
                                    <Bookmark size={16} /> Sauvegarder
                                </button>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-card)', padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-gray-800)', margin: '0 0 1rem' }}>
                                    Informations
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Catégorie</div>
                                        <span style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: '999px', background: cat.bg, color: cat.couleur, fontSize: '0.8125rem', fontWeight: 700 }}>
                                            {cat.label}
                                        </span>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Publié le</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-700)', fontWeight: 500 }}>{formatDate(article.date)}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Auteur</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-700)', fontWeight: 500 }}>{article.auteur}</div>
                                    </div>
                                </div>
                            </div>

                            <Link href="/actualites" style={{ textDecoration: 'none' }}>
                                <div style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-200)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                    <ArrowLeft size={18} color="var(--color-primary)" />
                                    <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.9375rem' }}>
                                        Toutes les actualités
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <style>{`
        @media (min-width: 768px) {
          .article-grid { grid-template-columns: 1fr 280px !important; }
        }
        ul { padding-left: 1.25rem; }
        li { margin-bottom: 0.375rem; }
      `}</style>
        </>
    )
}
