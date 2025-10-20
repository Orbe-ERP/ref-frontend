import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

export const FilterContainer = styled.View`
  margin-bottom: 20px;
`;

export const DateRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const DateInput = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  border-width: 1px;
  border-color: #2d2d42;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin: 0 6px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LabelText = styled.Text`
  color: #ffffff;
  text-align: center;
`;

export const SearchButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) => (props.disabled ? "#165332ff" : "#2BAE66")};
  padding: 14px;
  border-radius: 8px;
  align-items: center;
`;

export const SearchButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.accent};
  padding: 20px;
`;

export const CalendarWrapper = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 10px;
  padding: 10px;
  elevation: 5;
`;

export const OrderCard = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.border};
`;

export const OrderHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const OrderInfoContainer = styled.View``;

export const OrderId = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const OrderDate = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};

  margin-top: 4px;
`;

export const OrderInfo = styled.View`
  margin-bottom: 8px;
`;

export const OrderText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ProductItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 4px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

export const ProductName = styled.Text`
  font-size: 14px;

  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ProductQuantity = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};

  margin-left: 8px;
`;

export const ProductPrice = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const TotalContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
  padding-top: 8px;
`;

export const TotalLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const TotalValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #2e7d32;
`;

export const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

export const EmptyText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.primary};

  text-align: center;
  margin-top: 16px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
