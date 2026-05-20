// FUNÇÃO: Centralizar todas as cores, espaçamentos e estilos do app

// CORES - Todas as cores usadas no aplicativo
export const colors = {
  // CORES PRINCIPAIS
  primary: "#00C853",      // Verde Principal - usado em botões e destaques
  background: "#121212",   // Preto / Fundo - cor de fundo de todas as telas
  
  // CORES DE APOIO (cada uma com uma função específica)
  expense: "#FF5252",      // Vermelho - para despesas/gastos (valores negativos)
  alert: "#FFD600",        // Amarelo - para alertas e avisos
  category: "#B388FF",     // Roxo - usado nos gráficos de categorias
  success: "#00BFA5",      // Verde água - para receitas/valores positivos
  
  // CORES NEUTRAS
  white: "#FFFFFF",        // Branco puro
  text: "#E0E0E0",         // Cinza claro - texto principal
  textSecondary: "#9E9E9E", // Cinza médio - texto secundário (menos importante)
  card: "#1E1E1E",         // Cinza escuro - fundo dos cards
  border: "#2C2C2C",       // Cinza médio escuro - bordas e divisores
}

// ESPAÇAMENTOS - Tamanhos de margem e padding padronizados
export const spacing = {
  xs: 4,   // Extra pequeno (ex: espaço entre itens pequenos)
  sm: 8,   // Pequeno (ex: espaço entre ícone e texto)
  md: 16,  // Médio (ex: padding padrão de cards)
  lg: 24,  // Grande (ex: espaçamento entre seções)
  xl: 32,  // Extra grande (ex: padding da tela)
  xxl: 48, // Extra extra grande (ex: espaçamento do topo)
}

// TIPOGRAFIA - Estilos de texto padronizados
export const typography = {
  // Estilo para títulos grandes (ex: "Monetra", "Cadastrar")
  title: {
    fontSize: 32,      // Tamanho grande
    fontWeight: "900" as const, // Negrito máximo (Black)
  },
  // Estilo para subtítulos (ex: cabeçalhos de seção)
  subtitle: {
    fontSize: 20,
    fontWeight: "700" as const, // Negrito (Bold)
  },
  // Estilo para texto normal (ex: descrições, labels)
  body: {
    fontSize: 16,
    fontWeight: "400" as const, // Normal (Regular)
  },
  // Estilo para textos pequenos (ex: data, categoria)
  caption: {
    fontSize: 12,
    fontWeight: "400" as const, // Normal (Regular)
  },
}
