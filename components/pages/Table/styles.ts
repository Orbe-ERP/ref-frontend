import styled from "styled-components/native";
import { ScrollView } from "react-native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 24px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding-vertical: 20;
  padding-horizontal: 15;
  border-bottom-width: 1;
  border-bottom-color: ${({ theme }) => theme.colors.secondary};
`;

export const TableScroll = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 40,
    gap: 15
  },
})``;
