import React from "react";
import styled from "styled-components/native";
import InputGroup from "@/components/molecules/InputGroup";
import Button from "@/components/atoms/Button";

interface Props {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  onSave: () => void;
  loading: boolean;
}

export default function AccountForm({
  name,
  setName,
  email,
  setEmail,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSave,
  loading,
}: Props) {
  return (
    <Form>
      <InputGroup
        label="Nome"
        value={name}
        onChangeText={setName}
        placeholder="Digite seu nome"
      />
      <InputGroup
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
        autoCapitalize="none"
      />

      <Section>
        <SectionTitle>Alterar Senha</SectionTitle>
        <InputGroup
          label="Senha Atual *"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />
        <InputGroup
          label="Nova Senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <InputGroup
          label="Confirmar Nova Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </Section>

      <Button label="Salvar Alterações" onPress={onSave}/>
    </Form>
  );
}

const Form = styled.View`
  padding: 16px;
  width: 100%;
`;

const Section = styled.View`
  margin-top: 30px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;
