import { View, Text } from "react-native";
import React from "react";
import colors, { black } from "tailwindcss/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import { theme } from "../theme/theme";

interface AlertProps {
  actionText?: "muted" | "error" | "warning" | "success" | "info";
  desc?: string;
}

const AlertBox: React.FC<AlertProps> = ({ actionText = "info", desc }) => {

  if(!desc) return null;

  const iconMap: Record<string, string> = {
    success: "checkcircle",
    error: "closecircle",
    warning: "warning",
    info: "infocirlce",
    muted: "minuscircle",
  };

  return (
    <View
      style={{
        padding: theme.padding.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          actionText === "success"
            ? colors.green[500]
            : actionText === "error"
            ? colors.red[500]
            : actionText === "warning"
            ? colors.yellow[500]
            : actionText === "info"
            ? colors.blue[500]
            : colors.gray[500],
        flexDirection: "row",
        gap: theme.gap.sm,
        borderRadius: theme.borderRadius.md,
        position: "absolute",
        bottom: 30,
        maxWidth: "90%",
      }}
    >
      <AntDesign name={iconMap[actionText]} size={theme.fontSize.lg} color="white" style={{paddingLeft:theme.padding.sm}} />
      <Text style={{ color: "white", fontSize: theme.fontSize.sm,padding:0,margin:0}}>{desc}</Text>
    </View>
  );
};

export default AlertBox;
