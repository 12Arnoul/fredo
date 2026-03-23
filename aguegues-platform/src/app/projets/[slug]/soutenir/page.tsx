'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeft, CreditCard, ShieldCheck, Heart, Phone,
    Smartphone, CheckCircle2, Sparkles, User, Mail, Lock
} from 'lucide-react'

type Projet = {
    id: number
    titre: string
    slug: string
    montant_collecte: number
    montant_objectif: number
    pourcentage: number
}

const PROJETS_DEMO: Record<string, Projet> = {
    "ecole-primaire-zoungome": { id: 1, titre: "Construction de l'École Primaire de Zoungomé", slug: "ecole-primaire-zoungome", montant_collecte: 8400000, montant_objectif: 12000000, pourcentage: 70 },
    "centre-sante-agame": { id: 2, titre: "Centre de Santé Communautaire d'Agamè", slug: "centre-sante-agame", montant_collecte: 9750000, montant_objectif: 25000000, pourcentage: 39 },
    "eau-potable-medjedjonou": { id: 3, titre: "Adduction d'Eau Potable — Village de Médédjonou", slug: "eau-potable-medjedjonou", montant_collecte: 8075000, montant_objectif: 8500000, pourcentage: 95 },
    "piste-rurale-gbedegban": { id: 4, titre: "Réfection de la Piste Rurale Gbédégban–Aguégués", slug: "piste-rurale-gbedegban", montant_collecte: 5400000, montant_objectif: 18000000, pourcentage: 30 },
    "reboisement-lac-nokoue": { id: 5, titre: "Reboisement du Bord du Lac Nokoué", slug: "reboisement-lac-nokoue", montant_collecte: 2600000, montant_objectif: 4000000, pourcentage: 65 },
    "electrification-solaire-igbodja": { id: 6, titre: "Électrification Solaire des Écoles d'Igbodja", slug: "electrification-solaire-igbodja", montant_collecte: 4275000, montant_objectif: 9500000, pourcentage: 45 },
}

const MONTANTS_PRESET = [2000, 5000, 10000, 25000, 50000, 100000]

type ModePaiement = 'mobile-mtn' | 'mobile-moov' | 'carte'

const MODES: { id: ModePaiement; label: string; logo: string; desc: string }[] = [
    { id: 'mobile-mtn', label: 'MTN Mobile Money', logo: '🟡', desc: 'Paiement via MTN MoMo' },
    { id: 'mobile-moov', label: 'Moov Money', logo: '🔵', desc: 'Paiement via Flooz Moov' },
    { id: 'carte', label: 'Carte bancaire', logo: '💳', desc: 'Visa / Mastercard' },
]

