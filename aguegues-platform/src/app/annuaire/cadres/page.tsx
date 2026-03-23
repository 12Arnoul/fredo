'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    Search, SlidersHorizontal, MapPin, Briefcase, Award,
    ChevronRight, X, Users, Filter, LinkedinIcon
} from 'lucide-react'

// ========================
// DONNÉES DE DÉMONSTRATION
// ========================
const cadres = [
    { id: '1', nom: 'Dr. Kofi Mensah', poste: 'Directeur Médical', employeur: 'CHU Cotonou', secteur: 'Santé', ville: 'Cotonou', niveau: 'Doctorat', initiales: 'KM', couleur: '#1a6b3c', bio: 'Médecin spécialiste avec 15 ans d\'expérience en chirurgie générale. Ancien interne des Hôpitaux de Paris.', linkedin: '#' },
    { id: '2', nom: 'Ing. Adélaïde Hounton', poste: 'Ingénieure en Chef', employeur: 'BCEAO Bénin', secteur: 'Finance', ville: 'Cotonou', niveau: 'Master', initiales: 'AH', couleur: '#1e3a5f', bio: 'Experte en génie financier et risk management. 10 ans d\'expérience dans le secteur bancaire africain.', linkedin: '#' },
    { id: '3', nom: 'Me. Patrice Agossou', poste: 'Avocat Associé', employeur: 'Cabinet Agossou & Partners', secteur: 'Droit', ville: 'Porto-Novo', niveau: 'Master', initiales: 'PA', couleur: '#c4940a', bio: 'Spécialisé en droit des affaires et droit international. Membre du Barreau du Bénin depuis 12 ans.', linkedin: '#' },
    { id: '4', nom: 'Pr. Célestine Dossou', poste: 'Professeure Titulaire', employeur: 'Université d\'Abomey-Calavi', secteur: 'Éducation', ville: 'Abomey-Calavi', niveau: 'Doctorat', initiales: 'CD', couleur: '#7c3aed', bio: 'Professeure de mathématiques appliquées. Auteur de 3 ouvrages et plus de 20 articles scientifiques.', linkedin: '#' },
    { id: '5', nom: 'Ing. Romuald Gandonou', poste: 'Directeur des Travaux', employeur: 'AGETIP-Bénin', secteur: 'BTP', ville: 'Cotonou', niveau: 'Master', initiales: 'RG', couleur: '#c2410c', bio: 'Ingénieur civil spécialisé en infrastructures routières. Responsable de plus de 50 projets au Bénin.', linkedin: '#' },
    { id: '6', nom: 'M. Théodore Zinzindohoué', poste: 'Magistrat', employeur: 'Cour Suprême du Bénin', secteur: 'Droit', ville: 'Cotonou', niveau: 'Master', initiales: 'TZ', couleur: '#0d9488', bio: 'Magistrat depuis 18 ans. Spécialiste en droit constitutionnel et droits fondamentaux.', linkedin: '#' },
    { id: '7', nom: 'Dr. Rosalie Ahounou', poste: 'Pédiatre', employeur: 'Clinique Mère-Enfant', secteur: 'Santé', ville: 'Parakou', niveau: 'Doctorat', initiales: 'RA', couleur: '#db2777', bio: 'Pédiatre spécialisée en néonatologie. Fondatrice d\'une ONG de santé maternelle dans le nord Bénin.', linkedin: '#' },
    { id: '8', nom: 'M. Gustave Kpossou', poste: 'DGA Ressources Humaines', employeur: 'Port Autonome de Cotonou', secteur: 'Logistique', ville: 'Cotonou', niveau: 'Master', initiales: 'GK', couleur: '#1e3a5f', bio: 'Expert RH avec 20 ans d\'expérience dans les entreprises publiques béninoises et internationales.', linkedin: '#' },
    { id: '9', nom: 'Ing. Marcelline Atchade', poste: 'Chef de Projet IT', employeur: 'MTN Bénin', secteur: 'Technologie', ville: 'Cotonou', niveau: 'Master', initiales: 'MA', couleur: '#1a6b3c', bio: 'Ingénieure informatique spécialisée en systèmes de télécommunications et transformation digitale.', linkedin: '#' },
]

