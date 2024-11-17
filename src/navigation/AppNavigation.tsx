import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import auth from '@react-native-firebase/auth'
import Login from '@screens/auth/Login'
import Details from '@screens/auth/Details'
import Dashboard from '@screens/dashboard/Dashboard'
import ChatScreen from '@screens/chat/ChatScreen'

const Stack = createNativeStackNavigator()

export default function AppNavigation () {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState<any>()

  const onAuthStateChanged = (result: any) => {
    console.log(result);
    
    setUser(result)
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    
    return subscriber;
  }, [])

  if (initializing) return null;

  return (
    <Stack.Navigator initialRouteName={user ? 'Dashboard' : 'Login'}>
      <Stack.Screen
        options={{ headerShown: false }}
        name='Login'
        component={Login}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name='Details'
        component={Details}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name='Dashboard'
        component={Dashboard}
      />
      <Stack.Screen name='chatScreen' component={ChatScreen} />
    </Stack.Navigator>
  )
}
