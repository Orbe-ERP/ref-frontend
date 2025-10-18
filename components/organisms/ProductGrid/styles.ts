import styled from "styled-components/native";


export const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  max-width: 250px;
`;

export const AddButton = styled.TouchableOpacity`
  border: 1px dashed #4b5563;
  width: 45%;
  aspect-ratio: 1;
  margin: 0;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
`;

export const AddText = styled.Text`
  color: white;
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
`;
