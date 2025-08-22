import styled from "styled-components/native";

export const Container = styled.TouchableOpacity<{ selected?: boolean }>`
  background-color: ${({ selected }: { selected?: boolean }) => (selected ? "#038082" : "#2D3748")};
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
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
  background-color: #038082;
  padding: 5px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;
