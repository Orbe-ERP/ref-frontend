import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LoadingText = styled.Text`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 16px;
`;

export const TicketCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 14px;
  padding: 20px;
  margin: 20px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 4;
`;

export const Header = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

export const RestaurantTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  margin-top: 4px;
  text-align: center;
`;

export const MetaInfo = styled.Text`
  color: ${({ theme }) => theme.colors.text.muted || "#888"};
  font-size: 12px;
  margin-top: 2px;
`;

export const RowInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 6px;
`;

export const Label = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

export const Value = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  font-weight: 600;
`;

export const Divider = styled.View<{ dashed?: boolean }>`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.border};
  margin-vertical: 16px;
  border-style: ${({ dashed }) => (dashed ? "dashed" : "solid")};
  border-width: ${({ dashed }) => (dashed ? "1px" : "0px")}; 
`;

export const SectionTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const ProductRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const QuantityBox = styled.View`
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 4px 8px;
  border-radius: 6px;
  margin-right: 10px;
`;

export const QuantityText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: bold;
  font-size: 14px;
`;

export const ProductInfo = styled.View`
  flex: 1;
`;

export const ProductName = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 15px;
  flex-wrap: wrap;
`;

export const ProductUnitVal = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 12px;
`;

export const ProductTotal = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 15px;
  font-weight: 600;
`;

export const SummaryContainer = styled.View`
  margin-top: 8px;
`;

export const RowSummary = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const SummaryLabel = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 15px;
`;

export const SummaryValue = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 15px;
  font-weight: 500;
`;

export const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const TotalLabel = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 18px;
  font-weight: bold;
`;

export const TotalValue = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
  font-weight: bold;
`;

export const FooterInfo = styled.View`
  margin-top: 24px;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 12px;
  border-radius: 8px;
`;

export const PaymentTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
`;

export const PaymentInfo = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

export const BottomButtonContainer = styled.View`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 3px;
  shadow-offset: 0px -2px;
  elevation: 5;
`;