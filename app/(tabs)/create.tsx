import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { black, gray } from "tailwindcss/colors";
import { theme } from "@/theme/theme";
import FormField from "@/comps/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons, images } from "@/constants";
import colors from "tailwindcss/colors";
import CustomButton from "@/comps/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import AlertBox from "@/comps/AlertBox";

const Create = () => {
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    video: "",
    thumbnail: "",
    prompt: "",
  });

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

  const openPicker = async (selectType: "image" | "video") => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg", "image/jpeg"]
          : ["video/mp4", "video/gif"],
    });

    if(!result.canceled){
      if(selectType === "image"){
        setForm({...form, thumbnail: result.assets[0].uri});
      }

      if(selectType === "video"){
        setForm({...form, video: result.assets[0].uri});
      }
    }
  };

  const submit = async () => {
    if(!form.title || !form.video || !form.thumbnail || !form.prompt){
      showAlert("error", "Please fill in all the fields");
      return;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: gray[900],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: theme.padding.lg,
          gap: theme.gap.md,
          paddingVertical: theme.padding.xl,
        }}
        style={{ width: "100%" }}
      >
        <Text
          style={{
            color: "white",
            fontSize: theme.fontSize["2xl"],
            fontWeight: "bold",
          }}
        >
          Upload Video
        </Text>

        <View
          style={{
            width: "100%",
            maxWidth: 400,
            gap: theme.gap.lg,
            marginBottom: 20,
          }}
        >
          <FormField
            title="Video Title"
            value={form.title}
            handleChangeText={(e) => setForm({ ...form, title: e })}
            placeholder="Video Title"
          />
          <Text
            style={{
              color: "white",
              fontSize: theme.fontSize.md,
              fontWeight: "bold",
            }}
          >
            Upload Video
          </Text>
          <View>
            <TouchableOpacity onPress={() => openPicker("video")}>
              {form.video ? (
                <Video
                  source={{ uri: form.video }}
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: theme.borderRadius.xl,
                  }}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping
                />
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "white",
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: theme.borderRadius.md,
                    minHeight: 200,
                    width: "100%",
                    backgroundColor: gray[800],
                  }}
                >
                  <View
                    style={{
                      borderStyle: "dashed",
                      borderColor: colors.orange[500],
                      borderWidth: 2,
                      padding: 10,
                    }}
                  >
                    <Image
                      source={icons.upload}
                      style={{ width: 30, height: 30, resizeMode: "contain" }}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: "white",
              fontSize: theme.fontSize.md,
              fontWeight: "bold",
            }}
          >
            Upload Thumbnail
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail }}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: theme.borderRadius.xl,
                  resizeMode: "cover",
                }}
              />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "white",
                  borderWidth: 1,
                  padding: 20,
                  borderRadius: theme.borderRadius.md,
                  minHeight: 50,
                  width: "100%",
                  backgroundColor: gray[800],
                  gap: 10,
                }}
              >
                <Image
                  source={icons.upload}
                  style={{ width: 30, height: 30, resizeMode: "contain" }}
                />
                <Text style={{ color: "white", fontSize: theme.fontSize.md }}>
                  Choose A file
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <FormField
            title="AI Prompt"
            value={form.prompt}
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
            placeholder="Prompt Used"
          />
                  <CustomButton
          title="Submit & Publish"
          isLoading={uploading}
          handlePress={submit}
        />
        </View>


        {alert && <AlertBox actionText={alert.type} desc={alert.message}/> }
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
