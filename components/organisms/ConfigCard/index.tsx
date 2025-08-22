import React from "react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { CardContainer } from "./styles";

type Props = {
  icon: string;
  title: string;
  children: React.ReactNode;
};

export function ConfigCard({ icon, title, children }: Props) {
  return (
    <CardContainer>
      <SectionHeader icon={icon} title={title} />
      {children}
    </CardContainer>
  );
}
