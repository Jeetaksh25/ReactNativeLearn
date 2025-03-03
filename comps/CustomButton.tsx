import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  TextStyle,
} from "react-native";
import React, {FC} from "react";
import colors from "tailwindcss/colors";
import { GestureDetectorBridge } from "react-native-screens";
import { ViewStyle } from "@expo/html-elements/build/primitives/View";
import { theme } from "../theme/theme";

interface CutomButtonProps {
  title: string;
  icon?: React.ReactNode;
  handlePress?: (event: GestureResponderEvent) => void;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  isLoading?: boolean;
  loadingText?: string;
}

const CustomButton: FC<CutomButtonProps> = ({
  title,
  icon,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  loadingText,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: theme.padding.md,
          borderRadius: theme.borderRadius.md,
          backgroundColor: colors.orange[500],
        },
        containerStyles,
      ]}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <ActivityIndicator size="small" color="white" animating={true} />
          <Text style={[{color: "white", marginLeft: 8, fontFamily: "Poppins-Regular",fontWeight: "bold"},textStyles]}>{loadingText}</Text>
        </>
      ) : (
        <>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text
            style={[
              { color: "white", fontSize: theme.fontSize.md, fontWeight: "bold" },
              textStyles,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
