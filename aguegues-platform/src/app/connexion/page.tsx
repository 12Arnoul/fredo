'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Eye, EyeOff, Globe, Mail, Lock,
    ArrowRight, CheckCircle, Shield, AlertCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Composant interne qui utilise useSearchParams — doit être dans Suspense
function ConnexionForm() {
    const [form, setForm] = useState({ email: '', password: '', remember: false })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        if (error) setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.email || !form.password) { setError('Veuillez remplir tous les champs.'); return }
        setLoading(true)
        setError('')

        const supabase = createClient()
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        })

        setLoading(false)

        if (authError) {
            if (authError.message.includes('Invalid login credentials')) {
                setError('Email ou mot de passe incorrect. Vérifiez vos identifiants.')
            } else if (authError.message.includes('Email not confirmed')) {
                setError('Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte mail.')
            } else {
                setError('Une erreur est survenue. Réessayez dans quelques instants.')
            }
            return
        }

        setSuccess(true)
        const redirect = searchParams.get('redirect') || '/dashboard'
        setTimeout(() => router.push(redirect), 1000)
    }

    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-gray-50)', padding: '2rem 1rem' }}>
                <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', padding: 'clamp(2rem, 5vw, 3rem)', maxWidth: '440px', width: '100%', textAlign: 'center' }}>
                    <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: '#dcf0e4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <CheckCircle size={38} color="var(--color-primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--color-gray-900)', margin: '0 0 0.625rem' }}>
                        Connexion réussie ! 👋
                    </h2>
                    <p style={{ color: 'var(--color-gray-500)', marginBottom: '2rem', lineHeight: 1.6 }}>
                        Bienvenue sur la plateforme AGANER. Redirection vers votre tableau de bord…
                    </p>
                    <Link href="/dashboard" className="btn btn-primary btn-full">
                        Accéder à mon espace <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr', background: 'var(--color-gray-50)' }} className="connexion-layout">
            {/* PANNEAU GAUCHE */}
            <div className="connexion-side" style={{
                background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-secondary) 100%)',
                padding: '3rem 2.5rem', display: 'none', flexDirection: 'column',
                justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Globe size={22} color="white" />
                        </div>
                        <span style={{ fontWeight: 900, fontSize: '1.25rem', color: 'white' }}>AGANER</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.875rem, 3vw, 2.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                        Bienvenue sur la plateforme des talents d&apos;Aguégués
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                        Connectez-vous pour accéder à votre espace personnel et gérer votre profil dans l&apos;annuaire.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { emoji: '👤', texte: 'Gérez votre profil public' },
                            { emoji: '🔍', texte: 'Parcourez tous les annuaires' },
                            { emoji: '📬', texte: 'Soyez visible des recruteurs' },
                            { emoji: '📢', texte: 'Recevez les dernières actualités' },
                        ].map(({ emoji, texte }) => (
                            <div key={texte} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                <span style={{ fontSize: '1.375rem' }}>{emoji}</span>
                                <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, fontSize: '0.9375rem' }}>{texte}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {['1 200+ talents', 'Gratuit', 'APDP conforme'].map((tag) => (
                            <span key={tag} style={{ padding: '0.375rem 0.875rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '999px', color: 'rgba(255,255,255,0.85)', fontSize: '0.8125rem', fontWeight: 600 }}>{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* PANNEAU DROIT */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', flexDirection: 'column' }}>
                <div style={{ marginBottom: '2rem', width: '100%', maxWidth: '420px' }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Globe size={20} color="white" />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-gray-900)' }}>AGANER</span>
                    </Link>
                </div>

                <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', padding: 'clamp(1.75rem, 5vw, 2.75rem)', width: '100%', maxWidth: '420px' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-gray-900)', margin: '0 0 0.375rem' }}>Connexion</h1>
                        <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9375rem' }}>Entrez vos identifiants pour accéder à votre espace.</p>
                    </div>

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', marginBottom: '1.25rem' }}>
                            <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '1px' }} />
                            <p style={{ fontSize: '0.875rem', color: '#dc2626', margin: 0, lineHeight: 1.5 }}>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.125rem' }}>
                            <label className="form-label" htmlFor="email">Adresse email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                                <input id="email" name="email" type="email" autoComplete="email" className="form-input"
                                    style={{ paddingLeft: '2.5rem' }} placeholder="votre@email.com"
                                    value={form.email} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                                <label className="form-label" htmlFor="password" style={{ margin: 0 }}>Mot de passe</label>
                                <Link href="/mot-de-passe-oublie" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                                <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                                    className="form-input" style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                                    placeholder="Votre mot de passe" value={form.password} onChange={handleChange} required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', padding: 0, display: 'flex' }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', marginBottom: '1.75rem' }}>
                            <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }} />
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', fontWeight: 500 }}>Se souvenir de moi</span>
                        </label>

                        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                            {loading ? (
                                <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Connexion en cours…</>
                            ) : (
                                <>Se connecter <ArrowRight size={18} /></>
                            )}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
                            <Shield size={14} color="var(--color-gray-400)" />
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', margin: 0 }}>
                                Connexion sécurisée · Conforme APDP Bénin
                            </p>
                        </div>
                    </form>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9375rem' }}>
                        Pas encore de compte ?{' '}
                        <Link href="/inscription" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
                            S&apos;inscrire gratuitement
                        </Link>
                    </p>
                </div>
                <Link href="/" style={{ marginTop: '1rem', color: 'var(--color-gray-400)', fontSize: '0.8125rem', textDecoration: 'none' }}>
                    ← Retour à l&apos;accueil
                </Link>
            </div>

            <style>{`
        @media (min-width: 900px) {
          .connexion-layout { grid-template-columns: 1fr 1fr !important; }
          .connexion-side { display: flex !important; }
        }
      `}</style>
        </div>
    )
}

// Export principal avec Suspense pour useSearchParams
export default function ConnexionPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-gray-50)' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        }>
            <ConnexionForm />
        </Suspense>
    )
}
