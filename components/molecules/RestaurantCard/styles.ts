import styled from "styled-components/native";

export const Container = styled.TouchableOpacity<{ selected?: boolean }>`
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.secondary : theme.colors.surface};
  padding: 15px;
  border-radius: 8px;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 140px;
  position: relative;
`;

export const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const IconsContainer = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  flex-direction: row;
  gap: 10px;
`;

export const IconButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.overlay};
  padding: 5px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;
