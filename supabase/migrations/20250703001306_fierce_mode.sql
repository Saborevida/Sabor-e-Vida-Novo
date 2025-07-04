/*
  # Adicionar coluna external_url à tabela educational_content

  1. Alterações
    - Adicionar coluna `external_url` (text, nullable) à tabela `educational_content`
    - Esta coluna permitirá que artigos sejam hospedados externamente
    - Se preenchida, o botão "Ler artigo" abrirá o link externo
    - Se vazia, manterá o comportamento atual (modal interno)

  2. Segurança
    - Não há mudanças nas políticas RLS existentes
*/

-- Adicionar coluna external_url à tabela educational_content
ALTER TABLE educational_content 
ADD COLUMN IF NOT EXISTS external_url text;

-- Comentário para documentação
COMMENT ON COLUMN educational_content.external_url IS 'URL externa para o artigo completo. Se preenchida, o botão "Ler artigo" abrirá este link em nova aba.';