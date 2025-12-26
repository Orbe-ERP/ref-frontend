import { Modal, Alert, Switch } from "react-native";
import { useEffect, useState } from "react";
import * as S from "./styles";
import { Printer } from "@/services/printer";
import Button from "@/components/atoms/Button";
import InputGroup from "@/components/molecules/InputGroup";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    ip: string;
    port: number;
    default?: boolean;
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
  printer?: Printer | null;
}

export function PrinterFormModal({
  visible,
  onClose,
  onSubmit,
  onDelete,
  printer,
}: Props) {
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = !!printer;

  useEffect(() => {
    if (printer) {
      setName(printer.name);
      setIp(printer.ip);
      setPort(String(printer.port));
      setIsDefault(!!printer.default);
    } else {
      setName("");
      setIp("");
      setPort("");
      setIsDefault(false);
    }
  }, [printer, visible]);

  async function handleSubmit() {
    if (!name || !ip || !port) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        name,
        ip,
        port: Number(port),
        default: isDefault,
      });
      onClose();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a impressora");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    Alert.alert(
      "Excluir impressora",
      "Tem certeza que deseja excluir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (!onDelete) return;
            await onDelete();
            onClose();
          },
        },
      ]
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <S.Overlay>
        <S.Container>
          <S.Title>
            {isEdit ? "Editar impressora" : "Nova impressora"}
          </S.Title>

          <InputGroup label="Nome" value={name} onChangeText={setName} />
          <InputGroup label="IP" value={ip} onChangeText={setIp} />
          <InputGroup
            label="Porta"
            keyboardType="numeric"
            value={port}
            onChangeText={setPort}
          />

          <S.SwitchRow>
            <S.Label>Padrão</S.Label>
            <Switch value={isDefault} onValueChange={setIsDefault} />
          </S.SwitchRow>

          <Button
            label={isEdit ? "Salvar" : "Criar"}
            onPress={handleSubmit}
          />

          {isEdit && onDelete && (
            <Button
              label="Excluir"
              variant="danger"
              onPress={handleDelete}
            />
          )}

          <Button label="Cancelar" onPress={onClose} />
        </S.Container>
      </S.Overlay>
    </Modal>
  );
}
