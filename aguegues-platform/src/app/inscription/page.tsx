'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Award, TrendingUp, ArrowRight, ArrowLeft,
    Eye, EyeOff, CheckCircle, User, Mail,
    Lock, Phone, Globe, Shield
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Etape = 1 | 2 | 3
type TypeProfil = 'cadre' | 'jeune' | null

export default function InscriptionPage() {
    const [etape, setEtape] = useState<Etape>(1)
    const [typeProfil, setTypeProfil] = useState<TypeProfil>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [serverError, setServerError] = useState('')
    const [form, setForm] = useState({
        prenom: '', nom: '', email: '', telephone: '',
        password: '', confirm: '', ville: '', pays: 'Bénin',
        cgu: false,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
        if (serverError) setServerError('')
    }

    const validateEtape2 = () => {
        const errs: Record<string, string> = {}
        if (!form.prenom.trim()) errs.prenom = 'Le prénom est requis'
        if (!form.nom.trim()) errs.nom = 'Le nom est requis'
        if (!form.email.trim()) errs.email = 'L\'email est requis'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email invalide'
        if (!form.password) errs.password = 'Le mot de passe est requis'
        else if (form.password.length < 8) errs.password = 'Minimum 8 caractères'
        if (form.password !== form.confirm) errs.confirm = 'Les mots de passe ne correspondent pas'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.cgu) { setErrors({ cgu: 'Vous devez accepter les CGU' }); return }
        setLoading(true)
        setServerError('')

        const supabase = createClient()

        // 1. Créer le compte auth Supabase
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
        })

        if (signUpError) {
            setLoading(false)
            if (signUpError.message.includes('already registered')) {
                setServerError('Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email.')
            } else {
                setServerError('Une erreur est survenue. Réessayez dans quelques instants.')
            }
            return
        }

        const userId = authData.user?.id
        if (userId) {
            // 2. Créer le profil dans la table profiles
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: userId,
                    type: typeProfil,
                    statut: 'en_attente',
                    nom: form.nom,
                    prenom: form.prenom,
                    telephone: form.telephone || null,
                    ville_residence: form.ville || null,
                    pays_residence: form.pays,
                }])

            if (profileError) {
                console.error('Erreur création profil:', profileError)
            }

            // 3. Créer l'entrée dans la table spécifique (cadre ou jeune)
            if (typeProfil === 'cadre') {
                await supabase.from('profiles_cadres').insert([{ id: userId }])
            } else {
                await supabase.from('profiles_jeunes').insert([{ id: userId }])
            }
        }

        setLoading(false)
        setSuccess(true)
    }

    const PassStrength = ({ password }: { password: string }) => {
        const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter(r => r.test(password)).length
        const labels = ['', 'Faible', 'Moyen', 'Fort', 'Très fort']
        const colors = ['', '#ef4444', '#f59e0b', '#10b981', '#1a6b3c']
        if (!password) return null
        return (
            <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= score ? colors[score] : 'var(--color-gray-200)', transition: 'background 0.3s' }} />
                    ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: colors[score], fontWeight: 600 }}>{labels[score]}</span>
            </div>
        )
    }

    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-gray-50)', padding: '2rem 1rem' }}>
                <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', padding: 'clamp(2rem, 5vw, 3rem)', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcf0e4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <CheckCircle size={40} color="var(--color-primary)" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-gray-900)', margin: '0 0 0.75rem' }}>
                        Compte créé ! 🎉
                    </h1>
                    <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
                        Bienvenue <strong>{form.prenom} {form.nom}</strong> !
                    </p>
                    <p style={{ color: 'var(--color-gray-400)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                        Un email de confirmation a été envoyé à <strong>{form.email}</strong>.
                        Vérifiez votre boîte mail pour activer votre compte avant de vous connecter.
                    </p>
                    <Link href="/connexion" className="btn btn-primary btn-full">
                        Se connecter maintenant
                    </Link>
                    <Link href="/" style={{ display: 'block', marginTop: '1rem', color: 'var(--color-gray-400)', fontSize: '0.875rem', textDecoration: 'none' }}>
                        Retour à l&apos;accueil
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-gray-50)', display: 'flex', flexDirection: 'column' }}>

            {/* TOPBAR */}
            <div style={{ background: 'white', borderBottom: '1px solid var(--color-gray-100)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Globe size={20} color="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-gray-900)' }}>AGANER</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
                    <span>Déjà inscrit ?</span>
                    <Link href="/connexion" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>Se connecter</Link>
                </div>
            </div>

            {/* INDICATEUR D'ÉTAPES */}
            <div style={{ background: 'white', borderBottom: '1px solid var(--color-gray-100)', padding: '1rem 1.5rem' }}>
                <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0' }}>
                    {[
                        { n: 1, label: 'Type de profil' },
                        { n: 2, label: 'Informations' },
                        { n: 3, label: 'Finalisation' },
                    ].map(({ n, label }, i) => (
                        <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: etape >= n ? 'var(--color-primary)' : 'var(--color-gray-200)',
                                    color: etape >= n ? 'white' : 'var(--color-gray-500)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 800, fontSize: '0.875rem', transition: 'all 0.3s',
                                    boxShadow: etape === n ? '0 0 0 4px rgba(26,107,60,0.15)' : 'none',
                                }}>
                                    {etape > n ? <CheckCircle size={18} /> : n}
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: etape === n ? 700 : 500, color: etape >= n ? 'var(--color-primary)' : 'var(--color-gray-400)', whiteSpace: 'nowrap' }}>
                                    {label}
                                </span>
                            </div>
                            {i < 2 && (
                                <div style={{ flex: 1, height: '2px', background: etape > n ? 'var(--color-primary)' : 'var(--color-gray-200)', margin: '0 0.5rem', marginBottom: '18px', transition: 'background 0.3s' }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* CONTENU */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '100%', maxWidth: etape === 1 ? '680px' : '520px' }}>

                    {/* ÉTAPE 1 : CHOIX DU TYPE */}
                    {etape === 1 && (
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: 'var(--color-gray-900)', margin: '0 0 0.625rem' }}>
                                    Qui êtes-vous ? 👤
                                </h1>
                                <p style={{ color: 'var(--color-gray-500)', fontSize: '1rem', lineHeight: 1.6 }}>
                                    Choisissez le type de profil qui correspond à votre situation.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                                <button onClick={() => setTypeProfil('cadre')} style={{
                                    padding: '2rem 1.5rem', borderRadius: '20px', cursor: 'pointer', textAlign: 'left',
                                    background: typeProfil === 'cadre' ? 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)' : 'white',
                                    border: typeProfil === 'cadre' ? '3px solid var(--color-primary)' : '3px solid var(--color-gray-200)',
                                    boxShadow: typeProfil === 'cadre' ? '0 8px 24px rgba(26,107,60,0.25)' : 'var(--shadow-card)',
                                    transition: 'all 0.25s', fontFamily: 'inherit',
                                    transform: typeProfil === 'cadre' ? 'scale(1.02)' : 'scale(1)',
                                }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: typeProfil === 'cadre' ? 'rgba(255,255,255,0.2)' : 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                        <Award size={28} color={typeProfil === 'cadre' ? 'white' : 'var(--color-primary)'} />
                                    </div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: typeProfil === 'cadre' ? 'white' : 'var(--color-gray-900)', margin: '0 0 0.625rem' }}>Haut Cadre</h2>
                                    <p style={{ fontSize: '0.9rem', color: typeProfil === 'cadre' ? 'rgba(255,255,255,0.82)' : 'var(--color-gray-500)', lineHeight: 1.65, margin: '0 0 1.25rem' }}>
                                        Vous êtes un professionnel confirmé : médecin, avocat, ingénieur, magistrat...
                                    </p>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {['Diplôme Bac+3 minimum', 'Expérience professionnelle', 'Secteur d\'activité défini'].map(item => (
                                            <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: typeProfil === 'cadre' ? 'rgba(255,255,255,0.9)' : 'var(--color-gray-600)' }}>
                                                <CheckCircle size={14} color={typeProfil === 'cadre' ? 'rgba(255,255,255,0.9)' : 'var(--color-primary)'} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    {typeProfil === 'cadre' && (
                                        <div style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>
                                            <CheckCircle size={16} /> Sélectionné
                                        </div>
                                    )}
                                </button>

                                <button onClick={() => setTypeProfil('jeune')} style={{
                                    padding: '2rem 1.5rem', borderRadius: '20px', cursor: 'pointer', textAlign: 'left',
                                    background: typeProfil === 'jeune' ? 'linear-gradient(135deg, var(--color-secondary) 0%, #2563eb 100%)' : 'white',
                                    border: typeProfil === 'jeune' ? '3px solid var(--color-secondary)' : '3px solid var(--color-gray-200)',
                                    boxShadow: typeProfil === 'jeune' ? '0 8px 24px rgba(30,58,95,0.25)' : 'var(--shadow-card)',
                                    transition: 'all 0.25s', fontFamily: 'inherit',
                                    transform: typeProfil === 'jeune' ? 'scale(1.02)' : 'scale(1)',
                                }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: typeProfil === 'jeune' ? 'rgba(255,255,255,0.2)' : '#eff4fb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                        <TrendingUp size={28} color={typeProfil === 'jeune' ? 'white' : 'var(--color-secondary)'} />
                                    </div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: typeProfil === 'jeune' ? 'white' : 'var(--color-gray-900)', margin: '0 0 0.625rem' }}>Jeune Talent</h2>
                                    <p style={{ fontSize: '0.9rem', color: typeProfil === 'jeune' ? 'rgba(255,255,255,0.82)' : 'var(--color-gray-500)', lineHeight: 1.65, margin: '0 0 1.25rem' }}>
                                        Vous êtes étudiant, jeune diplômé, en recherche d&apos;emploi ou en début de carrière.
                                    </p>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {['18 à 35 ans', 'Diplôme BEPC minimum', 'En formation ou actif'].map(item => (
                                            <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: typeProfil === 'jeune' ? 'rgba(255,255,255,0.9)' : 'var(--color-gray-600)' }}>
                                                <CheckCircle size={14} color={typeProfil === 'jeune' ? 'rgba(255,255,255,0.9)' : 'var(--color-secondary)'} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    {typeProfil === 'jeune' && (
                                        <div style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>
                                            <CheckCircle size={16} /> Sélectionné
                                        </div>
                                    )}
                                </button>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <button onClick={() => typeProfil && setEtape(2)} disabled={!typeProfil} className="btn btn-primary btn-lg" style={{ minWidth: '220px', opacity: typeProfil ? 1 : 0.4 }}>
                                    Continuer <ArrowRight size={18} />
                                </button>
                            </div>
                            <p style={{ textAlign: 'center', color: 'var(--color-gray-400)', fontSize: '0.875rem', marginTop: '1.5rem' }}>
                                Inscription <strong>100% gratuite</strong> · Données sécurisées · Conforme APDP
                            </p>
                        </div>
                    )}

                    {/* ÉTAPE 2 : INFORMATIONS */}
                    {etape === 2 && (
                        <div>
                            <button onClick={() => setEtape(1)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-500)', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit', marginBottom: '1.5rem', padding: 0 }}>
                                <ArrowLeft size={16} /> Retour
                            </button>
                            <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', padding: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                                <div style={{ marginBottom: '1.75rem' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', background: typeProfil === 'cadre' ? 'var(--color-primary-50)' : '#eff4fb', borderRadius: '999px', marginBottom: '0.875rem' }}>
                                        {typeProfil === 'cadre' ? <Award size={14} color="var(--color-primary)" /> : <TrendingUp size={14} color="var(--color-secondary)" />}
                                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: typeProfil === 'cadre' ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
                                            {typeProfil === 'cadre' ? 'Haut Cadre' : 'Jeune Talent'}
                                        </span>
                                    </div>
                                    <h1 style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--color-gray-900)', margin: 0 }}>Vos informations</h1>
                                </div>

                                <form onSubmit={(e) => { e.preventDefault(); if (validateEtape2()) setEtape(3) }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.125rem', marginBottom: '1.125rem' }}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="prenom">Prénom *</label>
                                            <div style={{ position: 'relative' }}>
                                                <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                                                <input id="prenom" name="prenom" type="text" className={`form-input ${errors.prenom ? 'form-input-error' : ''}`} style={{ paddingLeft: '2.5rem' }} placeholder="Jean" value={form.prenom} onChange={handleChange} />
                                            </div>
                                            {errors.prenom && <p className="form-error">{errors.prenom}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="nom">Nom *</label>
                                            <div style={{ position: 'relative' }}>
                                                <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                                                <input id="nom" name="nom" type="text" className={`form-input ${errors.nom ? 'form-input-error' : ''}`} style={{ paddingLeft: '2.5rem' }} placeholder="Akoué" value={form.nom} onChange={handleChange} />
                                            </div>
                                            {errors.nom && <p className="form-error">{errors.nom}</p>}
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1.125rem' }}>
                                        <label className="form-label" htmlFor="email">Adresse email *</label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                                            <input id="email" name="email" type="email" className={`form-input ${errors.email ? 'form-input-error' : ''}`} style={{ paddingLeft: '2.5rem' }} placeholder="votre@email.com" value={form.email} onChange={handleChange} />
                                        </div>
                                        {errors.email && <p className="form-error">{errors.email}</p>}
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1.125rem' }}>
                                        <label className="form-label" htmlFor="telephone">Téléphone (optionnel)</label>
                                        <div style={{ position: 'relative' }}>
                                            <Phone size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                                            <input id="telephone" name="telephone" type="tel" className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="+229 XX XX XX XX" value={form.telephone} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.125rem', marginBottom: '1.125rem' }}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="ville">Ville de résidence</label>
                                            <input id="ville" name="ville" type="text" className="form-input" placeholder="Cotonou" value={form.ville} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="pays">Pays</label>
                                            <select id="pays" name="pays" className="form-select" value={form.pays} onChange={handleChange}>
                                                {['Bénin', 'France', 'Canada', 'Côte d\'Ivoire', 'Sénégal', 'Togo', 'Ghana', 'Nigeria', 'Autre'].map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1.125rem' }}>
                                        <label className="form-label" htmlFor="password">Mot de passe *</label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                                            <input id="password" name="password" type={showPassword ? 'text' : 'password'} className={`form-input ${errors.password ? 'form-input-error' : ''}`} style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} placeholder="Minimum 8 caractères" value={form.password} onChange={handleChange} />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', padding: 0, display: 'flex' }}>
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        <PassStrength password={form.password} />
                                        {errors.password && <p className="form-error">{errors.password}</p>}
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                                        <label className="form-label" htmlFor="confirm">Confirmer le mot de passe *</label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                                            <input id="confirm" name="confirm" type={showConfirm ? 'text' : 'password'} className={`form-input ${errors.confirm ? 'form-input-error' : ''}`} style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} placeholder="Répétez le mot de passe" value={form.confirm} onChange={handleChange} />
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', padding: 0, display: 'flex' }}>
                                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {form.confirm && form.password === form.confirm && (
                                            <p style={{ color: 'var(--color-primary)', fontSize: '0.8125rem', marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <CheckCircle size={13} /> Mots de passe identiques
                                            </p>
                                        )}
                                        {errors.confirm && <p className="form-error">{errors.confirm}</p>}
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-full btn-lg">
                                        Continuer <ArrowRight size={18} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 3 : FINALISATION */}
                    {etape === 3 && (
                        <div>
                            <button onClick={() => setEtape(2)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-500)', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit', marginBottom: '1.5rem', padding: 0 }}>
                                <ArrowLeft size={16} /> Retour
                            </button>
                            <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', padding: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                                <h1 style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--color-gray-900)', margin: '0 0 0.5rem' }}>
                                    Vérification finale ✅
                                </h1>
                                <p style={{ color: 'var(--color-gray-500)', marginBottom: '1.75rem' }}>Confirmez vos informations avant de créer votre compte.</p>

                                <div style={{ background: 'var(--color-gray-50)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.75rem' }}>
                                    {[
                                        { label: 'Type', value: typeProfil === 'cadre' ? '🏆 Haut Cadre' : '🎯 Jeune Talent' },
                                        { label: 'Nom complet', value: `${form.prenom} ${form.nom}` },
                                        { label: 'Email', value: form.email },
                                        ...(form.telephone ? [{ label: 'Téléphone', value: form.telephone }] : []),
                                        ...(form.ville ? [{ label: 'Ville', value: `${form.ville}, ${form.pays}` }] : [{ label: 'Pays', value: form.pays }]),
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid var(--color-gray-200)', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-400)', fontWeight: 600 }}>{label}</span>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-800)', fontWeight: 500 }}>{value}</span>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', marginBottom: '1rem', padding: '1rem', background: form.cgu ? 'var(--color-primary-50)' : 'var(--color-gray-50)', borderRadius: '12px', border: `2px solid ${form.cgu ? 'var(--color-primary-200)' : 'var(--color-gray-200)'}`, transition: 'all 0.2s' }}>
                                        <input type="checkbox" name="cgu" checked={form.cgu} onChange={handleChange} style={{ marginTop: '2px', width: '18px', height: '18px', accentColor: 'var(--color-primary)', flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                                            J&apos;accepte les{' '}
                                            <Link href="#" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Conditions Générales d&apos;Utilisation</Link>{' '}
                                            et la{' '}
                                            <Link href="/confidentialite" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Politique de Confidentialité</Link>{' '}
                                            d&apos;AGANER.
                                        </span>
                                    </label>
                                    {errors.cgu && <p className="form-error" style={{ marginBottom: '1rem' }}>{errors.cgu}</p>}

                                    {serverError && (
                                        <div style={{ padding: '0.875rem 1rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.875rem', color: '#dc2626', lineHeight: 1.5 }}>
                                            {serverError}
                                        </div>
                                    )}

                                    <div style={{ background: '#eff4fb', borderRadius: '12px', padding: '0.875rem 1rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                                        <Shield size={18} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '1px' }} />
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-600)', lineHeight: 1.6, margin: 0 }}>
                                            Vos données sont protégées et conformes à la loi béninoise (APDP).
                                            Votre profil sera validé par notre équipe avant publication.
                                        </p>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                                        {loading ? (
                                            <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Création du compte…</>
                                        ) : (
                                            <><CheckCircle size={18} /> Créer mon compte gratuitement</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
