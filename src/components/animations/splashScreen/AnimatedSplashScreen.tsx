import { View, Text } from 'react-native'
import React, { useRef, useEffect } from 'react'
import LottieView from 'lottie-react-native'

export default function AnimatedSplashScreen () {
  const animation = useRef<LottieView>(null)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LottieView
        ref={animation}
        autoPlay
        loop={false} // Set loop to false to let it play once
        onAnimationFinish={() => {
          // Optional: Hide splash animation when done
        }}
        style={{
          height: 200,
          width: '80%',
          maxWidth: 400,
          backgroundColor: '#eee'
        }}
        source={require('@assets/lottie/splash.json')} // Confirm this path is correct
      />
    </View>
  )
}
