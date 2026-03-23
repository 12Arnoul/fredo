'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
    ChevronRight, Search, Filter, X, MapPin, Briefcase,
    GraduationCap, Phone, Mail, CheckCircle, Send, Users,
    ClipboardList, UserPlus
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ── Données statiques (remplacées par Supabase à terme) ─────────────────────
const CADRES_DEMO = [
    { id: '1', nom: 'Dr. Kofi Mensah', domaine: 'Santé', fonction: 'Médecin Chirurgien', localisation: 'Cotonou', disponible: true, competences: ['Chirurgie', 'Pédiatrie', 'Santé publique'], initiales: 'KM', couleur: '#1a6b3c' },
    { id: '2', nom: 'Ing. Adélaïde Hounton', domaine: 'Finance', fonction: 'Ingénieure Financière', localisation: 'Cotonou', disponible: true, competences: ['Analyse financière', 'Audit', 'Comptabilité'], initiales: 'AH', couleur: '#1e3a5f' },
    { id: '3', nom: 'Me. Patrice Agossou', domaine: 'Droit', fonction: 'Avocat Associé', localisation: 'Porto-Novo', disponible: false, competences: ['Droit des affaires', 'Arbitrage'], initiales: 'PA', couleur: '#c4940a' },
    { id: '4', nom: 'Pr. Célestine Dossou', domaine: 'Éducation', fonction: 'Professeure Titulaire', localisation: 'Abomey-Calavi', disponible: true, competences: ['Mathématiques', 'Recherche'], initiales: 'CD', couleur: '#7c3aed' },
    { id: '5', nom: 'Ing. Romuald Gandonou', domaine: 'BTP', fonction: 'Directeur des Travaux', localisation: 'Cotonou', disponible: false, competences: ['Infrastructure', 'Génie civil'], initiales: 'RG', couleur: '#c2410c' },
    { id: '6', nom: 'Ing. Marcelline Atchade', domaine: 'Technologie', fonction: 'Chef de Projet IT', localisation: 'Cotonou', disponible: true, competences: ['Télécoms', 'Digital', 'Gestion de projet'], initiales: 'MA', couleur: '#0891b2' },
]

const domaines = ['Tous', 'Santé', 'Finance', 'Droit', 'Éducation', 'BTP', 'Technologie', 'Agriculture', 'Politique', 'Autre']
const villages = ['Aguégués Centre', 'Avagbodji', 'Tohouè', 'Dégon', 'Hêtin-Sota', 'Zoungamè', 'Kpinnou', 'Akodéha', 'Gankpétin', 'Vêki']

type MonInscriptionForm = {
    nom: string; prenom: string; telephone: string; email: string
    domaine: string; fonction_actuelle: string; localisation: string
    disponible: boolean; competences: string
}

