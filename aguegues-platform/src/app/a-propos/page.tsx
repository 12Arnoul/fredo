'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    ChevronRight, MapPin, Users, Target, Heart,
    Globe, Award, BookOpen, Handshake, ArrowRight,
    Building2, TrendingUp, Star, CheckCircle
} from 'lucide-react'

// =============================================
// DONNÉES
// =============================================
const valeurs = [
    { icon: <Heart size={26} />, titre: 'Solidarité', texte: 'Créer des liens durables entre tous les fils et filles des Aguégués, sur le territoire et dans la diaspora.', couleur: '#e11d48', bg: '#fff1f2' },
    { icon: <Star size={26} />, titre: 'Excellence', texte: 'Promouvoir l\'excellence académique et professionnelle des jeunes de la commune comme modèle de réussite.', couleur: '#c4940a', bg: '#fef3c7' },
    { icon: <Globe size={26} />, titre: 'Inclusion', texte: 'Aucun talent ne doit rester dans l\'ombre. Chaque Aguéguéen(ne), quel que soit son parcours, a sa place ici.', couleur: '#1a6b3c', bg: '#dcf0e4' },
    { icon: <Handshake size={26} />, titre: 'Partenariat', texte: 'Travailler main dans la main avec la Mairie, les partenaires techniques et les institutions pour maximiser l\'impact.', couleur: '#1e3a5f', bg: '#eff4fb' },
]

const chiffres = [
    { valeur: '4 500+', label: 'Habitants recensés', icon: <Users size={24} /> },
    { valeur: '12+', label: 'Villages et quartiers', icon: <MapPin size={24} /> },
    { valeur: '1 000+', label: 'Talents en annuaire', icon: <Award size={24} /> },
    { valeur: '2026', label: 'Année de lancement', icon: <Star size={24} /> },
]

const equipe = [
    { nom: 'M. Ernest A. AGBOKOUMISSI', poste: 'Maire de la Commune des Aguégués', initiales: 'EA', couleur: '#1a6b3c' },
    { nom: 'Mme Adèle Kossou', poste: 'Secrétaire Générale', initiales: 'AK', couleur: '#1e3a5f' },
    { nom: 'M. Thierry Dossou', poste: 'Responsable Numérique', initiales: 'TD', couleur: '#c4940a' },
    { nom: 'Mme Rosalie Agossou', poste: 'Chargée des Relations', initiales: 'RA', couleur: '#7c3aed' },
]

const timeline = [
    { annee: '2022', titre: 'Initiative citoyenne', texte: 'Des cadres originaires des Aguégués s\'organisent pour contribuer au développement de leur commune.' },
    { annee: '2023', titre: 'Concertation communale', texte: 'Réunions et consultations avec la Mairie des Aguégués pour définir une vision numérique commune.' },
    { annee: '2024', titre: 'Conception du portail', texte: 'Lancement du projet de développement du portail officiel numérique de la commune des Aguégués.' },
    { annee: '2025', titre: 'Lancement officiel', texte: 'Ouverture au public du portail officiel et début du recensement des compétences dans toute la commune.' },
]

