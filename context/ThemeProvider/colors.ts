export const COLORS = {
  light: {
    primary: "#2BAE66",      
    secondary: "#264653",    
    accent: "#E9C46A",     
    background: "#e9e9e9ff",
    surface: "#FFFFFF",  
    text: {
      primary: "#1E1E1E",   
      secondary: "#4A4A4A",  
      accent: "#2BAE66",  
      muted: "#7A8A99",    
    },
    border: "#DADADA",
    overlay: "rgba(0,0,0,0.04)",
    disabled: {
      background: "#E6E6E6",
      text: "#5C6B7A",
    },
  },

  dark: {
    primary: "#2BAE66",  
    secondary: "#264653",  
    accent: "#E9C46A",      
    background: "#0A1A2F",   
    surface: "#152A3A",      
    text: {
      primary: "#FFFFFF", 
      secondary: "#B0BEC5", 
      accent: "#3DDC97",     
      muted: "#7A8A99",   
    },
    border: "#23394E",
    overlay: "rgba(255,255,255,0.05)",
    disabled: {
      background: "#1E3248",
      text: "#5C6B7A",
    },
  },

  feedback: {
    success: "#2BAE66", 
    warning: "#E9C46A",
    error: "#E76F51",
    info: "#2A9D8F",  
  },
};

export type AppColors = typeof COLORS.light;
export type FeedbackColors = typeof COLORS.feedback;
