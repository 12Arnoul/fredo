// Types TypeScript — correspondant au schéma Supabase

export type ProfileType = 'cadre' | 'jeune'
export type ProfileStatut = 'en_attente' | 'valide' | 'suspendu'
export type StatutEmploi = 'en_poste' | 'cherche_emploi' | 'etudiant' | 'entrepreneur'
export type ArticleCategorie = 'actualite' | 'opportunite' | 'nomination' | 'evenement'

export interface Profile {
    id: string
    type: ProfileType
    statut: ProfileStatut
    nom: string
    prenom: string
    photo_url: string | null
    date_naissance: string | null
    village_origine: string | null
    ville_residence: string | null
    pays_residence: string
    telephone: string | null
    telephone_public: boolean
    email_public: boolean
    linkedin_url: string | null
    bio: string | null
    niveau_etudes: string | null
    diplomes: string[] | null
    etablissements: string[] | null
    secteur_activite: string | null
    created_at: string
    updated_at: string
}

export interface ProfileCadre {
    id: string
    poste_actuel: string | null
    employeur: string | null
    employeur_public: boolean
    domaine_expertise: string | null
    annees_experience: number | null
    realisations: string | null
    created_at: string
}

export interface ProfileJeune {
    id: string
    statut_emploi: StatutEmploi | null
    competences: string[] | null
    cv_url: string | null
    cv_public: boolean
    ouvert_opportunites: boolean
    created_at: string
}

export interface ProfileComplet extends Profile {
    profiles_cadres?: ProfileCadre | null
    profiles_jeunes?: ProfileJeune | null
}

export interface Article {
    id: string
    titre: string
    contenu: string
    extrait: string | null
    image_url: string | null
    categorie: ArticleCategorie
    publie: boolean
    slug: string
    auteur_id: string | null
    created_at: string
    updated_at: string
}

export interface MessageContact {
    id?: string
    nom: string
    email: string
    sujet?: string
    message: string
    lu?: boolean
    created_at?: string
}

// Type pour les filtres de l'annuaire
export interface FiltresAnnuaire {
    type?: ProfileType
    secteur?: string
    ville?: string
    disponible?: boolean
    recherche?: string
}
