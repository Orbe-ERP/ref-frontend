import styled from "styled-components/native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  primary: "#041224",
  white: "#fff",
  gray: "#888",
};

export const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.primary};
`;

export const SlideContainer = styled.View`
  width: ${width}px;
  height: ${height}px;
`;

export const ImageContainer = styled.View`
  height: 60%;
  width: 100%;
  margin-top: -10px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export const SlideImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export const ContentPlaceholder = styled.View`
  height: 40%;
  background-color: ${COLORS.primary};
`;

export const FooterContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background-color: ${COLORS.primary};
  justify-content: space-between;
  padding: 20px;
`;

export const TextContainer = styled.View`
  align-items: center;
  margin-vertical: 20px;
`;

export const SlideSubtitle = styled.Text`
  color: ${COLORS.white};
  font-size: 16px;
  text-align: center;
  line-height: 22px;
  width: 85%;
`;

export const IndicatorContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;
`;

export const Indicator = styled.View<{ active?: boolean }>`
  height: 4px;
  width: ${(props) => (props.active ? "25px" : "10px")};
  background-color: ${(props) => (props.active ? COLORS.white : COLORS.gray)};
  margin: 0 4px;
  border-radius: 2px;
`;

export const ButtonContainer = styled.View`
  margin-bottom: 10px;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
`;

export const PrimaryButton = styled.TouchableOpacity`
  flex: 1;
  height: 50px;
  background-color: ${COLORS.white};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

export const SecondaryButton = styled.TouchableOpacity`
  flex: 1;
  height: 50px;
  border-radius: 8px;
  border-width: 1;
  border-color: ${COLORS.white};
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

export const ButtonText = styled.Text<{ escuro?: boolean }>`
  color: ${(props) => (props.escuro ? COLORS.primary : COLORS.white)};
  font-size: 16px;
  font-weight: bold;
`;

export const Spacer = styled.View`
  width: 15px;
`;