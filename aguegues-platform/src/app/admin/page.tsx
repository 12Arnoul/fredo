'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Newspaper, Settings, Shield, LogOut, CheckCircle, X, Search, RefreshCw, Loader2, Globe2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getStatsAdmin, getUtilisateursAdmin, getArticlesAdmin, changerStatutUtilisateur } from '@/lib/supabase/queries'
import type { Profile, Article } from '@/lib/supabase/types'

type Section = 'dashboard' | 'utilisateurs' | 'articles' | 'parametres'

export default function AdminPage() {
    const [section, setSection] = useState<Section>('dashboard')
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ total: 0, cadres: 0, jeunes: 0, enAttente: 0, messagesNonLus: 0 })
    const [utilisateurs, setUtilisateurs] = useState<Profile[]>([])
    const [articles, setArticles] = useState<Article[]>([])
    const [filtreStatut, setFiltreStatut] = useState('tous')
    const [recherche, setRecherche] = useState('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => { chargerDonnees() }, [])

    const chargerDonnees = async () => {
        setLoading(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/connexion'); return }

        const [statsData, usersData, articlesData] = await Promise.all([
            getStatsAdmin(),
            getUtilisateursAdmin(),
            getArticlesAdmin(),
        ])
        setStats(statsData)
        setUtilisateurs(usersData)
        setArticles(articlesData)
        setLoading(false)
    }

    const handleChangerStatut = async (userId: string, statut: 'valide' | 'en_attente' | 'suspendu') => {
        setActionLoading(userId)
        try {
            await changerStatutUtilisateur(userId, statut)
            setUtilisateurs(prev => prev.map(u => u.id === userId ? { ...u, statut } : u))
            setStats(prev => ({
                ...prev,
                enAttente: statut === 'valide' ? Math.max(0, prev.enAttente - 1) : prev.enAttente,
            }))
        } catch (e) { console.error(e) }
        setActionLoading(null)
    }

    const handleDeconnexion = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
    }

    const statutColor: Record<string, { color: string; bg: string }> = {
        valide: { color: '#059669', bg: '#d1fae5' },
        en_attente: { color: '#d97706', bg: '#fef3c7' },
        suspendu: { color: '#dc2626', bg: '#fee2e2' },
    }

    const utilisateursFiltres = utilisateurs
        .filter(u => filtreStatut === 'tous' || u.statut === filtreStatut)
        .filter(u => !recherche || `${u.prenom} ${u.nom}`.toLowerCase().includes(recherche.toLowerCase()))

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 size={40} color="#22c55e" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                    <p style={{ color: '#94a3b8' }}>Chargement de l&apos;espace admin…</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column' }}>

            {/* HEADER ADMIN */}
            <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Globe2 size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '1.0625rem', color: 'white' }}>AGANER Admin</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Panneau d&apos;administration</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.375rem 0.875rem', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', color: '#22c55e', fontSize: '0.75rem', fontWeight: 700 }}>
                        <Shield size={12} style={{ display: 'inline', marginRight: '4px' }} /> Administrateur
                    </div>
                    <button onClick={handleDeconnexion} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', padding: '0.5rem 0.875rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem', fontFamily: 'inherit' }}>
                        <LogOut size={15} /> Déconnexion
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1 }}>

                {/* SIDEBAR */}
                <div style={{ width: '220px', background: '#1e293b', borderRight: '1px solid #334155', padding: '1.25rem 0.75rem', flexShrink: 0 }}>
                    {[
                        { id: 'dashboard' as Section, icon: Shield, label: 'Tableau de bord', badge: stats.enAttente || undefined },
                        { id: 'utilisateurs' as Section, icon: Users, label: 'Utilisateurs', badge: stats.total || undefined },
                        { id: 'articles' as Section, icon: Newspaper, label: 'Articles CMS' },
                        { id: 'parametres' as Section, icon: Settings, label: 'Paramètres' },
                    ].map(({ id, icon: Icon, label, badge }) => (
                        <button key={id} onClick={() => setSection(id)} style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            gap: '0.625rem', padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                            background: section === id ? 'rgba(34,197,94,0.15)' : 'transparent',
                            color: section === id ? '#22c55e' : '#94a3b8', fontWeight: section === id ? 700 : 500,
                            fontSize: '0.875rem', fontFamily: 'inherit', marginBottom: '2px', textAlign: 'left',
                            transition: 'all 0.2s',
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><Icon size={17} />{label}</span>
                            {badge ? <span style={{ background: section === id ? '#22c55e' : '#475569', color: section === id ? 'white' : '#cbd5e1', borderRadius: '999px', padding: '0 6px', fontSize: '0.7rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>{badge}</span> : null}
                        </button>
                    ))}
                </div>

                {/* CONTENU */}
                <div style={{ flex: 1, padding: '1.75rem', overflow: 'auto' }}>

                    {/* TABLEAU DE BORD */}
                    {section === 'dashboard' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'white', margin: 0 }}>Tableau de bord</h1>
                                <button onClick={chargerDonnees} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', padding: '0.5rem 0.875rem', cursor: 'pointer', fontSize: '0.8125rem', fontFamily: 'inherit' }}>
                                    <RefreshCw size={14} /> Actualiser
                                </button>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                {[
                                    { label: 'Total utilisateurs', val: stats.total, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
                                    { label: 'Cadres', val: stats.cadres, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
                                    { label: 'Jeunes Talents', val: stats.jeunes, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
                                    { label: 'En attente validation', val: stats.enAttente, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                                    { label: 'Messages non lus', val: stats.messagesNonLus, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
                                ].map(({ label, val, color, bg }) => (
                                    <div key={label} style={{ background: '#1e293b', borderRadius: '14px', padding: '1.25rem', border: `1px solid ${color}33` }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color, marginBottom: '0.375rem' }}>{val}</div>
                                        <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 500 }}>{label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Liste profils en attente */}
                            <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '1.5rem' }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                                    Profils en attente de validation ({stats.enAttente})
                                </h2>
                                {utilisateurs.filter(u => u.statut === 'en_attente').length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                        <CheckCircle size={32} color="#22c55e" style={{ marginBottom: '0.75rem' }} />
                                        <p>Aucun profil en attente ! Tout est à jour.</p>
                                    </div>
                                ) : utilisateurs.filter(u => u.statut === 'en_attente').map(u => (
                                    <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #1e293b', flexWrap: 'wrap', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>
                                                {u.prenom[0]}{u.nom[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9375rem' }}>{u.prenom} {u.nom}</div>
                                                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{u.type === 'cadre' ? '🏆 Cadre' : '🎯 Jeune'} · Inscrit {new Date(u.created_at).toLocaleDateString('fr-FR')}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.625rem' }}>
                                            <button onClick={() => handleChangerStatut(u.id, 'valide')} disabled={actionLoading === u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', borderRadius: '8px', border: 'none', background: 'rgba(34,197,94,0.15)', color: '#22c55e', cursor: 'pointer', fontWeight: 700, fontSize: '0.8125rem', fontFamily: 'inherit' }}>
                                                {actionLoading === u.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />} Valider
                                            </button>
                                            <button onClick={() => handleChangerStatut(u.id, 'suspendu')} disabled={actionLoading === u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem', fontFamily: 'inherit' }}>
                                                <X size={14} /> Refuser
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* UTILISATEURS */}
                    {section === 'utilisateurs' && (
                        <div>
                            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'white', margin: '0 0 1.5rem' }}>
                                Gestion des utilisateurs ({utilisateurs.length})
                            </h1>
                            <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                                    <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                    <input type="text" placeholder="Rechercher un utilisateur…" value={recherche} onChange={e => setRecherche(e.target.value)}
                                        style={{ width: '100%', paddingLeft: '2.5rem', padding: '0.625rem 0.875rem 0.625rem 2.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: 'white', fontSize: '0.875rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                                </div>
                                <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)} style={{ padding: '0.625rem 1rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#94a3b8', fontSize: '0.875rem', fontFamily: 'inherit' }}>
                                    <option value="tous">Tous les statuts</option>
                                    <option value="valide">Validés</option>
                                    <option value="en_attente">En attente</option>
                                    <option value="suspendu">Suspendus</option>
                                </select>
                            </div>
                            <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', overflow: 'hidden' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', padding: '0.875rem 1.25rem', borderBottom: '1px solid #334155', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <span>Utilisateur</span><span>Type</span><span>Statut</span><span>Date</span><span>Actions</span>
                                </div>
                                {utilisateursFiltres.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Aucun utilisateur trouvé</div>
                                ) : utilisateursFiltres.map((u, i) => (
                                    <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', padding: '0.875rem 1.25rem', alignItems: 'center', borderBottom: i < utilisateursFiltres.length - 1 ? '1px solid #1e293b' : 'none', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0 }}>
                                                {u.prenom[0]}{u.nom[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'white', fontSize: '0.875rem' }}>{u.prenom} {u.nom}</div>
                                            </div>
                                        </div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>{u.type === 'cadre' ? '🏆 Cadre' : '🎯 Jeune'}</div>
                                        <div>
                                            <span style={{ padding: '0.25rem 0.625rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, background: (statutColor[u.statut]?.bg || '#334155'), color: (statutColor[u.statut]?.color || '#94a3b8') }}>
                                                {u.statut === 'valide' ? 'Validé' : u.statut === 'en_attente' ? 'En attente' : 'Suspendu'}
                                            </span>
                                        </div>
                                        <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</div>
                                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                                            {u.statut !== 'valide' && (
                                                <button onClick={() => handleChangerStatut(u.id, 'valide')} disabled={actionLoading === u.id} title="Valider" style={{ padding: '0.375rem', border: 'none', borderRadius: '6px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', cursor: 'pointer' }}>
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                            {u.statut !== 'suspendu' && (
                                                <button onClick={() => handleChangerStatut(u.id, 'suspendu')} disabled={actionLoading === u.id} title="Suspendre" style={{ padding: '0.375rem', border: 'none', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer' }}>
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ARTICLES */}
                    {section === 'articles' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'white', margin: 0 }}>Articles CMS ({articles.length})</h1>
                            </div>
                            <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', overflow: 'hidden' }}>
                                {articles.length === 0 ? (
                                    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                        <Newspaper size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                                        <p>Aucun article publié. Le contenu des articles est géré directement dans Supabase.</p>
                                    </div>
                                ) : articles.map((a, i) => (
                                    <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '1rem 1.25rem', alignItems: 'center', borderBottom: i < articles.length - 1 ? '1px solid #334155' : 'none', gap: '0.75rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{a.titre}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{a.slug}</div>
                                        </div>
                                        <div>
                                            <span style={{ padding: '0.25rem 0.625rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, background: a.publie ? 'rgba(34,197,94,0.15)' : '#334155', color: a.publie ? '#22c55e' : '#64748b' }}>
                                                {a.publie ? '✓ Publié' : 'Brouillon'}
                                            </span>
                                        </div>
                                        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{new Date(a.created_at).toLocaleDateString('fr-FR')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PARAMÈTRES */}
                    {section === 'parametres' && (
                        <div>
                            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'white', margin: '0 0 1.5rem' }}>Paramètres de la plateforme</h1>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    { label: 'Inscriptions ouvertes', desc: 'Permettre aux nouveaux utilisateurs de s\'inscrire.', active: true },
                                    { label: 'Validation manuelle des profils', desc: 'Chaque nouveau profil doit être validé par un admin.', active: true },
                                    { label: 'Annuaire public', desc: 'L\'annuaire est visible sans connexion.', active: true },
                                    { label: 'Mode maintenance', desc: 'Le site affiche une page de maintenance.', active: false },
                                ].map(({ label, desc, active }) => (
                                    <div key={label} style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9375rem' }}>{label}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: '2px' }}>{desc}</div>
                                        </div>
                                        <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px', cursor: 'pointer', flexShrink: 0 }}>
                                            <input type="checkbox" defaultChecked={active} style={{ opacity: 0, width: 0, height: 0 }} />
                                            <span style={{ position: 'absolute', inset: 0, background: active ? '#22c55e' : '#334155', borderRadius: '14px', transition: '0.3s' }} />
                                            <span style={{ position: 'absolute', left: active ? '26px' : '3px', top: '3px', width: '22px', height: '22px', background: 'white', borderRadius: '50%', transition: '0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }} />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
