import React from "react";
import styled from "styled-components/native";
import LogoutButton from "../atoms/LogoutButton";

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
`;

const Title = styled.Text`
  font-size: 20px;
  color: #ffffff;
  font-weight: 600;
  flex: 1;
  text-align: center;
`;

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <Container>
      <Title>{title}</Title>
      <LogoutButton  confirm={false}/>
    </Container>
  );
}
