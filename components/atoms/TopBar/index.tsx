import React, { useRef, useEffect } from "react";
import { Animated, Dimensions } from "react-native";
import * as S from "./styles";

const screenHeight = Dimensions.get("window").height;

interface TopBarProps {
  ordersCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({ ordersCount }) => {
  const badgeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(badgeAnim, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(badgeAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, [ordersCount]);

  return (
    <S.TopBarContainer>
      <S.TopBarText>Comandas Abertas</S.TopBarText>
      <S.Badge style={{ transform: [{ scale: badgeAnim }] }}>
        <S.BadgeText>{ordersCount}</S.BadgeText>
      </S.Badge>
    </S.TopBarContainer>
  );
};