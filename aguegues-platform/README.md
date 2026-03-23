# AGANER — Plateforme des Talents d'Aguégués

> Annuaire numérique des cadres et jeunes talents de la Commune des Aguégués (Bénin)

Une plateforme web moderne développée avec **Next.js 15**, **TypeScript**, **Tailwind CSS v4** et **Supabase**, portée par l'ONG AGANER en partenariat avec la Mairie des Aguégués.

## ✨ Fonctionnalités

- 📋 **Annuaire des Cadres** — Hauts cadres professionnels de la commune (médecins, ingénieurs, enseignants…)
- 🎯 **Annuaire des Jeunes Talents** — Étudiants, jeunes diplômés et jeunes actifs
- 📰 **Actualités** — Articles, opportunités, nominations, événements
- 📬 **Contact** — Formulaire connecté à Supabase
- 🔐 **Authentification complète** — Inscription en 3 étapes, connexion sécurisée
- 🗂️ **Dashboard utilisateur** — Gestion du profil, visibilité, sécurité
- 🛡️ **Panel Admin** — Validation des profils, gestion des utilisateurs, CMS articles

## 🛠️ Stack technique

| Outil | Version |
|---|---|
| Next.js | 15 (App Router) |
| TypeScript | 5 |
| Tailwind CSS | v4 |
| Supabase | Auth + PostgreSQL + RLS |
| Lucide React | Icons |

## 🚀 Démarrage local

```bash
# Cloner le projet
git clone https://github.com/VOTRE_USERNAME/aguegues-platform.git
cd aguegues-platform

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## ⚙️ Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🗄️ Base de données

Le schéma SQL complet se trouve dans `supabase/schema.sql`. À exécuter dans **Supabase SQL Editor**.

Tables principales :
- `profiles` — Tous les utilisateurs
- `profiles_cadres` — Données spécifiques cadres
- `profiles_jeunes` — Données spécifiques jeunes talents
- `articles` — Actualités et articles
- `messages_contact` — Formulaire de contact

## 🌐 Déploiement

Ce projet est déployé sur **Vercel** avec intégration GitHub (déploiement automatique à chaque push).

Les variables d'environnement doivent être configurées dans les **Settings du projet Vercel**.

---

Développé avec ❤️ pour la Commune des Aguégués · [aganer.org](https://aganer.org)
