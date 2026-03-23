'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    Search, MapPin, Briefcase, TrendingUp,
    ChevronRight, X, Users, Filter, FileText, CheckCircle
} from 'lucide-react'

// ========================
// DONNÉES DE DÉMONSTRATION
// ========================
const jeunes = [
    { id: '1', nom: 'Fidèle Kossou', formation: 'Master Informatique', universite: 'UAC', competences: ['Développement Web', 'React', 'Node.js'], secteur: 'Technologie', ville: 'Cotonou', disponible: true, statut: 'cherche_emploi', initiales: 'FK', bio: 'Développeur web passionné, spécialisé en React et Node.js. 2 ans d\'expérience en freelance. Cherche un CDI dans une startup béninoise.' },
    { id: '2', nom: 'Rosine Dangnivo', formation: 'Licence Comptabilité-Finance', universite: 'UNSTIM', competences: ['Comptabilité', 'OHADA', 'Excel'], secteur: 'Finance', ville: 'Cotonou', disponible: true, statut: 'cherche_emploi', initiales: 'RD', bio: 'Comptable junior maîtrisant le plan OHADA. Cherche un poste dans une PME structurée.' },
    { id: '3', nom: 'Thierry Ahounou', formation: 'BTS Electronique', universite: 'Lycée Technique', competences: ['Électronique', 'Maintenance', 'Arduino'], secteur: 'Technologie', ville: 'Abomey-Calavi', disponible: false, statut: 'en_poste', initiales: 'TA', bio: 'Technicien électronique en poste dans une société de maintenance industrielle à Cotonou.' },
    { id: '4', nom: 'Bénédicte Fonton', formation: 'Licence Droit', universite: 'UAC', competences: ['Droit des affaires', 'Rédaction juridique', 'OHADA'], secteur: 'Droit', ville: 'Porto-Novo', disponible: true, statut: 'cherche_emploi', initiales: 'BF', bio: 'Juriste junior à la recherche d\'un cabinet ou d\'une entreprise pour débuter sa carrière.' },
    { id: '5', nom: 'Arnaud Azondekon', formation: 'Master Agonomie', universite: 'UAC - FSA', competences: ['Agriculture durable', 'Gestion de projet', 'FAO'], secteur: 'Agriculture', ville: 'Abomey-Calavi', disponible: true, statut: 'etudiant', initiales: 'AA', bio: 'Étudiant en master 2 agonomie. Passionné d\'agriculture durable et d\'innovation agricole pour le Bénin.' },
    { id: '6', nom: 'Laëticia Houssou', formation: 'Licence Infirmerie', universite: 'ENAM', competences: ['Soins infirmiers', 'Urgences', 'Pédiatrie'], secteur: 'Santé', ville: 'Cotonou', disponible: true, statut: 'cherche_emploi', initiales: 'LH', bio: 'Infirmière diplômée en recherche de poste. Expérience de 6 mois en stage au CHUZ-Abomey-Calavi.' },
    { id: '7', nom: 'Maxime Adanwenon', formation: 'BTS Commerce International', universite: 'HECM', competences: ['Commerce', 'Import-export', 'Anglais'], secteur: 'Commerce', ville: 'Cotonou', disponible: false, statut: 'entrepreneur', initiales: 'MA', bio: 'Entrepreneur dans l\'import-export de produits alimentaires entre le Bénin et le Nigéria.' },
    { id: '8', nom: 'Christelle Adjovi', formation: 'Master Communication', universite: 'UAC - FLSH', competences: ['Communication digitale', 'Réseaux sociaux', 'Photographie'], secteur: 'Communication', ville: 'Cotonou', disponible: true, statut: 'cherche_emploi', initiales: 'CA', bio: 'Communicante digitale cherchant un poste en agence ou dans une ONG béninoise.' },
    { id: '9', nom: 'Rodrigue Kpanlingan', formation: 'Licence Génie Civil', universite: 'EPAC', competences: ['AutoCAD', 'Dessin technique', 'Béton armé'], secteur: 'BTP', ville: 'Cotonou', disponible: true, statut: 'cherche_emploi', initiales: 'RK', bio: 'Technicien en génie civil, maîtrise AutoCAD et les normes de construction au Bénin.' },
]

