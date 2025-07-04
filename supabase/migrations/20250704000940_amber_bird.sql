/*
  # Correção Final de Dados - Sabor & Vida
  
  1. Correção dos dados da tabela recipes
    - Padronizar category para slugs em inglês
    - Padronizar difficulty para valores em inglês
    - Corrigir instructions com dados reais
    - Corrigir ingredients com dados estruturados
    - Corrigir nutrition_info com dados completos
  
  2. Correção dos dados da tabela meal_plans
    - Atualizar com IDs reais das receitas
    - Estruturar meals corretamente
  
  3. Inserir dados de exemplo realistas
*/

-- Limpar dados existentes problemáticos
DELETE FROM favorites;
DELETE FROM meal_plans;
DELETE FROM recipes;

-- Inserir receitas com dados corretos e estruturados
INSERT INTO recipes (id, name, category, ingredients, instructions, nutrition_info, prep_time, difficulty, tags, image_url) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Panquecas de Aveia com Frutas Vermelhas',
  'breakfast',
  '[
    {"name": "Aveia em flocos", "amount": 1, "unit": "xícara"},
    {"name": "Ovos", "amount": 2, "unit": "unidades"},
    {"name": "Leite desnatado", "amount": 0.5, "unit": "xícara"},
    {"name": "Frutas vermelhas", "amount": 100, "unit": "g"},
    {"name": "Adoçante stevia", "amount": 1, "unit": "colher de chá"},
    {"name": "Canela em pó", "amount": 1, "unit": "pitada"}
  ]',
  ARRAY[
    'Em uma tigela, misture a farinha de aveia, os ovos, o leite desnatado e o adoçante até obter uma massa homogênea.',
    'Prepare na frigideira antiaderente em fogo médio-baixo, dourando dos dois lados.',
    'Sirva com as frutas vermelhas por cima e uma pitada de canela.'
  ],
  '{
    "calories": 280,
    "carbohydrates": 35,
    "protein": 18,
    "fat": 8,
    "fiber": 6,
    "sugar": 12,
    "glycemicIndex": 45,
    "servings": 2
  }',
  20,
  'easy',
  ARRAY['café da manhã', 'aveia', 'frutas', 'proteína', 'baixo ig'],
  'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Salada de Quinoa com Salmão Grelhado',
  'lunch',
  '[
    {"name": "Quinoa", "amount": 1, "unit": "xícara"},
    {"name": "Filé de salmão", "amount": 150, "unit": "g"},
    {"name": "Rúcula", "amount": 2, "unit": "xícaras"},
    {"name": "Tomate cereja", "amount": 10, "unit": "unidades"},
    {"name": "Pepino", "amount": 0.5, "unit": "unidade"},
    {"name": "Azeite extra virgem", "amount": 2, "unit": "colheres de sopa"},
    {"name": "Limão", "amount": 1, "unit": "unidade"},
    {"name": "Sal e pimenta", "amount": 1, "unit": "a gosto"}
  ]',
  ARRAY[
    'Cozinhe a quinoa conforme instruções da embalagem e deixe esfriar.',
    'Tempere o salmão com sal, pimenta e limão. Grelhe por 4-5 minutos de cada lado.',
    'Em uma tigela grande, misture a rúcula, tomates cortados ao meio e pepino em fatias.',
    'Adicione a quinoa fria e o salmão em pedaços.',
    'Tempere com azeite, suco de limão, sal e pimenta a gosto.'
  ],
  '{
    "calories": 420,
    "carbohydrates": 32,
    "protein": 35,
    "fat": 18,
    "fiber": 5,
    "sugar": 6,
    "glycemicIndex": 35,
    "servings": 1
  }',
  25,
  'medium',
  ARRAY['almoço', 'quinoa', 'salmão', 'proteína', 'ômega-3', 'baixo ig'],
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Frango Grelhado com Brócolis no Vapor',
  'dinner',
  '[
    {"name": "Peito de frango", "amount": 150, "unit": "g"},
    {"name": "Brócolis", "amount": 200, "unit": "g"},
    {"name": "Batata doce", "amount": 1, "unit": "unidade média"},
    {"name": "Alho", "amount": 2, "unit": "dentes"},
    {"name": "Azeite", "amount": 1, "unit": "colher de sopa"},
    {"name": "Ervas finas", "amount": 1, "unit": "colher de chá"},
    {"name": "Sal e pimenta", "amount": 1, "unit": "a gosto"}
  ]',
  ARRAY[
    'Tempere o frango com sal, pimenta, alho picado e ervas finas.',
    'Grelhe o frango em frigideira antiaderente por 6-7 minutos de cada lado.',
    'Cozinhe a batata doce no vapor por 15 minutos.',
    'Cozinhe o brócolis no vapor por 5-7 minutos até ficar al dente.',
    'Sirva o frango com os vegetais e regue com azeite.'
  ],
  '{
    "calories": 380,
    "carbohydrates": 25,
    "protein": 40,
    "fat": 12,
    "fiber": 8,
    "sugar": 8,
    "glycemicIndex": 40,
    "servings": 1
  }',
  30,
  'easy',
  ARRAY['jantar', 'frango', 'brócolis', 'proteína', 'baixo carb'],
  'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Smoothie Verde Detox',
  'snack',
  '[
    {"name": "Espinafre", "amount": 1, "unit": "xícara"},
    {"name": "Abacate", "amount": 0.5, "unit": "unidade"},
    {"name": "Maçã verde", "amount": 1, "unit": "unidade"},
    {"name": "Pepino", "amount": 0.5, "unit": "unidade"},
    {"name": "Gengibre", "amount": 1, "unit": "cm"},
    {"name": "Água de coco", "amount": 200, "unit": "ml"},
    {"name": "Limão", "amount": 0.5, "unit": "unidade"}
  ]',
  ARRAY[
    'Lave bem todos os ingredientes.',
    'Descasque o abacate e corte em pedaços.',
    'Corte a maçã e o pepino em pedaços.',
    'Bata todos os ingredientes no liquidificador até obter consistência cremosa.',
    'Sirva imediatamente gelado.'
  ],
  '{
    "calories": 180,
    "carbohydrates": 28,
    "protein": 4,
    "fat": 8,
    "fiber": 10,
    "sugar": 18,
    "glycemicIndex": 30,
    "servings": 1
  }',
  10,
  'easy',
  ARRAY['lanche', 'detox', 'verde', 'antioxidante', 'fibras'],
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Omelete de Claras com Espinafre',
  'breakfast',
  '[
    {"name": "Claras de ovo", "amount": 4, "unit": "unidades"},
    {"name": "Espinafre", "amount": 1, "unit": "xícara"},
    {"name": "Tomate", "amount": 1, "unit": "unidade"},
    {"name": "Queijo cottage", "amount": 2, "unit": "colheres de sopa"},
    {"name": "Cebola", "amount": 0.25, "unit": "unidade"},
    {"name": "Azeite", "amount": 1, "unit": "colher de chá"},
    {"name": "Sal e pimenta", "amount": 1, "unit": "a gosto"}
  ]',
  ARRAY[
    'Refogue a cebola picada no azeite até dourar.',
    'Adicione o espinafre e refogue até murchar.',
    'Bata as claras com sal e pimenta.',
    'Despeje as claras na frigideira com os vegetais.',
    'Adicione o tomate picado e o queijo cottage.',
    'Dobre a omelete ao meio e sirva quente.'
  ],
  '{
    "calories": 160,
    "carbohydrates": 8,
    "protein": 22,
    "fat": 5,
    "fiber": 3,
    "sugar": 5,
    "glycemicIndex": 15,
    "servings": 1
  }',
  15,
  'easy',
  ARRAY['café da manhã', 'proteína', 'baixo carb', 'vegetais'],
  'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440006',
  'Sopa de Lentilha com Vegetais',
  'dinner',
  '[
    {"name": "Lentilha", "amount": 1, "unit": "xícara"},
    {"name": "Cenoura", "amount": 2, "unit": "unidades"},
    {"name": "Aipo", "amount": 2, "unit": "talos"},
    {"name": "Cebola", "amount": 1, "unit": "unidade"},
    {"name": "Alho", "amount": 3, "unit": "dentes"},
    {"name": "Caldo de legumes", "amount": 1, "unit": "litro"},
    {"name": "Tomate pelado", "amount": 400, "unit": "g"},
    {"name": "Azeite", "amount": 2, "unit": "colheres de sopa"},
    {"name": "Louro", "amount": 2, "unit": "folhas"},
    {"name": "Sal e pimenta", "amount": 1, "unit": "a gosto"}
  ]',
  ARRAY[
    'Refogue a cebola e o alho no azeite até dourar.',
    'Adicione a cenoura e o aipo picados, refogue por 5 minutos.',
    'Acrescente a lentilha, o tomate e o caldo de legumes.',
    'Adicione as folhas de louro e tempere com sal e pimenta.',
    'Cozinhe em fogo médio por 25-30 minutos até a lentilha ficar macia.',
    'Retire as folhas de louro e sirva quente.'
  ],
  '{
    "calories": 220,
    "carbohydrates": 35,
    "protein": 15,
    "fat": 4,
    "fiber": 12,
    "sugar": 8,
    "glycemicIndex": 25,
    "servings": 4
  }',
  40,
  'medium',
  ARRAY['jantar', 'lentilha', 'vegetais', 'fibras', 'proteína vegetal'],
  'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440007',
  'Iogurte com Granola Caseira',
  'snack',
  '[
    {"name": "Iogurte natural desnatado", "amount": 200, "unit": "g"},
    {"name": "Aveia em flocos", "amount": 3, "unit": "colheres de sopa"},
    {"name": "Castanhas mistas", "amount": 2, "unit": "colheres de sopa"},
    {"name": "Sementes de chia", "amount": 1, "unit": "colher de sopa"},
    {"name": "Frutas vermelhas", "amount": 80, "unit": "g"},
    {"name": "Mel", "amount": 1, "unit": "colher de chá"},
    {"name": "Canela", "amount": 1, "unit": "pitada"}
  ]',
  ARRAY[
    'Misture a aveia, as castanhas picadas e a canela.',
    'Leve ao forno por 10 minutos a 180°C para tostar levemente.',
    'Deixe esfriar completamente.',
    'Em um pote, coloque o iogurte no fundo.',
    'Adicione camadas de granola, frutas vermelhas e chia.',
    'Finalize com um fio de mel.'
  ],
  '{
    "calories": 280,
    "carbohydrates": 32,
    "protein": 16,
    "fat": 12,
    "fiber": 8,
    "sugar": 20,
    "glycemicIndex": 35,
    "servings": 1
  }',
  15,
  'easy',
  ARRAY['lanche', 'iogurte', 'granola', 'probióticos', 'fibras'],
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440008',
  'Peixe Assado com Legumes',
  'dinner',
  '[
    {"name": "Filé de peixe branco", "amount": 150, "unit": "g"},
    {"name": "Abobrinha", "amount": 1, "unit": "unidade"},
    {"name": "Berinjela", "amount": 0.5, "unit": "unidade"},
    {"name": "Pimentão", "amount": 1, "unit": "unidade"},
    {"name": "Cebola roxa", "amount": 0.5, "unit": "unidade"},
    {"name": "Azeite", "amount": 2, "unit": "colheres de sopa"},
    {"name": "Limão", "amount": 1, "unit": "unidade"},
    {"name": "Ervas provençais", "amount": 1, "unit": "colher de chá"},
    {"name": "Sal e pimenta", "amount": 1, "unit": "a gosto"}
  ]',
  ARRAY[
    'Pré-aqueça o forno a 200°C.',
    'Corte todos os legumes em fatias grossas.',
    'Tempere o peixe com sal, pimenta, suco de limão e ervas.',
    'Disponha os legumes em uma assadeira, regue com azeite.',
    'Coloque o peixe por cima dos legumes.',
    'Asse por 20-25 minutos até o peixe estar cozido.'
  ],
  '{
    "calories": 320,
    "carbohydrates": 18,
    "protein": 32,
    "fat": 14,
    "fiber": 6,
    "sugar": 12,
    "glycemicIndex": 20,
    "servings": 1
  }',
  35,
  'medium',
  ARRAY['jantar', 'peixe', 'legumes', 'assado', 'baixo carb'],
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440009',
  'Wrap Integral de Frango',
  'lunch',
  '[
    {"name": "Tortilha integral", "amount": 1, "unit": "unidade"},
    {"name": "Peito de frango desfiado", "amount": 100, "unit": "g"},
    {"name": "Alface", "amount": 3, "unit": "folhas"},
    {"name": "Tomate", "amount": 1, "unit": "unidade"},
    {"name": "Cenoura ralada", "amount": 2, "unit": "colheres de sopa"},
    {"name": "Abacate", "amount": 0.25, "unit": "unidade"},
    {"name": "Iogurte natural", "amount": 2, "unit": "colheres de sopa"},
    {"name": "Mostarda", "amount": 1, "unit": "colher de chá"},
    {"name": "Sal e pimenta", "amount": 1, "unit": "a gosto"}
  ]',
  ARRAY[
    'Misture o iogurte com a mostarda, sal e pimenta.',
    'Aqueça levemente a tortilha.',
    'Espalhe o molho de iogurte na tortilha.',
    'Adicione o frango desfiado, alface, tomate e cenoura.',
    'Acrescente fatias de abacate.',
    'Enrole firmemente e corte ao meio para servir.'
  ],
  '{
    "calories": 350,
    "carbohydrates": 28,
    "protein": 28,
    "fat": 14,
    "fiber": 8,
    "sugar": 6,
    "glycemicIndex": 45,
    "servings": 1
  }',
  15,
  'easy',
  ARRAY['almoço', 'wrap', 'frango', 'integral', 'prático'],
  'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440010',
  'Mousse de Chocolate com Abacate',
  'dessert',
  '[
    {"name": "Abacate maduro", "amount": 2, "unit": "unidades"},
    {"name": "Cacau em pó", "amount": 3, "unit": "colheres de sopa"},
    {"name": "Adoçante stevia", "amount": 2, "unit": "colheres de chá"},
    {"name": "Leite de coco", "amount": 100, "unit": "ml"},
    {"name": "Essência de baunilha", "amount": 1, "unit": "colher de chá"},
    {"name": "Frutas vermelhas", "amount": 50, "unit": "g"}
  ]',
  ARRAY[
    'Retire a polpa dos abacates maduros.',
    'Bata no liquidificador com cacau, adoçante e leite de coco.',
    'Adicione a essência de baunilha e bata até ficar cremoso.',
    'Leve à geladeira por pelo menos 2 horas.',
    'Sirva em taças decorado com frutas vermelhas.'
  ],
  '{
    "calories": 180,
    "carbohydrates": 22,
    "protein": 4,
    "fat": 12,
    "fiber": 10,
    "sugar": 8,
    "glycemicIndex": 25,
    "servings": 4
  }',
  15,
  'easy',
  ARRAY['sobremesa', 'chocolate', 'abacate', 'saudável', 'sem açúcar'],
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  'Salada de Grão-de-Bico',
  'lunch',
  '[
    {"name": "Grão-de-bico cozido", "amount": 1.5, "unit": "xícaras"},
    {"name": "Pepino", "amount": 1, "unit": "unidade"},
    {"name": "Tomate", "amount": 2, "unit": "unidades"},
    {"name": "Cebola roxa", "amount": 0.25, "unit": "unidade"},
    {"name": "Salsinha", "amount": 0.25, "unit": "xícara"},
    {"name": "Azeite", "amount": 2, "unit": "colheres de sopa"},
    {"name": "Limão", "amount": 1, "unit": "unidade"},
    {"name": "Sal e pimenta", "amount": 1, "unit": "a gosto"}
  ]',
  ARRAY[
    'Escorra e lave bem o grão-de-bico.',
    'Corte o pepino, tomate e cebola em cubos pequenos.',
    'Pique a salsinha finamente.',
    'Misture todos os ingredientes em uma tigela.',
    'Tempere com azeite, suco de limão, sal e pimenta.',
    'Deixe marinar por 30 minutos antes de servir.'
  ],
  '{
    "calories": 280,
    "carbohydrates": 38,
    "protein": 12,
    "fat": 10,
    "fiber": 10,
    "sugar": 8,
    "glycemicIndex": 30,
    "servings": 2
  }',
  20,
  'easy',
  ARRAY['almoço', 'grão-de-bico', 'proteína vegetal', 'fibras', 'fresco'],
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  'Chá Verde com Gengibre',
  'beverage',
  '[
    {"name": "Chá verde", "amount": 1, "unit": "sachê"},
    {"name": "Gengibre fresco", "amount": 2, "unit": "cm"},
    {"name": "Água", "amount": 250, "unit": "ml"},
    {"name": "Limão", "amount": 0.25, "unit": "unidade"},
    {"name": "Mel", "amount": 1, "unit": "colher de chá"}
  ]',
  ARRAY[
    'Ferva a água com o gengibre fatiado por 5 minutos.',
    'Retire do fogo e adicione o sachê de chá verde.',
    'Deixe em infusão por 3-5 minutos.',
    'Retire o sachê e coe o gengibre se desejar.',
    'Adicione o suco de limão e mel a gosto.',
    'Sirva quente ou gelado.'
  ],
  '{
    "calories": 25,
    "carbohydrates": 6,
    "protein": 0,
    "fat": 0,
    "fiber": 0,
    "sugar": 6,
    "glycemicIndex": 10,
    "servings": 1
  }',
  10,
  'easy',
  ARRAY['bebida', 'chá verde', 'gengibre', 'antioxidante', 'digestivo'],
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440013',
  'Torta Frango com Legumes',
  'dinner',
  '[
    {"name": "Massa integral para torta", "amount": 1, "unit": "unidade"},
    {"name": "Peito de frango", "amount": 300, "unit": "g"},
    {"name": "Brócolis", "amount": 200, "unit": "g"},
    {"name": "Cenoura", "amount": 1, "unit": "unidade"},
    {"name": "Ervilha", "amount": 100, "unit": "g"},
    {"name": "Cebola", "amount": 1, "unit": "unidade"},
    {"name": "Leite desnatado", "amount": 200, "unit": "ml"},
    {"name": "Ovos", "amount": 2, "unit": "unidades"},
    {"name": "Queijo light ralado", "amount": 50, "unit": "g"},
    {"name": "Azeite", "amount": 1, "unit": "colher de sopa"},
    {"name": "Sal e pimenta", "amount": 1, "unit": "a gosto"}
  ]',
  ARRAY[
    'Cozinhe o frango e desfie. Reserve.',
    'Refogue a cebola no azeite até dourar.',
    'Adicione os legumes picados e refogue por 10 minutos.',
    'Misture o frango desfiado aos legumes.',
    'Bata os ovos com o leite, sal e pimenta.',
    'Forre uma forma com a massa, adicione o recheio.',
    'Despeje a mistura de ovos e polvilhe queijo.',
    'Asse a 180°C por 35-40 minutos.'
  ],
  '{
    "calories": 320,
    "carbohydrates": 25,
    "protein": 28,
    "fat": 12,
    "fiber": 6,
    "sugar": 8,
    "glycemicIndex": 40,
    "servings": 6
  }',
  60,
  'hard',
  ARRAY['jantar', 'torta', 'frango', 'legumes', 'família'],
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440014',
  'Vitamina de Banana com Aveia',
  'beverage',
  '[
    {"name": "Banana", "amount": 1, "unit": "unidade"},
    {"name": "Aveia em flocos", "amount": 2, "unit": "colheres de sopa"},
    {"name": "Leite desnatado", "amount": 200, "unit": "ml"},
    {"name": "Canela", "amount": 1, "unit": "pitada"},
    {"name": "Adoçante stevia", "amount": 1, "unit": "colher de chá"},
    {"name": "Gelo", "amount": 3, "unit": "cubos"}
  ]',
  ARRAY[
    'Descasque a banana e corte em pedaços.',
    'Coloque todos os ingredientes no liquidificador.',
    'Bata por 2-3 minutos até ficar cremoso.',
    'Adicione gelo se desejar mais gelado.',
    'Sirva imediatamente.'
  ],
  '{
    "calories": 180,
    "carbohydrates": 32,
    "protein": 8,
    "fat": 3,
    "fiber": 5,
    "sugar": 18,
    "glycemicIndex": 50,
    "servings": 1
  }',
  5,
  'easy',
  ARRAY['bebida', 'vitamina', 'banana', 'aveia', 'energia'],
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  '550e8400-e29b-41d4-a716-446655440015',
  'Risotto de Quinoa com Cogumelos',
  'dinner',
  '[
    {"name": "Quinoa", "amount": 1, "unit": "xícara"},
    {"name": "Cogumelos variados", "amount": 200, "unit": "g"},
    {"name": "Caldo de legumes", "amount": 3, "unit": "xícaras"},
    {"name": "Cebola", "amount": 1, "unit": "unidade"},
    {"name": "Alho", "amount": 2, "unit": "dentes"},
    {"name": "Vinho branco", "amount": 100, "unit": "ml"},
    {"name": "Queijo parmesão light", "amount": 30, "unit": "g"},
    {"name": "Azeite", "amount": 2, "unit": "colheres de sopa"},
    {"name": "Salsinha", "amount": 2, "unit": "colheres de sopa"},
    {"name": "Sal e pimenta", "amount": 1, "unit": "a gosto"}
  ]',
  ARRAY[
    'Refogue a cebola e alho no azeite até dourar.',
    'Adicione a quinoa e refogue por 2 minutos.',
    'Acrescente o vinho branco e deixe evaporar.',
    'Adicione o caldo quente aos poucos, mexendo sempre.',
    'Em outra panela, refogue os cogumelos.',
    'Quando a quinoa estiver cremosa, adicione os cogumelos.',
    'Finalize com queijo parmesão e salsinha.'
  ],
  '{
    "calories": 280,
    "carbohydrates": 42,
    "protein": 12,
    "fat": 8,
    "fiber": 6,
    "sugar": 6,
    "glycemicIndex": 35,
    "servings": 4
  }',
  45,
  'hard',
  ARRAY['jantar', 'risotto', 'quinoa', 'cogumelos', 'cremoso'],
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
);

