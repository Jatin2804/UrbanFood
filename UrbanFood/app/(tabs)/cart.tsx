import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'

export class cart extends Component {
  render() {
    return (
      <ThemedView>
        <ThemedText>cart</ThemedText>
      </ThemedView>
    )
  }
}

export default cart