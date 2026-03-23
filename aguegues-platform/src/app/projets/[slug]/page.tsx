'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeft, Leaf, Heart, Target, Share2, Users, Clock,
    BookOpen, Stethoscope, Building2, Droplets, TreePine, Zap,
    ChevronRight, MessageSquare, History, ListChecks, CheckCircle2, Copy
} from 'lucide-react'

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

const PROJETS_DEMO: Record<string, Projet> = {
    "ecole-primaire-zoungome": {
        id: 1, titre: "Construction de l'École Primaire de Zoungomé", slug: "ecole-primaire-zoungome",
        description_courte: "Bâtir 6 salles de classe modernes pour accueillir 300 enfants dans des conditions dignes d'apprentissage.",
        description_complete: `Les enfants du quartier de Zoungomé parcourent actuellement plus de 5 km chaque matin pour rejoindre l'école la plus proche. Ce projet vise à changer cette réalité en construisant une école primaire moderne de 6 salles de classe.\n\nLes nouvelles installations comprendront :\n• 6 salles de classe ventilées et éclairées\n• Une bibliothèque avec 500 livres offerts par la diaspora\n• Des sanitaires séparés garçons/filles\n• Un espace de jeux sécurisé\n\nCe projet est soutenu par la Mairie des Aguégués et le Ministère de l'Enseignement Primaire du Bénin. Les travaux débuteront dès que 80% de l'objectif sera atteint.`,
        montant_objectif: 12000000, montant_collecte: 8400000, pourcentage: 70, image_url: null,
        categorie: 'education', jours_restants: 23, nb_donateurs: 142,
    },
    "centre-sante-agame": {
        id: 2, titre: "Centre de Santé Communautaire d'Agamè", slug: "centre-sante-agame",
        description_courte: "Doter le village d'Agamè d'un centre médical équipé pour servir 5 000 habitants.",
        description_complete: `Le village d'Agamè n'a aucun centre de santé à moins de 15 km. Les femmes enceintes et les malades doivent parcourir cette distance sur des pistes difficiles, parfois au péril de leur vie.\n\nCe centre offrira :\n• Consultations médicales générales\n• Unité de maternité (8 lits)\n• Pharmacie communautaire subventionnée\n• Chambre de garde pour l'infirmier résident\n\nLe terrain a été mis à disposition par le chef de village à titre gratuit.`,
        montant_objectif: 25000000, montant_collecte: 9750000, pourcentage: 39, image_url: null,
        categorie: 'sante', jours_restants: 45, nb_donateurs: 87,
    },
    "eau-potable-medjedjonou": {
        id: 3, titre: "Adduction d'Eau Potable — Village de Médédjonou", slug: "eau-potable-medjedjonou",
        description_courte: "Installer un réseau d'eau potable pour mettre fin aux 8 km de marche quotidienne des femmes et enfants.",
        description_complete: `Les femmes et enfants de Médédjonou parcourent en moyenne 8 km chaque jour pour aller chercher l'eau. Ce problème entraîne absentéisme scolaire et maladies hydriques fréquentes.\n\nCe projet hydraulique financera :\n• Forage d'un puits artésien\n• Construction d'un château d'eau de 25 000 litres\n• Réseau de distribution vers 5 hameaux (12 bornes-fontaines)\n• Formation d'un comité de gestion local\n\nPlus de 2 000 personnes bénéficieront directement de cette infrastructure.`,
        montant_objectif: 8500000, montant_collecte: 8075000, pourcentage: 95, image_url: null,
        categorie: 'eau', jours_restants: 5, nb_donateurs: 214,
    },
    "piste-rurale-gbedegban": {
        id: 4, titre: "Réfection de la Piste Rurale Gbédégban–Aguégués", slug: "piste-rurale-gbedegban",
        description_courte: "Remettre en état 12 km de piste pour désenclaver 4 villages et faciliter l'écoulement des productions agricoles.",
        description_complete: `La piste reliant Gbédégban aux Aguégués est impraticable en saison des pluies. Cela bloque l'accès aux marchés et augmente les pertes post-récolte des agriculteurs locaux.\n\nLe projet prévoit :\n• Rechargement en latérite sur 12 km\n• Pose de 8 buses de drainage\n• Construction d'un pont provisoire\n• Entretien annuel par une équipe locale formée`,
        montant_objectif: 18000000, montant_collecte: 5400000, pourcentage: 30, image_url: null,
        categorie: 'infrastructure', jours_restants: 60, nb_donateurs: 53,
    },
    "reboisement-lac-nokoue": {
        id: 5, titre: "Reboisement du Bord du Lac Nokoué", slug: "reboisement-lac-nokoue",
        description_courte: "Planter 10 000 arbres le long des berges pour lutter contre l'érosion et protéger l'écosystème lacustre.",
        description_complete: `Les berges du Lac Nokoué souffrent d'une érosion sévère due à la déforestation et aux activités humaines. Cela menace les habitations lacustres et l'écosystème aquatique dont dépendent les pêcheurs.\n\nCe programme de reboisement mobilisera :\n• 200 jeunes du village (formation rémunérée)\n• 10 000 plants de palétuviers et d'essences locales\n• 3 éco-gardes permanents pour le suivi\n• Sensibilisation dans 8 écoles`,
        montant_objectif: 4000000, montant_collecte: 2600000, pourcentage: 65, image_url: null,
        categorie: 'environnement', jours_restants: 30, nb_donateurs: 176,
    },
    "electrification-solaire-igbodja": {
        id: 6, titre: "Électrification Solaire des Écoles d'Igbodja", slug: "electrification-solaire-igbodja",
        description_courte: "Équiper 3 établissements scolaires de panneaux solaires pour garantir l'éclairage et les cours d'informatique.",
        description_complete: `Les coupures de courant fréquentes à Igbodja empêchent les cours d'informatique et rendent les classes inutilisables après 17h. Ce projet dotera chaque école d'une installation solaire autonome.\n\nInstallation prévue par école :\n• 12 panneaux solaires 300W\n• Banque de batteries 20 kWh\n• Tableau de distribution\n• Climatiseur pour la salle informatique\n• 40 ordinateurs reconditionnés`,
        montant_objectif: 9500000, montant_collecte: 4275000, pourcentage: 45, image_url: null,
        categorie: 'energie', jours_restants: 38, nb_donateurs: 98,
    },
}

