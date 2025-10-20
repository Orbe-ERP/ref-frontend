export const COLORS = {
  light: {
    primary: "#2BAE66",      // Verde-esmeralda moderno (principal)
    secondary: "#264653",    // Grafite azulado (menu, botões escuros)
    accent: "#E9C46A",       // Dourado suave (realce, ícones de ação)
    background: "#e9e9e9ff", // Mantido
    surface: "#FFFFFF",      // Cartões, áreas elevadas
    text: {
      primary: "#1E1E1E",    // Texto principal
      secondary: "#4A4A4A",  // Texto secundário
      accent: "#2BAE66",     // Ícones e links
      muted: "#7A8A99",      // Texto desabilitado
    },
    border: "#DADADA",
    overlay: "rgba(0,0,0,0.04)",
    disabled: {
      background: "#E6E6E6",
      text: "#5C6B7A",
    },
  },

  dark: {
    primary: "#2BAE66",      // Verde-água vibrante e equilibrado
    secondary: "#264653",    // Azul-petróleo profundo
    accent: "#E9C46A",       // Mesmo dourado — mantém identidade
    background: "#0A1A2F",   // Mantido
    surface: "#152A3A",      // Cartões, áreas elevadas
    text: {
      primary: "#FFFFFF",    // Texto principal
      secondary: "#B0BEC5",  // Texto secundário
      accent: "#3DDC97",     // Ícones e detalhes
      muted: "#7A8A99",      // Texto apagado
    },
    border: "#23394E",
    overlay: "rgba(255,255,255,0.05)",
    disabled: {
      background: "#1E3248",
      text: "#5C6B7A",
    },
  },

  feedback: {
    success: "#2BAE66",  // Mesmo tom do primário — consistência
    warning: "#E9C46A",  // Amarelo-alaranjado suave
    error: "#E76F51",    // Vermelho terroso (menos agressivo)
    info: "#2A9D8F",     // Azul-esverdeado (para status neutro)
  },
};

export type AppColors = typeof COLORS.light;
export type FeedbackColors = typeof COLORS.feedback;
