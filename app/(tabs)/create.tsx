import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl
} from "react-native";
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
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import * as ImagePicker from "expo-image-picker";

const Create = () => {
  const [uploading, setUploading] = useState(false);

  const { user } = useGlobalContext();

  const [form, setForm] = useState({
    title: "",
    video: {
      uri: "",
      name: "",
      type: "",
      size: 0,
    },
    thumbnail: {
      uri: "",
      name: "",
      type: "",
      size: 0,
    },
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const pickedFile = result.assets[0];

      const fileData = {
        uri: pickedFile.uri,
        name: pickedFile.fileName || "unknown", 
        type: pickedFile.mimeType || "unknown",
        size: pickedFile.fileSize || 0, 
      };

      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: fileData,
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: fileData,
        });
      }
    }
  };

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      showAlert("error", "Please fill in all the fields");
      return;
    }
    try {
      setUploading(true);

      await createVideo({
        ...form,
        userId: user.$id,
      });
      showAlert("success", "Post uploaded successfully");

      router.push("/home");
    } catch (error) {
      showAlert("error", "Something went wrong");
    } finally {
      setUploading(false);
      setForm({
        title: "",
        video: { uri: "", name: "", type: "", size: 0 },
        thumbnail: { uri: "", name: "", type: "", size: 0 },
        prompt: "",
      });
    }
  };

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
      setRefreshing(true);
      setForm({
        title: "",
        video: { uri: "", name: "", type: "", size: 0 },
        thumbnail: { uri: "", name: "", type: "", size: 0 },
        prompt: "",
      });
      setRefreshing(false);
    }

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

        refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text
          style={{
            color: "white",
            fontSize: theme.fontSize["2xl"],
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Upload Video
        </Text>

        <View
          style={{
            width: "100%",
            maxWidth: 400,
            gap: theme.gap.md,
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
              {form.video.uri ? (
                <Video
                  source={{ uri: form.video.uri }}
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
            {form.thumbnail.uri ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
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
        <View
          style={{
            position: "absolute",
            bottom: 70,
            width: "100%",
            alignItems: "center",
          }}
        >
          {alert && <AlertBox actionText={alert.type} desc={alert.message} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