-- Inserir plano de refeição com IDs reais
INSERT INTO meal_plans (id, user_id, name, start_date, end_date, meals) VALUES
(
  '660e8400-e29b-41d4-a716-446655440001',
  '00000000-0000-0000-0000-000000000000', -- ID placeholder, será substituído por usuários reais
  'Plano Detox 7 Dias',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '7 days',
  '{
    "description": "Plano focado em desintoxicação e controle glicêmico com receitas ricas em fibras e antioxidantes",
    "duration": "7 dias",
    "totalMeals": 21,
    "calories": "1400-1600 kcal/dia",
    "difficulty": "Fácil",
    "tags": ["Detox", "Baixo IG", "Anti-inflamatório"],
    "weekly_menu": {
      "monday": {
        "breakfast": "550e8400-e29b-41d4-a716-446655440001",
        "lunch": "550e8400-e29b-41d4-a716-446655440002", 
        "dinner": "550e8400-e29b-41d4-a716-446655440003",
        "snack": "550e8400-e29b-41d4-a716-446655440004"
      },
      "tuesday": {
        "breakfast": "550e8400-e29b-41d4-a716-446655440005",
        "lunch": "550e8400-e29b-41d4-a716-446655440011",
        "dinner": "550e8400-e29b-41d4-a716-446655440006",
        "snack": "550e8400-e29b-41d4-a716-446655440007"
      },
      "wednesday": {
        "breakfast": "550e8400-e29b-41d4-a716-446655440001",
        "lunch": "550e8400-e29b-41d4-a716-446655440009",
        "dinner": "550e8400-e29b-41d4-a716-446655440008",
        "snack": "550e8400-e29b-41d4-a716-446655440004"
      },
      "thursday": {
        "breakfast": "550e8400-e29b-41d4-a716-446655440005",
        "lunch": "550e8400-e29b-41d4-a716-446655440002",
        "dinner": "550e8400-e29b-41d4-a716-446655440015",
        "snack": "550e8400-e29b-41d4-a716-446655440007"
      },
      "friday": {
        "breakfast": "550e8400-e29b-41d4-a716-446655440001",
        "lunch": "550e8400-e29b-41d4-a716-446655440011",
        "dinner": "550e8400-e29b-41d4-a716-446655440003",
        "snack": "550e8400-e29b-41d4-a716-446655440004"
      },
      "saturday": {
        "breakfast": "550e8400-e29b-41d4-a716-446655440005",
        "lunch": "550e8400-e29b-41d4-a716-446655440009",
        "dinner": "550e8400-e29b-41d4-a716-446655440013",
        "snack": "550e8400-e29b-41d4-a716-446655440010"
      },
      "sunday": {
        "breakfast": "550e8400-e29b-41d4-a716-446655440001",
        "lunch": "550e8400-e29b-41d4-a716-446655440002",
        "dinner": "550e8400-e29b-41d4-a716-446655440008",
        "snack": "550e8400-e29b-41d4-a716-446655440007"
      }
    }
  }'
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  '00000000-0000-0000-0000-000000000000',
  'Plano Mediterrâneo 14 Dias',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '14 days',
  '{
    "description": "Baseado na dieta mediterrânea, rica em ômega-3, azeite e vegetais frescos",
    "duration": "14 dias",
    "totalMeals": 42,
    "calories": "1600-1800 kcal/dia",
    "difficulty": "Médio",
    "tags": ["Mediterrâneo", "Ômega-3", "Coração Saudável"],
    "weekly_menu": {
      "monday": {
        "breakfast": "550e8400-e29b-41d4-a716-446655440001",
        "lunch": "550e8400-e29b-41d4-a716-446655440002",
        "dinner": "550e8400-e29b-41d4-a716-446655440008",
        "snack": "550e8400-e29b-41d4-a716-446655440007"
      },
      "tuesday": {
        "breakfast": "550e8400-e29b-41d4-a716-446655440005",
        "lunch": "550e8400-e29b-41d4-a716-446655440011",
        "dinner": "550e8400-e29b-41d4-a716-446655440015",
        "snack": "550e8400-e29b-41d4-a716-446655440004"
      }
    }
  }'
);

