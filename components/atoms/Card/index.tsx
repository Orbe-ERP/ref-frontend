import React from "react";
import { Container } from "./styles";

interface CardProps {
  children: React.ReactNode;
  style?: object;
}

export default function Card({ children, style }: CardProps) {
  return <Container style={style}>{children}</Container>;
}
