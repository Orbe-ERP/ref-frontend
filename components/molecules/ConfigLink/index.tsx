import React from "react";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Text } from "@/components/atoms/Text"
import Button from "@/components/atoms/Button";

type Props = {
  href: any;
  label: string;
};

export function ConfigLink({ href, label }: Props) {
  return (
    <Link href={href} asChild>
      <Button label={label} onPress={() => {}}>
        <Icon name="chevron-right" size={20} color="#038082" />
      </Button>
    </Link>
  );
}
