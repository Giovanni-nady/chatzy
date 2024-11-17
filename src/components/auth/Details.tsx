import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  useWindowDimensions
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
  const { width}= useWindowDimensions()
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
      <View className='flex-1 absolute top-0 bottom-0 start-0 end-0 h-1/4 bg-white' />

      <View className='flex-1 absolute bg-[#ADD8E6] p-5 rounded-tl-full top-1/4 start-0 end-0 bottom-0  '>
        <Text className='font-bold text-3xl mt-36 mb-10'>
          Enter your details:
        </Text>

        <TextInput style={{ height: 50, borderWidth: 1, borderColor: "black", marginBottom: 30, paddingHorizontal: 10, borderRadius: 10 }}
          placeholder='Name'
          value={name}
          onChangeText={setName}
        />
        <DatePicker
          style={{height:80,width:width-40,marginBottom:30}}
          date={dob}
          onDateChange={setDob}
          mode="date"
        />
        <Picker style={{height:50,width:"100%",marginBottom:30}} selectedValue={gender} onValueChange={setGender}>
          <Picker.Item label="Male" value="Male"/>
          <Picker.Item label="Female" value="Female"/>
        </Picker>
        <TouchableOpacity className="bg-[#007bff] items-center p-2 rounded mb-5" onPress={saveDetails}>
          <Text className="text-white font-bold text-xl">
            Save Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
