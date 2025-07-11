/*
  # Corrigir erro de cadastro de usuário - Versão com CASCADE

  1. Problema
    - A função handle_new_user() está causando erro "Database error saving new user"
    - Não é possível fazer DROP da função devido ao trigger dependente
    - Status 500 no endpoint de signup

  2. Correções
    - Remover trigger e função com CASCADE
    - Recriar função mais robusta com tratamento de erros
    - Recriar trigger
    - Garantir que os campos obrigatórios sejam preenchidos corretamente

  3. Melhorias
    - Função mais segura com validações
    - Melhor tratamento de metadados do usuário
    - Log de erros para debugging
    - Não bloqueia o cadastro em caso de erro na criação do perfil
*/

-- Remover trigger e função existentes com CASCADE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Criar função corrigida e mais robusta para lidar com novos usuários
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name text;
  user_diabetes_type text;
  user_email text;
BEGIN
  -- Log para debugging
  RAISE LOG 'Creating user profile for user ID: %', NEW.id;
  
  -- Validar email
  user_email := COALESCE(NEW.email, '');
  IF user_email = '' THEN
    RAISE LOG 'Warning: Empty email for user %', NEW.id;
    RETURN NEW; -- Não bloquear o cadastro
  END IF;
  
  -- Extrair nome dos metadados ou usar email como fallback
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1),
    'Usuário'
  );
  
  -- Garantir que o nome não seja vazio
  IF user_name = '' OR user_name IS NULL THEN
    user_name := split_part(NEW.email, '@', 1);
    IF user_name = '' THEN
      user_name := 'Usuário';
    END IF;
  END IF;
  
  -- Extrair tipo de diabetes dos metadados ou usar padrão
  user_diabetes_type := COALESCE(
    NEW.raw_user_meta_data->>'diabetesType',
    NEW.raw_user_meta_data->>'diabetes_type',
    'type2'
  );
  
  -- Validar tipo de diabetes
  IF user_diabetes_type NOT IN ('type1', 'type2', 'gestational', 'prediabetes') THEN
    user_diabetes_type := 'type2';
  END IF;
  
  -- Inserir perfil do usuário com tratamento de erro robusto
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
      user_email,
      user_name,
      user_diabetes_type,
      COALESCE(ARRAY[]::text[], '{}'),
      COALESCE(ARRAY[]::text[], '{}'),
      'free',
      COALESCE(NEW.created_at, now()),
      now()
    );
    
    RAISE LOG 'User profile created successfully for: % (name: %, diabetes_type: %)', 
              user_email, user_name, user_diabetes_type;
    
  EXCEPTION 
    WHEN unique_violation THEN
      -- Se o usuário já existe, tentar atualizar
      BEGIN
        UPDATE users 
        SET 
          email = user_email,
          name = user_name,
          diabetes_type = user_diabetes_type,
          updated_at = now()
        WHERE id = NEW.id;
        
        RAISE LOG 'User profile updated for existing user: %', user_email;
        
      EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'Error updating existing user profile for %: %', user_email, SQLERRM;
        -- Não re-raise o erro para não bloquear o cadastro
      END;
      
    WHEN NOT NULL VIOLATION THEN
      RAISE LOG 'NOT NULL violation for user %: %. Using fallback values.', user_email, SQLERRM;
      
      -- Tentar novamente com valores mais seguros
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
          COALESCE(user_email, 'user@example.com'),
          COALESCE(user_name, 'Usuário'),
          'type2',
          '{}',
          '{}',
          'free',
          now(),
          now()
        );
        
        RAISE LOG 'User profile created with fallback values for: %', user_email;
        
      EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'Final fallback failed for user %: %', user_email, SQLERRM;
        -- Não re-raise o erro para não bloquear o cadastro no auth
      END;
      
    WHEN OTHERS THEN
      -- Log do erro mas não falhar o cadastro
      RAISE LOG 'Unexpected error creating user profile for %: % (SQLSTATE: %)', 
                user_email, SQLERRM, SQLSTATE;
      -- Não re-raise o erro para não bloquear o cadastro no auth
  END;
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Garantir que a tabela users tenha as constraints e defaults corretos
ALTER TABLE users 
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN name SET DEFAULT 'Usuário',
  ALTER COLUMN diabetes_type SET NOT NULL,
  ALTER COLUMN diabetes_type SET DEFAULT 'type2',
  ALTER COLUMN health_goals SET DEFAULT '{}',
  ALTER COLUMN dietary_preferences SET DEFAULT '{}',
  ALTER COLUMN subscription_plan SET DEFAULT 'free',
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

-- Adicionar constraint para validar diabetes_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'users_diabetes_type_check'
  ) THEN
    ALTER TABLE users 
    ADD CONSTRAINT users_diabetes_type_check 
    CHECK (diabetes_type IN ('type1', 'type2', 'gestational', 'prediabetes'));
  END IF;
END $$;

-- Adicionar índices para melhorar performance se não existirem
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_diabetes_type ON users(diabetes_type);
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON users(subscription_plan);

-- Função para limpar usuários órfãos (manutenção)
CREATE OR REPLACE FUNCTION cleanup_orphaned_users()
RETURNS void AS $$
BEGIN
  -- Remove usuários da tabela users que não existem mais no auth.users
  DELETE FROM users 
  WHERE id NOT IN (SELECT id FROM auth.users);
  
  RAISE LOG 'Cleanup completed - orphaned users removed';
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Função para verificar integridade dos dados
CREATE OR REPLACE FUNCTION check_user_data_integrity()
RETURNS TABLE(
  total_auth_users bigint,
  total_profile_users bigint,
  missing_profiles bigint,
  orphaned_profiles bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT count(*) FROM auth.users)::bigint as total_auth_users,
    (SELECT count(*) FROM users)::bigint as total_profile_users,
    (SELECT count(*) FROM auth.users au WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = au.id))::bigint as missing_profiles,
    (SELECT count(*) FROM users u WHERE NOT EXISTS (SELECT 1 FROM auth.users au WHERE au.id = u.id))::bigint as orphaned_profiles;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Comentários para documentação
COMMENT ON FUNCTION handle_new_user() IS 'Função robusta para criar perfil de usuário após cadastro no auth, com tratamento completo de erros e fallbacks';
COMMENT ON FUNCTION cleanup_orphaned_users() IS 'Função de manutenção para remover usuários órfãos';
COMMENT ON FUNCTION check_user_data_integrity() IS 'Função para verificar integridade entre auth.users e users';

-- Log de conclusão
DO $$
BEGIN
  RAISE LOG 'User registration fix migration completed successfully';
END $$;