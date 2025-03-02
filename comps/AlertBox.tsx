import { View, Text } from "react-native";
import React from "react";
import colors from "tailwindcss/colors";
import AntDesign from "react-native-vector-icons/AntDesign";

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
        padding: 10,
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
        gap: 5,
        borderRadius: 8,
        position: "absolute",
        bottom: 0,
        maxWidth: "95%",
        height: "auto",
      }}
    >
      <AntDesign name={iconMap[actionText]} size={25} color="white" />
      <Text style={{ color: "white", fontSize: 18 }}>{desc}</Text>
    </View>
  );
};

export default AlertBox;
