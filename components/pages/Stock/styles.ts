import styled from 'styled-components/native';
import { Picker } from '@react-native-picker/picker';

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  padding: 20px 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.secondary};
`;

export const MenuContainer = styled.ScrollView`
  flex: 1;
`;

export const MenuCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

export const IconContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.primary}15;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const MenuContent = styled.View`
  flex: 1;
`;

export const MenuTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

export const MenuDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 18px;
`;

export const ArrowContainer = styled.View`
  margin-left: 8px;
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  margin: 8px 16px;
  border-radius: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const InfoContainer = styled.View`
  flex: 1;
`;

export const ItemName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

export const ItemInfo = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2px;
`;



export const FormContainer = styled.ScrollView`
  flex: 1;
`;

export const Name = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

export const Info = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2px;
`;

export const ActionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ActionButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 8px;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
`;

export const EmptyText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 16px;
  text-align: center;
`;

export const EmptySubtext = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 8px;
  text-align: center;
`;

export const PickerContainer = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
`;

export const StyledPicker = styled(Picker)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: 0;
`;