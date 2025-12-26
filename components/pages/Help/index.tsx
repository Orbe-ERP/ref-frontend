import { Linking } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/atoms/Button";
import * as S from "./styles";
import { useAppTheme } from "@/context/ThemeProvider/theme";

const SUPPORT_EMAIL = "suporte@comandanteapp.com.br";

export default function HelpScreen() {
  const theme = useAppTheme();

  function handleSendEmail() {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Ajuda",
          headerStyle: { backgroundColor: theme.theme.colors.background },
          headerTintColor: theme.theme.colors.text.primary,
          headerShadowVisible: false,
        }}
      />

      <S.Container>
        <S.ToastNotice>
          <S.ToastIcon>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={theme.theme.colors.feedback.warning}
            />
          </S.ToastIcon>

          <S.ToastContent>
            <S.ToastTitle>Precisa de ajuda?</S.ToastTitle>
            <S.ToastText>
              Caso tenha dúvidas, problemas ou precise de suporte técnico,
              entre em contato com nossa equipe.
            </S.ToastText>
          </S.ToastContent>
        </S.ToastNotice>

        {/* Card de contato */}
        <S.Card>
          <S.CardHeader>
            <Ionicons
              name="mail-outline"
              size={22}
              color={theme.theme.colors.text.primary}
            />
            <S.CardTitle>Contato por e-mail</S.CardTitle>
          </S.CardHeader>

          <S.CardText>
            Envie um e-mail para nossa equipe de suporte:
          </S.CardText>

          <S.Email>{SUPPORT_EMAIL}</S.Email>

          <Button
            label="Enviar e-mail"
            onPress={handleSendEmail}
          />
        </S.Card>
      </S.Container>
    </>
  );
}
