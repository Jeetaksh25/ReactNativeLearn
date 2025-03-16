import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { images } from '../constants'
import {theme} from '../theme/theme'
import CustomButton from '../comps/CustomButton'
import { router } from 'expo-router'

interface Props {
    title: string;
    subtitle?: string;
}

const EmptyState: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <View style={styles.container} className='h-max'>
      <Image source={images.empty} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <CustomButton title='Create Video' handlePress={() => router.push('/create')} containerStyles={{ marginTop: 20, width: '100%',boxSizing: 'border-box' }}></CustomButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.padding.lg,
    gap: theme.gap.md,
  },
  image: {
    alignSelf: 'center',
    width: 270,
    height: 215,
  },
  title: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    fontSize: theme.fontSize.md,
  },
});

export default EmptyState;
