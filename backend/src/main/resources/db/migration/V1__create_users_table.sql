/**
 * ============================================================================
 * MIGRATION V1 - Criação da tabela de usuários
 * ============================================================================
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

-- ============================================================================
-- CRIA TABELA USUARIO
-- ============================================================================
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(60) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    CONSTRAINT chk_usuario_role CHECK (role IN ('ROLE_USER', 'ROLE_ADMIN'))
);

-- ============================================================================
-- COMENTÁRIOS DAS COLUNAS (documentação)
-- ============================================================================
COMMENT ON TABLE usuario IS 'Tabela de usuários do sistema Monetra';
COMMENT ON COLUMN usuario.id_usuario IS 'ID único do usuário (chave primária)';
COMMENT ON COLUMN usuario.nome IS 'Nome completo do usuário';
COMMENT ON COLUMN usuario.email IS 'E-mail do usuário (único, usado para login)';
COMMENT ON COLUMN usuario.senha IS 'Hash da senha (BCrypt)';
COMMENT ON COLUMN usuario.role IS 'Papel do usuário: ROLE_USER ou ROLE_ADMIN';
COMMENT ON COLUMN usuario.ativo IS 'Status do usuário: true=ativo, false=inativo';
COMMENT ON COLUMN usuario.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN usuario.updated_at IS 'Data da última atualização';

-- ============================================================================
-- ÍNDICES PARA OTIMIZAÇÃO DE CONSULTAS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuario(email);
CREATE INDEX IF NOT EXISTS idx_usuario_created_at ON usuario(created_at);
CREATE INDEX IF NOT EXISTS idx_usuario_role ON usuario(role);
CREATE INDEX IF NOT EXISTS idx_usuario_ativo ON usuario(ativo);

-- ============================================================================
-- ROLLBACK (descomentar se precisar reverter)
-- ============================================================================
-- DROP TABLE IF EXISTS usuario;