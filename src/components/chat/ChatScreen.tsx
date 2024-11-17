import { View, Text, Platform, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { LinearGradient } from 'expo-linear-gradient'
import { formatDate } from '@/src/utils/helpers'

export default function ChatScreen ({ route }: any) {
  const navigation = useNavigation()
  const { userId, userName } = route.params || {}
  const [messages, setMessages] = useState([])
  const userData: any = auth().currentUser

  useEffect(() => {
    const chatId = [userData?.uid, userId].sort().join('_')
    const chatReference = firestore().collection('chats').doc(chatId)

    const unsubscribe = chatReference.onSnapshot(snapshot => {
      if (snapshot.exists) {
        const chatData: any = snapshot.data()
        setMessages(chatData.messages)
      }
    })

    return () => unsubscribe()
  }, [userId, userData.uid])

  const onSend = async (newMessages = []) => {
    const chatId = [userData?.uid, userId].sort().join('_')
    const chatReference = firestore().collection('chats').doc(chatId)

    const formattedMessages = newMessages.map((messages: any) => ({
      ...messages,
      createdAt: new Date(messages.createdAt)
    }))

    try {
      await chatReference.set(
        { messages: GiftedChat.append(messages, formattedMessages) },
        { merge: true }
      )
    } catch (error) {
      console.log('error updating messages: ', error)
    }
  }

  const renderBubble = (props: any) => {
    const { currentMessage } = props
    const isReceived = currentMessage.user._id !== userData.id

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#4cAf50'
          },
          left: {
            backgroundColor: '#2196f3',
            marginLeft: isReceived ? 0 : 10
          }
        }}
        containerStyle={{
          left: {
            marginLeft: isReceived ? -40 : 0
          }
        }}
      />
    )
  }

  const renderFooter = () => <View style={{ height: 20 }} />

  return (
    <LinearGradient style={{ flex: 1 }} colors={['#000', '#fff']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
    >
      <GiftedChat
        messages={messages}
        onSend={(newMessages: any) => onSend(newMessages)}
        user={{ _id: userData.uid, name: userData.displayName }}
        renderTime={props => (
          <View className=''>
            <Text
              style={{ color: props.position === 'left' ? 'black' : 'white' }}
              className='mx-3 mb-1 text-xs'
            >{props.currentMessage.createdAt instanceof Date ?
                props.currentMessage.createdAt.toLocaleString('en-US', {
                  hour: "numeric",
                  minute: "numeric",
                  hour12:true
                }):formatDate(props.currentMessage.createdAt)
            }</Text>
          </View>
        )}
        renderDay={() => null}
        renderBubble={renderBubble}
        renderChatFooter={renderFooter}
        placeholder='Type a message ...'
        textInputProps={{ color: "white" }}
        renderUsernameOnMessage
        containerStyle={{
          backgroundColor: "black",
          padding: 5,
          height: 70,
          multiline: true
        }}
      />
      {Platform.OS === "android" &&<KeyboardAvoidingView behavior='padding'/>}
    </LinearGradient>
  )
}
