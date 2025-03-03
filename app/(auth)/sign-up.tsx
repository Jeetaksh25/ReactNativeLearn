import { StyleSheet, Text, View, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import { images } from "../../constants";
import FormField from "../../comps/FormField";
import CustomButton from "../../comps/CustomButton";
import { Link, useRouter } from "expo-router";
import { createUser } from "../../lib/appwrite";
import AlertBox from "../../comps/AlertBox";
import {theme} from "../../theme/theme"

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success" | "muted" | "warning" | "info"; message: string } | null>(null);


  const router = useRouter();

  const showAlert = (type: "error" | "success" | "muted" | "warning" | "info", message: string) => {
    setAlert({ type, message });
  
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };
  

  const submitHandler = async () => {
    if (!form.username || !form.email || !form.password) {
      showAlert("error", "Please fill in all the fields");
      return;
    }

    setIsSigningUp(true);

    try {
      const result = await createUser(form.email, form.password, form.username);

      if (!result) {
        throw new Error("Account not created");
      }

      showAlert("success", "Account created successfully");

      setTimeout(()=>{
        router.push("/home");
      },2000)

    } catch (error: any) {
      const errorMessage = error.message.split(": ")[1];
      showAlert("error", errorMessage);
      
    } finally {
      setIsSigningUp(false);
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
            <Text style={[styles.text, { alignSelf: "center", textAlign: "center" }]}>
              Sign Up with Aora
            </Text>
          </View>

          <View style={styles.form}>
            <FormField
              title="Username"
              placeholder="Enter your username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles={{ marginTop: 7, color: "white" }}
            />

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
              title="Sign Up"
              loadingText="Signing up..."
              containerStyles={{ marginTop: 30 }}
              isLoading={isSigningUp}
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
            Have an account already?
            <Link href={"/sign-in"} style={[styles.text2, { color: colors.orange[500] }]}>
              {" "}
              Sign In
            </Link>
          </Text>
        </View>
        {alert && <AlertBox actionText={alert.type} desc={alert.message} />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

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
    paddingHorizontal: theme.padding.lg,
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
