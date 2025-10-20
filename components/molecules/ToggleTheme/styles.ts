import styled from "styled-components/native";

export const ButtonContainer = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.surface : theme.colors.feedback.error};
  padding: 10px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  min-width: 50px;
  min-height: 50px;
`;