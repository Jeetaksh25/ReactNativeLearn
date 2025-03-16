import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  ViewToken,
} from "react-native";
import React, { useState, useRef } from "react";
import * as Animatable from "react-native-animatable";
import { theme } from "../theme/theme";
import { icons } from "../constants";
import {Video,ResizeMode} from "expo-av";

const zoomIn = {
  0: { transform: [{ scale: 0.8 }] },
  1: { transform: [{ scale: 1 }] },
};

const zoomOut = {
  0: { transform: [{ scale: 1 }] },
  1: { transform: [{ scale: 0.8 }] },
};

interface TrendingItemProps {
  isActive: boolean;
  item: any;
}

const TrendingItem: React.FC<TrendingItemProps> = ({ isActive, item }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <Animatable.View animation={isActive ? zoomIn : zoomOut} duration={500}>
      {playing ? (
        <Video source={{uri:"https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"}} style={{width: 150, height: 250, borderRadius: theme.borderRadius.xl,backgroundColor: "black", marginTop: 5}} resizeMode={ResizeMode.CONTAIN} useNativeControls shouldPlay onPlaybackStatusUpdate={(status) => {
          if (status && status.isLoaded && status.didJustFinish) {
            setPlaying(false);
          }
        }}/>
      ) : (
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center" }}
          activeOpacity={0.7}
          onPress={() => setPlaying(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            style={{
              width: 150,
              height: 250,
              borderRadius: theme.borderRadius.xl,
              overflow: "hidden",
            }}
          />
          <Image
            source={icons.play}
            style={{
              position: "absolute",
              width: 50,
              height: 50,
              top: "50%",
              left: "50%",
              transform: [{ translateX: -25 }, { translateY: -25 }],
            }}
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

interface Props {
  posts: any[];
}

const Trending: React.FC<Props> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 70 };
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveItem(viewableItems[0].item.$id);
      }
    }
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem item={item} isActive={item.$id === activeItem} />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToAlignment="center"
      pagingEnabled={true}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged.current}
    />
  );
};

export default Trending;
