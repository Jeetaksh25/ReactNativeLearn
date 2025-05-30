import { StyleSheet, Text, View } from "react-native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import React, { useEffect } from "react";
import { Slot,SplashScreen,Stack } from "expo-router";
import {useFonts} from 'expo-font';
import  GlobalProvider  from "../context/GlobalProvider";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

  const [fontsLoaded,error] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    if(error){
      throw error;
    }

    if(fontsLoaded){
      SplashScreen.hideAsync();
    }
  },[fontsLoaded,error]);

  if(!fontsLoaded && !error){
    return null;
  }  

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false,statusBarBackgroundColor: "#161622" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false,statusBarBackgroundColor: "#161622" }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false,statusBarBackgroundColor: "#161622" }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false,statusBarBackgroundColor: "#161622" }} />
        <Stack.Screen name="profile/[id]" options={{ headerShown: false,statusBarBackgroundColor: "#161622" }} />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
