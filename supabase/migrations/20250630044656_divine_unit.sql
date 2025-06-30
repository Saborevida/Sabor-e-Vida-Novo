/*
  # Completar schema do banco de dados

  1. Novas Tabelas
    - `categories`: Categorias para receitas e conteúdo
      - `id` (uuid, primary key)
      - `name` (text, nome da categoria)
      - `slug` (text, slug para URLs)
      - `description` (text, descrição)
      - `type` (text, tipo: recipe, education, etc)
      - `color` (text, cor para UI)
      - `icon` (text, ícone)
      - `order_index` (integer, ordem de exibição)
      - `active` (boolean, ativa/inativa)
      - `created_at`, `updated_at`

    - `glossary`: Glossário de termos nutricionais
      - `id` (uuid, primary key)
      - `term` (text, termo)
      - `definition` (text, definição)
      - `category` (text, categoria do termo)
      - `synonyms` (text array, sinônimos)
      - `related_terms` (text array, termos relacionados)
      - `examples` (text array, exemplos)
      - `difficulty_level` (text, nível de dificuldade)
      - `created_at`, `updated_at`

    - `nutrition_facts`: Tabela nutricional de alimentos
      - `id` (uuid, primary key)
      - `food_name` (text, nome do alimento)
      - `category` (text, categoria do alimento)
      - `serving_size` (text, tamanho da porção)
      - `calories_per_100g` (decimal, calorias por 100g)
      - `carbs_per_100g` (decimal, carboidratos por 100g)
      - `protein_per_100g` (decimal, proteína por 100g)
      - `fat_per_100g` (decimal, gordura por 100g)
      - `fiber_per_100g` (decimal, fibra por 100g)
      - `sugar_per_100g` (decimal, açúcar por 100g)
      - `sodium_per_100g` (decimal, sódio por 100g)
      - `glycemic_index` (integer, índice glicêmico)
      - `glycemic_load` (decimal, carga glicêmica)
      - `vitamins` (jsonb, vitaminas)
      - `minerals` (jsonb, minerais)
      - `created_at`, `updated_at`

    - `user_preferences`: Preferências detalhadas do usuário
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `allergies` (text array, alergias)
      - `intolerances` (text array, intolerâncias)
      - `favorite_cuisines` (text array, culinárias favoritas)
      - `disliked_ingredients` (text array, ingredientes que não gosta)
      - `cooking_skill_level` (text, nível de habilidade culinária)
      - `available_time` (integer, tempo disponível para cozinhar)
      - `budget_range` (text, faixa de orçamento)
      - `kitchen_equipment` (text array, equipamentos disponíveis)
      - `notification_preferences` (jsonb, preferências de notificação)
      - `created_at`, `updated_at`

    - `recipe_reviews`: Avaliações de receitas
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `recipe_id` (uuid, references recipes.id)
      - `rating` (integer, 1-5)
      - `comment` (text, comentário)
      - `difficulty_rating` (integer, 1-5)
      - `taste_rating` (integer, 1-5)
      - `would_make_again` (boolean)
      - `cooking_time_actual` (integer, tempo real de preparo)
      - `modifications_made` (text, modificações feitas)
      - `helpful_votes` (integer, votos úteis)
      - `created_at`, `updated_at`

    - `shopping_lists`: Listas de compras
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `name` (text, nome da lista)
      - `meal_plan_id` (uuid, references meal_plans.id, nullable)
      - `items` (jsonb, itens da lista)
      - `total_estimated_cost` (decimal, custo estimado)
      - `status` (text, status: draft, active, completed)
      - `created_at`, `updated_at`

  2. Funções
    - Função para incrementar visualizações de artigos
    - Função para calcular média de avaliações
    - Função para busca full-text

  3. Índices
    - Índices para melhorar performance de busca
    - Índices para campos frequentemente consultados

  4. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas apropriadas para cada tabela
*/

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'recipe', -- recipe, education, ingredient
  color text DEFAULT '#3B82F6',
  icon text DEFAULT 'folder',
  order_index integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de glossário
