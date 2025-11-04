import React, { useRef, useState } from "react";
import { FlatList, Dimensions, StatusBar } from "react-native";
import { Stack, useRouter } from "expo-router";
import {
  Container,
  SlideContainer,
  ImageContainer,
  SlideImage,
  ContentPlaceholder,
  FooterContainer,
  TextContainer,
  SlideSubtitle,
  IndicatorContainer,
  Indicator,
  ButtonContainer,
  ButtonRow,
  PrimaryButton,
  SecondaryButton,
  ButtonText,
  Spacer,
  COLORS
} from "./style";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("assets/images/SelectedRestaurant/selecionar-restaurante.png"),
    subtitle: "",
  },
  {
    id: "2",
    image: require("assets/images/index.png"),
    subtitle: "Na tela inicial, clique no botão 'Selecionar Restaurante'.",
  },
  {
    id: "3",
    image: require("assets/images/SelectedRestaurant/selecionar-restaurante1.png"),
    subtitle: "Clique em Criar Restaurante.",
  },
  {
    id: "4",
    image: require("assets/images/SelectedRestaurant/selecionar-restaurante2.png"),
    subtitle: "Insira os dados do seu estabelecimento.",
  },
  {
    id: "5",
    image: require("assets/images/SelectedRestaurant/selecionar-restaurante3.png"),
    subtitle: "Com os dados inseridos, a tela exibirá o card do estabelecimento. Clique nele para selecioná-lo.",
  },
];

const SelectedRestaurantOnboardingScreen = () => {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef<FlatList>(null);

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < slides.length) {
      const offset = nextSlideIndex * width;
      ref.current?.scrollToOffset({ offset });
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  const goToPreviousSlide = () => {
    const prevSlideIndex = currentSlideIndex - 1;
    if (prevSlideIndex >= 0) {
      const offset = prevSlideIndex * width;
      ref.current?.scrollToOffset({ offset });
      setCurrentSlideIndex(prevSlideIndex);
    }
  }

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref.current?.scrollToOffset({ offset });
    setCurrentSlideIndex(lastSlideIndex);
  };

  const handleGetStarted = () => {
    router.replace("/(private)/select-restaurant");
  };

  const Footer = () => (
    <FooterContainer>
      <TextContainer>
        <SlideSubtitle>{slides[currentSlideIndex].subtitle}</SlideSubtitle>
      </TextContainer>

      <IndicatorContainer>
        {slides.map((_, index) => (
          <Indicator
            key={index}
            active={currentSlideIndex === index}
          />
        ))}
      </IndicatorContainer>

      <ButtonContainer>
        {currentSlideIndex === slides.length - 1 ? (
          <PrimaryButton onPress={handleGetStarted}>
            <ButtonText escuro>COMEÇAR</ButtonText>
          </PrimaryButton>
        ) : (
          <ButtonRow>
            <SecondaryButton onPress={skip}>
              <ButtonText>PULAR</ButtonText>
            </SecondaryButton>
            <Spacer />
            {currentSlideIndex > 0 && (
              <>
                <SecondaryButton onPress={goToPreviousSlide}>
                  <ButtonText>VOLTAR</ButtonText>
                </SecondaryButton>
                <Spacer />
              </>
            )}
            <PrimaryButton onPress={goToNextSlide}>
              <ButtonText escuro>PRÓXIMO</ButtonText>
            </PrimaryButton>
          </ButtonRow>
        )}
      </ButtonContainer>
    </FooterContainer>
  );

  return (
    <Container>
        <Stack.Screen
          options={{
            title: "Ajuda - Selecionar Restaurante",
            headerStyle: { backgroundColor: "#041224" },
            headerTintColor: "#fff",
          }}
        />
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <FlatList
        ref={ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEnabled={false}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SlideContainer>
            <ImageContainer>
              <SlideImage source={item.image} resizeMode="cover" />
            </ImageContainer>
            
            <ContentPlaceholder />
          </SlideContainer>
        )}
      />      
      <Footer />
    </Container>
  );
};

export default SelectedRestaurantOnboardingScreen;
