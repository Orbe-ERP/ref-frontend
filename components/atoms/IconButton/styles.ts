import styled from "styled-components/native";

export const StyledButton = styled.TouchableOpacity<{ backgroundColor?: string }>`
  background-color: ${({ backgroundColor }: { backgroundColor?: string }) => backgroundColor ?? "#4B5563"};
  padding: 6px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;
