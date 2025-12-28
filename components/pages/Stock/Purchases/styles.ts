import styled from "styled-components/native";

export const ScreenContainer = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ModalContainer = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
`;

export const ItemName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ItemInfo = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Total = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 8px;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const EmptyText = styled.Text`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ItemBox = styled.View`
  margin-top: 16px;
  padding: 12px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Label = styled.Text`
  font-weight: bold;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const LoadingText = styled.Text`
  margin-top: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const FormContainer = styled.ScrollView`
  padding: 16px;
`;

export const FormGroup = styled.View`
  margin-bottom: 16px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ItemCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border-width: 1;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const ItemHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ItemTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const PickerContainer = styled.View`
  border-width: 1;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ItemTotal = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top-width: 1;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const ItemTotalValue = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const TotalSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  border-width: 1;
  border-color: ${({ theme }) => theme.colors.primary}20;
`;

export const TotalLabelLarge = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const TotalLarge = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  margin-top: 8px;
  justify-content: space-between
`;

export const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const DateBadge = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 4px 8px;
  border-radius: 12px;
`;

export const InfoText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: 4px;
`;

export const TotalContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top-width: 1;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const TotalLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const EmptySubtext = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
  text-align: center;
`;

export const FilterContainer = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const FilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 20px;
  border-width: 1;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const FilterText = styled.Text`
  margin-left: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ListHeader = styled.View`
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  margin-bottom: 12px;
  border-width: 1;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const ListHeaderText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

export const TotalSummary = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const CardActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top-width: 1;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const FormSection = styled.View`
  margin-bottom: 24px;
`;

export const SectionHeader = styled.View`
  margin-bottom: 16px;
`;

export const HelpText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
  font-style: italic;
`;
