/*
  # Criar tabela de conteúdo educativo

  1. Nova Tabela
    - `educational_content`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `excerpt` (text, not null)
      - `content` (text, not null) - conteúdo completo do artigo
      - `category` (text, not null)
      - `difficulty` (text, not null)
      - `read_time` (integer, not null) - tempo de leitura em minutos
      - `rating` (decimal, default 0)
      - `views` (integer, default 0)
      - `image_url` (text)
      - `tags` (text array, default empty)
      - `author` (text)
      - `published` (boolean, default false)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Segurança
    - Habilitar RLS na tabela
    - Adicionar políticas para leitura pública de conteúdo publicado
    - Adicionar políticas para administradores gerenciarem conteúdo

  3. Dados de Exemplo
    - Inserir alguns artigos de exemplo para testar
*/

-- Criar tabela de conteúdo educativo
CREATE TABLE IF NOT EXISTS educational_content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL DEFAULT 'Iniciante',
  read_time integer NOT NULL DEFAULT 5,
  rating decimal(3,2) DEFAULT 0.0,
  views integer DEFAULT 0,
  image_url text,
  tags text[] DEFAULT '{}',
  author text DEFAULT 'Equipe Sabor & Vida',
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública de conteúdo publicado
CREATE POLICY "Anyone can read published content"
  ON educational_content
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Política para usuários autenticados inserirem conteúdo
CREATE POLICY "Authenticated users can insert content"
  ON educational_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para usuários autenticados atualizarem conteúdo
CREATE POLICY "Authenticated users can update content"
  ON educational_content
  FOR UPDATE
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_educational_content_updated_at
  BEFORE UPDATE ON educational_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo
