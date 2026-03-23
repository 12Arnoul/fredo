'use client'

import { use } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    MapPin, Briefcase, Award, ChevronRight,
    ArrowLeft, GraduationCap, Star, LinkedinIcon
} from 'lucide-react'

// Données de démo (mêmes que dans la liste)
const cadres: Record<string, {
    id: string; nom: string; poste: string; employeur: string; secteur: string;
    ville: string; pays: string; niveau: string; diplomes: string[]; initiales: string;
    couleur: string; bio: string; linkedin: string; realisations: string[];
    annees_experience: number; domaine: string;
}> = {
    '1': {
        id: '1', nom: 'Dr. Kofi Mensah', poste: 'Directeur Médical', employeur: 'CHU Cotonou',
        secteur: 'Santé', ville: 'Cotonou', pays: 'Bénin', niveau: 'Doctorat',
        diplomes: ['Doctorat en Médecine — Université Paris VI', 'DES Chirurgie Générale — Paris'],
        initiales: 'KM', couleur: '#1a6b3c',
        bio: 'Médecin spécialiste avec 15 ans d\'expérience en chirurgie générale. Ancien interne des Hôpitaux de Paris. Directeur médical au CHU de Cotonou depuis 2018, il contribue activement au développement du plateau technique médical du Bénin.',
        linkedin: '#', annees_experience: 15, domaine: 'Chirurgie générale & Management médical',
        realisations: [
            'Mise en place du premier bloc de chirurgie laparoscopique au CHU Cotonou',
            'Formation de 40 infirmiers en techniques chirurgicales avancées',
            'Co-auteur de 8 publications médicales internationales',
            'Coordinateur du programme de santé maternelle au Sud Bénin',
        ],
    },
    '2': {
        id: '2', nom: 'Ing. Adélaïde Hounton', poste: 'Ingénieure en Chef', employeur: 'BCEAO Bénin',
        secteur: 'Finance', ville: 'Cotonou', pays: 'Bénin', niveau: 'Master',
        diplomes: ['Master Finance Internationale — Université Paris-Dauphine', 'Licence Économie — UAC'],
        initiales: 'AH', couleur: '#1e3a5f',
        bio: 'Experte en génie financier et risk management. 10 ans d\'expérience dans le secteur bancaire africain. Elle supervise les politiques monétaires et les systèmes de paiement régionaux à la BCEAO.',
        linkedin: '#', annees_experience: 10, domaine: 'Finance internationale & Risk Management',
        realisations: [
            'Mise en place du système de paiement mobile interbancaire UEMOA',
            'Coordination de l\'audit financier de 12 banques commerciales béninoises',
            'Conférencière au Forum Économique Africain 2023',
        ],
    },
    '4': {
        id: '4', nom: 'Pr. Célestine Dossou', poste: 'Professeure Titulaire', employeur: 'Université d\'Abomey-Calavi',
        secteur: 'Éducation', ville: 'Abomey-Calavi', pays: 'Bénin', niveau: 'Doctorat',
        diplomes: ['Doctorat en Mathématiques Appliquées — EPFL Lausanne', 'Master — UAC'],
        initiales: 'CD', couleur: '#7c3aed',
        bio: 'Professeure de mathématiques appliquées à l\'UAC depuis 2012. Auteur de 3 ouvrages et plus de 20 articles scientifiques en analyse numérique et optimisation.',
        linkedin: '#', annees_experience: 18, domaine: 'Mathématiques appliquées & Recherche',
        realisations: [
            'Publication de 3 ouvrages pédagogiques de mathématiques pour le supérieur',
            'Lauréate du prix CAMES 2021 pour la recherche scientifique',
            'Directrice de 12 thèses de doctorat soutenues',
        ],
    },
}

// Fallback pour les IDs non définis
const defaultCadre = cadres['1']

