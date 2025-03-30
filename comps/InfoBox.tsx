import { View, Text, } from 'react-native'
import React, { useState, useEffect,FC } from 'react'
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { white } from 'tailwindcss/colors';
import { theme } from '@/theme/theme';


interface IInfoBoxProps {
    title: string,
    subtitle?: string,
    containerStyles?: StyleProp<ViewStyle>;
    titleStyles?: StyleProp<TextStyle>;
}
const InfoBox: FC<IInfoBoxProps> = ({title, subtitle, containerStyles, titleStyles}) => {
  return (
    <View style={[{alignItems: 'center'},containerStyles]}>
        <Text style={[{color: white,textAlign:"center"}, titleStyles]}>{title}</Text>
        <Text style={{color: white,textAlign:"center",fontSize: theme.fontSize.sm}}>{subtitle}</Text>
    </View>
  )
}

export default InfoBox