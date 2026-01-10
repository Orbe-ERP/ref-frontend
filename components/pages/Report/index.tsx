import React, { useState, useEffect } from 'react';
import { ScrollView, Modal, Button, } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getReportData, PaymentMethod, ReportData } from '@/services/report';
import useRestaurant from '@/hooks/useRestaurant';
import dayjs from 'dayjs';
import { Stack } from 'expo-router';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import * as S from './styles';
import { useResponsive } from '@/hooks/useResponsive';

export default function ReportScreen() {
  const { selectedRestaurant } = useRestaurant();
  const [startDate, setStartDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));
  const [showCalendarFor, setShowCalendarFor] = useState<'start' | 'end' | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const {theme} = useAppTheme();
  const { isTablet, isDesktop } = useResponsive();
  const isWide = isTablet || isDesktop;
  const paymentMethodLabel: Record<PaymentMethod, string> = {
    CREDIT_CARD: 'Cartão de Crédito',
    DEBIT_CARD: 'Cartão de Débito',
    CASH: 'Dinheiro',
    PIX: 'PIX',
    OTHER: 'Outro',
  };

  useEffect(() => {
    if (selectedRestaurant?.id) {
      fetchData();
    }
  }, [selectedRestaurant]);

  async function fetchData(initial = startDate, final = endDate) {
    try {
      setLoading(true);
      const data = await getReportData({
        restaurantId: selectedRestaurant.id,
        initialDate: initial,
        finalDate: final,
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
    fetchData(startDate, endDate);
  };

  function formatPaymentMethod(method: PaymentMethod) {
    return paymentMethodLabel[method];
  }

  return (
    <>
        <Stack.Screen
          options={{
            title: "Relatórios",
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text.primary,
          }}
        />

        <S.Container>
            <ScrollView>
              {isWide ? (
                <S.FilterContainerWide>
                  <S.DateRowWide>
                    <S.DateInput onPress={() => setShowCalendarFor("start")}>
                      <S.LabelText>
                        De: {dayjs(startDate).format("DD/MM/YYYY")}
                      </S.LabelText>
                    </S.DateInput>

                    <S.DateInput onPress={() => setShowCalendarFor("end")}>
                      <S.LabelText>
                        Até: {dayjs(endDate).format("DD/MM/YYYY")}
                      </S.LabelText>
                    </S.DateInput>

                    <S.SearchButtonWide onPress={handleSearch} disabled={loading}>
                      <S.SearchButtonText>
                        {"Buscar"}
                      </S.SearchButtonText>
                    </S.SearchButtonWide>
                  </S.DateRowWide>
                </S.FilterContainerWide>
              ) : (
                <S.FilterContainerMobile>
                  <S.DateRowMobile>
                    <S.DateInputMobile onPress={() => setShowCalendarFor("start")}>
                      <S.LabelText>
                        De: {dayjs(startDate).format("DD/MM/YYYY")}
                      </S.LabelText>
                    </S.DateInputMobile>

                    <S.DateInputMobile onPress={() => setShowCalendarFor("end")}>
                      <S.LabelText>
                        Até: {dayjs(endDate).format("DD/MM/YYYY")}
                      </S.LabelText>
                    </S.DateInputMobile>
                  </S.DateRowMobile>

                  <S.SearchButtonMobile onPress={handleSearch} disabled={loading}>
                    <S.SearchButtonText>
                      {"Buscar"}
                    </S.SearchButtonText>
                  </S.SearchButtonMobile>
                </S.FilterContainerMobile>
              )}

              <Modal visible={!!showCalendarFor} transparent animationType="fade">
                <S.ModalContainer>
                  <S.CalendarWrapper>
                    <Calendar
                      onDayPress={handleDateSelect}
                      markedDates={{
                        [startDate]: { selected: true },
                        [endDate]: { selected: true },
                      }}
                      theme={{
                        backgroundColor: theme.colors.background,
                        calendarBackground: theme.colors.background,
                        dayTextColor: theme.colors.text.primary,
                        monthTextColor: theme.colors.text.primary,
                        arrowColor: theme.colors.primary,
                      }}
                    />
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
                                    <S.Cell>{formatPaymentMethod(order.paymentMethod)}</S.Cell>
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
