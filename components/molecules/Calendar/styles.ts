import styled from 'styled-components/native';

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const CalendarWrapper = styled.View`
  width: 100%;
  max-width: 400px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 16px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const CloseButton = styled.TouchableOpacity`
  margin-top: 16px;
  height: 45px;
  width: 100%;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

export const CloseButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: 14px;
`;