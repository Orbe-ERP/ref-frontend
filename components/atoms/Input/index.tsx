import React from "react";
import { TextInputProps } from "react-native";
import { StyledInput } from "./styles";

const Input: React.FC<TextInputProps> = (props) => {
  return <StyledInput placeholderTextColor="#ccc" {...props} />;
};

export default Input;
