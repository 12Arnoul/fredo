'use client'

import { use } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    MapPin, Briefcase, TrendingUp, ChevronRight,
    ArrowLeft, GraduationCap, CheckCircle, FileText, Sparkles
} from 'lucide-react'

const jeunes: Record<string, {
    id: string; nom: string; formation: string; universite: string;
    competences: string[]; secteur: string; ville: string; disponible: boolean;
    statut: string; initiales: string; bio: string; cv_url?: string; annee_diplome: string;
}> = {
    '1': {
        id: '1', nom: 'Fidèle Kossou', formation: 'Master Informatique',
        universite: 'Université d\'Abomey-Calavi (UAC)', annee_diplome: '2023',
        competences: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Git'],
        secteur: 'Technologie', ville: 'Cotonou', disponible: true, statut: 'cherche_emploi',
        initiales: 'FK', cv_url: '#',
        bio: 'Développeur web full-stack passionné avec une solide maîtrise de React et Node.js. 2 ans d\'expérience en freelance sur des projets pour des PME béninoises et des clients internationaux. Cherche un CDI dans une startup ou une entreprise tech béninoise où je peux contribuer au développement digital de l\'Afrique.',
    },
    '2': {
        id: '2', nom: 'Rosine Dangnivo', formation: 'Licence Comptabilité-Finance',
        universite: 'UNSTIM', annee_diplome: '2022',
        competences: ['Comptabilité OHADA', 'Excel avancé', 'Sage Comptabilité', 'Fiscalité béninoise', 'Budget'],
        secteur: 'Finance', ville: 'Cotonou', disponible: true, statut: 'cherche_emploi',
        initiales: 'RD', cv_url: '#',
        bio: 'Comptable junior maîtrisant le plan comptable OHADA et les logiciels de comptabilité. Rigoureuse et organisée, je cherche un poste dans une PME structurée pour développer mes compétences en contrôle de gestion.',
    },
    '6': {
        id: '6', nom: 'Laëticia Houssou', formation: 'Licence Infirmerie',
        universite: 'ENAM — Cotonou', annee_diplome: '2023',
        competences: ['Soins infirmiers', 'Urgences médicales', 'Pédiatrie', 'Hygiène hospitalière', 'SAMU'],
        secteur: 'Santé', ville: 'Cotonou', disponible: true, statut: 'cherche_emploi',
        initiales: 'LH', cv_url: '#',
        bio: 'Infirmière diplômée d\'État en recherche active de poste. Stage de 6 mois au CHUZ Abomey-Calavi (service pédiatrie). Rigoureuse, empathique et motivée par l\'amélioration de la santé maternelle et infantile.',
    },
}

const defaultJeune = jeunes['1']
const statutLabels: Record<string, string> = {
    cherche_emploi: 'Cherche emploi',
    en_poste: 'En poste',
    etudiant: 'Étudiant',
    entrepreneur: 'Entrepreneur',
}

