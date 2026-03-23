'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    User, Settings, Lock, Bell, LogOut, Edit3, Save, X,
    Eye, EyeOff, CheckCircle, AlertCircle, Globe2, Shield, Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ProfileComplet } from '@/lib/supabase/types'

type Onglet = 'profil' | 'visibilite' | 'securite' | 'notifications'

export default function DashboardPage() {
    const [onglet, setOnglet] = useState<Onglet>('profil')
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profile, setProfile] = useState<ProfileComplet | null>(null)
    const [saveMsg, setSaveMsg] = useState<'success' | 'error' | null>(null)
    const [form, setForm] = useState({
        nom: '', prenom: '', telephone: '', ville_residence: '',
        pays_residence: 'Bénin', bio: '', linkedin_url: '',
    })
    const router = useRouter()

    useEffect(() => {
        chargerProfil()
    }, [])

    const chargerProfil = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/connexion'); return }

        const { data } = await supabase
            .from('profiles')
            .select('*, profiles_cadres(*), profiles_jeunes(*)')
            .eq('id', user.id)
            .single()

        setProfile(data)
        if (data) {
            setForm({
                nom: data.nom || '',
                prenom: data.prenom || '',
                telephone: data.telephone || '',
                ville_residence: data.ville_residence || '',
                pays_residence: data.pays_residence || 'Bénin',
                bio: data.bio || '',
                linkedin_url: data.linkedin_url || '',
            })
        }
        setLoading(false)
    }

    const handleSave = async () => {
        if (!profile) return
        setSaving(true)
        const supabase = createClient()
        const { error } = await supabase
            .from('profiles')
            .update({ ...form, updated_at: new Date().toISOString() })
            .eq('id', profile.id)

        setSaving(false)
        if (error) {
            setSaveMsg('error')
        } else {
            setSaveMsg('success')
            setEditing(false)
            setProfile(prev => prev ? { ...prev, ...form } : null)
        }
        setTimeout(() => setSaveMsg(null), 3500)
    }

    const handleDeconnexion = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
    }

    const statutLabels: Record<string, { label: string; color: string; bg: string }> = {
        en_attente: { label: 'En attente de validation', color: '#d97706', bg: '#fef3c7' },
        valide: { label: 'Profil validé ✓', color: '#059669', bg: '#d1fae5' },
        suspendu: { label: 'Profil suspendu', color: '#dc2626', bg: '#fee2e2' },
    }
    const statut = profile ? (statutLabels[profile.statut] || statutLabels.en_attente) : statutLabels.en_attente

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-gray-50)' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 size={40} color="var(--color-primary)" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--color-gray-500)', fontWeight: 500 }}>Chargement de votre tableau de bord…</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>

            {/* HEADER */}
            <div style={{ background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)', padding: '1rem 1.5rem' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Globe2 size={28} color="white" />
                        <div>
                            <div style={{ fontWeight: 900, fontSize: '1.125rem', color: 'white' }}>AGANER</div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Mon Espace</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '10px', color: 'white', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
                            <Shield size={16} /> Panel Admin
                        </Link>
                        <button onClick={handleDeconnexion} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit' }}>
                            <LogOut size={16} /> Déconnexion
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.75rem' }} className="dashboard-layout">

                {/* SIDEBAR */}
                <div>
                    {/* Carte profil */}
                    <div style={{ background: 'white', borderRadius: '18px', boxShadow: 'var(--shadow-card)', padding: '1.5rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>
                            {profile ? `${profile.prenom[0]}${profile.nom[0]}` : '?'}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--color-gray-900)' }}>
                            {profile ? `${profile.prenom} ${profile.nom}` : 'Chargement…'}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>
                            {profile?.type === 'cadre' ? '🏆 Haut Cadre' : '🎯 Jeune Talent'}
                        </div>
                        <div style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.3rem 0.875rem', borderRadius: '999px', background: statut.bg, color: statut.color, fontSize: '0.75rem', fontWeight: 700 }}>
                            {statut.label}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div style={{ background: 'white', borderRadius: '18px', boxShadow: 'var(--shadow-card)', padding: '0.75rem', overflow: 'hidden' }}>
                        {[
                            { id: 'profil' as Onglet, icon: User, label: 'Mon Profil' },
                            { id: 'visibilite' as Onglet, icon: Eye, label: 'Visibilité' },
                            { id: 'securite' as Onglet, icon: Lock, label: 'Sécurité' },
                            { id: 'notifications' as Onglet, icon: Bell, label: 'Notifications' },
                        ].map(({ id, icon: Icon, label }) => (
                            <button key={id} onClick={() => setOnglet(id)} style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.75rem 1rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                background: onglet === id ? 'var(--color-primary-50)' : 'transparent',
                                color: onglet === id ? 'var(--color-primary)' : 'var(--color-gray-600)',
                                fontWeight: onglet === id ? 700 : 500, fontSize: '0.9375rem',
                                fontFamily: 'inherit', marginBottom: '2px', textAlign: 'left',
                                transition: 'all 0.2s',
                            }}>
                                <Icon size={18} /> {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CONTENU PRINCIPAL */}
                <div>
                    {/* Messages save */}
                    {saveMsg && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', marginBottom: '1rem', borderRadius: '12px', background: saveMsg === 'success' ? '#d1fae5' : '#fee2e2', color: saveMsg === 'success' ? '#059669' : '#dc2626', fontWeight: 600, fontSize: '0.875rem' }}>
                            {saveMsg === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {saveMsg === 'success' ? 'Profil mis à jour avec succès !' : 'Erreur lors de la sauvegarde. Réessayez.'}
                        </div>
                    )}

                    {/* ONGLET : PROFIL */}
                    {onglet === 'profil' && (
                        <div style={{ background: 'white', borderRadius: '18px', boxShadow: 'var(--shadow-card)', padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-gray-900)', margin: 0 }}>Mon Profil</h2>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {editing ? (
                                        <>
                                            <button onClick={() => setEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--color-gray-300)', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit', color: 'var(--color-gray-600)' }}>
                                                <X size={16} /> Annuler
                                            </button>
                                            <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1.125rem', borderRadius: '10px', border: 'none', background: 'var(--color-primary)', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'inherit' }}>
                                                {saving ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Sauvegarde…</> : <><Save size={15} /> Sauvegarder</>}
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1.125rem', borderRadius: '10px', border: '1px solid var(--color-gray-200)', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit', color: 'var(--color-gray-700)' }}>
                                            <Edit3 size={16} /> Modifier
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.125rem' }}>
                                {[
                                    { label: 'Prénom', key: 'prenom', placeholder: 'Jean' },
                                    { label: 'Nom', key: 'nom', placeholder: 'Akoué' },
                                    { label: 'Téléphone', key: 'telephone', placeholder: '+229 XX XX XX XX' },
                                    { label: 'Ville de résidence', key: 'ville_residence', placeholder: 'Cotonou' },
                                    { label: 'Pays', key: 'pays_residence', placeholder: 'Bénin' },
                                    { label: 'LinkedIn', key: 'linkedin_url', placeholder: 'https://linkedin.com/in/...' },
                                ].map(({ label, key, placeholder }) => (
                                    <div key={key} className="form-group">
                                        <label className="form-label">{label}</label>
                                        {editing ? (
                                            <input type="text" className="form-input" placeholder={placeholder}
                                                value={form[key as keyof typeof form] as string}
                                                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} />
                                        ) : (
                                            <div style={{ padding: '0.7rem 0.875rem', background: 'var(--color-gray-50)', borderRadius: '10px', color: 'var(--color-gray-700)', fontSize: '0.9375rem', minHeight: '44px' }}>
                                                {form[key as keyof typeof form] || <span style={{ color: 'var(--color-gray-400)', fontStyle: 'italic' }}>Non renseigné</span>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '1.125rem' }} className="form-group">
                                <label className="form-label">Biographie / Présentation</label>
                                {editing ? (
                                    <textarea className="form-textarea" placeholder="Parlez de vous, votre expertise, vos projets…"
                                        style={{ minHeight: '120px' }} value={form.bio}
                                        onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))} />
                                ) : (
                                    <div style={{ padding: '0.875rem', background: 'var(--color-gray-50)', borderRadius: '10px', color: 'var(--color-gray-700)', fontSize: '0.9375rem', lineHeight: 1.65, minHeight: '80px' }}>
                                        {form.bio || <span style={{ color: 'var(--color-gray-400)', fontStyle: 'italic' }}>Aucune biographie renseignée</span>}
                                    </div>
                                )}
                            </div>

                            {profile?.statut === 'en_attente' && (
                                <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fed7aa', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '1px' }} />
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Profil en attente de validation</div>
                                        <div style={{ fontSize: '0.8125rem', color: '#78350f', lineHeight: 1.6 }}>Notre équipe va vérifier votre profil avant de le publier dans l&apos;annuaire. Ce processus prend généralement 1 à 3 jours ouvrés.</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ONGLET : VISIBILITÉ */}
                    {onglet === 'visibilite' && (
                        <div style={{ background: 'white', borderRadius: '18px', boxShadow: 'var(--shadow-card)', padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-gray-900)', margin: '0 0 1.5rem' }}>Paramètres de visibilité</h2>
                            <p style={{ color: 'var(--color-gray-500)', marginBottom: '1.5rem', lineHeight: 1.65 }}>
                                Contrôlez quelles informations sont visibles par les autres utilisateurs dans l&apos;annuaire.
                            </p>
                            {[
                                { label: 'Afficher mon numéro de téléphone', desc: 'Votre téléphone sera visible sur votre fiche publique.' },
                                { label: 'Afficher mon email', desc: 'Votre adresse email sera visible sur votre fiche publique.' },
                                { label: 'Apparaître dans les résultats de recherche', desc: 'Votre profil sera indexé dans l\'annuaire.' },
                                ...(profile?.type === 'jeune' ? [
                                    { label: 'Ouvert aux opportunités professionnelles', desc: 'Les recruteurs pourront vous contacter.' },
                                    { label: 'CV disponible publiquement', desc: 'Les visiteurs pourront télécharger votre CV.' },
                                ] : [
                                    { label: 'Afficher mon employeur', desc: 'Votre entreprise/institution sera visible publiquement.' },
                                ]),
                            ].map(({ label, desc }, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--color-gray-100)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--color-gray-800)', fontSize: '0.9375rem' }}>{label}</div>
                                        <div style={{ color: 'var(--color-gray-400)', fontSize: '0.8125rem', marginTop: '2px' }}>{desc}</div>
                                    </div>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer', flexShrink: 0 }}>
                                        <input type="checkbox" defaultChecked={i < 3} style={{ opacity: 0, width: 0, height: 0 }} />
                                        <span style={{ position: 'absolute', inset: 0, background: i < 3 ? 'var(--color-primary)' : 'var(--color-gray-300)', borderRadius: '13px', transition: '0.3s' }} />
                                        <span style={{ position: 'absolute', left: i < 3 ? '24px' : '3px', top: '3px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: '0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ONGLET : SÉCURITÉ */}
                    {onglet === 'securite' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ background: 'white', borderRadius: '18px', boxShadow: 'var(--shadow-card)', padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-gray-900)', margin: '0 0 1.5rem' }}>Changer le mot de passe</h2>
                                <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    Utilisez la fonctionnalité &quot;Mot de passe oublié&quot; sur la page de connexion pour réinitialiser votre mot de passe de façon sécurisée via votre email.
                                </p>
                                <a href="/mot-de-passe-oublie" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                    <Lock size={16} /> Réinitialiser mon mot de passe
                                </a>
                            </div>
                            <div style={{ background: '#fff8f8', border: '1.5px solid #fecaca', borderRadius: '18px', padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#dc2626', margin: '0 0 0.75rem' }}>Zone de danger</h2>
                                <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                                    La suppression de votre compte est irréversible. Toutes vos données seront effacées définitivement.
                                </p>
                                <button style={{ background: 'none', border: '1.5px solid #dc2626', borderRadius: '10px', color: '#dc2626', padding: '0.625rem 1.25rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'inherit' }}>
                                    Supprimer mon compte
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ONGLET : NOTIFICATIONS */}
                    {onglet === 'notifications' && (
                        <div style={{ background: 'white', borderRadius: '18px', boxShadow: 'var(--shadow-card)', padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-gray-900)', margin: '0 0 1.5rem' }}>Préférences de notifications</h2>
                            {[
                                { label: 'Actualités de la commune', desc: 'Les nouveaux articles publiés sur la plateforme.', active: true },
                                { label: 'Validation de profil', desc: 'Lorsque votre profil est validé ou modifié par un admin.', active: true },
                                { label: 'Nouvelles opportunités', desc: 'Les offres d\'emploi et appels à candidature.', active: true },
                                { label: 'Newsletter mensuelle', desc: 'Résumé mensuel des activités de l\'ONG AGANER.', active: false },
                            ].map(({ label, desc, active }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--color-gray-100)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--color-gray-800)', fontSize: '0.9375rem' }}>{label}</div>
                                        <div style={{ color: 'var(--color-gray-400)', fontSize: '0.8125rem', marginTop: '2px' }}>{desc}</div>
                                    </div>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer', flexShrink: 0 }}>
                                        <input type="checkbox" defaultChecked={active} style={{ opacity: 0, width: 0, height: 0 }} />
                                        <span style={{ position: 'absolute', inset: 0, background: active ? 'var(--color-primary)' : 'var(--color-gray-300)', borderRadius: '13px', transition: '0.3s' }} />
                                        <span style={{ position: 'absolute', left: active ? '24px' : '3px', top: '3px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: '0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .dashboard-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    )
}
