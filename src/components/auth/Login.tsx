import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  Button
} from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { useTheme } from '@/context/ThemeContext'
import { Switch } from 'react-native-gesture-handler'

export default function Login () {
  const navigation = useNavigation()
  const { colors, toggleTheme, theme } = useTheme()
  console.log(colors)

  const [phoneNumber, setPhoneNumber] = useState('')
  const [code, setCode] = useState<any>('')
  const [confirmation, setConfirmation] = useState<any>(null)

  const signInWithPhoneNumber = async () => {
    try {
      // const phoneRegex = /^\+\d{1,4} \d{1,15}$/
      const phoneRegex = /$/
      if (!phoneRegex.test(phoneNumber)) {
        Alert.alert(
          'Invalid phone number format. Please enter a valid phone number.'
        )
        return
      }
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber)
      setConfirmation(confirmation)
      console.log(JSON.stringify(confirmation, null, 2))
    } catch (error) {
      Alert.alert('Error sending code. Please try again later.')
      console.log('Error sending code: ', error)
    }
  }

  const confirmCode = async () => {
    try {
      if (!code || code.length < 6) {
        Alert.alert('Invalid code. Please enter 6-digit code.')
        return
      }

      if (!confirmation) {
        Alert.alert('No confirmation available. Please request a code again.')
        return
      }

      const userCredentials = await confirmation.confirm(code)
      const user = userCredentials.user

      // check if the user is new or existing
      const userDocument = await firestore()
        .collection('users')
        .doc(user.uid)
        .get()
      
        console.log(userDocument);
        
      if (userDocument && userDocument.exists) {
        // user is existing navigate to dashboard
        navigation.navigate('Dashboard')
      } else {
        
        navigation.navigate('Details', { uid: user.uid })
      }
    } catch (error) {
      alert('Invalid code. Please enter the correct code.')
      console.log('Invalid code: ', error)
    }
  }

  const SWITCH_TRACK_COLOR = {
    true: 'rgba(191, 181, 0, 0.6)',
    false: 'rgba(0, 0, 0, 0.5)'
  }

  return (
    <View
      style={{ backgroundColor: colors.primary }}
      className={`w-full h-full relative`}
    >
      <View className='w-full absolute top-0 start-0 end-0 h-1/4' />
      <View style={{ marginTop: 50, marginEnd: 16 }}>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={SWITCH_TRACK_COLOR}
          thumbColor={'gold'}
        />
      </View>

      <View
        style={{ backgroundColor: colors.secondary }}
        className='w-full  absolute top-1/4 bottom-0 p-5 rounded-t-[50px]'
      >
        <Text
          className='mt-5 mb-10 text-center'
          style={{
            fontSize: 32,
            color: colors.primaryText,
            fontFamily: 'Jakarta-Bold'
          }}
        >
          ChatZy
        </Text>
        <View className='justify-center items-center mb-8'>
          <Image
            source={require('./../../../assets/icon.png')}
            className='w-[150px] h-[150px]'
          />
        </View>
        {!confirmation ? (
          <>
            <Text
              style={{ color: colors.disabledText }}
              className='text-lg mb-5'
            >
              Enter your phone number with country code:
            </Text>
            <TextInput
              style={{
                height: 50,
                borderWidth: 1,
                marginBottom: 30,
                paddingHorizontal: 10,
                borderRadius: 10,
                borderColor: colors.borderBlackToWhite,
                color: colors.borderBlackToWhite
              }}
              placeholder='e.g.,  +2 0122-790-1024'
              placeholderTextColor={colors.placeholderBlackToWhite}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType='number-pad'
            />
            <TouchableOpacity
              onPress={signInWithPhoneNumber}
              style={{
                backgroundColor: '#4ECDC4',
                padding: 10,
                marginBottom: 20,
                borderRadius: 5,
                alignItems: 'center'
              }}
            >
              <Text className='text-white text-xl font-bold'>
                Verify Phone Number
              </Text>
            </TouchableOpacity>
            {/* <Button
              title={`current theme ${theme}`}
              onPress={toggleTheme}
              color={colors.primary}
            /> */}
          </>
        ) : (
          <>
            <Text style={{ color: '#808080', marginBottom: 20, fontSize: 18 }}>
              Enter the code sent to your phone:
            </Text>
            <TextInput
              style={{
                height: 50,
                borderWidth: 1,
                marginBottom: 30,
                paddingHorizontal: 10,
                borderRadius: 10
              }}
              placeholder='Enter code'
              value={code}
              onChangeText={setCode}
              keyboardType='number-pad'
            />

            <TouchableOpacity
              onPress={confirmCode}
              style={{
                backgroundColor: '#4ECDC4',
                padding: 10,
                marginBottom: 20,
                borderRadius: 5,
                alignItems: 'center'
              }}
            >
              <Text className='text-white text-xl font-bold'>Confirm Code</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}
