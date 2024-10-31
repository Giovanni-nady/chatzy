import './global.css'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LottieView from 'lottie-react-native'
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Login from '@screens/auth/Login'
import { ThemeProvider } from './context/ThemeContext'

// Prevent the splash screen from auto-hiding until resources are ready
SplashScreen.preventAutoHideAsync()

export default function App () {
  const [appIsReady, setAppIsReady] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)

  useEffect(() => {
    async function prepare () {
      try {
        // Load fonts and other resources
        await Font.loadAsync({
          'Montserrat-ExtraBold': require('./assets/fonts/Montserrat-ExtraBold.ttf'),
          'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
          'Jakarta-Bold': require('./assets/fonts/jakarta/PlusJakartaSans-Bold.ttf')
          // Load any custom fonts here
          // 'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
          // 'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf')
        })
      } catch (e) {
        console.warn(e)
      } finally {
        // Hide the splash screen and mark app as ready
        await SplashScreen.hideAsync()
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const handleAnimationFinish = () => {
    // Only show main content if fonts are loaded and animation is done
    setAnimationDone(true)
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {!appIsReady || !animationDone ? (
          <View style={styles.container}>
            <LottieView
              autoPlay
              loop={false}
              onAnimationFinish={handleAnimationFinish}
              style={styles.lottie}
              source={require('@assets/lottie/splash.json')} // Ensure this path is correct
            />
          </View>
        ) : (
          <View className='flex-1 justify-center items-center'>
            <Login />
          </View>
        )}
      </GestureHandlerRootView>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee'
  },
  lottie: {
    height: 250,
    width: '80%',
    maxWidth: 400
  }
})
