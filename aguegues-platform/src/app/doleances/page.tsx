'use client'

import { useState, useRef } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ChevronRight, MapPin, AlertTriangle, Camera, Send, CheckCircle, X } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const villages = [
    'Aguégués Centre', 'Avagbodji', 'Tohouè', 'Dégon', 'Hêtin-Sota',
    'Zoungamè', 'Kpinnou', 'Akodéha', 'Gankpétin', 'Vêki',
    'Adjohoun (proximité)', 'Autre localité',
]

const niveauxUrgence = [
    { value: 'faible', label: '🟢 Faible', desc: 'Peut attendre', color: '#16a34a' },
    { value: 'moyen', label: '🟡 Moyen', desc: 'À traiter', color: '#ca8a04' },
    { value: 'urgent', label: '🟠 Urgent', desc: 'Prioritaire', color: '#ea580c' },
    { value: 'critique', label: '🔴 Critique', desc: 'Immédiat', color: '#dc2626' },
]

type FormData = {
    nom: string
    localite: string
    probleme: string
    urgence: string
    proposition: string
    latitude: number | null
    longitude: number | null
    media_url: string
}

export default function DoleancesPage() {
    const [form, setForm] = useState<FormData>({
        nom: '', localite: '', probleme: '', urgence: 'moyen',
        proposition: '', latitude: null, longitude: null, media_url: '',
    })
    const [loading, setLoading] = useState(false)
    const [geoLoading, setGeoLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const set = (field: keyof FormData, value: string | number | null) =>
        setForm(f => ({ ...f, [field]: value }))

    const getLocation = () => {
        setGeoLoading(true)
        if (!navigator.geolocation) {
            setError('La géolocalisation n\'est pas disponible sur ce navigateur.')
            setGeoLoading(false)
            return
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                set('latitude', pos.coords.latitude)
                set('longitude', pos.coords.longitude)
                setGeoLoading(false)
            },
            () => {
                setError('Impossible d\'obtenir votre position. Vérifiez les autorisations.')
                setGeoLoading(false)
            }
        )
    }

    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setPhotoFile(file)
        const reader = new FileReader()
        reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!form.localite || !form.probleme || !form.urgence) {
            setError('Veuillez remplir au minimum : localité, problème et niveau d\'urgence.')
            return
        }
        setLoading(true)
        try {
            let media_url = ''

            // Upload photo si présente
            if (photoFile) {
                const ext = photoFile.name.split('.').pop()
                const path = `doleances/${Date.now()}.${ext}`
                const { error: upErr } = await supabase.storage
                    .from('doleances-media')
                    .upload(path, photoFile, { upsert: false })
                if (!upErr) {
                    const { data: urlData } = supabase.storage
                        .from('doleances-media')
                        .getPublicUrl(path)
                    media_url = urlData.publicUrl
                }
            }

            const { error: insertErr } = await supabase.from('doleances').insert([{
                nom: form.nom || null,
                localite: form.localite,
                probleme: form.probleme,
                urgence: form.urgence,
                proposition: form.proposition || null,
                latitude: form.latitude,
                longitude: form.longitude,
                media_url: media_url || null,
                statut: 'en_attente',
            }])

            if (insertErr) throw insertErr
            setSuccess(true)
        } catch {
            setError('Erreur lors de l\'envoi. Veuillez réessayer.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f9fafb' }}>
                    <div style={{ textAlign: 'center', maxWidth: '480px' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
                        }}>
                            <CheckCircle size={40} color="white" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>
                            Doléance envoyée !
                        </h2>
                        <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '2rem' }}>
                            Votre doléance a bien été enregistrée. La Mairie des Aguégués
                            en prendra connaissance et vous informera du traitement.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => { setSuccess(false); setForm({ nom: '', localite: '', probleme: '', urgence: 'moyen', proposition: '', latitude: null, longitude: null, media_url: '' }); setPhotoPreview(null) }} style={{
                                padding: '0.75rem 1.5rem', background: '#1a5c2a', color: 'white',
                                borderRadius: '10px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                            }}>
                                + Nouvelle doléance
                            </button>
                            <Link href="/" style={{ padding: '0.75rem 1.5rem', border: '1.5px solid #e5e7eb', color: '#374151', borderRadius: '10px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                                Retour à l&apos;accueil
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: '#f9fafb' }}>

                {/* ── HERO ────────────────────────────────── */}
                <div style={{
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    padding: 'clamp(1.75rem, 4vw, 3rem) clamp(1.5rem, 4vw, 3rem) clamp(1.25rem, 3vw, 2rem)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,25,15,0.88) 0%, rgba(15,45,74,0.80) 45%, rgba(10,35,18,0.75) 100%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.25rem' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8125rem' }}>Accueil</Link>
                            <ChevronRight size={13} color="rgba(255,255,255,0.4)" />
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8125rem', fontWeight: 600 }}>Doléances</span>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.75rem', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, color: '#fbbf24', marginBottom: '0.875rem' }}>
                            📢 Espace d&apos;expression citoyenne
                        </span>
                        <h1 style={{ fontSize: 'clamp(1.375rem, 3.5vw, 2.25rem)', fontWeight: 900, color: 'white', lineHeight: 1.2, margin: '0 0 0.625rem' }}>
                            Doléances Citoyennes
                        </h1>
                        <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: '560px' }}>
                            Signalez un problème, partagez une préoccupation et proposez des solutions
                            pour améliorer votre quotidien dans la commune des Aguégués.
                        </p>
                    </div>
                </div>

                {/* ── FORMULAIRE ──────────────────────────── */}
                <div style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)' }}>

                    {error && (
                        <div style={{
                            display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                            padding: '0.875rem 1.25rem', borderRadius: '12px',
                            background: '#fef2f2', border: '1px solid #fecaca',
                            marginBottom: '1.5rem',
                        }}>
                            <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '1px' }} />
                            <span style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: 500 }}>{error}</span>
                            <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}><X size={16} /></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Section 1 : Identité (optionnel) */}
                        <FormSection num="1" titre="Votre identité" badge="Optionnel">
                            <Field label="Nom & Prénom (optionnel)">
                                <input type="text" placeholder="Laissez vide pour rester anonyme"
                                    value={form.nom} onChange={e => set('nom', e.target.value)}
                                    style={inputStyle} />
                            </Field>
                        </FormSection>

                        {/* Section 2 : Localisation */}
                        <FormSection num="2" titre="Localisation">
                            <Field label="Localité concernée *">
                                <select value={form.localite} onChange={e => set('localite', e.target.value)} style={inputStyle} required>
                                    <option value="">— Sélectionnez votre village / quartier —</option>
                                    {villages.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </Field>
                            {/* Géolocalisation */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                <button type="button" onClick={getLocation} disabled={geoLoading} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.625rem 1.25rem', borderRadius: '10px',
                                    background: form.latitude ? '#dcf0e4' : 'white',
                                    border: `1.5px solid ${form.latitude ? '#1a5c2a' : '#d1d5db'}`,
                                    color: form.latitude ? '#1a5c2a' : '#374151',
                                    fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}>
                                    <MapPin size={15} />
                                    {geoLoading ? 'Localisation…' : form.latitude ? '✅ Position enregistrée' : '📍 Ma position GPS'}
                                </button>
                                {form.latitude && (
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>
                                        {form.latitude.toFixed(4)}, {form.longitude?.toFixed(4)}
                                    </span>
                                )}
                            </div>
                        </FormSection>

                        {/* Section 3 : Le problème */}
                        <FormSection num="3" titre="Description du problème">
                            <Field label="Décrivez le problème *">
                                <textarea
                                    placeholder="Décrivez clairement le problème : où ? depuis quand ? quelles conséquences ?"
                                    value={form.probleme} onChange={e => set('probleme', e.target.value)}
                                    rows={5} required
                                    style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                                />
                            </Field>

                            {/* Niveau d'urgence */}
                            <Field label="Niveau d'urgence *">
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.625rem' }}>
                                    {niveauxUrgence.map(({ value, label, desc, color }) => (
                                        <label key={value} style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.75rem 1rem', borderRadius: '12px',
                                            border: `2px solid ${form.urgence === value ? color : '#e5e7eb'}`,
                                            background: form.urgence === value ? `${color}10` : 'white',
                                            cursor: 'pointer', transition: 'all 0.15s',
                                        }}>
                                            <input type="radio" name="urgence" value={value}
                                                checked={form.urgence === value}
                                                onChange={() => set('urgence', value)}
                                                style={{ display: 'none' }} />
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: form.urgence === value ? color : '#374151' }}>{label}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </Field>
                        </FormSection>

                        {/* Section 4 : Photo + proposition */}
                        <FormSection num="4" titre="Illustration & Solution" badge="Optionnel">
                            {/* Upload photo */}
                            <Field label="Photo ou vidéo du problème">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed #d1d5db', borderRadius: '14px',
                                        padding: '1.5rem', textAlign: 'center',
                                        cursor: 'pointer', background: 'white',
                                        transition: 'border-color 0.2s',
                                        position: 'relative', overflow: 'hidden',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#1a5c2a'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#d1d5db'}
                                >
                                    {photoPreview ? (
                                        <div style={{ position: 'relative' }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={photoPreview} alt="Aperçu" style={{ maxHeight: '180px', borderRadius: '10px', objectFit: 'cover' }} />
                                            <button type="button" onClick={e => { e.stopPropagation(); setPhotoPreview(null); setPhotoFile(null) }}
                                                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Camera size={32} color="#9ca3af" style={{ margin: '0 auto 0.75rem' }} />
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
                                                Cliquez pour ajouter une photo ou vidéo
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                                                JPG, PNG, MP4 — max 10 Mo
                                            </div>
                                        </>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*,video/*"
                                    onChange={handlePhoto} style={{ display: 'none' }} />
                            </Field>

                            <Field label="Proposition de solution">
                                <textarea
                                    placeholder="Avez-vous une idée de solution ? (optionnel)"
                                    value={form.proposition} onChange={e => set('proposition', e.target.value)}
                                    rows={3}
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                />
                            </Field>
                        </FormSection>

                        {/* Bouton envoi */}
                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '0.9375rem',
                            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #1a5c2a, #22c55e)',
                            color: 'white', border: 'none', borderRadius: '14px',
                            fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                            boxShadow: loading ? 'none' : '0 4px 16px rgba(34,197,94,0.3)',
                            transition: 'all 0.2s',
                        }}>
                            <Send size={18} />
                            {loading ? 'Envoi en cours…' : 'Envoyer ma doléance'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#9ca3af', marginTop: '1rem' }}>
                            🔒 Vos données sont confidentielles et traitées uniquement par la Mairie des Aguégués.
                        </p>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}

// ── Composants helper ────────────────────────────────────────────────────────
function FormSection({ num, titre, badge, children }: { num: string; titre: string; badge?: string; children: React.ReactNode }) {
    return (
        <div style={{
            background: 'white', borderRadius: '18px',
            padding: 'clamp(1.25rem, 3vw, 1.75rem)',
            marginBottom: '1.25rem',
            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
            border: '1px solid #f3f4f6',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a5c2a, #22c55e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 800, color: 'white', flexShrink: 0,
                }}>{num}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{titre}</h3>
                {badge && <span style={{ padding: '0.2rem 0.625rem', background: '#f3f4f6', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, color: '#6b7280' }}>{badge}</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {children}
            </div>
        </div>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                {label}
            </label>
            {children}
        </div>
    )
}

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem',
    borderRadius: '10px', border: '1.5px solid #e5e7eb',
    fontSize: '0.9375rem', color: '#111827',
    background: 'white', outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
}
