'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Leaf, Heart, TrendingUp, BookOpen, Stethoscope, Building2, Droplets, TreePine, Zap, Users, Target } from 'lucide-react'

type Projet = {
    id: number
    titre: string
    slug: string
    description_courte: string
    description_complete: string
    montant_objectif: number
    montant_collecte: number
    pourcentage: number
    image_url: string | null
    categorie?: string
    jours_restants?: number
    nb_donateurs?: number
}

const CATEGORIES = [
    { id: 'tous', label: 'Tous', icon: Target },
    { id: 'education', label: 'Éducation', icon: BookOpen },
    { id: 'sante', label: 'Santé', icon: Stethoscope },
    { id: 'infrastructure', label: 'Infrastructure', icon: Building2 },
    { id: 'eau', label: 'Eau & Assainissement', icon: Droplets },
    { id: 'environnement', label: 'Environnement', icon: TreePine },
    { id: 'energie', label: 'Énergie', icon: Zap },
]

const PROJETS_DEMO: Projet[] = [
    {
        id: 1,
        titre: "Construction de l'École Primaire de Zoungomé",
        slug: "ecole-primaire-zoungome",
        description_courte: "Bâtir 6 salles de classe modernes pour accueillir 300 enfants dans des conditions dignes d'apprentissage.",
        description_complete: "Ce projet vise à construire une école primaire moderne dans le quartier de Zoungomé. Les enfants de ce quartier parcourent actuellement plus de 5 km pour aller à l'école. Les nouvelles installations comprendront 6 salles de classe, une bibliothèque et des sanitaires.",
        montant_objectif: 12000000,
        montant_collecte: 8400000,
        pourcentage: 70,
        image_url: null,
        categorie: 'education',
        jours_restants: 23,
        nb_donateurs: 142,
    },
    {
        id: 2,
        titre: "Centre de Santé Communautaire d'Agamè",
        slug: "centre-sante-agame",
        description_courte: "Doter le village d'Agamè d'un centre médical équipé pour servir 5 000 habitants.",
        description_complete: "Le village d'Agamè n'a aucun accès aux soins de santé à moins de 15 km. Ce centre offrira des consultations de base, maternité et pharmacie communautaire.",
        montant_objectif: 25000000,
        montant_collecte: 9750000,
        pourcentage: 39,
        image_url: null,
        categorie: 'sante',
        jours_restants: 45,
        nb_donateurs: 87,
    },
    {
        id: 3,
        titre: "Adduction d'Eau Potable — Village de Médédjonou",
        slug: "eau-potable-medjedjonou",
        description_courte: "Installer un réseau d'eau potable pour mettre fin aux 8 km de marche quotidienne des femmes et enfants.",
        description_complete: "Ce projet hydraulique financera le forage, le château d'eau et la distribution dans 5 hameaux. Il bénéficiera directement à plus de 2 000 personnes.",
        montant_objectif: 8500000,
        montant_collecte: 8075000,
        pourcentage: 95,
        image_url: null,
        categorie: 'eau',
        jours_restants: 5,
        nb_donateurs: 214,
    },
    {
        id: 4,
        titre: "Réfection de la Piste Rurale Gbédégban–Aguégués",
        slug: "piste-rurale-gbedegban",
        description_courte: "Remettre en état 12 km de piste pour désenclaver 4 villages et faciliter l'écoulement des productions agricoles.",
        description_complete: "La piste rurale reliant Gbédégban aux Aguégués est impraticable depuis la saison des pluies. Ce projet financera le rechargement en latérite et la pose de buses de drainage.",
        montant_objectif: 18000000,
        montant_collecte: 5400000,
        pourcentage: 30,
        image_url: null,
        categorie: 'infrastructure',
        jours_restants: 60,
        nb_donateurs: 53,
    },
    {
        id: 5,
        titre: "Reboisement du Bord du Lac Nokoué",
        slug: "reboisement-lac-nokoue",
        description_courte: "Planter 10 000 arbres le long des berges pour lutter contre l'érosion et protéger l'écosystème lacustre.",
        description_complete: "Face à la dégradation alarmante des berges du Lac Nokoué, ce programme de reboisement mobilisera les jeunes du village et les éco-gardes de la commune.",
        montant_objectif: 4000000,
        montant_collecte: 2600000,
        pourcentage: 65,
        image_url: null,
        categorie: 'environnement',
        jours_restants: 30,
        nb_donateurs: 176,
    },
    {
        id: 6,
        titre: "Électrification Solaire des Écoles d'Igbodja",
        slug: "electrification-solaire-igbodja",
        description_courte: "Équiper 3 établissements scolaires de panneaux solaires pour garantir l'éclairage des classes et des salles informatiques.",
        description_complete: "Les coupures de courant fréquentes pénalisent l'apprentissage. Ce projet dotera chaque école d'une installation solaire autonome avec batteries de stockage.",
        montant_objectif: 9500000,
        montant_collecte: 4275000,
        pourcentage: 45,
        image_url: null,
        categorie: 'energie',
        jours_restants: 38,
        nb_donateurs: 98,
    },
]

