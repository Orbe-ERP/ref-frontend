import { useWindowDimensions, Platform, } from "react-native";

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isLargeDesktop = width >= 1440;

  // Fatores de escala mais granulares
  const scale = isMobile ? 1 : isTablet ? 0.9 : isLargeDesktop ? 0.8 : 0.85;
  
  // Fator de escala para textos
  const textScale = isMobile ? 1 : isTablet ? 1.1 : 1.2;

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    scale,
    textScale,
    isWeb: Platform.OS === "web",
    platform: Platform.OS,
  };
}