import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

export const FilterContainerMobile = styled.View`
  margin-bottom: 20px;
`;

export const DateRowMobile = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const DateInputMobile = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin: 0 6px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const SearchButtonMobile = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? "#165332ff" : "#2BAE66")};
  padding: 14px;
  border-radius: 8px;
  align-items: center;
`;

export const FilterContainerWide = styled.View`
  gap: 12px;
  margin-bottom: 20px;
`;

export const DateRowWide = styled.View`
  flex-direction: row;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
`;

export const DateInput = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  min-width: 150px;
`;

export const SearchButtonWide = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? "#165332ff" : "#2BAE66")};
  padding: 12px 24px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  min-width: 120px;
`;

export const LabelText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  font-size: 16px;
`;

export const SearchButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
`;

export const CalendarWrapper = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 10px;
  padding: 10px;
  elevation: 5;
`;

export const OrderCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.primary};
`;

export const OrderHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const OrderInfoContainer = styled.View``;

export const OrderId = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const OrderDate = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
`;

export const OrderInfo = styled.View`
  margin-bottom: 8px;
  margin-top: 8px;
`;

export const OrderText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

export const ProductItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 6px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const ProductName = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
`;

export const ProductQuantity = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: 8px;
`;

export const ProductPrice = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

export const TotalContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 8px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const TotalLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const TotalValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.feedback.success || '#2e7d32'};
`;

export const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding: 40px;
  flex: 1;
`;

export const EmptyText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: 16px;
`;