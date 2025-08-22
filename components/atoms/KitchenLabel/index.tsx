import React from "react";
import { StyledKitchenLabel } from "./styles";

interface KitchenLabelProps {
  color: string;
  children: React.ReactNode;
}

export default function KitchenLabel({ color, children }: KitchenLabelProps) {
  return <StyledKitchenLabel color={color}>{children}</StyledKitchenLabel>;
}
