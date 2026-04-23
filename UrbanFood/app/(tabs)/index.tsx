import { View, Text } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'
import ParallaxScrollView from '@/components/parallax-scroll-view'

const home = () => {
  return (
    <ParallaxScrollView>
      <ThemedView>
      <ThemedText>home</ThemedText>
    </ThemedView>
    </ParallaxScrollView>
    
  )
}

export default home