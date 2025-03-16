import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { theme } from "../theme/theme";
import colors from "tailwindcss/colors";
import { icons } from "../constants";
import { Entypo } from "@expo/vector-icons";
import { PlayIcon } from "@/components/ui/icon";
import { Video, ResizeMode } from "expo-av";

interface Params {
  video: {
    title: string;
    thumbnail: string;
    video: string;
    creator: { username: string; avatar: string };
  };
}

const VideoCard: React.FC<Params> = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}) => {
  const [playing, setPlaying] = useState(false);

  return (
    <View style={styles.CardC}>
      <View style={styles.cardRow}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.username}>@{username}</Text>
        </View>
        <Entypo
          name="dots-three-vertical"
          style={{ color: "white" }}
          size={20}
        />
      </View>
      {playing ? (
        <Video
          source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: theme.borderRadius.md,
            backgroundColor: "black",
            marginTop: 5,
          }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status && status.isLoaded && status.didJustFinish) {
              setPlaying(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          style={styles.thumbnailContainer}
          activeOpacity={0.7}
          onPress={() => setPlaying(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <Image source={icons.play} style={styles.playIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  CardC: {
    width: "100%",
    paddingHorizontal: theme.padding.lg,
    marginVertical: theme.margin.lg,
    gap: theme.gap.xs,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 5,
  },
  avatarContainer: {
    width: 46,
    height: 46,
    borderRadius: 46 / 2,
    borderWidth: 2,
    borderColor: colors.orange[500],
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: theme.fontSize.sm,
    fontWeight: "bold",
  },
  username: {
    color: colors.gray[400],
    fontFamily: "Poppins-Regular",
    fontSize: theme.fontSize.xs,
  },
  thumbnailContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  playIcon: {
    position: "absolute",
    width: 50,
    height: 50,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default VideoCard;
