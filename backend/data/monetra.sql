CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  face_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS saldo_resumo_financeiro (
  id_resumo INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL UNIQUE,
  saldo_atual DECIMAL(10,2) DEFAULT 0.00,
  CONSTRAINT fk_saldo_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categoria (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  id_resumo INT NOT NULL,
  descricao VARCHAR(50) NOT NULL,
  saldo_categoria DECIMAL(10,2) DEFAULT 0.00,
  tipo_movimentacao VARCHAR(20) NOT NULL,
  tipo_categoria VARCHAR(50) NOT NULL,
  CONSTRAINT fk_categoria_resumo FOREIGN KEY (id_resumo) REFERENCES saldo_resumo_financeiro(id_resumo) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grafico (
  id_grafico INT AUTO_INCREMENT PRIMARY KEY,
  id_categoria INT NOT NULL,
  tipo_grafico VARCHAR(50),
  CONSTRAINT fk_grafico_categoria FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transacao (
  id_transacao INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_transacao TIMESTAMP NOT NULL,
  tipo VARCHAR(20) NOT NULL
);