export default function ProfilCadrePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const cadre = cadres[id] || defaultCadre

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>

                {/* Bande colorée en haut */}
                <div style={{ height: '6px', background: `linear-gradient(90deg, ${cadre.couleur} 0%, ${cadre.couleur}88 100%)` }} />

                <div className="container-main" style={{ padding: '1.5rem 1rem 4rem' }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Link href="/annuaire/cadres" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-gray-500)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                            <ArrowLeft size={16} /> Retour aux cadres
                        </Link>
                        <ChevronRight size={14} color="var(--color-gray-300)" />
                        <span style={{ color: 'var(--color-gray-700)', fontSize: '0.875rem' }}>{cadre.nom}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="profil-grid">
                        {/* ---- CARTE PROFIL PRINCIPALE ---- */}
                        <div style={{ background: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                            <div style={{ background: `linear-gradient(135deg, ${cadre.couleur}18 0%, ${cadre.couleur}08 100%)`, padding: '2rem 2rem 1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    {/* Avatar */}
                                    <div className="avatar-placeholder" style={{
                                        width: '90px', height: '90px', fontSize: '2rem', flexShrink: 0,
                                        background: `linear-gradient(135deg, ${cadre.couleur}30 0%, ${cadre.couleur}15 100%)`,
                                        color: cadre.couleur, border: `3px solid ${cadre.couleur}40`,
                                    }}>
                                        {cadre.initiales}
                                    </div>

                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <h1 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', fontWeight: 900, color: 'var(--color-gray-900)', margin: '0 0 0.25rem' }}>
                                            {cadre.nom}
                                        </h1>
                                        <p style={{ fontSize: '1.0625rem', color: cadre.couleur, fontWeight: 600, margin: '0 0 0.25rem' }}>
                                            {cadre.poste}
                                        </p>
                                        <p style={{ fontSize: '0.9375rem', color: 'var(--color-gray-500)', margin: '0 0 1rem' }}>
                                            {cadre.employeur}
                                        </p>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <span className="badge badge-green"><Award size={11} /> {cadre.secteur}</span>
                                            <span className="badge badge-gray"><MapPin size={11} /> {cadre.ville}, {cadre.pays}</span>
                                            <span className="badge badge-blue"><GraduationCap size={11} /> {cadre.niveau}</span>
                                            <span className="badge badge-gold"><Star size={11} /> {cadre.annees_experience} ans d&apos;expérience</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div style={{ padding: '0 2rem 2rem' }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-700)', margin: '1.5rem 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    À propos
                                </h2>
                                <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.75, fontSize: '0.9375rem', margin: 0 }}>
                                    {cadre.bio}
                                </p>

                                {/* Domaine */}
                                <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--color-gray-50)', borderRadius: '12px', borderLeft: `4px solid ${cadre.couleur}` }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                                        Domaine d&apos;expertise
                                    </div>
                                    <div style={{ fontWeight: 600, color: 'var(--color-gray-800)', fontSize: '0.9375rem' }}>
                                        {cadre.domaine}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ---- COLONNE LATÉRALE ---- */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Formation */}
                            <div style={{ background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-card)', padding: '1.5rem' }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-800)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <GraduationCap size={18} color={cadre.couleur} /> Formation
                                </h2>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {cadre.diplomes.map((d, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cadre.couleur, flexShrink: 0, marginTop: '6px' }} />
                                            <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', lineHeight: 1.5 }}>{d}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Réalisations */}
                            <div style={{ background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-card)', padding: '1.5rem' }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-800)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Star size={18} color={cadre.couleur} /> Réalisations
                                </h2>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    {cadre.realisations.map((r, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', background: `${cadre.couleur}08`, borderRadius: '10px' }}>
                                            <span style={{ fontSize: '1rem', flexShrink: 0 }}>✅</span>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-700)', lineHeight: 1.5 }}>{r}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Contact */}
                            <div style={{ background: `linear-gradient(135deg, ${cadre.couleur}12 0%, ${cadre.couleur}05 100%)`, border: `1px solid ${cadre.couleur}20`, borderRadius: '16px', padding: '1.5rem' }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-800)', margin: '0 0 1rem' }}>
                                    Contact
                                </h2>
                                <a href={cadre.linkedin} className="btn btn-secondary btn-full" style={{ marginBottom: '0.75rem', gap: '0.5rem' }}>
                                    <LinkedinIcon size={18} /> Voir le profil LinkedIn
                                </a>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', textAlign: 'center', margin: 0 }}>
                                    Pour contacter cette personne, créez un compte ou connectez-vous.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <style>{`
        @media (min-width: 768px) {
          .profil-grid { grid-template-columns: 1fr 340px !important; }
        }
      `}</style>
        </>
    )
}
