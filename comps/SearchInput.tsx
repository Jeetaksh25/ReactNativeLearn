import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StyleProp,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";

import React, { useState } from "react";
import colors from "tailwindcss/colors";
import Entypo from "react-native-vector-icons/Entypo";
import { theme } from "@/theme/theme";
import { icons } from "../constants";
import { usePathname } from "expo-router";
import AlertBox from "./AlertBox";
import { useRouter, router, useLocalSearchParams } from "expo-router";

interface CustomSearchInputProps {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  otherStyles?: StyleProp<any>;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  initialQuery?: any;
}

const SearchInput: React.FC<CustomSearchInputProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  initialQuery,
  secureTextEntry,
  ...props
}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  const [alert, setAlert] = useState<{
    type: "error" | "success" | "muted" | "warning" | "info";
    message: string;
  } | null>(null);

  const showAlert = (
    type: "error" | "success" | "muted" | "warning" | "info",
    message: string
  ) => {
    setAlert({ type, message });

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  return (
    <View style={styles.input}>
      <TextInput
        style={{
          flex: 1,
          color: "white",
          fontSize: theme.fontSize.md,
          fontFamily: "Poppins-Regular",
          alignItems: "center",
          alignSelf: "center",
        }}
        placeholder={"Search for a video topic"}
        placeholderTextColor="#CDCDE0"
        value={query}
        onChangeText={(e) => setQuery(e)}
        {...props}
        textAlign="left"
        keyboardType={keyboardType || "default"}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return showAlert("error", "Please enter a search term");
          }

          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} className="w-h h-5" resizeMode="contain" />
      </TouchableOpacity>
      <View style={{ position: "absolute", bottom: 70, width: "100%", alignItems: "center" }}>
      {alert && (
                <AlertBox actionText={alert.type} desc={alert.message} />
              )}
      </View>
    </View>
  );
};

export default SearchInput;

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