const ICONES_CATEGORIES: Record<string, React.ElementType> = {
    education: BookOpen,
    sante: Stethoscope,
    infrastructure: Building2,
    eau: Droplets,
    environnement: TreePine,
    energie: Zap,
}

const MISES_A_JOUR_DEMO = [
    { date: '15 mars 2026', titre: 'Accord de financement partenarial signé', contenu: "La Mairie des Aguégués et l'ONG AGANER ont officiellement signé le protocole de partenariat. Les fonds seront débloqués par tranche selon l'avancement de la collecte." },
    { date: '1er mars 2026', titre: 'Lancement de la campagne de collecte', contenu: "Le projet est officiellement en ligne ! Merci aux 42 premiers donateurs qui ont soutenu l'initiative dès ses premières heures." },
]

const DONATEURS_DEMO = [
    { nom: 'Jean-Baptiste A.', montant: 50000, date: 'hier', anonyme: false },
    { nom: 'Donateur anonyme', montant: 25000, date: 'il y a 2 jours', anonyme: true },
    { nom: 'Marie-Louise K.', montant: 100000, date: 'il y a 3 jours', anonyme: false },
    { nom: 'Donateur anonyme', montant: 10000, date: 'il y a 4 jours', anonyme: true },
    { nom: 'Pascal T.', montant: 75000, date: 'il y a 5 jours', anonyme: false },
]

type Tab = 'description' | 'mises-a-jour' | 'donateurs'

