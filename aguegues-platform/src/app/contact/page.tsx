'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
    Mail, Phone, MapPin, Send, ChevronRight,
    MessageSquare, Clock, Facebook, Twitter, Linkedin, CheckCircle
} from 'lucide-react'
import { envoyerMessage } from '@/lib/supabase/queries'


type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        nom: '', email: '', telephone: '', sujet: 'general', message: ''
    })
    const [formState, setFormState] = useState<FormState>('idle')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormState('submitting')
        try {
            await envoyerMessage({
                nom: formData.nom,
                email: formData.email,
                sujet: formData.sujet,
                message: formData.message,
            })
            setFormState('success')
        } catch (err) {
            console.error('Erreur envoi message:', err)
            setFormState('error')
        }
    }

    const sujets = [
        { value: 'general', label: 'Renseignement général' },
        { value: 'inscription', label: 'Aide à l\'inscription' },
        { value: 'profil', label: 'Problème avec mon profil' },
        { value: 'partenariat', label: 'Proposition de partenariat' },
        { value: 'signalement', label: 'Signaler un contenu' },
        { value: 'autre', label: 'Autre' },
    ]

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>

                {/* ---- EN-TÊTE ---- */}
                <div style={{
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    padding: '3rem 0 2rem',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,25,15,0.88) 0%, rgba(15,45,74,0.80) 100%)', pointerEvents: 'none' }} />
                    <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem' }}>Accueil</Link>
                            <ChevronRight size={14} color="rgba(255,255,255,0.5)" />
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }}>Contact</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MessageSquare size={28} color="white" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: 'white', margin: 0 }}>
                                    Contactez-nous
                                </h1>
                                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', margin: '0.25rem 0 0' }}>
                                    Notre équipe vous répond dans les 48h ouvrées
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-main" style={{ padding: '2.5rem 1rem 4rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.75rem' }} className="contact-grid">

                        {/* ---- FORMULAIRE ---- */}
                        <div style={{ background: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-card)', padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                            {formState === 'success' ? (
                                /* Message succès */
                                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                    <div style={{
                                        width: '72px', height: '72px', borderRadius: '50%',
                                        background: '#dcf0e4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 1.25rem',
                                    }}>
                                        <CheckCircle size={36} color="var(--color-primary)" />
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-gray-900)', margin: '0 0 0.75rem' }}>
                                        Message envoyé ! ✅
                                    </h2>
                                    <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                                        Merci pour votre message, <strong>{formData.nom}</strong>. Notre équipe vous répondra
                                        à l&apos;adresse <strong>{formData.email}</strong> dans les 48 heures ouvrées.
                                    </p>
                                    <button
                                        onClick={() => { setFormState('idle'); setFormData({ nom: '', email: '', telephone: '', sujet: 'general', message: '' }) }}
                                        className="btn btn-outline"
                                    >
                                        Envoyer un autre message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-gray-900)', margin: '0 0 1.75rem' }}>
                                        Envoyer un message
                                    </h2>
                                    <form onSubmit={handleSubmit}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                            {/* Nom */}
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="nom">Nom complet *</label>
                                                <input
                                                    id="nom" name="nom" type="text"
                                                    className="form-input"
                                                    placeholder="Ex : Jean-Baptiste Akoué"
                                                    value={formData.nom}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            {/* Email */}
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="email">Email *</label>
                                                <input
                                                    id="email" name="email" type="email"
                                                    className="form-input"
                                                    placeholder="votre@email.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                            {/* Téléphone */}
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="telephone">Téléphone (optionnel)</label>
                                                <input
                                                    id="telephone" name="telephone" type="tel"
                                                    className="form-input"
                                                    placeholder="+229 XX XX XX XX"
                                                    value={formData.telephone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {/* Sujet */}
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="sujet">Sujet *</label>
                                                <select
                                                    id="sujet" name="sujet"
                                                    className="form-select"
                                                    value={formData.sujet}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    {sujets.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                                            <label className="form-label" htmlFor="message">Votre message *</label>
                                            <textarea
                                                id="message" name="message"
                                                className="form-textarea"
                                                placeholder="Décrivez votre demande en détail…"
                                                style={{ minHeight: '150px' }}
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            />
                                            <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-400)' }}>
                                                {formData.message.length}/1000 caractères
                                            </span>
                                        </div>

                                        {/* Mentions légales */}
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-400)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                                            En envoyant ce formulaire, vous acceptez que vos données soient utilisées pour traiter votre demande,
                                            conformément à notre <Link href="/confidentialite" style={{ color: 'var(--color-primary)' }}>politique de confidentialité</Link>.
                                        </p>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg btn-full"
                                            disabled={formState === 'submitting'}
                                        >
                                            {formState === 'submitting' ? (
                                                <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Envoi en cours…</>
                                            ) : (
                                                <><Send size={18} /> Envoyer le message</>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* ---- INFOS CONTACT ---- */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* Coordonnées */}
                            <div style={{ background: 'white', borderRadius: '18px', boxShadow: 'var(--shadow-card)', padding: '1.75rem' }}>
                                <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--color-gray-900)', margin: '0 0 1.25rem' }}>
                                    Nous trouver
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                                    {[
                                        {
                                            icon: <MapPin size={20} color="var(--color-primary)" />,
                                            label: 'Adresse',
                                            value: 'Mairie des Aguégués, Commune des Aguégués, Département de l\'Ouémé, Bénin',
                                        },
                                        {
                                            icon: <Mail size={20} color="var(--color-primary)" />,
                                            label: 'Email',
                                            value: 'contact@aganer.org',
                                            href: 'mailto:contact@aganer.org',
                                        },
                                        {
                                            icon: <Phone size={20} color="var(--color-primary)" />,
                                            label: 'Téléphone',
                                            value: '+229 XX XX XX XX',
                                            href: 'tel:+229XXXXXXXX',
                                        },
                                        {
                                            icon: <Clock size={20} color="var(--color-primary)" />,
                                            label: 'Horaires',
                                            value: 'Lun – Ven : 8h00 – 17h00',
                                        },
                                    ].map(({ icon, label, value, href }) => (
                                        <div key={label} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                {icon}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{label}</div>
                                                {href ? (
                                                    <a href={href} style={{ fontSize: '0.9375rem', color: 'var(--color-gray-700)', fontWeight: 500, textDecoration: 'none' }}>{value}</a>
                                                ) : (
                                                    <div style={{ fontSize: '0.9375rem', color: 'var(--color-gray-700)', fontWeight: 500, lineHeight: 1.5 }}>{value}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Réseaux sociaux */}
                            <div style={{ background: 'white', borderRadius: '18px', boxShadow: 'var(--shadow-card)', padding: '1.75rem' }}>
                                <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--color-gray-900)', margin: '0 0 1.25rem' }}>
                                    Suivez-nous
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    {[
                                        { icon: <Facebook size={20} />, label: 'Facebook', handle: '@aganer.benin', couleur: '#1877f2', bg: '#e7f0fd', href: '#' },
                                        { icon: <Twitter size={20} />, label: 'Twitter / X', handle: '@aganer_bj', couleur: '#1da1f2', bg: '#e8f5fd', href: '#' },
                                        { icon: <Linkedin size={20} />, label: 'LinkedIn', handle: 'ONG AGANER', couleur: '#0a66c2', bg: '#e8f0fa', href: '#' },
                                    ].map(({ icon, label, handle, couleur, bg, href }) => (
                                        <a key={label} href={href} style={{
                                            display: 'flex', alignItems: 'center', gap: '0.875rem',
                                            padding: '0.75rem 1rem', borderRadius: '12px', textDecoration: 'none',
                                            background: bg, transition: 'transform 0.15s',
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                                        >
                                            <div style={{ color: couleur }}>{icon}</div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-gray-800)' }}>{label}</div>
                                                <div style={{ fontSize: '0.8125rem', color: couleur }}>{handle}</div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ rapide */}
                            <div style={{ background: 'linear-gradient(135deg, var(--color-primary-50) 0%, #f5f8ff 100%)', border: '1px solid var(--color-primary-200)', borderRadius: '16px', padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: '0 0 0.875rem' }}>
                                    Questions fréquentes
                                </h3>
                                {[
                                    { q: 'Comment créer un compte ?', href: '/inscription' },
                                    { q: 'Qui peut s\'inscrire ?', href: '/a-propos' },
                                    { q: 'Mes données sont-elles sécurisées ?', href: '/confidentialite' },
                                ].map(({ q, href }) => (
                                    <Link key={q} href={href} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '0.5rem 0', borderBottom: '1px solid var(--color-primary-100)',
                                        textDecoration: 'none', color: 'var(--color-primary)', fontWeight: 500, fontSize: '0.875rem',
                                        gap: '0.5rem',
                                    }}>
                                        {q}
                                        <ChevronRight size={15} style={{ flexShrink: 0 }} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <style>{`
        @media (min-width: 900px) {
          .contact-grid { grid-template-columns: 1fr 360px !important; }
        }
      `}</style>
        </>
    )
}
