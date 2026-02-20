import styled from "styled-components/native";
import { ScrollView } from "react-native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const StyledScrollView = styled(ScrollView)``;

export const LogoutContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 12px;
`;

export const ChartSection = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
  border-width: 1;
  border-color: rgba(255, 255, 255, 0.1);
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const HeaderRight = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

export const SalesCount = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
`;

export const RefreshButton = styled.TouchableOpacity`
  padding: 6px;
`;

export const EmptyState = styled.View`
  padding: 24px;
  align-items: center;
  background-color: rgba(3, 128, 130, 0.1);
  border-radius: 12px;
  border-width: 1;
  border-color: rgba(3, 128, 130, 0.3);
`;

export const EmptyText = styled.Text`
  color: ${({ theme }) => theme.colors.text.accent};
  text-align: center;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
`;

export const LoadingContainer = styled.View`
  padding: 30px;
  align-items: center;
`;

export const LoadingText = styled.Text`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 13px;
`;

export const ErrorContainer = styled.View`
  padding: 16px;
  align-items: center;
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: 12;
  border-width: 1;
  border-color: rgba(211, 47, 47, 0.3);
`;

export const ErrorText = styled.Text`
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 10px;
  font-size: 13px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-top: 12px;
  justify-content: center;
  align-items: center;
`;

export const StatusSection = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  padding: 16px;
  flex-direction: row;
  justify-content: space-around;
  border-width: 1;
  border-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

export const StatusItem = styled.View`
  align-items: center;
`;

export const StatusLabel = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
  font-weight: 500;
`;

export const StatusValue = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;
