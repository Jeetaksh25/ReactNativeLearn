import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StyleProp,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from "react-native";
import React, { useState } from "react";
import colors from "tailwindcss/colors";
import Entypo from "react-native-vector-icons/Entypo";
import { theme } from "@/theme/theme";

interface CustomFormFieldProps {
    title: string;
    value: string;
    placeholder?: string;
    handleChangeText: (e: string) => void;
    otherStyles?: StyleProp<any>;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
}


const FormField: React.FC<CustomFormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  secureTextEntry,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.input}>
        <TextInput
          style={{ flex: 1, color: "white",fontSize: theme.fontSize.md, fontFamily: "Poppins-Regular",alignItems: "center",alignSelf: "center"}}
          placeholder={placeholder}
          value={value}
          onChangeText={handleChangeText}
          {...props}
          secureTextEntry={title === "Password" && !showPassword}
          textAlign="left"
          keyboardType={keyboardType || "default"}

        />

        {title === "Password" && (
          <Text
            style={{ color: "white" }}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <Entypo name="eye" size={theme.fontSize.xl} color="white"/> : <Entypo name="eye-with-line" size={theme.fontSize.xl} color="white" />}
          </Text>
        )}
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: "bold",
    fontFamily: "Poppins-Medium",
    color: "white",
  },
  input: {
    height: 50,
    paddingHorizontal: theme.padding.md,
    backgroundColor: colors.gray[800],
    marginVertical: 5,
    color: "white",
    borderRadius: theme.borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
