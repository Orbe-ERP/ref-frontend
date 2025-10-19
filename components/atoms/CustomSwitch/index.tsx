import React, { useState } from "react";
import styled from "styled-components/native";
import { Animated, Pressable } from "react-native";

interface Props {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export default function CustomSwitch({ value, onValueChange }: Props) {
  const [anim] = useState(new Animated.Value(value ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 15],
  });

  return (
    <Pressable onPress={() => onValueChange(!value)}>
      <Track active={value}>
        <AnimatedThumb style={{ transform: [{ translateX }] }} />
      </Track>
    </Pressable>
  );
}

const Track = styled.View<{ active: boolean }>`
  width: 44px;
  height: 26px;
  border-radius: 13px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.feedback.success : theme.colors.text.muted};
  padding: 2px;
`;

const AnimatedThumb = styled(Animated.View)`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: ${({ theme }) => theme.colors.surface};
  elevation: 2;
`;
