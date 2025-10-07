import React, { useRef, useState } from "react";
import { FlatList, Dimensions, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#041224",
  white: "#fff",
  gray: "#888",
};

const slides = [
  {
    id: "1",
    image: require("@/assets/images/Frame 5.png"),
    // title: "Crie seu restaurante",
    subtitle: "",
  },
  {
    id: "2",
    image: require("@/assets/images/Frame 6.png"),
    subtitle: "Na tela inicial, clique no botão Selecionar Restaurante.",
  },
  {
    id: "3",
    image: require("@/assets/images/Frame 7.png"),
    subtitle: "Clique em Criar Restaurante.",
  },
  {
    id: "4",
    image: require("@/assets/images/Frame 8.png"),
    subtitle: "Insira os dados do seu estabelecimento.",
  },
  {
    id: "5",
    image: require("@/assets/images/Frame 9.png"),
    subtitle: "Aparecerá assim e clique no card para selecionar o estabelecimento criado.",
  },
  {
    id: "6",
    image: require("@/assets/images/Frame 10.png"),
    subtitle: "",
  },
  {
    id: "7",
    image: require("@/assets/images/Frame 11.png"),
    subtitle: "Na tela inicial, clique no ícone de engrenagem para acessar Configurações.",
  },
  {
    id: "8",
    image: require("@/assets/images/Frame 12.png"),
    subtitle: "Na tela de configurações clique em Gerenciar Cozinhas.",
  },
  {
    id: "9",
    image: require("@/assets/images/Frame 13.png"),
    subtitle: "Clique para criar uma nova cozinha.",
  },
  {
    id: "10",
    image: require("@/assets/images/Frame 14.png"),
    subtitle: "Digite o nome, selecione a cor e clique em Criar Cozinha.",
  },
  {
    id: "11",
    image: require("@/assets/images/Frame 14.png"),
    subtitle: "Desative o botão Mostrar Cozinha para exibir os produtos apenas na comanda.",
  },
  {
    id: "12",
    image: require("@/assets/images/Frame 16.png"),
    subtitle: "",
  },
  {
    id: "13",
    image: require("@/assets/images/Frame 12.png"),
    subtitle: "Na tela de configurações clique em Gerenciar Categorias e Produtos.",
  },
  {
    id: "14",
    image: require("@/assets/images/Frame 18.png"),
    subtitle: "Clique em Criar Categoria, digite o nome e clique em Criar Categoria.",
  },
  {
    id: "15",
    image: require("@/assets/images/Frame 19.png"),
    subtitle: "Dentro da categoria, clique em produto, digite o nome e clique em Criar.",
  },
  {
    id: "16",
    image: require("@/assets/images/Frame 20.png"),
    subtitle: "Dentro de produtos, digite o nome e clique em + para adicionar observações.",
  },
  {
    id: "17",
    image: require("@/assets/images/Frame 21.png"),
    subtitle: "",
  },
  {
    id: "18",
    image: require("@/assets/images/Frame 12.png"),
    subtitle: "Na tela de configurações clique em Taxas.",
  },
  {
    id: "19",
    image: require("@/assets/images/Frame 23.png"),
    subtitle: "Aqui você adiciona as taxas dos seus cartões de crédito e débito.",
  },
  {
    id: "20",
    image: require("@/assets/images/Frame 24.png"),
    subtitle: "",
  },
  {
    id: "21",
    image: require("@/assets/images/Frame 12.png"),
    subtitle: "Na tela de configurações clique em Criar Usuários.",
  },
  {
    id: "22",
    image: require("@/assets/images/Frame 26.png"),
    subtitle: "Aqui você cria quantos usuários quiser.",
  },
  {
    id: "23",
    image: require("@/assets/images/Frame 12.png"),
    subtitle: "Na tela de configurações clique em Listar Usuários para ver os usuários cadastrados.",
  },
];

const OnboardingScreen = () => {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef<FlatList>(null);

  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < slides.length) {
      const offset = nextSlideIndex * width;
      ref.current?.scrollToOffset({ offset });
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

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
      {/* Indicadores */}
      <IndicatorContainer>
        {slides.map((_, index) => (
          <Indicator
            key={index}
            active={currentSlideIndex === index}
          />
        ))}
      </IndicatorContainer>

      {/* Textos */}
      <TextContainer>
        {/* <SlideTitle>{slides[currentSlideIndex].title}</SlideTitle> */}
        <SlideSubtitle>{slides[currentSlideIndex].subtitle}</SlideSubtitle>
      </TextContainer>

      {/* Botões */}
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
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SlideContainer>
            {/* Área da imagem - 60% da tela */}
            <ImageContainer>
              <SlideImage source={item.image} resizeMode="cover" />
            </ImageContainer>
            
            {/* Área do conteúdo - 40% da tela (será sobreposta pelo Footer) */}
            <ContentPlaceholder />
          </SlideContainer>
        )}
      />
      
      {/* Footer fixo na parte inferior */}
      <Footer />
    </Container>
  );
};

export default OnboardingScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${COLORS.primary};
`;

const SlideContainer = styled.View`
  width: ${width}px;
  height: ${height}px;
`;

const ImageContainer = styled.View`
  height: 60%;
  width: 100%;
  margin-top: -10px;
`;

const SlideImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ContentPlaceholder = styled.View`
  height: 40%;
  background-color: ${COLORS.primary};
`;

const FooterContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background-color: ${COLORS.primary};
  justify-content: space-between;
  padding: 20px;
`;

const TextContainer = styled.View`
  align-items: center;
  margin-vertical: 20px;
`;

// const SlideTitle = styled.Text`
//   color: ${COLORS.white};
//   font-size: 24px;
//   font-weight: bold;
//   text-align: center;
//   margin-bottom: 10px;
// `;

const SlideSubtitle = styled.Text`
  color: ${COLORS.white};
  font-size: 16px;
  text-align: center;
  line-height: 22px;
  width: 85%;
`;

const IndicatorContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;
`;

const Indicator = styled.View<{ active?: boolean }>`
  height: 4px;
  width: ${(props: { active: any; }) => (props.active ? "25px" : "10px")};
  background-color: ${(props: { active: any; }) =>
    props.active ? COLORS.white : COLORS.gray};
  margin: 0 4px;
  border-radius: 2px;
`;

const ButtonContainer = styled.View`
  margin-bottom: 10px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
`;

const PrimaryButton = styled.TouchableOpacity`
  flex: 1;
  height: 50px;
  background-color: ${COLORS.white};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const SecondaryButton = styled.TouchableOpacity`
  flex: 1;
  height: 50px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${COLORS.white};
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const ButtonText = styled.Text<{ escuro?: boolean }>`
  color: ${(props: { escuro: any; }) => (props.escuro ? COLORS.primary : COLORS.white)};
  font-size: 16px;
  font-weight: bold;
`;

const Spacer = styled.View`
  width: 15px;
`;