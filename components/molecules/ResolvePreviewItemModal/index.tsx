import React, { useState } from "react";
import { Modal, FlatList, TouchableOpacity } from "react-native";
import * as S from "./styles";
import Button from "@/components/atoms/Button";

interface Props {
  visible: boolean;
  item: any;
  stockItems: any[];
  onConfirm: (stockItemId: string) => void;
  onClose: () => void;
}

export default function ResolvePreviewItemModal({
  visible,
  item,
  stockItems,
  onConfirm,
  onClose,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <Modal visible={visible} animationType="slide">
      <S.ModalContainer>
        <S.SectionTitle>Corrigir item</S.SectionTitle>
        <S.InfoText>Item da nota</S.InfoText>
        <S.ItemTitle>{item.originalName}</S.ItemTitle>

        <S.SectionTitle style={{ marginTop: 16 }}>
          Escolha no estoque
        </S.SectionTitle>

        <FlatList
          data={stockItems}
          keyExtractor={(i) => i.id}
          renderItem={({ item: stock }) => (
            <TouchableOpacity onPress={() => setSelectedId(stock.id)}>
              <S.ItemCard
                style={{
                  borderColor: selectedId === stock.id ? "#4f46e5" : undefined,
                }}
              >
                <S.ItemTitle>{stock.name}</S.ItemTitle>
              </S.ItemCard>
            </TouchableOpacity>
          )}
        />

        <Button
          label="Confirmar correção"
          disabled={!selectedId}
          onPress={() => onConfirm(selectedId!)}
        />

        <Button label="Cancelar" variant="secondary" onPress={onClose} />
      </S.ModalContainer>
    </Modal>
  );
}
