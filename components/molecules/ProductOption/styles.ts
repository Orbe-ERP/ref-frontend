import styled from "styled-components/native";

export const Container = styled.View`
  background-color: #1e293b;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Radio = styled.TouchableOpacity<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${({ selected }) => (selected ? "#038082" : "#ccc")};
  align-items: center;
  justify-content: center;
`;

export const Dot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #038082;
`;

export const ProductText = styled.Text`
  margin-left: 10px;
  font-size: 16px;
  color: white;
`;

export const Actions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  align-items: center;
`;

export const AddButton = styled.TouchableOpacity`
  background-color: #038082;
  padding: 10px;
  border-radius: 50px;
`;
