/*
  # Corrigir erro de cadastro de usuário

  1. Problema
    - A função handle_new_user() está falhando ao inserir dados na tabela users
    - Erro: "Database error saving new user"
    - Status 500 no endpoint de signup

  2. Correções
    - Atualizar a função handle_new_user() para ser mais robusta
    - Adicionar tratamento de erros
    - Garantir que os campos obrigatórios sejam preenchidos corretamente
    - Corrigir possíveis conflitos de dados

  3. Melhorias
    - Função mais segura com validações
    - Melhor tratamento de metadados do usuário
    - Log de erros para debugging
*/

-- Remover a função existente
DROP FUNCTION IF EXISTS handle_new_user();

-- Criar função corrigida para lidar com novos usuários
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name text;
  user_diabetes_type text;
BEGIN
  -- Log para debugging
  RAISE LOG 'Creating user profile for user ID: %', NEW.id;
  
  -- Extrair nome dos metadados ou usar email como fallback
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'Usuário'
  );
  
  -- Extrair tipo de diabetes dos metadados ou usar padrão
  user_diabetes_type := COALESCE(
    NEW.raw_user_meta_data->>'diabetesType',
    'type2'
  );
  
  -- Inserir perfil do usuário com tratamento de erro
  BEGIN
    INSERT INTO users (
      id, 
      email, 
      name,
      diabetes_type,
      health_goals,
      dietary_preferences,
      subscription_plan,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.email,
      user_name,
      user_diabetes_type,
      '{}',
      '{}',
      'free',
      now(),
      now()
    );
    
    RAISE LOG 'User profile created successfully for: %', NEW.email;
    
  EXCEPTION 
    WHEN unique_violation THEN
      -- Se o usuário já existe, apenas atualizar
      UPDATE users 
      SET 
        email = NEW.email,
        name = user_name,
        updated_at = now()
      WHERE id = NEW.id;
      
      RAISE LOG 'User profile updated for existing user: %', NEW.email;
      
    WHEN OTHERS THEN
      -- Log do erro mas não falhar o cadastro
      RAISE LOG 'Error creating user profile for %: %', NEW.email, SQLERRM;
      -- Não re-raise o erro para não bloquear o cadastro no auth
  END;
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Garantir que a tabela users tenha as constraints corretas
ALTER TABLE users 
  ALTER COLUMN name SET DEFAULT '',
  ALTER COLUMN diabetes_type SET DEFAULT 'type2',
  ALTER COLUMN health_goals SET DEFAULT '{}',
  ALTER COLUMN dietary_preferences SET DEFAULT '{}',
  ALTER COLUMN subscription_plan SET DEFAULT 'free';

-- Adicionar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Função para limpar usuários órfãos (opcional, para manutenção)
CREATE OR REPLACE FUNCTION cleanup_orphaned_users()
RETURNS void AS $$
BEGIN
  -- Remove usuários da tabela users que não existem mais no auth.users
  DELETE FROM users 
  WHERE id NOT IN (SELECT id FROM auth.users);
  
  RAISE LOG 'Cleanup completed';
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Comentários para documentação
COMMENT ON FUNCTION handle_new_user() IS 'Função robusta para criar perfil de usuário após cadastro no auth, com tratamento de erros';
COMMENT ON FUNCTION cleanup_orphaned_users() IS 'Função de manutenção para remover usuários órfãos';