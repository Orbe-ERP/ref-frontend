import { Animated, Dimensions } from "react-native";
import * as S from "./styles";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
const screenHeight = Dimensions.get("window").height;


interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  methods: string[];
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  onConfirm: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  methods,
  selectedMethod,
  onSelectMethod,
  onConfirm,
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <S.ModalOverlay>
      <S.ModalContent style={{ transform: [{ translateY: slideAnim }] }}>
        <S.ModalTitle>Selecione o método de pagamento</S.ModalTitle>

        <S.PaymentScroll>
          {methods.map((method) => {
            const selected = selectedMethod === method;
            return (
              <S.PaymentButton
                key={method}
                selected={selected}
                onPress={() => onSelectMethod(method)}
              >
                <Ionicons
                  name={
                    method === "PIX"
                      ? "cash-outline"
                      : method === "CASH"
                      ? "wallet-outline"
                      : "card-outline"
                  }
                  size={22}
                  color={selected ? "#fff" : "#aaa"}
                />
                <S.PaymentButtonText selected={selected}>
                  {method === "PIX"
                    ? "PIX"
                    : method === "CASH"
                    ? "Dinheiro"
                    : method === "CREDIT_CARD"
                    ? "Crédito"
                    : "Débito"}
                </S.PaymentButtonText>
              </S.PaymentButton>
            );
          })}
        </S.PaymentScroll>

        <S.ModalActions>
          <S.ActionButton variant="cancel" onPress={onClose}>
            <S.ActionText>Cancelar</S.ActionText>
          </S.ActionButton>
          <S.ActionButton variant="confirm" onPress={onConfirm}>
            <S.ActionText>Confirmar</S.ActionText>
          </S.ActionButton>
        </S.ModalActions>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};