-- Atualizar visualizações e ratings dos artigos educativos com dados realistas
UPDATE educational_content SET 
  views = CASE 
    WHEN id = (SELECT id FROM educational_content WHERE title LIKE '%Índice Glicêmico%' LIMIT 1) THEN 1850
    WHEN id = (SELECT id FROM educational_content WHERE title LIKE '%Carboidratos%' LIMIT 1) THEN 1420
    WHEN id = (SELECT id FROM educational_content WHERE title LIKE '%Técnicas de Cocção%' LIMIT 1) THEN 980
    WHEN id = (SELECT id FROM educational_content WHERE title LIKE '%Exercícios%' LIMIT 1) THEN 1650
    WHEN id = (SELECT id FROM educational_content WHERE title LIKE '%Suplementos%' LIMIT 1) THEN 890
    WHEN id = (SELECT id FROM educational_content WHERE title LIKE '%Planejamento%' LIMIT 1) THEN 2100
    ELSE views
  END,
  rating = CASE 
    WHEN id = (SELECT id FROM educational_content WHERE title LIKE '%Índice Glicêmico%' LIMIT 1) THEN 4.8
    WHEN id = (SELECT id FROM educational_content WHERE title LIKE '%Carboidratos%' LIMIT 1) THEN 4.9
    WHEN id = (SELECT id FROM educational_content WHERE title LIKE '%Técnicas de Cocção%' LIMIT 1) THEN 4.7
    WHEN id = (SELECT id FROM educational_content WHERE title LIKE '%Exercícios%' LIMIT 1) THEN 4.6
    WHEN id = (SELECT id FROM educational_content WHERE title LIKE '%Suplementos%' LIMIT 1) THEN 4.5
    WHEN id = (SELECT id FROM educational_content WHERE title LIKE '%Planejamento%' LIMIT 1) THEN 4.8
    ELSE rating
  END;