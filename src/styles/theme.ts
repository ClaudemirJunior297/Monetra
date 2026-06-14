/**
 * TEMA PRINCIPAL - Integra todas as configurações do app
 */

import { lightColors, darkColors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { animations } from "./animations";

// Interface que define a estrutura do tema
export interface Theme {
  colors: typeof lightColors;      // Cores (claro/escuro)
  spacing: typeof spacing;         // Espaçamentos (4, 8, 16, etc.)
  typography: typeof typography;   // Estilos de texto
  animations: typeof animations;    // Configurações de animação
}

// ========== TEMAS DISPONÍVEIS ==========

// Tema claro (modo claro)
export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  typography,
  animations,
};

// Tema escuro (modo escuro)
export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  typography,
  animations,
};

// ========== EXPORTAÇÕES ==========

// Exporta configurações individuais
export { lightColors, darkColors, spacing, typography, animations };

// Tema padrão (claro)
export const colors = lightColors;