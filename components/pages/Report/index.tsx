import React, { useState, useEffect } from 'react';
import { ScrollView, Modal, Button, } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getReportData, ReportData } from '@/services/report';
import useRestaurant from '@/hooks/useRestaurant';
import dayjs from 'dayjs';
import { Stack } from 'expo-router';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import * as S from './styles';

export default function ReportScreen() {
  const { selectedRestaurant } = useRestaurant();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showCalendarFor, setShowCalendarFor] = useState<'start' | 'end' | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const {theme} = useAppTheme();

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
            title: "Relatório",
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text.primary,
            }}
        />

        <S.Container>
            <ScrollView>
                <S.FilterContainer>
                    <S.DateRow>
                        <S.DateInput onPress={() => setShowCalendarFor('start')}>
                            <S.LabelText>
                                De: {startDate ? dayjs(startDate).format('DD/MM/YYYY') : '--/--/----'}
                            </S.LabelText>
                        </S.DateInput>

                        <S.DateInput onPress={() => setShowCalendarFor('end')}>
                            <S.LabelText>
                                Até: {endDate ? dayjs(endDate).format('DD/MM/YYYY') : '--/--/----'}
                            </S.LabelText>
                        </S.DateInput>
                    </S.DateRow>

                    <S.SearchButton onPress={handleSearch} disabled={loading}>
                        <S.SearchButtonText>{loading ? 'Carregando...' : 'Buscar'}</S.SearchButtonText>
                    </S.SearchButton>
                </S.FilterContainer>

                <Modal visible={!!showCalendarFor} transparent>
                    <S.ModalContainer>
                        <S.CalendarWrapper>
                            <Calendar
                                onDayPress={handleDateSelect}
                                theme={{
                                backgroundColor: '#0A1A2F',
                                calendarBackground: '#0A1A2F',
                                textSectionTitleColor: '#ffffff',
                                dayTextColor: '#ffffff',
                                todayTextColor: '#E9C46A',
                                selectedDayBackgroundColor: '#2BAE66',
                                selectedDayTextColor: '#ffffff',
                                monthTextColor: '#ffffff',
                                arrowColor: '#ffffff',
                                }}
                            />
                            <Button title="Fechar" onPress={() => setShowCalendarFor(null)} />
                        </S.CalendarWrapper>
                    </S.ModalContainer>
                </Modal>

                {loading ? (
                <S.LoadingText>Carregando dados...</S.LoadingText>
                ) : reportData.length > 0 ? (
                    <S.TableWrapper>
                        <S.RowHeader>
                            <S.CellHeader>Data</S.CellHeader>
                            <S.CellHeader>Total</S.CellHeader>
                        <S.CellHeader>Gorjeta</S.CellHeader>
                            <S.CellHeader>Taxa do Cartão</S.CellHeader>
                            <S.CellHeader>Pagamento</S.CellHeader>
                        </S.RowHeader>

                        {reportData.map((order, index) => (
                            <React.Fragment key={index}>
                                <S.Row background={index % 2 === 0 ? '#1a1a2e' : '#252545'}>
                                    <S.Cell>{dayjs(order.createdAt).format('DD/MM HH:mm')}</S.Cell>
                                    <S.Cell>R$ {order.totalValue.toFixed(2)}</S.Cell>
                                    <S.Cell>R$ {order.additional.toFixed(2)}</S.Cell>
                                    <S.Cell>R$ {order.feePaidValue.toFixed(2)}</S.Cell>
                                    <S.Cell>{order.paymentMethod}</S.Cell>
                                </S.Row>
                                <S.RowDivider />
                            </React.Fragment>
                        ))}


                        <S.RowFooter>
                            <S.Cell style={{ flex: 0.8, textAlign: 'left', paddingLeft: 12 }}>Gorjetas:</S.Cell>
                            <S.Cell>
                                R${' '}
                                {reportData
                                .reduce((sum, order) => sum + order.additional, 0)
                                .toFixed(2)}
                            </S.Cell>
                        </S.RowFooter>

                        <S.RowFooter>
                            <S.Cell style={{ flex: 0.8, textAlign: 'left', paddingLeft: 12 }}>Total Geral:</S.Cell>
                            <S.Cell>
                                R${' '}
                                {reportData
                                .reduce((sum, order) => sum + order.totalValue, 0)
                                .toFixed(2)}
                            </S.Cell>
                        </S.RowFooter>
                    </S.TableWrapper>
                ) : (
                    <S.EmptyText>Nenhum dado encontrado</S.EmptyText>
                )}
            </ScrollView>
        </S.Container>
    </>
  );
}
