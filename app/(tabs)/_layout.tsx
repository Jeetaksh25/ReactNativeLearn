import { StyleSheet, Text, View, StatusBar } from "react-native";
import React, { useState, useEffect } from "react";
import { Tabs, Redirect, Stack } from "expo-router";
import AntDesign from "react-native-vector-icons/AntDesign";

const TabsLayout = () => {

  return (
    <>
      <Stack.Screen name="tabs" options={{headerShown: false}} />
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "#161622",
            height: 60,
            paddingTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <AntDesign
                name="home"
                color={color}
                size={focused ? 25 : 20}
                style={{ margin: 0 }}
                key="home"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="bookmark"
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <AntDesign
                name="staro"
                color={color}
                size={focused ? 25 : 20}
                style={{ margin: 0 }}
                key="bookmark"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <AntDesign
                name="plus"
                color={color}
                size={focused ? 25 : 20}
                style={{ margin: 0 }}
                key="create"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <AntDesign
                name="user"
                color={color}
                size={focused ? 25 : 20}
                style={{ margin: 0 }}
                key="profile"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({});
