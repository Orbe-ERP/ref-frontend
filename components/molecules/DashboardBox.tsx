import React from "react";
import styled from "styled-components/native";
import Title from "../atoms/Title";

const Container = styled.View`
  background-color: #041224;
  border: 1 solid #038082;
  border-radius: 15px;
  padding: 25px;
  margin-top: 20px;
`;

const OptionButton = styled.TouchableOpacity`
  background-color: #2a4b7c;
  border-radius: 5px;
  padding: 15px;
  align-items: center;
  margin-bottom: 15px;
`;

const OptionText = styled.Text`
  font-size: 18px;
  color: #fff;
  font-weight: 500;
`;

interface DashboardBoxProps {
  title: string;
  options: { label: string; onPress: () => void }[];
}

export default function DashboardBox({ title, options }: DashboardBoxProps) {
  return (
    <Container>
      <Title>{title}</Title>
      {options.map((opt, index) => (
        <OptionButton key={index} onPress={opt.onPress}>
          <OptionText>{opt.label}</OptionText>
        </OptionButton>
      ))}
    </Container>
  );
}