export default function AProposPage() {
    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh' }}>

                {/* ================================================
            SECTION HERO
            ================================================ */}
                <div style={{
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    padding: '4rem 0 3rem',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Overlay sombre pour lisibilité du texte */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,30,20,0.82) 0%, rgba(15,45,74,0.75) 60%, rgba(26,92,42,0.65) 100%)', pointerEvents: 'none' }} />
                    <div className="container-main" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem' }}>Accueil</Link>
                            <ChevronRight size={14} color="rgba(255,255,255,0.5)" />
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }}>À propos</span>
                        </div>

                        <div style={{ maxWidth: '700px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1rem', background: 'rgba(255,255,255,0.15)', borderRadius: '999px', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <MapPin size={14} color="rgba(255,255,255,0.9)" />
                                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Commune des Aguégués, Bénin 🇧🇯</span>
                            </div>
                            <h1 style={{ fontSize: 'clamp(1.875rem, 5vw, 3rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, margin: '0 0 1rem' }}>
                                Notre Histoire, Notre Mission
                            </h1>
                            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.1875rem)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: '0' }}>
                                La Mairie des Aguégués, à travers son portail officiel numérique,
                                valorise les talents de notre commune et accélère son développement.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================================================
            CHIFFRES CLÉS
            ================================================ */}
                <div style={{ background: 'white', borderBottom: '1px solid var(--color-gray-100)' }}>
                    <div className="container-main" style={{ padding: '2.5rem 1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }} className="stats-grid-apropos">
                            {chiffres.map(({ valeur, label, icon }) => (
                                <div key={label} style={{ textAlign: 'center', padding: '1.5rem 1rem', borderRadius: '16px', background: 'var(--color-gray-50)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.625rem', color: 'var(--color-primary)' }}>
                                        {icon}
                                    </div>
                                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-gray-900)', lineHeight: 1 }}>{valeur}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginTop: '0.375rem', fontWeight: 500 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ================================================
            MAIRIE DES AGUÉGUÉS
            ================================================ */}
                <section style={{ padding: '5rem 0', background: 'var(--color-gray-50)' }}>
                    <div className="container-main">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }} className="section-grid">
                            {/* Texte */}
                            <div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', background: 'var(--color-primary-50)', borderRadius: '999px', marginBottom: '1rem' }}>
                                    <Building2 size={14} color="var(--color-primary)" />
                                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Institution</span>
                                </div>
                                <h2 style={{ fontSize: 'clamp(1.625rem, 4vw, 2.25rem)', fontWeight: 900, color: 'var(--color-gray-900)', margin: '0 0 1.25rem', lineHeight: 1.2 }}>
                                    La Mairie des Aguégués
                                </h2>
                                <p style={{ fontSize: '1rem', color: 'var(--color-gray-600)', lineHeight: 1.8, marginBottom: '1rem' }}>
                                    La <strong>commune des Aguégués</strong> est située dans le département de
                                    l&apos;Ouémé, au sud-est du Bénin. Nichée au cœur du lac Nokoué, cette commune
                                    lacustre est reconnue pour son architecture unique sur pilotis et sa riche
                                    culture de pêcheurs.
                                </p>
                                <p style={{ fontSize: '1rem', color: 'var(--color-gray-600)', lineHeight: 1.8, marginBottom: '1.75rem' }}>
                                    La Mairie des Aguégués s&apos;engage depuis plusieurs années dans la modernisation
                                    de ses services et le développement économique de la commune. Le portail officiel numérique
                                    s&apos;inscrit dans cette vision de gouvernance participative, transparente et tournée vers l&apos;avenir.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    {[
                                        'Promotion du développement économique local',
                                        'Soutien à l\'éducation et à la formation professionnelle',
                                        'Valorisation du patrimoine culturel des Aguégués',
                                        'Amélioration des services aux citoyens via le numérique',
                                    ].map((item) => (
                                        <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                            <CheckCircle size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <span style={{ fontSize: '0.9375rem', color: 'var(--color-gray-700)', lineHeight: 1.5 }}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card visuelle */}
                            <div style={{ background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}>
                                {/* Bandeau vert */}
                                <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', padding: '2rem', textAlign: 'center' }}>
                                    <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                        <Building2 size={36} color="white" />
                                    </div>
                                    <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem', margin: '0 0 0.375rem' }}>Mairie des Aguégués</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', margin: 0 }}>Commune de l&apos;Ouémé, Bénin</p>
                                </div>
                                <div style={{ padding: '1.75rem' }}>
                                    {[
                                        { label: 'Département', value: 'Ouémé' },
                                        { label: 'Situation', value: 'Commune lacustre, bord du lac Nokoué' },
                                        { label: 'Spécificité', value: 'Villages sur pilotis — patrimoine unique' },
                                        { label: 'Engagement', value: 'Développement numérique & inclusion' },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-gray-100)', gap: '1rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-400)', fontWeight: 600 }}>{label}</span>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-800)', fontWeight: 500, textAlign: 'right' }}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================================================
            NOS VALEURS
            ================================================ */}
                <section style={{ padding: '5rem 0', background: 'var(--color-gray-50)' }}>
                    <div className="container-main">
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', background: '#fef3c7', borderRadius: '999px', marginBottom: '0.875rem' }}>
                                <Heart size={14} color="#92400e" />
                                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ce qui nous guide</span>
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--color-gray-900)', margin: '0 0 0.875rem' }}>
                                Nos Valeurs
                            </h2>
                            <p style={{ fontSize: '1.0625rem', color: 'var(--color-gray-500)', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
                                Ces principes fondamentaux guident chacune de nos actions et décisions.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                            {valeurs.map(({ icon, titre, texte, couleur, bg }) => (
                                <div key={titre} style={{ background: 'white', borderRadius: '18px', boxShadow: 'var(--shadow-card)', padding: '2rem 1.5rem', transition: 'transform 0.2s, box-shadow 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)' }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
                                >
                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: couleur }}>
                                        {icon}
                                    </div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-gray-900)', margin: '0 0 0.625rem' }}>{titre}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)', lineHeight: 1.7, margin: 0 }}>{texte}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================================================
            TIMELINE
            ================================================ */}
                <section style={{ padding: '5rem 0', background: 'white' }}>
                    <div className="container-main">
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--color-gray-900)', margin: '0 0 0.875rem' }}>
                                Notre Parcours
                            </h2>
                            <p style={{ fontSize: '1.0625rem', color: 'var(--color-gray-500)', maxWidth: '500px', margin: '0 auto' }}>
                                Du rêve à la réalité, les étapes qui ont construit cette plateforme.
                            </p>
                        </div>

                        <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative' }}>
                            {/* Ligne verticale */}
                            <div style={{ position: 'absolute', left: '32px', top: '16px', bottom: '16px', width: '2px', background: 'linear-gradient(to bottom, var(--color-primary) 0%, var(--color-secondary) 100%)', borderRadius: '999px' }} className="timeline-line" />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {timeline.map(({ annee, titre, texte }, i) => (
                                    <div key={annee} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', paddingLeft: '0' }}>
                                        {/* Point + Année */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                            <div style={{
                                                width: '64px', height: '64px', borderRadius: '50%',
                                                background: i === timeline.length - 1 ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' : 'white',
                                                border: '3px solid var(--color-primary)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 800, fontSize: '0.875rem',
                                                color: i === timeline.length - 1 ? 'white' : 'var(--color-primary)',
                                                boxShadow: 'var(--shadow-md)',
                                                position: 'relative', zIndex: 1,
                                            }}>
                                                {annee}
                                            </div>
                                        </div>
                                        {/* Contenu */}
                                        <div style={{ background: 'var(--color-gray-50)', borderRadius: '14px', padding: '1.25rem 1.5rem', flex: 1, marginTop: '0.875rem' }}>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-900)', margin: '0 0 0.5rem' }}>{titre}</h3>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)', lineHeight: 1.65, margin: 0 }}>{texte}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================================================
            ÉQUIPE
            ================================================ */}
                <section style={{ padding: '5rem 0', background: 'var(--color-gray-50)' }}>
                    <div className="container-main">
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--color-gray-900)', margin: '0 0 0.875rem' }}>
                                Notre Équipe
                            </h2>
                            <p style={{ fontSize: '1.0625rem', color: 'var(--color-gray-500)', maxWidth: '500px', margin: '0 auto' }}>
                                Des personnes engagées et passionnées par le développement des Aguégués.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', maxWidth: '900px', margin: '0 auto' }}>
                            {equipe.map(({ nom, poste, initiales, couleur }) => (
                                <div key={nom} style={{ background: 'white', borderRadius: '18px', boxShadow: 'var(--shadow-card)', padding: '2rem 1.5rem', textAlign: 'center', transition: 'transform 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div className="avatar-placeholder" style={{
                                        width: '70px', height: '70px', fontSize: '1.5rem',
                                        margin: '0 auto 1rem',
                                        background: `linear-gradient(135deg, ${couleur}25 0%, ${couleur}12 100%)`,
                                        color: couleur, border: `2px solid ${couleur}30`,
                                    }}>
                                        {initiales}
                                    </div>
                                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-gray-900)', margin: '0 0 0.375rem', lineHeight: 1.3 }}>{nom}</h3>
                                    <p style={{ fontSize: '0.8125rem', color: couleur, fontWeight: 600, margin: 0 }}>{poste}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================================================
            CTA FINAL
            ================================================ */}
                <section style={{
                    padding: '4.5rem 0',
                    background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-secondary) 100%)',
                }}>
                    <div className="container-main" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'white', margin: '0 0 1rem' }}>
                            Rejoignez le mouvement !
                        </h2>
                        <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.82)', marginBottom: '2.25rem', maxWidth: '520px', margin: '0 auto 2.25rem', lineHeight: 1.7 }}>
                            Que vous soyez un haut cadre ou un jeune diplômé, vous avez votre place
                            dans l&apos;annuaire de la commune des Aguégués.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                            <Link href="/inscription" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.9375rem 2rem', background: 'white', color: 'var(--color-primary)',
                                borderRadius: '12px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.2)', minHeight: '52px',
                            }}>
                                S&apos;inscrire gratuitement <ArrowRight size={18} />
                            </Link>
                            <Link href="/contact" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.9375rem 2rem', background: 'rgba(255,255,255,0.15)', color: 'white',
                                borderRadius: '12px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none',
                                border: '2px solid rgba(255,255,255,0.3)', minHeight: '52px',
                            }}>
                                Nous contacter
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            <style>{`
        @media (min-width: 640px) {
          .stats-grid-apropos { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (min-width: 900px) {
          .section-grid { grid-template-columns: 1fr 1fr !important; }
          .section-grid-reverse > *:first-child { order: 2; }
          .section-grid-reverse > *:last-child { order: 1; }
          .timeline-line { left: 32px !important; display: block !important; }
        }
        @media (max-width: 899px) {
          .timeline-line { display: none !important; }
        }
      `}</style>
        </>
    )
}
