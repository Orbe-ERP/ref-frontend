import React, { useState, useEffect } from 'react';
import { ScrollView, Modal, Button, } from 'react-native';
import styled from 'styled-components/native';
import { Calendar } from 'react-native-calendars';
import { getReportData, ReportData } from '@/services/report';
import useRestaurant from '@/hooks/useRestaurant';
import dayjs from 'dayjs';
import { Stack } from 'expo-router';

export default function ReportScreen() {
  const { selectedRestaurant } = useRestaurant();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showCalendarFor, setShowCalendarFor] = useState<'start' | 'end' | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedRestaurant?.id) {
      fetchData();
    }
  }, [selectedRestaurant]);

  async function fetchData(initial?: string, final?: string) {
    try {
      setLoading(true);
      const data = await getReportData({
        restaurantId: selectedRestaurant.id,
        initialDate: initial || dayjs().startOf('month').format('YYYY-MM-DD'),
        finalDate: final || dayjs().endOf('month').format('YYYY-MM-DD'),
      });

      setReportData(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleDateSelect = (day: { dateString: string }) => {
    if (showCalendarFor === 'start') {
      setStartDate(day.dateString);
    } else if (showCalendarFor === 'end') {
      setEndDate(day.dateString);
    }
    setShowCalendarFor(null);
  };

  const handleSearch = () => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    } else {
      fetchData();
    }
  };

  return (
    <>
        <Stack.Screen
            options={{
                title: 'Relatório',
                headerStyle: { 
                    backgroundColor: "#041224"
                },
            }}
        />
        <Container>
        <ScrollView>
            <FilterContainer>
            <DateRow>
                <DateInput onPress={() => setShowCalendarFor('start')}>
                <LabelText>
                    De: {startDate ? dayjs(startDate).format('DD/MM/YYYY') : '--/--/----'}
                </LabelText>
                </DateInput>

                <DateInput onPress={() => setShowCalendarFor('end')}>
                <LabelText>
                    Até: {endDate ? dayjs(endDate).format('DD/MM/YYYY') : '--/--/----'}
                </LabelText>
                </DateInput>
            </DateRow>

            <SearchButton onPress={handleSearch} disabled={loading}>
                <SearchButtonText>{loading ? 'Carregando...' : 'Buscar'}</SearchButtonText>
            </SearchButton>
            </FilterContainer>

            <Modal visible={!!showCalendarFor} transparent>
            <ModalContainer>
                <CalendarWrapper>
                <Calendar
                    onDayPress={handleDateSelect}
                    theme={{
                    backgroundColor: '#041224',
                    calendarBackground: '#041224',
                    textSectionTitleColor: '#ffffff',
                    dayTextColor: '#ffffff',
                    todayTextColor: '#ffd700',
                    selectedDayBackgroundColor: '#038082',
                    selectedDayTextColor: '#ffffff',
                    monthTextColor: '#ffffff',
                    arrowColor: '#ffffff',
                    }}
                />
                <Button title="Fechar" onPress={() => setShowCalendarFor(null)} />
                </CalendarWrapper>
            </ModalContainer>
            </Modal>

            {loading ? (
            <LoadingText>Carregando dados...</LoadingText>
            ) : reportData.length > 0 ? (
            <TableWrapper>
                <RowHeader>
                <CellHeader>Data</CellHeader>
                <CellHeader>Total</CellHeader>
                <CellHeader>Gorjeta</CellHeader>
                <CellHeader>Taxa do Cartão</CellHeader>
                <CellHeader>Pagamento</CellHeader>
                </RowHeader>

                {reportData.map((order, index) => (
                <React.Fragment key={index}>
                    <Row background={index % 2 === 0 ? '#1a1a2e' : '#252545'}>
                    <Cell>{dayjs(order.createdAt).format('DD/MM HH:mm')}</Cell>
                    <Cell>R$ {order.totalValue.toFixed(2)}</Cell>
                    <Cell>R$ {order.additional.toFixed(2)}</Cell>
                    <Cell>R$ {order.feePaidValue.toFixed(2)}</Cell>
                    <Cell>{order.paymentMethod}</Cell>
                    </Row>
                    <RowDivider />
                </React.Fragment>
                ))}


                <RowFooter>
                <Cell style={{ flex: 0.8, textAlign: 'left', paddingLeft: 12 }}>Gorjetas:</Cell>
                <Cell>
                    R${' '}
                    {reportData
                    .reduce((sum, order) => sum + order.additional, 0)
                    .toFixed(2)}
                </Cell>
                </RowFooter>

                <RowFooter>
                <Cell style={{ flex: 0.8, textAlign: 'left', paddingLeft: 12 }}>Total Geral:</Cell>
                <Cell>
                    R${' '}
                    {reportData
                    .reduce((sum, order) => sum + order.totalValue, 0)
                    .toFixed(2)}
                </Cell>
                </RowFooter>
            </TableWrapper>
            ) : (
            <EmptyText>Nenhum dado encontrado</EmptyText>
            )}
        </ScrollView>
        </Container>
    </>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #041224;
  padding: 16px;
`;

const FilterContainer = styled.View`
  margin-bottom: 20px;
`;

const DateRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const DateInput = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  border-width: 1px;
  border-color: #2d2d42;
  border-radius: 8px;
  margin: 0 6px;
  background-color: #1a1a2e;
`;

const LabelText = styled.Text`
  color: #ffffff;
  text-align: center;
`;

const SearchButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) => (props.disabled ? '#083c44' : '#038082')};
  padding: 14px;
  border-radius: 8px;
  align-items: center;
`;

const SearchButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
`;

const CalendarWrapper = styled.View`
  background-color: #041224;
  border-radius: 10px;
  padding: 10px;
  elevation: 5;
`;

const TableWrapper = styled.View`
  border-width: 1px;
  border-color: #2d2d42;
  border-radius: 8px;
  overflow: hidden;
`;

const RowHeader = styled.View`
  flex-direction: row;
  padding-vertical: 12px;
  padding-horizontal: 8px;
  background-color: #0d1b2a;
`;

const Row = styled.View<{ background?: string }>`
  flex-direction: row;
  padding-vertical: 12px;
  padding-horizontal: 8px;
  background-color: ${(props) => props.background || '#1a1a2e'};
`;

const RowFooter = styled(Row)`
  background-color: #041224;
  border-top-width: 2px;
  border-top-color: #2d2d42;
`;

const CellHeader = styled.Text`
  flex: 1;
  color: #ffffff;
  text-align: center;
  font-weight: bold;
`;

const Cell = styled.Text`
  flex: 1;
  color: #ffffff;
  text-align: center;
  font-size: 14px;
`;

const RowDivider = styled.View`
  height: 1px;
  background-color: #2d2d42;
`;

const LoadingText = styled.Text`
  color: #ffffff;
  text-align: center;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  color: #ffffff;
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
`;
