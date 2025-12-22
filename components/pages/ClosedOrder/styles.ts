import styled from "styled-components/native";

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

export const OrderCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  elevation: 4;
`;

export const OrderHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const OrderInfoContainer = styled.View`
  flex: 1;
`;

export const OrderId = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const OrderDate = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
`;

export const PrintButton = styled.TouchableOpacity`
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  margin-left: 12px;
`;

export const OrderInfo = styled.View`
  margin-bottom: 8px;
`;

export const OrderText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

export const ProductsList = styled.View`
  margin-top: 8px;
`;

export const ProductItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 4px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const ProductInfo = styled.View`
  flex-direction: row;
  flex: 1;
`;

export const ProductName = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ProductQuantity = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: 8px;
`;

export const ProductPrice = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

export const TotalContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
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
  color: ${({ theme }) => theme.colors.primary};
`;

export const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

export const EmptyText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: 16px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ModalOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const PrintModal = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  margin: 20px;
  width: 90%;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ModalText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;

export const ModalButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

export const ModalButton = styled.TouchableOpacity`
  padding: 12px 20px;
  border-radius: 8px;
  flex: 1;
  margin-horizontal: 5px;
  align-items: center;
`;

export const CancelButton = styled(ModalButton)`
  background-color: ${({ theme }) => theme.colors.text.secondary};
`;

export const PrintButtonModal = styled(ModalButton)`
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-weight: 500;
`;

export const PageButtonText = styled.Text<{ disabled?: boolean }>`
  color: ${({ theme }) => theme.colors.surface};
  font-size: 14px;
  font-weight: bold;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const PageIndicator = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Adicione estas styled components ao seu arquivo de estilos existente

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
  border-width: 1;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin: 0 6px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const LabelText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

export const SearchButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ theme, disabled }) => 
    disabled ? theme.colors.text.secondary : theme.colors.primary};
  padding: 14px;
  border-radius: 8px;
  align-items: center;
`;

export const SearchButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-size: 16px;
  font-weight: bold;
`;

export const CalendarWrapper = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
  padding: 10px;
  elevation: 5;
  margin: 20px;
`;