INSERT INTO educational_content (title, excerpt, content, category, difficulty, read_time, rating, views, image_url, tags) VALUES
(
  'Índice Glicêmico: O que é e como usar na sua alimentação',
  'Entenda como o índice glicêmico dos alimentos afeta seus níveis de açúcar no sangue e aprenda a fazer escolhas mais inteligentes.',
  '# Índice Glicêmico: O que é e como usar na sua alimentação

O índice glicêmico (IG) é uma medida que indica a velocidade com que os carboidratos de um alimento elevam os níveis de glicose no sangue. Esta ferramenta é fundamental para pessoas com diabetes, pois permite fazer escolhas alimentares mais conscientes.

## O que é o Índice Glicêmico?

O IG classifica os alimentos em uma escala de 0 a 100, baseada na velocidade com que elevam a glicemia:

- **IG Baixo (0-55)**: Absorção lenta, menor impacto na glicemia
- **IG Médio (56-69)**: Absorção moderada
- **IG Alto (70-100)**: Absorção rápida, maior impacto na glicemia

## Como usar na prática

### Alimentos de IG Baixo (Prefira)
- Aveia
- Quinoa
- Batata doce
- Maçã
- Feijões e lentilhas

### Alimentos de IG Alto (Evite ou consuma com moderação)
- Pão branco
- Arroz branco
- Batata inglesa
- Melancia
- Açúcar refinado

## Dicas importantes

1. **Combine alimentos**: Misture carboidratos com proteínas e fibras
2. **Porção importa**: Mesmo alimentos de IG baixo podem elevar a glicemia se consumidos em excesso
3. **Preparo influencia**: Cozimento prolongado pode aumentar o IG
4. **Individualidade**: Cada pessoa pode reagir diferentemente aos alimentos

## Conclusão

O índice glicêmico é uma ferramenta valiosa, mas deve ser usado junto com outras estratégias nutricionais. Consulte sempre um nutricionista para um plano personalizado.',
  'diabetes',
  'Iniciante',
  8,
  4.8,
  1250,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['índice glicêmico', 'controle glicêmico', 'alimentação', 'diabetes']
),
(
  'Carboidratos Complexos vs Simples: Qual a diferença?',
  'Descubra as diferenças entre carboidratos complexos e simples e como cada tipo afeta seu organismo.',
  '# Carboidratos Complexos vs Simples: Qual a diferença?

Os carboidratos são a principal fonte de energia do nosso corpo, mas nem todos são iguais. Entender a diferença entre carboidratos complexos e simples é fundamental para uma alimentação saudável, especialmente para diabéticos.

## Carboidratos Simples

### Características
- Estrutura molecular pequena
- Absorção rápida
- Elevação rápida da glicemia
- Energia de curta duração

### Exemplos
- Açúcar refinado
- Mel
- Frutas (frutose)
- Leite (lactose)
- Doces e refrigerantes

## Carboidratos Complexos

### Características
- Estrutura molecular grande
- Absorção lenta
- Elevação gradual da glicemia
- Energia de longa duração
- Rico em fibras

### Exemplos
- Aveia
- Quinoa
- Arroz integral
- Batata doce
- Leguminosas

## Impacto na Diabetes

### Carboidratos Simples
- Causam picos de glicemia
- Podem descompensar o diabetes
- Devem ser evitados ou consumidos com moderação

### Carboidratos Complexos
- Fornecem energia estável
- Melhor controle glicêmico
- Devem ser a base da alimentação

## Estratégias Práticas

1. **Substitua gradualmente**: Troque arroz branco por integral
2. **Leia rótulos**: Evite produtos com açúcar adicionado
3. **Combine com fibras**: Adicione vegetais às refeições
4. **Horários regulares**: Mantenha consistência nas refeições

## Conclusão

Priorizar carboidratos complexos é uma estratégia fundamental para o controle da diabetes e manutenção da saúde geral.',
  'nutrition',
  'Iniciante',
  6,
  4.9,
  980,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['carboidratos', 'nutrição', 'metabolismo', 'diabetes']
),
(
  'Técnicas de Cocção que Preservam Nutrientes',
  'Aprenda métodos de preparo que mantêm os nutrientes dos alimentos e potencializam seus benefícios.',
  '# Técnicas de Cocção que Preservam Nutrientes

A forma como preparamos os alimentos pode influenciar significativamente seu valor nutricional. Conhecer as técnicas adequadas é essencial para maximizar os benefícios dos nutrientes.

## Por que a cocção importa?

O calor pode:
- Destruir vitaminas sensíveis
- Alterar a estrutura dos nutrientes
- Reduzir antioxidantes
- Modificar a biodisponibilidade

## Técnicas Recomendadas

### 1. Vapor
**Vantagens:**
- Preserva vitaminas hidrossolúveis
- Mantém cor e textura
- Não adiciona gordura

**Ideal para:** Brócolis, couve-flor, cenoura

### 2. Refogado Rápido
**Vantagens:**
- Cocção rápida preserva nutrientes
- Realça sabores
- Mantém crocância

**Dicas:** Use pouco óleo, fogo alto, tempo curto

### 3. Grelhado
**Vantagens:**
- Remove gordura dos alimentos
- Adiciona sabor sem calorias extras
- Preserva proteínas

**Cuidados:** Evite queimar os alimentos

### 4. Assado em Papillote
**Vantagens:**
- Cozinha no próprio vapor
- Preserva todos os nutrientes
- Intensifica sabores

**Como fazer:** Embrulhe em papel alumínio com temperos

## Técnicas a Evitar

### Fritura
- Adiciona muitas calorias
- Pode formar compostos prejudiciais
- Reduz valor nutricional

### Cozimento Prolongado
- Destrói vitaminas
- Reduz antioxidantes
- Pode formar acrilamida

## Dicas Especiais para Diabéticos

1. **Evite empanados**: Aumentam carboidratos
2. **Use temperos naturais**: Alho, ervas, limão
3. **Prefira métodos secos**: Grelhar, assar
4. **Monitore óleos**: Use com moderação

## Preservação de Vitaminas

### Vitaminas Hidrossolúveis (B, C)
- Cozinhe rapidamente
- Use pouca água
- Aproveite a água do cozimento

### Vitaminas Lipossolúveis (A, D, E, K)
- Adicione um pouco de gordura boa
- Não superaqueça
- Combine com outros nutrientes

## Conclusão

Dominar técnicas de cocção saudáveis é investir na sua saúde. Pequenas mudanças no preparo podem fazer grande diferença no valor nutricional das refeições.',
  'recipes',
  'Intermediário',
  10,
  4.7,
  750,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['cocção', 'nutrientes', 'técnicas culinárias', 'saúde']
),
(
  'Exercícios e Alimentação: A combinação perfeita',
  'Como sincronizar sua alimentação com exercícios físicos para otimizar o controle da diabetes.',
  '# Exercícios e Alimentação: A combinação perfeita

A combinação entre exercícios físicos e alimentação adequada é fundamental para o controle eficaz da diabetes. Esta sinergia pode transformar sua qualidade de vida.

## Benefícios dos Exercícios na Diabetes

### Efeitos Imediatos
- Redução da glicemia
- Melhora da sensibilidade à insulina
- Aumento do consumo de glicose pelos músculos

### Efeitos a Longo Prazo
- Controle glicêmico sustentado
- Redução da hemoglobina glicada
- Melhora da composição corporal
- Redução do risco cardiovascular

## Tipos de Exercícios Recomendados

### Exercícios Aeróbicos
**Exemplos:** Caminhada, natação, ciclismo
**Benefícios:** Melhora cardiovascular, queima de glicose
**Frequência:** 150 minutos por semana

### Exercícios de Resistência
**Exemplos:** Musculação, exercícios com peso corporal
**Benefícios:** Aumento da massa muscular, melhora da sensibilidade à insulina
**Frequência:** 2-3 vezes por semana

## Alimentação Pré-Exercício

### 1-2 Horas Antes
- Carboidrato complexo + proteína
- Exemplo: Aveia com frutas vermelhas

### 30 Minutos Antes
- Lanche leve se necessário
- Exemplo: Banana pequena

### Hidratação
- Beba água antes, durante e após
- Monitore sinais de desidratação

## Alimentação Pós-Exercício

### Primeiros 30 Minutos
- Janela anabólica
- Proteína + carboidrato
- Exemplo: Iogurte com frutas

### 2 Horas Após
- Refeição completa
- Inclua todos os macronutrientes

## Monitoramento da Glicemia

### Antes do Exercício
- Ideal: 100-180 mg/dL
- Abaixo de 100: consumir carboidrato
- Acima de 250: evitar exercício

### Durante o Exercício
- Exercícios longos: verificar a cada 30 min
- Sinais de hipoglicemia: parar imediatamente

### Após o Exercício
- Verificar 15-30 min depois
- Pode haver queda tardia da glicemia

## Cuidados Especiais

### Hipoglicemia
**Sinais:** Tremor, suor, confusão
**Ação:** Parar exercício, consumir carboidrato rápido

### Hiperglicemia
**Sinais:** Sede excessiva, visão turva
**Ação:** Evitar exercício, verificar cetonas

## Suplementação

### Quando Considerar
- Exercícios muito intensos
- Deficiências nutricionais
- Orientação profissional

### Opções Seguras
- Whey protein
- BCAA
- Creatina (com acompanhamento)

## Planejamento Semanal

### Segunda, Quarta, Sexta
- Exercícios de resistência
- Refeições com mais proteína

### Terça, Quinta, Sábado
- Exercícios aeróbicos
- Carboidratos complexos

### Domingo
- Descanso ativo
- Alimentação equilibrada

## Conclusão

A combinação inteligente de exercícios e alimentação é uma ferramenta poderosa no controle da diabetes. Sempre consulte profissionais de saúde para um plano personalizado.',
  'lifestyle',
  'Intermediário',
  12,
  4.6,
  1100,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['exercícios', 'alimentação', 'diabetes', 'estilo de vida']
),
(
  'Suplementos Naturais para Diabéticos',
  'Conheça suplementos naturais que podem auxiliar no controle glicêmico e melhorar sua qualidade de vida.',
  '# Suplementos Naturais para Diabéticos

Alguns suplementos naturais podem ser aliados no controle da diabetes, sempre como complemento ao tratamento médico e nunca como substituto.

## Importante: Consulte Sempre seu Médico

Antes de iniciar qualquer suplementação:
- Converse com seu endocrinologista
- Verifique interações medicamentosas
- Monitore a glicemia regularmente
- Faça exames de acompanhamento

## Suplementos com Evidências Científicas

### 1. Canela (Cinnamomum cassia)
**Benefícios:**
- Melhora da sensibilidade à insulina
- Redução da glicemia de jejum
- Efeito antioxidante

**Dosagem:** 1-6g por dia
**Como usar:** Chá, cápsulas ou tempero

### 2. Cromo
**Benefícios:**
- Melhora do metabolismo da glicose
- Aumento da ação da insulina
- Redução da resistência insulínica

**Dosagem:** 200-400 mcg por dia
**Cuidados:** Não exceder a dose recomendada

### 3. Ácido Alfa-Lipóico
**Benefícios:**
- Poderoso antioxidante
- Melhora da neuropatia diabética
- Aumento da captação de glicose

**Dosagem:** 300-600 mg por dia
**Melhor horário:** Com o estômago vazio

### 4. Magnésio
**Benefícios:**
- Melhora da sensibilidade à insulina
- Redução da inflamação
- Suporte ao metabolismo energético

**Dosagem:** 200-400 mg por dia
**Fontes naturais:** Castanhas, sementes, vegetais verdes

### 5. Ômega-3
**Benefícios:**
- Redução da inflamação
- Proteção cardiovascular
- Melhora do perfil lipídico

**Dosagem:** 1-3g por dia
**Fontes:** Peixes gordos, linhaça, chia

## Plantas Medicinais Promissoras

### Gymnema Sylvestre
- Reduz absorção de açúcar
- Melhora função das células beta
- Uso tradicional milenar

### Bitter Melon (Melão-de-São-Caetano)
- Compostos similares à insulina
- Redução da glicemia
- Uso culinário e medicinal

### Fenugreek (Feno-grego)
- Rico em fibras solúveis
- Retarda absorção de carboidratos
- Melhora tolerância à glicose

## Vitaminas Importantes

### Vitamina D
**Por que é importante:**
- Deficiência comum em diabéticos
- Influencia sensibilidade à insulina
- Suporte ao sistema imunológico

**Dosagem:** Conforme exame de sangue

### Vitaminas do Complexo B
**Especialmente B1, B6, B12:**
- Prevenção de neuropatia
- Metabolismo energético
- Função neurológica

## Cuidados e Contraindicações

### Interações Medicamentosas
- Canela pode potencializar anticoagulantes
- Cromo pode interagir com medicamentos para tireoide
- Sempre informe seu médico sobre suplementos

### Efeitos Colaterais Possíveis
- Hipoglicemia se combinado com medicamentos
- Problemas gastrointestinais
- Reações alérgicas

### Qualidade dos Produtos
- Escolha marcas confiáveis
- Verifique certificações
- Prefira produtos padronizados

## Quando NÃO Usar

- Gravidez e amamentação (sem orientação)
- Problemas renais ou hepáticos
- Uso de múltiplos medicamentos
- Diabetes descompensada

## Monitoramento

### O que Acompanhar
- Glicemia capilar regular
- Hemoglobina glicada
- Função renal e hepática
- Sintomas de hipoglicemia

### Sinais de Alerta
- Hipoglicemias frequentes
- Sintomas gastrointestinais
- Alterações no humor
- Problemas de sono

## Conclusão

Suplementos naturais podem ser úteis no manejo da diabetes, mas nunca substituem o tratamento médico convencional. A abordagem integrativa, sempre com supervisão profissional, oferece os melhores resultados.',
  'supplements',
  'Avançado',
  15,
  4.5,
  650,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['suplementos', 'natural', 'controle glicêmico', 'plantas medicinais']
),
(
  'Planejamento de Refeições: Estratégias Práticas',
  'Dicas essenciais para planejar suas refeições da semana de forma eficiente e saudável.',
  '# Planejamento de Refeições: Estratégias Práticas

O planejamento de refeições é uma ferramenta fundamental para manter uma alimentação saudável e controlar a diabetes de forma eficaz.

## Por que Planejar é Importante?

### Benefícios para Diabéticos
- Controle glicêmico mais estável
- Evita escolhas impulsivas
- Garante refeições balanceadas
- Reduz stress relacionado à alimentação

### Benefícios Práticos
- Economia de tempo e dinheiro
- Redução do desperdício
- Maior variedade nutricional
- Facilita a rotina familiar

## Passo a Passo do Planejamento

### 1. Avaliação da Rotina
- Horários de trabalho
- Compromissos da semana
- Tempo disponível para cozinhar
- Preferências da família

### 2. Definição de Objetivos
- Controle glicêmico
- Perda ou manutenção de peso
- Melhora do perfil lipídico
- Aumento da energia

### 3. Estrutura das Refeições
**Café da Manhã:**
- Proteína + carboidrato complexo + gordura boa
- Exemplo: Omelete com aveia e abacate

**Almoço:**
- Proteína + vegetais + carboidrato + gordura
- Exemplo: Frango grelhado + salada + quinoa + azeite

**Jantar:**
- Similar ao almoço, porção menor
- Foco em vegetais e proteínas

**Lanches:**
- Proteína + fibra
- Exemplo: Iogurte com castanhas

## Ferramentas de Planejamento

### Planilha Semanal
```
| Dia | Café | Lanche | Almoço | Lanche | Jantar |
|-----|------|--------|--------|--------|--------|
| Seg |      |        |        |        |        |
| Ter |      |        |        |        |        |
```

### Aplicativos Úteis
- Calendário de refeições
- Lista de compras digital
- Calculadora nutricional
- Timer de cozimento

### Lista de Compras Organizada
**Por seção do mercado:**
- Hortifrúti
- Açougue/Peixaria
- Laticínios
- Mercearia
- Congelados

## Estratégias de Preparo

### Meal Prep (Preparo Antecipado)
**Domingo:**
- Lave e corte vegetais
- Cozinhe grãos e leguminosas
- Prepare proteínas básicas
- Faça molhos e temperos

**Benefícios:**
- Refeições prontas na semana
- Porções controladas
- Menos tempo diário na cozinha

### Batch Cooking
- Prepare grandes quantidades
- Congele em porções individuais
- Tenha sempre opções saudáveis
- Ideal para sopas, ensopados, molhos

## Cardápio Modelo (1 Semana)

### Segunda-feira
- **Café:** Omelete de claras com espinafre + 1 fatia de pão integral
- **Lanche:** Iogurte natural com nozes
- **Almoço:** Salmão grelhado + quinoa + brócolis refogado
- **Lanche:** Maçã com pasta de amendoim
- **Jantar:** Sopa de lentilha + salada verde

### Terça-feira
- **Café:** Aveia com frutas vermelhas e chia
- **Lanche:** Queijo cottage com pepino
- **Almoço:** Frango grelhado + batata doce + salada mista
- **Lanche:** Smoothie verde
- **Jantar:** Peixe assado + legumes no vapor

### (Continue para os outros dias...)

## Dicas para o Sucesso

### Flexibilidade
- Tenha opções de backup
- Permita trocas entre dias
- Adapte conforme necessário
- Não seja rígido demais

### Variedade
- Mude proteínas durante a semana
- Experimente novos vegetais
- Varie métodos de preparo
- Inclua diferentes temperos

### Praticidade
- Use ingredientes versáteis
- Aproveite sobras criativas
- Tenha sempre opções rápidas
- Mantenha a despensa organizada

## Lidando com Imprevistos

### Refeições de Emergência
- Ovos mexidos com vegetais
- Salada com proteína enlatada
- Sanduíche integral com recheio saudável
- Smoothie nutritivo

### Jantar Fora
- Pesquise o cardápio antes
- Escolha preparos grelhados ou assados
- Peça molhos à parte
- Controle as porções

## Envolvimento da Família

### Planejamento Conjunto
- Inclua preferências de todos
- Delegue tarefas de preparo
- Ensine sobre alimentação saudável
- Torne o processo divertido

### Educação Nutricional
- Explique escolhas alimentares
- Mostre benefícios práticos
- Inclua as crianças no preparo
- Celebre sucessos juntos

## Monitoramento e Ajustes

### O que Acompanhar
- Glicemia antes e após refeições
- Energia e disposição
- Saciedade das refeições
- Praticidade do plano

### Quando Ajustar
- Glicemias fora do alvo
- Falta de saciedade
- Dificuldade de execução
- Mudanças na rotina

## Conclusão

O planejamento de refeições é um investimento na sua saúde que traz retornos imediatos e duradouros. Comece gradualmente e ajuste conforme sua realidade.',
  'nutrition',
  'Iniciante',
  9,
  4.8,
  1350,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['planejamento', 'refeições', 'organização', 'meal prep']
);