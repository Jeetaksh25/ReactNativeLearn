import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { black, gray } from "tailwindcss/colors";
import { theme } from "@/theme/theme";
import FormField from "@/comps/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons, images } from "@/constants";
import colors from "tailwindcss/colors";
import CustomButton from "@/comps/CustomButton";

const Create = () => {

  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    video: "",
    thumbnail: "",
    prompt: "",
  });

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
        }}
        style={{ width: "100%" }}
      >
        <Text
          style={{
            color: "white",
            fontSize: theme.fontSize["2xl"],
            marginBottom: 20,
            fontWeight: "bold",
          }}
        >
          Upload Video
        </Text>

        <View style={{ width: "100%", maxWidth: 400, gap: theme.gap.xl,marginBottom: 20 }}>
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
            <TouchableOpacity>
              {form.video ? (
                <Video source={{uri: form.video}} style={{width: "100%", height: 150, borderRadius: theme.borderRadius.xl}} useNativeControls resizeMode={ResizeMode.COVER} isLooping/>
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
                    minHeight: 150,
                    width: "100%",
                    backgroundColor: gray[800],

                  }}
                >
                  <View style={{borderStyle: "dashed",borderColor:colors.orange[500], borderWidth: 2,padding: 10}}>
                  <Image source={icons.upload} style={{ width: 30, height: 30, resizeMode: "contain" }}/>
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
          <TouchableOpacity>
              {form.thumbnail ? (
                <Image source={{uri: form.video}} style={{width: "100%", height: 150, borderRadius: theme.borderRadius.xl, resizeMode: "cover"}} />
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
                  <Image source={icons.upload} style={{ width: 30, height: 30, resizeMode: "contain" }}/>
                  <Text style={{color: "white", fontSize: theme.fontSize.md}}>Choose A file</Text>
                </View>
              )}
            </TouchableOpacity>

          <FormField
            title="AI Prompt"
            value={form.prompt}
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
            placeholder="The Prompt you used to create the video"
          />
        </View>

        <CustomButton  title="Submit & Publish" isLoading={uploading}/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
