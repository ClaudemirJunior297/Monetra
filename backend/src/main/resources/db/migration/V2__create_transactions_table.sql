/**
 * ============================================================================
 * MIGRATION V2 - Criação da tabela de transações
 * ============================================================================
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

-- ============================================================================
-- CRIA TABELA TRANSACAO
-- ============================================================================
CREATE TABLE IF NOT EXISTS transacao (
    id_transacao BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    data_transacao TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    CONSTRAINT fk_transacao_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT chk_transacao_valor CHECK (valor > 0),
    CONSTRAINT chk_transacao_tipo CHECK (tipo IN ('INCOME', 'EXPENSE'))
);

-- ============================================================================
-- COMENTÁRIOS DAS COLUNAS (documentação)
-- ============================================================================
COMMENT ON TABLE transacao IS 'Tabela de transações financeiras do sistema Monetra';
COMMENT ON COLUMN transacao.id_transacao IS 'ID único da transação (chave primária)';
COMMENT ON COLUMN transacao.usuario_id IS 'ID do usuário proprietário (chave estrangeira)';
COMMENT ON COLUMN transacao.descricao IS 'Descrição da transação';
COMMENT ON COLUMN transacao.categoria IS 'Categoria da transação (Alimentação, Transporte, etc.)';
COMMENT ON COLUMN transacao.valor IS 'Valor da transação (sempre positivo)';
COMMENT ON COLUMN transacao.tipo IS 'Tipo: INCOME (receita) ou EXPENSE (despesa)';
COMMENT ON COLUMN transacao.data_transacao IS 'Data e hora da transação';
COMMENT ON COLUMN transacao.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN transacao.updated_at IS 'Data da última atualização';

-- ============================================================================
-- ÍNDICES PARA OTIMIZAÇÃO DE CONSULTAS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_transacao_usuario ON transacao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacao_data ON transacao(data_transacao);
CREATE INDEX IF NOT EXISTS idx_transacao_categoria ON transacao(categoria);
CREATE INDEX IF NOT EXISTS idx_transacao_tipo ON transacao(tipo);
CREATE INDEX IF NOT EXISTS idx_transacao_usuario_data ON transacao(usuario_id, data_transacao);
CREATE INDEX IF NOT EXISTS idx_transacao_usuario_categoria ON transacao(usuario_id, categoria);

-- ============================================================================
-- ROLLBACK (descomentar se precisar reverter)
-- ============================================================================
-- DROP TABLE IF EXISTS transacao;