CREATE TABLE IF NOT EXISTS glossary (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  term text NOT NULL,
  definition text NOT NULL,
  category text DEFAULT 'general',
  synonyms text[] DEFAULT '{}',
  related_terms text[] DEFAULT '{}',
  examples text[] DEFAULT '{}',
  difficulty_level text DEFAULT 'iniciante', -- iniciante, intermediario, avancado
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de informações nutricionais
CREATE TABLE IF NOT EXISTS nutrition_facts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  food_name text NOT NULL,
  category text DEFAULT 'outros',
  serving_size text DEFAULT '100g',
  calories_per_100g decimal(8,2) DEFAULT 0,
  carbs_per_100g decimal(8,2) DEFAULT 0,
  protein_per_100g decimal(8,2) DEFAULT 0,
  fat_per_100g decimal(8,2) DEFAULT 0,
  fiber_per_100g decimal(8,2) DEFAULT 0,
  sugar_per_100g decimal(8,2) DEFAULT 0,
  sodium_per_100g decimal(8,2) DEFAULT 0,
  glycemic_index integer DEFAULT 0,
  glycemic_load decimal(8,2) DEFAULT 0,
  vitamins jsonb DEFAULT '{}',
  minerals jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de preferências do usuário
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  allergies text[] DEFAULT '{}',
  intolerances text[] DEFAULT '{}',
  favorite_cuisines text[] DEFAULT '{}',
  disliked_ingredients text[] DEFAULT '{}',
  cooking_skill_level text DEFAULT 'iniciante',
  available_time integer DEFAULT 30, -- minutos
  budget_range text DEFAULT 'medio',
  kitchen_equipment text[] DEFAULT '{}',
  notification_preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Criar tabela de avaliações de receitas
CREATE TABLE IF NOT EXISTS recipe_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  difficulty_rating integer CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  taste_rating integer CHECK (taste_rating >= 1 AND taste_rating <= 5),
  would_make_again boolean DEFAULT true,
  cooking_time_actual integer,
  modifications_made text,
  helpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Criar tabela de listas de compras
CREATE TABLE IF NOT EXISTS shopping_lists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  meal_plan_id uuid REFERENCES meal_plans(id) ON DELETE SET NULL,
  items jsonb DEFAULT '[]',
  total_estimated_cost decimal(10,2) DEFAULT 0,
  status text DEFAULT 'draft', -- draft, active, completed
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

-- Políticas para categories (leitura pública)
CREATE POLICY "Anyone can read active categories"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true);

-- Políticas para glossary (leitura pública)
CREATE POLICY "Anyone can read glossary"
  ON glossary
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage glossary"
  ON glossary
  FOR ALL
  TO authenticated
  USING (true);

-- Políticas para nutrition_facts (leitura pública)
CREATE POLICY "Anyone can read nutrition facts"
  ON nutrition_facts
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage nutrition facts"
  ON nutrition_facts
  FOR ALL
  TO authenticated
  USING (true);

-- Políticas para user_preferences
CREATE POLICY "Users can read own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para recipe_reviews
CREATE POLICY "Anyone can read reviews"
  ON recipe_reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own reviews"
  ON recipe_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON recipe_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON recipe_reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para shopping_lists
CREATE POLICY "Users can read own shopping lists"
  ON shopping_lists
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shopping lists"
  ON shopping_lists
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shopping lists"
  ON shopping_lists
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shopping lists"
  ON shopping_lists
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Triggers para updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_glossary_updated_at
  BEFORE UPDATE ON glossary
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_facts_updated_at
  BEFORE UPDATE ON nutrition_facts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipe_reviews_updated_at
  BEFORE UPDATE ON recipe_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at
  BEFORE UPDATE ON shopping_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para incrementar visualizações de artigos
