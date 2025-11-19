import { useAppTheme } from '@/context/ThemeProvider/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import * as S from './styles';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

export function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  isLoading = false,
}: PaginationProps) {
  const { theme } = useAppTheme();
  
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  const handlePrev = () => {
    if (!isFirstPage && !isLoading) {
      onPrev();
    }
  };

  const handleNext = () => {
    if (!isLastPage && !isLoading) {
      onNext();
    }
  };

  return (
    <S.PaginationContainer>
      <S.PageButton 
        onPress={handlePrev} 
        disabled={isFirstPage || isLoading}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="chevron-back" 
          size={24} 
          color={isFirstPage || isLoading ? theme.colors.text.secondary : theme.colors.primary} 
          style={{ opacity: isFirstPage || isLoading ? 0.3 : 1 }}
        />
      </S.PageButton>

      <S.PageIndicatorContainer>
        <S.CurrentPage>{page}</S.CurrentPage>
        <S.TotalPages>de {totalPages}</S.TotalPages>
      </S.PageIndicatorContainer>

      <S.PageButton
        onPress={handleNext}
        disabled={isLastPage || isLoading}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color={isLastPage || isLoading ? theme.colors.text.secondary : theme.colors.primary}
          style={{ opacity: isLastPage || isLoading ? 0.3 : 1 }}
        />
      </S.PageButton>
    </S.PaginationContainer>
  );
}