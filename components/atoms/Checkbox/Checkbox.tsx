import styled from "styled-components/native";

export const CheckboxItem = styled.TouchableOpacity<{ selected?: boolean }>`
  background-color: ${({ selected }) => (selected ? "#2563EB" : "#334155")};
  border-radius: 6px;
  padding: 6px 10px;
  margin: 4px;
`;

export const CheckboxText = styled.Text`
  color: #fff;
  font-size: 14px;
`;
