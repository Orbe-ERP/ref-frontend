import styled from "styled-components/native";

export const StyledButton = styled.TouchableOpacity<{ variant: "primary" | "secondary" | "danger" }>`
  background-color: ${({ variant }: { variant: "primary" | "secondary" | "danger" }) =>
    // variant === "primary" ? "#93bd9a" :
    variant === "primary" ? "#9fd6d2" :
    variant === "secondary" ? "#7FE06C" :
    variant === "danger" ? "#DC2626" : "#2A4B7C"};
  border-radius: 5px;
  padding: 15px;
  align-items: center;
  margin-bottom: 15px;
`;

export const Label = styled.Text`
  font-size: 18px;
  color: #041224;
  font-weight: 500;
`;
