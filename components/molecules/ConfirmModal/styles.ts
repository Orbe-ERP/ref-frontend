import styled from "styled-components/native";

export const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const Content = styled.View`
  width: 80%;
  background-color: #041b38;
  border-radius: 10px;
  padding: 20px;
  align-items: center;
`;

export const Title = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const Button = styled.TouchableOpacity<{ danger?: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  align-items: center;
  margin: 0 5px;
  background-color: ${({ danger }) => (danger ? "#dc3545" : "#038082")};
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;