export default function ProfilJeunePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const jeune = jeunes[id] || defaultJeune
    const accentColor = 'var(--color-secondary)'

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>
                <div style={{ height: '6px', background: 'linear-gradient(90deg, var(--color-secondary) 0%, var(--color-primary) 100%)' }} />

                <div className="container-main" style={{ padding: '1.5rem 1rem 4rem' }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Link href="/annuaire/jeunes" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-gray-500)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                            <ArrowLeft size={16} /> Retour aux jeunes talents
                        </Link>
                        <ChevronRight size={14} color="var(--color-gray-300)" />
                        <span style={{ color: 'var(--color-gray-700)', fontSize: '0.875rem' }}>{jeune.nom}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="profil-grid-jeune">
                        {/* ---- CARTE PRINCIPALE ---- */}
                        <div style={{ background: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, #eff4fb 0%, #f5f8ff 100%)', padding: '2rem 2rem 1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div className="avatar-placeholder" style={{ width: '84px', height: '84px', fontSize: '1.875rem', flexShrink: 0 }}>
                                        {jeune.initiales}
                                    </div>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                                            <h1 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', fontWeight: 900, color: 'var(--color-gray-900)', margin: 0 }}>
                                                {jeune.nom}
                                            </h1>
                                            {jeune.disponible && (
                                                <span className="badge badge-green" style={{ fontSize: '0.8125rem' }}>
                                                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
                                                    Disponible
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '1rem', color: accentColor, fontWeight: 600, margin: '0 0 0.25rem' }}>
                                            {jeune.formation}
                                        </p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-400)', margin: '0 0 1rem' }}>
                                            {jeune.universite} — {jeune.annee_diplome}
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <span className="badge badge-blue"><Briefcase size={11} /> {jeune.secteur}</span>
                                            <span className="badge badge-gray"><MapPin size={11} /> {jeune.ville}</span>
                                            <span className={`badge ${jeune.statut === 'cherche_emploi' ? 'badge-gold' : 'badge-gray'}`}>
                                                {statutLabels[jeune.statut]}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '0 2rem 2rem' }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-700)', margin: '1.5rem 0 0.75rem' }}>
                                    Présentation
                                </h2>
                                <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.75, fontSize: '0.9375rem', margin: 0 }}>
                                    {jeune.bio}
                                </p>
                            </div>
                        </div>

                        {/* ---- COLONNE LATÉRALE ---- */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Compétences */}
                            <div style={{ background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-card)', padding: '1.5rem' }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-800)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Sparkles size={18} color="var(--color-secondary)" /> Compétences
                                </h2>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {jeune.competences.map((c) => (
                                        <span key={c} style={{
                                            padding: '0.375rem 0.875rem',
                                            background: 'var(--color-secondary-50)',
                                            border: '1px solid #c7d8f5',
                                            borderRadius: '999px',
                                            fontSize: '0.875rem', fontWeight: 500,
                                            color: 'var(--color-secondary)',
                                        }}>
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Formation */}
                            <div style={{ background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-card)', padding: '1.5rem' }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-800)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <GraduationCap size={18} color="var(--color-secondary)" /> Formation
                                </h2>
                                <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--color-secondary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <GraduationCap size={20} color="var(--color-secondary)" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'var(--color-gray-800)', fontSize: '0.9375rem' }}>{jeune.formation}</div>
                                        <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginTop: '2px' }}>{jeune.universite}</div>
                                        <div style={{ color: 'var(--color-gray-400)', fontSize: '0.8125rem', marginTop: '2px' }}>Diplômé en {jeune.annee_diplome}</div>
                                    </div>
                                </div>
                            </div>

                            {/* CV & Contact */}
                            <div style={{ background: 'linear-gradient(135deg, #eff4fb 0%, #f5f8ff 100%)', border: '1px solid #c7d8f5', borderRadius: '16px', padding: '1.5rem' }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-800)', margin: '0 0 1rem' }}>
                                    Recruteur ?
                                </h2>
                                {jeune.cv_url && (
                                    <a href={jeune.cv_url} className="btn btn-secondary btn-full" style={{ marginBottom: '0.75rem' }}>
                                        <FileText size={17} /> Télécharger le CV
                                    </a>
                                )}
                                {jeune.disponible && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#dcf0e4', borderRadius: '10px', padding: '0.75rem 1rem', marginTop: '0.75rem' }}>
                                        <CheckCircle size={16} color="var(--color-success)" />
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                                            Disponible pour un entretien
                                        </span>
                                    </div>
                                )}
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', textAlign: 'center', margin: '0.75rem 0 0' }}>
                                    Connectez-vous pour accéder aux informations de contact.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <style>{`
        @media (min-width: 768px) {
          .profil-grid-jeune { grid-template-columns: 1fr 320px !important; }
        }
      `}</style>
        </>
    )
}
