import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.overlay};
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Content = styled.View`
  padding: 24px;
`;

export const TitleContainer = styled.View`
  margin-bottom: 32px;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
  text-align: center;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: 24px;
`;

export const PlansGrid = styled.View`
  gap: 16px;
  margin-bottom: 24px;
`;

export const PlanCard = styled.TouchableOpacity<{
  recommended?: boolean;
  selected: boolean;
}>`
  background-color: ${({ theme, selected }) =>
    selected ? `${theme.colors.primary}15` : theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  border-width: 2px;
  border-color: ${({ theme, selected, recommended }) => {
    if (selected) return theme.colors.primary;
    if (recommended) return theme.colors.accent;
    return theme.colors.border;
  }};
  position: relative;
`;

export const RecommendedBadge = styled.View`
  position: absolute;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
`;

export const RecommendedText = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-size: 12px;
  font-weight: 600;
`;

export const PlanHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const PlanName = styled.Text<{ selected: boolean }>`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.text.primary};
`;

export const PlanPrice = styled.Text<{ selected: boolean }>`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.text.primary};
`;

export const Interval = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: normal;
`;

export const PlanFeatures = styled.View`
  gap: 12px;
`;

export const FeatureItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
`;

export const FeatureText = styled.Text`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 20px;
`;

export const ErrorContainer = styled.View`
  background-color: ${({ theme }) => `${theme.colors.feedback.error}15`};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.feedback.error};
  font-size: 14px;
`;

export const SelectedPlanSummary = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 20px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  margin-bottom: 24px;
`;

export const SummaryHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const SummaryTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const SummaryPrice = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const SummaryName = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
`;

export const ContinueButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const ContinueButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-size: 16px;
  font-weight: 600;
`;

export const SecurityInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => `${theme.colors.feedback.success}15`};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const SecurityText = styled.Text`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.feedback.success};
`;

export const NotesContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.overlay};
  padding: 16px;
  border-radius: 8px;
  gap: 8px;
`;

export const NoteText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;
