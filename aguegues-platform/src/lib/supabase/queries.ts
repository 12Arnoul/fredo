// Fonctions utilitaires pour accéder aux données Supabase
import { createClient } from './client'
import type { FiltresAnnuaire, MessageContact } from './types'

// ==========================================
// PROFILES — Annuaires
// ==========================================

/**
 * Récupère la liste des profils validés (avec jointure cadres/jeunes)
 */
export async function getProfiles(filtres?: FiltresAnnuaire) {
    const supabase = createClient()

    let query = supabase
        .from('profiles')
        .select(`
      *,
      profiles_cadres (*),
      profiles_jeunes (*)
    `)
        .eq('statut', 'valide')

    if (filtres?.type) {
        query = query.eq('type', filtres.type)
    }
    if (filtres?.secteur && filtres.secteur !== 'tous') {
        query = query.eq('secteur_activite', filtres.secteur)
    }
    if (filtres?.ville && filtres.ville !== 'tous') {
        query = query.eq('ville_residence', filtres.ville)
    }
    if (filtres?.recherche) {
        query = query.or(
            `nom.ilike.%${filtres.recherche}%,prenom.ilike.%${filtres.recherche}%,bio.ilike.%${filtres.recherche}%`
        )
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) {
        console.error('Erreur getProfiles:', error)
        return []
    }
    return data || []
}

/**
 * Récupère un profil unique par ID (avec détails cadre/jeune)
 */
export async function getProfileById(id: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select(`
      *,
      profiles_cadres (*),
      profiles_jeunes (*)
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Erreur getProfileById:', error)
        return null
    }
    return data
}

/**
 * Récupère le profil de l'utilisateur actuellement connecté
 */
export async function getMonProfil() {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select(`
      *,
      profiles_cadres (*),
      profiles_jeunes (*)
    `)
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Erreur getMonProfil:', error)
        return null
    }
    return data
}

/**
 * Met à jour le profil de l'utilisateur connecté
 */
export async function mettreAJourProfil(data: Partial<{
    nom: string; prenom: string; telephone: string
    ville_residence: string; pays_residence: string
    bio: string; linkedin_url: string; disponible: boolean
}>) {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non connecté')

    const { error } = await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id)

    if (error) throw error
}

// ==========================================
// ARTICLES — Actualités
// ==========================================

/**
 * Récupère tous les articles publiés
 */
export async function getArticles(categorie?: string) {
    const supabase = createClient()

    let query = supabase
        .from('articles')
        .select('*')
        .eq('publie', true)
        .order('created_at', { ascending: false })

    if (categorie && categorie !== 'tous') {
        query = query.eq('categorie', categorie)
    }

    const { data, error } = await query
    if (error) {
        console.error('Erreur getArticles:', error)
        return []
    }
    return data || []
}

/**
 * Récupère un article par son slug
 */
export async function getArticleBySlug(slug: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('publie', true)
        .single()

    if (error) {
        console.error('Erreur getArticleBySlug:', error)
        return null
    }
    return data
}

// ==========================================
// MESSAGES CONTACT
// ==========================================

/**
 * Envoie un message de contact dans la base de données
 */
export async function envoyerMessage(message: MessageContact) {
    const supabase = createClient()

    const { error } = await supabase
        .from('messages_contact')
        .insert([{
            nom: message.nom,
            email: message.email,
            sujet: message.sujet || null,
            message: message.message,
        }])

    if (error) throw error
}

// ==========================================
// STATISTIQUES ADMIN
// ==========================================

/**
 * Récupère les stats pour le tableau de bord admin
 */
export async function getStatsAdmin() {
    const supabase = createClient()

    const [
        { count: total },
        { count: cadres },
        { count: jeunes },
        { count: enAttente },
        { count: messages },
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('type', 'cadre'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('type', 'jeune'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
        supabase.from('messages_contact').select('*', { count: 'exact', head: true }).eq('lu', false),
    ])

    return {
        total: total || 0,
        cadres: cadres || 0,
        jeunes: jeunes || 0,
        enAttente: enAttente || 0,
        messagesNonLus: messages || 0,
    }
}

/**
 * Récupère tous les utilisateurs pour l'admin (avec filtre)
 */
export async function getUtilisateursAdmin(statut?: string) {
    const supabase = createClient()

    let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (statut && statut !== 'tous') {
        query = query.eq('statut', statut)
    }

    const { data, error } = await query
    if (error) {
        console.error('Erreur getUtilisateursAdmin:', error)
        return []
    }
    return data || []
}

/**
 * Change le statut d'un utilisateur (valider/refuser)
 */
export async function changerStatutUtilisateur(userId: string, statut: 'valide' | 'en_attente' | 'suspendu') {
    const supabase = createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ statut })
        .eq('id', userId)

    if (error) throw error
}

/**
 * Récupère tous les articles pour l'admin (publiés et brouillons)
 */
export async function getArticlesAdmin() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Erreur getArticlesAdmin:', error)
        return []
    }
    return data || []
}
