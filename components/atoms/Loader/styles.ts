import styled from 'styled-components/native';

export const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background-color: ${({ theme }) => theme.colors.overlay};
`;

export const LoaderBox = styled.View`
  background-color: ${({ theme }) => theme.colors.surface}; 
  padding: 24px 30px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  
  elevation: 8;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 6px;
  
  border-color: ${({ theme }) => theme.colors.border};
`;

export const LoaderText = styled.Text`
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary}; 
`;