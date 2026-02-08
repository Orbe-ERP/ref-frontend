import styled from "styled-components/native";
import { Picker } from "@react-native-picker/picker";


export const ContentCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 20px;
  border-width: 1;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const PreviewRow = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

export const PreviewLabel = styled.Text`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 120px;
`;

export const PreviewValue = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
  flex-wrap: wrap;
`;

export const Label = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  margin-bottom: 2px;
`;

export const InfoText = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const WarningText = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.feedback.warning};
  margin-bottom: 10px;
`;

export const ItemCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const ItemHeader = styled.View`
  margin-bottom: 12px;
`;

export const ItemTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

export const ItemTotalValue = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const TotalSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0 24px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.primary}10;
  border-radius: 16px;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.primary}40;
`;

export const TotalLabelLarge = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const TotalLarge = styled.Text`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ButtonRow = styled.View`
  margin-top: 12px;
`;

export const ModalContainer = styled.ScrollView`
  flex: 1;
  padding: 16px;
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

export const ItemBox = styled.View`
  margin-top: 16px;
  padding: 12px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.surface};
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

export const PickerContainer = styled.View`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 15px;
  overflow: hidden;
  min-height: 48px;
  justify-content: center;
`;

export const StyledPicker = styled(Picker)`
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: transparent;
  height: 48px;
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
  color: ${({ theme }) => theme.colors.text.primary};

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

export const SupplierName = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

export const CardBody = styled.View``;

export const ScreenContainer = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

/* CARD PRINCIPAL */
export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 18px;
  border-radius: 18px;
  margin-bottom: 16px;

  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};

  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 10px;
  shadow-offset: 0px 4px;
  elevation: 2;
`;

/* HEADER */
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Supplier = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
  margin-right: 8px;
`;

export const Total = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

/* META */
export const Meta = styled.View`
  margin-top: 8px;
  gap: 2px;
`;

export const MetaText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

/* ITENS */
export const ItemsContainer = styled.View`
  margin-top: 14px;
  padding-top: 12px;

  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const ItemsTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;

export const ItemRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 8px 0;
`;

export const ItemLeft = styled.View`
  flex: 1;
`;

export const ItemText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ItemSub = styled.Text`
  font-size: 12px;
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ItemTotal = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

/* FOOTER */
export const Footer = styled.View`
  margin-top: 14px;
  padding-top: 10px;

  flex-direction: row;
  justify-content: space-between;

  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const FooterText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

/* ESTADOS */
export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const LoadingText = styled.Text`
  margin-top: 12px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const EmptyText = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 16px;
  text-align: center;
`;

/* BOTÃO FLUTUANTE */
export const FloatingButton = styled.View`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 24px;
`;
