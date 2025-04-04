import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import { images } from "../../constants";
import FormField from "../../comps/FormField";
import CustomButton from "../../comps/CustomButton";
import { Link } from "expo-router";
import AlertBox from "../../comps/AlertBox";
import { signIn } from "../../lib/appwrite";
import { router } from "expo-router";
import { theme } from "../../theme/theme";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const {setUser,isLoggedIn, setIsLoggedIn} = useGlobalContext();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

  const submitHandler = async () => {
    if (!form.email || !form.password) {
      return;
    }
    try {
      if(isLoggedIn){
        router.replace("/home");
      }

      setIsLoggingIn(true);
      const result = await signIn(form.email, form.password);

      if (!result) {
        showAlert("error", "Account not found");
        throw new Error("Account not found");
      }
      
      setUser(result);
      setIsLoggedIn(true);

      showAlert("success", "Logged in successfully");

      setTimeout(()=>{
        router.replace("/home");
      },2000)

    } catch (error: any) {
      const errorMessage = error.message.split(": ")[1]; 
      showAlert("error", errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Image
              source={images.logo}
              style={{
                width: 115,
                height: 35,
                resizeMode: "contain",
                alignSelf: "center",
                justifyContent: "center",
              }}
            />
            <Text
              style={[
                styles.text,
                { alignSelf: "center", textAlign: "center" },
              ]}
            >
              Log in to Aora
            </Text>
          </View>

          <View style={styles.form}>
            <FormField
              title="Email"
              placeholder="Enter your email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles={{ marginTop: 7, color: "white" }}
              keyboardType="default"
            />

            <FormField
              title="Password"
              placeholder="Enter your password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles={{ marginTop: 7, color: "white" }}
              keyboardType="default"
              secureTextEntry={true}
            />

            <CustomButton
              title="Sign In"
              loadingText="Logging in..."
              containerStyles={{ marginTop: 30 }}
              isLoading={isLoggingIn}
              handlePress={submitHandler}
              textStyles={{
                color: "white",
                fontSize: theme.fontSize.md,
                fontFamily: "Poppins-Regular",
                alignItems: "center",
                alignSelf: "center",
              }}
            />
          </View>
          <Text style={styles.text2}>
            Don't have an account?
            <Link
              href={"/sign-up"}
              style={[styles.text2, { color: colors.orange[500] }]}
            >
              {" "}
              Sign Up
            </Link>
          </Text>
        </View>

        {alert && <AlertBox actionText={alert.type} desc={alert.message} />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[900],
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    width: "100%",
    paddingHorizontal: theme.fontSize.lg,
    gap: theme.gap.lg,
    height: "100%",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
  },
  form: {
    gap: theme.gap.md,
    justifyContent: "center",
  },
  header: {
    gap: theme.gap.xl,
    justifyContent: "center",
    marginBottom: theme.gap.xl,
  },
  text2: {
    color: "white",
    fontSize: theme.fontSize.sm,
    textAlign: "center",
  },
});