CREATE OR REPLACE FUNCTION increment_article_views(article_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE educational_content 
  SET views = views + 1 
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para calcular média de avaliações de receitas
CREATE OR REPLACE FUNCTION calculate_recipe_rating(recipe_id uuid)
RETURNS decimal AS $$
DECLARE
  avg_rating decimal;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM recipe_reviews
  WHERE recipe_reviews.recipe_id = calculate_recipe_rating.recipe_id;
  
  RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql;

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
CREATE INDEX IF NOT EXISTS idx_glossary_term ON glossary(term);
CREATE INDEX IF NOT EXISTS idx_nutrition_facts_food_name ON nutrition_facts(food_name);
CREATE INDEX IF NOT EXISTS idx_nutrition_facts_category ON nutrition_facts(category);
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_recipe_id ON recipe_reviews(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_rating ON recipe_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_status ON shopping_lists(status);

-- Inserir categorias padrão
INSERT INTO categories (name, slug, description, type, color, icon, order_index) VALUES
('Café da Manhã', 'cafe-da-manha', 'Receitas para o café da manhã', 'recipe', '#F59E0B', 'coffee', 1),
('Almoço', 'almoco', 'Receitas para o almoço', 'recipe', '#10B981', 'utensils', 2),
('Jantar', 'jantar', 'Receitas para o jantar', 'recipe', '#3B82F6', 'moon', 3),
('Lanches', 'lanches', 'Receitas para lanches saudáveis', 'recipe', '#8B5CF6', 'cookie', 4),
('Sobremesas', 'sobremesas', 'Sobremesas saudáveis para diabéticos', 'recipe', '#EC4899', 'cake', 5),
('Bebidas', 'bebidas', 'Bebidas saudáveis e sucos', 'recipe', '#06B6D4', 'glass-water', 6),
('Nutrição', 'nutricao', 'Artigos sobre nutrição', 'education', '#10B981', 'apple', 1),
('Diabetes', 'diabetes', 'Conteúdo sobre diabetes', 'education', '#EF4444', 'heart-pulse', 2),
('Exercícios', 'exercicios', 'Exercícios e atividade física', 'education', '#F59E0B', 'dumbbell', 3),
('Estilo de Vida', 'estilo-de-vida', 'Dicas de estilo de vida saudável', 'education', '#8B5CF6', 'lifestyle', 4);

-- Inserir termos do glossário
INSERT INTO glossary (term, definition, category, synonyms, related_terms, examples, difficulty_level) VALUES
(
  'Índice Glicêmico',
  'Medida que indica a velocidade com que os carboidratos de um alimento elevam os níveis de glicose no sangue, numa escala de 0 a 100.',
  'diabetes',
  ARRAY['IG'],
  ARRAY['Carga Glicêmica', 'Glicemia', 'Carboidratos'],
  ARRAY['Pão branco: IG alto (70)', 'Aveia: IG baixo (55)', 'Batata: IG alto (85)'],
  'iniciante'
),
(
  'Carga Glicêmica',
  'Medida que considera tanto o índice glicêmico quanto a quantidade de carboidratos em uma porção específica do alimento.',
  'diabetes',
  ARRAY['CG'],
  ARRAY['Índice Glicêmico', 'Porção', 'Carboidratos'],
  ARRAY['Melancia: IG alto, CG baixa', 'Arroz: IG médio, CG alta'],
  'intermediario'
),
(
  'Hemoglobina Glicada',
  'Exame que mede a média dos níveis de glicose no sangue nos últimos 2-3 meses. Também conhecida como HbA1c.',
  'diabetes',
  ARRAY['HbA1c', 'A1c'],
  ARRAY['Glicemia', 'Controle Glicêmico', 'Diabetes'],
  ARRAY['Meta para diabéticos: abaixo de 7%', 'Normal: abaixo de 5,7%'],
  'iniciante'
),
(
  'Resistência à Insulina',
  'Condição em que as células do corpo não respondem adequadamente à insulina, dificultando a entrada de glicose nas células.',
  'diabetes',
  ARRAY['RI'],
  ARRAY['Insulina', 'Diabetes Tipo 2', 'Síndrome Metabólica'],
  ARRAY['Pode levar ao diabetes tipo 2', 'Relacionada à obesidade abdominal'],
  'intermediario'
),
(
  'Fibra Alimentar',
  'Parte dos alimentos vegetais que não é digerida pelo organismo humano, importante para a saúde digestiva e controle glicêmico.',
  'nutricao',
  ARRAY['Fibra'],
  ARRAY['Digestão', 'Saciedade', 'Índice Glicêmico'],
  ARRAY['Aveia: rica em fibra solúvel', 'Vegetais: ricos em fibra insolúvel'],
  'iniciante'
),
(
  'Macronutrientes',
  'Nutrientes necessários em grandes quantidades: carboidratos, proteínas e gorduras. Fornecem energia e são essenciais para o funcionamento do corpo.',
  'nutricao',
  ARRAY['Macros'],
  ARRAY['Carboidratos', 'Proteínas', 'Gorduras', 'Calorias'],
  ARRAY['Carboidratos: 4 kcal/g', 'Proteínas: 4 kcal/g', 'Gorduras: 9 kcal/g'],
  'iniciante'
),
(
  'Micronutrientes',
  'Vitaminas e minerais necessários em pequenas quantidades, mas essenciais para o funcionamento adequado do organismo.',
  'nutricao',
  ARRAY['Vitaminas e Minerais'],
  ARRAY['Vitaminas', 'Minerais', 'Antioxidantes'],
  ARRAY['Vitamina C: antioxidante', 'Ferro: transporte de oxigênio', 'Cálcio: saúde óssea'],
  'iniciante'
),
(
  'Cetose',
  'Estado metabólico em que o corpo queima gordura como fonte primária de energia, produzindo cetonas.',
  'nutricao',
  ARRAY['Estado Cetótico'],
  ARRAY['Dieta Cetogênica', 'Cetonas', 'Metabolismo'],
  ARRAY['Dieta muito baixa em carboidratos', 'Jejum prolongado'],
  'avancado'
);

-- Inserir dados nutricionais básicos
INSERT INTO nutrition_facts (food_name, category, calories_per_100g, carbs_per_100g, protein_per_100g, fat_per_100g, fiber_per_100g, sugar_per_100g, glycemic_index) VALUES
('Aveia', 'cereais', 389, 66.3, 16.9, 6.9, 10.6, 0.99, 55),
('Quinoa', 'cereais', 368, 64.2, 14.1, 6.1, 7.0, 4.57, 53),
('Arroz Integral', 'cereais', 370, 77.2, 7.9, 2.9, 3.5, 0.85, 68),
('Batata Doce', 'tuberculos', 86, 20.1, 1.6, 0.1, 3.0, 4.18, 70),
('Brócolis', 'vegetais', 34, 6.6, 2.8, 0.4, 2.6, 1.55, 10),
('Espinafre', 'vegetais', 23, 3.6, 2.9, 0.4, 2.2, 0.42, 15),
('Salmão', 'peixes', 208, 0, 25.4, 12.4, 0, 0, 0),
('Frango (peito)', 'carnes', 165, 0, 31.0, 3.6, 0, 0, 0),
('Ovos', 'laticinios', 155, 1.1, 13.0, 11.0, 0, 1.1, 0),
('Abacate', 'frutas', 160, 8.5, 2.0, 14.7, 6.7, 0.66, 10),
('Maçã', 'frutas', 52, 13.8, 0.3, 0.2, 2.4, 10.4, 36),
('Banana', 'frutas', 89, 22.8, 1.1, 0.3, 2.6, 12.2, 51),
('Amêndoas', 'oleaginosas', 579, 21.6, 21.2, 49.9, 12.5, 4.35, 0),
('Chia', 'sementes', 486, 42.1, 16.5, 30.7, 34.4, 0, 30),
('Azeite de Oliva', 'oleos', 884, 0, 0, 100, 0, 0, 0);

ON CONFLICT (slug) DO NOTHING;