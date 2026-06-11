/**
 * ============================================================================
 * TEMA PRINCIPAL - Integra todas as configurações
 * ============================================================================
 */

import { lightColors, darkColors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { animations } from "./animations";

export interface Theme {
  colors: typeof lightColors;
  spacing: typeof spacing;
  typography: typeof typography;
  animations: typeof animations;
}

// Tema claro
export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  typography,
  animations,
};

// Tema escuro
export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  typography,
  animations,
};

export { lightColors, darkColors, spacing, typography, animations };
export const colors = lightColors;