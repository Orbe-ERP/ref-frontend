import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

export const FilterContainer = styled.View<{ wide?: boolean }>`
  gap: 12px;
`;

export const DateRow = styled.View<{ wide?: boolean }>`
  flex-direction: ${({ wide }) => (wide ? 'row' : 'column')};
  gap: 8px;
  align-items: ${({ wide }) => (wide ? 'center' : 'stretch')};
`;

export const DateInput = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  border-width: 1;
  border-color: #2d2d42;
  border-radius: 8;
  margin: 0 6px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LabelText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

export const SearchButton = styled.TouchableOpacity<{ $inline?: boolean }>`
  background-color: ${(props) => (props.disabled ? '#2BAE66' : '#2BAE66')};
  padding: 12px 16px;
  border-radius: 8;
  align-items: center;
  justify-content: center;
  ${({ $inline }) =>
    $inline &&
    `
    flex: 0.6;
  `}
`;

export const SearchButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: bold;
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
`;

export const CalendarWrapper = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 10;
  padding: 10px;
  elevation: 5;
`;

export const TableWrapper = styled.View`
  border-width: 1;
  border-color: #2d2d42;
  border-radius: 8;
  overflow: hidden;
`;

export const RowHeader = styled.View`
  flex-direction: row;
  padding-vertical: 12px;
  padding-horizontal: 8px;
  background-color: ${({ theme }) => theme.colors.background};

`;

export const Row = styled.View<{ background?: string }>`
  flex-direction: row;
  padding-vertical: 12px;
  padding-horizontal: 8px;
  background-color: ${(props) => props.background || '#1a1a2e'};
`;

export const RowFooter = styled(Row)`
  background-color: ${({ theme }) => theme.colors.background};
  border-top-width: 2;
  border-top-color: #2d2d42;
`;

export const CellHeader = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  font-weight: bold;
`;

export const Cell = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  font-size: 14px;
`;

export const RowDivider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LoadingText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-top: 20px;
`;

export const EmptyText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
`;

export const FilterContainerMobile = styled.View`
  margin-bottom: 20px;
`;

export const DateRowMobile = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 12px;
`;

export const DateInputMobile = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
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

export const SearchButtonWide = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? "#165332ff" : "#2BAE66")};
  padding: 12px 24px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  min-width: 120px;
`;