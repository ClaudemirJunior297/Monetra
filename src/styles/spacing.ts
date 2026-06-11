/*CONFIGURAÇÃO DE ESPAÇAMENTOS (Spacing)*/

export const spacing = {
  xs: 4,   // 4px  - usado para gaps muito pequenos, ícones próximos
  sm: 8,   // 8px  - usado entre elementos relacionados (ícone + texto)
  md: 16,  // 16px - espaçamento padrão entre campos de formulário
  lg: 24,  // 24px - espaçamento entre seções
  xl: 32,  // 32px - espaçamento do container principal (padding da tela)
  xxl: 48, // 48px - espaçamento muito grande (footer, áreas de destaque)
};

// Aliases para facilitar a leitura (opcional, pode usar direto o spacing)
export const gap = spacing;
export const padding = spacing;
export const margin = spacing;