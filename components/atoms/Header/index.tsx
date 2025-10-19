import React from "react";
import { Container } from "./styles";
import Title from "../Title";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <Container>
      <Title>
        {title}
      </Title>
    </Container>
  );
}
