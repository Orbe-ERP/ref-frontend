import React from "react";
import { View } from "react-native";

import { Text } from "@/components/atoms/Text";

type Props = {
  icon: string;
  title: string;
};

export const SectionHeader: React.FC<Props> = ({ icon, title }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
      <Text size={18} weight="600" color="#fff">
        {title}
      </Text>
    </View>
  );
};