const ICONES_CATEGORIES: Record<string, React.ElementType> = {
    education: BookOpen,
    sante: Stethoscope,
    infrastructure: Building2,
    eau: Droplets,
    environnement: TreePine,
    energie: Zap,
}

function AnimatedCounter({ end, prefix = '', suffix = '' }: { end: number; prefix?: string; suffix?: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const started = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true
                let start = 0
                const duration = 1500
                const step = end / (duration / 16)
                const timer = setInterval(() => {
                    start += step
                    if (start >= end) { setCount(end); clearInterval(timer) }
                    else setCount(Math.floor(start))
                }, 16)
            }
        }, { threshold: 0.3 })
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [end])

    return <span ref={ref}>{prefix}{count.toLocaleString('fr-FR')}{suffix}</span>
}

export default function ProjetsPage() {
    const [projets, setProjets] = useState<Projet[]>(PROJETS_DEMO)
    const [loading, setLoading] = useState(false)
    const [filtre, setFiltre] = useState('tous')

    useEffect(() => {
        setLoading(true)
        fetch('http://localhost:8000/api/projets')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setProjets(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const projetsFiltres = filtre === 'tous'
        ? projets
        : projets.filter(p => p.categorie === filtre)

    const totalCollecte = projets.reduce((s, p) => s + p.montant_collecte, 0)
    const totalDonateurs = projets.reduce((s, p) => s + (p.nb_donateurs ?? 0), 0)
    const maxPourcentage = Math.max(...projets.map(p => p.pourcentage))

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div
                className="text-white pt-28 pb-20 relative overflow-hidden"
                style={{
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay sombre pour lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-green-900/80 to-green-800/70" />
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-5xl">
                    <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-yellow-400/30">
                        <Heart size={12} className="animate-pulse" /> Solidarité communautaire
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                        Projets à <span className="text-yellow-400">Soutenir</span>
                    </h1>
                    <p className="text-lg md:text-xl text-green-100 max-w-2xl font-light mb-12">
                        Devenez acteur du développement des Aguégués. Chaque contribution, quelle que soit sa taille, bâtit l'avenir de notre commune.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
                            <div className="text-2xl md:text-3xl font-black text-yellow-400 mb-1">
                                <AnimatedCounter end={projets.length} />
                            </div>
                            <div className="text-green-200 text-xs font-semibold uppercase tracking-wide">Projets actifs</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
                            <div className="text-xl md:text-2xl font-black text-yellow-400 mb-1">
                                <AnimatedCounter end={Math.round(totalCollecte / 1000000)} suffix="M FCFA" />
                            </div>
                            <div className="text-green-200 text-xs font-semibold uppercase tracking-wide">Collectés</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
                            <div className="text-2xl md:text-3xl font-black text-yellow-400 mb-1">
                                <AnimatedCounter end={totalDonateurs} suffix="+" />
                            </div>
                            <div className="text-green-200 text-xs font-semibold uppercase tracking-wide">Donateurs</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtres */}
            <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-3 flex gap-2 overflow-x-auto no-scrollbar">
                    {CATEGORIES.map(cat => {
                        const Icon = cat.icon
                        const active = filtre === cat.id
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setFiltre(cat.id)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${active
                                    ? 'bg-[#1a5c2a] text-white border-[#1a5c2a] shadow-md shadow-green-900/20'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-green-400 hover:text-[#1a5c2a]'}`}
                            >
                                <Icon size={14} />
                                {cat.label}
                                {cat.id !== 'tous' && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        {projets.filter(p => p.categorie === cat.id).length}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Liste */}
            <div className="container mx-auto px-4 lg:px-8 py-12 max-w-5xl">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                    </div>
                ) : projetsFiltres.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="text-6xl mb-4">🌱</div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Aucun projet dans cette catégorie</h3>
                        <p className="text-slate-500 mb-6">D'autres initiatives seront bientôt publiées ici.</p>
                        <button onClick={() => setFiltre('tous')} className="px-6 py-2.5 bg-[#1a5c2a] text-white font-bold rounded-xl text-sm hover:bg-green-700 transition">
                            Voir tous les projets
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projetsFiltres.map((projet) => {
                            const isPopulaire = projet.pourcentage === maxPourcentage
                            const IconCat = projet.categorie ? ICONES_CATEGORIES[projet.categorie] : Leaf
                            const urgence = (projet.jours_restants ?? 99) <= 7
                            return (
                                <Link
                                    href={`/projets/${projet.slug}`}
                                    key={projet.id}
                                    className="group block bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
                                >
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                        {isPopulaire && (
                                            <span className="bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                                                🔥 Populaire
                                            </span>
                                        )}
                                        {urgence && (
                                            <span className="bg-red-500 text-white text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg animate-pulse">
                                                ⏰ Urgent
                                            </span>
                                        )}
                                    </div>

                                    {/* Image */}
                                    <div className="h-44 bg-slate-200 overflow-hidden relative">
                                        {projet.image_url ? (
                                            <img src={projet.image_url} alt={projet.titre} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                                                {IconCat && <IconCat size={48} className="text-green-300" />}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                    </div>

                                    <div className="p-5">
                                        {projet.categorie && (
                                            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#1a5c2a] uppercase tracking-widest bg-green-50 px-2.5 py-1 rounded-full mb-3 border border-green-100">
                                                {IconCat && <IconCat size={10} />}
                                                {CATEGORIES.find(c => c.id === projet.categorie)?.label ?? projet.categorie}
                                            </div>
                                        )}
                                        <h3 className="text-base font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-[#1a5c2a] transition leading-snug">
                                            {projet.titre}
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{projet.description_courte}</p>

                                        {/* Progress */}
                                        <div className="space-y-1.5 mb-4">
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${projet.pourcentage}%`,
                                                        background: projet.pourcentage >= 75 ? '#16a34a' : projet.pourcentage >= 50 ? '#22c55e' : '#86efac'
                                                    }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs font-semibold">
                                                <span className="text-[#1a5c2a]">
                                                    {new Intl.NumberFormat('fr-FR').format(projet.montant_collecte)} FCFA
                                                </span>
                                                <span className="text-slate-400">{projet.pourcentage}%</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                            <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                                                {projet.nb_donateurs !== undefined && (
                                                    <span className="flex items-center gap-1">
                                                        <Users size={12} />
                                                        {projet.nb_donateurs}
                                                    </span>
                                                )}
                                                {projet.jours_restants !== undefined && (
                                                    <span className={`flex items-center gap-1 ${urgence ? 'text-red-500' : ''}`}>
                                                        ⏱ {projet.jours_restants}j restants
                                                    </span>
                                                )}
                                            </div>
                                            <span className="w-8 h-8 rounded-full bg-green-50 text-[#1a5c2a] flex items-center justify-center group-hover:bg-[#1a5c2a] group-hover:text-white transition">
                                                <ArrowRight size={15} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}

                {/* CTA Proposer un projet */}
                <div className="mt-16 bg-gradient-to-r from-[#1a5c2a] to-green-700 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    <TrendingUp size={48} className="mx-auto mb-4 text-yellow-400 relative z-10" />
                    <h2 className="text-2xl md:text-3xl font-black mb-3 relative z-10">Vous avez un projet pour les Aguégués ?</h2>
                    <p className="text-green-100 mb-6 max-w-lg mx-auto relative z-10">
                        Soumettez votre initiative communautaire à la mairie. Les meilleures propositions seront publiées sur cette plateforme et financées par la diaspora.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg relative z-10">
                        Proposer un projet <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </main>
    )
}
