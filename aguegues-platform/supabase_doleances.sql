-- ══════════════════════════════════════════════════════
-- SCRIPT SQL — Portail des Aguégués
-- À exécuter dans : Supabase > SQL Editor
-- ══════════════════════════════════════════════════════

-- 1. Table doléances citoyennes
CREATE TABLE IF NOT EXISTS doleances (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom         TEXT,                           -- optionnel (anonyme possible)
  localite    TEXT NOT NULL,
  probleme    TEXT NOT NULL,
  urgence     TEXT DEFAULT 'moyen'
              CHECK (urgence IN ('faible','moyen','urgent','critique')),
  proposition TEXT,
  latitude    FLOAT,
  longitude   FLOAT,
  media_url   TEXT,
  statut      TEXT DEFAULT 'en_attente'
              CHECK (statut IN ('en_attente','en_cours','résolu')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Activer RLS (Row Level Security)
ALTER TABLE doleances ENABLE ROW LEVEL SECURITY;

-- 3. Permettre à tout le monde d'insérer (formulaire public)
CREATE POLICY "Insertion publique doleances"
  ON doleances FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 4. Permettre la lecture publique (suivi)
CREATE POLICY "Lecture publique doleances"
  ON doleances FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5. Seul l'admin peut mettre à jour le statut
CREATE POLICY "Admin update statut"
  ON doleances FOR UPDATE
  TO authenticated
  USING (auth.email() = 'votre-email-admin@example.com');

-- 6. Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER doleances_updated_at
  BEFORE UPDATE ON doleances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 7. Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_doleances_statut ON doleances(statut);
CREATE INDEX IF NOT EXISTS idx_doleances_urgence ON doleances(urgence);
CREATE INDEX IF NOT EXISTS idx_doleances_localite ON doleances(localite);

-- ══════════════════════════════════════════════════════
-- STORAGE : Bucket pour les médias (photos/vidéos)
-- Créer manuellement dans Supabase > Storage > New Bucket
-- Nom du bucket : doleances-media
-- Type : Public (pour accès direct aux images)
-- ══════════════════════════════════════════════════════
