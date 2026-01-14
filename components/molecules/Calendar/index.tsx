import React from 'react';
import { Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import * as S from './styles';

interface CalendarModalProps {
  visible: boolean;
  startDate: string;
  endDate: string;
  onSelectDate: (day: { dateString: string }) => void;
  onClose: () => void;
}

export const CalendarModal = ({ 
  visible, 
  startDate, 
  endDate, 
  onSelectDate, 
  onClose 
}: CalendarModalProps) => {
  const { theme } = useAppTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <S.ModalOverlay>
        <S.CalendarWrapper>
          <Calendar
            onDayPress={onSelectDate}
            markingType="period"
            markedDates={{
              [startDate]: {
                startingDay: true,
                selected: true,
                color: theme.colors.primary,
                textColor: "white",
              },
              [endDate]: {
                endingDay: true,
                selected: true,
                color: theme.colors.primary,
                textColor: "white",
              },
            }}
            theme={{
              backgroundColor: theme.colors.background,
              calendarBackground: theme.colors.background,
              textSectionTitleColor: theme.colors.text.secondary,
              dayTextColor: theme.colors.text.primary,
              todayTextColor: theme.colors.primary,
              selectedDayTextColor: "white",
              monthTextColor: theme.colors.text.primary,
              arrowColor: theme.colors.primary,
              textDisabledColor: `${theme.colors.text.secondary}50`,
            }}
          />
          
          <S.CloseButton onPress={onClose}>
            <S.CloseButtonText>FECHAR</S.CloseButtonText>
          </S.CloseButton>
        </S.CalendarWrapper>
      </S.ModalOverlay>
    </Modal>
  );
};