export default function SoutenirProjetPage() {
    const { slug } = useParams()
    const router = useRouter()
    const [projet, setProjet] = useState<Projet | null>(null)
    const [loading, setLoading] = useState(true)
    const [montant, setMontant] = useState<number | ''>( 10000)
    const [mode, setMode] = useState<ModePaiement>('mobile-mtn')
    const [anonyme, setAnonyme] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [success, setSuccess] = useState(false)
    const [confettiVisible, setConfettiVisible] = useState(false)

    useEffect(() => {
        if (!slug) return
        const slugStr = typeof slug === 'string' ? slug : slug[0]
        fetch(`http://localhost:8000/api/projets/${slugStr}`)
            .then(res => { if (!res.ok) throw new Error(); return res.json() })
            .then(data => { setProjet(data); setLoading(false) })
            .catch(() => {
                const demo = PROJETS_DEMO[slugStr]
                if (demo) { setProjet(demo); setLoading(false) }
                else router.push('/projets')
            })
    }, [slug, router])

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault()
        setProcessing(true)
        setTimeout(() => {
            setProcessing(false)
            setSuccess(true)
            setConfettiVisible(true)
            setTimeout(() => setConfettiVisible(false), 3000)
        }, 2200)
    }

    if (loading) return (
        <div className="min-h-screen pt-24 bg-slate-50 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
    )
    if (!projet) return null

    /* ——— SUCCESS ——— */
    if (success) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-green-950 to-green-800 pt-20 pb-16 flex items-center justify-center px-4 relative overflow-hidden">
                {/* Confettis simulés */}
                {confettiVisible && Array.from({ length: 18 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full animate-bounce opacity-80"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 60}%`,
                            background: ['#facc15', '#22c55e', '#ffffff', '#fbbf24'][i % 4],
                            animationDelay: `${Math.random() * 0.8}s`,
                            animationDuration: `${0.6 + Math.random() * 0.8}s`,
                        }}
                    />
                ))}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center relative z-10">
                    <div className="relative inline-flex mb-6">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                            <Heart size={44} className="text-green-500 fill-green-200" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                            <Sparkles size={18} className="text-yellow-900" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-3">Merci pour votre soutien !</h2>
                    <p className="text-slate-500 mb-2 leading-relaxed">
                        Votre contribution de{' '}
                        <strong className="text-[#1a5c2a]">
                            {new Intl.NumberFormat('fr-FR').format(Number(montant))} FCFA
                        </strong>{' '}
                        {anonyme ? 'anonyme ' : ''}a bien été enregistrée.
                    </p>
                    <p className="text-sm text-slate-400 mb-8">
                        Un reçu vous sera envoyé par email. Le projet{' '}
                        <strong className="text-slate-600">"{projet.titre}"</strong> vous remercie.
                    </p>
                    <div className="space-y-3">
                        <Link
                            href={`/projets/${projet.slug}`}
                            className="block w-full py-3.5 bg-[#1a5c2a] text-white font-black rounded-xl hover:bg-green-700 transition"
                        >
                            Retour au projet
                        </Link>
                        <Link
                            href="/projets"
                            className="block w-full py-3 text-slate-500 font-semibold text-sm hover:text-slate-700 transition"
                        >
                            Voir d'autres projets
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    /* ——— FORMULAIRE ——— */
    return (
        <main className="min-h-screen bg-slate-50 pt-20 pb-16">
            <div className="container mx-auto px-4 max-w-xl">
                <Link href={`/projets/${projet.slug}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1a5c2a] font-semibold mb-6 transition text-sm">
                    <ArrowLeft size={15} /> Retour au projet
                </Link>

                {/* Récapitulatif projet */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                        <Heart size={22} className="text-[#1a5c2a]" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1a5c2a] uppercase tracking-widest mb-0.5">Vous soutenez</p>
                        <p className="font-bold text-slate-800 text-sm line-clamp-1">{projet.titre}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${projet.pourcentage}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-500">{projet.pourcentage}%</span>
                        </div>
                    </div>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#1a5c2a] to-green-700 p-6 text-white relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full" />
                        <h1 className="text-xl font-black mb-1 relative z-10">Faire un don</h1>
                        <p className="text-green-100 text-sm relative z-10">100% de votre don va directement au projet</p>
                    </div>

                    <form onSubmit={handlePayment} className="p-6 space-y-6">

                        {/* Montant */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Montant du don (FCFA)</label>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {MONTANTS_PRESET.map(val => (
                                    <button
                                        type="button"
                                        key={val}
                                        onClick={() => setMontant(val)}
                                        className={`py-2.5 px-2 rounded-xl text-sm font-bold border transition-all duration-150 ${montant === val
                                            ? 'bg-[#1a5c2a] text-white border-[#1a5c2a] shadow-md'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:text-[#1a5c2a]'}`}
                                    >
                                        {new Intl.NumberFormat('fr-FR').format(val)}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="500"
                                    value={montant}
                                    onChange={e => setMontant(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-green-100 transition text-sm"
                                    placeholder="Ou entrez un autre montant..."
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">FCFA</span>
                            </div>
                            {montant !== '' && montant > 0 && (
                                <p className="text-xs text-[#1a5c2a] font-semibold mt-2 text-right">
                                    ≈ {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(montant) / 655)} EUR
                                </p>
                            )}
                        </div>

                        {/* Mode de paiement */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Mode de paiement</label>
                            <div className="space-y-2">
                                {MODES.map(m => (
                                    <label
                                        key={m.id}
                                        className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${mode === m.id
                                            ? 'bg-green-50 border-[#1a5c2a] shadow-sm'
                                            : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="mode"
                                            value={m.id}
                                            checked={mode === m.id}
                                            onChange={() => setMode(m.id)}
                                            className="sr-only"
                                        />
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${mode === m.id ? 'border-[#1a5c2a]' : 'border-slate-300'}`}>
                                            {mode === m.id && <div className="w-2 h-2 bg-[#1a5c2a] rounded-full" />}
                                        </div>
                                        <span className="text-xl">{m.logo}</span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{m.label}</p>
                                            <p className="text-xs text-slate-400">{m.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Infos personnelles */}
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700 mb-1">Vos informations</label>
                            {!anonyme && (
                                <div className="relative">
                                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        required={!anonyme}
                                        placeholder="Nom complet"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1a5c2a] text-sm"
                                    />
                                </div>
                            )}
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="Email (pour le reçu)"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1a5c2a] text-sm"
                                />
                            </div>
                            {(mode === 'mobile-mtn' || mode === 'mobile-moov') && (
                                <div className="relative">
                                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="tel"
                                        required
                                        placeholder={mode === 'mobile-mtn' ? 'Numéro MTN (ex: 96xxxxxx)' : 'Numéro Moov (ex: 94xxxxxx)'}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1a5c2a] text-sm"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Don anonyme */}
                        <label className="flex items-center gap-3 cursor-pointer select-none group">
                            <div
                                onClick={() => setAnonyme(!anonyme)}
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${anonyme ? 'bg-[#1a5c2a] border-[#1a5c2a]' : 'border-slate-300 group-hover:border-slate-400'}`}
                            >
                                {anonyme && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <span className="text-sm text-slate-600 font-medium">
                                Faire un don <strong>anonyme</strong> (votre nom ne sera pas affiché publiquement)
                            </span>
                        </label>

                        {/* Sécurité */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <ShieldCheck size={16} className="text-green-500 flex-shrink-0" />
                            <span>Paiement sécurisé et crypté. Vos données ne sont jamais partagées.</span>
                        </div>

                        {/* Récapitulatif + bouton */}
                        {montant !== '' && Number(montant) > 0 && (
                            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                                <p className="text-xs font-bold text-[#1a5c2a] uppercase tracking-widest mb-2">Récapitulatif</p>
                                <div className="flex justify-between text-sm font-semibold text-slate-700">
                                    <span>Montant du don</span>
                                    <span>{new Intl.NumberFormat('fr-FR').format(Number(montant))} FCFA</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500 mt-1">
                                    <span>Mode de paiement</span>
                                    <span>{MODES.find(m => m.id === mode)?.label}</span>
                                </div>
                                {anonyme && (
                                    <div className="flex justify-between text-sm text-slate-500 mt-1">
                                        <span>Visibilité</span>
                                        <span className="text-slate-400 italic">Anonyme</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing || !montant || Number(montant) < 500}
                            className={`w-full py-4 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg text-base ${processing || !montant || Number(montant) < 500
                                ? 'bg-slate-300 cursor-not-allowed'
                                : 'bg-[#1a5c2a] hover:bg-green-700 hover:-translate-y-0.5'}`}
                        >
                            {processing ? (
                                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Connexion en cours...</>
                            ) : (
                                <><Smartphone size={20} /> Payer {montant ? new Intl.NumberFormat('fr-FR').format(Number(montant)) : 0} FCFA</>
                            )}
                        </button>

                        <p className="text-center text-xs text-slate-400">
                            En contribuant, vous acceptez nos{' '}
                            <Link href="/politique-confidentialite" className="underline hover:text-slate-600 transition">
                                conditions d'utilisation
                            </Link>
                            {' '}et notre politique APDP.
                        </p>
                    </form>
                </div>
            </div>
        </main>
    )
}