export default function ProjetDetailPage() {
    const { slug } = useParams()
    const router = useRouter()
    const [projet, setProjet] = useState<Projet | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<Tab>('description')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!slug) return
        const slugStr = typeof slug === 'string' ? slug : slug[0]

        fetch(`http://localhost:8000/api/projets/${slugStr}`)
            .then(res => {
                if (!res.ok) throw new Error('Not found')
                return res.json()
            })
            .then(data => { setProjet(data); setLoading(false) })
            .catch(() => {
                const demo = PROJETS_DEMO[slugStr]
                if (demo) { setProjet(demo); setLoading(false) }
                else { setLoading(false); router.push('/projets') }
            })
    }, [slug, router])

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    if (loading) return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>
    )
    if (!projet) return null

    const urgence = (projet.jours_restants ?? 99) <= 7
    const IconCat = projet.categorie ? ICONES_CATEGORIES[projet.categorie] : Leaf

    const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: 'description', label: 'Description', icon: ListChecks },
        { id: 'mises-a-jour', label: 'Mises à jour', icon: History },
        { id: 'donateurs', label: `Donateurs (${projet.nb_donateurs ?? 0})`, icon: Users },
    ]

    return (
        <main className="min-h-screen bg-slate-50 pt-20 pb-16">
            <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-8">
                    <Link href="/projets" className="hover:text-[#1a5c2a] transition flex items-center gap-1.5">
                        <ArrowLeft size={15} /> Projets
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-slate-600 line-clamp-1">{projet.titre}</span>
                </nav>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Image */}
                        <div className="h-64 md:h-80 bg-slate-200 rounded-3xl overflow-hidden relative shadow-sm">
                            {projet.image_url ? (
                                <img src={projet.image_url} alt={projet.titre} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-900 to-green-700">
                                    <IconCat size={80} className="text-white/20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                                <div className="p-6 md:p-8 w-full">
                                    {projet.categorie && (
                                        <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                                            <IconCat size={11} />
                                            {projet.categorie}
                                        </div>
                                    )}
                                    <h1 className="text-2xl md:text-4xl font-black text-white leading-tight drop-shadow-md">
                                        {projet.titre}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex border-b border-slate-100">
                                {TABS.map(tab => {
                                    const Icon = tab.icon
                                    const active = activeTab === tab.id
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-4 px-3 text-sm font-semibold transition border-b-2 ${active
                                                ? 'text-[#1a5c2a] border-[#1a5c2a] bg-green-50/50'
                                                : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'}`}
                                        >
                                            <Icon size={15} />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="p-6 md:p-8">
                                {activeTab === 'description' && (
                                    <div className="space-y-4">
                                        <p className="text-lg text-slate-700 font-medium leading-relaxed">
                                            {projet.description_courte}
                                        </p>
                                        <hr className="border-slate-100" />
                                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                                            {projet.description_complete}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'mises-a-jour' && (
                                    <div className="space-y-6">
                                        {MISES_A_JOUR_DEMO.map((maj, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                        <CheckCircle2 size={16} className="text-[#1a5c2a]" />
                                                    </div>
                                                    {i < MISES_A_JOUR_DEMO.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 mt-2" />}
                                                </div>
                                                <div className="pb-6">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{maj.date}</p>
                                                    <h4 className="font-bold text-slate-800 mb-1">{maj.titre}</h4>
                                                    <p className="text-sm text-slate-600 leading-relaxed">{maj.contenu}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'donateurs' && (
                                    <div className="space-y-3">
                                        {DONATEURS_DEMO.map((d, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center">
                                                        {d.anonyme ? '?' : d.nom.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-700">{d.nom}</p>
                                                        <p className="text-xs text-slate-400">{d.date}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-[#1a5c2a]">
                                                    {new Intl.NumberFormat('fr-FR').format(d.montant)} FCFA
                                                </span>
                                            </div>
                                        ))}
                                        <p className="text-xs text-center text-slate-400 pt-2">
                                            … et {(projet.nb_donateurs ?? 5) - 5} autres donateurs
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 lg:sticky lg:top-24">
                        {/* Collecte Card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                <Target size={16} className="text-[#1a5c2a]" /> État de la collecte
                            </div>

                            {/* Montant */}
                            <div>
                                <div className="text-3xl font-black text-[#1a5c2a] leading-none mb-1">
                                    {new Intl.NumberFormat('fr-FR').format(projet.montant_collecte)} <span className="text-lg font-semibold text-slate-400">FCFA</span>
                                </div>
                                <div className="text-sm text-slate-500 font-medium">
                                    sur {new Intl.NumberFormat('fr-FR').format(projet.montant_objectif)} FCFA
                                </div>
                            </div>

                            {/* Barre */}
                            <div className="space-y-1.5">
                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${projet.pourcentage}%`,
                                            background: projet.pourcentage >= 75
                                                ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                                                : 'linear-gradient(90deg, #86efac, #4ade80)'
                                        }}
                                    />
                                </div>
                                <div className="text-right text-sm font-black text-[#1a5c2a]">{projet.pourcentage}%</div>
                            </div>

                            {/* Stats mini */}
                            <div className="grid grid-cols-2 gap-3">
                                {projet.nb_donateurs !== undefined && (
                                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                                        <Users size={16} className="mx-auto text-slate-400 mb-1" />
                                        <div className="text-xl font-black text-slate-800">{projet.nb_donateurs}</div>
                                        <div className="text-xs text-slate-400 font-semibold">Donateurs</div>
                                    </div>
                                )}
                                {projet.jours_restants !== undefined && (
                                    <div className={`rounded-xl p-3 text-center border ${urgence ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                        <Clock size={16} className={`mx-auto mb-1 ${urgence ? 'text-red-400' : 'text-slate-400'}`} />
                                        <div className={`text-xl font-black ${urgence ? 'text-red-600' : 'text-slate-800'}`}>{projet.jours_restants}</div>
                                        <div className={`text-xs font-semibold ${urgence ? 'text-red-400' : 'text-slate-400'}`}>Jours restants</div>
                                    </div>
                                )}
                            </div>

                            {/* CTA */}
                            <Link
                                href={`/projets/${projet.slug}/soutenir`}
                                className="w-full py-4 bg-[#1a5c2a] hover:bg-green-700 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:-translate-y-0.5 group"
                            >
                                <Heart size={18} className="group-hover:scale-110 transition" />
                                Soutenir ce projet
                            </Link>

                            {/* Partager */}
                            <div className="grid grid-cols-2 gap-2">
                                <a
                                    href={`https://wa.me/?text=${encodeURIComponent(`Soutenez "${projet.titre}" sur la plateforme Aguégués : ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-bold rounded-xl border border-[#25D366]/20 flex items-center justify-center gap-1.5 text-sm transition"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    WhatsApp
                                </a>
                                <button
                                    onClick={handleCopy}
                                    className={`py-2.5 font-bold rounded-xl border flex items-center justify-center gap-1.5 text-sm transition ${copied ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'}`}
                                >
                                    {copied ? <><CheckCircle2 size={14} /> Copié !</> : <><Copy size={14} /> Copier le lien</>}
                                </button>
                            </div>
                        </div>

                        {/* Autres projets */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <MessageSquare size={14} className="text-[#1a5c2a]" /> Voir aussi
                            </h3>
                            <div className="space-y-3">
                                {Object.values(PROJETS_DEMO)
                                    .filter(p => p.slug !== projet.slug)
                                    .slice(0, 3)
                                    .map(p => (
                                        <Link key={p.id} href={`/projets/${p.slug}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition group">
                                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                                {p.categorie && ICONES_CATEGORIES[p.categorie] ? (
                                                    (() => { const I = ICONES_CATEGORIES[p.categorie!]; return <I size={16} className="text-[#1a5c2a]" /> })()
                                                ) : <Leaf size={16} className="text-[#1a5c2a]" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-700 line-clamp-2 group-hover:text-[#1a5c2a] transition leading-snug">{p.titre}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{p.pourcentage}% collecté</p>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
