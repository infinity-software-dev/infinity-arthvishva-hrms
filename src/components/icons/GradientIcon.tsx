import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { colors } from "@/constants/theme";

interface GradientIconProps {
  IconComponent: any;
  name: string;
  size: number;
}

const GradientIcon: React.FC<GradientIconProps> = ({
  IconComponent,
  name,
  size,
}) => {
  return (
    <MaskedView
      style={{ height: size, width: size }}
      maskElement={<IconComponent name={name} size={size} color="white" />}
    >
      <LinearGradient
        colors={[colors.BRAND_SECONDARY, colors.BRAND_SECONDARY_Dark]} // Using your brand colors
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      />
    </MaskedView>
  );
};

export default GradientIcon;
