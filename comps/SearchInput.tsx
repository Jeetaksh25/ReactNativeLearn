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
    TouchableOpacity
  } from "react-native";

  import React, { useState } from "react";
  import colors from "tailwindcss/colors";
  import Entypo from "react-native-vector-icons/Entypo";
  import { theme } from "@/theme/theme";
  import {icons} from '../constants'
  
  interface CustomSearchInputProps {
      title: string;
      value: string;
      placeholder?: string;
      handleChangeText: (e: string) => void;
      otherStyles?: StyleProp<any>;
      keyboardType?: KeyboardTypeOptions;
      secureTextEntry?: boolean;
  }
  
  
  const SearchInput: React.FC<CustomSearchInputProps> = ({
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
        <View style={styles.input}>
          <TextInput
            style={{ flex: 1, color: "white",fontSize: theme.fontSize.md, fontFamily: "Poppins-Regular",alignItems: "center",alignSelf: "center"}}
            placeholder={"Search for a video topic"}
            value={value}
            onChangeText={handleChangeText}
            {...props}
            secureTextEntry={title === "Password" && !showPassword}
            textAlign="left"
            keyboardType={keyboardType || "default"}
  
          />
        <TouchableOpacity>
            <Image source={icons.search} className="w-h h-5"
            resizeMode="contain"/>
        </TouchableOpacity>
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
  