/*CONFIGURAÇÃO DE ANIMAÇÕES (Animations)*/

// Configuração de animação SPRING (efeito mola)
// Usado para: cliques em botões, expansão de cards, feedback tátil
export const springConfig = {
  duration: 300,           // Duração em milissegundos
  damping: 10,             // Amortecimento (menos = mais efeito mola)
  stiffness: 100,          // Rigidez (mais = mais rápido)
  mass: 1,                 // Massa (afeta a inércia)
  overshootClamping: false, // Permite ultrapassar o destino
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

// Configuração de animação TIMING (transições suaves)
// Usado para: fade in/out, mudanças de posição, opacidade
export const timingConfig = {
  duration: 250,           // Duração padrão para transições
  easing: "easeInOut",     // Curva de aceleração (suave no início e fim)
};

// Configuração para animações de entrada de itens em lista
// Usado para: FlatList, map de itens (efeito cascata)
export const listItemAnimation = {
  initial: {
    opacity: 0,
    translateY: 20,        // Começa 20px abaixo
  },
  animate: {
    opacity: 1,
    translateY: 0,         // Termina na posição original
  },
  transition: {
    type: "spring",
    damping: 12,
    stiffness: 90,
  },
};

// Configuração para botões (efeito de escala ao tocar)
export const buttonScaleAnimation = {
  pressed: { scale: 0.96 },   // Diminui 4% ao pressionar
  initial: { scale: 1 },       // Tamanho normal
  transition: {
    type: "spring",
    damping: 15,
    stiffness: 200,
  },
};

// Configuração para fade in (aparecimento suave)
export const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 200 },
};

// Configuração para slide horizontal (usado em modais)
export const slideInAnimation = {
  initial: { translateX: 300 },
  animate: { translateX: 0 },
  exit: { translateX: 300 },
  transition: { type: "spring", damping: 20, stiffness: 150 },
};

// Exporta um objeto com todas as configurações
export const animations = {
  spring: springConfig,
  timing: timingConfig,
  listItem: listItemAnimation,
  button: buttonScaleAnimation,
  fadeIn: fadeInAnimation,
  slideIn: slideInAnimation,
};