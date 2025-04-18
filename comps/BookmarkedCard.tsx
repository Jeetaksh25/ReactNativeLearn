import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { theme } from "../theme/theme";
import colors, { gray, white } from "tailwindcss/colors";
import { icons } from "../constants";
import { Entypo } from "@expo/vector-icons";
import { PlayIcon } from "@/components/ui/icon";
import { Video, ResizeMode } from "expo-av";
import { downloadVideo } from "@/lib/appwrite";
import * as fD from "expo-file-system";
import { useGlobalContext } from "@/context/GlobalProvider";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";
import {
  checkBookmark,
  bookmarkVideo,
  removeBookmark,
  deletePost,
} from "@/lib/appwrite";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Animated, Easing } from "react-native";
import { router } from "expo-router";

interface Params {
  video: {
    title: string;
    thumbnail: string;
    video: string;
    creator: { username: string; avatar: string; $id: string };
    $id: string;
  };
}

const BookmarkedCard: React.FC<Params> = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar, $id },
    $id: videoId,
  },
}) => {
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const { user } = useGlobalContext();

  const [downloading, setDownloading] = useState(false);

  const videoUrl = video;
  const videoId2 = videoUrl.match(/files\/([^/]+)\/view/)?.[1] as string;

  const [isBookmarked, setIsBookmarked] = useState(false);

  const [Bookmarking, setBookmarking] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const save = (uri: string) => {
    shareAsync(uri);
  };

  const handleDownload = async (videoId2: string) => {
    try {
      setDownloading(true);
      const fileUrl = await downloadVideo(videoId2);

      const fileName = `video_${videoId2}.mp4`;

      const fileUri = FileSystem.documentDirectory + fileName;

      const downloadResult = await FileSystem.downloadAsync(
        fileUrl.toString(),
        fileUri
      );
      save(downloadResult.uri);
    } catch (error) {
      throw error;
    } finally {
      setDownloading(false);
      setMenuOpen(false);
    }
  };

  const handleBookmark = async () => {
    try {
      setBookmarking(true);
      if (await checkBookmark(user.$id, videoId)) {
        removeBookmark(user.$id, videoId);
        setIsBookmarked(false);
      } else {
        await bookmarkVideo(user.$id, videoId);
        setIsBookmarked(true);
      }
    } catch (error) {
      throw error;
    } finally {
      setBookmarking(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deletePost(user.$id, videoId);
    } catch (error) {
      throw error;
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (Bookmarking) {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.stopAnimation(() => {
        rotateAnim.setValue(0);
      });
    }
  }, [Bookmarking]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return ( 
      <View style={styles.CardC}>
        <View style={styles.cardRow}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: "/profile/[id]", params: { id: $id } })
              }
            >
              <Image
                source={{ uri: avatar }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: "/profile/[id]", params: { id: $id } })
            }
            style={styles.textContainer}
          >
            <View>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.username}>@{username}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBookmark} accessibilityRole="button">
            <Animated.View
              style={{
                transform: [{ rotate: Bookmarking ? rotation : "0deg" }],
              }}
            >
              <AntDesign
                name={isBookmarked ? "star" : Bookmarking ? "star" : "staro"}
                size={20}
                color={
                  isBookmarked ? "orange" : Bookmarking ? "lightblue" : "white"
                }
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleMenu}>
            <Entypo
              name="dots-three-vertical"
              style={{ color: "white", paddingRight: 2 }}
              size={20}
            />
          </TouchableOpacity>
        </View>
        {menuOpen && (
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleDownload(videoId2)}
            >
              <Text style={styles.menuText}>
                {downloading ? "Downloading..." : "Download"}
              </Text>
            </TouchableOpacity>
            {$id === user.$id && (
              <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                <Text style={styles.menuText}>
                  {deleting ? "Deleting..." : "Delete"}{" "}
                  <Feather name="trash-2" size={15} />
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {playing ? (
          <View>
            <Video
              source={{ uri: video }}
              style={styles.videoPlayer}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              shouldPlay
              onPlaybackStatusUpdate={(status) => {
                if (status && status.isLoaded && status.didJustFinish) {
                  setPlaying(false);
                }
              }}
            />
          </View>
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
  videoPlayer: {
    width: "100%",
    height: 200,
    borderRadius: theme.borderRadius.md,
    backgroundColor: "black",
    marginTop: 5,
  },
  menuContainer: {
    position: "absolute",
    top: 45,
    right: 30,
    backgroundColor: gray[700],
    padding: 8,
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
    gap: 5,
  },
  menuItem: {
    color: "white",
    fontSize: theme.fontSize.sm,
    backgroundColor: gray[900],
    paddingVertical: 2,
    paddingHorizontal: 3,
    borderRadius: 3,
  },
  menuText: {
    color: "white",
    fontSize: theme.fontSize.sm,
    textAlign: "center",
  },
});

export default BookmarkedCard;
