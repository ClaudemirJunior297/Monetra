/**
 * ============================================================================
 * DADOS INICIAIS PARA TESTE - dados_iniciais.sql
 * ============================================================================
 * 
 * Este arquivo contém dados fictícios para popular o banco de dados
 * durante o desenvolvimento e testes.
 * 
 * ⚠️ ATENÇÃO: Este arquivo é executado APÓS as migrations.
 * 
 * Para executar automaticamente, configure no application.properties:
 * spring.sql.init.mode=always
 * spring.sql.init.data-locations=classpath:db/dados_iniciais.sql
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

-- ============================================================================
-- LIMPEZA DOS DADOS EXISTENTES (cuidado em produção!)
-- ============================================================================
DELETE FROM transacao;
DELETE FROM usuario;
ALTER SEQUENCE usuario_id_usuario_seq RESTART WITH 1;
ALTER SEQUENCE transacao_id_transacao_seq RESTART WITH 1;

-- ============================================================================
-- 1. USUÁRIOS DE TESTE
-- ============================================================================

-- Senha padrão para todos: "123456"
-- Hash BCrypt gerado para "123456": $2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/.cY5K5XqZ5X5qZ5X5qZ5X5qZ5X5q

-- Usuário 1: João Silva (Administrador)
INSERT INTO usuario (id_usuario, nome, email, senha, role, ativo, created_at, updated_at) VALUES 
(1, 'João Silva', 'joao@monetra.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/.cY5K5XqZ5X5qZ5X5qZ5X5qZ5X5q', 'ROLE_ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Usuário 2: Maria Santos (Usuário comum)
INSERT INTO usuario (id_usuario, nome, email, senha, role, ativo, created_at, updated_at) VALUES 
(2, 'Maria Santos', 'maria@monetra.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/.cY5K5XqZ5X5qZ5X5qZ5X5qZ5X5q', 'ROLE_USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Usuário 3: Carlos Oliveira (Usuário comum)
INSERT INTO usuario (id_usuario, nome, email, senha, role, ativo, created_at, updated_at) VALUES 
(3, 'Carlos Oliveira', 'carlos@monetra.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/.cY5K5XqZ5X5qZ5X5qZ5X5qZ5X5q', 'ROLE_USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Usuário 4: Ana Pereira (Usuário inativo - teste)
INSERT INTO usuario (id_usuario, nome, email, senha, role, ativo, created_at, updated_at) VALUES 
(4, 'Ana Pereira', 'ana@monetra.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/.cY5K5XqZ5X5qZ5X5qZ5X5qZ5X5q', 'ROLE_USER', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- 2. TRANSAÇÕES DO USUÁRIO 1 (João Silva)
-- ============================================================================

-- RECEITAS (INCOME)
INSERT INTO transacao (id_transacao, usuario_id, descricao, categoria, valor, tipo, data_transacao, created_at, updated_at) VALUES
(1, 1, 'Salário Janeiro', 'Renda', 8500.00, 'INCOME', '2026-01-10 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 'Freelance Site', 'Renda Extra', 1500.00, 'INCOME', '2026-01-15 14:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 'Salário Fevereiro', 'Renda', 8500.00, 'INCOME', '2026-02-10 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 'Bônus Trimestral', 'Renda', 2500.00, 'INCOME', '2026-02-20 11:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 1, 'Salário Março', 'Renda', 8500.00, 'INCOME', '2026-03-10 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 1, 'Investimentos', 'Renda', 320.50, 'INCOME', '2026-03-25 16:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- DESPESAS (EXPENSE) - Janeiro
INSERT INTO transacao (id_transacao, usuario_id, descricao, categoria, valor, tipo, data_transacao, created_at, updated_at) VALUES
(7, 1, 'Supermercado Extra', 'Alimentação', 850.75, 'EXPENSE', '2026-01-05 18:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 1, 'Aluguel Apartamento', 'Moradia', 2500.00, 'EXPENSE', '2026-01-08 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 1, 'Cinema com amigos', 'Lazer', 85.00, 'EXPENSE', '2026-01-12 20:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 1, 'Farmácia', 'Saúde', 120.30, 'EXPENSE', '2026-01-15 09:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 1, 'Uber', 'Transporte', 45.90, 'EXPENSE', '2026-01-18 19:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 1, 'Restaurante Italiano', 'Alimentação', 180.00, 'EXPENSE', '2026-01-22 20:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 1, 'Curso Online', 'Educação', 350.00, 'EXPENSE', '2026-01-25 14:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 1, 'Conta de Luz', 'Moradia', 180.50, 'EXPENSE', '2026-01-28 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- DESPESAS (EXPENSE) - Fevereiro
INSERT INTO transacao (id_transacao, usuario_id, descricao, categoria, valor, tipo, data_transacao, created_at, updated_at) VALUES
(15, 1, 'Supermercado', 'Alimentação', 920.30, 'EXPENSE', '2026-02-05 18:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(16, 1, 'Aluguel', 'Moradia', 2500.00, 'EXPENSE', '2026-02-08 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, 1, 'Show Musical', 'Lazer', 320.00, 'EXPENSE', '2026-02-14 21:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, 1, 'Consulta Médica', 'Saúde', 450.00, 'EXPENSE', '2026-02-18 15:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 1, 'Gasolina', 'Transporte', 280.00, 'EXPENSE', '2026-02-22 11:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(20, 1, 'Livros', 'Educação', 210.00, 'EXPENSE', '2026-02-25 14:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(21, 1, 'Internet', 'Moradia', 120.00, 'EXPENSE', '2026-02-28 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- DESPESAS (EXPENSE) - Março
INSERT INTO transacao (id_transacao, usuario_id, descricao, categoria, valor, tipo, data_transacao, created_at, updated_at) VALUES
(22, 1, 'Supermercado', 'Alimentação', 780.50, 'EXPENSE', '2026-03-05 18:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(23, 1, 'Aluguel', 'Moradia', 2500.00, 'EXPENSE', '2026-03-08 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(24, 1, 'Academia', 'Saúde', 150.00, 'EXPENSE', '2026-03-10 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(25, 1, 'Cinema', 'Lazer', 75.00, 'EXPENSE', '2026-03-15 20:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(26, 1, 'Manutenção do Carro', 'Transporte', 450.00, 'EXPENSE', '2026-03-20 14:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(27, 1, 'Cursos', 'Educação', 420.00, 'EXPENSE', '2026-03-25 11:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(28, 1, 'IPTU', 'Moradia', 850.00, 'EXPENSE', '2026-03-30 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- 3. TRANSAÇÕES DO USUÁRIO 2 (Maria Santos)
-- ============================================================================

-- RECEITAS (INCOME)
INSERT INTO transacao (id_transacao, usuario_id, descricao, categoria, valor, tipo, data_transacao, created_at, updated_at) VALUES
(29, 2, 'Salário', 'Renda', 5500.00, 'INCOME', '2026-01-05 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(30, 2, 'Venda Online', 'Renda Extra', 350.00, 'INCOME', '2026-01-20 15:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(31, 2, 'Salário', 'Renda', 5500.00, 'INCOME', '2026-02-05 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(32, 2, 'Salário', 'Renda', 5500.00, 'INCOME', '2026-03-05 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- DESPESAS (EXPENSE)
INSERT INTO transacao (id_transacao, usuario_id, descricao, categoria, valor, tipo, data_transacao, created_at, updated_at) VALUES
(33, 2, 'Feira Semanal', 'Alimentação', 450.00, 'EXPENSE', '2026-01-06 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(34, 2, 'Faculdade', 'Educação', 1200.00, 'EXPENSE', '2026-01-10 14:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(35, 2, 'Farmácia', 'Saúde', 95.00, 'EXPENSE', '2026-01-15 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(36, 2, 'Feira Semanal', 'Alimentação', 520.00, 'EXPENSE', '2026-02-06 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(37, 2, 'Faculdade', 'Educação', 1200.00, 'EXPENSE', '2026-02-10 14:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(38, 2, 'Uber', 'Transporte', 120.00, 'EXPENSE', '2026-02-20 18:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(39, 2, 'Feira Semanal', 'Alimentação', 480.00, 'EXPENSE', '2026-03-06 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(40, 2, 'Faculdade', 'Educação', 1200.00, 'EXPENSE', '2026-03-10 14:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(41, 2, 'Cinema', 'Lazer', 60.00, 'EXPENSE', '2026-03-25 20:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- 4. TRANSAÇÕES DO USUÁRIO 3 (Carlos Oliveira)
-- ============================================================================

-- RECEITAS (INCOME)
INSERT INTO transacao (id_transacao, usuario_id, descricao, categoria, valor, tipo, data_transacao, created_at, updated_at) VALUES
(42, 3, 'Salário', 'Renda', 4200.00, 'INCOME', '2026-01-10 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(43, 3, 'Bicos', 'Renda Extra', 800.00, 'INCOME', '2026-01-25 14:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(44, 3, 'Salário', 'Renda', 4200.00, 'INCOME', '2026-02-10 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(45, 3, 'Restituição IR', 'Renda', 1200.00, 'INCOME', '2026-02-28 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(46, 3, 'Salário', 'Renda', 4200.00, 'INCOME', '2026-03-10 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- DESPESAS (EXPENSE)
INSERT INTO transacao (id_transacao, usuario_id, descricao, categoria, valor, tipo, data_transacao, created_at, updated_at) VALUES
(47, 3, 'Supermercado', 'Alimentação', 650.00, 'EXPENSE', '2026-01-05 18:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(48, 3, 'Aluguel', 'Moradia', 1800.00, 'EXPENSE', '2026-01-08 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(49, 3, 'Bar com amigos', 'Lazer', 200.00, 'EXPENSE', '2026-01-15 22:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(50, 3, 'Óculos novo', 'Saúde', 350.00, 'EXPENSE', '2026-01-20 15:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(51, 3, 'Supermercado', 'Alimentação', 720.00, 'EXPENSE', '2026-02-05 18:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(52, 3, 'Aluguel', 'Moradia', 1800.00, 'EXPENSE', '2026-02-08 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(53, 3, 'Ônibus', 'Transporte', 150.00, 'EXPENSE', '2026-02-15 08:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(54, 3, 'Cursos', 'Educação', 450.00, 'EXPENSE', '2026-02-22 14:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(55, 3, 'Supermercado', 'Alimentação', 680.00, 'EXPENSE', '2026-03-05 18:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(56, 3, 'Aluguel', 'Moradia', 1800.00, 'EXPENSE', '2026-03-08 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(57, 3, 'Cinema', 'Lazer', 70.00, 'EXPENSE', '2026-03-20 20:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- 5. CONSULTAS PARA VERIFICAR OS DADOS (opcional)
-- ============================================================================

-- SELECT '=== TOTAL DE USUÁRIOS ===' AS info;
-- SELECT COUNT(*) AS total_usuarios FROM usuario WHERE ativo = true;

-- SELECT '=== RESUMO FINANCEIRO POR USUÁRIO ===' AS info;
-- SELECT 
--     u.nome,
--     COALESCE(SUM(CASE WHEN t.tipo = 'INCOME' THEN t.valor ELSE 0 END), 0) AS total_receitas,
--     COALESCE(SUM(CASE WHEN t.tipo = 'EXPENSE' THEN t.valor ELSE 0 END), 0) AS total_despesas,
--     COALESCE(SUM(CASE WHEN t.tipo = 'INCOME' THEN t.valor ELSE -t.valor END), 0) AS saldo
-- FROM usuario u
-- LEFT JOIN transacao t ON u.id_usuario = t.usuario_id
-- WHERE u.ativo = true
-- GROUP BY u.id_usuario, u.nome
-- ORDER BY u.nome;

-- SELECT '=== GASTOS POR CATEGORIA (USUÁRIO 1) ===' AS info;
-- SELECT 
--     categoria,
--     COUNT(*) AS quantidade,
--     SUM(valor) AS total_gasto
-- FROM transacao
-- WHERE usuario_id = 1 AND tipo = 'EXPENSE'
-- GROUP BY categoria
-- ORDER BY total_gasto DESC;