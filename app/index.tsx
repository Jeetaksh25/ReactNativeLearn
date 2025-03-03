import { View, StyleSheet, ScrollView, Image, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, Redirect } from "expo-router";
import colors from "tailwindcss/colors";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "@/comps/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";
import AntDesign from "react-native-vector-icons/AntDesign";
import { theme } from "../theme/theme";

export default function Layout() {
  const { isLoading, isLoggedIn } = useGlobalContext();
  const router = useRouter();
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <GluestackUIProvider mode={colorMode}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            {/* Logo */}
            <Image source={images.logo} style={styles.logo} />

            {/* Cards */}
            <Image source={images.cards} style={styles.cards} />

            {/* Heading Section */}
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>
                Discover Endless Possibilities with <Text style={styles.highlightedText}>Aora</Text>
              </Text>
            </View>

            {/* Subheading */}
            <Text style={styles.subheading}>
              Where creativity meets innovation. Embark on a journey of limitless exploration with Aora.
            </Text>

            {/* Button */}
            <CustomButton
              title="Continue with Email"
              icon={<AntDesign name="arrowright" size={theme.fontSize.xl} color="white" />}
              handlePress={() => router.push("/sign-in")}
              containerStyles={styles.buttonContainer}
              loadingText="Loading..."
            />
          </View>
        </ScrollView>

        <StatusBar backgroundColor={colors.gray[900]} style="light" />
      </SafeAreaView>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[900],
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.padding.lg,
  },
  innerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,

  },
  logo: {
    width: 130,
    height: 84,
    resizeMode: "contain",
    marginTop: 20,
    alignSelf: "center",
  },
  cards: {
    width: "90%",
    maxWidth: 380,
    height: 260,
    resizeMode: "contain",
    marginTop: 20,
  },
  headingContainer: {
    marginTop: 20,
    alignItems: "center",
    textAlign: "center",
  },
  heading: {
    fontSize: theme.fontSize["2xl"],
    fontFamily: "Poppins-Bold",
    color: "white",
    textAlign: "center",
  },
  highlightedText: {
    color: colors.orange[400],
  },
  path: {
    width: 80,
    height: 15,
    resizeMode: "contain",
    marginTop: 5,
  },
  subheading: {
    fontSize: theme.fontSize.lg,
    color: "white",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: colors.orange[500],
    width: "100%",
    borderRadius: theme.borderRadius.md,
  },
});
