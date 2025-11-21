import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import * as S from './styles';

interface LoaderProps {
  size?: 'small' | 'large';
}

export function Loader({ size = 'large' }: LoaderProps) {
  const { theme } = useAppTheme();
  const color = theme.colors.primary;

  return (
    <S.LoadingOverlay>
      <S.LoaderBox>
        <ActivityIndicator 
          size={size} 
          color={color} 
        />
        <S.LoaderText>
          Carregando...
        </S.LoaderText>
      </S.LoaderBox>
    </S.LoadingOverlay>
  );
}