const secteurs = ['Tous', 'Santé', 'Finance', 'Droit', 'Éducation', 'BTP', 'Technologie', 'Logistique']
const villes = ['Toutes', 'Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou']
const niveaux = ['Tous', 'Licence', 'Master', 'Doctorat', 'BTS/DUT']

export default function AnnuaireCadresPage() {
    const [recherche, setRecherche] = useState('')
    const [secteurFiltre, setSecteurFiltre] = useState('Tous')
    const [villeFiltre, setVilleFiltre] = useState('Toutes')
    const [niveauFiltre, setNiveauFiltre] = useState('Tous')
    const [filtrePanelOpen, setFiltrePanelOpen] = useState(false)

    const resultats = useMemo(() => {
        return cadres.filter((c) => {
            const matchRecherche = recherche === '' ||
                c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                c.poste.toLowerCase().includes(recherche.toLowerCase()) ||
                c.secteur.toLowerCase().includes(recherche.toLowerCase())
            const matchSecteur = secteurFiltre === 'Tous' || c.secteur === secteurFiltre
            const matchVille = villeFiltre === 'Toutes' || c.ville === villeFiltre
            const matchNiveau = niveauFiltre === 'Tous' || c.niveau === niveauFiltre
            return matchRecherche && matchSecteur && matchVille && matchNiveau
        })
    }, [recherche, secteurFiltre, villeFiltre, niveauFiltre])

    const nbFiltresActifs = [secteurFiltre !== 'Tous', villeFiltre !== 'Toutes', niveauFiltre !== 'Tous'].filter(Boolean).length

    const resetFiltres = () => {
        setSecteurFiltre('Tous')
        setVilleFiltre('Toutes')
        setNiveauFiltre('Tous')
        setRecherche('')
    }

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>
                {/* ---- EN-TÊTE DE PAGE ---- */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                    padding: '3rem 0 2rem',
                }}>
                    <div className="container-main">
                        {/* Breadcrumb */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem' }}>Accueil</Link>
                            <ChevronRight size={14} color="rgba(255,255,255,0.5)" />
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }}>Hauts Cadres</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Award size={28} color="white" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: 'white', margin: 0 }}>
                                    Annuaire des Hauts Cadres
                                </h1>
                                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', margin: '0.25rem 0 0' }}>
                                    {cadres.length} cadres et experts originaires de la commune des Aguégués
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-main" style={{ padding: '2rem 1rem' }}>
                    {/* ---- BARRE DE RECHERCHE + FILTRES ---- */}
                    <div style={{
                        background: 'white', borderRadius: '16px',
                        boxShadow: 'var(--shadow-card)', padding: '1.25rem',
                        marginBottom: '1.5rem',
                    }}>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {/* Search */}
                            <div style={{ flex: '1 1 240px', position: 'relative' }}>
                                <Search size={18} style={{
                                    position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--color-gray-400)',
                                }} />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom, poste, secteur…"
                                    value={recherche}
                                    onChange={(e) => setRecherche(e.target.value)}
                                    className="form-input"
                                    style={{ paddingLeft: '2.75rem' }}
                                />
                            </div>

                            {/* Bouton Filtres */}
                            <button
                                onClick={() => setFiltrePanelOpen(!filtrePanelOpen)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0 1.25rem', minHeight: '48px',
                                    background: filtrePanelOpen ? 'var(--color-primary-50)' : 'var(--color-gray-50)',
                                    border: `2px solid ${filtrePanelOpen ? 'var(--color-primary)' : 'var(--color-gray-200)'}`,
                                    borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9375rem',
                                    color: filtrePanelOpen ? 'var(--color-primary)' : 'var(--color-gray-700)',
                                    fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap',
                                }}>
                                <Filter size={17} />
                                Filtres
                                {nbFiltresActifs > 0 && (
                                    <span style={{
                                        background: 'var(--color-primary)', color: 'white',
                                        borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                                        padding: '0 6px', lineHeight: '18px', minWidth: '18px', textAlign: 'center',
                                    }}>{nbFiltresActifs}</span>
                                )}
                            </button>

                            {nbFiltresActifs > 0 && (
                                <button onClick={resetFiltres} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                                    padding: '0 1rem', minHeight: '48px',
                                    background: '#fee2e2', border: '2px solid #fca5a5',
                                    borderRadius: '10px', cursor: 'pointer', fontWeight: 600,
                                    fontSize: '0.875rem', color: '#dc2626', fontFamily: 'inherit',
                                }}>
                                    <X size={15} /> Effacer
                                </button>
                            )}
                        </div>

                        {/* Panneau filtres dépliable */}
                        {filtrePanelOpen && (
                            <div style={{
                                marginTop: '1rem', paddingTop: '1rem',
                                borderTop: '1px solid var(--color-gray-100)',
                                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem',
                            }}>
                                {[
                                    { label: 'Secteur d\'activité', value: secteurFiltre, setter: setSecteurFiltre, options: secteurs },
                                    { label: 'Ville de résidence', value: villeFiltre, setter: setVilleFiltre, options: villes },
                                    { label: 'Niveau d\'études', value: niveauFiltre, setter: setNiveauFiltre, options: niveaux },
                                ].map(({ label, value, setter, options }) => (
                                    <div key={label} className="form-group">
                                        <label className="form-label">{label}</label>
                                        <select
                                            className="form-select"
                                            value={value}
                                            onChange={(e) => setter(e.target.value)}
                                        >
                                            {options.map((o) => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ---- RÉSULTATS ---- */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9375rem', margin: 0 }}>
                            <strong style={{ color: 'var(--color-gray-800)' }}>{resultats.length}</strong> résultat{resultats.length > 1 ? 's' : ''}
                            {recherche && <span> pour « <em>{recherche}</em> »</span>}
                        </p>
                    </div>

                    {resultats.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <Users size={48} color="var(--color-gray-300)" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--color-gray-500)', fontSize: '1.1rem', fontWeight: 500 }}>Aucun résultat trouvé</p>
                            <p style={{ color: 'var(--color-gray-400)' }}>Essayez de modifier vos critères de recherche.</p>
                            <button className="btn btn-outline" onClick={resetFiltres} style={{ marginTop: '1rem' }}>
                                Réinitialiser les filtres
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.25rem',
                        }}>
                            {resultats.map((cadre) => (
                                <Link key={cadre.id} href={`/annuaire/cadres/${cadre.id}`} style={{ textDecoration: 'none' }}>
                                    <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                                        {/* Bande colorée en haut */}
                                        <div style={{ height: '5px', background: `linear-gradient(90deg, ${cadre.couleur} 0%, ${cadre.couleur}99 100%)` }} />
                                        <div style={{ padding: '1.5rem' }}>
                                            {/* Avatar + Nom */}
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                                <div className="avatar-placeholder" style={{
                                                    width: '58px', height: '58px', fontSize: '1.2rem', flexShrink: 0,
                                                    background: `linear-gradient(135deg, ${cadre.couleur}22 0%, ${cadre.couleur}11 100%)`,
                                                    color: cadre.couleur, border: `2px solid ${cadre.couleur}30`,
                                                }}>
                                                    {cadre.initiales}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h2 style={{
                                                        fontSize: '1rem', fontWeight: 700,
                                                        color: 'var(--color-gray-900)', marginBottom: '2px',
                                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                    }}>
                                                        {cadre.nom}
                                                    </h2>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', margin: 0, lineHeight: 1.4 }}>
                                                        {cadre.poste}
                                                    </p>
                                                    {cadre.employeur && (
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', margin: '2px 0 0', lineHeight: 1.3 }}>
                                                            {cadre.employeur}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bio */}
                                            <p style={{
                                                fontSize: '0.85rem', color: 'var(--color-gray-500)', lineHeight: 1.6,
                                                margin: '0 0 1rem',
                                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                            }}>
                                                {cadre.bio}
                                            </p>

                                            {/* Badges */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                <span className="badge badge-green">
                                                    <Briefcase size={10} /> {cadre.secteur}
                                                </span>
                                                <span className="badge badge-gray">
                                                    <MapPin size={10} /> {cadre.ville}
                                                </span>
                                                <span className="badge badge-blue">
                                                    {cadre.niveau}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