const secteurs = ['Tous', 'Technologie', 'Finance', 'Droit', 'Agriculture', 'Santé', 'Commerce', 'Communication', 'BTP']
const villes = ['Toutes', 'Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou']
const statuts = ['Tous', 'cherche_emploi', 'en_poste', 'etudiant', 'entrepreneur']
const statutLabels: Record<string, string> = {
    cherche_emploi: 'Cherche emploi',
    en_poste: 'En poste',
    etudiant: 'Étudiant',
    entrepreneur: 'Entrepreneur',
}

export default function AnnuaireJeunesPage() {
    const [recherche, setRecherche] = useState('')
    const [secteurFiltre, setSecteurFiltre] = useState('Tous')
    const [villeFiltre, setVilleFiltre] = useState('Toutes')
    const [statutFiltre, setStatutFiltre] = useState('Tous')
    const [disponibleSeulement, setDisponibleSeulement] = useState(false)
    const [filtrePanelOpen, setFiltrePanelOpen] = useState(false)

    const resultats = useMemo(() => {
        return jeunes.filter((j) => {
            const matchRecherche = recherche === '' ||
                j.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                j.formation.toLowerCase().includes(recherche.toLowerCase()) ||
                j.competences.some(c => c.toLowerCase().includes(recherche.toLowerCase())) ||
                j.secteur.toLowerCase().includes(recherche.toLowerCase())
            const matchSecteur = secteurFiltre === 'Tous' || j.secteur === secteurFiltre
            const matchVille = villeFiltre === 'Toutes' || j.ville === villeFiltre
            const matchStatut = statutFiltre === 'Tous' || j.statut === statutFiltre
            const matchDispo = !disponibleSeulement || j.disponible
            return matchRecherche && matchSecteur && matchVille && matchStatut && matchDispo
        })
    }, [recherche, secteurFiltre, villeFiltre, statutFiltre, disponibleSeulement])

    const nbFiltresActifs = [
        secteurFiltre !== 'Tous', villeFiltre !== 'Toutes',
        statutFiltre !== 'Tous', disponibleSeulement
    ].filter(Boolean).length

    const resetFiltres = () => {
        setSecteurFiltre('Tous'); setVilleFiltre('Toutes')
        setStatutFiltre('Tous'); setDisponibleSeulement(false); setRecherche('')
    }

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>
                {/* ---- EN-TÊTE DE PAGE ---- */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%)',
                    padding: '3rem 0 2rem',
                }}>
                    <div className="container-main">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem' }}>Accueil</Link>
                            <ChevronRight size={14} color="rgba(255,255,255,0.5)" />
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }}>Jeunes Talents</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <TrendingUp size={28} color="white" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: 'white', margin: 0 }}>
                                    Annuaire des Jeunes Talents
                                </h1>
                                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', margin: '0.25rem 0 0' }}>
                                    {jeunes.length} jeunes diplômés et talents de la commune des Aguégués
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-main" style={{ padding: '2rem 1rem' }}>
                    {/* ---- BARRE DE RECHERCHE + FILTRES ---- */}
                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-card)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 240px', position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom, compétence, formation…"
                                    value={recherche}
                                    onChange={(e) => setRecherche(e.target.value)}
                                    className="form-input"
                                    style={{ paddingLeft: '2.75rem' }}
                                />
                            </div>

                            {/* Toggle disponible */}
                            <button
                                onClick={() => setDisponibleSeulement(!disponibleSeulement)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0 1rem', minHeight: '48px',
                                    background: disponibleSeulement ? '#dcf0e4' : 'var(--color-gray-50)',
                                    border: `2px solid ${disponibleSeulement ? 'var(--color-primary)' : 'var(--color-gray-200)'}`,
                                    borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                                    color: disponibleSeulement ? 'var(--color-primary)' : 'var(--color-gray-600)',
                                    fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap',
                                }}>
                                <CheckCircle size={16} />
                                Disponibles
                            </button>

                            <button
                                onClick={() => setFiltrePanelOpen(!filtrePanelOpen)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0 1.25rem', minHeight: '48px',
                                    background: filtrePanelOpen ? 'var(--color-secondary-50)' : 'var(--color-gray-50)',
                                    border: `2px solid ${filtrePanelOpen ? 'var(--color-secondary)' : 'var(--color-gray-200)'}`,
                                    borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9375rem',
                                    color: filtrePanelOpen ? 'var(--color-secondary)' : 'var(--color-gray-700)',
                                    fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap',
                                }}>
                                <Filter size={17} />
                                Filtres
                                {nbFiltresActifs > 0 && (
                                    <span style={{ background: 'var(--color-secondary)', color: 'white', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, padding: '0 6px', lineHeight: '18px' }}>{nbFiltresActifs}</span>
                                )}
                            </button>

                            {nbFiltresActifs > 0 && (
                                <button onClick={resetFiltres} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0 1rem', minHeight: '48px', background: '#fee2e2', border: '2px solid #fca5a5', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#dc2626', fontFamily: 'inherit' }}>
                                    <X size={15} /> Effacer
                                </button>
                            )}
                        </div>

                        {filtrePanelOpen && (
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-gray-100)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
                                {[
                                    { label: 'Secteur', value: secteurFiltre, setter: setSecteurFiltre, options: secteurs },
                                    { label: 'Ville', value: villeFiltre, setter: setVilleFiltre, options: villes },
                                    { label: 'Statut', value: statutFiltre, setter: setStatutFiltre, options: statuts, labels: statutLabels },
                                ].map(({ label, value, setter, options, labels }) => (
                                    <div key={label} className="form-group">
                                        <label className="form-label">{label}</label>
                                        <select className="form-select" value={value} onChange={(e) => setter(e.target.value)}>
                                            {options.map((o) => <option key={o} value={o}>{labels ? (labels[o] || o) : o}</option>)}
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
                        </p>
                    </div>

                    {resultats.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <Users size={48} color="var(--color-gray-300)" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--color-gray-500)', fontSize: '1.1rem', fontWeight: 500 }}>Aucun résultat trouvé</p>
                            <button className="btn btn-outline" onClick={resetFiltres} style={{ marginTop: '1rem' }}>Réinitialiser</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                            {resultats.map((jeune) => (
                                <Link key={jeune.id} href={`/annuaire/jeunes/${jeune.id}`} style={{ textDecoration: 'none' }}>
                                    <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                                        <div style={{ height: '5px', background: jeune.disponible ? 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)' : 'var(--color-gray-200)' }} />
                                        <div style={{ padding: '1.5rem' }}>
                                            {/* Entête */}
                                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                                    <div className="avatar-placeholder" style={{ width: '52px', height: '52px', fontSize: '1.1rem', flexShrink: 0 }}>
                                                        {jeune.initiales}
                                                    </div>
                                                    <div>
                                                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-900)', margin: 0 }}>{jeune.nom}</h2>
                                                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', margin: '2px 0 0' }}>{jeune.formation}</p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', margin: '1px 0 0' }}>{jeune.universite}</p>
                                                    </div>
                                                </div>
                                                {jeune.disponible && (
                                                    <span className="badge badge-green" style={{ flexShrink: 0 }}>
                                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                                                        Dispo.
                                                    </span>
                                                )}
                                            </div>

                                            {/* Bio */}
                                            <p style={{ fontSize: '0.84rem', color: 'var(--color-gray-500)', lineHeight: 1.6, margin: '0 0 0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {jeune.bio}
                                            </p>

                                            {/* Compétences */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.875rem' }}>
                                                {jeune.competences.slice(0, 3).map((c) => (
                                                    <span key={c} style={{ padding: '0.2rem 0.625rem', background: 'var(--color-gray-100)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-gray-600)' }}>
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Badges info */}
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <span className="badge badge-blue"><Briefcase size={10} /> {jeune.secteur}</span>
                                                <span className="badge badge-gray"><MapPin size={10} /> {jeune.ville}</span>
                                                <span className={`badge ${jeune.statut === 'cherche_emploi' ? 'badge-gold' : 'badge-gray'}`}>
                                                    {statutLabels[jeune.statut]}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* CTA inscription */}
                    <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2.5rem', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-card)' }}>
                        <FileText size={36} color="var(--color-secondary)" style={{ marginBottom: '0.75rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-gray-900)', marginBottom: '0.5rem' }}>
                            Vous êtes un jeune talent des Aguégués ?
                        </h3>
                        <p style={{ color: 'var(--color-gray-500)', marginBottom: '1.25rem' }}>
                            Créez votre profil pour figurer dans cet annuaire et être visible auprès des recruteurs.
                        </p>
                        <Link href="/inscription" className="btn btn-secondary">
                            Créer mon profil gratuitement
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
