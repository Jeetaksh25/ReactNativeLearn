import { View, StyleSheet, ScrollView, Image, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, ButtonText } from "@/components/ui/button";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useRouter, Link, Redirect} from "expo-router";
import colors, { white } from "tailwindcss/colors";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "@/comps/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";

export default function Layout() {
  const {isLoading, isLoggedIn} = useGlobalContext();

  if(!isLoading && isLoggedIn) {
    return <Redirect href="/home"/>
  }

  const router = useRouter();
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <GluestackUIProvider mode={colorMode}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.gray[900] }]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            <Image source={images.logo} style={styles.logo} />
            <Image source={images.cards} style={styles.cards} />

            <View style={styles.headingContainer}>
              <Text style={styles.heading}>
                Discover Endless Possibilities with <Text style={styles.highlightedText}>Aora</Text>
              </Text>
              <Image source={images.path} style={styles.path} />
            </View>

            <Text style={styles.subheading}>
              Where creativity meets innovation. Embark on a journey of limitless exploration with Aora.
            </Text>

            <CustomButton
              title="Continue with Email"
              icon={<AntDesign name="arrowright" size={20} color="white" />}
              handlePress={() => router.push("/sign-in")}
              containerStyles={styles.buttonContainer}
              textStyles={styles.buttonText}
              loadingText="Loading..."
            />
          </View>
        </ScrollView>

        <StatusBar backgroundColor="#161622" style="light"/>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.gray[900],
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center", 
    alignItems: "center",
  },
  innerContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  logo: {
    width: 130,
    height: 84,
    resizeMode: "contain",
    position: "absolute",
    top: 60,
  },
  cards: {
    maxWidth: 380,
    width: "100%",
    height: 300,
    resizeMode: "contain",
    position: "absolute",
    top: 150,
  },
  headingContainer: {
    position: "relative",
    marginTop: 140,
    textAlign: "center",
  },
  heading: {
    fontSize: 30,
    fontFamily: "Poppins-Bold",
    color: "white",
    textAlign: "center",
    marginTop: 150,
  },
  highlightedText: {
    color: colors.orange[400],
  },
  path: {
    width: 100,
    height: 20,
    position: "absolute",
    bottom: -20,
    right: -10,
    marginVertical: 10,
  },
  subheading: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    marginTop: 30,
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: colors.orange[500],
    paddingHorizontal: 40,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
