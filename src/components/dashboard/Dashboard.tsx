import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

export default function Dashboard ({ route }: any) {
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const [users, setUsers] = useState<any>([])
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userSnapshot = await firestore().collection('users').get()
        const usersData = userSnapshot?.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setUsers(usersData)
      } catch (error) {
        console.log('error in fetching users:', error)
      }
    }

    const fetchUserName = async () => {
      try {
        const currentUser = auth().currentUser
        if (currentUser) {
          const userDocument = await firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get()
          setUserName(userDocument.data()?.displayName || '')
          console.log('userDocument', userDocument)
        }
      } catch (error) {
        console.log("error in fetching user's name:", error)
      }
    }

    if (isFocused) {
      fetchUsers()
      fetchUserName()
    }

    return () => {}
  }, [isFocused])

  const navigateToChat = (userId: any, userName: string) => {
    navigation.navigate('chatScreen', {
      userId,
      userName
    })
  }

  const handleLogout = async () => {
    try {
      await auth().signOut()
      navigation.navigate('Login')
    } catch (error) {
      console.log('error logging out: ', error)
    }
  }
  return (
    <View className='flex-1 bg-white relative'>
      <View className='flex-1 bg-white absolute top-0 left-0 right-0 h-1/5'>
        <Text className='text-3xl text-bold m-2 mt-10 text-black'>Home</Text>
        <View className='flex-row justify-between items-center'>
          <Text className='text-black text-2xl m-2'>Welcome, {userName}!</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text className='text-2xl text-[#43A047] m-2 font-bold'>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className='flex-1 bg-[#ADD8E6] p-4 rounded-tr-3xl absolute top-[20%] left-0 right-0 bottom-0'>
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginBottom: 5, borderRadius: 5, overflow: 'hidden' }}
              onPress={() => navigateToChat(item.id, item.name)}
            >
              <LinearGradient
                style={{
                  padding: 15,
                  borderRadius: 30
                }}
                colors={['rgba(0,0,0,1)', 'rgba(128,128,128,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text className='text-xl font-bold text-white'>
                  {item.displayName}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  )
}