export default function EspaceCadresPage() {
    const [onglet, setOnglet] = useState<'annuaire' | 'inscription'>('annuaire')

    // Annuaire
    const [recherche, setRecherche] = useState('')
    const [domaineFiltre, setDomaineFiltre] = useState('Tous')
    const [dispoFiltre, setDispoFiltre] = useState(false)

    // Inscription
    const [form, setForm] = useState<MonInscriptionForm>({
        nom: '', prenom: '', telephone: '', email: '',
        domaine: '', fonction_actuelle: '', localisation: '',
        disponible: false, competences: '',
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [erreur, setErreur] = useState('')

    const set = (k: keyof MonInscriptionForm, v: string | boolean) =>
        setForm(f => ({ ...f, [k]: v }))

    const resultats = useMemo(() => CADRES_DEMO.filter(c => {
        const q = recherche.toLowerCase()
        const matchQ = !q || c.nom.toLowerCase().includes(q) || c.domaine.toLowerCase().includes(q) || c.fonction.toLowerCase().includes(q)
        const matchD = domaineFiltre === 'Tous' || c.domaine === domaineFiltre
        const matchDispo = !dispoFiltre || c.disponible
        return matchQ && matchD && matchDispo
    }), [recherche, domaineFiltre, dispoFiltre])

    const handleInscription = async (e: React.FormEvent) => {
        e.preventDefault()
        setErreur('')
        if (!form.nom || !form.prenom || !form.domaine || !form.fonction_actuelle) {
            setErreur('Veuillez remplir les champs obligatoires.')
            return
        }
        setLoading(true)
        try {
            const competencesArr = form.competences.split(',').map(s => s.trim()).filter(Boolean)
            const { error } = await supabase.from('profiles').upsert({
                nom: form.nom,
                prenom: form.prenom,
                telephone: form.telephone || null,
                email: form.email || null,
                domaine: form.domaine,
                fonction_actuelle: form.fonction_actuelle,
                localisation: form.localisation || null,
                disponible: form.disponible,
                competences: competencesArr,
                type: 'cadre',
            })
            if (error) throw error
            setSuccess(true)
        } catch {
            setErreur('Erreur lors de l\'inscription. Veuillez réessayer.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: '#f9fafb' }}>

                {/* ── HERO ──────────────────────────────────── */}
                <div style={{
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    padding: 'clamp(1.75rem, 4vw, 3rem) clamp(1.5rem, 4vw, 3rem) 0',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,25,15,0.88) 0%, rgba(15,45,74,0.82) 45%, rgba(10,35,18,0.78) 100%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* Fil d'ariane */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.25rem' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8125rem' }}>Accueil</Link>
                            <ChevronRight size={13} color="rgba(255,255,255,0.4)" />
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8125rem', fontWeight: 600 }}>Espace Cadres</span>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.75rem', background: 'rgba(110,231,160,0.15)', border: '1px solid rgba(110,231,160,0.3)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, color: '#6ee7a0', marginBottom: '0.875rem' }}>
                            🎓 Base de données des compétences
                        </span>
                        <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 900, color: 'white', lineHeight: 1.2, margin: '0 0 0.625rem' }}>
                            Espace Cadres des Aguégués
                        </h1>
                        <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.65)', margin: '0 0 2rem', maxWidth: '580px' }}>
                            Identifiez, rassemblez et valorisez tous les talents issus de notre commune,
                            où qu&apos;ils se trouvent dans le monde.
                        </p>

                        {/* Stats rapides */}
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            {[
                                { v: `${CADRES_DEMO.length}+`, l: 'Cadres inscrits' },
                                { v: `${CADRES_DEMO.filter(c => c.disponible).length}`, l: 'Disponibles' },
                                { v: `${domaines.length - 1}`, l: 'Domaines' },
                            ].map(({ v, l }) => (
                                <div key={l}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#6ee7a0' }}>{v}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{l}</div>
                                </div>
                            ))}
                        </div>

                        {/* Onglets */}
                        <div style={{ display: 'flex', gap: '0' }}>
                            {([
                                { key: 'annuaire', icon: <Users size={16} />, label: 'Annuaire' },
                                { key: 'inscription', icon: <UserPlus size={16} />, label: 'M\'inscrire' },
                            ] as const).map(({ key, icon, label }) => (
                                <button key={key} onClick={() => setOnglet(key)} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    background: onglet === key ? 'white' : 'transparent',
                                    color: onglet === key ? '#1a5c2a' : 'rgba(255,255,255,0.75)',
                                    border: 'none', cursor: 'pointer',
                                    fontWeight: 700, fontSize: '0.9rem',
                                    borderRadius: '12px 12px 0 0',
                                    transition: 'all 0.2s',
                                    fontFamily: 'inherit',
                                }}>
                                    {icon} {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── CONTENU ───────────────────────────────── */}
                <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)' }}>

                    {/* ════ ONGLET ANNUAIRE ════ */}
                    {onglet === 'annuaire' && (
                        <>
                            {/* Barre recherche + filtres */}
                            <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <div style={{ flex: '1 1 220px', position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input type="text" placeholder="Nom, fonction, domaine…"
                                            value={recherche} onChange={e => setRecherche(e.target.value)}
                                            style={{ width: '100%', padding: '0.6875rem 0.875rem 0.6875rem 2.5rem', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                                    </div>
                                    <select value={domaineFiltre} onChange={e => setDomaineFiltre(e.target.value)}
                                        style={{ padding: '0.6875rem 1rem', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.875rem', color: '#374151', background: 'white', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}>
                                        {domaines.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#374151', whiteSpace: 'nowrap' }}>
                                        <input type="checkbox" checked={dispoFiltre} onChange={e => setDispoFiltre(e.target.checked)} style={{ accentColor: '#1a5c2a', width: '16px', height: '16px' }} />
                                        Disponibles uniquement
                                    </label>
                                    {(recherche || domaineFiltre !== 'Tous' || dispoFiltre) && (
                                        <button onClick={() => { setRecherche(''); setDomaineFiltre('Tous'); setDispoFiltre(false) }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: '8px', color: '#dc2626', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                                            <X size={13} /> Effacer
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Compteur */}
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                                <strong style={{ color: '#111827' }}>{resultats.length}</strong> cadre{resultats.length > 1 ? 's' : ''} trouvé{resultats.length > 1 ? 's' : ''}
                            </p>

                            {resultats.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
                                    <ClipboardList size={40} color="#d1d5db" style={{ margin: '0 auto 1rem' }} />
                                    <p style={{ color: '#6b7280', fontWeight: 600, marginBottom: '0.375rem' }}>Aucun résultat</p>
                                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Modifiez vos critères de recherche.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.125rem' }}>
                                    {resultats.map(c => (
                                        <div key={c.id} style={{
                                            background: 'white', borderRadius: '16px',
                                            border: '1px solid #f3f4f6',
                                            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                                            overflow: 'hidden',
                                            transition: 'transform 0.15s, box-shadow 0.15s',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)' }}
                                        >
                                            {/* Bande colorée */}
                                            <div style={{ height: '4px', background: `linear-gradient(90deg, ${c.couleur}, ${c.couleur}88)` }} />
                                            <div style={{ padding: '1.25rem' }}>
                                                {/* Header carte */}
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '0.875rem' }}>
                                                    <div style={{
                                                        width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                                                        background: `${c.couleur}18`,
                                                        border: `2px solid ${c.couleur}30`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '1rem', fontWeight: 800, color: c.couleur,
                                                    }}>{c.initiales}</div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nom}</div>
                                                        <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.4 }}>{c.fonction}</div>
                                                    </div>
                                                    {/* Dispo badge */}
                                                    <div style={{
                                                        flexShrink: 0, padding: '0.2rem 0.5rem', borderRadius: '999px',
                                                        fontSize: '0.6875rem', fontWeight: 700,
                                                        background: c.disponible ? '#dcf0e4' : '#f3f4f6',
                                                        color: c.disponible ? '#1a5c2a' : '#9ca3af',
                                                    }}>
                                                        {c.disponible ? '● Dispo' : '○ Occupé'}
                                                    </div>
                                                </div>

                                                {/* Infos */}
                                                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#6b7280' }}>
                                                        <Briefcase size={12} color="#9ca3af" /> {c.domaine}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#6b7280' }}>
                                                        <MapPin size={12} color="#9ca3af" /> {c.localisation}
                                                    </span>
                                                </div>

                                                {/* Compétences */}
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                                    {c.competences.slice(0, 3).map(comp => (
                                                        <span key={comp} style={{
                                                            padding: '0.2rem 0.6rem', borderRadius: '6px',
                                                            background: `${c.couleur}12`, color: c.couleur,
                                                            fontSize: '0.7rem', fontWeight: 600,
                                                            border: `1px solid ${c.couleur}25`,
                                                        }}>{comp}</span>
                                                    ))}
                                                </div>

                                                {/* Lien profil */}
                                                <Link href={`/annuaire/cadres/${c.id}`} style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                                                    marginTop: '1rem', padding: '0.5625rem',
                                                    background: '#f9fafb', border: '1.5px solid #e5e7eb',
                                                    borderRadius: '10px', color: '#374151',
                                                    fontWeight: 600, fontSize: '0.8125rem', textDecoration: 'none',
                                                    transition: 'background 0.15s',
                                                }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#dcf0e4'}
                                                    onMouseLeave={e => e.currentTarget.style.background = '#f9fafb'}
                                                >
                                                    Voir le profil →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* CTA inscription */}
                            <div style={{
                                marginTop: '2.5rem', padding: '1.75rem 2rem',
                                background: 'linear-gradient(135deg, #1e3a5f, #1a5c2a)',
                                borderRadius: '18px', display: 'flex', flexWrap: 'wrap',
                                alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                            }}>
                                <div>
                                    <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
                                        Vous êtes originaire des Aguégués ?
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' }}>
                                        Inscrivez-vous pour rejoindre la base de données des compétences.
                                    </div>
                                </div>
                                <button onClick={() => setOnglet('inscription')} style={{
                                    padding: '0.75rem 1.5rem', background: 'white', color: '#1a5c2a',
                                    border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem',
                                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontFamily: 'inherit',
                                }}>
                                    + M&apos;inscrire comme cadre
                                </button>
                            </div>
                        </>
                    )}

                    {/* ════ ONGLET INSCRIPTION ════ */}
                    {onglet === 'inscription' && (
                        success ? (
                            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                                <div style={{
                                    width: '76px', height: '76px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
                                }}>
                                    <CheckCircle size={38} color="white" />
                                </div>
                                <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>
                                    Inscription enregistrée !
                                </h2>
                                <p style={{ color: '#6b7280', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 2rem' }}>
                                    Votre profil a bien été ajouté à la base de données des cadres des Aguégués.
                                    Il sera visible après validation par l&apos;administration.
                                </p>
                                <button onClick={() => { setSuccess(false); setOnglet('annuaire') }} style={{
                                    padding: '0.75rem 1.75rem', background: '#1a5c2a', color: 'white',
                                    border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit',
                                }}>
                                    Voir l&apos;annuaire →
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleInscription}>
                                {erreur && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca', marginBottom: '1.25rem' }}>
                                        <span style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: 500 }}>{erreur}</span>
                                        <button type="button" onClick={() => setErreur('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}><X size={15} /></button>
                                    </div>
                                )}

                                {/* Sect 1 — Identité */}
                                <InscriptionSection num="1" titre="Identité">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <F label="Nom *"><input required value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="AGOSSOU" style={IS} /></F>
                                        <F label="Prénom *"><input required value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Jean-Baptiste" style={IS} /></F>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <F label="Téléphone"><input value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="+229 97 000 000" type="tel" style={IS} /></F>
                                        <F label="Email"><input value={form.email} onChange={e => set('email', e.target.value)} placeholder="jean@example.com" type="email" style={IS} /></F>
                                    </div>
                                </InscriptionSection>

                                {/* Sect 2 — Profil professionnel */}
                                <InscriptionSection num="2" titre="Profil professionnel">
                                    <F label="Domaine d'activité *">
                                        <select required value={form.domaine} onChange={e => set('domaine', e.target.value)} style={IS}>
                                            <option value="">— Sélectionnez —</option>
                                            {domaines.filter(d => d !== 'Tous').map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </F>
                                    <F label="Fonction actuelle *"><input required value={form.fonction_actuelle} onChange={e => set('fonction_actuelle', e.target.value)} placeholder="Ex : Directeur médical, Avocat, Ingénieur…" style={IS} /></F>
                                    <F label="Compétences clés (séparées par des virgules)">
                                        <input value={form.competences} onChange={e => set('competences', e.target.value)} placeholder="Ex : Chirurgie, Santé publique, Gestion de projet" style={IS} />
                                    </F>
                                </InscriptionSection>

                                {/* Sect 3 — Localisation & disponibilité */}
                                <InscriptionSection num="3" titre="Localisation & disponibilité">
                                    <F label="Village / quartier d'origine">
                                        <select value={form.localisation} onChange={e => set('localisation', e.target.value)} style={IS}>
                                            <option value="">— Sélectionnez —</option>
                                            {villages.map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </F>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '1rem', borderRadius: '12px', border: `2px solid ${form.disponible ? '#1a5c2a' : '#e5e7eb'}`, background: form.disponible ? '#dcf0e4' : 'white', transition: 'all 0.15s' }}>
                                        <input type="checkbox" checked={form.disponible} onChange={e => set('disponible', e.target.checked)} style={{ accentColor: '#1a5c2a', width: '18px', height: '18px' }} />
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>Je suis disponible pour contribuer</div>
                                            <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Conseil, mentorat, expertise, action terrain…</div>
                                        </div>
                                    </label>
                                </InscriptionSection>

                                <button type="submit" disabled={loading} style={{
                                    width: '100%', padding: '0.9375rem',
                                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #1e3a5f, #1a5c2a)',
                                    color: 'white', border: 'none', borderRadius: '14px',
                                    fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                                    boxShadow: loading ? 'none' : '0 4px 16px rgba(26,92,42,0.3)',
                                    fontFamily: 'inherit',
                                }}>
                                    <Send size={18} />
                                    {loading ? 'Inscription en cours…' : 'Enregistrer mon profil'}
                                </button>
                                <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#9ca3af', marginTop: '1rem' }}>
                                    🔒 Informations confidentielles — visible après validation par l&apos;administration.
                                </p>
                            </form>
                        )
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}

// Helpers
function InscriptionSection({ num, titre, children }: { num: string; titre: string; children: React.ReactNode }) {
    return (
        <div style={{ background: 'white', borderRadius: '18px', padding: 'clamp(1.25rem, 3vw, 1.75rem)', marginBottom: '1.25rem', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a5f, #1a5c2a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>{num}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{titre}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{children}</div>
        </div>
    )
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>{label}</label>
            {children}
        </div>
    )
}

const IS: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem',
    borderRadius: '10px', border: '1.5px solid #e5e7eb',
    fontSize: '0.9375rem', color: '#111827', background: 'white',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}
