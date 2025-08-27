import React from "react";
import styled from "styled-components/native";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { TextInputProps } from "react-native";

interface InputGroupProps extends TextInputProps {
  label: string;
}

export default function InputGroup({ label, ...rest }: InputGroupProps) {
  return (
    <Container>
      <Label>{label}</Label>
      <Input {...rest} />
    </Container>
  );
}

const Container = styled.View`
  margin-bottom: 20px;
`;
