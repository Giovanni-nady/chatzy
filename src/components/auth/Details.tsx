import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import DatePicker from 'react-native-date-picker'
import firestore from '@react-native-firebase/firestore'
import { Picker } from '@react-native-picker/picker'
import { Colors } from '@/constants/colors'
import { useTheme } from '@/context/ThemeContext'

export default function Details({ route, navigation }: any) {
    const { colors, toggleTheme, theme } = useTheme()
  const [uid] = route.params
  const [name, setName] = useState('')
  const [gender, setGender] = useState('Male')
  const [dob, setDob] = useState(new Date())

  const saveDetails = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(uid)
        .set({
          name,
          dob: dob.toISOString().slice(0, 10),
          gender,
          displayName: name
        })

      navigation.navigate('Dashboard')
    } catch (error) {
      console.log('Error saving details: ', error)
    }
  }

  return (
    <View className={`flex-1 relative bg-[${colors.primary}]`}>
      <Text>Details</Text>
    </View>
  )
}
